# The TA rating

The TA rating is goodcryptoX's rating of 26 indicators on a period's candles; a DCA bot with the **Signal** entry condition enters on it ([setting it up](../bots/dca-setup.md)).

## The 26 votes

Each indicator votes +1 (buy), 0 (neutral) or -1 (sell). The **score** is the sum of the 26 votes, from -26 to 26; the **rating** is the score divided by 26, shown to two decimals ("Strong Buy 0.54").

| Group | Indicators |
|---|---|
| 15 moving averages | EMA and SMA of 10, 20, 30, 50, 100 and 200 (12), VWMA 20, Hull MA 9, Ichimoku |
| 11 oscillators | RSI 14, Stochastic 14 3, Stochastic RSI 14 14 3 3, CCI 20, ADX 14, Awesome Oscillator, Momentum 10, MACD 12 26 9, Williams %R 14, Ultimate Oscillator, Bull Bear Power 13 |

An indicator without enough candles to work out votes 0.

| Score | Signal |
|---|---|
| 14 or more | Strong Buy |
| 3 to 13 | Buy |
| -2 to 2 | Neutral |
| -3 to -13 | Sell |
| -14 or less | Strong Sell |

Buy includes Strong Buy: a bot detecting Buy enters on either.

## When it is worked out

A DCA bot can enter on a TA rating while the candle is still forming. A Grid bot uses closed candles.

The bot enters on the signal showing, not on a change to it. After a cooldown, a signal still showing enters again. With several periods, every one must show the signal at the same time.

If a period's candles are late or cannot be read, its details say "delayed since" and the period keeps its last rating until they come back.

## Signal settings

DCA and Grid share the fixed indicator settings below. You choose the states and candle intervals in **Start when**; you cannot change the indicator parameters.

| Condition | Fixed definition |
|---|---|
| **TA rating** | The 26 votes described above. Buy includes Strong Buy; Sell includes Strong Sell. DCA uses forming candles; Grid uses closed candles. |
| **RSI** | 14 periods. Oversold is at or below 30; Overbought is at or above 70. Uses closed candles. |
| **MACD** | 12, 26 and 9. Bullish cross crosses above its signal line; Bearish cross crosses below. Uses closed candles. |
| **Bollinger bands** | 20 closes and two standard deviations. The close is at or below the lower band, or at or above the upper band. |
| **Price move** | Fell measures from the highest traded price in your duration; Rose from the lowest. It uses only the time since the bot began waiting, starting with that minute. See the [worked example](../bots/dca-setup.md). |

Every selected condition must hold on every selected interval. DCA's **Direct** uses the agreed side and **Inverse** reverses it; mixed or simultaneous buy/sell agreement waits. Grid uses one chosen signal side. See [DCA setup](../bots/dca-setup.md) or [Grid setup](../bots/grid-setup.md#entry-condition).
