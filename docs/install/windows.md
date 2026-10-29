# Set up goodcryptoX on Windows

Windows 10 (version 1903 or later) or Windows 11, 64-bit, including Windows 11 on Arm. One download for every Windows PC.

{% hint style="warning" %}
**goodcryptoX trades only while this PC is on and online.** It watches your orders and bots while it runs. A short break is fine: a dropped connection for a few minutes, a restart of the app or of the PC, and goodcryptoX catches up when it is back. If this PC is not normally on day and night, run goodcryptoX on a [NAS at home](nas.md) or a [rented server](server.md) instead: set it up once, step by step, then use it the same way from your browser or your phone, and never worry about a missed order. You can start here and [move it later](moving.md) in one file.
{% endhint %}

## Start goodcryptoX

1. [Download goodcryptoX](https://goodcrypto.app/download/windows?utm_source=docs&utm_medium=page&utm_campaign=setup-windows) and open it. If your browser says the file is not commonly downloaded, choose to keep it.
2. Setup needs no administrator password: choose **Install**.
3. goodcryptoX appears by the clock, and your browser opens it. **Set up goodcryptoX** on the Dashboard walks you through the rest: your exchange accounts, then your Telegram bot.

<details>
<summary>If Windows says it protected your PC</summary>

goodcryptoX for Windows is not signed yet. Windows will say it protected your PC: choose **More info**, then **Run anyway**. If Windows says Smart App Control blocked goodcryptoX, this PC blocks every unsigned program and goodcryptoX cannot be installed on it until the signed version ships.

</details>

Windows may tuck the goodcryptoX icon under the arrow by the clock: drag it next to the clock to keep it in sight. Its menu has **Open the dashboard**, **Copy sign-in link**, the version and **Quit goodcryptoX**.

goodcryptoX updates itself, as on a Mac ([Updates](../updates.md)).

goodcryptoX starts when you log in and keeps running with the browser closed. To turn that off: Settings › General › **Start goodcryptoX when I log in**, or Windows Settings › Apps › Startup. **Quit goodcryptoX** stops it properly: it finishes what it is doing first.

## Your data

goodcryptoX keeps its data in `%LOCALAPPDATA%\GCX`, and the program in `%LOCALAPPDATA%\Programs\GCX`.

Your keys in that folder are sealed to your Windows account on this computer. A copied data folder cannot sign under another Windows user or on another PC: use Move to another machine instead.

## Removing goodcryptoX

Windows Settings › Apps, then goodcryptoX › **Uninstall**. goodcryptoX stops properly first. Your data stays in `%LOCALAPPDATA%\GCX`: delete that folder yourself to delete your data too. Orders and positions on the exchange are not affected.

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
