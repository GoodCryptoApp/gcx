# Trading credits

Credits are how you pay goodcryptoX's fee on exchanges that cannot collect goodcryptoX's fee from each trade, Binance first. The fee is the same 0.03% of each trade goodcryptoX places for you, as on Hyperliquid; there it is taken from each trade, here it is paid with credits you buy upfront and spend as you trade. Your first 10,000 USD of CEX volume costs nothing.

## How credits work

Credits are a balance in US dollars, one for your whole goodcryptoX, covering every account on those exchanges. Each filled trade goodcryptoX places there, buys and sells, takes 0.03% of its value from the balance, less your [referral code](referral-program.md)'s discount. Trades you place outside goodcryptoX cost nothing.

What credits buy is CEX volume: 30 USD of credits buy 100,000 USD of volume at 0.03%. With a 10% referral code the fee is 0.027%, and the same 30 USD buy about 111,111 USD.

Hyperliquid needs no credits: it collects goodcryptoX's fee from each trade, as its builder fee.

## Your first 10,000 USD <a href="#your-first-10000-usd" id="your-first-10000-usd"></a>

Every goodcryptoX trades its first 10,000 USD of CEX volume on those exchanges at no cost, buys and sells, across all its accounts. A trade that crosses the 10,000 pays only on the part past it. While any of that starting volume remains, you place orders and launch bots with no credits.

You can add credits any time; the free volume is used first.

## Your balance

**Settings › General** always shows **Trading credits**, including on a Hyperliquid-only installation, with “{volume} USD of CEX volume left” or a signed negative balance. Open it to read “goodcryptoX requires no subscription but charges a fee on each trade. On centralized exchanges you pay it with credits; on DEXs it’s taken from each trade” first. Then come two rows and **Add credits**:

| Row | What it shows |
|---|---|
| **CEX volume left** | What you can still trade on centralized exchanges: the starter volume plus what your credits buy at your fee, including “0 USD”. Under the name, **Credits**, and under the figure your balance, such as “10.00 USD”; a debt is signed and red. |
| **100 USD of credits buys …** | What 100 USD of credits buys in CEX volume at your fee, such as “100 USD of credits buys 333,333 USD of CEX volume”. With a [referral code](referral-program.md) joined, your fee is smaller, so the volume is higher, and a small grey note in brackets follows the line: “(10% referral discount applied)” for a friend’s code, “(50% partner discount applied)” for a partner’s. With no code, or a code that takes nothing off, there is no note. A small line under it, always there, says “Pay with $GOOD on Solana: credits cost 10% less, and the $GOOD is burned 🔥”. |

**Payments** and **Fees** follow on the same page. Both figures of the first row are in USD, regardless of your base currency.

On Trade, the settings cog shows **Trading credits** whenever you look at an exchange paid with credits, and opens the same page. While you have volume left, there is no reminder on the page. Below a fifth of your latest top-up (or below 2,000 USD before a top-up), one warning appears on Trade under the order form’s Send and the bots’ Launch with a centralized-exchange account selected, and one in the Dashboard’s **Needs your attention**. Once the volume runs out, the same place says new orders and bots are paused, under an order that opens a position and under Launch; a spot sale, a reduce-only order and a close always go, so nothing is said under them. A payment or positive grant counts as a top-up; the newest one sets the warning level. Exactly a fifth is not low.

## Add credits

Adding credits is a swap: you pay a coin from your wallet and you get credits, counted in dollars. Press **Add credits**, then **Connect wallet**. The form shows your wallet's address, with **Disconnect** beside it, and two fields:

* **You pay**: the amount and the coin, in one field, like the size in the order form with its unit. The coin menu lists the coins found in your wallet on that network, each with its balance and what it is worth, such as “0.1153 SOL ≈ 10.33 USD”, in order of their value, largest first (a dollar token counts as one dollar). Only coins with a price are listed: the network's own coin and the dollar tokens always, and any other coin that has a dollar price or a rank in the swap service's list (EVM). If a coin's price can't be read right now, it follows the others, by its market rank.
* **You get**: the credits, such as “9.76 USD of credits”, and under it the CEX volume they buy, such as “= 32,533 USD of CEX volume”.

You can type in either field; the other follows at once. The form opens ready: your most valuable coin, and of it what 100 USD costs (or about a month at your recent trading pace when that is more, up to 3,000, plus any debt), or all you can pay with it when it is worth less. For the network's own coin (SOL, ETH and the like) it leaves aside what the payment needs for its fee, so you can pay as it opens: press **Pay** and confirm in your wallet. On EVM networks and Tron, that is the network's own estimate of the fee, plus a quarter. Until you type, each coin you pick opens the same way; once you have typed, picking another coin keeps **You get**. Once the payment arrives, the form says how many credits it added.

