# Set up goodcryptoX on a NAS

A NAS at home runs goodcryptoX day and night, with nothing to rent. Start here, or start on your Mac and move it here later in one file. The steps below use a Synology; other makers' container apps take the same file.

## Check your NAS

goodcryptoX needs three things:

1. **The maker's container app:** Synology Container Manager, QNAP Container Station, Asustor Docker Engine, UGREEN Docker, TerraMaster Docker Manager.
2. **At least 2 GB of memory installed,** with about 1 GB left free.
3. **A 64-bit processor** (x86-64 or ARM64).

On Synology, the Plus models from 2018 on (DS218+, DS220+, DS224+, DS920+, DS923+ and others) and the DS223 and DS423 qualify. The j and play models, the DS124, and the DS118, DS218 and DS418 do not. Not sure? Ask in the goodcryptoX Telegram group, [t.me/goodcrypto](https://t.me/goodcrypto), with your exact model.

## Start goodcryptoX

1. In **Package Center**, install **Container Manager**.
2. Download goodcryptoX's compose file: [compose.yaml](https://github.com/GoodCryptoApp/gcx/releases/latest/download/compose.yaml).
3. In Container Manager, **Project › Create**: name it `gcx`, set its path to a new folder on the NAS's own disk (such as `docker/gcx`), choose **Upload docker-compose.yml** and pick the file. Press **Next** until **Done**. goodcryptoX starts.

The file is goodcryptoX's latest release on GitHub.

<details>
<summary>If this does not work</summary>

Choose **Create docker-compose.yml** instead of the upload, and paste the file's text:

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

## Sign in

In Container Manager, open the `gcx` container and its log. At the first start its first lines show a link: copy it, paste it into the browser on your computer and create a passkey with Touch ID or your computer's own unlock. goodcryptoX opens at my.goodcrypto.app. Your phone comes next, from the panel: Settings › Devices › **Add a device** shows a QR code that scans.

The first link is one-time: it dies the moment a device uses it. It also expires after 10 minutes: for a fresh one, restart the container, or run `gcx pair` in the container's terminal. The link is a key: never share it or paste it anywhere.

The link goes through goodcryptoX's relay.

<details>
<summary>If this does not work</summary>

Reach goodcryptoX through a tunnel instead. Turn on SSH on the NAS (**Control Panel › Terminal & SNMP › Terminal › Enable SSH service**; only an administrator account may sign in). On your computer, open Terminal (PowerShell on Windows), run this line with your user and the NAS's address, enter your password, and keep the window open:

```
ssh -N -L 8128:127.0.0.1:8128 <user>@<your NAS's address>
```

In a second window, sign in to the NAS with `ssh <user>@<your NAS's address>`, run `sudo docker exec gcx gcx open --print`, and open the link it prints in your browser within 60 seconds. goodcryptoX opens at `http://localhost:8128/gcx`. A network address such as `http://192.168.1.20:8128` does not open it.

</details>

From here, everything is as on a server: [adding a phone or another computer](server.md#add-a-phone-or-another-computer), [updates and backups](server.md#updates-and-backups).
