# Manual trading

Each order type has its own page: [Market and Limit orders](market-and-limit.md), [Stop Market and Stop Limit](stop-orders.md), [Trailing stops](trailing-stops.md) and [Take-profit and stop-loss](take-profit-stop-loss.md). This page covers what every order shares.

Words in quotes are the form's own, which are goodcryptoX's.

<a id="resting-on-hyperliquid-or-watched-by-goodcryptox"></a>

## Resting on the exchange, or watched by goodcryptoX

Market and Limit orders go to the exchange when you send them. Stop and trailing orders wait for their trigger; keep goodcryptoX running for orders it watches.

A stop-loss closes a position when its trigger is reached. A stop that can open or add to a position (such as a breakout entry) has a 1% price limit.

## Change an order

Open the order's details. **Modify** opens the order form itself, filled in with the order as it is now: its side and type, its values, each flag as it is, and its take-profit and stop-loss as they are now. While it is open it takes the place of the details' rows. Only what can change on this order, of this type and in this state, is a field; what must be seen but cannot change (the side, the type, a filled order's size and price, time in force) reads as plain words; the rest is not shown. **Save** stays off until something differs, then asks once, "Apply these changes to the order?", with a line for each change ("Price to 72 USDC", "Take profit 2 to 11%"); **Cancel**, Escape, another order or another list tab leaves with nothing sent.

One Save is one change: the order's part and its take-profit and stop-loss go together, and both are applied or neither. A refusal leaves the order as it was, its reason under the form (a warning stays under the form and **Save** sends it anyway). If the exchange then refuses the order's new values, the old order and its take-profit and stop-loss come back as they were, and you are told once. If the old order fills before the new one is placed, the fill counts and the take-profit and stop-loss it had before the Save are the ones that arm. With no answer at all, the form stays with "Unconfirmed, check open orders" and **Reload**; Save again sends the same change, applied once at most.

Each value you can change also has a pencil in the details, for one quick change: **Size**, **Limit price**, **Trigger price**, **Trailing distance** and a waiting trailing order's **Trailing start price**, as that order type and its state allow; **Trigger timeout** is a list. A flag that is on (**Post only**, **Reduce only**, **Improve only**) shows as its own row with a click to turn it off; a flag is turned on from Modify. Type or pick the new value and press the check mark: that one change is sent at once. The cross puts the old value back. If the change is refused, the field stays open with its edge red and the reason in its tooltip. A bot's order has no pencils and no Modify: a bot's orders change from the bot.

An order goodcryptoX watches itself (a stop, a trailing stop) changes in place, at once. An order resting on the exchange is cancelled and placed again with the new values once the exchange confirms the cancel; if the exchange refuses the new one, the old one comes back by itself and you are told.

**Take profit and stop loss.** Until the order fills, its take-profits and stop-loss are a plan: they are not on the exchange and not rows of Open orders; the order's row shows them as +TP and +SL, and its details list them under it. There each one's price and size (its share, in %) have a pencil; a stop-loss's size is the whole. Once the order has filled, each one is an order of its own: open it from the list under the order; its **Modify** opens the first part of the form with that one take-profit or stop-loss, and everything in it changes but the size: its type (a take-profit's while it is the only one; several targets share one type, changed from the order's own form), its level (by price or by percent), a trailing take-profit's or stop-loss's distance, a trailing take-profit's minimum profit while it waits, a stop-loss's trigger timeout and Follow TPs, and the time in force of the order's take-profits and stop-loss (one for all of them). Its size is set by the plan and does not change there; Reduce only, one setting for all of the order's take-profits and stop-loss, reads as words there. On its page the **Trailing distance** of a trailing take-profit or stop-loss has a pencil too, and moving its lines on the chart (a trailing take-profit's **Activate**, a stop-loss's trigger) changes the same plan as the form does.

You can also move an order's lines on the chart: turn on the chart's Modify, drag a line, and confirm.

**An order placed outside goodcryptoX** (marked ext) changes the same way: goodcryptoX reads it fresh from the exchange, takes it in on that first change, cancels it by its exchange id and places the new one once the exchange confirms the cancel. From then on it is your order in goodcryptoX in everything but the ext mark, which stays. Its details say **Source: Imported from exchange**, and its event log starts with when it was placed on the exchange and its exchange id. A take-profit or a position take-profit and stop-loss placed in the exchange's app, an order grouped with others there, and one another copy of goodcryptoX placed can only be cancelled here: change them in the app that placed them. Take-profit and stop-loss are not attached to an order placed outside goodcryptoX.

## The order types

The form's type row is Market, Limit and a third cell that shows the type you last chose from the caret's menu, Trailing at first. The menu always lists Stop Market, Stop Limit, Trailing Stop, Trailing Stop Limit, Reverse Trailing Stop and Reverse Trailing Stop Limit in that order, with a check beside the selected one. The side selector above says Buy or Sell, so no name does; only the reverse ones keep their nickname, (Buy the Dip) or (Sell the Pump), by side.

### Close position, liquidation and ADL

**Close position**: On a position's row, and the form's **Close**: closes the whole position at market, reduce-only. You give no size: goodcryptoX sizes it from the position at the moment it sends it.

**Liquidation** means the exchange closed the position under its margin rules. **ADL** means the exchange auto-deleveraged it by closing it against an account it liquidated. These are exchange actions, not order types you select in the form.

**The trigger price** is compared with the last trade on the exchange. A stop fires at the trade that crosses its trigger, not at the trigger itself: if the price jumps from 105 to 111 over a stop at 110, the order goes at 111. A stop placed exactly at the last price fires at once (there it counts as a take-profit).

**The minimum.** The minimum order value and any exception for a reduce-only order that closes the whole position depend on the exchange and market. The form warns when an order is below the applicable minimum; **Send anyway** sends it for the exchange to accept or refuse. On perpetuals, an order whose size closes the whole position exactly goes reduce-only by itself; the form says "reduce only" under the button and leaves the box unchanged. Where the exchange exempts a full-position close from its minimum, that order and **Close** are not warned about.

## The ticks under the size

### Post only

**Post only** (limit orders): "Ensures that your order is placed in the Order Book. If it would execute against existing orders, it will cancel instead. Used to pay lower Maker fee or collect Maker rebate". The order goes to the exchange as one that may only add to the book. If it would trade at once (a buy at or above the lowest offer, a sell at or below the highest bid), the exchange refuses it and the order reads **Error** with a sentence of ours, and the exchange's own words behind **Raw message**; nothing is placed instead. A DCA bot's **Post only** applies to its averaging orders.

### Reduce only

**Reduce only** (futures): "Ensures that this order will only reduce your position, not increase it. It will be amended down or canceled otherwise". The exchange amends down, cancels or refuses an order that would increase your position, according to its rules. A position shortcut (Position 25%, 50%, 75%, 100%) sets the size only, as in goodcryptoX; a size that closes the whole position exactly makes that side's order reduce only by itself, the box untouched. Tick it on a stop or a trailing stop that protects a position: goodcryptoX then treats the order as an exit and, if the market cannot fill it, sends the rest again with a wider price. Spot has no Reduce only: there is no position to reduce.

### Trigger timeout

**Trigger timeout** (stops): "Minimum amount of time Trigger condition should be satisfied for the order to execute. Use Timeout to ignore short-term price spikes." The first crossing starts the clock; when it runs out, goodcryptoX looks at the price again: still across, the order fires; back, it waits for the next crossing. The timeout adds risk: the price can run further while it counts.

**SL trigger timeout**: None, 1 s, 3 s, 5 s, 10 s, 30 s, 60 s or 120 s, as a stop’s trigger timeout above.

### Time in force

**TIF** (time in force): how long an order may rest before goodcryptoX cancels it, from one minute to one year; your default is in Settings › General › Trading. It then reads **Expired**, with no alert. The take-profit and stop-loss of an order that filled do not expire with it; they have their own time in force.

An attached Take Profit and Stop Loss have their own Time in force. A duration counts from the entry order's full fill, rather than when you first placed it. An explicit deadline remains that deadline. The entry's expiry does not expire exits that already armed after its full fill.

**Delayed**: the order is sent that long after you press the button. If its time comes while goodcryptoX is off, it is sent when goodcryptoX is back, however late.

**Expected price** (stops and trailing orders): the price the order is expected to fill at, shown in place of a price field.

## Order value and margin

**Order value** is the size multiplied by price, in the pair's quote currency. For example, 2 coins at 100 have a value of 200. Contracts use the contract's size and value convention; check the units in the form.

On perpetuals, **Margin** is your own money backing the position. At 5x leverage, an order worth 1,000 needs about 200 in margin: order value divided by leverage, before fees and losses. **Leverage** increases the exposure backed by your funds; it does not multiply the amount of money you own.

**Isolated margin** backs a position with a designated amount. Higher leverage needs less initial margin but brings liquidation closer. **Cross margin** shares your available account collateral across positions: it can give one position more room, while putting that shared balance at risk. Check which account balances the exchange accepts as collateral. Where supported, choose isolated leverage in the form; in Cross, the whole eligible balance backs the position.
<a id="repeat"></a>

## Copy

Copy opens a prefilled form:

- **Copy** on an order in your lists fills the order form with the same order (its account, pair, side, type, price and size) without leaving the screen; **Reverse** fills it with the other side. Nothing is sent until you press Buy or Sell.
- **Copy** on a DCA bot (its row in the Bots list, and its details) opens the Bots side of the form with every setting the bot had, ready to change and to launch; it starts nothing by itself ([the DCA bot](../bots/dca-running.md#the-header)).
The **Repeat** setting on a DCA bot means something else: the bot starts a new cycle after its take-profit (or after Close pos.), and, with **also after a stop loss** ticked, after its stop-loss too, once its **Cooldown** has passed.

An order that repeats itself, cycle after cycle, outside a bot is *planned* for a later version.

If the account’s API key expires in under 24 hours, sending a manual order shows the warning and **Send anyway**. Confirming sends the order as entered, with no expiry-driven change to its size or price. Exactly 24 hours remaining has no such warning. After expiry, the exchange answers. Close and automatic exits continue.

## Order details

**Open price** is the market price when the order was created. For an attached Take Profit or Stop Loss it is the base order's fill price; for exits on a position, it is the position's entry price. It is a reference for the order, not necessarily the price at which it fills.

**Price improvement** compares the fill with the market price when trailing began. Positive means a better fill, negative a worse one: lower is better for a Buy, higher for a Sell. For example, a Buy trailing from 100 and filled at 95 improved its price; a Sell with those same prices did worse.

## Account position details

**Entry** is the average price at which the account position was created. It covers the whole position, including contributions from bots and your own non-bot orders, whether placed here or through other apps or programs on that account.

**Mark Price** is the exchange's price for valuing this contract's position and margin. It can differ from the **Last Price**, the most recent trade. The position's **Unrealized PnL** values its open profit or loss at Mark Price.

**Margin** is the funds backing the position. **ROE**, Return on Equity, is Unrealized PnL divided by position margin, expressed as a percentage. For example, 20 unrealized profit on 200 margin is 10% ROE. A bot's own return figures use its own investment base, so they need not match the account position.

**Liquidation** is the Mark Price at which the exchange liquidates the position. In Cross, it can move as your other positions and shared collateral change. It is not a fixed stop order.

## Sources in the trade lists

An order's source says who or what placed it; a bot's source says who or what created it. A position can have several contributors, because orders from you, bots, agents or outside goodcryptoX can all change the same account position. Its source shows those contributions rather than assigning the entire position to its latest trade.

**External** marks an order placed outside this goodcryptoX. It can still appear in your account's orders and history. The mark describes its origin, not another balance or a separate position.

## PnL, ROE and APR in the lists

**PnL** means profit and loss. Realized PnL is the result already closed; unrealized PnL is the changing result of a position still open. Where Total PnL is shown, it combines them.

**ROE** means Return on Equity: profit or loss as a percentage of your own funds backing the position or bot. A position uses its margin; a bot uses its Own funds. **APR** means Annual Percentage Rate: a bot's realized return projected over a year from its running time. It is a comparison of performance so far, not a promised yearly profit. Open the bot's Profitability section for its investment base, fees and funding.

## Order states

Point at an order's status for its reason, then open the details for fills and available actions.

- **Waiting** means a stop has not triggered, a trailing order has not started following, or a send is waiting its turn. The explanation distinguishes them and names any requests ahead of it. A take-profit, a stop-loss or a trailing order names the price it waits for: "Waiting for 77,142.9" is a trailing take-profit's activation (the chart's **Activate** line) or a stop's trigger.
- **Trailing** means the trigger is following price. **Open** means an order is working on the exchange; **Partially filled** means only part has traded so far.
- **Held** means a send needs attention after goodcryptoX stopped, the disk filled or maintenance interrupted it. Read the reason and offered action before sending again.
- **Checking** means goodcryptoX is checking with the exchange. **Unknown** means the outcome still needs resolving; neither means the order definitely failed to reach the exchange.
- **Filled** means the order traded. **Canceled** ends the unfilled rest; any filled part still counts. Its reason can name your cancel, a position that closed or changed side, or another exit that closed it.
- **Expired** means Time in force ended. **Error** gives the refusal or failure in the details; **Raw message** holds the exchange's own words when available.
- **Left** means the account was removed and the order was left on the named exchange. It was not canceled there. Check it on the exchange, since goodcryptoX no longer manages that account.

## Your orders in the orderbook

A dot beside a price marks your resting orders at that price. Point at it for their count and combined remaining size, in the book's selected unit. A partially filled Limit order keeps its dot for the part still resting. Stops waiting for a trigger do not have a dot because they are not resting in the book.

When prices are grouped, one dot can represent several orders in that price group. Orders beyond the displayed depth have no visible row, so the absence of a dot does not prove you have no order there. Check Open orders for the full list.
