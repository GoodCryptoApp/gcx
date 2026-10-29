# After goodcryptoX was off

When goodcryptoX comes back from any gap (it was off, the computer slept, the connection was down, or it restarted for an update), it sends everything that came due meanwhile, at once, however long it was away:

- **A stop goodcryptoX watches itself** (a stop-loss, a take-profit, a trailing stop, a stop entry, on its own or on a position or an order) is decided by the coin's first live trade after goodcryptoX is back. If that price is still past the level, the stop fires and its order goes at market, as any fired stop does (one order, priced from the orderbook; [Order types](order-types.md)). A late stop-loss still prevents a bigger loss. If the price crossed the level while goodcryptoX was away and is back inside it, the stop stays armed and fires only if the price crosses it again. On a coin that has not traded since goodcryptoX came back, the stop waits for its first trade.
- **A limit order** keeps resting on the exchange, which watched it all along.
- **An order you set to be sent later** (a delay, or **Send at** through the API) whose time came while goodcryptoX was away is sent when goodcryptoX is back.
- **An order goodcryptoX had decided but not yet sent** when it stopped (a stop that had just fired, a Close you pressed) is sent when goodcryptoX is back.
- **A DCA bot** whose start time or next cycle came while goodcryptoX was away starts it when goodcryptoX is back, priced from the market then.

Nothing waits for you because of a gap, and there is no setting for it. What each order or bot did is told in its usual messages, gathered in one report that names how long goodcryptoX was away; a fill far from an order's level shows in its own price.

What still waits for you is an order the exchange refused: it is in repair, with **Retry** and **Cancel** ([What the status words mean](../concepts/states.md)). An order whose answer from the exchange was lost is checked first and sent again only once goodcryptoX has proven it never arrived ([When goodcryptoX gets no answer](lost-answer.md)).

goodcryptoX had no missed orders either: its server ran all the time, and after its own restarts it fired every stop the price was past.
