# Moving goodcryptoX

goodcryptoX moves as one locked file: your accounts with their API wallet keys, bots, settings and history. Every move is the same two steps, **Export** on the old machine and **Bring** on the new one; only where the file travels differs.

Between the export and the import, goodcryptoX's own stops, trailing stops and bots are **not watched**. Orders resting on the exchange, and the exchange's own stops, keep working. Check your positions first and finish the move in one sitting.

## The steps

1. **Set up goodcryptoX on the new machine** and open it, but do not connect an account there yet.
2. **Export.** On the old machine, open **Settings › General › Move or remove goodcryptoX**, press **Export** and choose a passphrase of 4 characters or more. A shorter one still works, but goodcryptoX warns you: it is easy to guess. goodcryptoX saves the file on that machine, in your Downloads folder on a computer, and shows where.
3. **Bring.** On the new machine, open **Settings › General › Move or remove goodcryptoX › Bring goodcryptoX from another machine** (or its card on the Dashboard), choose the file, enter its passphrase and press **Import**.

From the export, the old machine places no new orders. Your accounts and bots continue on the new one by themselves, with the same API wallets: nothing to approve. Phones and computers paired through our relay with the old machine come along; devices added over the home network and the home link do not, and the new machine starts with that switch off (turn it on there for a new link, [Your home network](mac.md#your-home-network)). A browser paired only with the new one signs in there again ([Sign in](server.md#sign-in)).

Keep the file and its passphrase safe: together they can trade your accounts, never withdraw. Once goodcryptoX runs on the new machine, delete the file, and never leave it in a cloud folder: it holds your keys, locked only by its passphrase.

The file holds your keys, so goodcryptoX makes it only on the machine itself and never sends it anywhere. On a phone or another device the page has no **Export**: when goodcryptoX runs on a Mac or a PC, open it there and press **Export**. On a NAS or a server every page shows one line instead of **Export**: sign in to that machine over SSH, paste the line and press Return. It asks for a passphrase, then tells you where the file is and how to copy it to your computer.

## To another computer

Install goodcryptoX on the new computer ([Set up on your Mac](mac.md)), Export on the old one, copy the file from its Downloads folder to the new computer (AirDrop, a drive, a cloud folder), and Bring it.

## To a NAS or a server

Set goodcryptoX up there first ([on a NAS](nas.md), [on a server](server.md)), then Export on your computer and Bring in the new panel: your browser sends the file, nothing to copy onto the machine.

## From one server to another

Set up the new server. On the old one, run `sudo docker exec -it gcx gcx export` over SSH (Settings › General › Move or remove goodcryptoX shows this line with Copy), choose a passphrase, and copy the file out of the container with the line it prints (`sudo docker cp gcx:/data/gcx-export-<date>.gcx . && sudo chown $USER gcx-export-<date>.gcx`). Bring it to your computer (for example `scp <user>@<old server>:gcx-export-<date>.gcx .`), Bring it in the new server's panel, then cancel the old server.

## Back to a computer

Install goodcryptoX on the computer, export on the server as in the step above (the line in its terminal, then the `docker cp` line it prints and `scp` to your computer), and Bring on the computer.

## The old machine afterwards

Every page there shows the moved date, **Bring it back** and **Start fresh here**; both keep the old data in a `moved-<date>` folder. If the same file runs on two machines, both trade the same accounts: keep one running.

## Questions

### Can I export from my phone?

No: the file holds your keys, so it is made only on the machine that runs goodcryptoX. On a phone, Settings › General › Move or remove goodcryptoX tells you what to do: on a Mac or a PC, press **Export** there; on a NAS or a server, paste the line it shows into that machine's terminal over SSH.

### Can I move goodcryptoX from my Mac to a server?

Yes: set goodcryptoX up on the server first, then **Export** on your Mac and **Bring** in the new panel. Your browser sends the file, with your accounts, bots, settings and history.

### Are my bots watched during a move?

No: between the export and the import, goodcryptoX's own stops, trailing stops and bots are not watched, while orders resting on the exchange keep working. Finish the move in one sitting.

### Do I need new API wallets after a move?

No: your accounts and bots continue on the new machine with the same API wallets, nothing to approve.

### Can the same file run on two machines?

It can, and then both trade the same accounts: keep one running.
