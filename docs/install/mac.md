# Set up goodcryptoX on your Mac

macOS 13.5 or later, Apple silicon or Intel.

{% hint style="warning" %}
**goodcryptoX trades only while this Mac is on and online.** It watches your orders and bots while it runs. A short break is fine: a dropped connection for a few minutes, a restart of the app or of the Mac, and goodcryptoX catches up when it is back. If this Mac is not normally on day and night, run goodcryptoX on a [NAS at home](nas.md) or a [rented server](server.md) instead: set it up once, step by step, then use it the same way from your browser or your phone, and never worry about a missed order. You can start here and [move it later](moving.md) in one file.
{% endhint %}

## Start goodcryptoX

1. [Download goodcryptoX](https://goodcrypto.app/download/mac?utm_source=docs&utm_medium=page&utm_campaign=setup-mac) and open the `.dmg`.
2. Drag **goodcryptoX** onto **Applications**, then double-click **goodcryptoX** in the same window.
3. goodcryptoX appears in the menu bar at the top right, and your browser opens it. **Set up goodcryptoX** on the Dashboard walks you through the rest: your exchange accounts, then your Telegram bot.

<details>
<summary>If macOS asks before opening it</summary>

The first time, macOS says goodcryptoX was downloaded from the internet and that Apple checked it: choose **Open**. You do this once. If an older goodcryptoX is installed, quit it first (its menu, **Quit goodcryptoX**) and choose **Replace**. If your Mac asks for an administrator password to copy it, use the Applications folder in your home folder instead.

</details>

The dot on goodcryptoX's mark in the menu bar says how things stand: green, all is well; yellow, something to look at; red, something needs you now. goodcryptoX starts when you log in and keeps running with the browser closed. With **Keep the Mac awake** on (Settings › General › Installation), it keeps a plugged-in Mac from sleeping.

## Another browser

To use goodcryptoX in another browser on this Mac, type localhost:8118 in its address bar and press Unlock. If that address does not open, choose Copy sign-in link in the goodcryptoX menu and paste it there.

## Add a phone or another computer

Your phone and your other computers connect from Settings › Devices › **Add a device** ([Phone access](../phone.md)).

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
