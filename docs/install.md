# Installing goodcryptoX

goodcryptoX runs on your Mac, on Windows ([Set up on Windows](install/windows.md)), on a Linux desktop, on a NAS at home or on a server you rent, and moves between them in one file ([Moving to another machine](#moving-to-another-machine)).

## If you have a Mac

The easiest way: install goodcryptoX on your Mac and use it there. It runs while the Mac is awake; a closed lid puts it to sleep, and goodcryptoX with it. When it must run day and night, move it later to a NAS, a server or another computer ([Moving goodcryptoX](install/moving.md)).

macOS 13.5 or later, Apple silicon or Intel: one file, `gcx-<version>-<build>.dmg` (for example `gcx-3.0.0-2312.dmg`), for every Mac.

1. Open the `.dmg`. Its window shows **goodcryptoX**, an arrow and **Applications**: drag **goodcryptoX** onto **Applications**. If an older goodcryptoX is already installed, quit it first (the goodcryptoX mark in the menu bar, **Quit**) and choose **Replace**.
2. Then double-click **goodcryptoX** in the same window, as the window says. That opens the copy in Applications; the copy on the disk image never runs goodcryptoX itself. If you open goodcryptoX from anywhere else (Downloads), or a different version of goodcryptoX is installed, it asks you to put this one into Applications first. If your Mac asks for an administrator password to copy it there, use the Applications folder in your home folder instead.
3. The first time, macOS says goodcryptoX was downloaded from the internet and that Apple checked it for malicious software: choose **Open**. You do this once.
4. **goodcryptoX** appears in the menu bar at the top right of the screen and in the Dock while it runs, macOS tells you once that goodcryptoX added an item that starts when you log in, and your browser opens the panel, signed in, at `http://localhost:8118/gcx` (the number can differ if another program holds 8118: `gcx status` says).

From then on:

- **The dot on the goodcryptoX mark** tells you at a glance how things stand. **Green**: goodcryptoX is running and nothing waits for you. **Yellow**: something to look at, no rush (for example, your API wallet expires in a month). **Red**: something needs you now (for example, your API wallet expires within 24 hours, orders were not placed and wait for you, or the disk is full). **No dot and a dimmed mark**: you stopped goodcryptoX. The first line of the menu repeats it in the dot's colour: "goodcryptoX is running" when all is well; when the dot is yellow or red it says what is happening ("2 orders need a look: …", "Your API wallet expires in 5 hours"); choose such a line to open the Dashboard.
- **goodcryptoX in the menu bar** shows whether it runs, **Open the dashboard** (a new browser tab, signed in; double-clicking the app does the same), **Copy sign-in link** (with the grey line "to open the dashboard in another browser": it puts a one-time link on the clipboard), **Reset passkey…** once the panel is protected ([Signing in](panel/signing-in.md#recovering-access)), the version ("Version 3.0.0"; Settings › General › Installation shows the build number in brackets after it), and **Quit goodcryptoX**.
- **goodcryptoX starts when you log in** and opens no browser then. To turn that off: Settings › General › **Start goodcryptoX when I log in** in the panel, or System Settings › General › Login Items; each shows what the other set.
- If goodcryptoX stops unexpectedly it is started again within about 10 seconds.
- **Quit goodcryptoX** stops it properly: it finishes what it is doing first. Nothing runs until you open goodcryptoX again or log in.

### What runs

One program, goodcryptoX's runtime (`gcx run`), started by the goodcryptoX item in the menu bar: it keeps your ledger, reads market data from the exchange only while a page shows it, serves the panel on this computer only, and, once an account is connected, trades it. The menu-bar item only starts, restarts and stops it. Quit goodcryptoX lets it finish what is under way first (at most 30 seconds); if it stops any other way, a crash included, it is started again within about 10 seconds.

### The panel's address

The panel is at `http://localhost:<port>/gcx`. Browsers send `localhost` to your own computer, so the address needs no setup, no administrator password and nothing from your network. `http://127.0.0.1:<port>` and the earlier `http://gcx.localhost:<port>` lead there. A browser keeps its sign-in, and what the panel remembers in it, per address: after the move to this address choose **Open the dashboard** in the menu bar once and you are signed in there; a passkey made before is created again once.

### Your data

goodcryptoX keeps its data in `~/Library/Application Support/GCX` (the store, the key store once an account is connected, and the logs). Replacing or removing the app never touches it.

The logs are in `logs/`: one file a day, `2026-10-03.jsonl` (the day in UTC), one line per event, kept for the last 14 days and within a quarter of the Logs size set in Settings › Installation › Storage (200 MB by default, so 50 MB), whichever comes first; today's file is never removed. The other three quarters hold `wire/`, what goodcryptoX and the exchange exchanged about your accounts, one file an hour for 7 days at most, compressed (`.jsonl.gz`) once the hour closes. Before a line is written, anything secret in it is replaced by its kind: tokens, sign-in codes, passphrases, keys show as `<token>`, `<secret>`, `<hex64>` and the like. Account addresses and order ids stay, so a log still says which order and which account. `logs/gcx.log` holds only goodcryptoX's first line at each start and, if goodcryptoX ever stops by itself, the reason why; over 10 MB it moves to `gcx.log.1` (one previous file kept), and both count in the logs' share.

### Keeping the Mac awake

With **Keep the Mac awake** on (**Keep the computer awake** on Windows and Linux; Settings › General › Installation), goodcryptoX keeps the computer awake the whole time it runs while plugged in, and on battery only while there is something to trade on: an order resting, a stop being watched, or a bot with an entry, an averaging order or a timer due. Turning it off asks once. It needs no password and changes no system sleep preference; the hold ends when goodcryptoX stops. Closing a laptop's lid still puts it to sleep, and goodcryptoX with it: bots that must never pause belong on a NAS or a server.

### Removing goodcryptoX

Settings › General › Move or remove goodcryptoX › **Remove goodcryptoX from this computer** shows these steps in the app, with the data folder and Copy. Orders and positions on the exchange are unaffected.

Quit goodcryptoX from the menu bar, then drag goodcryptoX from Applications to the Trash. Your data folder stays: delete `~/Library/Application Support/GCX` yourself to delete your data too. Your orders on the exchange are not affected either way.

## If you have a Linux desktop

Download `gcx-<version>-<build>-linux-x64.tar.gz` (`-arm64` on an ARM computer), unpack it and run `./gcx install` in the folder it makes: goodcryptoX starts when you log in, goodcryptoX appears in the applications menu, and your browser opens the panel. The steps are on [Set up goodcryptoX on Linux](install/linux.md).

## Without a Mac, or to run day and night

Run goodcryptoX on a server from the start. Any VPS or cloud provider works: AWS, DigitalOcean, Google Cloud, Azure and many others. The steps are the same everywhere; only the names of the buttons differ.

**1. Rent a small Linux server with Docker.** Pick Ubuntu, 2 GB of memory, a few GB of disk and a region near you. Many providers offer Ubuntu with Docker ready to install.

**2. Open its Docker panel or its terminal.** Most providers have a terminal in the browser; some also have a panel that runs Docker projects.

**3. Give it goodcryptoX's compose file by its link:**

```
https://raw.githubusercontent.com/GoodCryptoApp/gcx/main/compose.yaml
```

In a Docker panel, create a project from that link and name it `gcx`. In a terminal, run this line, with `sudo` before each `docker` where your system needs it:

```
curl -fsSLo compose.yaml https://github.com/GoodCryptoApp/gcx/releases/latest/download/compose.yaml && docker compose up -d
```

It downloads one plain text file, which you can read before you start it, and starts it. It runs no script of ours. The Docker-panel link is goodcryptoX's compose file on GitHub, which uses the latest image.

<details>
<summary>If this does not work</summary>

Use the file's text instead. In a Docker panel, create the project by hand and paste it; in a terminal, save it as `compose.yaml` and run `docker compose up -d` in its folder.

```yaml
services:
  gcx:
    image: ghcr.io/goodcryptoapp/gcx:latest
    container_name: gcx
    network_mode: host
    init: true
    restart: unless-stopped
    stop_grace_period: 60s
    volumes: [gcx-data:/data, gcx-secret:/secret]
  updater:
    image: ghcr.io/goodcryptoapp/gcx:latest
    container_name: gcx-updater
    entrypoint: [gcx, updater]
    user: "0:0"
    network_mode: none
    init: true
    restart: unless-stopped
    volumes: [/var/run/docker.sock:/var/run/docker.sock, /root/.docker:/docker:ro, gcx-data:/data]
volumes:
  gcx-data: {name: gcx-data}
  gcx-secret: {name: gcx-secret}
```

</details>

**4. Open the container's log.** At the first start it shows how to reach the panel and how to sign in.

**5. Sign in.** On your computer, open Terminal (PowerShell on Windows) and run the tunnel line from the log, with your server's user and address, then its password if it asks:

```
ssh -N -L 8128:127.0.0.1:8128 <user>@<your server's address>
```

Keep it open while you use the panel, and run it again at every later visit. Then run `gcx open --print` in the container's terminal (in the server's own terminal: `docker exec gcx gcx open --print`) and open the link it prints in your browser within 60 seconds. goodcryptoX opens at `http://localhost:8128/gcx`.

<details>
<summary>If this does not work</summary>

Do it all from your computer over SSH. Keep the tunnel open in one Terminal window; in a second one, run `ssh <user>@<your server's address>`, then `docker exec gcx gcx open --print` (with `sudo` where Docker needs it), and open the printed link within 60 seconds. If the log names a port other than 8128, use that number on both sides of the tunnel line and in the address.

</details>

<!-- 0014: unhide when 0014 ships. Replace step 5 above and its fold with the text below, then delete this line and the closing mark.

**5. Sign in.** At the first start, the log shows a link and a QR code. Scan the code with your phone, or open the link in your computer's browser, and create a passkey with Face ID or Touch ID. The link works once, for 10 minutes: if it has expired, restart the container, or run `gcx pair` in the container's terminal for a fresh one. The link is a key: never share it or paste it anywhere.

The link goes through goodcryptoX's relay.

<details>
<summary>If this does not work</summary>

Reach the panel through a tunnel instead. On your computer, open Terminal and run the tunnel line from the log, with your server's user and address, then enter its password, and keep it open: `ssh -N -L 8128:127.0.0.1:8128 <user>@<your server's address>`. Then run `gcx open --print` in the container's terminal (in the server's own terminal: `docker exec gcx gcx open --print`) and open the link it prints in your browser within 60 seconds. goodcryptoX opens at `http://localhost:8128/gcx`.

</details>
-->

Low-cost and even free servers exist; [Free and low-cost servers](install/server.md#free-and-low-cost-servers) explains the options and the catches.

### The one we walked through: Hostinger

Hostinger is among the cheapest and by far the easiest to set up of the providers we looked at: [Set up goodcryptoX on a server](install/server.md) walks it screen by screen. We will add others as we test them; you are free to use any provider.

## On a NAS or a VPS (Docker)

A NAS at home (a Synology and the like) runs goodcryptoX around the clock with nothing to rent; a server runs it as in [the steps above](#without-a-mac-or-to-run-day-and-night). Both run it in Docker. The image is the whole program, pulled from goodcryptoX's registry on GitHub (`ghcr.io/goodcryptoapp/gcx`): nothing else to install there, and nothing on your computer but a browser and a terminal. Already running goodcryptoX on your Mac? Install here first, then [move it](install/moving.md#to-a-nas-or-a-server).

You need a 64-bit Linux machine (Intel or AMD, or ARM), Docker with Compose v2, about 1 GB of free memory (typically at least 2 GB installed) and 2 GB of disk plus your ledger. goodcryptoX keeps its data on the machine's own disk; a folder on a network share is refused. Docker Desktop on a Mac or on Windows is not supported: it runs Docker in a virtual machine, whose network is not your computer's, so the panel's address and the tunnel do not reach goodcryptoX there. On a Mac or Windows use the app.

With less than 1 GB of memory for goodcryptoX, its log warns that it may be slow or restart; it still starts and trades.

At every start goodcryptoX prepares its data folder, keeps its port (8128 the first time, or the next free one) and, at the first start only, writes the secret that unlocks your keys into its own volume. Its log, `docker logs gcx`, then shows how to open the panel from your computer and how to sign in.

### On a NAS

[Check your NAS model](install/nas.md) before installing. Download `compose.yaml` from goodcryptoX's latest release, then create a project from it in your NAS's container app (on a Synology: Container Manager › Project › Create). If the release does not open, paste the file's text from [step 3](#without-a-mac-or-to-run-day-and-night) instead. Then open the panel as below.

### Opening the panel

<!-- 0014: unhide when 0014 ships. Put the text below in place of the next paragraph, its two commands and "It prints the tunnel line again under the link.", then delete this line and the closing mark.

At the first start, while no device is paired, the log shows a link and its QR code first. Open the link in your computer's browser, or scan the code with your phone, and create a passkey with Face ID or Touch ID: from then on that device opens the panel from a bookmark, see [Devices](panel/devices.md). The link works once, for 10 minutes; for a fresh one, restart the container or run `gcx pair` in the container's terminal (`docker exec gcx gcx pair` on the machine). The log's link is a key: never paste it.

**For engineers:** the line under it reaches the panel without our relay, through a private SSH tunnel from your computer: `ssh -N -L 8128:127.0.0.1:8128 <user>@<your NAS or server>`, kept open, then `docker exec gcx gcx open --print` on the machine and the printed link opened within 60 seconds at `http://localhost:8128/gcx` (another port in the log: the same number at both ends).
-->

The panel listens on the machine itself only (`127.0.0.1`): nothing on your network or the internet can reach it. From your computer, open a private SSH tunnel and keep it open while you use the panel:

```
ssh -N -L 8128:127.0.0.1:8128 <user>@<your NAS or server>
```

Then open `http://localhost:8128/gcx` in your browser. If the log names another port, use it on both sides: the number must be the same at both ends. To sign in, print a one-time link on the machine and open it in that browser within 60 seconds:

```
docker exec gcx gcx open --print
```

It prints the tunnel line again under the link.

- **Every visit to the panel needs the tunnel:** connecting an account, the passkey, Telegram, creating a bot, renewing the API wallet every 180 days. Once an account and Telegram are set up, Telegram's messages and buttons work without it.
- **A network address such as `http://192.168.1.20:8128` does not work, by design:** nothing listens there, and a passkey works only at `localhost`.
- **The passkey** you make there is kept by your computer and belongs to this goodcryptoX: the goodcryptoX on your Mac and the one on your NAS are two entries when your browser asks which one.
- **On a Synology:** SSH is off until you turn it on (Control Panel › Terminal & SNMP › Terminal › Enable SSH service); only an administrator account may sign in over SSH; and `docker` commands need `sudo`. Whether your DSM version lets the tunnel through has not been checked yet.
- **A lost passkey:** on the machine, `docker exec gcx gcx passkey reset` (the lock screen shows this line, with Copy), with `sudo` where Docker needs it. It prints a fresh sign-in link.

### Stopping, updating and removing

- **Stop:** `docker compose stop` in the folder of `compose.yaml`, or Stop in your container app. goodcryptoX finishes what it is doing first, for up to 60 seconds. A `gcx stop` inside the container is undone at once: Docker starts goodcryptoX again. Shutting the whole NAS down may give goodcryptoX less time; it then recovers at its next start.
- **Starting again:** Docker starts goodcryptoX when the machine starts and again if goodcryptoX stops unexpectedly.
- **Updates:** Settings › General › Installation and the Dashboard say when a new version is out. Install it on the machine, in the folder of `compose.yaml`: `docker compose pull && docker compose up -d`. To go back to an earlier build, replace `latest` in `compose.yaml`'s `image:` line with that build's tag, such as `3.0.0-2312`, and run the same line; put `latest` back to take updates again. An automatic image updater (Watchtower and the like) is your choice; its stop timeout may cut goodcryptoX's 60 seconds short.
- **Logs:** one file a day in `logs/` of the data volume, as on a Mac; `docker logs gcx` holds goodcryptoX's lines at each start and, if goodcryptoX ever stops by itself, the reason why.
- **Remove:** `docker compose down` removes the container; your data stays in its volumes. Deleting the volume `gcx-data` deletes your data and goodcryptoX's API wallet keys. Your funds are not affected either way: your own wallet can revoke the API wallet on the exchange.

### Your data and backups

goodcryptoX keeps two Docker volumes on the machine's disk:

- `gcx-data` (the folder `/data` inside the container): your ledger, settings, key store and logs;
- `gcx-secret` (`/secret`): the secret that unlocks the key store, written at the first start.

**Back up both volumes together.** A copy of `gcx-data` alone cannot open your keys: that is why the secret has a volume of its own (a copy of the data you send for support, or a backup of a shared folder, holds no key anyone can use). A snapshot of the whole server, a backup of Docker's own volume folder, or someone with administrator rights on the machine has both, so keep those private. A key taken with both can trade your accounts, not withdraw from them, until you replace the API wallet.

If you restore `gcx-data` without its `gcx-secret`, goodcryptoX starts with your keys locked. Then remove `keystore.enc` and `keystore.addresses.json` from the data volume, start goodcryptoX, and connect each account again (goodcryptoX makes new API wallets).

**Your data in a shared folder of your NAS** (to back it up with the NAS's own tools): make a folder on the NAS's own disk, give it to goodcryptoX's user, and use it instead of the `gcx-data` volume. For example, on a Synology:

```
sudo mkdir -p /volume1/docker/gcx && sudo chown 1000:1000 /volume1/docker/gcx && sudo chmod 700 /volume1/docker/gcx
```

then, in `compose.yaml`, replace `gcx-data:/data` with `/volume1/docker/gcx:/data`. Keep `gcx-secret` as it is, or give it a folder of its own the same way, and back up both. If `docker logs gcx` says `gcx-unlock could not be written (EACCES)` or `could not be read (EACCES)`, the folder is not goodcryptoX's user's: run the ownership line above on it and start goodcryptoX again.

## Moving to another machine

goodcryptoX moves as one encrypted file: your ledger (orders, bots, history), settings and chart layouts, your accounts with their API wallet keys, your Telegram bot and its link, your partner code. Browser sign-ins, passkeys, the panel's passphrase and the secret that unlocks the keys on the old machine stay behind: the new machine makes its own.

**First install goodcryptoX on the other machine and open it, but do not connect an account there yet.**

**On the old machine:** Settings › General › **Move or remove goodcryptoX** › **Move to another machine**, then **Export**. Choose a passphrase and type it again. Keep the locked file the browser saves; a copy remains in goodcryptoX's data folder as `gcx-export-<date>.gcx` (after **Bring it back** or **Start fresh here**, inside `moved-<date>/` with the rest of the old data). From that moment this copy places no new orders and sees no executions until you bring the file to the other machine. Then everything continues there by itself. Once the file is saved and checked, goodcryptoX deletes its own key files here: the keys then exist only in the export file (the download and its copy in the data folder), which opens only with its passphrase. A failed export leaves the folder as it was.

**On the new machine:** Settings › General › Move or remove goodcryptoX › **Bring goodcryptoX from another machine** (or its card on the Dashboard), choose the file, enter its passphrase and press **Import**. goodcryptoX restarts, and this browser stays signed in. Your accounts and bots continue on the new machine with the same API wallets: nothing to approve. Two installations cannot be merged: with accounts connected, the Bring page links to Export first.

**Back on the exported machine:** every page shows the moved date, the file and **Bring it back** / **Start fresh here**. Both keep the old data inside `moved-<date>/`; neither deletes it, and this browser stays signed in. Bring it back asks for the file and its passphrase; Start fresh opens goodcryptoX as on its first day. A Docker container keeps serving this page; nothing to stop after the export.

For the whole path, use [Moving goodcryptoX](install/moving.md). On a NAS or VPS, the same Bring form receives the file through the panel's private connection; no container file copy is needed.

**From a terminal:** `gcx export [<file>]` and, with goodcryptoX stopped, `gcx import <file>`: each asks for the passphrase in the terminal, never on the command line.

**Keep the file and its passphrase safe.** Together they hold your API wallet keys: they can trade your accounts, not withdraw. goodcryptoX sends the file nowhere. If someone may have it, replace the API wallet (**Replace API wallet** in Settings › Exchanges › Hyperliquid › Edit account) from the goodcryptoX you keep. If you forget the passphrase, connect each account again on the new machine (new API wallets); your funds are not touched.

**What the move does not reach:** A backup made before the export, or the same file brought in on a second machine or back here, runs the same API wallets twice: keep one copy running; removing or replacing the API wallet from the one you keep ends the other. A backup here means any copy of the old data folder: a disk image, a cloned virtual machine, a NAS snapshot.

**A very large ledger:** the panel's Bring takes a file of up to 1 GiB; a larger one comes in with `gcx import` on the new machine.

**goodcryptoX carried over from an Intel Mac** to a Mac with Apple silicon, with the rest of the old Mac's apps and data, runs through Rosetta until its next update, which brings the Apple silicon version (macOS asks once to install Rosetta; when that first opening is a start at login, goodcryptoX waits for your click). On macOS 28 or later Rosetta may be gone: such a copy then does not open, and installing goodcryptoX again from the website (one download for every Mac) brings it back with your data kept.

**Starting with a new data folder instead** of importing: the bots, settings, Telegram link and partner code are not there, and every stop and trail goodcryptoX held is gone; only the exchange's own stops remain. Check each position by hand before anything else, then connect each account again (new API wallets).

## From a terminal

The app carries the `gcx` commands (`status`, `open`, `stop`, `install`, `uninstall`, `export`, `import`, described on [Local API](reference/runtime/api.md)); the app installs no `gcx` command of its own, so on a Mac you run them through the app's Node:

```
/Applications/gcx.app/Contents/MacOS/node /Applications/gcx.app/Contents/Resources/app/gcx.mjs status
```

A lost passkey is reset from the menu bar, not from Terminal: **Reset passkey…** asks for your Mac's password first ([Signing in](panel/signing-in.md#recovering-access)). On a NAS or a VPS, `docker exec gcx gcx passkey reset` on the machine does it ([above](#opening-the-panel)).

Use the menu's **Quit goodcryptoX** to stop goodcryptoX: a `gcx stop` typed while the menu-bar item watches a goodcryptoX it did not start itself is undone by a restart.
