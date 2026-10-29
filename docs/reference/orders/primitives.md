# Order primitives

What the engine does with an order once it has passed [validation](validation.md) (in a trader's words: [Order types and options](../../trading/order-types.md)): when it triggers, what it sends, how it follows the fills, what happens when the exchange says no or says nothing. Every manual order type goodcryptoX 2.0 had is here, with its known bugs fixed.

The engine keeps every order in its own records and asks the exchange only for what should be there now. Each send has its own id, is written to the ledger before it leaves, and is never sent twice. Everything the engine decides can be replayed from the ledger with the same result.

## The order types

| Type | What the engine does |
|---|---|
| Market, GC market | Sends at once. On Hyperliquid a market order is one "immediate or cancel" order priced from the orderbook: how far its limit goes is on [Market orders](../../trading/market-orders.md). |
| Limit | Rests on the exchange at your price. Post-only and reduce-only as you set them. |
| Stop-market | The engine watches the last trade. At the trigger it sends a market order. |
| Stop-limit | The same, and sends a limit order at your limit price, post-only if you set it (the DCA bot's averaging orders use this). |
| Trailing stop | The engine follows the price and moves the stop with it; when the price comes back to the stop it sends a market order. |
| Trailing stop-limit | The same, and sends a limit order at the stop itself. |
| Reverse trailing | "Buy the dip" (a buy that follows the high and buys when the price falls by the distance) and "sell the pump" (the mirror). |
| Close | A market order, reduce-only, for the size of your position. |

## Triggers

A stop is a **stop-loss** or a **take-profit**, decided from the last price when you place it: a buy above the market or a sell below it is a stop-loss; everything else, including a trigger exactly at the last price, is a take-profit.

| Side | Stop-loss fires when the price | Take-profit fires when the price |
|---|---|---|
| Buy | rises to or above the trigger | falls to or below the trigger |
| Sell | falls to or below the trigger | rises to or above the trigger |

- The price is the **last trade** on the exchange. A price of zero is never taken as a trade: nothing fires, activates or moves on it.
- The trigger is included: a sell stop-loss at 90 fires at a trade of exactly 90.
- The order is sent at the trade that crossed, not at the trigger: if the price jumps from 105 to 111 over a take-profit at 110, it fires at 111.
- A stop that is already crossed when you place it fires at once. The form warns "Your order will be triggered immediately". If the last trade the engine has is older than the feed's staleness limit (30 seconds), it does not fire on it and waits for the next trade.
- Moving a stop re-classifies it against the market, except a take-profit or stop-loss of an order's TP/SL block: those keep their role, so a stop-loss dragged past the market fires at once after the warning, and never silently becomes a take-profit.

**Trigger timeout.** With a timeout, the first crossing starts the clock. When it ends, the engine looks at the last trade again: still crossed, it fires at that price; not crossed, it waits for the next crossing. Only these two moments count, as in goodcryptoX 2.0: a recovery and a new crossing inside the window are ignored. The engine never fires on a missing or zero price. The deadline is kept in the engine's records, so a restart continues the same clock; if the engine was down past the deadline, the first trade after the restart decides.

**Feed gaps.** After a gap, the coin's first trade decides each trigger and trailing stop: one still past its level fires, one crossed and back stays armed.

## Trailing

A sell trailing stop follows the highest price and keeps its stop the distance below it (a percent of the high, or an amount); a buy follows the lowest price and keeps the stop above it. The stop moves only in your favour.

- The stop is always a valid exchange price at its own level (on Hyperliquid: five significant figures, so 104.59 above 100 and 99.654 below it), rounded in the direction that does not trigger it early (a sell stop down, a buy stop up). The engine records every move of the stop; a price change too small to move the rounded stop is not recorded.
- **Trail start**: trailing begins when the price reaches the trail start, and it starts from the trail start itself, not from the price that reached it.
- **Improve-only**: trailing begins only once the first stop would be at the starting price (the market when you placed it, or the trail start). Selling with 10 % from 10,000: trailing starts at 11,111.11 with the stop at 10,000, so the order never sells below where you started. A trailing take-profit's minimum profit works the same way: with 1 %, trailing starts at 11,222.22 with the stop at 10,100.
- A trailing stop-limit sends its limit at the stop at the moment it fires (goodcryptoX 2.0 used a value up to 10 seconds old).
- Trailing orders have no trigger timeout.

## Stop-losses on the exchange or in the engine

By default a stop-loss is watched by the engine on the last trade. On an exchange where the native stop triggers on the last trade too, the native one is the default instead, because it keeps working while your engine is off. On Hyperliquid native stops trigger on the **mark price** and fill with the exchange's own slippage, so there they would be a setting ("use the exchange's native stop-losses") with that warning; this version does not offer it, and a value saved by an earlier build is ignored: every stop-loss is the engine's. The rules below are those of that setting.

- One order has one stop, never both. The choice is made when you place it. A native stop can be moved only on its own side of the market; a move across the market is refused (it would become an exchange stop that fires at once).
- Native only for a stop-loss without a trigger timeout (the exchange cannot wait); take-profits and trailing stops are always the engine's.
- A native stop is still watched: if our feed saw its level crossed and it has not filled 30 seconds later, or the exchange removed it without a fill, the order goes to **repair**.

## Sending, retries and unknown answers

- An order is **protective** when it guards a position: the take-profit or stop-loss of a TP/SL block, Close, or any reduce-only order (mark a stop or trailing stop reduce-only when it protects a position). A stop without reduce-only may open a position (a buy stop above the market is a breakout entry), so it is treated as an entry.
- Every market send is one order, priced from the book at its send, at most 25 % from the best price ("a stop = a market order"): a protective exit, a fired stop or trailing order, and a market order you place yourself alike. What it does not fill is cancelled and the order ends **partly filled** (unfilled when nothing filled); unless you placed it yourself, you are told how much was left. Nothing is re-sent by itself.
- A market or limit order you placed yourself that the exchange refuses is closed as **rejected** with the exchange's message. An order that should have acted without you (a triggered stop, a protective exit, a native stop) goes to **repair** instead, with a one-click re-send; a price race or no liquidity included.
- "Reduce only order would increase position" (the position is already flat) ends the order **rejected** with the exchange's words and one alert, whatever the order.
- A stop that has triggered cannot be cancelled while its market order is being sent: "This stop has triggered; its order is being sent." (goodcryptoX 2.0's "Order triggering"). Its one order ends by itself within moments.
- **Written down, then sent once.** goodcryptoX writes every order down with its own id before anything else, then waits its turn under the request limits (stop-losses, closes and cancels go first), signs it, writes down that it is sending it, and only then sends it, once. An order that was written down but never sent is never sent twice and never looked up: goodcryptoX knows it never left.
- **Sent when goodcryptoX is back.** An order goodcryptoX had decided to send (your press, a stop it triggered, a bot's step) and wrote down, but that never left because goodcryptoX stopped first, is sent by itself when goodcryptoX is back, whatever its kind and however long goodcryptoX was away; so is one decided while goodcryptoX was still checking the account after a start or a sleep. **Not sent: Send now or cancel** remains only for an order that opens or adds to a position while goodcryptoX stops, the disk is full or the exchange is in maintenance (the maintenance's and the stop's go by themselves when they end). **Cancel** ends it with nothing sent to the exchange and no alert. **Send now** is refused while goodcryptoX may not send new orders.
- **Too many requests.** When the exchange refuses a request because the connection is over its limit (HTTP 429), nothing was executed and nothing is refused by goodcryptoX: nothing at all is sent for 6 seconds (Hyperliquid was measured serving requests again after 5 to 6 seconds), then the same signed order goes again while it is still valid; after that it waits at the head of the line and is signed again under the same id when the limit allows. An order is never ended for this. The account's own request allowance is another limit: see [Hyperliquid's limits](../../trading/rate-limits.md).
- **A used signature number.** If the exchange answers that the order's signature number (its nonce) was already used, goodcryptoX signs the same order once more under the same id. A second such answer, or one after a "too many requests" re-send, is treated as no answer.
- **No answer** (a timeout, a lost connection, a reply goodcryptoX cannot read, a restart between sending and the answer) is never taken as "not placed", and nothing is sent again while the answer is unknown, a reduce-only stop-loss or Close included: with a second position on the same coin (two bots, or a bot and your own trade) two reduce-only sells both fill. The row reads "Checking with Hyperliquid". Once the exchange can no longer accept the order (11 seconds after sending), goodcryptoX looks it up by its id, and reads your open orders and fills: if the exchange has it, the exchange's word counts (resting, filled, refused, or for an immediate-or-cancel order the part that executed: the rest of a protective exit is sent from that figure, never from the fills seen so far). Only the exchange's proof that it never arrived (90 seconds past the request's expiry, two clean lookups, no fill, no open order) counts as "not placed"; a lookup that fails counts for nothing. No notification and no repair for the first two minutes from when the send was due; still unknown then, the order goes to repair (**unknown**) with one notification, and lookups continue every 30 seconds for 5 minutes, then every 5 minutes. Proven not placed, whenever the proof comes and before the checks on the exchange itself too, an order is sent again by itself (a new order, at most three times). See [When goodcryptoX gets no answer](../../trading/lost-answer.md).

- **On spot**: the exchange has no reduce-only, so no spot order is sent reduce-only. After a lost answer a spot order follows the same rule as any other: nothing is sent again while it is unknown.

## Fills

- An order is filled when it filled the size the exchange accepted (0.075 sent as 0.07 is done at 0.07).
- An order whose last send filled while the order itself grew (a TP/SL stop-loss that fired at 0.4 while the order under it filled another 0.6) is not done: the rest is sent, and you are told.
- An "immediate or cancel" order that fills 0.7 of 1.0 ends **partially filled** at 0.7.
- When the exchange's answer to an entry sent at market (a market order you place, a bot's entry) says it executed more than its fills show yet, the order waits for those fills, and the fill that accounts for that part closes it. If they have not arrived within 3 minutes, the order goes to repair: "A fill was reported but its details have not arrived" It waits there: a later fill closes it, and Retry sends only the rest. Nothing more is sent by itself. Retry counts the part the exchange said executed, never only the fills seen (a buy of 1 whose answer says 0.4 executed sends 0.6, never 1).
- A triggered stop or a protective exit (a stop-loss, take-profit or Close, or any reduce-only order) never waits for those fills: it ends when the exchange answers, and a fill reported after that still decides how it ended.
- A fill that arrives after a cancel, or after the order closed, still counts. Up to 3 minutes after a cancel it is expected; later it is also reported.

- On spot a fill may say its fee was taken in the coin bought (`feeIn` "base" on the fill): the account received the fill's size less that fee.

## Delay and time in force

- **Delay**: the order is placed that long after you send it. A delayed stop is classified as a stop-loss or a take-profit at the price of that moment, as if you had placed it then.
- **Send at** and **Cancel at** (the order command's `sendAt` and `cancelAt`, moments in milliseconds since the epoch, UTC): the same as a delay and a time in force, given as moments. goodcryptoX turns each into the equal duration when it records the order (Send at minus that moment; Cancel at minus the moment it is sent), so a restart changes nothing. A moment that is not ahead is refused, a Cancel at must come after the order is sent, and each is refused beside its duration (`delay`, `timeInForce`). Neither is in the order form yet.
- **Sent late**: an order whose send time came while goodcryptoX was off or the computer slept is sent when goodcryptoX is back, however late ([After goodcryptoX was off](../../trading/missed-orders.md)). A time in force that ended while goodcryptoX was off cancels the order when goodcryptoX is back, however late.
- **Time in force**: any order that can rest carries an expiry; at expiry the engine cancels it and it closes as **expired**, without an alert. The expiry is in the engine's records, so it survives a restart. The take-profit and stop-loss of an order do not expire with it: once the order has filled they protect the position until it is closed or you cancel them. If the order expires with nothing filled, they close after the 3-minute late-fill wait.

## Take-profit and stop-loss (TP/SL)

A TP/SL block on an order, or on a position you hold.

- The take-profit and stop-loss exist from the moment you place the order, at size zero and with levels from the price the order is expected to fill at (its limit price, a stop's trigger, a trailing order's first stop, else the market), as goodcryptoX 2.0 previewed them, so the chart can draw them.
- They arm at the **first fill** of the order, sized from what actually filled, and grow with each further fill. Percent levels follow the average fill price, and each level is sent as a valid exchange price, rounded away from the entry (a 1.12423 % take-profit on 100 rests at 101.13).
- The stop-loss always covers everything still held. A take-profit filling part of the position shrinks the stop-loss; the stop-loss filling part of it shrinks the take-profits. When nothing is held any more the rest is cancelled. A remainder smaller than the exchange's smallest size (rounding dust) cannot be sent as an order and counts as nothing held.
- If the order fills again after that (its stop-loss exited what had filled while the rest of the order still rested), a new take-profit and stop-loss protect the new fill, sized to it; the ones that ended stay as they ended. A take-profit or stop-loss you cancelled yourself is not brought back, but the other one is: cancel the take-profit and keep the stop-loss, and the new fill gets a stop-loss only. Cancel all is never undone by a later fill.
- When the stop-loss fires while a limit take-profit rests on the exchange, the stop-loss's order goes first and the take-profit's cancel right after it. If that cancel gets no answer the take-profit goes to repair. On spot the order is the other way, since the resting take-profit holds the coins: its cancel goes first and the stop-loss sells once the cancel is confirmed, what is held as far as the fills and the exchange's word on what executed show then (a take-profit fill reported after the cancel's confirmation is not known yet: until spot orders are sent, with a read of the coins free before that send, this path is not safe). More generally on spot, and on a perpetual when Reduce only is unticked, one exit of a TP/SL block goes at a time: a take-profit and stop-loss that fire together send one order, the other only if something is left once the first has ended.
- If the order is cancelled after filling part, the TP/SL protect that part (goodcryptoX 2.0 dropped them). If it is cancelled with nothing filled, they wait at size zero for 3 minutes in case a late fill arrives, then close.
- On a position, the TP/SL are sized from the position and follow it when the position changes. They are reduce-only unless the block that attaches them says `reduceOnly: false` (since 2026-10-16; attached by an earlier build, always reduce-only); an edit keeps that choice. If the position changes side (long to short or short to long) they end as **position reversed**, with one alert: they are not re-sized, a resting take-profit is cancelled and not re-placed, and nothing is sent, since they would now open a position. A position that only gets bigger or smaller on its own side is followed.
- On a position, levels follow the new average entry too. A stop-loss set as an expected loss is recomputed on the whole position: long 1.0 at 100 with a loss of 10 has its stop at 90; buy 1.0 more at 100 and the stop moves to 95, so the loss at the stop stays 10. What the take-profits sold still counts in that position, so a target that filled, or an edit that removes one, leaves the stop where it is. A trailing take-profit that is still waiting moves its activation with the entry; one that is already trailing keeps trailing if its best price is at or beyond the new activation, otherwise it waits again at the new level. Long 1.0 at 100 with a minimum profit of 2 % and a distance of 1 %: trailing starts at 103.03 with its first stop at 102; buy 1.0 more at 90 (entry 95) and it waits at 97.88 (first stop 96.9); trailing at a best price of 104, buy 1.0 more at 104 (entry 102) and it waits again at 105.09. A trailing stop-loss trails from the better of its best price and the new entry, so it never loosens. On an order, trailing levels start from its average fill at the first fill and stay there.
- **Attach TP/SL** adds a TP/SL block to an order you already placed, open, partly filled or filled: sized from what it filled, at its average fill price. An order that already has one is refused; use Edit.
- **Edit TP/SL** works at any time, whatever has filled: the new block replaces the old, and every take-profit and stop-loss still working is re-sized from what is held and re-levelled. A target that filled stays filled and is never sent again; the others divide the rest. A target or stop-loss the new block leaves out is cancelled (what it sold still counts); one it adds is created, and so is one you cancelled earlier (it comes back as a new order). A change while a take-profit is being replaced on the exchange applies once that replacement is answered. Numbers are compared as numbers: a stop-loss of 5 % sent again as 5.0 % is no change. A person's edit that changes only a trailing take-profit's or stop-loss's distance, once the order has filled or on a position, keeps that one trailing from where it got to (the stop worked out again from the extreme it reached; one still waiting starts its wait again from its entry); a narrower distance past the price fires at the next price.
- **The block lists every target, filled ones included, in their order.** Target 1 of the new block is target 1 of the old, whatever it filled. With targets at 110, 120 and 130 and 110 filled, send all three to change the other two; send only 120 and 130 and the filled 110 keeps the first place, so 120 is never placed, the old 120 moves to 130 and the third is cancelled. After the first target filled, a block with one target leaves no take-profit working.
- **Changing a take-profit's or stop-loss's kind** (market, limit or trailing; its trailing distance or minimum profit; its trigger timeout; reduce-only) is one edit, as in goodcryptoX 2.0: the old one is cancelled and a new one of the new kind is created, sized from what is held; a target that filled stays filled and is never sent again. The old one is cancelled first: the new one sends nothing to the exchange until the exchange confirms the cancel (a stop-loss goodcryptoX watches itself is cancelled at once, so the change has no gap; one resting on the exchange keeps protecting until its cancel is confirmed). If the new one triggers meanwhile, it waits; still unconfirmed two minutes later, it goes to the [missed orders](../../trading/missed-orders.md).
- **Refused edits.** Adding a take-profit or stop-loss of the same kind while the one before it is still being cancelled on the exchange, so two never stand at once: the edit is refused as **cancelling** until the exchange confirms the cancel or the old one fills (a stop-loss goodcryptoX watches itself is cancelled at once, so there is no wait). If the exchange's answer to the cancel is lost, the old one goes to repair and you are alerted; its re-send, or Cancel again, asks the exchange again. Meanwhile you can drag the stop-loss to move it, send the edit without the one being cancelled, or attach a new TP/SL to the position. An edit is refused as ended once every take-profit and stop-loss has ended, or while the ones left are being closed (the stop-loss filled, or the position changed side); an order whose take-profits and stop-loss have all ended can be neither edited nor attached again.
- A level you move yourself stays where you put it; later fills no longer move it. An edit that changes that level replaces it; an edit that leaves it alone keeps yours.

**Several targets.** Each target closes its share of what filled. The sizes are computed on the running total, so rounding never loses a step or over-sells: 4 × 25 % of 0.30 with a 0.01 step is 0.07, 0.08, 0.07, 0.08. Targets for less than 100 % leave the rest to the stop-loss. A target you cancel after a partial fill keeps what it sold; the others keep their sizes, and the stop-loss covers what is still held.

**Follow TPs** moves a (non-trailing) stop-loss as targets fill: *Off* leaves it; *Move to breakeven* moves it to the average entry once any target filled; *Follow TPs* moves it to the entry after the first target and to the previous target's level after each next one. Targets that fill out of order count by the furthest one filled.

## Modify

- What you can change, as in goodcryptoX 2.0: a limit's size, price, post-only and reduce-only; a waiting stop's size, trigger, timeout, limit price, reduce-only and (a stop-limit's) post-only; a trailing stop's size, distance, trail start, improve-only and reduce-only while it waits, and only its size and distance once it trails. A take-profit or stop-loss changes its level and, while it waits, its trigger timeout, and only once its order has filled, and one that already trails changes nothing (goodcryptoX 2.0's `isEditable`); before that it changes from its order's TP/SL, as goodcryptoX 2.0 said ("This connected order is not active yet"). A market order, a stop whose order is being sent, a bot's order and an order whose last send has no answer yet are not changed. The change is checked as the order form checks a new order: an error refuses it, a warning does not (goodcryptoX 2.0's modify form never warned). `POST /api/v1/orders/{id}/modify` takes the fields that change (`runtime-api.schema.json#/$defs/modify`); a trading key changes only the orders it placed, the changed order judged by its limits as a new one would be and counted against its 24 hours at its new value.
- One change of an order and its take-profit and stop-loss together (the details' Modify form): the same route with `exits: {bracket, overrides}`, `bracket` the whole TP/SL block after the change (as Edit TP/SL takes it) or `null` with both switched off. The change is checked first, then the exits against the order as changed (a level against the new price), and both are recorded together, or the request is refused and nothing changes. If the exchange then refuses the order's replacement, the exits put back with the old order are the ones it had before the change; if the old order fills before its replacement, those are the ones that arm. A person's only: a trading key's request carrying `exits` is refused (`key.order`).
- An order the engine holds (an armed stop, a trailing stop waiting or trailing, a TP/SL before it is sent) changes in place, at once; nothing is cancelled.
- An order the exchange holds (a limit, a native stop, a triggered stop-limit) is replaced: cancelled, then placed again with the new values and the size still to fill, and the new one is sent only once the exchange has confirmed the cancel, on every exchange, so two orders never rest at once and hold your margin twice. If the engine restarts before the new one's answer and then finds it on the exchange, it is not sent again.
- If the new one is refused, the old order is put back once by itself, at its old values, and you are told ("The change could not be placed; goodcryptoX is putting the order back as it was", sent as goodcryptoX sends it, before the exchange answers; the exchange's answer, a fill or a refusal, follows as its own message), as goodcryptoX 2.0 did. That holds for a plain limit too, even when its old price is now past the market: it then fills at once, as it would have had it stayed on the book. If putting it back is refused too, the order goes to repair. If the exchange says the position is already closed, the rule of "Sending" above applies.
- If the exchange proves it never received the new one (see [When goodcryptoX gets no answer](../../trading/lost-answer.md)), the same: the old order comes back by itself, with the same message, whenever the proof comes.
- If the cancel's answer is lost, nothing new is sent until the cancel is confirmed: the order goes to repair ("cancel unknown"), and the one-click re-send sends only the cancel again; the new order goes once the exchange confirms it. If the exchange reports the order cancelled by itself meanwhile, the order stays in repair as it is, nothing is sent, and the re-send then places the change.
- A change the engine makes itself (re-sizing or moving a take-profit or stop-loss after a fill) that the exchange refuses is tried once more with the new values, then goes to repair; it is never undone and redone in a loop, and the old one is never put back (it no longer fits the position).
- A fill on the old order that arrives after the replacement shrinks the new one. If the new one had already filled, you are told the order over-filled and by how much.
- A triggered stop whose market order is being sent cannot be changed.
- An order placed outside goodcryptoX (marked ext) is read fresh from the exchange on its first change and taken into goodcryptoX then, keeping its mark: it is cancelled by its exchange id and changed as above, and what filled of it before is the exchange's own figure. A take-profit or a position take-profit and stop-loss placed in the exchange's app, an order grouped with others there, and one another copy of goodcryptoX placed can only be cancelled. If the exchange's open orders cannot be read, or do not list the order, nothing is changed. Take-profit and stop-loss are not attached to it, as in goodcryptoX.

## Cancel and cancel all

An order the engine holds is cancelled at once, with no call to the exchange. One the exchange holds closes when the exchange confirms. **Cancel all** does this for every open order of an instrument or of the account.

## Repair

An order in repair needs you; you are notified. The reasons:

| Reason | Meaning |
|---|---|
| failed to trigger | The trigger fired and the exchange refused the order. One-click re-send. |
| rejected | The exchange refused a protective or native order. |
| exit failed | A protective exit filled nothing at 10 %. |
| unknown | No answer from the exchange yet; counted as live, looked up until the exchange answers. Nothing is sent again meanwhile. |
| cancel unknown | A cancel got no answer, or the exchange said there was nothing to cancel and a lookup found the order neither cancelled nor filled (still open, or not found). The one-click re-send, or cancelling again, sends the cancel again. An order that filled before your cancel reached the exchange is not an alert: its fills are read and it closes as filled. |
| resend limit | The exchange proved three times that the order never arrived, and goodcryptoX sent it each time. Retry or cancel. |
| proof failed | An order the exchange had proven never arrived turned out to exist: goodcryptoX cancelled the order it sent instead. Check the position. The order found is the order now: Cancel cancels it too, and Retry sends nothing beside it (if it differs from the order, it is cancelled first and the order placed once the cancel is confirmed). If the order had already ended when it turned up (its other send filled, or you had cancelled it), goodcryptoX cancels it at once and tells you with an alert; the order stays closed. |
| never placed | The exchange proved it never received the order, and goodcryptoX does not send it again by itself because a second send could double it: another send of the same order is still live, or the send was recorded before goodcryptoX marked its sends for a proof. Retry or cancel. |
| exchange cancelled | The exchange removed an order without a fill; the reason (margin, liquidation, other) is shown. |
| native missed | A native stop did not fill 30 seconds after its level was crossed. |
| modify rejected | A change was refused, and putting the old order back was refused too. |
| unclassified | The exchange answered with an error the engine does not know. |
| resize rejected | The exchange refused the engine's re-size of a take-profit or stop-loss twice. |
| fills missing | The exchange said part of a send executed, and its fills did not arrive within 3 minutes. The rest is not sent until you check. |
| reduce-only refused | "Reduce only would increase position" and the position is not flat. |

## PnL

The engine computes the average price and the realized PnL per contract type, as goodcryptoX 2.0 did:

| Contract | Value of a size at a price | Average price |
|---|---|---|
| Spot, linear (Hyperliquid perps), quanto | size × multiplier × price | weighted by size |
| Inverse (coin-margined) | size × multiplier ÷ price | harmonic: total size ÷ Σ (size ÷ price) |
| Linear settled in the base asset | size × multiplier × price, the PnL converted to the base asset | weighted by size |

Realized PnL is the value when closing minus the value when opening for a long (the reverse for a short, and the other way round on inverse contracts), with the buy side paying its fee on top and the sell side receiving net of its fee.

## For agents

What the engine asks goodcryptoX to send is defined by [`order-intent.schema.json`](../schemas/order-intent.schema.json) and the exchange events by [`venue-event.schema.json`](../schemas/venue-event.schema.json). A trade that produces no output changes nothing, so the runtime needs to record only the trades that did. The event schema lists how each of the exchange adapter's error classes becomes an event; an error the adapter cannot classify always pages.
