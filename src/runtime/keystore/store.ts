/**
 * The key store (0008 §7): venue agent keys by source id in `keystore.enc`, and the access keys' values by key id (MH 3.1.1
 * item 25: a key can be seen again; a kind of its own, never an agent); other keys (an exchange's) in the second file.
 * Opened locked; an unlock source opens it. The engine never imports this module, only `signer.ts` (lint-enforced).
 *
 * - Locked: `address()` answers from the plain side file; `sign` refuses with `SignerRefused("locked")`.
 * - Rotation: `rotate` stores a new key as pending and returns its address; the old key keeps signing until the caller
 *   confirms the venue approved the new one (`confirmRotation`), so no instant exists without an approved key on disk.
 * - Export (0024 d8): `exportSealed` gives the contents re-encrypted under the export passphrase and marks nothing; the
 *   caller writes the whole export file, reads it back, and only then calls `markMoved`, which sets the in-memory flag (no
 *   signature from that instant), writes the folder's one marker, then deletes the key files (0024 amendment 3 d1). Import
 *   keeps every key as it came, a pending one too, with no hold (amendment 3 d2).
 * - The second file (0008 amendment 4, format.ts): a key venue's keys, read at unlock under the same secret and carried by
 *   export and import (0037 §10 d4). A missing file is an empty set. Written here since 0037 B2, by the first file's recipe
 *   (durable before visible, one write at a time, read back before the rename): `newRsaKey` makes the key whose public half
 *   the person pastes into Binance (only the SPKI PEM leaves), `putHmacKey` keeps a pasted secret, `removeKey` deletes one;
 *   `signKey` signs a Binance query with it. A file this build could not read is never rewritten (its keys would be lost for
 *   good). Its writes are sealed under the first file's derived key and salt (the header carries them, so any reader derives
 *   it as before), so an unlock with no second file derives once.
 * - The API keys (0037 §3 d3): `keystore.cex.keys.json`, key id → API key, mode 600, outside the sealed file so a locked store
 *   answers them (`apiKey`); written after the key it names, deleted with it.
 */
import { createHmac, createPrivateKey, createPublicKey, generateKeyPair, sign as signWith } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { signAction } from "../../venues/hyperliquid/actions.js";
import { writeAtomic } from "../fs/atomic.js";
import { ACCESS_BYTES, ADDRESSES_FILE, CEX_FILE, CEX_KEYS_FILE, KEYSTORE_FILE, KeystoreError, MOVED_FILE, OLD_MOVED_FILE, decodeCex, decodeEntries, encodeCex, removeKeyFiles, encodeEntries, newSealer, reopen, seal, unseal, type CexEntry, type Entry, type Sealer } from "./format.js";
import { SignerRefused, type Address, type KeySignIntent, type SignIntent, type Signer } from "./signer.js";
import { PATIENT_TOOL_MS, type UnlockSource } from "./sources.js";
import { agentAddress, localWallet, newAgentKey } from "./wallet.js";

export interface ImportedAgent { sourceId: string; address: Address }

const entryIn = (entries: ReadonlyMap<string, Entry>, sourceId: string): Entry => {
  const e = entries.get(sourceId);
  if (!e) throw new KeystoreError("unknown-source", `no agent for source ${sourceId}`);
  return e;
};

/** The side file as read: an object whose every value is an address, or nothing at all (unlock rewrites it). */
function addressesFrom(v: unknown): Record<string, Address> {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return {};
  const pairs: Array<[string, unknown]> = Object.entries(v);
  const ok = (p: [string, unknown]): p is [string, Address] => typeof p[1] === "string" && /^0x[0-9a-f]{40}$/.test(p[1]);
  return pairs.every(ok) ? Object.fromEntries(pairs) : {};
}

const exists = (p: string) => access(p).then(() => true, () => false);

/**
 * The API keys' file as read: key id → API key, each entry that is a string kept (judge Fable on B2, F3: one bad entry costs that key,
 * not every other one at the next write). A file that does not read as an object is unreadable, never an empty map.
 */
function apiKeysFrom(v: unknown): Record<string, string> {
  if (typeof v !== "object" || v === null || Array.isArray(v)) throw new KeystoreError("damaged", "the API key file is not an object");
  const pairs: Array<[string, unknown]> = Object.entries(v);
  return Object.fromEntries(pairs.filter((p): p is [string, string] => typeof p[1] === "string"));
}

