# What the status words mean

Every word goodcryptoX shows about an order, a bot, a position or goodcryptoX itself, what it means, and what to press. The rule behind all of them: goodcryptoX never guesses. What the exchange confirms counts; a reply that never came is "unknown", not "not placed"; and anything goodcryptoX cannot settle by itself waits for you instead of being done late at a price you did not choose. A state goodcryptoX planned (checking an order, holding new orders during exchange maintenance) is never an alarm: you are told only when something went other than planned.

`{venue}` in an account or order sentence is filled with that account's exchange name (for example, Hyperliquid). Settings paths below use Hyperliquid as the example venue.

## Errors, three levels

An error reads the same everywhere (as goodcryptoX 2.0): first the word **Error** (something went wrong; a red badge in the lists, as goodcryptoX 2.0 drew it); under it, a sentence of ours saying what it was; and, behind a small control named **Raw message**, the exchange's or goodcryptoX's own words, unchanged. goodcryptoX 2.0 put them behind an (i) icon that nobody understood: here the control says what it opens. An order the exchange refused, an order goodcryptoX never placed and an order that filled nothing are errors in the lists, in the order's details and in a bot's orders list (which no longer hides them as cancelled); a bot that stopped on an error shows the same three levels in its status. A take-profit, stop-loss or fired stop that the exchange refused waits for you to Retry it and says the same: its sentence in the line, the exchange's words behind **Raw message** in the details.

## Orders

The Status column of **Open orders** and **History** on the Trade page, an order's details, and the order's line on the chart.

