/**
 * The key store (0008 §7): venue agent keys by source id in `keystore.enc`, nothing else. Opened locked; an unlock
 * source opens it. The engine never imports this module, only `signer.ts` (lint-enforced).
 *
 * - Locked: `address()` answers from the plain side file; `sign` refuses with `SignerRefused("locked")`.
 * - Rotation: `rotate` stores a new key as pending and returns its address; the old key keeps signing until the caller
 *   confirms the venue approved the new one (`confirmRotation`), so no instant exists without an approved key on disk.
 * - Export (0024 d8): `exportSealed` gives the contents re-encrypted under the export passphrase and marks nothing; the
 *   caller writes the whole export file, reads it back, and only then calls `markMoved`, which sets the in-memory flag (no
 *   signature from that instant), writes the folder's one marker, then deletes the key files (0024 amendment 3 d1). Import
 *   keeps every key as it came, a pending one too, with no hold (amendment 3 d2).
 */
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { signAction } from "../../venues/hyperliquid/actions.js";
import { writeAtomic } from "../fs/atomic.js";
import { ADDRESSES_FILE, KEYSTORE_FILE, KeystoreError, MOVED_FILE, OLD_MOVED_FILE, decodeEntries, removeKeyFiles, encodeEntries, newSealer, reopen, seal, unseal, type Entry, type Sealer } from "./format.js";
import { SignerRefused, type Address, type SignIntent, type Signer } from "./signer.js";
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
  #sealer: Sealer | null = null;
  #entries = new Map<string, Entry>();
  #queue: Promise<unknown> = Promise.resolve();
  #addressesStale = false;

  private constructor(dir: string, addresses: Record<string, Address>, moved: boolean) {
    this.#dir = dir;
    this.#addresses = addresses;
    this.#moved = moved;
  }

  get locked(): boolean { return this.#sealer === null; }
  get moved(): boolean { return this.#moved; }
  /** The address side file could not be rewritten (a full disk): the supervisor alerts; nothing is blocked. */
  get addressesStale(): boolean { return this.#addressesStale; }

  /** A new, empty, unlocked store in `dir`, sealed with the source's secret. */
  static async create(dir: string, source: UnlockSource, entries = new Map<string, Entry>()): Promise<KeyStore> {
    if (await exists(join(dir, KEYSTORE_FILE))) throw new KeystoreError("exists", "this folder already has a key store");
    const secret = await readSecret(source);
    const store = new KeyStore(dir, {}, false);
    try { store.#sealer = await newSealer(secret); } finally { secret.fill(0); }
    await store.#write(entries);
    store.#entries = entries;
    await store.#writeAddresses();
    return store;
  }

  /** The store as found, locked. */
  static async open(dir: string): Promise<KeyStore> {
    let addresses: Record<string, Address> = {};
    try { addresses = addressesFrom(JSON.parse(await readFile(join(dir, ADDRESSES_FILE), "utf8"))); } catch { /* rewritten at unlock */ }
    return new KeyStore(dir, addresses, (await exists(join(dir, MOVED_FILE))) || (await exists(join(dir, OLD_MOVED_FILE))));
  }

  async unlock(source: UnlockSource): Promise<void> {
    let file: Buffer;
    try { file = await readFile(join(this.#dir, KEYSTORE_FILE)); } catch { throw new KeystoreError("damaged", "no key store file in this folder"); }
    const secret = await readSecret(source);
    let opened: { sealer: Sealer; plaintext: Buffer };
    try { opened = await unseal(file, secret); } finally { secret.fill(0); }
    try { this.#entries = decodeEntries(opened.plaintext); } finally { opened.plaintext.fill(0); }
    this.#sealer = opened.sealer;
    // Repairs a side file a crash left behind a rename; on the save chain so it never shares a temp file with a save.
    const repair = this.#queue.then(() => this.#writeAddresses());
    this.#queue = repair;
    await repair;
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
    if (this.#moved) throw new SignerRefused("moved", "this data folder was exported; it signs nothing until the user acts");
    const entry = this.#entry(sourceId);
    const signed = await signAction(localWallet(entry.key, this.#address(sourceId)), intent.action, intent.nonce, intent.expiresAfter, intent.isTestnet, vault);
    return Buffer.from(JSON.stringify(signed), "utf8");
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

  /** The contents re-encrypted under the export passphrase, read back before they are given (0024 d8.1: `gcx export`'s key store part). Marks nothing. */
  async exportSealed(exportPassphrase: Buffer): Promise<Buffer> {
    const plaintext = encodeEntries(this.#unlocked());
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

  /**
   * The export is done (0024 d8.1 step 5): from this call this process signs nothing (the flag is set first, at the call's
   * instant), the folder's one marker, `note` as its text, is durable, and then the key files are deleted and the keys in
   * memory zeroed (amendment 3 d1): the keys then exist only in the export file. A failed marker write leaves the folder
   * unmarked on disk with its keys: the runtime exits, and its next start runs as before. A cut after the marker leaves a
   * moved folder, which never opens its key store; its next start deletes the files (`resumeMoved`).
   */
  async markMoved(note: string): Promise<void> {
    this.#moved = true;
    await writeAtomic(join(this.#dir, MOVED_FILE), Buffer.from(note, "utf8"));
    // A write already under way lands first; one asked after the flag is refused (`#apply`), so none follows the deletion.
    await this.#queue;
    removeKeyFiles(this.#dir);
    for (const e of this.#entries.values()) { e.key.fill(0); e.pending?.fill(0); }
    this.#entries = new Map();
  }

  /**
   * A new store in `dir` from `exportSealed`'s bytes: every key as it came, no hold (amendment 3 d2). A pending renewal key is
   * kept: it may be the one the venue lists now, and the new machine switches to it once a venue read lists it (`readAgents`).
   */
  static async importFrom(dir: string, sealed: Buffer, exportPassphrase: Buffer, source: UnlockSource): Promise<{ store: KeyStore; agents: ImportedAgent[] }> {
    if (await exists(join(dir, KEYSTORE_FILE))) throw new KeystoreError("exists", "this folder already has a key store");
    const { plaintext } = await unseal(sealed, exportPassphrase);
    let entries: Map<string, Entry>;
    try { entries = decodeEntries(plaintext); } finally { plaintext.fill(0); }
    const store = await KeyStore.create(dir, source, entries);
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
  #mutate<T>(change: (entries: Map<string, Entry>) => T): Promise<T> {
    const run = this.#queue.then(() => this.#apply(change));
    this.#queue = run.catch(() => undefined);
    return run;
  }

  async #apply<T>(change: (entries: Map<string, Entry>) => T): Promise<T> {
    if (this.#moved) throw new SignerRefused("moved", "this data folder was exported; its key store changes nothing more");
    const next = new Map([...this.#unlocked()].map(([id, e]) => [id, { ...e }]));
    const result = change(next);
    await this.#write(next);
    this.#entries = next;
    await this.#writeAddresses();
    return result;
  }

  async #write(entries: ReadonlyMap<string, Entry>): Promise<void> {
    const sealer = this.#sealer;
    if (sealer === null) throw new SignerRefused("locked", "the key store is locked");
    const plaintext = encodeEntries(entries);
    try {
      await writeAtomic(join(this.#dir, KEYSTORE_FILE), seal(sealer, plaintext), (written) => {
        const back = reopen(sealer, written);
        const same = back.equals(plaintext);
        back.fill(0);
        if (!same) throw new KeystoreError("damaged", "the new key store file did not read back; the previous one is kept");
      });
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
