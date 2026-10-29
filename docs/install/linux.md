# Set up goodcryptoX on Linux

A Linux desktop, x64 or arm64, with systemd.

{% hint style="warning" %}
**goodcryptoX trades only while this computer is on and online.** It watches your orders and bots while it runs. A short break is fine: a dropped connection for a few minutes, a restart of the app or of the computer, and goodcryptoX catches up when it is back. If this computer is not normally on day and night, run goodcryptoX on a [NAS at home](nas.md) or a [rented server](server.md) instead: set it up once, step by step, then use it the same way from your browser or your phone, and never worry about a missed order. You can start here and [move it later](moving.md) in one file.
{% endhint %}

## Start goodcryptoX

1. [Download goodcryptoX](https://goodcrypto.app/download/linux?utm_source=docs&utm_medium=page&utm_campaign=setup-linux). One file runs on x64 and on ARM computers.
2. Unpack it and install:

   ```
   tar -xzf goodcryptoX-linux.tar.gz
   cd gcx-*-linux
   ./gcx install
   ```

3. goodcryptoX starts and your browser opens it. **Set up goodcryptoX** on the Dashboard walks you through the rest: your exchange accounts, then your Telegram bot.

`./gcx install` is safe to run again. It puts the program in `~/.local/opt/gcx`, the `gcx` command in `~/.local/bin`, and your data in `~/.local/share/gcx`.

goodcryptoX starts when you log in and keeps running with the browser closed. **goodcryptoX** in the applications menu opens the panel, signed in; `gcx open` does the same from a terminal. If goodcryptoX stops unexpectedly it is started again within about 10 seconds.

## The tray

Where your desktop shows tray icons (KDE, or GNOME with the AppIndicator extension), goodcryptoX's icon is there while it runs. Its menu says how goodcryptoX is doing and has **Open the dashboard** and **Quit goodcryptoX**.

## The key store

The secret that unlocks your API wallet keys is kept in your desktop's keyring (the Secret Service: GNOME Keyring, KDE Wallet and others). Connecting your first account needs a graphical login with the keyring unlocked.

## Another browser

`gcx open --print` prints a signed-in link to paste into another browser.

## Add a phone or another computer

Your phone and your other computers connect from Settings › Devices › **Add a device** ([Phone access](../phone.md)).

## Stop, update, remove

- **Quit goodcryptoX** in Settings › General › Installation, or `gcx stop` in a terminal, stops goodcryptoX properly: it finishes what it is doing first. It stays stopped until you open goodcryptoX again from the applications menu or log in again.
- goodcryptoX updates itself at a quiet moment ([Updates](../updates.md)). To install a download by hand, unpack it and run `./gcx install` in its folder: it stops the running goodcryptoX first. Your data stays.
- **Start goodcryptoX when I log in** in Settings › General › Installation turns the start at login on or off. It is the same as `systemctl --user enable gcx` and `systemctl --user disable gcx` in a terminal, and turning it off does not stop goodcryptoX while it runs.
- `gcx uninstall` removes the program, the start at login and the applications-menu entry. Your data folder stays: delete `~/.local/share/gcx` yourself to delete your data too. Your orders on the exchange are not affected either way.

## Keeping the computer awake

With the keep-awake switch on (Settings › General › Installation), goodcryptoX keeps the computer from sleeping while there is something to trade on: an order resting, a stop being watched, or a bot with an entry, an averaging order or a timer due. It needs no password and changes no system setting; the hold ends when goodcryptoX stops. Closing a laptop's lid still puts it to sleep, and goodcryptoX with it. On a system without `systemd-inhibit`, Settings says goodcryptoX cannot keep the computer awake.

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