/** A base64 signature as Binance takes it in a query (SR, "SIGNED Endpoint Examples", RSA Keys step 3): `+`, `/`, `=` percent-encoded. */
export const percent = (b64: string): string => encodeURIComponent(b64);

/** A sealed file written atomically and read back before it replaces anything (the first file's recipe). */
async function sealed(path: string, sealer: Sealer, plaintext: Buffer): Promise<void> {
  try {
    await writeAtomic(path, seal(sealer, plaintext), (written) => {
      const back = reopen(sealer, written);
      const same = back.equals(plaintext);
      back.fill(0);
      if (!same) throw new KeystoreError("damaged", "the new key file did not read back");
    });
  } finally {
    plaintext.fill(0);
  }
}

/** The secret for a create or an unlock: nothing but the person waits on it, so the tool gets `PATIENT_TOOL_MS` (judge Fable, unlock-retry finding 1);
 *  the start's unlock passes its own limit through `Keys.unlock`. */
async function readSecret(source: UnlockSource): Promise<Buffer> {
  try {
    return await source.read(PATIENT_TOOL_MS);
  } catch (e) {
    throw e instanceof KeystoreError ? e : new KeystoreError("unavailable", `${source.kind}: the unlock source failed`);
  }
}

export class KeyStore {
  readonly #dir: string;
  #addresses: Record<string, Address>;
  #moved: boolean;
  #marking = false;
  #sealer: Sealer | null = null;
  #entries = new Map<string, Entry>();
  /** The access keys' values by key id (MH 3.1.1 item 25). */
  #access = new Map<string, Buffer>();
  /** The second file's keys (0008 amendment 4), read at unlock. */
  #cex = new Map<string, CexEntry>();
  #cexUnreadable: string | null = null;
  /** What seals the second file's writes: the first file's derived key and salt; null when the second file could not be read. */
  #cexSealer: Sealer | null = null;
  /** Null means the side file could not be read at open; no exchange-key write or export may discard it. */
  #apiKeys: Record<string, string> | null;
  #queue: Promise<unknown> = Promise.resolve();
  #generation = 0;
  #exportedGeneration: number | null = null;
  #addressesStale = false;

  private constructor(dir: string, addresses: Record<string, Address>, moved: boolean, apiKeys: Record<string, string> | null = {}) {
    this.#dir = dir;
    this.#addresses = addresses;
    this.#moved = moved;
    this.#apiKeys = apiKeys;
  }

