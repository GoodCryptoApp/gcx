# How numbers are shown

The panel uses one set of rules for precision and separators. Compact figures such as `77.1k` and `1.2M` are reserved for the Dashboard’s Total, period PnL, Portfolio and Holdings blocks. The book, Trades, Positions, Orders, Bots, details, chart labels, form, account cards and selectors show full integer digits. This display change does not change Telegram formatting. The chart’s price scale keeps the instrument’s own decimals.

Showing a number never changes an order. What is sent to the exchange is rounded by the order form and by the exchange's own rules; nothing you read on screen is ever parsed back into an order. A text that states what an order sends (the line under a Buy or Sell button, a confirmation, the Close button) shows the order's exact size and price, with separators only: `Buy 12.34567 BTC`, never rounded.

## The rules

- **Significant digits, not fixed decimals.** A price or size shows up to five significant digits (`99.123`, `3,150.5`, `123,457`), never fewer than its whole part, and never more decimals than the instrument trades at. Money and percentages below 1 keep at least two significant digits (`0.000012`, `0.045%`).
- **Money in columns follows goodcryptoX’s smart rule.** From 100 up: no cents with separators, with full integer digits outside the named Dashboard blocks; 1.01–100: two decimals; 0.1–1.01: three decimals; smaller: two significant digits. Terminal zeros disappear. A rounded figure carries no tooltip repeating it with cents (the Dashboard header's Total is the one place that may show its exact amount on hover). Money in sentences keeps full figures and cents as before.
- **Money in a sentence has cents below 100 only.** From 100 up a line, a refusal or a Telegram message shows whole units with separators, never shortened: "109,765 USDC needed", while "87.50 USDC" keeps its cents. A *receipt* keeps the exact cents: the confirmation before an order is sent, Telegram's fill reports and its confirmations ("Order value: 109,765.33 USDC").
- **Rounding is half-up**, once: `0.125` is `0.13`, `-24.045` is `-24.05`. When rounding adds a digit, the decimals are taken again: `99.9996` is `100.00`.
- **Three places.** *Sentence*: Telegram, confirmations, previews. Trailing zeros are dropped: `at 80`. *Column*: lists, details, the book's and the trades' prices. Prices keep the zeros the instrument can trade at that magnitude, so a column lines up: `80.00` on ETH, `80.000` on HYPE. *Narrow*: the book's size and total, the trades' size, the selector's figure. Narrow sizes keep the column precision and narrow money keeps the sentence precision; both keep all integer digits. Only the named Dashboard aggregates may use `k`, `M`, `B` or `T`. Prices, percentages and leverage are never shortened.
- **Sizes and balances have no zeros at the end**, in every place, as in goodcryptoX 2.0: `0.3`, `0.052`, `12`, `-2`, `0.25 BTC`.
- **Sign.** A minus is always shown. A plus is added to a profit or loss that is positive (`+12.50`, `+10%`). A value that rounds to zero shows no sign.
- **Separators.** `,` every three digits and `.` for decimals, whatever your language. `%` and `x` follow the number with no space (`12.34%`, `3x`).
- **Token balances** are shown to five significant digits with no lot cap, because the exchange holds them finer than an order can trade: `9.9965`, `0.4`.
- **Percentages** from 1 up show two decimals within five significant digits: `12.34%`, `1,234.6%`, `123,457%`.
- **Leverage** shows at most two decimals, none if whole: `20x`, `2.5x`.
- **Counts** (rows in a list, iterations of a bot) are plain whole numbers: `1234`.

## Examples

Instruments: **U** has no limits (balances, unknown instruments); **ETH** trades prices to 2 decimals and sizes to 4; **COIN** prices to 6 decimals and whole sizes; **HYPE** prices to 4 decimals and sizes to 2; **BTC** prices to 1 decimal.

| Kind · place · rule | 0 | 0.00001234 | 0.5 | 0.999 | 1 | 80 | 99.1234 | 99.995 | 3150.5 | 21000 | 123456.7 | -24.05 | 1e9 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| price · sentence · U | `0` | `0.00001234` | `0.5` | `0.999` | `1` | `80` | `99.123` | `99.995` | `3,150.5` | `21,000` | `123,457` | `-24.05` | `1,000,000,000` |
| price · column · U | `0` | `0.00001234` | `0.50000` | `0.99900` | `1.0000` | `80.000` | `99.123` | `99.995` | `3,150.5` | `21,000` | `123,457` | `-24.050` | `1,000,000,000` |
| size · sentence · U | `0` | `0.00001234` | `0.5` | `0.999` | `1` | `80` | `99.123` | `99.995` | `3,150.5` | `21,000` | `123,457` | `-24.05` | `1,000,000,000` |
| size · column · U | `0` | `0.00001234` | `0.5` | `0.999` | `1` | `80` | `99.123` | `99.995` | `3,150.5` | `21,000` | `123,457` | `-24.05` | `1,000,000,000` |
| size · narrow · U | `0` | `0.00001234` | `0.5` | `0.999` | `1` | `80` | `99.123` | `99.995` | `3,150.5` | `21,000` | `123.5k` | `-24.05` | `1B` |
| money · sentence | `0.00` | `0.000012` | `0.50` | `1.00` | `1.00` | `80.00` | `99.12` | `100` | `3,151` | `21,000` | `123,457` | `-24.05` | `1,000,000,000` |
| money · receipt | `0.00` | `0.000012` | `0.50` | `1.00` | `1.00` | `80.00` | `99.12` | `100.00` | `3,150.50` | `21,000.00` | `123,456.70` | `-24.05` | `1,000,000,000.00` |
| money · narrow | `0.00` | `0.000012` | `0.50` | `1.00` | `1.00` | `80.00` | `99.12` | `100.00` | `3,150.50` | `21,000.00` | `123.5k` | `-24.05` | `1B` |
| money · signed · sentence | `0.00` | `+0.000012` | `+0.50` | `+1.00` | `+1.00` | `+80.00` | `+99.12` | `+100` | `+3,151` | `+21,000` | `+123,457` | `-24.05` | `+1,000,000,000` |
| money · signed · receipt | `0.00` | `+0.000012` | `+0.50` | `+1.00` | `+1.00` | `+80.00` | `+99.12` | `+100.00` | `+3,150.50` | `+21,000.00` | `+123,456.70` | `-24.05` | `+1,000,000,000.00` |
| money · column | `0` | `0.000012` | `0.5` | `0.999` | `1` | `80` | `99.12` | `100` | `3,151` | `21,000` | `123.5k` | `-24.05` | `1B` |
| money · signed · column | `0` | `+0.000012` | `+0.5` | `+0.999` | `+1` | `+80` | `+99.12` | `+100` | `+3,151` | `+21,000` | `+123.5k` | `-24.05` | `+1B` |
| percent · sentence | `0%` | `0.000012%` | `0.5%` | `1%` | `1%` | `80%` | `99.12%` | `100%` | `3,150.5%` | `21,000%` | `123,457%` | `-24.05%` | `1,000,000,000%` |
| percent · column | `0.00%` | `0.000012%` | `0.50%` | `1.00%` | `1.00%` | `80.00%` | `99.12%` | `100.00%` | `3,150.5%` | `21,000%` | `123,457%` | `-24.05%` | `1,000,000,000%` |
| percent · signed · sentence | `0%` | `+0.000012%` | `+0.5%` | `+1%` | `+1%` | `+80%` | `+99.12%` | `+100%` | `+3,150.5%` | `+21,000%` | `+123,457%` | `-24.05%` | `+1,000,000,000%` |
| price · sentence · ETH | `0` | `0` | `0.5` | `1` | `1` | `80` | `99.12` | `100` | `3,150.5` | `21,000` | `123,457` | `-24.05` | `1,000,000,000` |
| price · column · ETH | `0` | `0.00` | `0.50` | `1.00` | `1.00` | `80.00` | `99.12` | `100.00` | `3,150.5` | `21,000` | `123,457` | `-24.05` | `1,000,000,000` |
| size · sentence · ETH | `0` | `0` | `0.5` | `0.999` | `1` | `80` | `99.123` | `99.995` | `3,150.5` | `21,000` | `123,457` | `-24.05` | `1,000,000,000` |
| size · column · ETH | `0` | `0` | `0.5` | `0.999` | `1` | `80` | `99.123` | `99.995` | `3,150.5` | `21,000` | `123,457` | `-24.05` | `1,000,000,000` |
| price · sentence · COIN | `0` | `0.000012` | `0.5` | `0.999` | `1` | `80` | `99.123` | `99.995` | `3,150.5` | `21,000` | `123,457` | `-24.05` | `1,000,000,000` |
| price · column · COIN | `0` | `0.000012` | `0.50000` | `0.99900` | `1.0000` | `80.000` | `99.123` | `99.995` | `3,150.5` | `21,000` | `123,457` | `-24.050` | `1,000,000,000` |
| size · sentence, column · COIN | `0` | `0` | `1` | `1` | `1` | `80` | `99` | `100` | `3,151` | `21,000` | `123,457` | `-24` | `1,000,000,000` |

More examples:

- Ties round away from zero: `0.125` money is `0.13`, `2.345` on ETH is `2.35`.
- Rounding that adds a digit: `99.9996` in a column is `100.00`; `0.0999996` on COIN is `0.10000`; `0.0999` money is `0.10`.
- In the named compact Dashboard blocks, shortening starts above 21,000: `21000` money in a narrow place is `21,000.00`, `21000.01` is `21k`, `999960` is `1M`, `999950000000` is `1T`, `21050` is `21.1k`; a minus or plus stays: `-123456.7` is `-123.5k`. A price or a percentage is never shortened: `123456.7` is `123,457` and `123,457%`.
- Percentages below 1 in a column: `0.5` is `0.50%`, `0.05` is `0.05%`, `0.045` (a taker fee) is `0.045%`, `0.015` (a maker fee) is `0.015%`, `0.0118` is `0.012%`, `0.00118` (a spread) is `0.0012%`; in a narrow place the zeros stay too: `0.5` is `0.50%`.
- A value that rounds to zero loses its minus: `-0.000001` as a size on ETH in a column is `0`.
- Zeros at the end of a column by instrument: a price of `80` is `80.000` on HYPE, `80.00` on ETH and `80.0` on BTC; `99.1` on HYPE is `99.100`; a size of `1` on ETH is `1` and `0.5` is `0.5`.
- Balances: `9.9965` in a column is `9.9965`; `0.4` is `0.4` in a sentence and in a column.
- Leverage: `20` is `20x`, `2.50` is `2.5x`, `2.505` is `2.51x`.

## Compact money figures

The Dashboard's Total, period PnL, Portfolio and Holdings blocks shorten large amounts; everywhere else money keeps its full integer digits. Prices, sizes, percentages and the orderbook are never shortened.

Samples: `0.4567` → `0.457`, `50.5` → `50.5`, `3150.5` → `3,151`, `25303.2` → `25.3k`, `99999.99` → `100k`, `100000` → `100k`, `123456.7` → `123.5k`, `999999` → `1M`, `1234567` → `1.2M`, `0` → `0`, `0.1` → `0.1`, `1.01` → `1.01`, `100` → `100`, `21000` → `21,000`, `21000.01` → `21k`, `0.00999` → `0.01`, `-3150.5` → `-3,151`, `999999999` → `1B`, `999999999999` → `1T`.
