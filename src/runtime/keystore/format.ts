/**
 * The key store's one file format (0008 §7.1), Node built-ins only.
 *
 * File: a 40-byte header, then AES-256-GCM ciphertext, then the 16-byte tag. The whole header is the AAD.
 *   0  "GCXK"   4  version 1   5  KDF 1 = Argon2id   6  memory KiB (u32 BE)   10 passes   11 parallelism
 *   12 salt (16 bytes)          28 nonce (12 bytes, fresh random on every write)
 * The AES key is Argon2id(secret, salt), 32 bytes. KDF parameters outside the bounds below are refused before any
 * derivation (at most 256 MiB, 4 passes, 4 lanes), so a damaged header can never ask for more.
 *
 * Plaintext: u16 count, then per entry: u8 id length, id (UTF-8), u8 flags (1 = a pending rotation key follows;
 * 2 was the same-key hold of builds before 0024 amendment 3: read and ignored, never written; 4 = an access key's value, its id
 * the key's id, never an agent: MH 3.1.1 item 25), the 32 bytes, the 32-byte pending key if flagged. Binary, so a key is never a string.
 *
 * Writes are atomic (`writeAtomic`, src/runtime/fs/atomic.ts): temp file (mode 600), fsync, read back and decrypt, rename, fsync the directory. The previous file
 * stays in place until the new one has been read back.
 *
 * **The second file** (0008 amendment 4; 0037 §11 d3): a key venue's private keys do not fit the first file's fixed 32 bytes,
 * and a new version of the first file would read as damaged to every older build, which then could not sign for Hyperliquid
 * either. So they live in `keystore.cex.enc`: the same header, version, KDF and unlock source; since 0037 B2 a written second file
 * carries the first file's salt (and so its derived key) with a fresh nonce at every write, and an import's keeps its own salt until
 * the first write (the header carries it either way, so a reader derives as before); its
 * plaintext a u16 count, then per entry a u8 id length, the id, a u8 kind (1 HMAC, 2 RSA, 3 Ed25519), a u16 length and the
 * private bytes. A missing second file is an empty set. The API keys sit in `keystore.cex.keys.json`, outside the sealed
 * file so a locked store still opens the futures streams, and private, mode 600: the key alone reads the account's futures
 * streams (0037 §3 d3). A build before B0 opens neither.
 */
import { argon2, createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { rmSync } from "node:fs";
import { join } from "node:path";

export const KEYSTORE_FILE = "keystore.enc";
/** The second file (0008 amendment 4): a key venue's private keys. */
export const CEX_FILE = "keystore.cex.enc";
/** Each key venue key's API key by its id in the key store, plain JSON, private, mode 600 (0037 §3 d3). */
export const CEX_KEYS_FILE = "keystore.cex.keys.json";
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
  for (const f of [KEYSTORE_FILE, ADDRESSES_FILE, CEX_FILE, CEX_KEYS_FILE]) rmSync(join(dir, f), { force: true });
}

export type KeystoreErrorCode = "unavailable" | "bad-secret" | "damaged" | "cex-unreadable" | "exists" | "unknown-source" | "no-rotation";
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
/** The flag of an access key's value (MH 3.1.1 item 25): read into `access`, never into the agents. */
const ACCESS = 4;
/** An access key's value is its 32 random bytes (auth.ts `secret`); any other length would misalign every entry after it. */
export const ACCESS_BYTES = KEY;

export function encodeEntries(entries: ReadonlyMap<string, Entry>, access: ReadonlyMap<string, Buffer> = new Map()): Buffer {
  const parts: Buffer[] = [Buffer.from([(entries.size + access.size) >> 8, (entries.size + access.size) & 255])];
  const id = (s: string) => {
    const idBytes = Buffer.from(s, "utf8");
    if (idBytes.length === 0 || idBytes.length > 255) throw new KeystoreError("unknown-source", "a source id is 1 to 255 bytes");
    return [Buffer.from([idBytes.length]), idBytes];
  };
  for (const [sourceId, e] of entries) {
    parts.push(...id(sourceId), Buffer.from([e.pending ? 1 : 0]), e.key);
    if (e.pending) parts.push(e.pending);
  }
  for (const [keyId, value] of access) parts.push(...id(keyId), Buffer.from([ACCESS]), value);
  return Buffer.concat(parts);
}

/** Keys are copied into their own Buffers, so the caller can zero the plaintext. */
export function decodeEntries(b: Buffer): { entries: Map<string, Entry>; access: Map<string, Buffer> } {
  const out = new Map<string, Entry>(), access = new Map<string, Buffer>();
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
    if (flags & ACCESS) { access.set(id, key); continue; }
    let pending: Buffer | null = null;
    if (flags & 1) { pending = Buffer.from(take(at, KEY)); at += KEY; }
    out.set(id, { key, pending });
  }
  return { entries: out, access };
}

/** A key venue's private key in the second file, by its kind. */
export interface CexEntry { kind: "hmac" | "rsa" | "ed25519"; key: Buffer }
const CEX_KINDS = ["hmac", "rsa", "ed25519"] as const;

export function encodeCex(entries: ReadonlyMap<string, CexEntry>): Buffer {
  const parts: Buffer[] = [Buffer.from([entries.size >> 8, entries.size & 255])];
  for (const [id, e] of entries) {
    const idBytes = Buffer.from(id, "utf8");
    if (idBytes.length === 0 || idBytes.length > 255) throw new KeystoreError("unknown-source", "a key id is 1 to 255 bytes");
    if (e.key.length > 65535) throw new KeystoreError("damaged", "a key is at most 65535 bytes");
    parts.push(Buffer.from([idBytes.length]), idBytes, Buffer.from([CEX_KINDS.indexOf(e.kind) + 1, e.key.length >> 8, e.key.length & 255]), e.key);
  }
  return Buffer.concat(parts);
}

/** Keys are copied into their own Buffers, so the caller can zero the plaintext. A kind this build does not know is damage. */
export function decodeCex(b: Buffer): Map<string, CexEntry> {
  const out = new Map<string, CexEntry>();
  const take = (at: number, n: number) => {
    if (at + n > b.length) throw new KeystoreError("damaged", "the second key file's contents are truncated");
    return b.subarray(at, at + n);
  };
  const count = take(0, 2).readUInt16BE(0);
  let at = 2;
  for (let i = 0; i < count; i++) {
    const n = take(at, 1).readUInt8(0), id = take(at + 1, n).toString("utf8");
    at += 1 + n;
    const kind = CEX_KINDS[take(at, 1).readUInt8(0) - 1], len = take(at + 1, 2).readUInt16BE(0);
    if (kind === undefined) throw new KeystoreError("damaged", "an unknown key kind in the second key file");
    out.set(id, { kind, key: Buffer.from(take(at + 3, len)) });
    at += 3 + len;
  }
  return out;
}
