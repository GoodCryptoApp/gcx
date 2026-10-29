# Notifications

The runtime tells you what happened to your bots, your orders and your prices. This page says which events become a message, when, and in what words.

Link your bot in [Telegram alerts](../telegram.md#connect). With **Shortcut buttons** on, messages about bots and orders include the [actions available for them](../telegram.md#shortcut-buttons).

## Three kinds of message

- **Information**: something you planned happened (an order filled, a stop triggered). A switch can mute some of these.
- **Alert**: something went differently from what was planned, and the runtime is handling it. Alerts cannot be muted.
- **Needs you**: the runtime cannot go on without you. These end with "Needed from you: …" and cannot be muted.

Nothing you or a bot planned is ever sent as an alert.

## What is sent when

| Event | Template id | Kind | Switch |
|---|---|---|---|
| An account-percent bot’s unfilled orders resize after a leverage change | `grid.resized`, `dca.resized` | information | Grid: Range, follows, resizes; DCA: Bot stop or error |
| An active Grid or DCA position comes within the selected distance of its liquidation price | `bot.liquidation-near` | alert | Alert when the price is … from liquidation (Trading) |
| A Grid follows the price, re-enters its range or changes new opening sizes through Reinvest/account sizing | `grid.range`, `grid.resized` | information | Range, follows, resizes |
| A Grid or DCA Modify takes effect, made by an agent or a program, or a change you made for the next cycle when that cycle starts | `grid.modified`, `dca.modified` | information | Grid: Starts, stops, changes; DCA: Bot stop or error |
| A Grid position is liquidated | `grid.finished` with its liquidation reason | information | none |
| A DCA bot's entry fills | `dca.executed-enter` | information | fills, level 0 |
| A DCA bot's averaging order N fills | `dca.executed-safety` | information | fills, from level |
| A DCA bot's take-profit or stop-loss fills | `dca.executed-tp`, `dca.executed-sl` | information | take-profit and stop-loss |
| A manual order fills (in part, or in full) | `order.partial`, `order.fill` | information | Manual orders placed from goodcryptoX |
| A manual stop triggers; a trailing stop starts trailing | `order.open-stop`, `order.trail-active` | information | Manual orders placed from goodcryptoX |
| An order placed outside goodcryptoX fills: title "… fill (external)", the fill's size and price | `order.fill-outside` | information | Orders placed outside goodcryptoX |
| An order needs repair | `repair.order` | needs you | none |
| An order alert: an exit or a triggered order retried, part of an order not filled, a stop crossed while prices were missing, a late fill, a fill over the size, an order never placed, a position that changed side so its exits were ended | `order.alert` | alert | none |
| A price feed is delayed | `md.stale` | alert | none |
| The price feed is live again (only after a "delayed" message) | `md.recovered` | information | none |
| No price at all (no longer sent since 2026-10-05; an older one still shows) | `md.absent` | needs you | none |
| The exchange halted trading on a market group | `md.halted` | information | none |
| Prices that could not be checked against your stops (no longer sent since 2026-10-05; an older one still shows) | `md.gap-overdue` | needs you | none |

A repair whose reason has no wording is still sent: "Unrecognised error." with the reason in the detail line. Every reason the engine raises today has its sentence; `fills-missing` reads "A fill was reported but its details have not arrived" (the order waits in repair: a later fill closes it, and Retry sends only the rest); `missed` (a stop or trailing order whose trigger was crossed while goodcryptoX was off, asleep or without prices, held for you) reads "Not placed: its trigger was crossed while goodcryptoX was off, asleep or without prices. It waits for you in the missed list."; an order on the missed list because the exchange's answer to it was lost reads "Not sent again by itself: the exchange's answer to it was lost, and goodcryptoX could not establish in time what became of it. It waits for you in the missed list." (its `reason` is `missed` all the same)

Not sent, only kept in the record: an order send whose outcome is not known yet (the runtime resolves it), and a change the exchange refused (you already see the refusal where you asked for it).

A bot's own orders never appear under Orders: their fills are told by the bot's messages. When one of them needs repair, the message is the bot's.

The DCA bot's own messages (its stops, a level not placed, its repairs, a liquidation) are in the bot's pages. "Waiting for funds" arrives with the part that produces it.

## The runtime's own messages

| Event | Template id | Kind | When |
|---|---|---|---|
| The API wallet expires within 30 days, within 7 days | `account.agent-expires` | information | once per wallet and threshold; checked every hour while Telegram is linked |
| The API wallet expires within 24 hours | `account.agent-expires-day` | needs you | once per wallet |
| The API wallet expired | `account.agent-expired` | needs you | once per wallet |
| goodcryptoX started with its key store locked | `runtime.locked` | needs you | once until a start that unlocks: restarting while locked sends nothing more |
| goodcryptoX was away (asleep, not running, updating) and something happened meanwhile | `runtime.away` | information | once, when the exchange has been read again and the late fills' window (3 minutes) has passed; per bot and manual order in the order they came, a line per message of that time (`•`) and its state now (`↳`, `runtime.away-now`); a manual order closed with no message (`runtime.away-order`), a trailing stop's extreme from that time (`runtime.away-trail`), a page of that time (`runtime.away-page`) and the API wallet's reminder are lines too; a time away with nothing in it sends nothing |
| Something goodcryptoX cannot settle by itself (a fill on a position goodcryptoX does not manage was a liquidation, the disk is full, an order held for "Send now or cancel", an answer from the exchange it does not know) | `runtime.page` | needs you | once per text while goodcryptoX runs |
| Another copy of goodcryptoX reads the same bot | `runtime.poller-stopped` | needs you | once; goodcryptoX stops reading the bot and keeps sending |
| An agent's trading key met one of its limits (largest order, 24 hours, leverage; a bot's ladder counts as its orders) | `agent.limit` | alert | once per agent and limit, until a command of it that fits that limit is accepted; a restart of goodcryptoX starts afresh |