| You see | It means | What to press |
|---|---|---|
| **Waiting** | A stop or trailing order that has not fired, whether goodcryptoX watches it (marked *Internal*; it works only while goodcryptoX runs, [why](../trading/order-types.md#resting-on-the-exchange-or-watched-by-goodcryptox)) or the exchange holds it; and, in a bot's orders list, a level the bot has not sent yet. A **Delayed** order of yours reads **Open** while it waits for its delay; nothing is on the exchange until then. | Nothing. |
| **Sending** | Sent to the exchange; its answer is on the way. | Nothing: the row changes when the answer arrives. |
| **Waiting: post-only after the exchange's upgrade** | Hyperliquid refused it in the minutes after its upgrade when it takes only post-only orders; nothing was placed. goodcryptoX sends it again every 10 seconds until Hyperliquid takes it; the other orders that are not post-only wait behind it, in the order they came. | Nothing, or **Cancel**: a waiting order ends at once, nothing rests on Hyperliquid. ([The minutes after an upgrade](../reference/hyperliquid.md#maintenance)) |
| **Held: maintenance**, **Held: goodcryptoX stopped**, **Held: disk full** | goodcryptoX decided this order, which opens or adds to a position, but holds it unsent ("Not sent", below); the details' Reason says why. | **Send now** (asked first) or **Cancel**. A bot's order shows **Bot**: answer it in the bot. |
| **Open** | Resting on the exchange's orderbook. | **Cancel** or **Repeat** if you want. |
| **Partially filled 0.1 of 0.3** | Part of it filled and at least one size step of the rest is still working. A fill within one size step of the order's size reads **Filled**. | Nothing, or Cancel the rest. |
| **Cancel requested** | goodcryptoX sent your cancel; the exchange has not confirmed it yet. | Nothing: it cannot be canceled twice. |
| **Filled** | Done. | **Repeat** or **Reverse** fill the form with it again. |
| **Canceled**, **Canceled, filled 0.1 of 0.3** | Canceled, by you or by goodcryptoX (a take-profit no longer needed), with what had filled. The details' Reason says by whom: **Canceled by user** for an order you canceled (Cancel, Cancel all), **Canceled by exchange** for a stop the exchange removed before it fired; hover the word in the list for the same line. A bot's order has no such line: the bot's own status says why it ended. | Nothing. |
| **Error** and a sentence | The exchange refused it, goodcryptoX never placed it, it matched nothing, or a stop (Stop Market, Stop Limit, Trailing, a bot's take-profit or stop-loss) fired and its order then failed: "Not enough funds for this order", "The order was never placed", "Nothing on the exchange to match this order against" Nothing rests. The order's details and a bot's orders list add a small **Raw message** control: it opens the exchange's own words, or goodcryptoX's, unchanged (for example "Insufficient margin to place order."). [The three levels](#errors-three-levels). | Correct what the sentence says and send it again. |
| **Expired** | Its time in force ended and goodcryptoX cancelled it. | Nothing. |
| **Checking with Hyperliquid** | The exchange's answer to this order was lost (a dropped connection, a restart at the wrong moment). goodcryptoX looks the order up by its own id, and sends nothing for it meanwhile. Usually settled within two minutes. Not an alarm. | Nothing. Details: [When goodcryptoX gets no answer](../trading/lost-answer.md). |
| **Unknown:** and a sentence | The order needs repair: goodcryptoX could not finish it by itself and holds it, sending nothing more for it, and tells you once. The sentence says why (table below). On the chart its line is grey and dotted, marked Unknown with the sentence under it. | **Retry** (asked first) or **Cancel**; see below. |
| **Left on Hyperliquid** | You removed its account from goodcryptoX; goodcryptoX left the order on the exchange as it was, not cancelled, and no longer watches it. | Manage it in the exchange's own app. |

### The reasons after "Unknown:"

The same sentence is the order's details, its chart line and the message goodcryptoX sends you.

| Sentence | What happened |
|---|---|
| "The order's state on the exchange is unknown" | Still no answer from the exchange two minutes after the send. goodcryptoX keeps checking; if the answer comes, the order carries on from it by itself. |
| "The outcome of the cancel is unknown" | Your cancel got no answer, or the exchange said there was nothing to cancel and a lookup found the order neither cancelled nor filled. |
| "The stop fired but its order could not be filled" | A stop goodcryptoX watched fired and the exchange refused the order it sent. |
| "The exit could not be completed within the price limits." | A protective exit (stop-loss, take-profit, Close) filled nothing even 10 % through the best price. |
| "The exchange stop is missing on the exchange" | A stop-loss resting on the exchange as its own trigger order had not filled 30 seconds after the last trade crossed its price. |
| "The exchange canceled the order" | The exchange removed it without a fill (margin, liquidation, or another reason, which the details show). |
| "The exchange rejected the order" | The exchange refused a protective order, or a stop-loss of its own. |
| "The exchange refused the reduce-only order." | The exchange answered "Reduce only order would increase position" while the position was not flat. |
| "The exchange refused the new size" | goodcryptoX re-sized a take-profit or stop-loss after a fill, twice, and the exchange refused it. |
| "The change and the restore were refused: nothing of this order rests" | A change to the order failed both ways: the change was refused, and putting the old order back was refused too, so nothing of this order rests on the exchange. |
| "A fill was reported but its details have not arrived" | The exchange said the order executed, usually a market entry, and the fills did not arrive within 3 minutes. The order waits: a later fill closes it, and **Retry** sends only the rest. |
| "Sent 4 times, never placed: Retry or cancel" | goodcryptoX sent this order four times; each answer was lost and each send was proven never placed, so none reached the exchange. |
| "The exchange has this order: check it and your position" | goodcryptoX had concluded this order was never placed, but it turned up after all; goodcryptoX treats the one found as the order. |
| "The exchange returned an unrecognized error" | An answer goodcryptoX has no rule for. |
| "The order was never placed" | The exchange proved it never received the order, but a second send could double it (another send of the same order is still live, or the send was recorded before goodcryptoX marked its sends for a proof). |
| "Needs a look (…)" | A reason that has no sentence yet; the word in brackets is goodcryptoX's own name for it. |

**What to press.** The order's details, and **What happened?** in them, show each step and what the exchange said ([Cases](../reference/cases/README.md)); **Send to gcx** there sends it to us if you want help. On the order's row and in its details:

- **Retry** sends the order again as it stands (a cancel of it whose answer was lost is sent again instead, and the order goes on once the exchange confirms it). It is asked first. It is refused while a send of the order still has no answer ("goodcryptoX is still checking with the exchange; wait for the answer."), so an order whose sentence is "The order's state on the exchange is unknown" shows only Cancel. An order that opens or adds to a position is re-sent only while goodcryptoX may send new orders (not during exchange maintenance, a full disk, a start or a stop).
- **Cancel** cancels it: what rests on the exchange is cancelled there, and the order closes.

A bot's order in repair shows **Bot** and is answered in its bot (below). The same buttons are in the API: `POST /api/v1/orders/{id}/resend` and `/cancel` ([API](../reference/runtime/api.md)).

### "Not sent"

When goodcryptoX holds an order it decided but did not send, it tells you with one of these, and a bot's details show the same reason on a **Not sent** line:

Only an order that opens or adds to a position is ever held; exits and cancels go (during exchange maintenance they wait and go by themselves when it ends). After any gap nothing is held: what came due meanwhile is sent when goodcryptoX is back ([After goodcryptoX was off](../trading/missed-orders.md)).

- "Not sent: goodcryptoX stopped before sending it." It was decided while goodcryptoX was stopping (a quit, an update); the next start sends it by itself.
- "Not sent: the disk is full." Free space: it goes by itself once there is room, or cancel it. While the disk is full goodcryptoX sends nothing at all (a line on the page says so); everything that waited goes by itself once there is room.
- "Not sent: Hyperliquid was in maintenance when it was due." It goes by itself when the maintenance ends, however long it waited.

The messages end "Send now or cancel". The order's row reads **Held:** and the reason in short (above), with **Send now** and **Cancel**. **Send now** sends it once, as it was written down, and is refused while goodcryptoX may not send new orders yet (the maintenance, the disk, a stop). **Cancel** ends it where it is: nothing is sent to Hyperliquid. For a bot's held order, use its **Stop** or **Close pos.**. In the API: `POST /api/v1/orders/{id}/send-now`.

## Bots

The Status column of the **Bots** list (the word, with its line under it on hover; the list and the details say the same word) and the top of a bot's details.

| You see | It means | What to press |
|---|---|---|
| **Waiting** · Waiting for entry order | A Manual bot about to send its entry. | Nothing. |
| **Waiting** · Waiting for entry signal | A Signal bot waits until every ticked period agrees; its details show each period's rating. | Nothing. |
| **Launching** · Starts 03 Oct, 14:00:00 | It starts at the time you set. | **Start now** to start at once. |
| **Running** · Buy (3/11 avg., iter.: 2) | In a cycle: averaging orders filled of planned, and the cycle's number. A warning look (a yellow dot in the list) means an averaging order failed; the word stays Running. | **Fix failed** sends the failed averaging orders again. |
| **Cooldown** | Between cycles, waiting out the cooldown you set. | Nothing. |
| **Stopping** · Closing the position | Stop or Close pos. is closing its position. | Nothing. |
| **Completed** · Take Profit triggered, Stop Loss triggered, Ended at its end time or cycle count | The bot ended as set (no Repeat after it). | **Copy** fills the form with its settings. |
| **Completed** · Ended: the fee in the coin left less than one size step, which cannot be sold | A spot bot whose last coins are below the smallest amount the exchange sells; they stay in your account. | Nothing. |
| **Stopped** · Manual cancel, Position closed | You stopped it, or closed its position. | **Copy** if you want it again. |
| **Error** · Liquidated by the exchange | The exchange liquidated its position; the bot stopped and what is left is yours, unprotected. | **Close pos.** sells what is left, or set a stop-loss. |
| **Error** · Auto-deleveraged by the exchange | The exchange auto-deleveraged the position (closed it against an account it liquidated); the bot was charged its share and stopped, its PnL with its own sign. | **Close pos.** sells what the bot still counts. |
| **Error** · "API wallet unknown to the exchange: expired, replaced or revoked" (the exchange's own words, "User or API Wallet … does not exist.", behind **Raw message**) | The exchange refused one of the bot's orders because the API wallet expired or is no longer approved; the bot stopped as goodcryptoX 2.0's did on an error: its orders cancelled, its position closed only if **Close position on stop** was on. | Renew the API wallet, then start a new bot; **Close pos.** sells what is left. |
| **Needs repair** and a sentence | The bot keeps its take-profit and stop-loss working but takes no new risk (no entry, no new cycle) until you choose. | Its three choices, beside its usual buttons (below). |

A bot that needs repair says why:

| Sentence | What to press |
|---|---|
| "The exchange refused the entry order." | **Retry** tries the entry again (the same word in a Telegram message), or **Stop**. |
| "The account's {venue} request allowance is too low for this cycle." | **Retry** once the allowance allows it, or Stop. |
| "The exchange shows no position while the bot holds one." (on two checks 90 seconds apart) | **Accept the exchange's position** takes the exchange's word and ends the cycle; **Close position** closes the position. Its take-profit and stop-loss stay until you choose. |
| "API wallet expiring: no new cycle" | The API wallet of this account expires in less than 24 hours, so the bot starts no new cycle. Renew the API wallet: **Replace API wallet** (Settings › Exchanges › Hyperliquid, Edit account; [Safety and keys](safety.md#the-api-wallet)); the bot resumes by itself once Hyperliquid lists the new one. Or **Stop** the bot, or let the cycle end: the cycle under way keeps its take-profit and stop-loss. |
| "An order of this bot needs a decision." | One of its orders is in repair (the reasons above): **Retry** sends the stuck orders again, **Close position** closes. |

**The position differs from the exchange's.** In a bot's details, the Position section shows the exchange's own position beside the bot's. When they differ (you traded the coin by hand, or another bot trades it), a red **Exchange** line says so, with "Bots 1.2 · they differ" under it. Nothing is changed. Nobody is paged, unless the bot has **Only this bot trades {instrument} in this account** on: then you are told once, and its row in the list shows the yellow warning icon with **Mismatch** ([DCA bot](../bots/dca.md)). **I know why** hides the line until the difference grows; **It should not differ: report it** writes the difference into goodcryptoX's log (to send it to us, use **What happened?** on the bot).

## Take-profit and stop-loss on a position or an order

*The My trades list comes to the panel in a later version.* Each block is a row of [My trades](../trading/trades.md): **Waiting** (on an order that has not filled), **Open**, **following position**, **Repair** (one of them needs you, or the exchange shows no position under them: cancel them if the position is really gone), and **Done** with how it ended.

## goodcryptoX itself

| You see | Where | It means | What to press |
|---|---|---|---|
| **Starting**, **Recovering**, **Reconciling** | Settings › General › Installation | goodcryptoX is opening its records, rebuilding every order and bot from them, then checking with the exchange what happened while it was off. Nothing new is sent meanwhile; while it checks (Reconciling), your cancels and Close still go. | Nothing. |
| **Running** | the same | All is well. | Nothing. |
| **Draining…** | the same | goodcryptoX finishes what is under way before it stops or updates. | Nothing. |
| **Stopped** | the same | goodcryptoX is not running. | Open goodcryptoX from the menu bar. |
| "Hyperliquid maintenance since 08:02" | top of the Dashboard and the Trade page | Hyperliquid says it is in maintenance, and goodcryptoX sends it nothing until it ends. A new order that opens or adds to a position is refused, with the same sentence on the order form's button; what goodcryptoX itself would send (a stop entry that fires) waits; a Close, a cancel of an order of goodcryptoX's, a bot's Stop, a stop-loss or a take-profit is taken and waits too; margin, leverage and the cancel of an order placed outside goodcryptoX are refused until it ends; nothing resting is cancelled; you are not paged (except once for an order sent just before it with no answer yet, which shows in repair until the end settles it). Everything that waited goes by itself when it ends, in the order it came. | Nothing. ([Maintenance](../reference/hyperliquid.md#maintenance)) |
| **Hyperliquid maintenance**: "Since 08:02 · waiting: 3", then "Ending · waiting: 3", then "Ended at 08:14, after 12 min" | the Dashboard's "Needs your attention" | goodcryptoX checked 60 seconds after Hyperliquid's status named maintenance that it is real, and then that it really ended (5 seconds after the status cleared: the status, the prices, your resting orders). A line names what did not match: "Status says maintenance, trading goes on" (Hyperliquid trades; what waited goes), or "Orders being looked up: 2" (orders goodcryptoX left resting are missing from Hyperliquid's list; goodcryptoX looks them up). While it lasts, goodcryptoX sends nothing and the orders resting on Hyperliquid stay; the minutes after the end take only post-only orders, and the others go again every 10 seconds. Telegram says the start and the end when you have an open order or a bot on Hyperliquid. | Nothing, or **Done** to hide it. |
| "This computer's clock is 6.0 s behind {venue}'s; goodcryptoX trades only within 5 s: …" | the same | goodcryptoX does not arm stops or start bots while your clock is off. | Set the computer's clock to automatic (network) time, or sync it; goodcryptoX starts by itself. |
| "Your API wallet for … has expired: renew it in Settings.", "… is no longer approved on {venue}: renew it in Settings." | the Trade page, in place of Buy, Sell and Launch; a refused order or bot | Nothing is held (as goodcryptoX 2.0): new orders and bots on that main account are refused with this sentence; a running bot's order goes to the exchange, which refuses it, and the bot stops with **Error** and that text; a stop that fires is refused the same way and waits in repair; your cancels and Close are sent; other main accounts are not affected. | **Replace API wallet** (Settings › Exchanges › Hyperliquid, Edit account; [Safety and keys](safety.md#the-api-wallet)); new orders are taken again once the exchange lists the new one. For one the exchange no longer lists, fund the main account first. |
| **Allow builder fees to enable trading** (an order or bot refused: "Approve the builder fee on this account to trade.") | the Trade page, in place of Buy, Sell and Launch; the API and agents get the sentence | The account's builder fee is not approved, so goodcryptoX takes no new order or bot on it; cancels, Close, exits and Stop still work, and a running bot goes on. | **Fix**: approve it in Settings › Exchanges › Hyperliquid (**Allow builder fees**). |
| "{venue}'s instrument list could not be read." | the same | A start-up check goodcryptoX repeats every 30 seconds; meanwhile a new order or bot is refused with "The market list has not arrived from {venue} yet; goodcryptoX keeps trying.". | Nothing; check the internet connection if it stays. |
| **goodcryptoX is locked** | every page | The key store waits for its passphrase; goodcryptoX signs nothing. | Type the passphrase, **Unlock** ([Safety and keys](safety.md#the-key-store)). |
| "Connection to goodcryptoX lost. Reconnecting…", "Not signed in. …", "goodcryptoX did not answer. Is it running?" | top of the panel | The browser's link to goodcryptoX. | [Signing in and staying connected](../panel/signing-in.md). |
| "No data from Hyperliquid since 14:02" | orderbook, trades | The exchange's feed for that coin stopped; the last values are not shown as current. | Nothing; it comes back by itself. |
| "Price feed delayed", "Price feed live", "Trading halted" | Telegram | The prices goodcryptoX's stops and bots need: late, back; the exchange halted a market. ("No price" and "Stops unchecked" are no longer sent.) | Nothing. |
| **unavailable**, **as of 14:02**, "Not up to date" | lists, Dashboard, Settings | goodcryptoX could not read an account, or the last reading is late. It never shows "nothing" when it does not know. | Nothing. |
| A green, yellow or red dot on the goodcryptoX mark | Mac menu bar | Green: all is well. Yellow: something to look at, no rush. Red: something needs you now. | Open the menu: its first line says what ([Installing goodcryptoX](../install.md)). |

The words on an account's card in Settings (OK, Checking..., Key Error, Waiting for approval, the API wallet's expiry, the builder fee) are explained in [Safety and keys](safety.md) and [Connecting your Hyperliquid account](../panel/connect.md).
