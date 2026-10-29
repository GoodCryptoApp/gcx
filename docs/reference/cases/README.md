# Cases: what happened to an order or a bot

A **case** is goodcryptoX's own record of what happened to one order or one bot: the rows goodcryptoX's ledger holds about it, what goodcryptoX and the exchange said to each other around it, what was live on the account at that moment, and a small header. It is what "What happened?" shows you, what your AI agent reads, and what "Send to gcx" sends us. Its exact shape is [`case.schema.json`](../schemas/case.schema.json); the routes are in [Local API](../runtime/api.md).

## Reading one

- **From the API**, with any key: `GET /api/v1/cases/order:<order id>?timeline=en` or `GET /api/v1/cases/bot:<bot id>?timeline=en`. The ids come from the `orders` and `bots` snapshots. The case is built when you ask and nothing is written. `GET /api/v1/cases` lists the cases goodcryptoX stored (the ones sent, or held).
- **From an AI agent** (`gcx mcp`): the tools `cases` and `case` do the same.
- **From the panel**: **What happened?** is in an order's details, in a bot's details and on each row of "Orders waiting for you" on the Dashboard (not on the rows of the lists). It builds the case when you press it and shows when it was built, the version of goodcryptoX, and the timeline with your accounts' own names where the API shows their ids; a note says when the size limit left rows, exchanges or price ticks out, or when the record of the traffic no longer reaches back (an order older than 7 days, or less when the Logs size set in Settings › Installation › Storage is reached first). Nothing is kept until you send it.
- **The timeline** is one line per step in time order. A step of an order reads `case.row.<kind>` (see [the row kinds](rows.md)); a message goodcryptoX and the exchange exchanged reads "goodcryptoX → Hyperliquid: order" or "Hyperliquid → goodcryptoX: order 200", followed by what the answer meant when it was a failure (see [the answers](errors.md)).

**Runtime state:** `GET /api/v1/cases/runtime?timeline=en` builds goodcryptoX's state and recent log without storing anything. Settings › Installation › Reports offers **Send to gcx** even with automatic reports off. Its timeline is the open warnings, and its snapshot covers all accounts. `POST /api/v1/cases/runtime/send {note?}` stores and sends it with the same personal scope as any other send.

## What a case holds

| Part | What | Never |
|---|---|---|
| `header` | goodcryptoX's version, the system and Node versions, a random number that stands for your goodcryptoX (`install`), the window it covers, whether the traffic log still reached back that far (`wireKept`), what was trimmed to fit | your install id, your addresses |
| `accounts` | each account as `a:<gcx's own id of it>` and its kind (main, sub-account, vault, API wallet) | its address or its name |
| `rows` | the order's (or the bot's) own rows from its creation if that was within 24 hours, else from 10 minutes before its end; the account's other fills, position reads, gaps and drains from 2 minutes before; the coin's prices, the last of each 5 seconds and the one before each send | balances, margin, account values, labels, Telegram ids |
| `exchanges` | each request and answer about the account, as it went or came, with the replacements below; the exchange's reads of balances and limits only as their shape | signatures, addresses |
| `runtime` (requested runtime cases only) | shell and browser family, memory and processor use, uptime, free disk, open warning texts and up to 1,000 redacted log objects | keys, current names, folder paths or network addresses; an earlier account name can remain |
| `snapshot` | every open order (including a bot’s resting children), bot and position of the account, sizes in coins | balances, margin, profit in dollars; a liquidation price on a cross position |

**Replacements**, the same in every part: an address goodcryptoX knows becomes `a:<id>`, one it does not `a:unknown1`, `a:unknown2`…; goodcryptoX's public builder address stays. A signature is `<stripped>`, a transaction hash `<stripped>`, a 64-digit hex string `<hex64>`, any other run of 32 letters, digits or base64 signs (`+ / = _ -`) `<long>` (goodcryptoX's own ids, client order ids and references are kept), a dollar figure in a text `$<n>`, a home folder `~`, and Hyperliquid's address-budget refusal is cut after its first words. A case is at most 1 MiB; an answer over 256 KiB is kept as its shape and size only.

