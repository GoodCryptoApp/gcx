# DCA bot

<!-- Base: https://docs.goodcrypto.app/dex-trading-spot/bots/dca-bot and the 2026-10-21 rewrite; facts checked against integrated 3.1 (D2b/D2c and DOCS-AUDIT-3.1). -->

![A DCA bot set up on the Trade page: the form on the right, and on the chart its take-profit, its entry, ten averaging orders and its stop-loss](../pictures/dca/setup-10-chart-ladder.webp)

DCA stands for dollar-cost averaging. A DCA bot opens a position, then adds to it at set prices if the market moves against you. Buying lower reduces your average entry price; on a short, selling higher raises it.

For example, buying equal amounts of a coin at 100 and 90 gives you an average entry of 95. A 3% take-profit target is then 97.85, before fees. You need a smaller rebound to reach that target than you would after buying only at 100.

You choose the entry, the averaging orders and the exits. After Take Profit or Stop Loss, the bot can stop or repeat with the same settings. This gives you several ways to use it:

1. **SAFETY NET**\
   Enter positions knowing that should the market move against you, you'll buy more at a lower price and your enabled TP target will follow the new average unless fixed to entry or moved to break even. All without you lifting a finger.
2. **VOLATILITY SCALPER**\
   Run the bot on volatile coins on repeat, covering 50%+ price range with averaging orders. A size multiplier of 2 makes successive orders grow: 10, 20, 40, 80 in your chosen unit. This puts more money into the position as price moves against you. Choose the sizes with the full sequence in mind, rather than only the first order.
3. **SCALE ORDER**\
   If your entry strategy involves placing multiple orders on several levels, use the bot to do that for you. If you want to keep that position, turn **Take Profit** off, untick **Close pos. on stop**, and stop the bot once you hold the amount you wanted. You then manage the position yourself.
4. **MULTIPLE TAKE PROFITS**\
   If you want to place multiple Take Profits for coins you hold on spot, start the bot with a **Sell order** on that pair. The bot's entry and averaging orders will act as your Take Profit levels. Turn **Take Profit** and **Stop Loss** off and untick **Close pos. on stop** so the bot does not buy the coins back.
5. **BTFD**\
   Buy the f\*ing dip! Accumulate ETH, BTC, SOL and other top coins automatically taking advantage of the market dips. Trend is your friend: if you believe that the coin will ultimately go up, then the lower it goes the more you want to buy it. DCA bot is the perfect tool for it. You can leave the purchased coins in your account by using the same [exit choices](dca-setup.md) as for a scale order.

> Averaging increases your position while price moves against you. A rebound may never reach your target; a continued move can cause a large loss.

Find trading ideas and share your experience in our [DCA Telegram channel](https://t.me/+EFAh0cdHrXw0OTNh).

## Spot and perpetuals

On spot, you buy the coin itself. A Sell order needs coins you already hold, including enough for the planned selling ladder. There is no leverage or liquidation.

On perpetuals, you can open longs or shorts and choose margin mode and leverage where supported. Funding paid or received is included in the bot's result. Check the funds in [Features & setup](dca-setup.md).

Choose your investment and whether to reinvest profits in [Features & setup](dca-setup.md). You can also wait for your chosen signals before each cycle.

You can change settings and monitor your position in [Running the bot](dca-running.md).

## Margin and liquidation

**Approx. margin** shows the funds needed to back your plan. Orders worth 1,000 at 5x need 200 in order margin, before fees and losses. Leverage also brings liquidation risk: the position can be liquidated before your averaging orders or stop help.

Check **Approx. liquidation** before launching. Use the lower leverage offered by the warning, or move your stop before liquidation. Cross is another choice where supported. The bot never adds margin by itself. These figures are estimates; fees, funding, gaps and other positions can change the outcome.
