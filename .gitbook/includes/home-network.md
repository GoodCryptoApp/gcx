## Your home network

goodcryptoX can open on your home network directly, without our server: turn on one switch, and the page shows one link. Open that link on any device at home, and goodcryptoX is there. It is off until you turn it on, on a Mac, Windows, Linux, a NAS or a server.

### Turn it on

1. Open goodcryptoX the way you already do: at the machine, through my.goodcrypto.app, or with the link the install printed. You can do this from anywhere, even from a phone that is not at home.
2. Open **Settings › Devices** and turn on **Connect directly at home**, in the **Home network** card at the bottom.
3. The card shows one link and its QR code: "Open this link or scan the QR code on any device on your home network".

The link stays the same until you turn the switch off. Keep it where you keep things: in your browser, in a note, in a message to yourself.

If the computer's firewall asks whether goodcryptoX may accept connections, or blocks it, allow it.

### Connect a device

Open this link or scan the QR code on any device on your home network. Click the link text or **Copy** to copy it, then paste it into that device's browser; on a phone, you can scan the QR code with its camera. goodcryptoX opens, and the device is in. Do the same on each device at home.

The device then opens goodcryptoX at that address from the browser's history, or from the same link again: a device that is already in opens it with no second step and no new row in Devices.

On a Mac or an iPhone, the browser may first ask whether it may find devices on your local network: allow it. If the page says the address is unreachable, allow the browser under System Settings › Privacy & Security › Local Network (on an iPhone: Settings › the browser › Local Network) and reload.

### On a NAS or a server

Through my.goodcrypto.app you turn it on in Settings › Devices, as above. With no contact with our server, or before any device is in, the machine's log says how at every start: "Connect directly at home: gcx network on in the container's Terminal, or docker exec gcx gcx network on".