The runtime case has no journal rows, exchange traffic or `wireKept`. Its log is read from the end of the daily files, at most 2 MiB, in 64 KiB chunks. Unknown log fields keep only their type; absolute folder paths keep the last segment. Oldest log lines are cut first to fit the 1 MiB budget, with the person’s note and stored id already counted, and `header.trimmed.log` names how many were left out. A torn line keeps only `{kind: "torn", bytes}`.

**The last check.** Before a case is stored to be sent, goodcryptoX reads it once more for any `0x` address of 40 hex digits (other than the builder's) and any address it knows. If one is found, the case is kept on your machine as **held** and never sent. Our server runs the same check.

## Sending one

In the panel, **Send to gcx** sits under the timeline of the case: a line of your own (up to 500 characters; never a key or a passphrase), the size, **See what will be sent** (the case as it will travel), and a question first that says what leaves your machine, in the [privacy policy](../../legal/privacy.md)'s words. The answer is shown as it came: sent, not sent yet (our server did not answer; **Send again** works while the view is open), held (an address was found; it stays on your computer) or refused (with our server's words).

"Send to gcx" (or `POST /api/v1/cases/<id>/send` with your own line) stores the case and sends it at once: `sent`, `waiting` (our server did not answer: send it again later), `held` or `refused`. Only you can send one; an access key cannot. Our reports server is not running yet, so a case you send is kept as `waiting`; `POST /api/v1/cases/<its c: id>/send` posts it again (the id is in `GET /api/v1/cases`, and Settings › General › [Reports to goodcryptoX](../../reports.md) lists it with **Open** and its Send). The case stays in your data folder for good. Cases are pseudonymous, not anonymous: order ids and exact sizes can be matched to an address against public exchange records where available ([privacy policy](../../legal/privacy.md)).

## Cases goodcryptoX opens by itself

Unless you turn reports off (Settings › General › [Reports to goodcryptoX](../../reports.md)), goodcryptoX opens a case by itself when something goes wrong, and sends it a few minutes after it settles. `header.origin` is `auto` and `header.trigger.kind` says what opened it:

| `trigger.kind` | What happened | About |
|---|---|---|
| `rejected` | The exchange refused an order, or goodcryptoX refused to send it (a coin not offered, a market order it could not price); `class` and `pattern` say which refusal ([the answers](errors.md)) | the order |
| `unknown`, `not-placed` | an order's answer never came (and, two minutes on, it still needs you); the exchange proved it never placed it | the order |
| `exchange-error` | a leverage or margin change, an external order's cancel or the referral line refused, with its class | the account |
| `notify-alert`, `notify-page` | goodcryptoX sent you an alert or a page (`template`: which message) | the order, the bot, or goodcryptoX itself |
| `journal-only` | goodcryptoX noted something it did not expect: an answer for a send it never made (`unknown-send`), a change to an order the exchange refused (`modify-rejected`) | the order |
| `crash` | goodcryptoX stopped without its stop: `crash` holds the error when it was an error in goodcryptoX | goodcryptoX itself |
| `refusal` | an answer or a stream message from the exchange goodcryptoX could not read (`status`: which) | the account |
| `unreachable` | The exchange did not answer for two minutes | the account, or goodcryptoX itself |
| `cut` | a price bound cut an order short: an immediate order filled only in part, or the rest sent again | the order |
| `approval-error` | The exchange refused an approval your wallet signed (the API wallet, the builder fee) | the account |

**Joining.** The same kind, class (or reason) and pattern on the same order, bot or account joins the case while it is open: `trigger.occurrences` counts them. Of one kind, class and pattern, at most 20 cases are opened in a UTC day; past them an occurrence joins the day's last case as `trigger.more` (on one already sent, it is counted beside it in the list's `more`). A case closes 2 minutes after its last occurrence once none of its order's sends has an unknown outcome, or 30 minutes after it opened, and is then built with each row's sentence (`say`). A command the API refuses (a 422) opens no case; nor does a planned stop or update, or anything on a demo account. In `GET /api/v1/cases` a case still open has `sending: "collecting"`; a closed one waiting has `sending: "queued"` (sent by itself), `"off"` (closed while reports were off) or `"skipped"` (past the backlog of 500 or 50 MB): those last two go only when you press Send.

**The daily usage record** is not a case: `GET /api/v1/usage` lists each one built (or, with reports off, the daily sign that goodcryptoX exists) with where it stands, and the random number that stands for your goodcryptoX ([pulse.schema.json](../schemas/pulse.schema.json)).
