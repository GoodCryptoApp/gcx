# Devices: the panel on your phone or another computer

Through our relay, any device, a phone or a laptop, opens the panel of the goodcryptoX on your computer, NAS or server and signs in with a passkey.

## The first device

The first link is one-time: it dies the moment a device uses it, and expires after 10 minutes. If my.goodcrypto.app says Offline since, the link's 10 minutes have passed and no device is paired yet: get a fresh link and open it within 10 minutes. On a server or a NAS, that first link is in the container's log: see [Opening the panel](../install.md#opening-the-panel).

## Every visit afterwards

The same device opens the panel from its bookmark or home-screen icon and signs in with Face ID or Touch ID, no link, no code. That is the passkey the pairing created.

## Adding a device

A new phone or computer is added from a device that is already in: Settings › Devices › Add a device shows a QR code, and beside it the same link. Scan or open it on the new device, Face ID once, done. A passkey saved in iCloud or Google already works on your other devices in the same account, so a new iPhone on the same Apple ID often needs nothing at all.

## In the panel

Settings › **Devices** begins with the machine goodcryptoX runs on, under its name on your network (**This computer** when it has no name), which has no switch and cannot be removed. Then it lists every device you paired: its name (the pencil changes it), when it was paired, when it was last used, and a switch. **Can trade** may do everything you can do at your computer except making the move file; **Read-only** only looks. **Remove** takes a device away.

**Add a device** shows a QR code and the same link with **Copy**: scan the code with a phone's camera, or copy the link and open it on the other device. Closing the window cancels a relay code.

**Add a device** ends the list while our server is on; with our server turned off it is not shown.

Under the list, the **Home network** card holds **Connect directly at home**, which starts **Off**. Turn it on and the card shows one link and its QR code, the same until you turn it off: open it on each device at home, and goodcryptoX is there, with no passkey. On a laptop, a line at the switch says that any Wi-Fi the laptop joins counts as home. Turning it off asks once: the link stops working, and turning it on again makes a new one. A device added this way says **Home network** in its row while the switch is on, with the same **Can trade**, **Read-only** and **Remove**. Add it again after 90 days unused, if its browser forgets it, or if you use a different name or number for the machine. A Read-only device sees the address, never the link. [Your home network](../install/mac.md#your-home-network) walks you through it.

When goodcryptoX cannot reach our server, or another copy took over its place there, the page says so in one line at its top.

A Read-only device shows one line, **Read-only**, under the send button of the order form and the bot form and under a details' action bar. Everything that places, cancels, closes, stops, modifies or saves is disabled, and so is the switch, so change it from a device that can trade. Worth a look on the Dashboard shows no Close. When the machine does not answer, the Dashboard's figures turn grey until it does.

## Can trade or Read-only

Each device in the list has a switch, Can trade or Read-only: a Read-only device sees everything and changes nothing. A passkey saved in iCloud or Google carries its switch to your other devices in the same account.

## Removing a device, and when every device is lost

Removing a device is a row in the same Settings list; it stops within a second.

Every device lost is the only case that goes back to the server: the Terminal link on the container card, `gcx pair`, a fresh code. That is the recovery; no e-mail reset, since there is no account with us.

After you bring a data folder from a device, that device must pair again.
