# Cases: the row kinds

Every row of a case is one entry of goodcryptoX's ledger, `{seq, entry}`, with `entry.type` one of the kinds below. A row that made a notification carries its sentence (`say`) and the timeline reads it as Telegram did; any other row reads as `case.row.<kind>`. Order rows name the order (`orderId`) and its attempt: one order is sent as one or more attempts, each with its own client order id (`cloid`). Times are milliseconds since 1970 (UTC). Schemas: [`journal-row`](../schemas/journal-row.schema.json), [`runtime-entry`](../schemas/runtime-entry.schema.json), [`bot-entry`](../schemas/bot-entry.schema.json).

## The order engine's inputs

## `create`
An order was created (by you, an agent or a bot): the command as checked, its side and size, the price then.

## `attach`
Take-profit and stop-loss were attached to a position (`id` is the bracket).

## `attach-order`
Take-profit and stop-loss were attached to an order already placed.

## `edit-bracket`
Take-profit and stop-loss were changed.

## `tick`
A price of the order's coin. Only the last of each 5 seconds and the one before each send are kept; the rest are counted in `header.trimmed.ticks`.

## `timer`
A timer of the order came due (a delay, a trigger's timeout, an expiry, a re-send).

## `intent.recorded`
goodcryptoX wrote down an attempt with its client order id before sending it (write-ahead).

## `position`
The position goodcryptoX follows (from fills) or a fresh read of the exchange's position.

## `cancel`
Someone asked to cancel the order.

## `modify`
Someone asked to change the order's price.

## `resend`
The order was sent again from repair with one click.

## `execute-now`
Older journals only: an answer to the missed list, now refused `not-missed`.

## `place-back`
Older journals only: an answer to the missed list, now refused `not-missed`.

## `cancel-all`
A cancel of every order of the account or of a coin (kill-all's, in a ledger written before 2026-10-05).

## `release`
The account these orders are on was removed: goodcryptoX stopped following them and left them as they were on the exchange.

## `gap`
Prices of a coin were missed (goodcryptoX was away or the feed stopped); the range they moved through.

## `accepted`
The exchange accepted an attempt.

## `cancelled`
An attempt ended cancelled, and why (`requested`, the exchange's own reasons).

## `fill`
A fill of the order: its size, price and fee, and the exchange's fill id.

## `lookup`
goodcryptoX looked an attempt up at the exchange by its client order id (after a lost answer or a restart): whether it was found.

## `rejected`
The exchange refused an attempt, with its reason and text (see [the answers](errors.md)).

## `unknown`
An attempt was sent and no answer came: its outcome is not known until a lookup.

## goodcryptoX's own entries

## `runtime.gap`
goodcryptoX was away (asleep, stopped, updating), and later when that settled.

## `runtime.drain`
goodcryptoX began to stop sending new risk: an update or a shutdown (or kill-all, in a ledger written before 2026-10-05).

## `runtime.resume`
Trading resumed after kill-all, in a ledger written before 2026-10-05, when kill-all was removed; it changes nothing now.

## `runtime.marketdata`
Market data changed state (a feed stale or absent, recovered, a market halted).

## `send`
The bytes of an order, a cancel or the referral line were signed and about to leave (write-ahead), with the nonce they carry.

## `write`
A leverage, margin or outside-order cancel was signed and about to leave.

## `request`
A manual order's command was answered (who asked, under which id, and the answer).

## `funding`
A funding payment on a coin.

## `source.added`
An account was connected (its addresses appear only as `a:` references; its name is `<stripped>`).

## `source.active`
The account's API wallet was approved.

## `source.renamed`
The account was renamed.

## `source.removing`
The account is being removed, and what was chosen for its orders.

## `source.removed`
The account was removed.

## `source.restored`
A removed account was restored.

## `source.referral`
The referral line was sent or declined.

## A bot's entries

## `bot`
One input of a DCA bot: its creation and settings, a command, a timer, the allowance it read, a position or a liquidation, a price it heard.

## `bot.notify`
The bot's notification switches changed.

## `bot.mismatch`
A difference with the exchange was marked as known.

## `attention.done`
The person pressed Done on a row of the Dashboard's "Needs your attention" section; the key names the row's kind, what it was about and the episode (for a bot whose position differed: `position:<bot>:<when it opened>`; for an account waiting under the exchange's allowance: `rate-address:<account>:<nonce>`). Nothing else changed: the bot stays paused until its choice, the waiting actions go on.
