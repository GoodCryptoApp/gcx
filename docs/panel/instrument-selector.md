# Instrument selector

Open the instrument in the Trade header to choose another pair. The pill at the left of the list, ★ | Spot | Perps, is the same pill the lists use: ★ for favourites, Spot for spot pairs, Perps for perpetuals. The search is the lists' search at the right end of the same row: press it and type. Search matches the pair, coin, quote asset and instrument id, including a HIP-3 prefix such as `xyz:`. A star adds or removes a favourite. Arrow keys move the highlight, Enter picks it and Escape closes the list.

The rest of the page is dimmed while the selector is open; click outside it to close. Faint lines separate its rows.

Every row shows the **24h vol.** in the instrument's quote currency and its **24h change** in percent. Positive change is green, negative change red. Click either column heading to sort descending; click it again for ascending. Both sort triangles stay the same size; the active direction is brighter, with no underline on the heading. The rows above the separator are the instruments you picked last, kept in this browser per tab (the old app's rule): three on a shorter screen, five when there is room; they stay first even with a sort selected. A separator follows them.

The open list keeps its row order while live figures change. Searching, changing tabs or sort, or changing a favourite rebuilds that order. The tabs, search and two numeric columns keep the selector compact, without a second balances line. Your tab and sort stay in this browser; favourites stay in your runtime.

The account selector gives every row a status between its name and the selection check: a muted **OK** when ready, a warning when something needs attention, or **Not set up** without trading keys. Selecting another account changes only the check; the columns stay in place.

## What the percentage covers

The change compares Hyperliquid’s **mark price** with its price 24 hours earlier, from the existing catalogue read. Every catalogue row carries this percentage. Opening the selector reuses the cached catalogue and preserves the highlight and scroll, with no extra stream, timer or download.

Delisted instruments are unavailable for a new selection, even under a search or in favourites. Existing positions and open orders on them remain in the lists; their ids and trading records are unchanged. A spot pair with no 24-hour volume remains subject to the existing rule: hidden unless it is on screen or you hold its coin, an order, a position or a bot on it.
