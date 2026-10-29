# Order types and options

This page says what each order type of the order form does, what the ticks under the size mean on the exchange, how a take-profit and a stop-loss read, and what **Copy** does. Words in quotes are the form's own, which are goodcryptoX's. Where each field sits in the form is on [the order form](../panel/trade-form.md); the exact rules goodcryptoX follows (rounding, fills, retries) are in [Order primitives](../reference/orders/primitives.md).

<a id="resting-on-hyperliquid-or-watched-by-goodcryptox"></a>

## Resting on the exchange, or watched by goodcryptoX

- A **market** or **limit** order goes to the exchange at once. A limit order then rests on the exchange's orderbook until it fills, you cancel it, or its time in force ends.
- A limit order needs no price from goodcryptoX to be sent. On a coin goodcryptoX has no price for at all (its stream silent and the one book read failed), the form warns "No price for ETH yet: goodcryptoX cannot check this limit price against the market" and **Send anyway** sends it as goodcryptoX did; goodcryptoX then judges it at its own price. A market or stop order still waits for a price.
- Every **stop** and **trailing** order is watched by goodcryptoX itself: goodcryptoX follows the price, and only when the order's moment comes does it send a market or limit order to the exchange. Until then nothing rests on the exchange and no funds are held for it. These types carry the goodcryptoX mark in the form and *Internal* in the lists; a stop reads **Waiting** until it fires.

An order goodcryptoX watches works only while goodcryptoX runs and has prices. goodcryptoX keeps your computer awake while it watches one (Settings › General › Keep the Mac awake; Keep the computer awake on Windows and Linux), but closing a laptop's lid still sleeps it. If the price crosses the order's level while goodcryptoX is off, asleep or without prices, the coin's first trade after goodcryptoX is back decides: still past the level, the order fires then; back inside, it stays armed ([After goodcryptoX was off](missed-orders.md)).

Stop-losses are goodcryptoX's own in this version: Hyperliquid's own stop-losses (a trigger order resting on Hyperliquid) are not offered. A stop that can open or add to a position (such as a breakout entry) has its 1 % limit.

## Change an order