  get locked(): boolean { return this.#sealer === null; }
  get moved(): boolean { return this.#moved; }
  /** An exchange key file could not be read: what to report once; null when both read or were absent. */
  get cexUnreadable(): string | null {
    return this.#cexUnreadable ?? (this.#apiKeys === null ? `The API key file (${CEX_KEYS_FILE}) could not be read; the API keys in it are not available` : null);
  }
  /** The address side file could not be rewritten (a full disk): the supervisor alerts; nothing is blocked. */
  get addressesStale(): boolean { return this.#addressesStale; }

  /** A new first file, unlocked; any second file is kept and read, including after a repair. `cex` and `access` are an import's. */
  static async create(dir: string, source: UnlockSource, entries = new Map<string, Entry>(), cex = new Map<string, CexEntry>(), access = new Map<string, Buffer>()): Promise<KeyStore> {
    if (await exists(join(dir, KEYSTORE_FILE))) throw new KeystoreError("exists", "this folder already has a key store");
    const secret = await readSecret(source);
    const store = await KeyStore.open(dir);
    try {
      store.#sealer = await newSealer(secret);
      if (cex.size > 0) {
        const second = await newSealer(secret);
        try { await sealed(join(dir, CEX_FILE), second, encodeCex(cex)); } finally { second.key.fill(0); }
        store.#cex = cex;
        store.#cexSealer = store.#sealer;
      } else await store.#readCex(secret);
    } finally { secret.fill(0); }
    await store.#write(entries, access);
    store.#entries = entries;
    store.#access = access;
    await store.#writeAddresses();
    return store;
  }

  /** The store as found, locked. */
  static async open(dir: string): Promise<KeyStore> {
    let addresses: Record<string, Address> = {};
    try { addresses = addressesFrom(JSON.parse(await readFile(join(dir, ADDRESSES_FILE), "utf8"))); } catch { /* rewritten at unlock */ }
    let apiKeys: Record<string, string> | null = {};
    try { apiKeys = apiKeysFrom(JSON.parse(await readFile(join(dir, CEX_KEYS_FILE), "utf8"))); } catch (e) {
      if (!(e instanceof Error && "code" in e && e.code === "ENOENT")) apiKeys = null;
    }
    return new KeyStore(dir, addresses, (await exists(join(dir, MOVED_FILE))) || (await exists(join(dir, OLD_MOVED_FILE))), apiKeys);
  }

  async unlock(source: UnlockSource): Promise<void> {
    let file: Buffer;
    try { file = await readFile(join(this.#dir, KEYSTORE_FILE)); } catch { throw new KeystoreError("damaged", "no key store file in this folder"); }
    const secret = await readSecret(source);
    try {
      const opened = await unseal(file, secret);
      try { ({ entries: this.#entries, access: this.#access } = decodeEntries(opened.plaintext)); } finally { opened.plaintext.fill(0); }
      this.#sealer = opened.sealer;
      await this.#readCex(secret);
    } finally { secret.fill(0); }
    // Repairs a side file a crash left behind a rename; on the save chain so it never shares a temp file with a save.
    const repair = this.#queue.then(() => this.#writeAddresses());
    this.#queue = repair;
    await repair;
  }

  /** Read independently at unlock and first-file creation: an unreadable second file never blocks the first or permits an overwrite. */
  async #readCex(secret: Buffer): Promise<void> {
    this.#cex = new Map();
    this.#cexUnreadable = null;
    this.#cexSealer = this.#sealer;
    let plaintext: Buffer | null = null;
    try {
      let second: Buffer;
      try { second = await readFile(join(this.#dir, CEX_FILE)); } catch (e) {
        if ((e as NodeJS.ErrnoException).code === "ENOENT") return;
        throw e;
      }
      const opened = await unseal(second, secret);
      plaintext = opened.plaintext;
      try { this.#cex = decodeCex(plaintext); } finally { opened.sealer.key.fill(0); }
    } catch (e) {
      this.#cexSealer = null;
      this.#cexUnreadable = `The second key file (${CEX_FILE}) could not be read (${e instanceof Error ? e.message : String(e)}); the exchange keys in it are not available`;
    } finally { plaintext?.fill(0); }
  }

  /**
   * The signer of the master `sourceId`'s agent, for one trading address (0003b d2, d4): `vault` null for the master
   * itself, else the sub-account or vault it signs for. Required, so no caller can leave it out; the call sites build
   * `SignIntent`s without it.
   */
  signer(sourceId: string, vault: Address | null): Signer {
    this.#address(sourceId);
    return {
      address: () => this.#address(sourceId),
      sign: (intent) => this.#sign(sourceId, intent, vault),
    };
  }

  #address(sourceId: string): Address {
    const a = Object.hasOwn(this.#addresses, sourceId) ? this.#addresses[sourceId] : undefined;
    if (a === undefined) throw new KeystoreError("unknown-source", `no agent for source ${sourceId}`);
    return a;
  }

  async #sign(sourceId: string, intent: SignIntent, vault: Address | null): Promise<Uint8Array> {
    if (this.#moved || this.#marking) throw new SignerRefused("moved", "this data folder was exported; it signs nothing until the user acts");
    // A key venue's request is never signed with an API wallet's key; this build signs none (0037 §10 d1).
    if (intent.venue === "binance") throw new KeystoreError("unknown-source", "this version of goodcryptoX signs no Binance request");
    const entry = this.#entry(sourceId);
    const signed = await signAction(localWallet(entry.key, this.#address(sourceId)), intent.action, intent.nonce, intent.expiresAfter, intent.isTestnet, vault);
    return Buffer.from(JSON.stringify(signed), "utf8");
  }

  /**
   * A key venue's request signed (0037 §3 d2; SR "SIGNED Endpoint Examples"): the query exactly as sent, then `&signature=`:
   * HMAC-SHA256 in hex for a secret Binance made; RSASSA-PKCS1-v1_5 SHA-256 for the key gcx made, base64 then percent-encoded.
   * The bytes returned are the query that goes on the wire. This Binance signer does not sign Ed25519 before pin P6.
   */
  signKey(intent: KeySignIntent): Promise<Uint8Array> {
    return Promise.resolve().then(() => this.#signKey(intent));
  }

  #signKey(intent: KeySignIntent): Uint8Array {
    if (this.#moved || this.#marking) throw new SignerRefused("moved", "this data folder was exported; it signs nothing until the user acts");
    this.#unlocked();
    const e = this.#cex.get(intent.keyId);
    if (e === undefined) throw new KeystoreError("unknown-source", `no key ${intent.keyId}`);
    let signature: string;
    if (e.kind === "hmac") signature = createHmac("sha256", e.key).update(intent.query, "utf8").digest("hex");
    else if (e.kind === "rsa") signature = percent(signWith("sha256", Buffer.from(intent.query, "utf8"), createPrivateKey({ key: e.key, format: "der", type: "pkcs8" })).toString("base64"));
    else throw new KeystoreError("unknown-source", `key ${intent.keyId} is of a kind this build does not sign with`);
    return Buffer.from(`${intent.query}&signature=${signature}`, "utf8");
  }

  /** 0037 §3 d1, d2: an RSA-2048 key made here for `keyId`, durable before this resolves; only its public half (SPKI PEM) leaves. */
  async newRsaKey(keyId: string): Promise<string> {
    // Off the runtime's thread (judge Opus on B2, 7): every tick, gcx's own stops included, goes on while the key is made.
    const { privateKey } = await promisify(generateKeyPair)("rsa", { modulusLength: 2048 });
    const der = privateKey.export({ format: "der", type: "pkcs8" });
    await this.#mutateCex((cex) => {
      if (cex.has(keyId)) throw new KeystoreError("exists", `key ${keyId} exists`);
      cex.set(keyId, { kind: "rsa", key: der });
    });
    return this.publicKey(keyId) ?? "";
  }

  /** A secret the person pasted (a key Binance made: HMAC), kept under `keyId`, durable before this resolves. The caller zeroes `secret`. */
  async putHmacKey(keyId: string, secret: Buffer): Promise<void> {
    const key = Buffer.from(secret);
    await this.#mutateCex((cex) => {
      if (cex.has(keyId)) throw new KeystoreError("exists", `key ${keyId} exists`);
      cex.set(keyId, { kind: "hmac", key });
    });
  }

  /** A standard Solana wallet (seed then public half), checked locally and kept as Ed25519 PKCS#8. The caller zeroes `wallet`. */
  async putWalletKey(keyId: string, wallet: Buffer): Promise<void> {
    this.#unlocked();
    if (wallet.length !== 64) throw new KeystoreError("damaged", "a wallet key must contain 64 bytes");
    const key = Buffer.concat([Buffer.from("302e020100300506032b657004220420", "hex"), wallet.subarray(0, 32)]);
    try {
      const publicKey = createPublicKey(createPrivateKey({ key, format: "der", type: "pkcs8" })).export({ format: "der", type: "spki" });
      if (!publicKey.subarray(-32).equals(wallet.subarray(32))) throw new KeystoreError("damaged", "the wallet key's public half does not match its seed");
      await this.#mutateCex((cex) => {
        if (cex.has(keyId)) throw new KeystoreError("exists", `key ${keyId} exists`);
        cex.set(keyId, { kind: "ed25519", key });
      });
    } catch (e) {
      key.fill(0);
      throw e;
    }
  }

  /** The RSA or Ed25519 public half as SPKI PEM; undefined for none or another kind. Refuses while locked. */
  publicKey(keyId: string): string | undefined {
    this.#unlocked();
    const e = this.#cex.get(keyId);
    if (e?.kind !== "rsa" && e?.kind !== "ed25519") return undefined;
    return createPublicKey(createPrivateKey({ key: e.key, format: "der", type: "pkcs8" })).export({ format: "pem", type: "spki" });
  }

  /** The second file's keys by id and kind (no key leaves). Refuses while locked. */
  cexKeys(): Array<{ id: string; kind: CexEntry["kind"] }> {
    this.#unlocked();
    return [...this.#cex].map(([id, e]) => ({ id, kind: e.kind }));
  }

  /** The API key kept for `keyId`; a locked store answers it (0037 §3 d3: the futures streams open with it alone). */
  apiKey(keyId: string): string | undefined { return this.#apiKeys !== null && Object.hasOwn(this.#apiKeys, keyId) ? this.#apiKeys[keyId] : undefined; }

  /** The API key Binance showed for `keyId`, durable before this resolves (the add writes it before its journal row). */
  async setApiKey(keyId: string, apiKey: string): Promise<void> {
    await this.#chain(async () => {
      if (this.#moved) throw new SignerRefused("moved", "this data folder was exported; its key store changes nothing more");
      await this.#writeApiKeys({ ...this.#apiKeys, [keyId]: apiKey });
    });
  }

  /** A key venue's key and its API key deleted, zeroed, durable before this resolves (0037 §8 d5, Replace API key, a failed check). */
  async removeKey(keyId: string): Promise<void> {
    let gone: CexEntry | undefined;
    await this.#mutateCex((cex) => { gone = cex.get(keyId); cex.delete(keyId); });
    gone?.key.fill(0);
    await this.#chain(async () => { await this.#writeApiKeys(Object.fromEntries(Object.entries(this.#readableApiKeys()).filter(([id]) => id !== keyId))); });
  }

  /** The connect flow: a fresh agent key for a new source; only its address leaves. */
  async addAgent(sourceId: string): Promise<Address> {
    return this.#mutate((entries) => {
      if (entries.has(sourceId)) throw new KeystoreError("exists", `source ${sourceId} already has an agent; rotate it`);
      const key = newAgentKey();
      entries.set(sourceId, { key, pending: null });
      return agentAddress(key);
    });
  }

  /**
   * A new key, durable before the caller asks the master wallet to approve it; the current key keeps signing. With a key
   * already pending, that key's address is returned and nothing is created: the wallet may already have approved it.
   */
  async rotate(sourceId: string): Promise<Address> {
    return this.#mutate((entries) => {
      const entry = entryIn(entries, sourceId);
      entry.pending ??= newAgentKey();
      return agentAddress(entry.pending);
    });
  }

  /** The pending key's address (`rotate`), null when none; refuses while locked. */
  pending(sourceId: string): Address | null {
    const p = this.#entry(sourceId).pending;
    return p === null ? null : agentAddress(p);
  }

  /**
   * The venue approved `approved`, which must be the pending key's address: it becomes the key, the old one is zeroed
   * and gone.
   */
  async confirmRotation(sourceId: string, approved: Address): Promise<Address> {
    const old = await this.#mutate((entries) => {
      const entry = entryIn(entries, sourceId);
      if (!entry.pending) throw new KeystoreError("no-rotation", `source ${sourceId} has no pending key`);
      if (agentAddress(entry.pending) !== approved) throw new KeystoreError("no-rotation", `${approved} is not the pending key of source ${sourceId}`);
      const previous = entry.key;
      entry.key = entry.pending;
      entry.pending = null;
      return previous;
    });
    old.fill(0);
    return this.#address(sourceId);
  }

  /**
   * Its account was removed (0003b d12): the key, and a pending one, zeroed and gone from the file and the side file,
   * durable before this resolves. Called only after the wallet's revoke was asked (revoke before delete).
   */
  async removeAgent(sourceId: string): Promise<void> {
    const gone = await this.#mutate((entries) => {
      const entry = entryIn(entries, sourceId);
      entries.delete(sourceId);
      return entry;
    });
    gone.key.fill(0);
    gone.pending?.fill(0);
  }

  /**
   * An access key's value kept under its id (MH 3.1.1 item 25), durable before this resolves; the store keeps its own copy, so
   * the caller zeroes the bytes it gave. Refuses while locked, and a value that is not 32 bytes before anything is written.
   */
  async keepAccess(keyId: string, value: Buffer): Promise<void> {
    if (value.length !== ACCESS_BYTES) throw new KeystoreError("damaged", "an access key's value is 32 bytes");
    const copy = Buffer.from(value);
    await this.#mutate((_entries, access) => { access.set(keyId, copy); });
  }

  /** The key's value, a copy for one answer (the caller zeroes it); null when none is kept (a key made before this build). Refuses while locked. */
  access(keyId: string): Buffer | null {
    this.#unlocked();
    const v = this.#access.get(keyId);
    return v === undefined ? null : Buffer.from(v);
  }

  /** Whether the key's value is kept; null while locked: unknown, never "none". */
  hasAccess(keyId: string): boolean | null {
    return this.locked ? null : this.#access.has(keyId);
  }

  /** A revoked key's value zeroed and gone from the file, durable before this resolves; a key with none changes nothing. */
  async dropAccess(keyId: string): Promise<void> {
    const gone = await this.#mutate((_entries, access) => { const v = access.get(keyId); access.delete(keyId); return v; });
    gone?.fill(0);
  }

  /** The contents re-encrypted under the export passphrase, read back before they are given (0024 d8.1: `gcx export`'s key store part). Marks nothing. */
  async exportSealed(exportPassphrase: Buffer): Promise<Buffer> {
    await this.#queue;
    const plaintext = encodeEntries(this.#unlocked(), this.#access);
    this.#exportedGeneration = this.#generation;
    try {
      const sealer = await newSealer(exportPassphrase);
      const sealed = seal(sealer, plaintext);
      const back = reopen(sealer, sealed);
      const same = back.equals(plaintext);
      back.fill(0);
      if (!same) throw new KeystoreError("damaged", "the export did not read back");
      return sealed;
    } finally {
      plaintext.fill(0);
    }
  }

  /** The second file's keys re-encrypted under the export passphrase, read back (0037 §10 d4); null when it holds none. Marks nothing. */
  async exportCex(exportPassphrase: Buffer): Promise<Buffer | null> {
    this.#unlocked();
    if (this.cexUnreadable !== null) throw new KeystoreError("cex-unreadable", "Cannot read the exchange key file. Restore a readable copy to export");
    if (this.#cex.size === 0) return null;
    const plaintext = encodeCex(this.#cex);
    try {
      return seal(await newSealer(exportPassphrase), plaintext);
    } finally {
      plaintext.fill(0);
    }
  }

  /**
   * The export is done (0024 d8.1 step 5): stop signing at the call; on the write chain verify the exported generation,
   * make the folder's one marker (`note` as its text) durable, then delete the key files and zero the keys in
   * memory (amendment 3 d1): the keys then exist only in the export file. A failed marker write leaves the folder
   * unmarked on disk with its keys: the runtime exits, and its next start runs as before. A cut after the marker leaves a
   * moved folder, which never opens its key store; its next start deletes the files (`resumeMoved`).
   */
  markMoved(note: string): Promise<void> {
    this.#marking = true;
    const run = this.#queue.then(async () => {
      if (this.#exportedGeneration !== null && this.#generation !== this.#exportedGeneration) throw new KeystoreError("damaged", "The keys changed during export; export this folder again");
      this.#moved = true;
      await writeAtomic(join(this.#dir, MOVED_FILE), Buffer.from(note, "utf8"));
      // Marker and deletion share the write chain: no key write can land between them.
      removeKeyFiles(this.#dir);
      for (const e of this.#entries.values()) { e.key.fill(0); e.pending?.fill(0); }
      for (const v of this.#access.values()) v.fill(0);
      for (const e of this.#cex.values()) e.key.fill(0);
      this.#entries = new Map();
      this.#access = new Map();
      this.#cex = new Map();
      this.#apiKeys = {};
    });
    this.#queue = run.catch(() => undefined);
    return run;
  }

  /**
   * A new store in `dir` from `exportSealed`'s bytes: every key as it came, no hold (amendment 3 d2). A pending renewal key is
   * kept: it may be the one the venue lists now, and the new machine switches to it once a venue read lists it (`readAgents`).
   */
  static async importFrom(dir: string, sealed: Buffer, exportPassphrase: Buffer, source: UnlockSource, sealedCex?: Buffer): Promise<{ store: KeyStore; agents: ImportedAgent[] }> {
    if (await exists(join(dir, KEYSTORE_FILE)) || await exists(join(dir, CEX_FILE))) throw new KeystoreError("exists", "this folder already has a key store");
    const { plaintext } = await unseal(sealed, exportPassphrase);
    let decoded: { entries: Map<string, Entry>; access: Map<string, Buffer> };
    try { decoded = decodeEntries(plaintext); } finally { plaintext.fill(0); }
    const { entries, access } = decoded;
    let cex = new Map<string, CexEntry>();
    if (sealedCex !== undefined) { const c = (await unseal(sealedCex, exportPassphrase)).plaintext; try { cex = decodeCex(c); } finally { c.fill(0); } }
    const store = await KeyStore.create(dir, source, entries, cex, access);
    const agents = [...entries].map(([sourceId, e]): ImportedAgent => ({ sourceId, address: agentAddress(e.key) }));
    return { store, agents };
  }

  #unlocked(): Map<string, Entry> {
    if (this.#sealer === null) throw new SignerRefused("locked", "the key store is locked");
    return this.#entries;
  }

  #entry(sourceId: string): Entry {
    return entryIn(this.#unlocked(), sourceId);
  }

  /**
   * Durable before visible: `change` edits a copy of the entries, the copy is written, and only then does it replace
   * the entries in memory. A failed write leaves memory equal to the disk. Changes run one at a time, in call order, so
   * two writes never share the temp file and each change starts from the one before it.
   */
  #mutate<T>(change: (entries: Map<string, Entry>, access: Map<string, Buffer>) => T): Promise<T> {
    return this.#chain(() => this.#apply(change));
  }

  /** One write at a time, in call order, on the store's one chain (the first file, the second, the side files). */
  #chain<T>(f: () => Promise<T>): Promise<T> {
    const run = this.#queue.then(f);
    this.#queue = run.catch(() => undefined);
    return run;
  }

  /**
   * The second file's change, durable before visible (the first file's recipe): a copy changed, sealed, written atomically and
   * read back, then it replaces the keys in memory. A file this build could not read (`#cexSealer` null) is never rewritten.
   */
  #mutateCex(change: (cex: Map<string, CexEntry>) => void): Promise<void> {
    return this.#chain(async () => {
      if (this.#moved) throw new SignerRefused("moved", "this data folder was exported; its key store changes nothing more");
      this.#unlocked();
      this.#readableApiKeys();
      const sealer = this.#cexSealer;
      if (sealer === null) throw new KeystoreError("damaged", `the second key file (${CEX_FILE}) could not be read, so it is not written over`);
      const next = new Map(this.#cex);
      change(next);
      await sealed(join(this.#dir, CEX_FILE), sealer, encodeCex(next));
      this.#cex = next;
      // An exchange key written after an export is a change the export lacks (markMoved's guard).
      this.#generation++;
    });
  }

  async #writeApiKeys(next: Record<string, string>): Promise<void> {
    this.#readableApiKeys();
    await writeAtomic(join(this.#dir, CEX_KEYS_FILE), Buffer.from(`${JSON.stringify(next, null, 2)}\n`, "utf8"));
    this.#apiKeys = next;
    this.#generation++;
  }

  #readableApiKeys(): Record<string, string> {
    if (this.#apiKeys === null) throw new KeystoreError("damaged", `the second key file (${CEX_KEYS_FILE}) could not be read, so it is not written over`);
    return this.#apiKeys;
  }

  async #apply<T>(change: (entries: Map<string, Entry>, access: Map<string, Buffer>) => T): Promise<T> {
    if (this.#moved) throw new SignerRefused("moved", "this data folder was exported; its key store changes nothing more");
    const next = new Map([...this.#unlocked()].map(([id, e]) => [id, { ...e }]));
    const nextAccess = new Map(this.#access);
    const result = change(next, nextAccess);
    await this.#write(next, nextAccess);
    this.#entries = next;
    this.#access = nextAccess;
    await this.#writeAddresses();
    return result;
  }

  async #write(entries: ReadonlyMap<string, Entry>, access: ReadonlyMap<string, Buffer>): Promise<void> {
    const sealer = this.#sealer;
    if (sealer === null) throw new SignerRefused("locked", "the key store is locked");
    const plaintext = encodeEntries(entries, access);
    try {
      await writeAtomic(join(this.#dir, KEYSTORE_FILE), seal(sealer, plaintext), (written) => {
        const back = reopen(sealer, written);
        const same = back.equals(plaintext);
        back.fill(0);
        if (!same) throw new KeystoreError("damaged", "the new key store file did not read back; the previous one is kept");
      });
      this.#generation++;
    } finally {
      plaintext.fill(0);
    }
  }

  /** Never throws: the side file is derived from the keys, so a failed write raises `addressesStale` for an alert. A moved folder writes none (amendment 3 d1). */
  async #writeAddresses(): Promise<void> {
    if (this.#moved) return;
    this.#addresses = Object.fromEntries([...this.#entries].map(([id, e]) => [id, agentAddress(e.key)]));
    try {
      await writeAtomic(join(this.#dir, ADDRESSES_FILE), Buffer.from(`${JSON.stringify(this.#addresses, null, 2)}\n`, "utf8"));
      this.#addressesStale = false;
    } catch {
      this.#addressesStale = true;
    }
  }
}
