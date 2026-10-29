# Order validation

Every order goes through one set of checks before it is placed, whoever sends it: the trade form (as a live preview), the agent tools, and the engine itself, which checks again with its own last price, mark, balances, position and leverage when the order arrives. The checks and their messages are the ones goodcryptoX 2.0 users know.

An order is described by an **order command** ([schema](../schemas/order-command.schema.json)): the instrument, the order type with only that type's fields, the side, the size with its unit (base asset, or quote; on perps quote means the order value, never the margin), prices, flags, a time in force for orders that can rest, an optional take-profit / stop-loss block, and one safety field:

- `overrides`: the warnings you chose to send anyway (the "Send anyway" button). The engine refuses a person's order if any other warning applies at the moment it arrives; a trading key's order is sent with its warnings, and only an error refuses it.

`expected` (the leverage and margin mode you saw) is deprecated since 2026-10-05: accepted and ignored. An order goes at the leverage and margin mode the exchange has when it is sent, as in goodcryptoX 2.0; the trade form shows the exchange's as soon as a read brings it.

Every number is a decimal string, so nothing is rounded on the way. At the engine's door the command is first checked against the schema (shape, types, which fields each order type may carry); the checks below then run on its values. A value that still cannot be read as a number is reported with the key of that field (below), never as a crash.

## Panel field editing

The manual form completes decimal inputs on blur before building its preview: prices floor to the current instrument tick, typed amounts to their selected-unit step, and manual TP/SL percentages/shares to their editable precision. A positive sub-step value completes to one step; a typed amount below the order minimum is not silently clamped. Base/quote editing converts at the existing order reference price. These panel operations do not replace the receipt’s conversion or the runtime’s independent checks. Total-loss blur does not apply a price-per-base tick to quote money.

Feedback is shown once at the owning field after interaction, or under the button when no field owns it; the global message list and count badge are removed. Runtime error/warning keys, explicit overrides and the exchange-band refusal below are unchanged. The form uses inline first-press warning acknowledgement and second-press Send anyway, without an additional dialog. Its identity is the shown registry key plus field owner; edits or changed warning sets reset it while the receipt/current command keep updating. Only existing OverridableKey entries enter the command. A UI uncertainty may still be refused by the unchanged runtime: this is not a backend reclassification or new override vocabulary.

## Errors and warnings

An **error** stops the order; nothing overrides it. A **warning** stops the order unless its key is in `overrides`. The checks run in this order (the order goodcryptoX 2.0 used); every applicable message is reported, not only the first.

