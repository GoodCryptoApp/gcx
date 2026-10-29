# Safety and keys

goodcryptoX runs on your own machine and trades your exchange account through an **API wallet**: a key that can trade for your account and can never withdraw. Your own wallet's key never reaches goodcryptoX. This page says what goodcryptoX keeps, what never leaves your machine, how the API wallet works and ends, and what to do when you want everything stopped.

## What goodcryptoX keeps, and where

Everything is in goodcryptoX's data folder on the machine that runs it (on a Mac `~/Library/Application Support/GCX`; the other systems are listed in the [privacy policy](../legal/privacy.md#what-stays-on-your-machine)):

- **The key store**: the API wallet's key, one per main account you connect, encrypted in one file. goodcryptoX makes the key on your computer when you connect; your sub-accounts and vaults are signed for by their main account's key. When you remove a main account, its key is deleted.
- **The ledger**: your orders, fills, positions, bots, settings and chart layouts, written down before goodcryptoX acts on them, so a crash or an update loses nothing.
- **Your Telegram bot's token**, if you linked Telegram, in a file only you can read.
- **Logs** (14 days at most) and the log of what goodcryptoX said to the exchange (7 days at most), together never above the size set in Settings › Installation › Storage (200 MB by default): addresses, order ids, Telegram ids and the names you give your accounts, never keys, tokens or passphrases.

A copy or a backup of the data folder holds your history and your keys, encrypted: keep it as private as the computer. Removing the app does not delete the folder; deleting the folder deletes the API wallet's key, which costs you nothing, since your own wallet controls your funds.

## What never leaves your machine

The API wallet's key, the secret that unlocks the key store, a passphrase you type, your Telegram bot's token (except to Telegram) and your access keys. Hyperliquid receives your orders signed by the API wallet, never the key itself. What does leave, and to whom (Hyperliquid; GitHub for updates; the wallet window's services; Telegram and, for the one-touch set-up, our set-up server; our reports server, which with reports turned off still gets a daily sign that goodcryptoX exists; and only if you use them, our phone relay, the news e-mail, a partner's code and an agent you connect), is listed in full in the [privacy policy](../legal/privacy.md#what-leaves-your-machine). The reports sent to us never hold your keys, your accounts' addresses or names, or your balances ([Reports to goodcryptoX](../reports.md)).

## What your wallet signs

Connecting an account asks your own wallet for two signatures, Hyperliquid's own messages, which cost nothing and send no transaction ([Connecting your Hyperliquid account](../panel/connect.md)):

1. **Approve the API wallet**: lets goodcryptoX's API wallet trade for your account until a date 180 days ahead. It cannot withdraw or transfer.
2. **Approve the builder fee**: the most Hyperliquid may charge on goodcryptoX's orders for goodcryptoX (0.03 % of each trade's value today). It is asked only when you have approved less than 0.03 % before.

## The API wallet

**What it can do**: place and cancel orders, set leverage and isolated margin, on your main account and on the sub-accounts and vaults you add to goodcryptoX. **What it cannot do**: withdraw or transfer.

**It expires.** Hyperliquid keeps an API wallet for 180 days from its approval. Settings › Exchanges › Hyperliquid shows the date on the account's card ("API wallet: gcx · expires …"), and goodcryptoX reminds you:

- from 30 days before, a red line on the card: "Your Hyperliquid API wallet expires in less than 30 days. Replace it to avoid trading interruptions", and the dot on the menu bar mark turns yellow;
- in Telegram (when linked), 30 days and 7 days before ("Hyperliquid API key expires"), and within the last 24 hours and at expiry as a message that needs you;
- **in the last 24 hours** Launch asks first ("The API wallet expires in under 24 hours. Renew it in Settings", then Launch anyway or Back), and no bot starts a new cycle, because an entry that filled after the expiry would leave a position goodcryptoX could neither protect nor close; a cycle under way keeps its take-profit and stop-loss, and the bot shows **Needs repair** with the reason. The dot turns red.

