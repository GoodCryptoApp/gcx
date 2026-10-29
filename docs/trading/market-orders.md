# Market orders

Hyperliquid has no market order type: a market order is a limit order that fills what it can at once and cancels the rest (immediate-or-cancel), with a limit price far enough from the market to fill. goodcryptoX sends **one** such order and never a second by itself: what the book cannot fill at once is cancelled, and the order ends partly filled.

## How far the limit goes

At the moment the order is sent, goodcryptoX reads the coin's orderbook from the exchange once, as goodcryptoX 2.0 did, whether the order is yours, an agent's or a bot's, and whatever the panel shows. It walks that book: it takes the levels from the best price until your size is met, and the last level it reaches is how far your size needs the price to move. The limit, the **Max**, is the larger of:

- 10 % from the best price (goodcryptoX 2.0's market orders used 10 %), and
- 1.5 times the distance your size needs, a margin of safety because the book changes.

Example: you buy 0.01 BTC with the best ask at 100,001; 0.005 is offered there and the next offer is at 120,002. Your size needs the price to move 20 %, so the limit is 30 % above the ask, about 130,003. On a deep book the limit stays at 10 %.

goodcryptoX reads the book for each market order separately; a slow read delays only that order, never your other orders, cancels or stops. The one exception: while Hyperliquid allows your account [one request every 10 seconds](rate-limits.md), each order reads the book in its own turn, so the orders after it wait for that read too.

If the read fails, or the exchange does not answer within 10 seconds, the order is not sent: it ends refused with "cannot price a market order: the book could not be read" (goodcryptoX 2.0 said "Can't calculate market price"). goodcryptoX does not try again by itself; place it again when you choose. A stop whose market order is refused this way stays in your orders list as "The stop fired but its order could not be filled", and you are told, as for any stop the exchange refuses.

## Est / Max in the form

Under the size of a market order the form shows **Est** (the average price your size would fill at on the book now) and **Max** (the limit goodcryptoX would send), each with its distance from the best price, as Hyperliquid's own form does. They follow the book while the form is open; the order itself is priced from its own read when it is sent. A reduce-only market order and Close are sent the same way (see below), at most 25 % from the best price; the line is not shown for them.

## When the book is thin

If the limit would be more than 25 % from the best price, or your size is larger than the whole book goodcryptoX sees, the form warns you before sending:

> Thin orderbook: may fill up to 30% from the price

The percentage is how far from the price the order may fill: 1.5 times the distance the size needs the price to move, at least 10 %. **Send anyway** sends it at that limit, with no 25 % cap. Through the API the order is refused with `trade.msgMarketSlippage` and an `estimate` (the average, the limit and their distances); sending it again with that key in `overrides` sends it. A trading key's order is sent without the refusal: at 25 % at most, as a bot's, or at that limit when it names the warning in `overrides`; its largest order measures it at the limit it is sent at.

Where nobody is there to be warned, a DCA bot's market order, the limit stops at 25 %, and what the book cannot fill within it is cancelled.

**A stop that fires is a market order too** ("a stop = a market order"): a stop-loss, a take-profit, a Close, a stop-market or trailing order that fires. Each is one order, priced from one fresh read of the book when it is sent, at most 25 % from the best price. What the book cannot fill within it is cancelled, the order ends **partly filled** and you are told how much was left ("Part of the order did not fill (0.6 left); the rest was cancelled."). Nothing is sent again by itself, with one exception: a take-profit or stop-loss, and a DCA bot's close, is sent again for its rest until nothing is left or the exchange refuses (see [Take-profit and stop-loss](tp-sl.md)). Your own market order, Close and Execute now stay one order. If the exchange refuses it (the price moved, no liquidity), the order goes to **repair** with the exchange's words, and **Retry** sends it again when you choose.

A spot market buy given in the quote coin (**Max** included) is not warned: it is sent at 1 % above the ask, so it never pays more, and what the book cannot fill within that 1 % is cancelled. See [Spot trading](spot.md).

## Not changed yet

- The 10 % is fixed for now; a setting comes later.
