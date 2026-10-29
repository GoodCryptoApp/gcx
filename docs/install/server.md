# Set up goodcryptoX on a server

A rented server runs goodcryptoX day and night. You set it up from any computer, or from your phone alone; start here, or start on your Mac and move it here later in one file.

Any provider works. We recommend Hostinger for now: by far the easiest to set up that we found, and cost-effective too. The steps below show Hostinger screen by screen; the same steps work on any cloud provider, AWS, DigitalOcean, Google Cloud, Azure or any other.

**[Open Hostinger](https://www.hostinger.com?REFERRALCODE=HBDNPMHGJLZB)**

[Hostinger](https://www.hostinger.com?REFERRALCODE=HBDNPMHGJLZB): through this link you get 20 % off your first purchase, and goodcryptoX gets a share of it.

You are free to go to Hostinger without the link, or to use any other provider.

## Rent a server

What you do: create your Hostinger account, rent the server, install goodcryptoX on it, then connect the browser on your computer and your phone to it. Here is how, step by step.

As Hostinger's screens looked in October 2026:

**1. Sign up.** No card is asked for until you pay, a few screens later.

**2. VPS › Set up VPS**

![The VPS page, the arrow at Set up VPS](../pictures/install/hostinger/01-vps-page.webp)

**3. Location.** Choose the city nearest you, then **Next**.

![Choose a server location, the arrow at Next](../pictures/install/hostinger/02-location.webp)

**4. What to install.** Open **Applications**, or search for "Docker".

![Choose what to install, the arrow at Applications](../pictures/install/hostinger/03-choose-what-to-install.webp)

Pick the plain **Docker** tile, not Docker and Traefik, Docker Registry or Dockge.

![The search for Docker, the arrow at the Docker tile](../pictures/install/hostinger/04-docker-search.webp)

Its card says "Installed in Ubuntu 24.04": press **Select**.

![The Docker card, the arrow at Select](../pictures/install/hostinger/05-docker-select.webp)

**5. Root password.** Press **Generate** and keep the password in your password manager: it opens your server. Skip the SSH key.

![Secure your VPS access, the arrow at Generate](../pictures/install/hostinger/06-root-password.webp)

**6. Additional features.** Leave both boxes empty, then **Next**.

![Additional features, the arrow at Next](../pictures/install/hostinger/07-additional-features.webp)

**7. Plan.** KVM 1 is enough for goodcryptoX: press its **Select**.

![The plans, the arrow at KVM 1's Select](../pictures/install/hostinger/08-plan.webp)

**8. Billing period.** The price is your choice. On 18 October 2026, KVM 1 cost $6.49 a month on 24 months, $6.99 on 12 months and $9.99 on 1 month, tax on top; prices change, so read the shape of the deal:

- The low price is for the first term only, paid up front.
- After it, 12 and 24 months renew at the regular price ($11.99 a month that day), 1 month at the full price ($19.49 a month).
- You can change the period later, at the regular price, never the introductory one.
- Testing first? Take 1 month. Keeping it? Take 12 or 24 months from the start. A 1-month server that proves itself: rent a new one on 12 or 24 months, [move goodcryptoX there](moving.md#from-one-server-to-another), and cancel the old one before it renews.
- A new purchase has a 30-day money-back guarantee.

![The billing period, the arrow at 24 months](../pictures/install/hostinger/09-billing-period.webp)

![The billing period on 1 month, renewing at the full price](../pictures/install/hostinger/09b-billing-1-month.webp)

**9. Pay.** Hostinger sets up your server in about 5 minutes and sends an e-mail when it is ready.

**10. Ready.** Press **Manage VPS**. Skip the free domain: goodcryptoX does not need one.

![You're ready, the arrow at Manage VPS](../pictures/install/hostinger/11-ready.webp)

**11. Overview.** A short survey opens: press **Skip**. Then press **Docker manager** on the Docker card.

![The VPS Overview, the arrow at Docker manager](../pictures/install/hostinger/13-overview-clean.webp)

<details>
<summary>On another provider</summary>

Rent a small server with Ubuntu and Docker, 2 GB of memory or more, in a region near you. Many providers offer Ubuntu with Docker ready to install.

</details>

## Start goodcryptoX

**12. Compose › Compose from URL**

![Docker Manager, the arrow at Compose](../pictures/install/hostinger/15-docker-manager.webp)

![The Compose menu, the arrow at Compose from URL](../pictures/install/hostinger/16-compose-menu.webp)

**13. The link and the name.** Paste this link (goodcryptoX's compose file on GitHub; it always installs the latest release), name the application `gcx` and press **Deploy**.

```
https://raw.githubusercontent.com/GoodCryptoApp/gcx/main/compose.yaml
```

![Compose from URL filled in, the arrow at Deploy](../pictures/install/hostinger/17b-compose-from-url-filled.webp)

**14. Running.** Within a minute or two, `gcx` shows **Running**. Close the HTTPS banner: goodcryptoX does not need it.

![Docker applications: gcx, Running, the arrows at Terminal and at the row's menu](../pictures/install/hostinger/19-running.webp)

<details>
<summary>If this does not work</summary>

Two other ways.

The file's text. On Hostinger, choose **Compose › Compose manually** and paste it into the **.yaml editor** tab, with the name `gcx`. In another Docker panel, create the project by hand and paste it.

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

A terminal. Open your provider's web console, or `ssh root@<your server's address>` from your computer, and run this line on the server (with `sudo` before each `docker` where it needs it); the log follows in the same window:

```
curl -fsSLo compose.yaml https://github.com/GoodCryptoApp/gcx/releases/latest/download/compose.yaml && docker compose up -d && docker logs -f gcx
```

</details>

## Sign in

**15. The logs.** On the `gcx` row, open the **⋮** menu (the arrow at the row's right in the picture above) and press **View logs**, then the **Logs** tab.

**16. The link.** At the first start the log's first lines show a link: select it and copy it.

![The Logs tab at the first start, the arrow at the link](../pictures/install/hostinger/22-logs-link.webp)

**17. Open it.** Paste the link into the browser on your computer and create a passkey with Touch ID, Face ID or your computer's own unlock. goodcryptoX opens at my.goodcrypto.app, and from now on that address is the way in on this device. A passkey saved in iCloud or Google works on your other devices in the same account; any other device is added from Settings › Devices › **Add a device**. Your phone comes next, from the panel: Settings › Devices › **Add a device** shows a QR code that scans ([Add a phone or another computer](#add-a-phone-or-another-computer)).

The link works once: it dies the moment a device uses it. It also expires after 10 minutes; for a fresh one, press **Restart** in the row's menu. The link is a key: never share it or paste it anywhere else.

The same device opens the panel from its bookmark or home-screen icon and signs in with Face ID or Touch ID, no link, no code. That is the passkey the pairing created. **Set up goodcryptoX** on the Dashboard walks you through the rest: your exchange accounts, then your Telegram bot.

<details>
<summary>What my.goodcrypto.app relies on</summary>

Your server keeps one outgoing connection to goodcryptoX's relay, and my.goodcrypto.app reaches your server through it: over the internet, not by a direct call. Everything that passes is sealed between your browser and your server; the relay forwards it and can read or keep none of it. The one thing it means: if our relay is ever gone, this address stops working. goodcryptoX itself keeps running and trading on your server. The way in then is the tunnel in the fold below; it needs nothing of ours.

</details>

<details>
<summary>If this does not work</summary>

To scan a code with your phone instead, or for a fresh link another way: open the container's terminal (on Hostinger, **Terminal** on the `gcx` row) and run `gcx pair` (elsewhere `docker exec gcx gcx pair`); a terminal draws the code so that it scans.

Or reach goodcryptoX through a tunnel instead. On your computer, open Terminal (PowerShell on Windows) and run this line with your server's address (on Hostinger, after **IPv4** on the Overview):

```
ssh -N -L 8128:127.0.0.1:8128 root@<your server's address>
```

Answer `yes` the first time, then enter the server's password (on Hostinger, the root password from step 5). Nothing more appears, which is right: keep the window open while you use goodcryptoX. Then run `gcx open --print` in the container's terminal (elsewhere `docker exec gcx gcx open --print`) and open the link it prints in your browser within 60 seconds. goodcryptoX opens at `http://localhost:8128/gcx`. If the log names a port other than 8128, use that number on both sides of the line and in the address.

</details>

## Add a phone or another computer

Once your phone is added, no computer is needed: you can run everything from it.

A new phone or computer is added from a device that is already in: Settings › Devices › **Add a device** ([Phone access](../phone.md)).

Every device lost is the only case that goes back to the server: on Hostinger, **Terminal** on the `gcx` row, then `gcx pair` for a fresh link (elsewhere `docker exec gcx gcx pair`). That is the recovery; no e-mail reset, since there is no account with us.

## Updates and backups

goodcryptoX keeps itself up to date on the server: a new version installs by itself at a quiet moment, as on a Mac, finishing what it is doing first. Settings › General › Installation shows the version, and its **Update** button installs a new one at once if you do not want to wait.

<details>
<summary>If this does not work</summary>

On Hostinger, choose **Update** in the `gcx` row's menu; elsewhere, run `docker compose pull && docker compose up -d` in the folder of `compose.yaml`.

</details>

goodcryptoX keeps your data in two Docker volumes, `gcx-data` and `gcx-secret`. Back them up together: `gcx-data` alone cannot open your keys.

## Free and low-cost servers

Low-cost and even free servers can run goodcryptoX. Oracle Cloud's Always Free Arm server has enough memory, but free capacity can be hard to get and Oracle may reclaim a lightly used server. It is worth considering if you already have an Oracle account; for a newcomer who wants the easiest setup, Hostinger is still the easiest we found.

### Oracle Cloud Always Free

Choose **Ampere A1**, with **Ubuntu**, **1 OCPU and 2 GB of memory**. goodcryptoX's Docker image works on both Arm and Intel/AMD without changing the commands. Avoid the free AMD micro: its 1 GB of memory leaves too little room for Ubuntu and goodcryptoX together.

Oracle's [current free allowance](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm), checked 22 October 2026, covers this server; check the free label and the estimate before creating anything. The time-limited trial credit is a different offer.

Before choosing Oracle:

- Sign-up needs a credit or suitable debit card and may place a temporary hold; [contact Oracle](https://www.oracle.com/cloud/free/faq/) if verification fails.
- Choose your [home region](https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/managingregions.htm) carefully: free servers must be there, and it cannot be changed.
- If no free server is available, try another availability domain in that region or try later.
- Oracle may reclaim a lightly used server even while it runs; [back up both goodcryptoX volumes](#updates-and-backups) and expect interruptions.
- Upgrading keeps the free allowance but permits charges above it; do not upgrade just to avoid reclamation.
- Oracle may [suspend or terminate an account idle for 30 days](https://www.oracle.com/cloud/free/faq/); check its messages and your server regularly.

### Oracle setup

These steps follow Oracle's documentation; the walkthrough and screenshots await a verified Oracle account.

**1. Sign in.** Open [Oracle Cloud](https://cloud.oracle.com/) with your cloud account. A new account starts from [Oracle's Free Tier page](https://www.oracle.com/cloud/free/).

**2. Create the server.** Follow [Oracle's Linux server guide](https://docs.oracle.com/en-us/iaas/Content/Compute/tutorials/first-linux-instance/overview.htm): **Compute › Instances › Create instance**. Choose Ubuntu, then the **VM.Standard.A1.Flex** shape with **1 OCPU and 2 GB**. Keep the boot disk inside the free allowance and save the SSH key when Oracle offers it. The private key opens your server: keep it private.

**3. Check the network.** The server needs a public address and SSH access. Allow SSH (TCP 22) from your computer's public IP address. No additional incoming port is needed for goodcryptoX: use the private tunnel below, or the sign-in link in [Sign in](#sign-in). Do not open port 8128 to the internet.

**4. Connect.** On your computer, open Terminal, or PowerShell on Windows. Replace the two placeholders with the saved key file and the server's public address. On macOS or Linux, first run `chmod 400 <your-private-key-file>`; on Windows, use [Oracle's key-permission steps](https://docs.oracle.com/en-us/iaas/Content/Compute/tutorials/first-linux-instance/overview.htm):

```
ssh -i <your-private-key-file> ubuntu@<your-server-address>
```

**5. Install Docker if needed.** In that server terminal, follow [Docker's Ubuntu installation](https://docs.docker.com/engine/install/ubuntu/), using its apt repository, and install its Compose plugin too. The same instructions cover Arm and Intel/AMD. Check that `sudo docker compose version` prints a version.

**6. Start goodcryptoX.** Run this on the server:

```
curl -fsSLo compose.yaml https://github.com/GoodCryptoApp/gcx/releases/latest/download/compose.yaml && sudo docker compose up -d && sudo docker logs -f gcx
```

**7. Open the panel.** Use the log's sign-in link as in [Sign in](#sign-in).

<details>
<summary>Use an SSH tunnel instead</summary>

Keep this running in a second terminal on your computer:

```
ssh -i <your-private-key-file> -N -L 8128:127.0.0.1:8128 ubuntu@<your-server-address>
```

Then run `sudo docker exec gcx gcx open --print` on the server and open the link it prints within 60 seconds. If the log names another port, use that number on both sides of the tunnel. Never share the sign-in link.

</details>

### Other small servers

Published prices checked 22 October 2026; currency, tax, region, payment term and renewal matter. Read the final price before paying. These providers have not had the screen-by-screen goodcryptoX walkthrough above.

| Server | Published price | What matters |
| --- | --- | --- |
| [netcup VPS nano G11.5s](https://www.netcup.com/de/server/vps-lite) | €3.69/month including 19% VAT, six-month term | 2 GB memory, 60 GB disk; Nuremberg only. Prices vary with your tax country; choose IPv4 connectivity |
| [OVHcloud VPS-1](https://www.ovhcloud.com/en/vps/) | From US$4.54/month | 4 GB memory, 40 GB disk. Starting price; confirm the term, tax, region and renewal in its order page |
| [IONOS VPS S+](https://www.ionos.com/servers/vps) | US$2/month for three months, then US$6/month, one-year term | 2 GB memory, 60 GB disk; the low introductory price does not last the year |

## Proxy

<!-- proxy:start -->
A proxy sends every exchange connection through an address you choose, on a computer, a NAS or a server.

Open **Settings › General › Installation › Proxy**, turn **Proxy On**, enter `socks5://host:port` or `http://host:port`, and press **Save**. With no saved address, Save turns it on. With an address saved, the switch saves at once; Off keeps the address for next time. The saved address masks its password; **Edit** opens it with **Save** and **Cancel**, and **Remove** clears it and turns Proxy off. An empty field shows no warning; an address that is not a SOCKS5 or HTTP address warns at the field after Save and is not saved. If the proxy needs a login, use `socks5://user:password@host:port` or `http://user:password@host:port`; encode special characters in the login (for example, `@` as `%40`). Use a proxy you trust. Existing exchange streams reconnect through it without restarting goodcryptoX. If the proxy fails, goodcryptoX alerts you; check the address and login, or turn Proxy Off to connect directly.

For a terminal or Docker installation, set `GCX_PROXY=socks5://host:port` (or the HTTP address) in its environment before starting goodcryptoX. Once you save Proxy in Settings, that choice wins over the environment, including Off. The proxy covers exchanges; goodcryptoX's relay, reports, updates and other services connect directly.

On a server or NAS, you can run a VPN through a Gluetun sidecar: add the service below to your existing Compose file, fill in your VPN provider's details, and keep goodcryptoX's `network_mode: host`. Only Gluetun uses the VPN; goodcryptoX's services stay direct. Start the updated project, then save `http://127.0.0.1:8888` in Proxy (or set `GCX_PROXY` on the `gcx` service). The proxy port is available only on this machine. The VPN provider must support the OpenVPN credentials you supply; a NAS must have `/dev/net/tun` and allow the `NET_ADMIN` capability.

```yaml
  gluetun:
    image: qmcgaw/gluetun:latest
    cap_add: [NET_ADMIN]
    devices: [/dev/net/tun:/dev/net/tun]
    environment:
      VPN_SERVICE_PROVIDER: <your-vpn-provider>
      VPN_TYPE: openvpn
      OPENVPN_USER: <your-vpn-user>
      OPENVPN_PASSWORD: <your-vpn-password>
      HTTPPROXY: "on"
    ports: ["127.0.0.1:8888:8888/tcp"]
    restart: unless-stopped
```
<!-- proxy:end -->
