# Connecting your Hyperliquid account

goodcryptoX trades on your Hyperliquid account through an **API wallet**: a key that can place and cancel orders for your account but can never withdraw ([Safety and keys](../concepts/safety.md)). goodcryptoX makes that key on your computer and keeps it in its key store; your own wallet only signs two approvals for it.

The steps are goodcryptoX 2.0's, with one difference: goodcryptoX 2.0 made the key in the page and sent it to its servers; goodcryptoX makes it on your computer and the key never leaves it.

## Where to start

Under **Connect automatically** (the first account) goodcryptoX says "By using goodcryptoX you agree to our Terms of service and Privacy policy.", with the two links, and three plain lines: goodcryptoX runs on your machine and your keys stay on it; the trades goodcryptoX places pay our fee, 0.03 % today, on top of Hyperliquid's fees, and fees can change; goodcryptoX's own stop-losses work only while goodcryptoX runs. There is nothing to tick. One more line says: "Your wallet may show "HTTP": this page runs on your computer" (MetaMask puts "HTTP" before every address that does not start with https, a local one too; it blocks nothing.) **Add Hyperliquid account** (later accounts) is a tile of its text and a chevron; once pressed, it shows the steps and nothing under them: the terms and privacy line is said once, with the first account. The first account's lines stay under the steps while they run, also when the steps were started from the Trade page's **Connect automatically**.

