# Trailing stops

## Trailing stop

**Trailing Stop**: The trigger follows the price at the distance you set, in percent or in the quote currency, and moves only in your favour. A sell: "If market price rises, keep trigger at a set distance below it. If price falls and touches the trigger, Sell at Market". A buy is the mirror: "If market price falls, keep trigger at a set distance above it. If price rises and touches the trigger, Buy at Market".

**Trailing Stop Limit**: A trailing stop that places a limit order at the trigger price, instead of a market order, when the price touches it.

**A trailing stop, for example.** With BTC at 10,000 you place a Trailing Stop sell 10% away: the trigger is at 9,000. The price rises to 11,000 and the trigger follows to 9,900. The price falls back: the trigger stays at 9,900, and when the price touches it, goodcryptoX sells at market.

## Reverse trailing stop

**Reverse Trailing Stop**: **Buy the Dip** on the buy side, **Sell the Pump** on the sell side. A buy: "If market price rises, keep trigger at a set distance below it. If price falls and touches the trigger, Buy at Market". It enters in the direction of the move instead of guarding against it.

**Reverse Trailing Stop Limit**: The same, with a limit order at the trigger.

## Trailing start and Improve only

**Trail start.** With a trail start, a trailing order waits for that price, then trails from the trail start itself. Left empty, it trails from the moment you place it.

**Improve only** (trailing stops): "Adjust trailing algorithm so it will not trigger until price improves from current market price (or trailing start, when specified)". Trailing begins only once the trigger would sit at your starting price: the market when you placed the order, or the trail start. A sell trailing 10% from 10,000 starts trailing at 11,111.11, with the trigger at 10,000; a Market fill can still slip. Not offered on a reverse trailing stop: the box shows only for a trailing stop and a trailing stop-limit.
