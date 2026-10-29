# Language

goodcryptoX offers twenty languages. Settings lists them alphabetically by their English names: Arabic, Chinese Simplified, Chinese Traditional, English, French, German, Hebrew, Indonesian, Italian, Japanese, Korean, Polish, Portuguese, Romanian, Russian, Spanish, Thai, Turkish, Ukrainian and Vietnamese.

## Choosing a language

Open Settings › General › Language (one row with the language in use; it opens the list). Each language shows its own name with its English name under it, and a check on the one in use. Pick one: goodcryptoX saves it and the page reloads in that language. The page declares your chosen language to the browser and asks it to keep goodcryptoX’s own translations.

The first time you open goodcryptoX, the language of your browser is chosen for you and saved (German from Germany is German, Brazilian Portuguese is Portuguese, Taiwan's and Hong Kong's Chinese is Traditional Chinese, Hebrew is Hebrew). A language goodcryptoX does not offer is English. After that, goodcryptoX never changes your choice by itself; only you do, on this page.

Polish, Romanian, Japanese and Thai are new in 3.1; a text a language does not have yet shows in English. Your Telegram messages and their buttons follow the same choice from the next message on, with numbers in your language's style.

**Improved translations between releases.** goodcryptoX fetches improved translations of your language from our translations site between releases: when you open goodcryptoX in your browser, at most once every six hours, and when you change the language. Nothing else is sent, and nothing is fetched in English. Each file is checked against our signature, and a text whose English has changed since it was translated is not used, so a bad or old file never shows: goodcryptoX keeps the texts it came with. Telegram uses the new texts from the next message, the panel from the next time you open it. They stay in goodcryptoX's data folder until the next update ([Privacy](../legal/privacy.md)).

## Numbers

The numbers follow the language, as they do in the apps people use in it. Digits are always 0 to 9.

| Languages | Thousands | Decimal point | 1,234,567.891 reads |
|---|---|---|---|
| English, Japanese, Thai, Korean, Chinese (both), Arabic, Hebrew | comma | point | 1,234,567.891 |
| German, Spanish, Italian, Portuguese, Romanian, Turkish, Vietnamese, Indonesian | point | comma | 1.234.567,891 |
| Russian, Ukrainian, Polish | space | comma | 1 234 567,891 |
| French | narrow space | comma | 1 234 567,891 |

Percent signs and the `x` of leverage stay right after the number in every language.

**The boxes you type in.** An order box and a bot's parameter box in its details show the language's decimal mark (`1234,5` in German) and no thousands marks. You can type either a point or a comma as the decimal mark; a number with both (`1.234,5`) is refused as invalid, never guessed. So a point is never a thousands mark in a box: in German, `1.234` typed is one point two three four (the box then shows `1,234`), not one thousand two hundred and thirty-four; type `1234`. The window that opens when you press the order button, and the description under it, say what will be sent in your language's style, for example `Buy 1.234,5 BTC`: read it before you confirm. What a bot's details and the bot form write back of a number you set (a distance, a size, "now 1,5 on the runtime") uses the same mark, as you typed it. Whole-number boxes (counts, leverage, minutes) have no mark.

The chart keeps its own style, `1234.5`, in every language, because it is drawn by the charting library.

## Times and dates

Clock times are 24-hour in every language (`16:03:05`), so columns stay the same width. The order of day and month and the month names follow the language.

## Arabic and Hebrew

Arabic and Hebrew are written from right to left. goodcryptoX turns the whole page around: the menu is on the right, text starts at the right, arrows and switches point and slide the other way, and the back arrow points right. Numbers, prices and pairs stay left to right inside the text, with their sign in front, so `-84,300.5` reads correctly.

The orderbook and the list of trades are not turned around: bids, asks and their columns stay where they are, so a trader reads them as everywhere else.

## The chart

The chart is shown in your language where its library has it: Arabic, German, Spanish, French, Hebrew, Indonesian, Italian, Japanese, Korean, Polish, Portuguese, Romanian, Russian, Thai, Turkish, Vietnamese and both Chinese. The library has no Ukrainian, so the chart stays in English for Ukrainian, as it did in goodcryptoX 2.0.

App explanations use the goodcryptoX name in every language. Account balance hints use the same short wording conventions, including Korean particles and Taiwan Traditional Chinese vocabulary.