| Key | Text | When | Kind |
|---|---|---|---|
| `error.InvalidPrice` | Invalid Price | No price to check against: the last price is 0, or missing on any order but a limit order, or the mark cannot be read. | error |
| `trade.msgNoPrice` | No price for {cur} yet: goodcryptoX cannot check this limit price against the market | New in goodcryptoX. A limit order on a coin goodcryptoX has no price for at all (no stream, and the one book read failed): judged at its own price, the checks against the market price pass, and this warning says so. goodcryptoX 2.0 sent such an order. A trading key's order is sent. | warning |
| `trade.msgPositionNotReady` | Current position unknown. Please, try again | Close while the position could not be read. An unknown position is never taken as flat. | error |
| `positions.msgNotFound` | Position not found | Close with no open position. | error |
| `trade.msgLeverageInvalid` | Choose desired Leverage | No longer raised since 2026-10-05 (an order needs no expected leverage). Was: a perp order without an expected leverage, or with 0 or an unreadable value. | error |
| `positions.errors.InvalidLeverage` | Invalid Leverage | A leverage change (`POST /api/v1/leverage`) below 1 or above the instrument's maximum, or in a margin mode the instrument does not allow (cross on an isolated-only instrument). Until 2026-10-05 also an order's expected leverage. | error |
| `trade.msgLeverageSync` | Syncing your margin mode & leverage with the exchange... | The exchange's leverage for the instrument is not known yet. | error |
| `trade.msgLeverageMismatch` | Your leverage or margin mode ({expected}) differs from the exchange's ({actual}). Re-check and send again | No longer raised since 2026-10-05 (the exchange's leverage is the order's). Was: the expected leverage or margin mode differed from the exchange's. | error |
| `trade.msgMinNotional` | Order value cannot be less than {min} {cur} | Size 0 or negative on an instrument with a minimum order value. | error |
| `trade.msgMinOrderSize` | Order size cannot be less than {min} {cur} | Size 0 or negative on an instrument without one; a size that is zero once floored to the size step ({min} is the step); a size that cannot be read. | error |
| `trade.msgTrailingEmpty` | Enter a trailing distance | Trailing distance empty, or one that cannot be read. New in goodcryptoX 2.0: the old app said "too large". | error |
| `trade.msgTrailingZero` | Trailing distance should be > 0 | Trailing distance 0 or negative. | error |
| `trade.msgTrailingDistance` | Trailing distance is too large | Percent distance 100 or more; an absolute distance that puts the first stop at or below zero, or at twice the last price or more; improve-only with no positive activation price. | error |
| `error.InvalidPrice` | Invalid Price | A limit price, trigger price or trail start of 0 or less, or one that cannot be read. | error |
| `trade.msgLimitBand` | Limit price is too far from the market price: the exchange will not accept it | New in goodcryptoX (B13). A limit order priced further from the last price than the exchange accepts (the exchange measures from its own oracle price, a little apart): on Hyperliquid perpetuals 80 % (the figure in the exchange's own refusal text). An exchange without a known figure has no bound. goodcryptoX 2.0 sent such an order and showed the exchange's refusal; sent anyway, so does this version. A stop-limit is not checked: its limit is sent when the trigger fires, near the price then. | warning |
| `error.NoLiquidity` | Trading pair is illiquid. Send Limit order instead | A market order with no price on the other side of the book. | error |
| `trade.msgMarketSlippage` | Thin orderbook: may fill up to {max}% from the price | New in goodcryptoX. A market order that is not reduce-only whose size, walked through the book read with the price, reaches so far that its bound (1.5 × that distance, at least 10 %) would pass 25 %, or is larger than the book shown. Sent anyway, it goes at that bound with no 25 % limit. No book levels at hand is no warning. See [market orders](../../trading/market-orders.md). | warning |
| `trade.msgInsufficientFunds` | You don't have enough {asset} to place this order ({needed} {asset} needed) | Perps: the margin is above what the exchange makes available for that side. Margin is charged only on the part that opens new exposure: an order against the position first closes up to its size, a reduce-only order opens nothing, and an unknown position is not netted. Spot: a buy's value above the quote balance, a sell's size above the base balance; spot stops are not checked (they lock nothing until triggered). | warning |
| `trade.msgMinNotional` | Order value cannot be less than {min} {cur} | The order value is below the minimum at the order's own price or at the mark (either one). Not raised for a reduce-only order that closes the whole known position exactly, which the exchange accepts. | warning |
| `trade.msgImmediateStop` | Your order will be triggered immediately | Take-profit and stop-loss on a position or an order: a level already crossed. Not raised on an order since 2026-10-05: goodcryptoX 2.0 warned only on the exchange's own stops, and a stop at the last price is a take-profit goodcryptoX watches itself; it fires at once. | warning |
| `trade.msgTrailStartImprove` | Trailing Start price can't be worse than Market | Only on exchanges that require it: a buy's trail start at or above the last price, a sell's at or below. | error |
| `trade.msgLimitProtectionBuy` | You are trying to buy at the price higher than the market | Limit buy above the last price. | warning |
| `trade.msgLimitProtectionSell` | You are trying to sell at the price lower than the market! | Limit sell below the last price. | warning |
| `trade.msgStopLimitProtectionBuy` | Buy price will be higher than the market! | Stop-limit buy with the limit at or above the trigger. | warning |
| `trade.msgStopLimitProtectionSell` | Sell price will be lower than the market! | Stop-limit sell with the limit at or below the trigger. | warning |
| `trade.bracket.msgInvalidTpSlRelation` | You've placed Take Profit or Stop Loss from the wrong side of the Base Order | The stop-loss is not on the losing side of the order's price, a take-profit is not on the winning side, or a take-profit is not beyond the stop-loss. | warning |
| `trade.bracket.msgInvalidTpSlPrice` | Take Profit and Stop Loss price should be > 0 | A take-profit or stop-loss level at or below zero, a stop-loss value of 0, a take-profit not beyond the stop-loss (as in goodcryptoX 2.0, that case is blocked even after "Send anyway"), or a value that cannot be read. | error |
| `trade.bracket.msgInvalidTTPActPrice` | Activation price should be >0. Decrease Trailing distance | A trailing take-profit with a minimum profit whose activation price is not positive. | error |
| `trade.msgTrailingEmpty` | Enter a trailing distance | A trailing stop-loss or take-profit with its distance empty or unreadable. | error |
| `trade.msgTrailingZero` | Trailing distance should be > 0 | A trailing stop-loss or take-profit distance of 0 or less. | error |
| `trade.msgTrailingSmall` | Trailing distance is too small | A trailing take-profit distance below 0.01%. New in goodcryptoX 2.0: the old app said "too large". | error |
| `trade.msgTrailingDistance` | Trailing distance is too large | A trailing stop-loss distance of 100% or more; a trailing take-profit distance of 100% or more on a short. | error |
| `trade.bracket.msgInvalidTrailDistanceSlTp` | Trailing Stop Loss must have a larger Trailing Distance than Trailing Take Profit | Both trailing, and the stop-loss distance is not larger. | warning |
| `trade.bracket.msgInvalidMtpSize` | Total size of all Take Profit targets should be 100% or less | The take-profit shares add up to more than 100%. | error |
| `trade.bracket.msgInvalidMtpsSizeBiggerThanMinAmount` | TP size is lower than minimum amount allowed by the exchange | A target's own size (its share of the order, floored to the size step) at its own price is below the minimum order value. | warning |
| `trade.bracket.msgInvalidMtpsValue` | TP value is lower than minimum value allowed by the exchange | A target value of 0 or less, or above 99% on a short. | warning |
| `trade.bracket.msgSlMinNotional` | Stop Loss is below the exchange minimum order value | Spot only: the stop-loss value is below the minimum order value. On perps the stop-loss closes the whole position with reduce-only, which the exchange accepts. | warning |

Placeholders are filled by the panel: `{min}` and `{cur}` from the instrument, `{asset}` and `{needed}` from the receipt, `{expected}` from the command and `{actual}` from the exchange, `{reach}`, `{max}`, `{bound}` and `{quote}` from the book (the runtime's refusal also carries them as `estimate`).

Take-profit and stop-loss levels are computed from the order's price: a percent or a quote distance on the winning side for a take-profit and on the losing side for a stop-loss, or an absolute price; an expected loss in quote becomes a stop-loss at price − loss ÷ size for a long (+ for a short). The bracket checks run once the order's own price and size are valid.

## The receipt

An order with no error comes with a receipt, the order as it will be sent. A refused order has one too, figured from the values that can be read: none when its size or its price cannot be worked out, and a trailing order whose distance cannot be read is figured at its start, as goodcryptoX 2.0 did. The receipt's size is the one conversion point: the engine sends exactly `baseSize`.

| Field | Meaning |
|---|---|
| `side` | buy or sell (for Close, the side that reduces the position). |
| `baseSize` | The size sent to the exchange, in the base asset, floored to the size step. A quote size is converted at the limit price for a limit, the trigger for a stop-market, the limit price for a stop-limit, the expected first stop for a trailing order, and the best price on the other side of the book for a market order. |
| `price` | That reference price. |
| `notional` | `baseSize × price`, in quote. |
| `funds` | What the order uses: on perps the margin in quote on the part that opens new exposure (0 for reduce-only); on spot the value in quote for a buy, the size in base for a sell. Not shown for Close. |
| `stopType` | Stops: `take-profit` or `stop-loss`, from the trigger's side of the last price; at exactly the last price it is a take-profit. |

A market order sized in quote is converted at the best opposite price; it executes at up to the market slippage cap, so on a thin book it can fill at a worse average and the exchange can still reject a value near the minimum.

## A bot's part of the position

When the validator is given the DCA bots on the account and coin (`bots`, each with its signed size), a close, or a reduce-only order larger than your own part of the position, answers `botShares`: each bot whose coins it would sell and its size (never refuse). It is information beside the answer, never an error and never a warning the send waits on. Absent when no bot's coins are in reach.

## Differences from goodcryptoX 2.0

- The checks run on the engine as well as in the form, with the engine's own prices, balances, position and leverage; a warning that appears between the preview and the arrival is refused unless it was overridden, and a leverage that changed in between is refused.
- The minimum order value is checked at the mark as well as at the order's price.
- A position that could not be read is never treated as flat.
- A trailing distance of 0 now says "should be > 0" instead of "too large".
- A take-profit on the wrong side of the order's price is reported (the check existed but never ran).
- The take-profit share check uses each target's floored size at its own price against the minimum order value, instead of a rounded percentage of a minimum size.
- A stop at exactly the last price warns for every stop, not only exchange-held stops.

an exit Custom deadline before its entry expiry returns HTTP 400 with `trade.bracket.msgExpiryBeforeEntry`; equality is accepted. A duration starts at full fill and is not compared as an absolute deadline. An exit Custom date more than a year after the entry's expiry (or, from the position, from now) is the overridable warning `trade.bracket.msgExpiryTooLong` ("TP/SL time in force cannot exceed one year"): a person's order is answered 422 until the key is in `overrides`, and a trading key's order is sent; an exits attach or edit is asked (422) of anyone, a key included, until the key is in `overrides`, as every exits warning is. A duration field above a year is still refused by the published schema (HTTP 400).