**When it has expired, or the exchange no longer lists it** (a main account that holds no funds loses its API wallets on the exchange), goodcryptoX holds nothing and keeps running, as goodcryptoX 2.0 did: a new order or a new bot on any account of that main account is refused at once with one sentence ("Your API wallet for … has expired: renew it in Settings.", or "… is no longer approved on {venue}: …"), which the Trade page also shows in place of Buy, Sell and Launch. A running bot's next order and a stop of goodcryptoX's that fires are sent, and the exchange refuses them: the bot stops as goodcryptoX 2.0's did on an error (its orders cancelled, its position closed only if **Close position on stop** is on), shows **Error** with the exchange's text and sends one "DCA Error" message; a stop's order goes to repair with the text. Only the accounts that API wallet signs for are affected: your other main accounts trade on. Your cancels and Close are sent too, and the exchange answers them. A wallet that the exchange no longer lists is told once in a page; an expired one in the Telegram reminder. Keep funds on the main account: Settings warns when it holds a dollar or less while a sub-account's bot runs.

**Renewing it.** **Replace API wallet** (Settings › Exchanges › Hyperliquid, Edit account), or **Fix** on the expiry line, renews the API wallet in the account's card, as goodcryptoX 2.0 did: you connect the main account's own wallet, goodcryptoX makes a new API wallet key on this computer (kept before anything is signed), and your wallet approves it under the same name, which replaces the old one on Hyperliquid; a second prompt asks for the builder fee only if it is not approved. Nothing stops meanwhile: goodcryptoX keeps trading with the old API wallet until Hyperliquid lists the new one, then uses the new one. Once Hyperliquid lists it, new orders and bots are taken again; a bot waiting in repair for the last 24 hours resumes by itself and tells you so once. A bot that stopped on Hyperliquid's error is not restarted: start a new one (Relaunch from its message or the bot's page). If Hyperliquid refuses an order because it no longer knows the old API wallet while goodcryptoX has not yet seen the new one, goodcryptoX reads Hyperliquid's list once at that refusal (at most once a minute) and switches if the new one is there; the refused order is not sent again by itself: it waits in repair for its **Retry**, as any refused order does. One renewal covers the main account's sub-accounts and vaults. If Hyperliquid no longer lists the API wallet because the main account holds nothing, fund it first.

## The key store

The key store opens by itself where the machine keeps a secret for it: on a Mac, a random secret in your login keychain, so you never type anything; on a server, a secret file given to goodcryptoX at start. Where a machine has neither, connecting an account is refused in this version; sealing the key store with a passphrase you type is *planned*. A key store sealed that way shows **goodcryptoX is locked** on every page after each start: "Type the passphrase to sign orders". Until then goodcryptoX checks your accounts but signs nothing: new orders are refused, and goodcryptoX's stops, trails and bots wait.

