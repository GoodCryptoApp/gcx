# The key store

The runtime keeps your exchange API wallet keys in one encrypted file in your data folder, `keystore.enc`. Nothing else is in it. The trading engine never sees a key: it asks the signer for an address and for signed bytes, and that is all it can ask.

## What is stored, and where

| File in the data folder | What it holds | Secret? |
|---|---|---|
| `keystore.enc` | Your venue API wallet keys, one per main account (every account you add under it is signed for by it, the main account itself in goodcryptoX or not), plus a key waiting for approval during a rotation; a main account's key is deleted when you remove the last account under it from goodcryptoX | Yes, encrypted |
| `keystore.addresses.json` | The public address of each agent | No |
| `moved` | Present after `gcx export` moved this folder to another machine: the date and the file, the sentence `gcx run` and `gcx status` say; written last, after the export file was read back (an older `keystore.moved` is still honoured) | No |
| `unlock.dpapi` | Windows only: the unlock secret, sealed to your Windows account | Yes, sealed by Windows |

The agent address is public, so it sits in a plain file: while the store is locked the runtime can still check with the exchange that your agent is approved and when it expires.

**The file format.** A 40-byte header (format version, the key-derivation settings and a random salt, a random nonce), then the keys encrypted with AES-256-GCM, then the 16-byte authentication tag. The encryption key comes from your unlock secret through Argon2id (64 MiB of memory, 3 passes), built into Node 24.7 and later; no other library is involved. The header is authenticated with the contents, so changing any byte of the file makes it refuse to open. Every save uses a fresh nonce and is written to a temporary file (readable only by you, mode 600), flushed to disk, read back and checked, then renamed over the old file: a crash at any moment leaves either the old store or the new one, never half of each.

## How it is unlocked

The file is sealed with a secret that comes from one place, chosen at install for the kind of machine:

| Machine | Where the unlock secret lives | Restarts on its own |
|---|---|---|
| Mac | Your login keychain (a random secret, never typed) | After you log in |
| Windows | A file sealed to your Windows account on this computer (DPAPI), opened by the bundled tool. A copied data folder cannot sign under another Windows user or on another PC: use Move to another machine | After you log in |
| Linux with a desktop | The desktop keyring (Secret Service), only inside a graphical session | After you log in |
| Linux server (VPS) | A systemd credential (`LoadCredentialEncrypted=`) | Yes, at boot |
| Docker (NAS, VPS) | A file goodcryptoX writes at its first start into a volume of its own, `/secret/gcx-unlock` (a random secret, mode 600, never replaced; the image sets `CREDENTIALS_DIRECTORY=/secret`, so it is read like the systemd credential). Back up the two volumes together: a copy of the data volume alone cannot open your keys; a snapshot of the whole machine, a backup of Docker's volume folder or someone with root on it can, because each holds both | Yes |
| Anything else | A passphrase you type in the panel at every start (`POST /api/v1/runtime/unlock`, as bytes) | No: bots wait for you |

