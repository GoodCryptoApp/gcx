# Spot trading on Hyperliquid

On a spot market (the **Spot** tab of the symbol list, for example HYPE/USDC) you buy and sell the coin itself: no leverage, no margin, no position. Buying spends the pair’s quote coin; selling sells coins you hold.

## The order form

- **Buy** and **Sell**, not "Buy / Long" and "Sell / Short" (as goodcryptoX 2.0's spot form). Under the price: **You pay** on a buy, **You get** on a sell.
- **What is available** is what is free in your spot account: a coin's total less what open orders hold. A buy is checked against the pair's quote coin free (USDC on most pairs; some are quoted in USDH, USDT0 or USDE), a sell against your free coin. goodcryptoX reads both fresh when you send; if the read fails the order is sent without the funds warning, never judged against zero, and Hyperliquid checks the coins, as in goodcryptoX 2.0.
- **Order types**: a market order is sent as one order priced through the book, as on futures. A market buy sized in the quote coin (**Max** included) is converted to coins at 1 % above the ask and sent at that price, not at the bound of [Market orders](market-orders.md): the exchange never holds more than the amount, so it is never refused for funds, and on a deep book it spends nearly all of it (99 to 100 %). If the ask rises between your click and the send, the size is cut to what the amount buys at the price sent (one step of the coin, or a few), so the exchange still holds no more than the amount. On a thin book it buys what is offered within that 1 %; the rest is cancelled and the order ends partially filled, as any market order's rest does. Such a buy has no thin-book warning (see [Market orders](market-orders.md#when-the-book-is-thin)): it never pays more than 1 % over the ask, and Est / Max under the size still show how far the book reaches. The form's other types (stops and trailing orders goodcryptoX fires itself) go through the same path. Until a later version, a stop or trailing buy given in the quote coin for all or nearly all of your free quote coin is refused by Hyperliquid when it fires: it is sized at its trigger price and sent 1 % above the ask, so it asks for up to 1 % more than is free. Give it about 1 % less than you have.
- **No Reduce only.** There is no position on spot to reduce, so the flag is not offered; an order sent with it through the API is sent without it, as goodcryptoX 2.0 did.
- **Sizes** are rounded down to the coin's step on Hyperliquid (HYPE: 0.01). **Prices** keep at most 5 significant figures and 8 − the coin's size decimals (HYPE: 6 decimals; futures allow 6 −, so cheap coins get finer prices on spot).
- **Minimum**: 10 USDC per order, as on futures.
- **Fees**: Hyperliquid's own spot fee. On a buy Hyperliquid takes it in the coin you buy (you receive a little less coin); on a sell in the quote coin. A DCA bot counts a buy's fee out of the coin it got. goodcryptoX's builder fee (0.03 %) is attached to every order; Hyperliquid's documents say builder fees are charged on spot sells only.

## Take-profit and stop-loss

On a spot order you place in goodcryptoX, the take-profit and stop-loss block works as on futures, with spot's rules: the exits are plain sells of what the order bought, less the fee taken in the coin and rounded down to the coin's step (no reduce-only); one exit at a time, so a stop-loss firing while a limit take-profit rests first cancels the take-profit and sells once the cancel is confirmed. A limit take-profit together with a stop-loss is taken.

A buy of exactly one lot of the coin (HYPE: 0.01) keeps no take-profit or stop-loss: once the fee taken in the coin is counted out, you hold less than one lot, so its exits are closed silently as dust. Buy a little more than one lot if the exits matter.

Take-profit and stop-loss on coins you already hold (bought elsewhere or earlier) come later; see [Take-profit and stop-loss on what you hold](tp-sl.md).

## DCA bot on spot

A DCA bot runs on a spot market as goodcryptoX 2.0's did: no leverage or margin is set; its take-profit is a plain sell; its stop-loss is watched by goodcryptoX, never placed on the exchange.

- **A short bot** sells coins you hold first: it is created only if your account holds the coin for its whole ladder.
- **A signal bot** (TA) can be armed to sell by a sell signal. It is created even if you lack the coin for a full sell ladder (the form's Funds needed shows the coin's column red before you launch), with a one-line warning in the answer; if a sell signal comes and the coin is missing, the exchange refuses the sell and goodcryptoX tells you.
- "Only this bot trades {instrument} in this account" on spot compares your holding of the coin (what the account has, orders resting included) with what the bot holds, at a start or a wake; coins you keep beside the bot's make them differ and you are told once; nothing is changed, and the bot's exits sell only what it bought.

Machine-readable: the orders route and its answers in [the API reference](../reference/openapi.json); the instrument list's `caps.spot` in `instrument-row.schema.json`.