## Price feed messages

When the prices goodcryptoX needs for your stops and bots stop coming, goodcryptoX says so, once per episode while goodcryptoX runs (it does not repeat while the trouble lasts). A restart of goodcryptoX or a wake from sleep starts a new episode, so "delayed" can come again, and a "live again" still owed then is not sent. They cannot be muted.

| Message | Kind | What it says |
|---|---|---|
| **Price feed delayed: BTC on Hyperliquid** | alert | After 30 seconds without a part of the feed: "Connection (or Trades, Orderbook, Mark price, ...) silent since 12:00:00 UTC. Stop-losses on the exchange still fire there; those goodcryptoX fires itself may wait for the price." Also when there is no price at all: a silent feed is never paged and holds nothing. |
| **Price feed live: BTC on Hyperliquid** | information | Only after a "delayed" message: "Live again at 12:02:30 UTC (delayed 150 s)." |
| **Stops unchecked: BTC** | needs you | No longer sent since 2026-10-05 (after any gap the coin's first trade decides each stop; the prices of the time away are read for the report only); an older one still shows. |
| **Trading halted: xyz** | information | "The exchange halted trading on xyz." (nothing in goodcryptoX changes for it: the exchange refuses what it refuses) Not sent yet: nothing in goodcryptoX asks the exchange whether a market group is halted, so this message is written and waits for that check. |

Times are shown in your Telegram's own time zone. Several markets that fail in the same moment are one message.

## Switches per bot

Each bot has its own switches, copied from your defaults when the bot is created (Settings › Alerts › For new bots; the bot form shows them and you may change them for that bot):

- **Fills** and **from level N**: an entry or averaging fill at level L (the entry is level 0) is sent when fills are on and L is N or more. From level 3 means the entry and averaging orders 1 and 2 are not sent.
- **Take-profit and stop-loss**: their fills are sent when this is on.
- **Stops**: a bot's stop you or the bot planned (completed, stopped, closed, ended).

Repairs, alerts and market data messages are always sent. Manual orders have two switches in Settings › Alerts, both on at first: **Manual orders placed from goodcryptoX** (their fills and triggers) and **Orders placed outside goodcryptoX** (a fill of an order you placed with the exchange's own app or another tool, sent as "… fill (external)"; see [Telegram alerts](../telegram.md#what-you-get)).

## One message, not ten

- What one step of the engine says about one bot, one order or one market arrives as one message: the first event's title, then each event's lines in order, at the most serious kind among them. The exception is a fill: its title comes first, so a stop that triggers and fills within the wait is one message titled "filled" (or "partially filled" while the order is open), with the trigger line below the fill lines. A stop that was triggered and sent before it filled keeps its "triggered" message, and the fill is then its own message.
- Information waits a moment for more: it goes out 5 seconds after the last related event, and never more than 30 seconds after the first. The fills of one order in that time become one message; it shows the order's own total filled and average price so far, as the engine holds them. A fill the exchange reports again, one the order already counted, changes nothing and sends nothing: not while the message waits, not after it went out, and not after "filled".
- An alert or a "needs you" message never waits, and sends any information waiting for the same bot or order at once.
- An order's message says "partially filled" while the order is still open, with the total filled so far and the average price. When the order has filled, a "filled" message follows with the whole total and the average price of the order, even if a "partially filled" one went out before and nothing new filled after it. An order that is cancelled or ends part filled stays "partially filled".

## Words and numbers

- Languages: the twenty of Settings › General › Language, the one you chose there (English until you choose). Messages, buttons, their confirmations and answers and the panel link follow it from the next message on; a text with no translation yet is shown in English, text by text. Numbers take the language's style (`3.150,5` in German), and in Arabic and Hebrew each value keeps its left-to-right order.
- Numbers are written by the one rule the whole product uses (`docs/reference/number-display.md`). Prices and sizes show the digits the market trades in, at most five significant, with a comma every three digits and no zeros at the end (`3,150.5`, `3,180`, `0.000012`, `25,000`); a market's own limits cap them. Profit and loss is money with cents, in full, and signed (`+12.50`, `-24.05`, `+123,456.70`, never `123.5k`). Percentages are signed and lose zeros at the end (`+0.4%`, `+10%`, `+1.97%`), keeping two significant digits below 1 (`+0.012%`).
- Times are shown in your phone's own time zone; if Telegram cannot, in UTC (`14:02:10 UTC`).
- A message longer than 4,000 characters is cut at the end of a line and ends with "… cut; full text in the panel".
- A title is one bold line. Every order and bot title names the account (`{account}`, its name as the app shows it, at most 13 characters, a longer one cut in the middle): "Hyperliquid 2 ETH Limit order filled", "DCA Entry: Buy ETH Hyperliquid 2", "Needs repair: ETH Stop Market Hyperliquid 2"; a liquidation title opens with it and the hourly reminder ends with it; a message stored before the name existed reads the exchange's. The price-feed and maintenance titles keep `{venue}`.

## Template ids and words

English lives in one file keyed by template id or word, its shape [`notify-templates.schema.json`](schemas/notify-templates.schema.json); each language's translation is `locales/<code>/telegram.json`, the same keys flat (a template's `<id>.title` and `<id>.body`); an event as the engine writes it is [`notify-event.schema.json`](schemas/notify-event.schema.json).

- Templates: the ids in the table above. Each has a title (shown bold) and a body, plain text; `{name}` is filled from the event, and a line whose values are all empty is left out (a repair without a detail has no detail line). goodcryptoX adds the formatting itself: `{orderCode}` (the order in code style), `{detailCode}`, and the times `{sinceTime}`, `{liveTime}`, `{fromTime}` (the time) and `{sinceDateTime}`, `{fromDateTime}`, `{toDateTime}` (date and time), shown in your own clock. `{type:gen}` is a word in a form a language needs (`type.limit:gen`); `{stops#locked.stops}` is a count with its phrase per plural category (`locked.stops#one`, `#other`; Russian `#few`, `#many`).
- Words: `dir.buy`, `dir.sell`, `dir.auto` (the bot's direction), `did.bought`, `did.sold`, `action.buy`, `action.sell`, `word.at`, `word.cut`; `type.limit`, `type.market`, `type.stop-market`, `type.stop-limit`, `type.trailing-stop`, `type.trailing-stop-limit`, `type.trailing-reverse`, `type.trailing-reverse-limit`, `type.take-profit`, `type.stop-loss`, `type.close` (a Market order placed with goodcryptoX's market algorithm reads `type.market`); `why.<reason>` for each repair reason, and `why.unrecognised` for one without wording; `what.<code>` for each order alert; `md.what.<reason>` for each price-feed reason; `link.open` (the panel link's label); `link.linked`, `link.expired`, `link.invalid`, `link.disconnected` (the replies in the chat); `away.cause.sleep`, `away.cause.down`, `away.cause.update`; `away.state.<state>` (an order's or a bot's state in the away report: `filled`, `partial`, `cancelled`, `expired`, `rejected`, `closed`, `missed`, `repair`, `pending`, `trigger`, `resting`, `waiting-start`, `waiting-entry`, `entering`, `in-position`, `closing`, `cooldown`, `done`); `expires.thirty-days`, `expires.seven-days`; the phrases `locked.stops#…`, `locked.positions#…`, `allowance.requests#…`, `allowance.left#…`, `away.levels#…`.

## Delivery

Unsent messages survive a restart, but delivery is not guaranteed; Telegram can refuse a message and retries eventually stop. Messages are sent at most one every 1.05 seconds, the ones that need you first. If Telegram does not answer, goodcryptoX tries again (after 2 seconds, then 4, 8, up to 5 minutes apart) for an hour for information and a day for the rest, then gives up; Settings counts what was given up, and goodcryptoX's log has one line for each (its id and Telegram's reason, never the text). A message Telegram refuses to format is sent once more as plain text when it is an alert or needs you. Nothing that happened before you linked Telegram is sent.

## Bot messages

Grid fills include the trade, position and PnL. Range messages distinguish an exit above or below the range, re-entry, and a completed Follow move. Starts include the actual start price and range; price-triggered starts also show the activation price. Stops include the configured stop value where one caused the stop. Reinvest, investment as a total or share of the account, adopted coins, changed next-order sizes and trailing exits add lines to the relevant message. DCA entry, resize and applied-change messages include its investment and Reinvest figures.

The four Grid Notify me choices stay in place. Range, follows, resizes includes Follow and size changes from Reinvest or account sizing. Starts, stops, changes includes applied changes.

**What you do yourself sends nothing.** Launching a bot that starts now, stopping it, closing its position, changing it, a market order or a Close you place, a cancel, suspending an agent: done in the panel or with a Telegram button, the result is on the page at once and no message is sent. Launching an agent's proposal yourself counts as yours. What an agent or a program does through the API on its own is told, and so is everything that happens later by itself: a start at a price or a signal, a resting order's fill, a stop condition, a follow move, a liquidation warning. A failure is always told. An actual liquidation always arrives when Telegram is linked. **Alert when the price is … from liquidation** in Settings › Trading (also in the Trade cog) turns proximity alerts on or off and sets their distance, on at 10% by default. Proximity is measured from the liquidation price using the last trade: one alert per approach, rearmed once the distance exceeds your selected percentage. A saved change applies at the next price check. Turning off and on keeps an approach remembered until the price leaves the selected distance; it can rearm while alerts are off. It runs only while a running bot holds a perpetual position; stopping without closing releases the alert's trade stream demand, and the retained position no longer receives bot proximity alerts. Restarting keeps the approach remembered.
