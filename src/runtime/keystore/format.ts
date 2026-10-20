/**
 * The key store's one file format (0008 §7.1), Node built-ins only.
 *
 * File: a 40-byte header, then AES-256-GCM ciphertext, then the 16-byte tag. The whole header is the AAD.
 *   0  "GCXK"   4  version 1   5  KDF 1 = Argon2id   6  memory KiB (u32 BE)   10 passes   11 parallelism
 *   12 salt (16 bytes)          28 nonce (12 bytes, fresh random on every write)
 * The AES key is Argon2id(secret, salt), 32 bytes. KDF parameters outside the bounds below are refused before any
 * derivation (at most 256 MiB, 4 passes, 4 lanes), so a damaged header can never ask for more.
 *
 * Plaintext: u16 count, then per source: u8 id length, id (UTF-8), u8 flags (1 = a pending rotation key follows;
 * 2 was the same-key hold of builds before 0024 amendment 3: read and ignored, never written), the 32-byte key, the 32-byte
 * pending key if flagged. Binary, so a key is never a string.
 *
 * Writes are atomic (`writeAtomic`, src/runtime/fs/atomic.ts): temp file (mode 600), fsync, read back and decrypt, rename, fsync the directory. The previous file
 * stays in place until the new one has been read back.
 */
import { argon2, createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { rmSync } from "node:fs";
import { join } from "node:path";

export const KEYSTORE_FILE = "keystore.enc";
/** Source id → agent address, plain JSON: the address is public, and a locked store must still answer it. */
export const ADDRESSES_FILE = "keystore.addresses.json";
/**
 * The data folder's one marker, written last by `gcx export` (0024 d8.1): this folder never signs again by itself, and
 * `gcx run` does not start on it. Its name is fixed for good (0024 §3).
 */
export const MOVED_FILE = "moved";
/** The marker before 0024 (`exportTo` wrote it); no released build wrote it, still honoured when found (0024 §3). */
export const OLD_MOVED_FILE = "keystore.moved";

/**
 * A moved folder's keys gone (0024 amendment 3 d1): the key file and its side file deleted, so no file of the folder holds a
 * key. Needs no unlock source, so the next start finishes what a cut export left (`resumeMoved`). Called only on a marked folder.
 */
export function removeKeyFiles(dir: string): void {
  rmSync(join(dir, KEYSTORE_FILE), { force: true });
  rmSync(join(dir, ADDRESSES_FILE), { force: true });
}

export type KeystoreErrorCode = "unavailable" | "bad-secret" | "damaged" | "exists" | "unknown-source" | "no-rotation";
/** Messages name the failure, never a secret, a key, or a tool's output. */
export class KeystoreError extends Error {
  constructor(readonly code: KeystoreErrorCode, message: string) {
    super(message);
    this.name = "KeystoreError";
  }
}

export interface Kdf { memory: number; passes: number; parallelism: number }
/** 64 MiB, 3 passes, p = 1: 181 ms on an M1 Pro (study §1.3); re-measured on the weakest NAS before release. */
export const KDF: Kdf = { memory: 65536, passes: 3, parallelism: 1 };
const MAGIC = Buffer.from("GCXK", "latin1");
const VERSION = 1;
const ARGON2ID = 1;
const HEADER = 40;
const TAG = 16;
const KEY = 32;

/** What seals a file: the derived AES key with the salt and parameters it came from. */
export interface Sealer { key: Buffer; kdf: Kdf; salt: Buffer }

/** Every seal and unseal derives here, so an empty secret is refused for create, unlock, export and import alike. */
const derive = (secret: Buffer, salt: Buffer, kdf: Kdf) =>
  new Promise<Buffer>((resolve, reject) => {
    if (secret.length === 0) { reject(new KeystoreError("bad-secret", "an empty secret is refused")); return; }
    argon2("argon2id", { message: secret, nonce: salt, tagLength: KEY, ...kdf }, (err, key) => {
      if (err) reject(new KeystoreError("damaged", "key derivation failed"));
      else resolve(key);
    });
  });

export async function newSealer(secret: Buffer): Promise<Sealer> {
  const salt = randomBytes(16);
  return { key: await derive(secret, salt, KDF), kdf: KDF, salt };
}

export function seal(s: Sealer, plaintext: Buffer): Buffer {
  const header = Buffer.alloc(HEADER);
  MAGIC.copy(header, 0);
  header[4] = VERSION;
  header[5] = ARGON2ID;
  header.writeUInt32BE(s.kdf.memory, 6);
  header[10] = s.kdf.passes;
  header[11] = s.kdf.parallelism;
  s.salt.copy(header, 12);
  randomBytes(12).copy(header, 28);
  const c = createCipheriv("aes-256-gcm", s.key, header.subarray(28, 40)).setAAD(header);
  return Buffer.concat([header, c.update(plaintext), c.final(), c.getAuthTag()]);
}

function parse(file: Buffer): { kdf: Kdf; salt: Buffer } {
  if (file.length < HEADER + TAG || !file.subarray(0, 4).equals(MAGIC)) throw new KeystoreError("damaged", "not a key store file");
  if (file[4] !== VERSION || file[5] !== ARGON2ID) throw new KeystoreError("damaged", "unknown key store version or KDF");
  const kdf = { memory: file.readUInt32BE(6), passes: file.readUInt8(10), parallelism: file.readUInt8(11) };
  // Only what this code would ever write: a hostile header must not cost a small NAS a gigabyte at every start.
  const ok = kdf.memory >= 8192 && kdf.memory <= 262144 && kdf.passes >= 1 && kdf.passes <= 4 && kdf.parallelism >= 1 && kdf.parallelism <= 4;
  if (!ok) throw new KeystoreError("damaged", "KDF parameters out of bounds");
  return { kdf, salt: Buffer.from(file.subarray(12, 28)) };
}

/** Decrypt with a known sealer (the read-back of a write). GCM's tag covers the header, the ciphertext and the key. */
export function reopen(s: Sealer, file: Buffer): Buffer {
  parse(file);
  const d = createDecipheriv("aes-256-gcm", s.key, file.subarray(28, 40)).setAAD(file.subarray(0, HEADER));
  d.setAuthTag(file.subarray(file.length - TAG));
  try {
    return Buffer.concat([d.update(file.subarray(HEADER, file.length - TAG)), d.final()]);
  } catch {
    throw new KeystoreError("bad-secret", "wrong secret, or the file was changed");
  }
}

export async function unseal(file: Buffer, secret: Buffer): Promise<{ sealer: Sealer; plaintext: Buffer }> {
  const { kdf, salt } = parse(file);
  const sealer = { key: await derive(secret, salt, kdf), kdf, salt };
  return { sealer, plaintext: reopen(sealer, file) };
}

export interface Entry { key: Buffer; pending: Buffer | null }

export function encodeEntries(entries: ReadonlyMap<string, Entry>): Buffer {
  const parts: Buffer[] = [Buffer.from([entries.size >> 8, entries.size & 255])];
  for (const [id, e] of entries) {
    const idBytes = Buffer.from(id, "utf8");
    if (idBytes.length === 0 || idBytes.length > 255) throw new KeystoreError("unknown-source", "a source id is 1 to 255 bytes");
    parts.push(Buffer.from([idBytes.length]), idBytes, Buffer.from([e.pending ? 1 : 0]), e.key);
    if (e.pending) parts.push(e.pending);
  }
  return Buffer.concat(parts);
}

/** Keys are copied into their own Buffers, so the caller can zero the plaintext. */
export function decodeEntries(b: Buffer): Map<string, Entry> {
  const out = new Map<string, Entry>();
  const take = (at: number, n: number) => {
    if (at + n > b.length) throw new KeystoreError("damaged", "key store contents are truncated");
    return b.subarray(at, at + n);
  };
  const count = take(0, 2).readUInt16BE(0);
  let at = 2;
  for (let i = 0; i < count; i++) {
    const n = take(at, 1).readUInt8(0);
    const id = take(at + 1, n).toString("utf8");
    const flags = take(at + 1 + n, 1).readUInt8(0);
    at += 2 + n;
    const key = Buffer.from(take(at, KEY));
    at += KEY;
    let pending: Buffer | null = null;
    if (flags & 1) { pending = Buffer.from(take(at, KEY)); at += KEY; }
    out.set(id, { key, pending });
  }
  return out;
}
