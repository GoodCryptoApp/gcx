# Privacy policy

Version 4 · 31 October 2026

**What changed:** Version 4: access keys for AI apps and programs are kept encrypted in your data folder, so you can show them again; daily records say how much of the traded volume carried our fee, and an order filled without our fee is reported even with reports off. Version 3: Remote app and program connections, saved computer identities and their deletion, encrypted relay traffic and connection logs in test versions.

goodcryptoX runs on your computer. GoodC International Ltd., British Virgin Islands, provides it under our [terms of service](terms.md). You have no account with us, and goodcryptoX uses no analytics service or tracking.

## What stays on your machine

Your data folder holds accounts, encrypted trading keys and access keys, orders, trades, positions, bots, balances with a daily record of them, notes, settings, a proxy's login if you set one, chart layouts, logs, backups, downloaded updates and translations, and paired browser and program connections: each one's name, public key, and pairing and last-use times; browser connections also have a trading-permission switch. If you linked Telegram, it also holds your bot’s token and message copies. Your system or a passphrase unlocks these keys; browser passkeys can sync through your own password provider. Logs stay for 14 days at most, within the size you set in Storage (200 MB by default); exchange traffic is compressed after each hour and kept for 7 days or three quarters of that size, whichever comes first. Display choices stay in your browser. The installation’s signing key identifies its messages to our servers, but cannot trade or withdraw. A copy of the data folder or a move-export file contains private data, the paired devices and connected computers included: keep it safe. After a move, the earlier data stays in a `moved-<date>` folder in the data folder until you delete it.

On another computer, the connector keeps a private signing identity for each installation in your user account's private local files, with connection names, the local address and connection preferences. It does not sync these files or store an access key or pairing code. Your app or program holds its own access key. Pairing lets the computer connect; the key controls what it can read or do.

The setup download or copied settings contain a one-use pairing code, valid for up to ten minutes. Anyone holding it can pair a computer until it is used, canceled or expires. That pairing lasts until removed in Devices; an access key is still needed to read data or trade. The expired code may remain in the file or settings. Keep live setup private.

## What leaves your machine

Each recipient below sees your IP address, except exchanges reached through a proxy:

- **A proxy you set:** every exchange connection goes through it; the exchange sees its address instead of yours; it sees which exchange, when and how much, not the contents.
- **Hyperliquid:** account-data and market-data requests, signed orders and account actions, and wallet approvals. Its blockchain publicly records trades, orders, positions and our builder fees.
- **Hyperliquid’s website:** requests for public coin logos, by coin name, without your account or wallet.
- **GitHub:** version checks and update downloads, including the release channel and machine type. Docker installations download their image from its container registry; their updater asks it for a newer one every hour (every 5 minutes on Internal), with the server's own registry login where it has one.
- **Reown / WalletConnect:** wallet-connection events, your wallet address, the panel address and signing requests. A wallet provider you choose, such as Coinbase, may also receive connection data under its own policy.
- **Telegram, if linked:** your bot’s messages, account-related alerts, shortcut actions and message requests.
- **Our Telegram setup server:** temporarily receives a new bot’s identity and the Telegram id of the account that created it, passes its token and that id to goodcryptoX (kept there until your chat is linked or you disconnect, so goodcryptoX can write to that account to link it, and only that account’s Start can) and once sets the new bot’s profile photo to our manager bot’s. Telegram lets our manager read or replace these bots’ tokens. Your own bot avoids this server; see [Telegram](../telegram.md).
- **Our relay, while a browser, app or program is connected or pairing:** carries end-to-end encrypted traffic; it cannot read your access key, requests or replies. It sees connection identifiers, IP addresses, times and sizes, and keeps a routing identifier and your installation's last offline time. Public versions produce no connection log; Internal and Beta versions log connection events and an installation identifier, never traffic contents or IP addresses. For browser connections, our page stores the paired installation, a key that lets the open tab reconnect for 15 minutes, a service worker and cached goodcryptoX files.
- **Our reports server:** anonymous problem reports and daily usage records, with order/bot details, diagnostic events, system/version information, the running tier and traded volume, with the part that carried our fee, under a random installation number and its signing key. No keys, account addresses or names, balances or Telegram ids are included. A note you add is sent as written. A report you send yourself also carries goodcryptoX's recent log, with names, folder paths and network addresses removed; an account's earlier name can remain. Daily records add goodcryptoX's memory and processor use. Turning automatic reports off leaves only a daily sign that the installation exists, and a report of any goodcryptoX order filled without our fee, which we always receive because the fee is part of our terms. Internal test versions also send these figures, free disk and alerts once per run past an hour, even with reports off.
- **Our partner-code server, if you enter a code:** the code, installation public key and version, and signed order records with account addresses and order numbers. We read those accounts’ public trades to pay the partner. This reporting is independent of the Reports switch and cannot be turned off while the code applies. If you add a partner key, goodcryptoX sends it with the installation public key to show your codes' figures; nothing of it is kept.
- **Our news service, only if you subscribe:** your email address, for goodcryptoX news, on the website’s waitlist.
- **Our translations site:** requests for your chosen language, without an installation identifier; English needs no request.
- **AI providers:** Anthropic may process reports and partner records for us. An AI agent you authorize can send data its access key permits to the model provider you choose, under that provider’s policy.

Our services run on Cloudflare, under its terms, and do not retain IP addresses. A trade in an anonymous report can be matched to its public Hyperliquid address, which does not itself name a person.

## What we hold

We use reports and daily usage records to fix problems and improve goodcryptoX, keeping them for 180 days and retaining aggregate totals. Partner order records stay while we pay partners; their public trades are kept for 30 days after a day is counted, or while paying the partner. Partner payout records remain in our accounts. We hold subscribed email addresses for news and correspondence to answer you. Our download link, a web address and not the app, counts each click's source, the file chosen, country and device kind in our own records and in Google Analytics, and keeps nothing about you. These records do not give us your trading keys or control of your funds.

## Deleting your data

Removing an account without keeping its history restarts goodcryptoX to erase its local records; logs, shared wallet records still needed by another account, sent messages/reports and saved exports may remain. Settings › Installation › Storage can delete a removed account’s history, or completed history up to a chosen month, on this computer. Quit goodcryptoX and delete its data folder to remove that installation's local data and keys. On each computer used for remote apps or programs, delete the connector's saved files, downloaded setup and goodcryptoX connection settings separately. This does not erase the exchange’s public records, Telegram messages or copies already sent elsewhere. To delete our reports and daily records, email info@goodcrypto.app with the installation number shown in Reports; deleted within 30 days. Use the same address to leave the news list or ask about partner records. Your wallet can revoke the API wallet on the exchange.

## Changes and contact

We may publish a new policy; using goodcryptoX afterwards means you accept it. Check its version and date in Settings. Later versions briefly describe their changes under the date.

Questions: info@goodcrypto.app