On a swap, **You get** is an estimate at the price shown; the price refreshes by itself while the form is open. **Pay** always prepares the payment at the price of that moment and spends exactly what **You pay** shows.

With a wallet that works on several networks, such as MetaMask or Rabby, choose the network in **Network** (the ones where you hold nothing we take are greyed): your wallet is asked to switch to the one you choose; when you connect, the form shows your wallet's network at once and, once every network is read, moves once to the one where your coins are worth the most in dollars (if a coin's price can't be read, the form moves only when you hold nothing on your wallet's network), unless you have already picked a network or a coin; **Pay** is offered once your wallet is on it. If you switch in your wallet instead, the form follows and keeps what you typed. A Solana or Tron wallet pays on its own network. MetaMask also pays on Tron: pick MetaMask in the wallet list, then Tron.

On EVM networks, the list shows the coins in your wallet that the swap service knows and can price; a very small or little-known coin may not be listed. If you type more than you hold, a yellow line under **You pay** says so, such as **Not enough SOL: you have 0.1153, worth 10.33 USD**, and if what is left of the network's own coin won't cover the fee, **Not enough SOL for the network fee**; you can still press **Pay**, and your wallet refuses what it can't cover. When goodcryptoX can estimate the network fee and it's over 10% of what you pay, a yellow line under **You pay** says how much, such as **The network fee is about 15% of this payment**; you can still pay. On Tron, the list shows USDT and TRX only. A coin with no swap route stays greyed with **Can't pay with this coin**. If none is one we can take, the form says **No coins we can take on {network}**.

While balances load, the form shows **Checking your wallet…**. On EVM networks the network's own coin and dollar tokens show first, and your other coins join them as they load. If your coins can't be read, the form says **Couldn't read your coins** with **Try again**, and still offers the network's dollar tokens without a balance; your wallet tells you if you don't have enough. If only some reads fail, the coins with a known balance stay too. An unread balance is unknown, never zero.

If the payment prepared at **Pay** gives over 1% fewer credits than **You get** showed, the form shows the new figure and **The price changed**, and the payment continues to your wallet in the same press. If the price moves too far while it is being prepared, **The price changed** with **Try again**. A payment that fails or never lands says **The payment didn't go through**, with **Try again**.

A wallet app on your phone that won't connect with the QR code, such as Phantom or Solflare, connects from its own browser. When a phone wallet could not connect, the form says so under Connect wallet: open goodcryptoX in the wallet app's browser and connect there.

| Network | Dollar tokens |
|---|---|
| Ethereum | USDC, USDT |
| Arbitrum | USDC, USDT0 |
| Base | USDC |
| Optimism | USDC, USDT0 |
| Polygon | USDC, USDT0 |
| BNB Chain | Binance-Peg USDC, Binance-Peg USDT |
| Avalanche | USDC, USDT |
| Solana | USDC, USDT, $GOOD |
| Tron | USDT |

* **A dollar token** adds one dollar of credits each, even if it trades a little off its dollar.
* **Any other coin**, like ETH, POL, BNB, AVAX, SOL, TRX or another token in your wallet, is swapped to USDC on the way (USDT on BNB Chain and Tron), in the same payment. You get credits for the dollars that arrive. On Tron, you can pay with USDT and TRX.
* **$GOOD**, on Solana, buys credits at 10% off: 90 USD buys 100 USD of credits, and the $GOOD is burned 🔥. Choose $GOOD itself (it reads **GOOD −10% 🔥** in the coin menu), or pay with any other coin on Solana and tick **Buy and burn $GOOD, 10% off 🔥** under **You get**: your coin buys $GOOD on the market and it is burned in the same payment. **You get** then grows, and the volume line under it says how much more volume $GOOD gives, such as “= 33,000 USD of CEX volume, 3,000 more with $GOOD 🔥”. Jupiter guarantees all but 1% of the $GOOD it quotes; that guaranteed amount is burned, and whatever arrives above it stays in your wallet, to pay with next time. If $GOOD can't be bought right now, the box says **Can't buy $GOOD right now. Untick to pay without it**.

After you pay, **Waiting for the transaction to confirm…** shows with **View Tx** beside it until the credits arrive, usually a few seconds after the network confirms your payment; they are added even if you close the page, and you can start another payment at once by changing the amount or the coin. If the network later drops a payment it had confirmed, the credits it added are taken back, you are told, and **Payments** keeps that payment's row, marked **Payment dropped by the network**, with its amounts in grey, left out of the Total. If they have not appeared after 30 minutes, copy your goodcryptoX ID from the **Not added yet** line and write to **info@goodcrypto.app** with the transaction and that ID. A payment sent any other way, such as a withdrawal from an exchange, is not added by itself: write to us with the transaction.

**Credits are not refundable.**

## When credits run out

Running bots, the orders already placed and every exit (a Close, a Take Profit, a Stop Loss, a spot sale) keep working whatever the balance; their fees can take it below zero. Changing or cancelling an order works too.

