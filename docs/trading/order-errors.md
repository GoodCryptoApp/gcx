# When an order fails

**Error** means the order didn't go through. The line under it says why; when the exchange said something, its own words are behind that line.

## Sending it again <a href="#sending-it-again" id="sending-it-again"></a>

A failed order does not stop its bot. On a bot's failed order, **Retry** sends that order again; **Fix failed** on the bot's card sends all of its failed orders. A manual order has no Retry: press **Copy** on its row, fix what its section below says, and send it again.

**Retry** and **Fix failed** send the same order again. Where the fix is in a DCA bot's settings, the order is refused again this cycle, and the changed settings apply from the bot's next cycle. **Avg orders post only** is the one exception: a change applies from the next order the bot sends. On a Grid bot, saving new settings or adding or removing a level clears its failed orders and lays the grid out again.

## Post only, but it would have filled at once <a href="#post-only" id="post-only"></a>

The order would have traded at once instead of resting on the Orderbook. Send it again once the price has moved back, or without post only; on a DCA bot, turn off **Avg orders post only**.

## Not enough of the coin <a href="#funds" id="funds"></a>

The account did not have enough of the coin the order spends. Free or add that coin, then send it again.

## Not enough free margin <a href="#funds-margin" id="funds-margin"></a>

Other orders or positions leave too little margin for this order. Free or add margin, then send it again.

## Below the exchange's minimum order value <a href="#below-minimum" id="below-minimum"></a>

The order's value is below the exchange's minimum for this pair. Raise the order's value; on a bot, raise its order sizes in **Parameters**.

## Below the exchange's minimum order size <a href="#size-too-small" id="size-too-small"></a>

The order has fewer coins or contracts than the exchange accepts. Raise the size; on a bot, raise its order sizes in **Parameters**.

## Above the exchange's maximum order size <a href="#size-too-large" id="size-too-large"></a>

The order has more coins or contracts than the exchange accepts in one order. Lower the size; on a bot, lower its order sizes in **Parameters**.

## The exchange doesn't accept this size <a href="#size-step" id="size-step"></a>

The size does not fit the amounts the exchange accepts for this pair. On a manual order, choose an accepted size. On a bot's order, goodcryptoX rounded the size, so there is nothing for you to change.

## The exchange doesn't accept this price <a href="#price-step" id="price-step"></a>

The price does not fit the price steps the exchange accepts for this pair. On a manual order, choose an accepted price. On a bot's order, goodcryptoX rounded the price, so there is nothing for you to change.

## Price too far from the market <a href="#price-range" id="price-range"></a>

The price is outside the range the exchange allows around the market. Send it again once the market is closer, or choose a closer price.

## The price is already past the trigger <a href="#trigger-passed" id="trigger-passed"></a>

The order's trigger would fire as soon as the exchange took it. Choose a trigger on the other side of the current price; on a bot, change its settings.

## Reduce only, but it would have opened or increased a position <a href="#reduce-only" id="reduce-only"></a>

The order would add to a position rather than reduce it. Check the position, the side and the size before sending it again.

## Nothing on the Orderbook to fill it <a href="#no-liquidity" id="no-liquidity"></a>

There were no matching orders at the prices this order could trade at. Send it again later, or choose another price.

## This pair isn't trading on the exchange now <a href="#market-closed" id="market-closed"></a>

The exchange is not taking orders for this pair at the moment. Send it again once trading has resumed.

## The exchange doesn't take this order type on this pair <a href="#order-type" id="order-type"></a>

This pair does not support the order type sent. Choose a type the pair supports; on a bot, change its settings.

## Too many open orders on the exchange <a href="#open-orders" id="open-orders"></a>

The account has reached the exchange's open-order limit. Cancel orders you no longer need, then send it again.

## Over the exchange's position limit for this pair <a href="#position-limit" id="position-limit"></a>

This order would take the position past the exchange's limit. Reduce the order or the position, then send it again.

## The exchange isn't taking new positions on this pair now <a href="#oi-cap" id="oi-cap"></a>

The exchange has limited new positions across this market. Send it again once the exchange allows new positions.

## Your API key can't trade on the exchange <a href="#key-permission" id="key-permission"></a>

The exchange did not allow this API key to trade. Check the key's trading permissions and restrictions on the exchange, then send it again.

## API wallet unknown to the exchange: expired, replaced or revoked <a href="#api-wallet" id="api-wallet"></a>

The exchange no longer recognizes the API wallet that sent the order. Press **Replace API wallet** on the Dashboard, or open the account's **Edit account › Replace API wallet** ([Replace API wallet](../venues/hyperliquid.md#renew-the-api-wallet)), then send it again.

## The exchange doesn't let this account trade this pair <a href="#account-restricted" id="account-restricted"></a>

The exchange has restricted this account's trading on this pair. Check the account's restrictions with the exchange, and send it again once it allows the trade.

## The exchange didn't accept the order as goodcryptoX sent it <a href="#settings" id="settings"></a>

The fault is in how goodcryptoX built the order, not in your settings, so there is nothing for you to change. Sent again the same way, it is likely to be refused again.

## The exchange refused the order <a href="#unknown" id="unknown"></a>

The exchange gave no reason goodcryptoX knows. Its own words, behind the line, say more; check the order before sending it again.
