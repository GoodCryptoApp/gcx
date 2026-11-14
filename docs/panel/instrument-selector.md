# Instrument selector

Open the instrument in the Trade header to choose another pair. The pill at the left of the list, ★ | Spot | Perps, is the same pill the lists use: ★ for favourites, Spot for spot pairs, Perps for perpetuals. The search is the lists' search at the right end of the same row: press it and type. Search matches the pair, coin, quote asset, linked underlying name (such as Tesla or Gold) and instrument id, including a HIP-3 prefix such as `xyz:`. A star adds or removes a favourite. Arrow keys move the highlight, Enter picks it and Escape closes the list.

Inside Spot or Perps, **All | Crypto | TradFi** appears below the tabs when the exchange lists both kinds. All shows both. Your choice is remembered separately for Spot and Perps in this browser. Opening the selector chooses the current market’s tab. It keeps your kind choice if that choice includes the current market; otherwise it shows the market’s own kind for that opening.

Search covers both kinds in the current tab and selects All while you type. A matching market from the other kind appears in the same list. Clearing search restores your choice; pressing Crypto or TradFi clears search and shows that kind.

The rest of the page is dimmed while the selector is open; click outside it to close. Faint lines separate its rows.

Every row shows the **24h vol.** in your base currency from Settings, so you can compare markets with different quote coins; if a quote coin’s price is not known yet, its volume stays in that coin until the price arrives. Every row also shows its **24h change** in percent. Positive change is green, negative change red. Click either column heading to sort descending; click it again for ascending. When sorting by volume, rows still in their quote coin come after converted rows in either direction. Both sort triangles stay the same size; the active direction is brighter, with no underline on the heading. The rows above the separator are the instruments you picked last, kept in this browser per tab (the old app's rule): three on a shorter screen, five when there is room; they stay first even with a sort selected. A separator follows them.

The open list keeps its row order while live figures change. Searching, changing tabs, market kind or sort, or changing a favourite rebuilds that order. The tabs, search and two numeric columns keep the selector compact, without a second balances line. Your market-kind choices and sort stay in this browser; each opening starts on the current market’s tab. Favorites stay in your runtime.

The account selector gives every row a status between its name and the selection check: a muted **OK** when ready, a warning when something needs attention, or **Not set up** without trading keys. Selecting another account changes only the check; the columns stay in place.

## What the percentage covers

24h change is the price change the exchange reports for that market over the last 24 hours. Opening the selector reuses the cached catalogue and preserves the highlight and scroll, with no extra stream, timer or download.

Delisted instruments are unavailable for a new selection, even under a search or in favourites. Existing positions and open orders on them remain in the lists; their ids and trading records are unchanged. A spot pair with no 24-hour volume remains subject to the existing rule: hidden unless it is on screen or you hold its coin, an order, a position or a bot on it.

Stock, commodity, forex and ETF perpetuals stay in Perps. Stock tokens and shares sit in Spot. Choose TradFi to see them. TradFi contracts keep their tradfi tag, other perpetuals keep their contract tag, spot rows have no tag, and Hyperliquid markets keep their dex name. They use the same favorites, search and recent picks.

A market Hyperliquid has just listed may show under Crypto until the next app update; All and search always find it