A new order or a new bot on those exchanges needs a balance above zero; after a debt it starts again as soon as a payment takes the balance above zero. Add credits starts at what you owe plus 100 USD.

With [Telegram connected](telegram.md), goodcryptoX tells you once when volume becomes low, once when it runs out, and when credits are added after you've left Add credits. While you owe and an order or bot still runs on a centralized exchange, it sends a reminder every 24 hours, even if nothing filled that day. Settings and the Credits page show a debt in red, such as −3.00 USD; the warnings and refusals say “Trading credits −3.00 USD · New orders and bots paused”, with **Add credits** beside it.

## Payments and fees

Open **Settings › General › Trading credits**. Under the credits card, **Payments** is a table of **Paid** and **Credits added**. Each confirmed payment is its date with, under it, the coin and the network it was paid on (with its discount when there is one, such as “GOOD on Solana, 10% off”; on a phone, the coin alone, such as “GOOD, 10% off”) and **View Tx**, a link to the transaction on its network's explorer. After a swap the line still names the coin you paid with, such as “TRX on Tron”. Payments sent from outside the app, and some made before this was added, name the coin that arrived. A grant shows its reason, such as “Grant: Referral”, a dash under **Paid** and the credits added; a payment the network dropped stays as one row, marked **Payment dropped by the network**, its amounts in grey and left out of **Total**. A waiting or reverted payment is not counted as paid. The table shows your ten newest payments; **Show more** adds ten more each time. **Total**, the last row, counts every payment, shown or not. With no payment yet the block says “No payments yet”. $GOOD's value is always taken from its discounted credits, never from its number of tokens.

**Fees** follows: a small table of your **CEX volume** and your **Fees paid**, in USD, three rows each. Hover or tap **Avg per day** and **Avg per month** to see how they are counted.

| Row | What it means |
|---|---|
| Total | All recorded CEX trade value paid through credits, including starter volume; all recorded credits fees, including fees still waiting to be reported |
| Avg per day | The total divided by every UTC date from the first recorded trade through today, including idle dates |
| Avg per month | The total divided by the months since the first recorded trade (30 days to a month, idle days included). In the first 30 days, it's the total itself |

With no CEX volume yet the block says so and shows no table.

Ten dates with 100,000 USD of volume and 30 USD of fees mean 10,000 USD and 3 USD a day, even if you traded on only two dates; in these first 30 days the monthly row shows the totals themselves, 100,000 USD and 30 USD. October 31 through November 1 is two dates. Monthly figures estimate your needs; they do not reset at a month boundary.

With no discount or grant, payments minus fees equal your balance: 100 paid − 30 fees = 70 USD. With $GOOD, 90 USD may add 100 credits; a 10 USD grant adds another 10, so 100 credits + 10 granted − 30 fees = 80 USD. Historical rates and starter volume affect the fees, so today's rate does not necessarily reproduce the total. At a constant 0.03% without starter volume, 100,000 × 0.03 / 100 = 30 USD.

If payments cannot be read, the page keeps what it knows and offers **Try again** in Payments. Local fee totals remain available. A balance below zero is signed in red. If your balance doesn't match your payments and fees, the credits card says so and offers **Try again**; the notice never blocks trading.

## Your goodcryptoX ID

**Your goodcryptoX ID** names this goodcryptoX. In Add credits, after a payment has waited thirty minutes, the **Not added yet** line shows the ID with **Copy**. Include it with the transaction when you write to us about credits. [Moving goodcryptoX](install/moving.md) takes the balance with it.

goodcryptoX reports each such trade's fee to goodcryptoX's server, never the account or the coin, so your balance stays right; this cannot be turned off while you trade there ([Privacy policy](legal/privacy.md)).

## Questions

### Why does Binance need credits and Hyperliquid not?

Hyperliquid collects goodcryptoX's fee from each trade, as its builder fee. Binance has no such way, so the same 0.03% is paid with credits you buy upfront.

### How much trading do credits buy?

Your balance divided by the fee: 30 USD of credits buy 100,000 USD of volume at 0.03%, and more with a referral code's discount. The first 10,000 USD of CEX volume costs nothing.

### What happens when my credits run out?

Running bots, placed orders and every exit keep working. New orders and new bots on those exchanges wait until you add credits; after a balance below zero, until it is above zero again.

### Which coins can I pay with?

Dollar tokens (USDC, USDT, USDT0) on Ethereum, Arbitrum, Base, Optimism, Polygon, BNB Chain, Avalanche, Solana and Tron, $GOOD on Solana at 10% off (held, or bought with any coin on Solana in the same payment), and any other coin, swapped to dollars on the way (on Tron, only TRX).

### Are credits refundable?

No. Credits stay with your goodcryptoX, including when you move it to another machine.
