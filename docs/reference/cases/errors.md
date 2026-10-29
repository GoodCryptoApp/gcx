# Cases: what an answer meant

Every answer of the exchange maps to exactly one action class (`exchanges[].class` in a case, `header.trigger.class`), and the timeline names it after the answer. A refusal's text is matched against the registry below, in this order: the first pattern it contains decides; a text no pattern matches is `UNKNOWN`.

## The classes

## `REJECTED_TERMINAL`
Refused for good: the order is never sent again as it is (a price off the tick, a value under the minimum, not enough margin, a leverage refused).

## `PRICE_RACE`
A post-only order would have matched at once: goodcryptoX prices it again at the fresh best price, a bounded number of times.

## `NO_LIQUIDITY`
Nothing to match an immediate order against: that attempt ends; an exit tries again at a wider price.

## `ALREADY_FLAT`
A reduce-only order would have grown the position: it was already closed elsewhere. goodcryptoX reads the position and finishes quietly.

## `NOT_FOUND`
The order was not found (never placed, already cancelled or filled): goodcryptoX looks it up by its client order id, fills first, and never reads this as "cancelled".

## `AUTH`
The API wallet or a signature was not accepted, or the builder fee is not approved: a start-up check, never retried per order.

## `NONCE`
The nonce was refused: signed again once, only when nothing had left goodcryptoX.

## `RATE_IP`
Too many requests from this internet address (HTTP 429): goodcryptoX waits.

## `RATE_ADDRESS`
The account's request allowance is spent. Hyperliquid's text names the allowance and the account's lifetime volume in dollars; a case keeps the text only up to its first words.

## `MAINTENANCE`
A failure while Hyperliquid announced maintenance.

## `UPGRADE_GATE`
Refused in the few minutes after Hyperliquid's upgrade when it takes only post-only orders: nothing was placed. The order waits and is sent again every 10 seconds, under the same client order id, until Hyperliquid takes one; no page, no repair.

## `UNAVAILABLE`
A read got no answer (no connection, a timeout, a 5xx): the figure is unknown, never zero; two minutes of no answer pages you.

## `RESOLVE`
An order or cancel got no answer: its outcome is unknown and goodcryptoX looks it up by its client order id; it is never read as "not placed" and never sent again blindly.

## `UNKNOWN`
An answer goodcryptoX does not know: new risk is held and you are paged; nothing is cancelled.

## The registry's patterns

## "Price must be divisible by tick size"
`REJECTED_TERMINAL`: the price is off the instrument's tick.

## "Order must have minimum value"
`REJECTED_TERMINAL`: the order's value is under the exchange's minimum.

## "Insufficient margin"
`REJECTED_TERMINAL`: not enough margin for the order.

## "Reduce only order would increase position"
`ALREADY_FLAT`.

## "Post only order would have immediately matched"
`PRICE_RACE`.

## "Order could not immediately match against any resting orders"
`NO_LIQUIDITY`: an immediate-or-cancel order found nothing.

## "Invalid TP/SL price"
`REJECTED_TERMINAL`: a trigger price on the wrong side.

## "No liquidity available for market order"
`NO_LIQUIDITY`.

## "Order would increase open interest while open interest is capped"
`REJECTED_TERMINAL`: the market's open interest cap.

## "Order rejected due to price more aggressive than oracle while at open interest cap"
`REJECTED_TERMINAL`.

## "Order would increase open interest too quickly"
`REJECTED_TERMINAL`.

## "Order has insufficient spot balance to trade"
`REJECTED_TERMINAL`: not enough of the coin on spot.

## "Order price too far from oracle"
`REJECTED_TERMINAL`.

## "Order would cause position to exceed margin tier limit at current leverage"
`REJECTED_TERMINAL`: lower the leverage or the size.

## "Order was never placed, already canceled, or filled"
`NOT_FOUND`.

## "Order was never placed"
`REJECTED_TERMINAL` (after the longer text above, which contains it).

## "User or API Wallet "
`AUTH`: the API wallet does not exist or is not approved (also what a bad signature produces). Its address appears in a case only as `a:` reference.

## "Builder fee has not been approved"
`AUTH`: the main wallet must approve goodcryptoX's builder fee once.

## "Builder fee is too high"
`REJECTED_TERMINAL`.

## "Order has invalid size"
`REJECTED_TERMINAL`: the size is off the instrument's lot.

## "Order price cannot be more than"
`REJECTED_TERMINAL`: the price is too far from the market.

## "Order has zero size"
`REJECTED_TERMINAL`.

## "Insufficient spot balance"
`REJECTED_TERMINAL`.

## "Insufficient balance"
`REJECTED_TERMINAL`.

## "Invalid leverage value"
`REJECTED_TERMINAL`.

## "Cross margin is not allowed for this asset"
`REJECTED_TERMINAL`: this market is isolated only.

## "Cannot switch leverage type with open position"
`REJECTED_TERMINAL`: a margin-mode change on a market where the account holds a position. Observed 2026-10-20 (the first public day). The person reads "Close the position to change the margin mode", Hyperliquid's words behind it; nothing is paged.

## "Invalid nonce"
`NONCE`.

## "Too many cumulative requests sent"
`RATE_ADDRESS`.

## "Only post-only orders allowed immediately after"
`UPGRADE_GATE`: Hyperliquid's post-only minutes after an upgrade ("… after network upgrade" or "… after a network upgrade").
