# Moving goodcryptoX

goodcryptoX moves as one locked file: your accounts with their API wallet keys, bots, settings and history. Every move is the same two steps, **Export** on the old machine and **Bring** on the new one; only where the file travels differs.

Between the export and the import, goodcryptoX's own stops, trailing stops and bots are **not watched**. Orders resting on the exchange, and the exchange's own stops, keep working. Check your positions first and finish the move in one sitting.

## The steps

1. **Set up goodcryptoX on the new machine** and open it, but do not connect an account there yet.
2. **Export.** On the old machine, open **Settings › General › Move or remove goodcryptoX**, press **Export** and choose a passphrase. Keep the file it saves.
3. **Bring.** On the new machine, open **Settings › General › Move or remove goodcryptoX › Bring goodcryptoX from another machine** (or its card on the Dashboard), choose the file, enter its passphrase and press **Import**.

From the export, the old machine places no new orders. Your accounts and bots continue on the new one by themselves, with the same API wallets: nothing to approve. Phones and computers paired with the old machine come along. A browser paired only with the new one signs in there again ([Sign in](server.md#sign-in)).

Keep the file and its passphrase safe: together they can trade your accounts, never withdraw.

## To another computer

Install goodcryptoX on the new computer ([Set up on your Mac](mac.md)), copy the file there (AirDrop, a drive, a cloud folder), and Bring it.

## To a NAS or a server

Set goodcryptoX up there first ([on a NAS](nas.md), [on a server](server.md)), then Export on your computer and Bring in the new panel: your browser sends the file, nothing to copy onto the machine.

## From one server to another

Set up the new server, Export in the old one's panel (the file comes to your browser), Bring in the new one's, then cancel the old server.

## Back to a computer

Install goodcryptoX on the computer, Export in the server's panel, and Bring on the computer.

## The old machine afterwards

Every page there shows the moved date, **Bring it back** and **Start fresh here**; both keep the old data in a `moved-<date>` folder. If the same file runs on two machines, both trade the same accounts: keep one running.
