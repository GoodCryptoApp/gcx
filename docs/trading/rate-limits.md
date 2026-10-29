# Hyperliquid's limits

Hyperliquid limits how fast and how much any program may send. goodcryptoX follows Hyperliquid's documentation and refuses nothing of its own for them (the one refusal is a new order or bot on an account whose builder fee is not approved, below): when Hyperliquid limits you, your orders, cancels and bots' orders wait their turn and go as soon as Hyperliquid allows.

## Your account's request allowance

Each address on Hyperliquid (your main account, and each sub-account on its own) has an allowance of requests: **10,000 to start, plus 1 for every 1 USDC traded** since the address began. It does not refill with time: only trading adds to it. Orders, cancels and other actions count; reading prices or balances does not.

When it is used up, Hyperliquid allows **one request every 10 seconds** on that address. goodcryptoX then:

- sends that account's actions **one every 10 seconds, in the order they were made**: an order you placed before a stop-loss fired goes before it, and a bot's orders take their place in the same line (the bot's own steps keep their order). Nothing is refused and nothing is dropped.
- shows each waiting order as **"Waiting: Hyperliquid allows this account one request every 10 seconds (2 ahead)"** in the orders list. **Cancel** takes a waiting order out of the line at once: it never reached Hyperliquid, so nothing needs cancelling there.
- says so on the Trade page in one line: "Main: request allowance used up (10,400 of 10,400) · waiting: 3" (trading earns allowance: 1 request per 1 USDC traded)
- puts a row with a yellow dot in the Dashboard's **Needs your attention**: "Waiting for Hyperliquid's allowance · Main · Waiting: 3 · one every 10 seconds", with **Open** (the open orders) and **Done** (hides the row on every screen; a new episode shows it again).
- reads your allowance from Hyperliquid once when this starts and then at most once a minute while something waits; as soon as Hyperliquid shows room, the rest go at once. The line and the row go when nothing waits.

If goodcryptoX stops while orders wait, the next start checks each of them with Hyperliquid first (see [When goodcryptoX gets no answer](lost-answer.md)): none is ever sent twice, and one that never arrived waits in repair for your **Retry**.

## Your connection's limit

Hyperliquid documents a limit per internet address: 1,200 units of weight a minute (an order is 1, most reads 2 or 20). goodcryptoX keeps under it and adds no pace of its own. If Hyperliquid answers "too many requests" anyway, goodcryptoX sends nothing for 6 seconds (Hyperliquid was measured serving requests again after 5 to 6 seconds), then sends the same order again; an order is never ended for this. Every account on the computer waits those 6 seconds together.

## The daily limit of unified accounts

Hyperliquid allows unified and portfolio-margin accounts at most 50,000 actions a day. goodcryptoX does not count them; Hyperliquid enforces the limit itself. Its refusal's exact words are not recorded yet, so for now such a refusal is shown with Hyperliquid's text and you are told; once the words are known, those orders will wait for Hyperliquid's day to reset instead.

## The builder fee

Every order carries goodcryptoX's 0.03 % fee. While an account's builder fee is not approved, goodcryptoX takes no new order and no new bot on it: the panel hides Buy, Sell and Launch with a warning, and through the API or an agent's tools the request is refused with "Approve the builder fee on this account to trade." Cancels, Close, exits and Stop are not refused, and a bot already running is not stopped; Hyperliquid answers what they send. An order Hyperliquid refuses for the fee anyway ends with Hyperliquid's words and you are told where to approve (**Settings › Exchanges › Hyperliquid › Allow builder fees**); it is never sent without the fee.