What this protects, honestly ([The key store](../reference/runtime/keystore.md#what-this-protects-honestly) has the detail):

- **A stolen laptop**: the key is as safe as your login password, which unlocks the keychain. Turn on FileVault (BitLocker on Windows).
- **A program running as your user** can read the key, as it can read anything of yours. Install only software you trust on the machine that runs goodcryptoX.
- **A stolen API wallet key cannot withdraw**, but it can trade your account into losses. Removing the API wallet with your main wallet ends it at once: Settings › Exchanges › Hyperliquid › Edit account › **Remove account** with **Also remove the API wallet from Hyperliquid** ticked (your wallet signs once; that account leaves goodcryptoX too, and the other accounts under the same API wallet stop trading), or remove it on Hyperliquid itself.

## The passkey on this computer

The panel asks for your passkey (Touch ID) when you open it in a browser on this computer, and again after 5 minutes with no goodcryptoX page on screen ([Signing in](../panel/signing-in.md#protecting-the-panel)). It protects the panel against a person who uses your unlocked Mac while you are away, the key store's unlock included. It protects only while it is on: if you pressed **Not now** at the first opening, or turned Settings › General › **Ask for Touch ID to open the dashboard** off, anyone at your unlocked computer can open the panel. On a Mac it is reset only from the menu bar's **Reset passkey…**, after your Mac's own password; `gcx passkey reset` typed in Terminal refuses there. It does not cover Telegram's buttons or the `gcx` commands, which keep their own guards. Honest limit: a program already running as you can still reach goodcryptoX's control channel; the Mac's password guards against a person at the keyboard, not against such a program. Your Mac's own screen lock stays the first guard.

## A phone or another computer

goodcryptoX can be opened from a phone, or from a laptop when goodcryptoX runs on a server or a NAS. The panel then comes through our relay, encrypted end to end between that device and the machine that runs goodcryptoX: the relay cannot read or change what passes. It sees that your machine and a device are connected, their internet addresses, when and how much; it can drop or delay a connection.

What you trust is the page your device opens first: it comes from our server. Whoever could change that page (someone who can publish to our server, the internet name it lives under or our hosting account, or the hosting company itself) could, for every person who opens it while it is changed, act as that device: on a device that can trade, anything you can do there, which is the whole account; on a Read-only device, read what the panel shows, never the signal addresses or the partner key. At a pairing it could also add a device of its own, which shows in your list of devices until you remove it. A session it opened could go on from elsewhere until you remove that device or goodcryptoX restarts; it could not sign in again by itself, nor read what passed before. Nothing in goodcryptoX detects such a change. Read-only is the bound for a device that should never trade.

- **A stolen phone** gives nothing without its screen lock; within 15 minutes of its last use it is still signed in. Remove it from your list of devices.
- **A pairing link** works once, for 10 minutes. The link a server prints in its log is a key: never paste it.
- **A passkey saved in iCloud or Google** works on your other devices in the same account, with the switch of the device it was made for.

## When you want everything stopped

Use the lists' shortcuts: **Cancel all** at the end of the filter row on **Open orders** cancels every order the list shows, and **Stop all** on **Bots** stops every running bot it shows; set the filter to *All pairs and accounts* first to reach everything. Each asks first with the count, then sends one cancel or one Stop each, as if you pressed them row by row. A bot's Stop closes its position only if its "Close pos. on stop" says so; other positions stay open: close them with **Close all** on **Positions** (it asks first and closes each one as **Close position** would; where a bot holds a part, it asks whether to keep the bots or stop them too, and never sells a bot's part from under it), or with **Close position** on each. Orders you placed outside goodcryptoX are cancelled too when the list shows them (Source: *All orders*); a bot's orders are left to its Stop, so press Stop all first. The details are on [Lists](../panel/lists.md#cancel-all-and-stop-all).

Removing an account from goodcryptoX is not a stop: goodcryptoX leaves the exchange as it is (resting orders rest, positions stay open) and stops watching them, its own stops included.

## goodcryptoX's own stops need goodcryptoX running

A stop, trailing stop or take-profit that goodcryptoX watches itself fires only while goodcryptoX runs and has prices. goodcryptoX keeps your Mac awake while it watches one, but a closed lid still sleeps it. When goodcryptoX comes back, the coin's first trade decides such an order: still past its level, it fires at market then (a late stop-loss still prevents a bigger loss); back inside, it stays armed ([After goodcryptoX was off](../trading/missed-orders.md)). In this version every stop-loss is goodcryptoX's own: Hyperliquid's stop-losses, which work while goodcryptoX is off but trigger on the mark price, are not offered. See [Order types and options](../trading/order-types.md#resting-on-the-exchange-or-watched-by-goodcryptox).

## Telegram's buttons

Telegram's shortcut buttons act as you. "Ask before a Telegram shortcut acts" guards against a mistaken tap, not against another person: anyone who can use your Telegram can confirm too. If someone else can use your phone or your Telegram, turn the buttons off in Settings › Alerts.
