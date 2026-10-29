/**
 * Where the unlock secret comes from (0008 §7.2). One small interface: `read()` gives the secret or refuses with the
 * reason; sources the runtime writes to also `store()` it, and `provision` proves a store by reading it back through a
 * fresh child process. Every OS tool runs with a 5 s timeout (a background retry passes a longer one, cli/keys.ts), and a timeout is "locked", a handled state. A secret is
 * a Buffer, never on argv, never in an error: errors carry the tool, the exit code or "timed out", not its output.
 *
 * What runs on which system, and what was tested where, is in docs/reference/runtime/keystore.md.
 */
import { spawn } from "node:child_process";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { open, readFile, rm } from "node:fs/promises";
import { hostname, userInfo } from "node:os";
import { dirname, join, win32 } from "node:path";
import { writeAtomic } from "../fs/atomic.js";
import { KeystoreError } from "./format.js";

export const TOOL_TIMEOUT_MS = 5000;
/** Where nothing but the person or a background attempt waits (an unlock attempt, `provision` at a connect): a slow tool (PowerShell under a first antivirus scan) is given this long. */
export const PATIENT_TOOL_MS = 60_000;
const SERVICE = "gcx-ai";

export interface UnlockSource {
  readonly kind: string;
  /** `limitMs`: how long an OS tool may take (`TOOL_TIMEOUT_MS` when absent); a source with no tool ignores it. */
  read(limitMs?: number): Promise<Buffer>;
  /** Whether what the source holds was sealed by another account or computer, so no try here can open it (DPAPI only); null: not known. */
  elsewhere?(): boolean | null;
}
export interface StoringSource extends UnlockSource {
  /** `limitMs` as `read`'s. */
  store(secret: Buffer, limitMs?: number): Promise<void>;
}

/** Run an OS tool: secret input on stdin, secret output on stdout, killed at `limitMs` (5 s by default). stderr is not read, so never repeated. */
export function runTool(kind: string, file: string, args: readonly string[], input?: Buffer, limitMs = TOOL_TIMEOUT_MS): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // windowsHide: no console window on Windows (0008 amendment 1 d2.2), where the runtime itself runs with none.
    const child = spawn(file, args, { stdio: ["pipe", "pipe", "ignore"], windowsHide: true });
    const out: Buffer[] = [];
    const wipe = () => { for (const b of out) b.fill(0); };
    let settled = false;
    const fail = (why: string) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      wipe();
      reject(new KeystoreError("unavailable", `${kind}: ${file} ${why}`));
    };
    // Settles at the limit even if a grandchild keeps the pipe open; the tool is killed.
    const timer = setTimeout(() => { child.kill("SIGKILL"); fail(`timed out after ${String(limitMs / 1000)} s`); }, limitMs);
    child.stdout.on("data", (b: Buffer) => out.push(b));
    child.stdin.on("error", () => undefined); // a tool that exits without reading its input
    child.on("error", () => { fail("could not be started"); });
    child.on("close", (code) => {
      if (code !== 0) { fail(`exited with code ${String(code)}`); return; }
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      const all = Buffer.concat(out);
      wipe();
      resolve(all);
    });
    child.stdin.end(input);
  });
}

/** Drop one trailing newline; refuse an empty secret. */
function secretOf(kind: string, b: Buffer): Buffer {
  const s = b.length > 0 && b[b.length - 1] === 10 ? b.subarray(0, b.length - 1) : b;
  if (s.length === 0) throw new KeystoreError("unavailable", `${kind}: the secret is empty`);
  return s;
}

/** A passphrase the caller got from the user (the panel's prompt is not this module's). Copied, so the store can zero it. */
export function passphrase(secret: Buffer): UnlockSource {
  return { kind: "passphrase", read: () => Promise.resolve(Buffer.from(secret)) };
}

/**
 * macOS login keychain (or `keychain`, a path) through `/usr/bin/security`. The write goes through `security -i` on
 * stdin, never `add-generic-password -w` on argv. `security -i` exits 0 even when a command fails: the read-back decides.
 */
