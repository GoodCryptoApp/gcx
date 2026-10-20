/**
 * The key store's admin interface: what the supervisor and the `gcx` commands need, and nothing else (0008 §7, ruling 5:
 * the future signer process's admin surface). Only `src/runtime/supervisor/**` and `src/runtime/cli/**` may import it
 * (lint); the engine imports only `signer.ts`.
 *
 * Besides create, open, unlock, add, rotate and confirm, export and the moved marker, and import, the supervisor needs the
 * signer it hands the engine, the locked, moved and stale-side-file states it holds arming or alerts on, the unlock
 * sources to unlock with (`provision` for `gcx init`), and the error type to classify a refusal.
 */
import { newSealer, seal, unseal } from "./format.js";
import { KeyStore } from "./store.js";
import type { UnlockSource } from "./sources.js";

export type KeyStoreAdmin = Pick<
  KeyStore,
  "locked" | "moved" | "addressesStale" | "unlock" | "signer" | "addAgent" | "rotate" | "pending" | "confirmRotation" | "removeAgent" | "exportSealed" | "markMoved"
>;
export type { ImportedAgent } from "./store.js";
export type { Address } from "./signer.js";

export const createStore = (dir: string, source: UnlockSource): Promise<KeyStoreAdmin> => KeyStore.create(dir, source);
export const openStore = (dir: string): Promise<KeyStoreAdmin> => KeyStore.open(dir);
export const importStore = async (dir: string, sealed: Buffer, exportPassphrase: Buffer, source: UnlockSource) => {
  const { store, agents } = await KeyStore.importFrom(dir, sealed, exportPassphrase, source);
  const admin: KeyStoreAdmin = store;
  return { store: admin, agents };
};

/** The export file's outer seal (0024 d8.1 step 3): the key store's own recipe under the export passphrase; no new cryptography. */
export const sealWith = async (secret: Buffer, plaintext: Buffer): Promise<Buffer> => seal(await newSealer(secret), plaintext);
/** Its opening: `bad-secret` for a wrong passphrase or a changed file, `damaged` for a file that is not one. */
export const unsealWith = async (file: Buffer, secret: Buffer): Promise<Buffer> => (await unseal(file, secret)).plaintext;

export { KEYSTORE_FILE, MOVED_FILE, KeystoreError, removeKeyFiles, type KeystoreErrorCode } from "./format.js";
export { CREDENTIAL, credentialFile, dpapi, environment, macosKeychain, passphrase, provision, secretService, systemdCredential, type StoringSource, type UnlockSource } from "./sources.js";