Open the order's details. **Modify** opens the order form itself, filled in with the order as it is now: its side and type, its values, each flag as it is, and its take-profit and stop-loss as they are now. While it is open it takes the place of the details' rows. Only what can change on this order, of this type and in this state, is a field; what must be seen but cannot change (the side, the type, a filled order's size and price, time in force) reads as plain words; the rest is not shown. **Save** stays off until something differs, then asks once, "Apply these changes to the order?", with a line for each change ("Price to 72 USDC", "Take profit 2 to 11 %"); **Cancel**, Escape, another order or another list tab leaves with nothing sent.

One Save is one change: the order's part and its take-profit and stop-loss go together, and both are applied or neither. A refusal leaves the order as it was, its reason under the form (a warning stays under the form and **Save** sends it anyway). If the exchange then refuses the order's new values, the old order and its take-profit and stop-loss come back as they were, and you are told once. If the old order fills before the new one is placed, the fill counts and the take-profit and stop-loss it had before the Save are the ones that arm. With no answer at all, the form stays with "Unconfirmed, check open orders" and **Reload**; Save again sends the same change, applied once at most.

Each value you can change also has a pencil in the details, for one quick change: **Size**, **Limit price**, **Trigger price**, **Trailing distance** and a waiting trailing order's **Trailing start price**, as that order type and its state allow; **Trigger timeout** is a list. A flag that is on (**Post only**, **Reduce only**, **Improve only**) shows as its own row with a click to turn it off; a flag is turned on from Modify. Type or pick the new value and press the check mark: that one change is sent at once. The cross puts the old value back. If the change is refused, the field stays open with its edge red and the reason in its tooltip. A bot's order has no pencils and no Modify: a bot's orders change from the bot.

An order goodcryptoX watches itself (a stop, a trailing stop) changes in place, at once. An order resting on the exchange is cancelled and placed again with the new values once the exchange confirms the cancel; if the exchange refuses the new one, the old one comes back by itself and you are told. What each order may change, as in goodcryptoX, is in [Order primitives](../reference/orders/primitives.md#modify).

**Take profit and stop loss.** Until the order fills, its take-profits and stop-loss are a plan: they are not on the exchange and not rows of Open orders; the order's row shows them as +TP and +SL, and its details list them under it. There each one's price and size (its share, in %) have a pencil; a stop-loss's size is the whole. Once the order has filled, each one is an order of its own: open it from the list under the order; its **Modify** opens the first part of the form with that one take-profit or stop-loss: its level (by price or by percent), a stop-loss's type (Market or Trailing) and a trailing stop-loss's distance, a trailing take-profit's type (Market or Limit). Its size is set by the plan and does not change there; Reduce only, one setting for all of the order's take-profits and stop-loss, reads as words there.

You can also move an order's lines on the chart: turn on the chart's Modify, drag a line, and confirm.

**An order placed outside goodcryptoX** (marked ext) changes the same way: goodcryptoX reads it fresh from the exchange, takes it in on that first change, cancels it by its exchange id and places the new one once the exchange confirms the cancel. From then on it is your order in goodcryptoX in everything but the ext mark, which stays. Its details say **Source: Imported from exchange**, and its event log starts with when it was placed on the exchange and its exchange id. A take-profit or a position take-profit and stop-loss placed in the exchange's app, an order grouped with others there, and one another copy of goodcryptoX placed can only be cancelled here: change them in the app that placed them. Take-profit and stop-loss are not attached to an order placed outside goodcryptoX.

## The order types

The form's type row is Market, Limit and a third cell that shows the type you last chose from the caret's menu, Trailing at first. The menu always lists Stop Market, Stop Limit, Trailing Stop, Trailing Stop Limit, Reverse Trailing Stop and Reverse Trailing Stop Limit in that order, with a check beside the selected one. The side selector above says Buy or Sell, so no name does; only the reverse ones keep their nickname, (Buy the Dip) or (Sell the Pump), by side.

| In the form | What it does |
|---|---|
| **Market** | "Buy/Sell at current market price". On Hyperliquid a market order is one order with a price limit far enough from the market to fill; what the orderbook cannot fill at once is cancelled, and the order ends partly filled. How far the limit goes, and the warning on a thin book: [Market orders](market-orders.md). |
| **Limit** | Buy or sell at your price or better. It rests on the orderbook; a buy below the market (a sell above it) waits for the price to come to it. |
| **Stop Market** | "Send Market order once trigger price is reached". goodcryptoX watches the last trade; when it reaches the trigger price, goodcryptoX sends a market order. A buy stop above the market is a breakout entry; a sell stop below the market is a stop-loss. |
| **Stop Limit** | "Send Limit order once trigger price is reached". The same, but at the trigger goodcryptoX places a limit order at your limit price. |
| **Trailing Stop** | The trigger follows the price at the distance you set, in percent or in the quote currency, and moves only in your favour. A sell: "If market price rises, keep trigger at a set distance below it. If price falls and touches the trigger, Sell at Market". A buy is the mirror: "If market price falls, keep trigger at a set distance above it. If price rises and touches the trigger, Buy at Market". |
| **Trailing Stop Limit** | A trailing stop that places a limit order at the trigger price, instead of a market order, when the price touches it. |
| **Reverse Trailing Stop** | **Buy the Dip** on the buy side, **Sell the Pump** on the sell side. A buy: "If market price rises, keep trigger at a set distance below it. If price falls and touches the trigger, Buy at Market". It enters in the direction of the move instead of guarding against it. |
| **Reverse Trailing Stop Limit** | The same, with a limit order at the trigger. |
| **Close position** | On a position's row, and the form's **Close**: closes the whole position at market, reduce-only. You give no size: goodcryptoX sizes it from the position at the moment it sends it. |

**A trailing stop, for example.** With BTC at 10,000 you place a Trailing Stop sell 10 % away: the trigger is at 9,000. The price rises to 11,000 and the trigger follows to 9,900. The price falls back: the trigger stays at 9,900, and when the price touches it, goodcryptoX sells at market.

**Trail start.** With a trail start, a trailing order waits for that price, then trails from the trail start itself. Left empty, it trails from the moment you place it.

**The trigger price** is compared with the last trade on the exchange. A stop fires at the trade that crosses its trigger, not at the trigger itself: if the price jumps from 105 to 111 over a stop at 110, the order goes at 111. A stop placed exactly at the last price fires at once (there it counts as a take-profit). The form does not warn about it: goodcryptoX warned "Your order will be triggered immediately" only on Hyperliquid's own stops, and a stop at the last price is never one here, goodcryptoX watches it itself.

**The minimum.** Hyperliquid takes no order worth less than 10 USDC, except a reduce-only order that closes the whole position. An order under 10 USDC is warned about, "Order value cannot be less than 10 USDC", as in goodcryptoX; **Send anyway** sends it and Hyperliquid answers. An order whose size closes the whole position exactly goes reduce-only by itself (the trade form adds the flag to that side's order and says "reduce only" under the button; the box stays yours; an order sent through the API gets the flag from goodcryptoX while the panel shows that account's positions, balances or trade form, as goodcryptoX then holds the position; otherwise it goes as sent and Hyperliquid judges it) and is not warned about; neither is **Close**.

## The ticks under the size

| Tick | goodcryptoX's explanation | On Hyperliquid, with goodcryptoX |
|---|---|---|
| **Post only** (limit orders) | "Ensures that your order is placed in the Order Book. If it would execute against existing orders, it will cancel instead. Used to pay lower Maker fee or collect Maker rebate" | The order goes to Hyperliquid as one that may only add to the book. If it would trade at once (a buy at or above the lowest offer, a sell at or below the highest bid), Hyperliquid refuses it and the order reads **Error** with a sentence of ours, and Hyperliquid's own words behind **Raw message**; nothing is placed instead. A DCA bot's **Post only** applies to its averaging orders. |
| **Reduce only** (futures) | "Ensures that this order will only reduce your position, not increase it. It will be amended down or canceled otherwise" | Hyperliquid takes the order only while it reduces your position, and refuses one that would increase it ("Reduce only order would increase position"). A position shortcut (Position 25 %, 50 %, 75 %, 100 %) sets the size only, as in goodcryptoX; a size that closes the whole position exactly makes that side's order reduce only by itself, the box untouched. Tick it on a stop or a trailing stop that protects a position: goodcryptoX then treats the order as an exit and, if the market cannot fill it, sends the rest again with a wider price. Spot has no Reduce only: there is no position to reduce. |
| **Improve only** (trailing stops) | "Adjust trailing algorithm so it will not trigger until price improves from current market price (or trailing start, when specified)" | Trailing begins only once the trigger would sit at your starting price: the market when you placed the order, or the trail start. A sell trailing 10 % from 10,000 starts trailing at 11,111.11, with the trigger at 10,000, so it never sells below where you started. goodcryptoX watches trailing orders itself, so this is goodcryptoX's rule, not Hyperliquid's. Not offered on a reverse trailing stop: the box shows only for a trailing stop and a trailing stop-limit. |

The other rows:

- **Trigger timeout** (stops): "Minimum amount of time Trigger condition should be satisfied for the order to execute. Use Timeout to ignore short-term price spikes." The first crossing starts the clock; when it runs out, goodcryptoX looks at the price again: still across, the order fires; back, it waits for the next crossing. The timeout adds risk: the price can run further while it counts.
- **TIF** (time in force): how long an order may rest before goodcryptoX cancels it, from one minute to one year; your default is in Settings › General › Trading. It then reads **Expired**, with no alert. The take-profit and stop-loss of an order that filled do not expire with it; they have their own time in force.
- **Delayed**: the order is sent that long after you press the button. If its time comes while goodcryptoX is off, it is sent when goodcryptoX is back, however late.
- **Expected price** (stops and trailing orders): the price the order is expected to fill at, shown in place of a price field.

## Take-profit and stop-loss

Switch on **Take Profit** and **Stop Loss** in the form. They belong to your order: they are placed once it has **filled in full** (an order that ends partly filled leaves that part without them, and says so), sized from what filled, and sell (or buy back) on the other side. Their own **Time in force**, under the block, is **Until cancelled** unless you choose one; it counts from the full fill ([details](tp-sl.md#their-own-time-in-force)). Under the buttons the form says what they will do, in goodcryptoX's words, for example after "Buy 0.5 contracts of HYPE.USDC at 87.88. If this order is fully filled:":

- **Take Profit**: "Sell 100% at market if price rises by 5%". With more targets (**+1 TP**) each closes its own share: "Take Profit 1: Sell 50% at limit if price rises by 3%", "Take Profit 2: Sell 50% at limit if price rises by 6%". Targets that add up to less than 100 % leave the rest to the stop-loss.
- **Stop Loss**: "Sell 0.5 HYPE at market if price falls by 2%", "Sell 0.5 HYPE at market if price falls to 85 USDC", or "Sell 0.5 HYPE at market if loss exceeds 20 USDC" (the stop is placed where the loss on what you hold reaches that amount).

**TP type.** "Choose between Limit or Market order for your Take Profit. Limit order protects from price slippage and in many cases saves trading fees. Market order does not freeze your balances while waiting for the trigger." A limit take-profit rests on the exchange; a market one is watched by goodcryptoX. A stop-loss can sit beside a Limit take-profit on futures and on spot; nothing is greyed or refused.

**Trailing Stop Loss.** "If the price moves in your favor, Trailing Stop Loss will follow it at the chosen % distance, improving your potential exit price. If the market price moves against you, Trailing Stop Loss will remain in place."

**Trailing Take Profit** replaces the targets with one trailing exit: "Activate at ~102. Trail (follow) market once activated. When it moves 1% against me - Sell 100% at market". Nothing trails before the activation price, which is your minimum profit.

**Follow TPs** (once both are on) moves a stop-loss as targets fill: **Off** leaves it; **Move to breakeven** moves it to your average entry once the first target filled; **Follow TPs** moves it to the entry after the first target, then to the previous target's level after each next one.

**SL trigger timeout**: None, 1 s, 3 s, 5 s, 10 s, 30 s, 60 s or 120 s, as a stop's trigger timeout above.

On a position you already hold, however you built it: [Take-profit and stop-loss on what you hold](tp-sl.md). Every take-profit and stop-loss block, on an order or a position, is a row of [My trades](trades.md).

<a id="repeat"></a>

## Copy

Copy opens a prefilled form:

- **Copy** on an order in your lists fills the order form with the same order (its pair, side, type, price and size) without leaving the screen; **Reverse** fills it with the other side. Nothing is sent until you press Buy or Sell.
- **Copy** on a DCA bot (its row in the Bots list, and its details) opens the Bots side of the form with every setting the bot had, ready to change and to launch; it starts nothing by itself ([the DCA bot](../bots/dca-running.md#the-header)).
The **Repeat** setting on a DCA bot means something else: the bot starts a new cycle after its take-profit (or after Close pos.), and, with **also after a stop loss** ticked, after its stop-loss too, once its **Cooldown** has passed.

An order that repeats itself, cycle after cycle, outside a bot is *planned* for a later version.