**What `gcx run` chooses today:** the credential file when `$CREDENTIALS_DIRECTORY` is set, otherwise the system's source: the login keychain on a Mac, DPAPI on Windows, or Secret Service on Linux. On other systems it waits for the passphrase typed in the panel. Windows uses the tool beside the bundled Node; a copy without that tool uses PowerShell. `GCX_UNLOCK` is an explicit environment source, not the Windows app's transport. While a store waits for its passphrase the panel shows **goodcryptoX is locked** on every page with one field; the runtime topic says `locked: "passphrase"` (`"system"` when the machine's own source did not answer at the start, which only a restart retries). A wrong passphrase is refused and leaves it locked; the right one unlocks it without a restart, and what waited for a signature goes. In this version a store is created only with a source of the machine's own (the first account's connection refuses on a machine with none), so a passphrase store comes only from elsewhere.

Rules the runtime keeps whatever the source:

- **The start waits 5 seconds; the unlock keeps going.** At the start the system tool gets 60 seconds and goodcryptoX waits for it at most 5: if it has not answered, goodcryptoX starts locked and the store opens the moment the tool answers, with no restart. An attempt that fails is tried again after 15 seconds, 1 minute, then every 5 minutes. A keychain that shows a dialog, a keyring that never answers: the store stays **locked** meanwhile. Locked is a normal state, not a crash (below).
- **The last resort is replacing the API wallet.** If the store still cannot be opened after those tries (or at once, when this computer has no key for the API wallet, or the store was sealed under another Windows account or computer, which goodcryptoX knows only for an unlock file it wrote or opened since this version: a data folder copied under an earlier version shows the store as refused and offers the replacement after those tries or at the next start), Replace API wallet makes a new key store and a new key, approved in your own wallet as any replacement; your other main accounts then need their API wallet replaced too. Each failure of the key store is reported to us by itself while automatic reports are on, with its reason and never a secret.
- **Proved by reading back.** At install the secret is stored, then read back by a fresh process and compared. A source that cannot give it back is refused with the reason.
- **Never on a command line.** The secret goes to and from each tool through its standard input and output, never as an argument another program could see in the process list. On a Mac it is written with `security -i` for that reason.
- **The desktop keyring only when it keeps the secret.** On Linux the keyring is used only inside a graphical session, and the stored item's collection is checked: if it landed in the keyring's in-memory "session" collection, which forgets it at reboot, it is refused (the secret, and with it your store, would be gone after a restart). No source uses the kernel keyring, the other place such secrets silently vanish from.
- **The environment variable is removed once read,** so the tools the runtime starts do not inherit it.
- **Errors never repeat a secret.** A refusal names the source, the tool and its exit code or "timed out"; it never includes what the tool printed.

### Exactly what runs, per system

| Source | Command | Tested on |
|---|---|---|
| macOS keychain | write: `/usr/bin/security -i` with `add-generic-password -U -s gcx-ai -a "<install>" -w <secret>` on its input; read: `/usr/bin/security find-generic-password -s gcx-ai -a <install> -w` | This Mac, against a throwaway keychain, in a test that runs only with `GCX_TEST_KEYCHAIN=1`; the default tests use a stand-in for `security` so they never touch a real keychain |
| Linux Secret Service | write: `secret-tool store --label="GCX unlock" service gcx-ai account <install>` with the secret on its input, then `secret-tool search --all service gcx-ai account <install>` for the collection; read: `secret-tool lookup service gcx-ai account <install>`; only when `DISPLAY` or `WAYLAND_DISPLAY` is set | Not on Linux yet: a stand-in on this Mac pins the commands and the refusals |
| Windows DPAPI | `app\gcx-dpapi.exe protect` or `unprotect`, beside the runtime's `node.exe`: raw bytes on stdin/stdout, `ProtectedData` with scope `CurrentUser` and no entropy | Mac-side stand-ins pin both choices; compilation, binary round trips, PowerShell compatibility, refusals, no console and timing have Windows-only tests awaiting the VM run |
| systemd credential, compose secret | reads `$CREDENTIALS_DIRECTORY/gcx-unlock` | This Mac (it is a file read) |
| Environment | reads `GCX_UNLOCK`, then removes it | This Mac |
| Passphrase | the one you typed | This Mac |

## Locked

A store that is not unlocked still starts the runtime: it recovers, reconciles and shows you the truth read-only. It answers each agent's address from `keystore.addresses.json`, and only when the file holds nothing but addresses; anything else is ignored until the unlock rewrites it from the keys. If the file cannot be rewritten (a full disk), the runtime alerts; unlocking and signing go on. Every request to sign is refused with "locked", so nothing is sent until you unlock.

## Rotating an API wallet key

A rotation creates the new key and saves it before anything is sent to the exchange; the old key keeps signing until the exchange approves the new one. Approving the new agent under the same name revokes the old key at the exchange, so from then on the runtime confirms the rotation by naming the address the exchange approved: the new key takes over and the old one is erased. A confirmation that names any other address is refused. If the runtime restarts in between, the new key is still saved; asking to rotate again returns that same key instead of making another, so an approval already given is never wasted, and the runtime confirms it once it sees the approval at the exchange. Until then its orders are refused, because the old key is revoked.

## Moving to another machine

`gcx export` ([Moving to another machine](../../install.md#moving-to-another-machine)) puts the keys into the export file encrypted under the **export passphrase** you type (this format, under that passphrase), inside the whole file sealed again the same way. Only after the file is written and opened back with the passphrase is the folder marked `moved`, and at that instant the running goodcryptoX stops signing; then the key store file and its address file are deleted, so the keys exist only in the export file. A failed or killed export before the mark leaves the folder as it was; one cut after it is finished at the next start.

Importing on the new machine first makes sure the new machine's own unlock secret exists (on a Mac the keychain item under the new install's id; on a NAS or a VPS the file in `/secret`), then writes the key store straight into the data folder, sealed with it. No key is ever written anywhere else. The keys are the same as on the old machine and trade at once: nothing to approve. A renewal that was waiting for Hyperliquid's list when the file was made travels too, and the new machine switches to it once Hyperliquid lists it.

What this guarantees, and what not:

- **The exported folder never signs again**, from the moment it is marked, in the running process and at every later start, and **holds no key** once the export finishes.
- **Not guaranteed:** a backup of the old folder made before the export (a disk image, a cloned virtual machine, a NAS snapshot), or the same export file brought in on a second machine or back on the old one, runs the same API wallets twice. Hyperliquid counts each request's number per sender and refuses a repeated one, not a second sender, so both copies place orders. Keep one copy running; removing or replacing the API wallet from the one you keep ends the other.

## What this protects, honestly

- **A program running as your user can read the key on every option.** That includes a malicious package the runtime depends on. The options differ in how quietly it can happen and in what a stolen disk gives away. In this version the signer is a part of the one runtime process; a separate system user for it would narrow this and may come later behind the same interface.
- **A stolen laptop:** the key is as safe as your login password (the keychain, DPAPI or the desktop keyring are unlocked by it). Turn on FileVault or BitLocker.
- **A VPS without a TPM:** the systemd key that seals the credential sits on the same disk, so a full image of the disk decrypts the store. It protects a leaked backup of the data folder, not a copied disk.
- **The environment variable** can be read by your user from `/proc/<pid>/environ` on Linux (`ps eww` on macOS) and tends to be copied into compose files and support dumps. Use it only if you already manage secrets elsewhere.
- **A stolen API wallet key cannot withdraw,** but it can trade your account into losses. Revoking the API wallet from your main wallet is the kill switch.
- **A Solana hot wallet**, when it arrives, will be full custody of its balance.
- **In memory** keys are kept as bytes and erased when replaced; they never appear in a log, an error, a printed object or a file other than `keystore.enc`. The signing library converts the key to a number, and briefly to text, inside each signature; our code never does, and a memory dump of a running process can contain the key whatever the format.
