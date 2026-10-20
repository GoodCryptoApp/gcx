/**
 * The only part of the key store the engine and the rest of the runtime may import (0008 §7.4, ruling 5): an agent
 * address, and signed bytes for an intent. No key ever crosses this line. In v1 the signer is a module in the one process;
 * a separate OS user later sits behind this same interface. The import boundary is a lint rule (eslint.config.js),
 * pinned by tests/runtime/keystore/boundary.test.ts.
 */

export type Address = `0x${string}`;

/** One Hyperliquid L1 action to sign, built by `src/venues/hyperliquid/actions.ts`, with the nonce and deadline journaled with it. */
export interface SignIntent {
  action: { type: string };
  nonce: number;
  expiresAfter: number;
  isTestnet: boolean;
}

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
