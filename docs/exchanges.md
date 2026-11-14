# Supported exchanges

goodcryptoX trades on Hyperliquid, Binance, Bybit and Bybit EU, by hand and with the DCA and Grid bots, from your own computer, NAS or server. It trades through a key kept on your machine, never withdraws, and charges one fee: 0.03% of each trade it places for you. A wallet's recovery phrase or private key is never an exchange key: pasted into a key, secret or account name field of any exchange, it is emptied at once and never sent, kept or logged.

| Exchange | Spot | Perpetuals and futures | Accounts | goodcryptoX's fee |
|---|---|---|---|---|
| Hyperliquid | Yes | Yes | Main accounts, sub-accounts and the vaults you lead | Hyperliquid's builder fee, taken from each trade |
| Binance | Yes | USD-M and COIN-M | Accounts and sub-accounts, each with its own key | Paid with [credits](credits.md) |
| Bybit | Yes | USDT and USDC futures; coin-margined inverse futures | Accounts and sub-accounts, each with its own key | Paid with [credits](credits.md) |
| Bybit EU | Yes | No | Accounts and sub-accounts, each with its own key | Paid with [credits](credits.md) |

## Hyperliquid

* **Markets:** perpetuals, HIP-3 markets included (names like `xyz:TSLA`), and spot.
* **Accounts:** your main account, its sub-accounts and the vaults you lead, each its own account in goodcryptoX, all trading with one API wallet.
* **Margin:** cross and isolated, as each market allows.
* **The fee:** Hyperliquid collects goodcryptoX's fee for us as its **builder fee**: 0.03% of each trade goodcryptoX places, on top of Hyperliquid's own fees, Stop Losses, Take Profits and closes included. On spot only sells pay it. You approve it once, with your wallet, when you connect.
* **Connect:** your wallet approves an API wallet goodcryptoX makes for you; no gas ([Connect Hyperliquid](venues/hyperliquid.md)).

## Binance

* **Markets:** Spot, USD-M and COIN-M futures (quarterly contracts included) and TradFi perpetuals, which sit under Perps.
* **Accounts:** a Binance account or a sub-account, each connected with its own key. Classic, Multi-Assets, Portfolio Margin and Portfolio Margin Pro accounts all trade.
* **Margin and positions:** cross and isolated, per futures market; **One-way mode** or **Hedge mode**, switched with the cog at the end of the order form's Position row. Binance's Margin trading, borrowing on spot, is not offered; its balance shows with your other wallets.
* **The fee:** Binance has no way for goodcryptoX to take its fee from each trade, so the same 0.03% of each trade goodcryptoX places, buys and sells, is paid with [credits](credits.md) you buy upfront and spend as you trade. Your first 10,000 USD of CEX volume costs nothing.
* **Connect:** **Sign in with Binance**, or a self-generated API key, set up on Binance in a minute ([Connect Binance](venues/binance.md)).

## Bybit and Bybit EU

Bybit supports spot, USDT and USDC perpetuals and dated futures, and coin-margined inverse perpetuals and dated futures. Bybit EU supports spot only. Trade by hand or with DCA and Grid bots; connect each account or sub-account with its own API key ([Connect Bybit](venues/bybit.md)).

On Bybit, change leverage and supported contracts’ hedge mode in goodcryptoX. Change a Unified Trading Account’s margin mode on Bybit. On both exchanges, you pay goodcryptoX's fee with [credits](credits.md).

Trades you place outside goodcryptoX pay us no fee. A [referral code](referral-program.md) lowers goodcryptoX’s fee on your trades.

## Is my IP address fixed?

Exchanges see the IP address of the computer running goodcryptoX. A fixed IP address is one that stays the same for months, so a key tied to it keeps working. Some keys, like the ones Binance makes (Sign in with Binance and System-generated API keys), trade only from IP addresses you whitelist, so it matters whether that address stays the same. goodcryptoX shows the address it read and asks if it is fixed. If you can't tell, here is how to check:

* **On a server or VPS** (Hostinger, DigitalOcean, Hetzner and others), a VPS usually keeps its address as long as you rent it. Look in your hosting panel for a dedicated or static IP, or ask your provider "Is this IP address static?".
* **At home,** most lines change their address from time to time, for example when the router restarts. Some providers sell a fixed address (a static IP) as an extra.
* **On a laptop,** the address changes with the network.
* **By asking.** Your internet provider or hosting company can tell you if the address is fixed, and sells one if it is not.
* **By looking.** Open the exchange's page in Settings › Exchanges and note the address on the question. Look again in a few days, and after the machine restarts. If it never changes, it is probably fixed.
* **With a proxy,** exchanges see the proxy's address. It is fixed if your proxy provider keeps it; ask them.

**Yes:** whitelist the fixed IP address for the key. **No** or **Not sure:** choose a key that works without a whitelisted address; the form tells you whether it expires.

**If the address changes later,** a key tied to it stops trading until the new address is whitelisted. The account's card in Settings › Exchanges shows the new address with **Copy**. On Binance, open **API Management**, edit the key's trusted IPs and add it, or press **Replace API key** and connect again.

## Removing an account

In **Settings › Exchanges**, open the account's removal dialog. Removing it stops goodcryptoX from following or trading that account. It leaves positions and orders resting on the exchange as they are; stops watched by goodcryptoX end and its bots stop. Check what is open before removing it. Other connected accounts keep their own records.

**Keep trading history** decides what stays on this computer. Ticked, the removed account's orders and bots remain available for reference, without trading actions. Unticked, every order, trade, bot and note of that account is erased permanently; goodcryptoX restarts to do it. This cannot be undone.

Where an API wallet is used, **Also remove the API wallet** is a separate choice. Unticked, that wallet stays approved on the named exchange until it expires or you remove it there. Ticked, your wallet asks you to revoke it. If other accounts share that approval, the dialog names them: revoking the shared API wallet also takes away their ability to trade with it. Removing one account and revoking a shared trading key are different actions.

Where each account has its own API key, as on Binance, there is no shared approval to revoke: goodcryptoX deletes its copy of the key, and the dialog reminds you to delete the key on the exchange too.

## Questions

### Which exchanges does goodcryptoX support?

Hyperliquid, Binance, Bybit and Bybit EU. See the table above for each exchange’s markets and accounts.

### What does goodcryptoX cost on each exchange?

0.03% of each trade goodcryptoX places for you, on top of the exchange's own fees. On Hyperliquid it is the builder fee, taken from each trade; on Binance and Bybit it is paid with credits, after the first 10,000 USD of CEX volume, which costs nothing.

### Can goodcryptoX withdraw my funds?

No. goodcryptoX never withdraws or moves funds; the keys it makes cannot withdraw, and every key stays on the machine goodcryptoX runs on.

### Can I connect several accounts on one exchange?

Yes. Each account, sub-account or vault is its own account in goodcryptoX, with its own balances, orders and bots. Adding the same account twice is allowed too: goodcryptoX warns that its balance and trades then count twice on the Dashboard.