- **Settings › Exchanges › Hyperliquid › Connect automatically** ("Use the wallet that controls your Hyperliquid account"), or **Add Hyperliquid account** under your accounts.
- The Dashboard's first set-up step, **Connect an exchange account**, leads there.
- On the Trade page, with no account connected, the order form is live, as with an account (Position 0, every field, shortcut and toggle works on the instrument's own figures), and its send button reads **Connect Hyperliquid account**; the lists under the chart show their empty lines ("No active BTC.USDC orders on Hyperliquid"); the orderbook, the trades, the chart and the prices work without an account.

## What you need

- The wallet that **owns** the Hyperliquid account (the one you deposited from). A sub-account's, a vault's or an API wallet's address is refused with "Connect the wallet that owns the Hyperliquid account".
- A Hyperliquid account with a deposit. A wallet with none is refused with "Wallet not linked to Hyperliquid, or the account has < 5 USDC".

## The steps, in order

The steps show one under the other below the button: a ring on the step at work, a tick on the steps done.

1. **Connect wallet** ("Select wallet that controls your Hyperliquid account"). A window lists the wallets: a browser extension (MetaMask, Rabby, Coinbase Wallet, Phantom and others), or **WalletConnect**, a QR code to scan with a wallet on your phone. Connecting signs nothing.
2. goodcryptoX asks Hyperliquid about the address: whether it owns an account, which API wallets it has, the builder fee it has approved, and whether it already has a referrer.
3. Only if your account has no referrer: **Pay 4% less on Hyperliquid fees**, ticked, with the grey line "If eligible, join as our referral: 4% off Hyperliquid's fees on trades you place outside goodcryptoX, for your first $25M; not for vaults or sub-accounts" (Hyperliquid's own terms, read 2026-10-10), and **Continue**. Untick it to stay out. If you join, goodcryptoX applies the code once, with the new API wallet and no extra prompt, after it is approved.
4. **Create API wallet** ("API wallet allows goodcryptoX to trade on your behalf and does NOT allow withdrawals"). goodcryptoX makes the key, keeps it, and then your wallet asks you to sign **prompt 1**.
5. **Allow builder fees** ("Builder Fee is the fee we charge: 0.03% of each trade, on top of Hyperliquid's own fees"). **Prompt 2** comes only when the maximum you approved for goodcryptoX's builder is below 0.03 %.
6. **Add API wallet to goodcryptoX** ("goodcryptoX checks that Hyperliquid lists the new API wallet"). The account's card then shows **Connection status is: OK**, the API wallet's name and its expiry as Hyperliquid has it, and the builder fee.

## The account list

Once the main account is active (Hyperliquid lists its API wallet), goodcryptoX shows **Your accounts on Hyperliquid** in place of the steps: your main account first, then every sub-account and every vault you lead, in Hyperliquid's order, each with its name, its kind and its address as `0x1234*****abcd`.

- The accounts already in goodcryptoX are greyed and ticked, and cannot be changed: "Already added" stands beside them. Your main account is one of them, on a first connect too. A new sub-account or vault is ticked; untick one to leave it out.
- The list never removes your main account (**Edit account › Remove account** does). When your main account is not in goodcryptoX (its sub-accounts or vaults trade on its API wallet), it has an empty check mark, to add it back.
- Tick the ones to add and press **Add**: each becomes its own account, named as Hyperliquid names it, all trading with your main account's one API wallet (goodcryptoX stores that key once and every account under it uses it). Nothing is signed and no second API wallet is made. If one is refused (for example a hundred-and-first account), its row says why and stays ticked; the others are added. **Add** and **Close** are one size; **Add** is off when nothing is ticked. The list is read again after **Add**, never on a timer. **Close** ends the list.
- A main account with no sub-account and no vault of yours shows no list when you first connect it: the steps end as before.
- Only vaults you **lead** are listed; a vault you only deposit in is never offered (its leader's API wallet trades it, not yours).
- An account in goodcryptoX that Hyperliquid no longer lists reads "Not on Hyperliquid now", with **Remove account**. Hyperliquid has no action that deletes a sub-account, so this is rare; nothing else changes for it.
- Rename an account, or remove it, from its card in Settings. Each account is removed alone, the main account included; goodcryptoX's API wallet comes off Hyperliquid when the last account under its main account is removed.

**A later add is the same flow.** Press **Add Hyperliquid account** (or the Dashboard's **Add account**, which opens it), and connect the wallet of a main account whose API wallet goodcryptoX already holds (with the main account in goodcryptoX or only some of its sub-accounts and vaults): if its API wallet is active, nothing is signed and no key is made; the list shows at once, with a main account that has nothing else on Hyperliquid listed alone. If its API wallet is still waiting for approval, **Try again** is run for you (prompt 1, with the key goodcryptoX already holds); if it expired or is no longer listed, goodcryptoX renews it (one new API wallet, one signature, which covers every account of that main account). Then the list. The builder fee stays the card's **Allow builder fees**: an account added before it is approved takes no new order or bot until it is.

## What each wallet prompt says, and why

Both are Hyperliquid's own signed messages (typed data, "HyperliquidSignTransaction"); your wallet shows their fields. Signing costs nothing and sends no transaction on any chain. The chain your wallet is on is part of the signature only to stop it being reused elsewhere; your wallet may ask you to switch to Ethereum when you connect (goodcryptoX 2.0's window did the same): accept it, because refusing ends the connection. The approvals are then signed on whatever chain your wallet is on.

| Prompt | What your wallet shows | Why |
|---|---|---|
| 1, approve the API wallet | `HyperliquidTransaction:ApproveAgent`: hyperliquidChain `Mainnet`, the API wallet's address, its name `gcx valid_until <date>` (the first free of gcx, gcx1, gcx2; the API wallet named goodcryptoX is goodcryptoX 2.0's and is left alone), and a number | Lets that address trade for your account until the date, 180 days from now by Hyperliquid's clock. It cannot withdraw or transfer. |
| 2, approve the builder fee | `HyperliquidTransaction:ApproveBuilderFee`: hyperliquidChain `Mainnet`, maxFeeRate `0.03%`, builder `0xff09853a49dde85a8e7eab58abf94018fbe76116` (goodcryptoX's builder address, kept), and a number | Lets goodcryptoX's orders carry its fee of 0.03 % of each trade's value. Every order goodcryptoX places carries it, closes and stop-losses included, so without the approval Hyperliquid refuses them all. goodcryptoX checks the approval when you place an order or launch a bot; if you revoke it later while orders or bots are live, Hyperliquid refuses them, exits included, until you approve again, and goodcryptoX tells you where. |

If you approved goodcryptoX 2.0's builder before (goodcryptoX 2.0 asked for 1 %), that approval stands and there is no second prompt: the card says "Builder fee approved up to 1%; goodcryptoX charges 0.03%". goodcryptoX's fee is 0.03 % today and may change; the terms of service say how, and an approval of 1 % lets Hyperliquid charge up to that maximum.

## Waiting for approval

If you reject a prompt in your wallet, the step turns red ("You rejected the request in wallet") with **Try again**, which asks the same prompt again for the same API wallet. If you leave the page instead, the account stays in your list with **Connection status is: Waiting for approval**: goodcryptoX has the key, but Hyperliquid does not list it yet, so goodcryptoX does not trade with it and shows no expiry. **Try again** on that card asks your wallet again, for the same API wallet. It must be the account's own wallet. goodcryptoX looks at your wallet before each prompt, and again at the signature before anything is sent: if your wallet has switched to another account, or signs with one, nothing is sent and the step says "Incorrect wallet connected", with **Disconnect & retry**.

If you close the wallet window without connecting a wallet, the step says "Wallet is not connected" with **Try again**.

An account whose builder fee is not approved trades nothing new: **Edit account › Allow builder fees** asks prompt 2 again.

## When the API wallet slots are full

Hyperliquid allows 3 named API wallets per account (and 2 more per sub-account). When they are all taken, the step says "Hyperliquid API wallet limit reached" and lists them under "Select API wallet to replace:". Pick one: goodcryptoX's new API wallet takes its name, and the old one stops working. The API wallets this goodcryptoX itself uses are greyed and cannot be picked. Nothing is signed until you pick one.

## The Trade page before you are ready

- No account, or one waiting for approval: the order form and the bot form work as with an account, except that their send button, Launch included, is **Connect Hyperliquid account**, which opens Settings › Exchanges › Hyperliquid; Available is not shown, the leverage row works on the form alone until you connect, and the lists say they are empty.
- The builder fee not approved: the form shows no Buy, Sell or Launch, and the red-tinted line "Allow builder fees to enable trading" with **Fix**. **Close** stays.
- The API wallet expired, or no longer approved by Hyperliquid: the form shows no Buy, Sell or Launch, and in their place "Your API wallet for … has expired: renew it in Settings." (or "… is no longer approved on Hyperliquid: renew it in Settings.") with **Fix**, as goodcryptoX 2.0 showed its red "not ready for trading" line in place of its send slider. **Close** stays.
- Right after goodcryptoX starts, until Hyperliquid's market list has arrived, a new order or bot is answered "The market list has not arrived from Hyperliquid yet; goodcryptoX keeps trying."

## The wallet window and your privacy

The wallet window is Reown's (AppKit), as goodcryptoX 2.0 used. While it is open your browser talks to Reown's and WalletConnect's servers (`api.web3modal.org`, `fonts.reown.com`, `relay.walletconnect.org`, `rpc.walletconnect.org`, `pulse.walletconnect.org`, `verify.walletconnect.org`). They receive your IP address, your wallet's address and the address of the page the window is opened from; Reown looks the address up for its name and balance, and counts that the window was opened and that a wallet connected, whatever goodcryptoX is asked. Opening the window sends nothing to Coinbase: the Coinbase Wallet extension connects like any other browser wallet, and its phone app through WalletConnect. If you pick Coinbase's own wallet in the list, Coinbase's wallet code may load and report to Coinbase. None of this happens until you press Connect, and goodcryptoX disconnects your wallet when the steps end. Your orders and your API wallet's key never go to Reown; Hyperliquid receives what it always does (see the [privacy policy](../legal/privacy.md)).

## Not in this version

The affiliate code field: it says so and changes nothing. Renewing the API wallet works (**Replace API wallet**, and **Fix** on the expiry line): the same steps in the account's card, with your main account's wallet; see [Safety and keys](../concepts/safety.md#the-api-wallet). Removing it works: tick **Also remove the API wallet from Hyperliquid** in the Remove account dialog (your main account's wallet signs once); see [Removing an account](settings.md#removing-an-account). The expiry reminders are on the account's card and in Telegram: see [Safety and keys](../concepts/safety.md#the-api-wallet).

A failed wallet step shows the actual error and the normal retry button. Unfinished checks stay grey, and the tile has no chevron while open. Rename keeps the account card’s width: Account name is editable; Address is text with the account’s kind and main account where applicable.
