/**
 * An agent key held as bytes, shaped as the wallet the Hyperliquid SDK signs with (a viem-style local account), so the
 * adapter's own `signAction` does the L1 hashing (0008 §16: viem's `privateKeyToAccount` would hold the key as a hex
 * string). EIP-712 here covers the atomic types the L1 `Agent` message and its domain use; anything else is refused.
 *
 * secp256k1 is `@noble/curves` (Node's ECDSA always hashes its input with SHA-256 and gives no recovery id, and Node has
 * no keccak-256). Our code never turns a key into a string; the library converts it to a number internally at each
 * signature, which the reference page states.
 */
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { keccak_256 } from "@noble/hashes/sha3.js";
import { bytesToHex, concatBytes, hexToBytes } from "@noble/hashes/utils.js";
import type { Address } from "./signer.js";

type Fields = ReadonlyArray<{ name: string; type: string }>;
interface TypedData { domain: Record<string, unknown>; types: Record<string, Fields>; primaryType: string; message: Record<string, unknown> }

const utf8 = new TextEncoder();
const fixed = (hex: unknown, n: number, type: string) => {
  const b = typeof hex === "string" && hex.startsWith("0x") ? hexToBytes(hex.slice(2)) : new Uint8Array();
  if (b.length !== n) throw new Error(`typed data: a ${type} value is ${String(n)} bytes of hex`);
  return b;
};
function word(type: string, v: unknown): Uint8Array {
  if (type === "string" && typeof v === "string") return keccak_256(utf8.encode(v));
  if (type === "bytes32") return fixed(v, 32, type);
  if (type === "address") return concatBytes(new Uint8Array(12), fixed(v, 20, type));
  if (type === "uint256" && typeof v === "number" && Number.isSafeInteger(v) && v >= 0) {
    const out = new Uint8Array(32);
    let x = BigInt(v);
    for (let i = 31; x > 0n; i--, x >>= 8n) out[i] = Number(x & 255n);
    return out;
  }
  throw new Error(`typed data: field type ${type} is not supported by the agent signer`);
}
function hashStruct(name: string, types: Record<string, Fields>, value: Record<string, unknown>): Uint8Array {
  const fields = types[name];
  if (!fields) throw new Error(`typed data: no type ${name}`);
  const typeHash = keccak_256(utf8.encode(`${name}(${fields.map((f) => `${f.type} ${f.name}`).join(",")})`));
  return keccak_256(concatBytes(typeHash, ...fields.map((f) => word(f.type, value[f.name]))));
}
/** The EIP-712 digest: keccak256(0x1901 ‖ domainSeparator ‖ hashStruct(message)). */
export const typedDataDigest = (p: TypedData) =>
  keccak_256(concatBytes(Uint8Array.of(0x19, 0x01), hashStruct("EIP712Domain", p.types, p.domain), hashStruct(p.primaryType, p.types, p.message)));

export function agentAddress(key: Uint8Array): Address {
  const pub = secp256k1.getPublicKey(key, false);
  return `0x${bytesToHex(keccak_256(pub.subarray(1)).subarray(12))}`;
}

/** A fresh agent key, as a Buffer the store can zero. */
export function newAgentKey(): Buffer {
  const k = secp256k1.utils.randomSecretKey();
  const b = Buffer.from(k);
  k.fill(0);
  return b;
}

/** The SDK's viem-local wallet shape over key bytes. The key stays in the closure: no property, no `toString`. */
export function localWallet(key: Uint8Array, address: Address) {
  return {
    address,
    signTypedData(p: TypedData): Promise<`0x${string}`> {
      const sig = Buffer.from(secp256k1.sign(typedDataDigest(p), key, { prehash: false, lowS: true, format: "recovered" }));
      const hex: `0x${string}` = `0x${bytesToHex(sig.subarray(1))}${(27 + sig.readUInt8(0)).toString(16)}`;
      return Promise.resolve(hex);
    },
  };
}
