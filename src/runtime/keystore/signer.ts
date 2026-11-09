/**
 * The only part of the key store the engine and the rest of the runtime may import (0008 §7.4, ruling 5): an agent
 * address, and signed bytes for an intent. No key ever crosses this line. In v1 the signer is a module in the one process;
 * a separate OS user later sits behind this same interface. The import boundary is a lint rule (eslint.config.js),
 * pinned by tests/runtime/keystore/boundary.test.ts.
 */

export type Address = `0x${string}`;

/** One Hyperliquid L1 action to sign, built by its wire (src/venues/hyperliquid), with the nonce and deadline journaled with it. */
export interface HlSignIntent {
  venue?: "hyperliquid";
  action: { type: string };
  nonce: number;
  expiresAfter: number;
  isTestnet: boolean;
}
/**
 * A key venue's request to sign (0037 §3 d2, §10 d1): its query bytes, signed with the account's own key of its kind (HMAC,
 * RSA or Ed25519; the key store's second file, keystore.cex.enc). Declared by the seam; the build that adds the venue signs it.
 */
export interface KeySignIntent {
  venue: "binance";
  /** The key's id in the key store's second file. */
  keyId: string;
  /** The request's query, exactly as it is sent. */
  query: string;
  /** Routing and account binding carried beside the query; never part of the signature or a secret. */
  request?: { endpoint: string; account: string };
}
/** What the signer signs: a union by venue behind the one boundary (0008 §7.4). */
export type SignIntent = HlSignIntent | KeySignIntent;

/** One source's agent. `sign` returns the `/exchange` request body as UTF-8 JSON bytes, journaled and re-sent as is. */
export interface Signer {
  /** The agent address. Public: a locked store answers it from a plain side file. */
  address(): Address;
  sign(intent: SignIntent): Promise<Uint8Array>;
}

/** `locked`: no unlock source has opened the store yet. `moved`: this folder was exported and never signs again by itself. */
export class SignerRefused extends Error {
  constructor(readonly code: "locked" | "moved", message: string) {
    super(message);
    this.name = "SignerRefused";
  }
}
