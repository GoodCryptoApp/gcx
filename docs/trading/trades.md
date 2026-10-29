# My trades

*The list comes to the panel in a later version.* My trades lists every take-profit and stop-loss block that is yours, not a bot's: on a futures position and on an order (see [Take-profit and stop-loss on what you hold](tp-sl.md)). goodcryptoX 2.0 called market prints and executed orders "Trades"; this is "My trades" so the three are not confused.

Each row: when it was set, the coin and the account, long or short, what the take-profit and stop-loss still cover, the entry (the position's, or the order's average fill), each take-profit and the stop-loss with its level, size and what it filled, the realized profit and loss, the funding, and where it stands:

- **Waiting**: on an order that has not filled yet.
- **Open**; on a position also **following position**.
- **Repair**: a take-profit or stop-loss needs you, or the exchange shows no position under them (see "What goodcryptoX checks").
- **Done**, with how: filled (a take-profit or the stop-loss sold everything), closed (a goodcryptoX order closed the position), closed outside goodcryptoX, reversed, liquidated, or cancelled.

**Realized profit and loss** is what the take-profits and the stop-loss sold, against the entry they closed: the position's entry at that moment, or the order's average fill, net of their fees and, on an order, its own fee share. The exchange's own figure on the fill is not used: Hyperliquid computes it against the account's whole position, which is wrong for an order's exits when other trades share the coin. **Funding**: on a position, each hourly payment whole; on an order, its share, the payment times what the order's exits still hold divided by the account's position, signed, so it is exact per unit whoever else holds the coin (long 0.01 while the account is net short 0.99 and receives 0.99: the order pays 0.01).

Rows stay after they end. For programs: the `my-trades` topic ([schema](../reference/schemas/my-trade-row.schema.json)), a snapshot of every row, then each change.