1. Open the container's Terminal (on a NAS, the `gcx` container in Container Manager; on a server, your provider's console).
2. Run `gcx network on` (from the machine's shell: `sudo docker exec gcx gcx network on`). It prints the link and its QR code.
3. Copy the link and open it in the browser on your laptop.

While no device is in, the log prints the same link at every start. The link is a key: anyone who reads the container's log can see it, so keep the log to yourself.

If the suggested address is not the one your laptop reaches, give it yourself: `gcx network on http://192.168.1.20:8128`, with your machine's address and the port goodcryptoX prints. The command lists the machine's other addresses too, to choose from.

A goodcryptoX that runs as a service on a computer without a screen (not in Docker) prints no such line at start: run `gcx network on` in its shell.

* `gcx network` says whether it is on, at which addresses, and prints the link.
* `gcx network off` turns it off.
* **No contact with our server at all:** set `GCX_PHONE_RELAY: ""` on the `gcx` service in the compose file, before its first start. Once goodcryptoX has started with our server, turning the switch on does not undo that first contact. With our server off, **Add a device** is not shown: the home link is the way in.
* **The shipped compose file** (the machine's own network) needs no change for the switch. Off, goodcryptoX answers on the machine itself only, as before; on, on the machine's addresses. If a firewall sits in front of the NAS or server, it must let the port through.

### Who can open it

Turn this on at home, on a network you trust. Do not forward the port on your router.

Anyone who has this link and is on your network can add a device while it is on. The link works wherever it was shown or sent: a screenshot, a chat, the machine's log. You see every device in **Settings › Devices**: remove any device you did not add. To end the link itself, turn the switch off and on again: that makes a new link, and the old one stops working. Devices you already added open goodcryptoX again when you turn it back on, until you remove them.

Anyone else who opens the address sees only the logo and "To open goodcryptoX in this browser, use the home link from Settings › Devices on a device where it is open."

If a device is lost or you suspect someone else got in: remove the device, turn the switch off and on again for a new link, then check Devices and remove any device you did not add; revoke keys made meanwhile and any key that may have been copied.

A device you add here can do what you can do at your computer, trading and changing settings included, unless you set it to **Read-only**. A Read-only device sees the address and never the link. HTTP carries the page, the link and the sign-in in the open: someone who can read your network's traffic can copy them; your own HTTPS address protects against that.

### On a laptop

On a laptop, turning on **Connect directly at home** first shows a warning: choose **Turn on** to continue, or **Cancel** to leave it off. This pop-up appears only on a laptop. While on, the card keeps the same words in quiet grey text at the switch: "On any Wi-Fi MacBook-Pro joins, anyone on it can open goodcryptoX with this link", with your machine's name. The home network is whichever Wi-Fi the laptop is on, a café's or a hotel's too: anyone there who has the link can add a device. Turn it off before you leave home, or keep the link to yourself. goodcryptoX knows a laptop by its battery or its case; it cannot tell from inside Docker (Docker Desktop on a laptop shows no line), and when the reading fails it shows none.

### What "home network" means

goodcryptoX turns away requests that plainly come from outside the networks your machine is connected to. That check is best effort, not a lock: a proxy, a VPN or a router that forwards traffic can pass it, and the connection a VPN sends your traffic through is not your home network. It does not know which Wi-Fi a device is on, or tell a guest from a family member. What keeps others out is the link, and the devices you keep.

### Your own address

If you already reach your machine by a name of your own, through your own HTTPS proxy (Caddy, nginx), give it at the machine: `gcx network on https://gcx.example.com`. goodcryptoX saves it, turns the switch on and shows the link at that address. A name also keeps your devices in when the machine's address changes. HTTPS at home without a proxy of your own is planned for a later version.

<details>
<summary>Proxy settings</summary>

Caddy's default works:

```caddyfile
gcx.example.com {
    reverse_proxy 127.0.0.1:8128
}
```

nginx must keep the browser's Host and pass WebSockets; the usual `X-Forwarded-*` lines may stay. Put the map in nginx's `http` block, and the location inside your existing HTTPS server for that name:

```nginx
map $http_upgrade $gcx_connection {
    default upgrade;
    '' close;
}
location / {
    proxy_pass http://127.0.0.1:8128;
    proxy_http_version 1.1;
    proxy_set_header Host $http_host;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $gcx_connection;
}
```

Use the port goodcryptoX prints in place of 8128. If a page says "This address is not available", the proxy changed the Host: keep it as the browser sent it.

A proxy on this machine that passes goodcryptoX a `localhost` address reaches it as this machine does, and the switch off does not close it: restrict or remove that proxy yourself.

</details>

### Your devices

* Each device added this way has its row in **Settings › Devices**, marked **Home network**, with **Can trade** or **Read-only** and **Remove**. Remove ends it at once.
* A device unused for 90 days must be added again. One you use stays signed in. Your browser keeps its sign-in for the address it was added at, so the same machine at another address (a name instead of a number) is added again; the browser may also forget it sooner if you clear its data.
* A phone that uses both our server (away) and the home link (at home) has two rows: one for each way in. Remove removes the row you press.
* Turning the switch off closes goodcryptoX to every home-network device; their rows stay, and turning it on again lets them back in. Devices that use our server are not affected (Phone access).
* Away from home the address does not answer: use our server for that (Phone access).
* Sign in with Binance works at your home-network address, such as 192.168.1.20. At your own address (a name), use a self-generated API key.

### Connect a wallet at this address

A wallet connects at the home address as it does anywhere else: a wallet extension in your browser (MetaMask, Rabby and others), or a phone wallet by scanning the QR code. Opening the wallet window sends Reown / WalletConnect the page's address, your home-network address included (see the privacy policy). The QR code needs their servers to be reachable.

A wallet doesn't encrypt your connection to goodcryptoX: at the home address it stays plain HTTP. If you don't trust that network, use [your own address](#your-own-address) with HTTPS, or open goodcryptoX through our server (Phone access).

If the wallet service ever refuses this address, the wallet window closes and a line under **Connect wallet** says what to do instead: "Phone wallets can't connect at this address. Use a wallet extension in this browser, or open this page in your wallet app's browser." **More ways** adds goodcryptoX through our server, or an SSH tunnel. Until you reload the page, the window lists only the wallets in your browser; with none, Connect wallet says "No wallet extension in this browser".

### If something goes wrong

* **The link no longer works:** the switch was turned off, and turning it on made a new link. Open the new one from **Settings › Devices** on a device that is in, or run `gcx network` at the machine.
* **The page shows "To open goodcryptoX in this browser, use the home link from Settings › Devices on a device where it is open."** The device is not added: it was removed, unused for 90 days, or its browser forgot it. Open the link again.
* **Every device is lost:** at the machine's console run `gcx network` (`gcx network on` if the switch is off) and open the link it prints. There is no e-mail reset.
* **The address changed** (a router can hand out another), **or the browser's data was cleared:** open the link again from **Settings › Devices**: it names the new address. [Your own address](#your-own-address) avoids the first.
* **The card says "goodcryptoX is locked":** unlock goodcryptoX first; the link shows again. Devices already added, and the link itself, keep working meanwhile.
* **After you moved goodcryptoX with Bring** from a device that was open on the home network: the new machine starts with the switch off, no home-network devices and no link, so that device loses goodcryptoX at the restart. Turn the switch on there and open its new link.