export function macosKeychain(account: string, keychain?: string): StoringSource {
  const q = (s: string) => {
    if (/["\n]/.test(s)) throw new KeystoreError("unavailable", "macos-keychain: account and keychain may not contain quotes or newlines");
    return `"${s}"`;
  };
  const where = keychain === undefined ? [] : [keychain];
  return {
    kind: "macos-keychain",
    async store(secret, limitMs) {
      // The secret is pasted into a `security -i` line: only hex may reach it (a newline would run a second command).
      const hex = (b: number) => (b >= 48 && b <= 57) || (b >= 97 && b <= 102) || (b >= 65 && b <= 70);
      if (secret.length === 0 || !secret.every(hex)) throw new KeystoreError("unavailable", "macos-keychain: only a hex secret is stored");
      const line = Buffer.concat([Buffer.from(`add-generic-password -U -s ${SERVICE} -a ${q(account)} -w `), secret, Buffer.from(`${where.map((k) => ` ${q(k)}`).join("")}\n`)]);
      try { await runTool(this.kind, "/usr/bin/security", ["-i"], line, limitMs); } finally { line.fill(0); }
    },
    async read(limitMs) {
      return secretOf(this.kind, await runTool(this.kind, "/usr/bin/security", ["find-generic-password", "-s", SERVICE, "-a", account, "-w", ...where], undefined, limitMs));
    },
  };
}

/**
 * Linux desktop: the Secret Service through `secret-tool`, only inside a graphical session. After a store, the item's
 * collection is checked: the in-memory `session` collection loses the secret at reboot and with it the key store, so it
 * is refused (no source here ever uses the kernel keyring, the other volatile fallback of keyring libraries).
 */
export function secretService(account: string): StoringSource {
  const kind = "secret-service";
  const graphical = () => {
    if (!process.env.WAYLAND_DISPLAY && !process.env.DISPLAY) throw new KeystoreError("unavailable", `${kind}: only inside a graphical session; use the systemd credential or a passphrase`);
  };
  const attrs = ["service", SERVICE, "account", account];
  return {
    kind,
    async store(secret, limitMs) {
      graphical();
      await runTool(kind, "secret-tool", ["store", "--label=GCX unlock", ...attrs], secret, limitMs);
      const found = await runTool(kind, "secret-tool", ["search", "--all", ...attrs], undefined, limitMs);
      const path = /^\[(\/org\/freedesktop\/secrets\/collection\/[^/\]]+)\//m.exec(found.toString("latin1"));
      found.fill(0);
      if (!path) throw new KeystoreError("unavailable", `${kind}: the stored item was not found`);
      if (path[1] === "/org/freedesktop/secrets/collection/session") throw new KeystoreError("unavailable", `${kind}: the default collection is the in-memory session collection, lost at reboot; refused`);
    },
    async read(limitMs) {
      graphical();
      return secretOf(kind, await runTool(kind, "secret-tool", ["lookup", ...attrs], undefined, limitMs));
    },
  };
}

const DPAPI_CHECK = "if (-not (Test-Path (Join-Path $env:APPDATA 'Microsoft\\Protect'))) { exit 3 }";
const DPAPI = (op: "Protect" | "Unprotect") =>
  `Add-Type -AssemblyName System.Security; ${DPAPI_CHECK}; $m = New-Object IO.MemoryStream; [Console]::OpenStandardInput().CopyTo($m); ` +
  `$b = [Security.Cryptography.ProtectedData]::${op}($m.ToArray(), $null, 'CurrentUser'); [Console]::OpenStandardOutput().Write($b, 0, $b.Length)`;
/** Windows PowerShell by its absolute path (unlock-retry): a runtime started at logon may inherit a PATH without it. `C:\Windows` when SystemRoot is not set. */
export const powershell = (): string => win32.join(process.env.SystemRoot ?? "C:\\Windows", "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
/** Beside the DPAPI blob: who sealed it, the Windows account and the computer as a hash (never a name, never a secret). */
export const DPAPI_OWNER = "unlock.dpapi.owner";
const ownerHere = (): string => createHash("sha256").update(`gcx-dpapi-owner:${userInfo().username}@${hostname()}`).digest("hex");

/**
 * Windows: a DPAPI current-user blob in `<data>/unlock.dpapi`, through gcx-dpapi.exe beside this Node, or PowerShell
 * when the tool is absent (0024 amendment 5). Both use ProtectedData, no entropy and binary stdin/stdout. Only with the
 * user's profile loaded (exit 3 otherwise, from either tool): the "at log on" task, never "run whether user is logged on
 * or not". A blob opens only for the Windows account (and computer) that sealed it: `DPAPI_OWNER` says whose it is,
 * written with the blob and at a read that opens one without it or with another (unlock-retry), so a data folder copied
 * to another account or computer is known as such (`elsewhere`) instead of tried again for ever.
 */
export function dpapi(dataDir: string): StoringSource {
  const kind = "dpapi";
  const blobPath = join(dataDir, "unlock.dpapi"), ownerPath = join(dataDir, DPAPI_OWNER);
  const note = (): string | null => { try { return readFileSync(ownerPath, "utf8"); } catch { return null; } };
  const tool = join(dirname(process.execPath), "gcx-dpapi.exe");
  const transform = (op: "Protect" | "Unprotect", input: Buffer, limitMs?: number) => existsSync(tool)
    ? runTool(kind, tool, [op.toLowerCase()], input, limitMs)
    : runTool(kind, powershell(), ["-NoProfile", "-NonInteractive", "-Command", DPAPI(op)], input, limitMs);
  return {
    kind,
    async store(secret, limitMs) {
      await writeAtomic(blobPath, await transform("Protect", secret, limitMs));
      await writeAtomic(ownerPath, Buffer.from(ownerHere()));
    },
    async read(limitMs) {
      let blob: Buffer;
      try { blob = await readFile(blobPath); } catch { throw new KeystoreError("unavailable", `${kind}: no unlock.dpapi in the data folder`); }
      const secret = secretOf(kind, await transform("Unprotect", blob, limitMs));
      // The account that opened the blob owns it: a missing note, or one that differs (a renamed PC or user), is written (judge Opus, finding 6).
      if (note() !== ownerHere()) await writeAtomic(ownerPath, Buffer.from(ownerHere())).catch(() => undefined);
      return secret;
    },
    elsewhere() { const n = note(); return n === null ? null : n !== ownerHere(); },
  };
}

/** The credential file's name: systemd's `LoadCredentialEncrypted=` name, and Docker's file in its `/secret` volume (0024 d4.1). */
export const CREDENTIAL = "gcx-unlock";
/** The system's code for a failed file call (EACCES, ENOENT, EIO…): the reason, never a path or content. */
const codeOf = (e: unknown) => (e instanceof Error && "code" in e ? String(e.code) : "unknown");

/** The secret in the file `name` of `dir`, refused with the reason when it cannot be read or is empty. */
async function fileSecret(kind: string, dir: string, name: string): Promise<Buffer> {
  let b: Buffer;
  try { b = await readFile(join(dir, name)); } catch (e) { throw new KeystoreError("unavailable", `${kind}: ${name} could not be read (${codeOf(e)})`); }
  return secretOf(kind, b);
}

/** Linux service: the plaintext systemd puts in `$CREDENTIALS_DIRECTORY` from `LoadCredentialEncrypted=<name>`. Docker's image sets
 *  `CREDENTIALS_DIRECTORY=/secret`, so the runtime reads the file `credentialFile` wrote there through this source too. */
export function systemdCredential(name = CREDENTIAL): UnlockSource {
  const kind = "systemd-credential";
  return {
    kind,
    read() {
      const dir = process.env.CREDENTIALS_DIRECTORY;
      if (!dir) return Promise.reject(new KeystoreError("unavailable", `${kind}: $CREDENTIALS_DIRECTORY is not set; the unit needs LoadCredentialEncrypted=${name}`));
      return fileSecret(kind, dir, name);
    },
  };
}

/**
 * Docker's unlock secret (0024 d4.1, ruling 2 (a)): `gcx-unlock` in `dir`, the container's own `/secret` volume, written by
 * `gcx install --docker` at the first start (`dockerSecret`, cli/keys.ts) and read at every start by `systemdCredential`. Written
 * once: a file already there is never replaced (`wx`), and a write that fails leaves no file behind.
 */
export function credentialFile(dir: string): StoringSource {
  const kind = "credential-file", file = join(dir, CREDENTIAL);
  return {
    kind,
    async store(secret) {
      const fh = await open(file, "wx", 0o600).catch((e: unknown) => {
        throw new KeystoreError("unavailable", codeOf(e) === "EEXIST" ? `${kind}: ${CREDENTIAL} is already there; it is kept, never replaced` : `${kind}: ${CREDENTIAL} could not be written (${codeOf(e)})`);
      });
      try {
        await fh.writeFile(secret);
        await fh.sync();
      } catch (e) {
        await rm(file, { force: true });
        throw new KeystoreError("unavailable", `${kind}: ${CREDENTIAL} could not be written (${codeOf(e)})`);
      } finally {
        await fh.close();
      }
    },
    read: () => fileSecret(kind, dir, CREDENTIAL),
  };
}

/**
 * An environment variable, only when the configuration opts in (Docker users who manage secrets elsewhere). Removed
 * from this process's environment once read, so the tools the runtime starts do not inherit it.
 */
export function environment(name = "GCX_UNLOCK"): UnlockSource {
  const kind = "environment";
  return {
    kind,
    read() {
      const v = process.env[name];
      if (v === undefined) return Promise.reject(new KeystoreError("unavailable", `${kind}: ${name} is not set`));
      Reflect.deleteProperty(process.env, name);
      return Promise.resolve(secretOf(kind, Buffer.from(v, "utf8")));
    },
  };
}

/** A random 256-bit secret as 64 hex characters in a Buffer (never typed, never a string). */
function newSecret(): Buffer {
  const raw = randomBytes(32);
  const digit = (n: number) => (n < 10 ? 48 + n : 87 + n); // ASCII 0-9, a-f
  const out = Buffer.alloc(64);
  raw.forEach((x, i) => { out[2 * i] = digit(x >> 4); out[2 * i + 1] = digit(x & 15); });
  raw.fill(0);
  return out;
}

/** Install time: store a fresh secret, read it back through a fresh child process, refuse the source if it differs. The person waits on it, nothing else: each tool is given `PATIENT_TOOL_MS`. */
export async function provision(source: StoringSource): Promise<void> {
  const secret = newSecret();
  try {
    await source.store(secret, PATIENT_TOOL_MS);
    const back = await source.read(PATIENT_TOOL_MS);
    const same = back.length === secret.length && timingSafeEqual(back, secret);
    back.fill(0);
    if (!same) throw new KeystoreError("unavailable", `${source.kind}: the read-back differs from what was stored; refused`);
  } finally {
    secret.fill(0);
  }
}
