# Take-profit and stop-loss

Switch on **Take Profit** and **Stop Loss** in the form. They belong to your order: they are placed once it has **filled in full** (an order that ends partly filled leaves that part without them, and says so), sized from what filled, and sell (or buy back) on the other side. Their own **Time in force**, under the block, starts from your trading default unless you choose another; a duration counts from the full fill ([details](tp-sl.md#their-own-time-in-force)). Under the buttons the form says what they will do, in goodcryptoX's words, for example after "Buy 0.5 contracts of HYPE.USDC at 87.88. If this order is fully filled:":

- **Take Profit**: "Sell 100% at market if price rises by 5%". With more targets (**+1 TP**) each closes its own share: "Take Profit 1: Sell 50% at limit if price rises by 3%", "Take Profit 2: Sell 50% at limit if price rises by 6%". Targets that add up to less than 100% leave the rest to the stop-loss.
- **Stop Loss**: "Sell 0.5 HYPE at market if price falls by 2%", "Sell 0.5 HYPE at market if price falls to 85 USDC", or "Sell 0.5 HYPE at market if loss exceeds 20 USDC" (the stop is placed where the loss on what you hold reaches that amount).

## Take Profit type

**TP type.** "Choose between Limit or Market order for your Take Profit. Limit order protects from price slippage and in many cases saves trading fees. Market order does not freeze your balances while waiting for the trigger." A limit take-profit rests on the exchange; a market one is watched by goodcryptoX. A stop-loss can sit beside a Limit take-profit on futures and on spot; nothing is greyed or refused.

## Spot stop-loss with a Limit take-profit

With a Limit take-profit and a stop-loss both on, the spot form says **May cause sell price slippage**. The take-profit order holds your coins, so the stop-loss cancels it before selling. The price can move while the cancellation goes through, so the sale may fill lower than expected. If the cancellation fails, the stop-loss may not execute. The notice also appears when you modify an order with both exits; futures have no such notice.

## Trailing Stop Loss

**Trailing Stop Loss.** "If the price moves in your favor, Trailing Stop Loss will follow it at the chosen % distance, improving your potential exit price. If the market price moves against you, Trailing Stop Loss will remain in place."

For a Buy filled at 100 with a 10% trailing Stop Loss, the stop starts at 90. If price rises to about 111.11, the trigger rises to 100; a fall leaves it where it is until touched.

## Trailing Take Profit

**Trailing Take Profit** replaces the targets with one trailing exit: "Activate at ~102. Trail (follow) market once activated. When it moves 1% against me - Sell 100% at market". Nothing trails before the activation price; the trailing distance then determines the trigger behind the favourable price.

## Following Take Profit targets

**Follow TPs** (once both are on) moves a stop-loss as targets fill: **Off** leaves it; **Move to breakeven** moves it to your average entry once the first target filled; **Follow TPs** moves it to the entry after the first target, then to the previous target's level after each next one.

## Reduce only for attached exits

Keep **Reduce only** on for a perpetual order's attached Take Profit and Stop Loss if they must only close the position. It prevents an exit from flipping the position if other trading has already reduced or closed it. New orders and bots use the Reduce-only on TP / SL default; changing that default does not rewrite existing exits.

For an attached Stop Loss, **SL trigger timeout** works as described under [Trigger timeout](manual-trading.md#trigger-timeout). For the whole set of attached exits, see [Time in force](manual-trading.md#time-in-force).

On a position you already hold, however you built it: [Take-profit and stop-loss on what you hold](tp-sl.md). Every take-profit and stop-loss block, on an order or a position, is a row of [My trades](trades.md).
