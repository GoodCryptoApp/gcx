# Partner codes

A partner of goodcryptoX brings people to goodcryptoX. With his code they pay less of goodcryptoX's fee, and he earns a share of it. You have no account with us: the code is checked on your own machine against goodcryptoX's partner signing key, and nothing in trading waits for a server.

## If a partner gave you a code

Settings › Installation › **Referral code**: the page says "Have a referral code? Paste it here to get its perks"; paste the code (it starts with `gcx-`) in the field and press **Join**.

- **One code for your whole goodcryptoX.** Every account in it, sub-accounts and vaults included, carries the code's fee from your next order on. Orders already resting keep the fee they were sent with.
- **The fee.** goodcryptoX charges 0.03 % of each trade's value on Hyperliquid. A code gives a discount of 0 % to 50 % of that fee, in steps of 10 %: with a 10 % code you pay 0.027 %, with a 50 % code 0.015 %. Some codes give no discount; with one of them you pay 0.03 % as before.
- **It cannot be changed or removed once entered**, even if it is not the one you meant. The page says so in its help text at the top.
- **What the page says when it refuses a code:** "Invalid code" (not a partner code of goodcryptoX's), "You're already referred" (this goodcryptoX has a code already), "You can't refer yourself" (the code is your own, from your own partner key on this goodcryptoX).
- **The help text at the top of the page**, joined or not, says "Your code, your account addresses and the orders goodcryptoX sends are recorded with goodcryptoX so your partner can be paid; this cannot be turned off."
- **Once joined** the page shows what you get: "You get 10 % off the goodcryptoX fee". The partner's share is not shown to you.

Spot buys carry no builder fee at Hyperliquid, so a code changes nothing there.

## If you are a partner

goodcryptoX gives a partner a **partner key**: one long line that starts with `gcx-partner-`. It holds your partner number, your maximum share of goodcryptoX's fee (up to 50 %), and every code you may hand out, each signed by goodcryptoX. It never expires.

Settings › Installation › Referral code › **I am a partner**: paste the key and press **Add**. A second key replaces the first, after "Replace your partner key?". The section then shows:

- **Partner ID** and your number, then your share of goodcryptoX fees; the words are muted and the figures bright.
- **Your codes**, a table of every code your key already holds, in ascending 10% discount steps. Each row shows **Your users' discount**, **You receive**, **Joined**, **Trading this week**, **Volume**, the complete code in a read-only box and **Copy** beside it. The 0% row works like every other row. A code for a given discount stays the same: copy it once and publish it where you like.
- On a phone the heading row stays, **You receive** is left out (it is your share less the discount), and each row puts its code and Copy below its four figures. Each figure's heading explains it on hover.
- The small **Replace key** link opens the same key field; installing a replacement still asks for confirmation.

Moving goodcryptoX to another machine carries the partner key; the page has no Copy partner key button. Anyone with that key can make your codes, so keep it private. Your 0 % and 10 % codes side by side make such a key too, one that reads your codes' figures below (never addresses, never money).

### Your codes' figures

Each code's row shows, read from goodcryptoX's partner-code server while the section is open (again when you come back to the tab, and after you add or replace your key), at most once a minute:

- **Joined:** how many goodcryptoX installations joined with this code, ever.
- **Trading this week:** how many of them sent orders this week. An order counts when it reaches the server, normally within a minute; a goodcryptoX that was asleep or offline reports its orders when it is back.
- **Volume:** the value of this week's trades with this code that pay you: the same trades, counted the same way, as the ones goodcryptoX pays you for. A day's trades are counted the next day, once Hyperliquid's record of goodcryptoX's fees for that day is in, so Volume runs a day or two behind; hover the heading to see the last day counted. On Monday it is 0 until Monday's trades are counted, usually on Tuesday. Trades that carry no seal of a goodcryptoX with your code are not in it. It can differ from the weekly statement, which is still what you are paid by.

The week runs from Monday 00:00 UTC. A 0 is shown muted. If the server cannot be read, the last figures received stay, greyed, with "Not up to date: the last values received are shown"; if none were ever received, "Could not be read. Reload the page to try again". Where the server does not offer the figures, the table shows no figure columns.

If goodcryptoX ever has to replace its signing key, the section says "Your partner key is no longer valid. Ask goodcryptoX for a new one" and shows no code; the users who joined with your codes keep them. Your own code on your own goodcryptoX is refused; on another goodcryptoX nothing can stop it.

On the goodcryptoX that holds your key, your own trades pay goodcryptoX's fee less your maximum (with a 50 % key, half of it), from your next order on and while your key is valid, and the section says so: "You get 50 % off the goodcryptoX fee". No share is paid on them and nothing is sent for them. If a code was joined on that goodcryptoX, before or after the key, its discount applies instead.

What you earn and when it is paid are set by your agreement with goodcryptoX, not by goodcryptoX. goodcryptoX pays partners by hand each week. With the payment goodcryptoX can send you the week's statement: per code, how many trades your users made through goodcryptoX with your code (trades whose order number carries the seal of their goodcryptoX, which joined with your code), their volume, goodcryptoX's fee on them and your share, and the volume of their trades that carry no such seal or that Hyperliquid no longer serves. It names none of your users' addresses.

## What goodcryptoX sends goodcryptoX

At its first start goodcryptoX makes a key of its own on your computer. It never leaves the computer, except inside the encrypted file of Move to another machine, so a moved goodcryptoX stays the same. Its public half stands for your goodcryptoX to goodcryptoX; it names no account. A goodcryptoX without a code sends nothing below, even when it holds a partner key; a goodcryptoX with a partner key sends that key and the public half, signed, while the partner section is open, only to read its codes' figures (above), and the server keeps nothing of it.

Every order goodcryptoX sends carries goodcryptoX's own order number, public on Hyperliquid. Half of it is random; the other half is a seal only your goodcryptoX can make with that key, so the number proves which goodcryptoX placed the order. Every goodcryptoX does this, with or without a code; nothing is sent for it.

So that goodcryptoX knows which partner to pay, a goodcryptoX with a code sends goodcryptoX's partner-code server, each message signed with that key:

1. **When you enter the code:** the code, the key's public half and goodcryptoX's version. No exchange needs to be connected.
2. **The orders goodcryptoX places,** on any exchange, from the code on: the account, goodcryptoX's own order number and a proof that this goodcryptoX made it (a signature with that key). No prices, sizes or markets. Not cancels. In batches, at most once a minute.

goodcryptoX then reads, from Hyperliquid's public records, the trades of those accounts in each week it pays, and pays your partner for a trade only when its order number carries your goodcryptoX's seal: an account alone never pays, and no other goodcryptoX can claim your trades.

- **It cannot be turned off.** It is sent whatever Settings › Installation › Reports to goodcryptoX says: it is how the partner is paid. The [privacy policy](legal/privacy.md) says so in its own row.
- **Offline is fine.** Nothing in trading waits for it: your discount applies from your next order, and orders are sent as always. If the server cannot be reached, goodcryptoX keeps everything and sends it later (when it starts, when you open the Partner code page, after an order, or by itself while goodcryptoX is busy), at most once a minute; the orders are read again from goodcryptoX's journal, so none is lost.
