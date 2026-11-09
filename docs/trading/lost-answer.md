# When goodcryptoX gets no answer

Sometimes goodcryptoX sends an order to the exchange and the answer never comes back: the connection drops, the reply is
unreadable, or goodcryptoX stops between sending and the answer. The order may never have arrived, or it may already have
filled. goodcryptoX cannot tell which until the exchange says so, so it checks, and it never guesses.

## What you see

- **"Checking with …"** names the exchange in the order's row while goodcryptoX is finding out. It
  is not an alarm: goodcryptoX planned this step, so you get no notification.
- **Usually it is settled within about two minutes**: the exchange shows the order (resting, filled or
  refused) and the row becomes what it really is, or the exchange's records show it never arrived.
- **Still not known after two minutes:** the order goes to repair and its row reads "Unknown: The order's state on the exchange is unknown" (every reason after "Unknown:": [What the status words mean](../concepts/states.md#the-reasons-after-unknown)), and goodcryptoX tells you once:
  it cannot yet confirm whether the order reached the exchange, it keeps checking, and it sends nothing meanwhile. If
  the answer arrives later, the order carries on from it and leaves repair.

## What goodcryptoX does

- **No fresh order while the answer is unknown.** A stop-loss or a Close is no exception: two reduce-only
  sells can both fill when another position shares the coin (two bots, or a bot and your own trade).
- **It checks the order, open orders and recent fills.** Finding the order settles it; one "not found" answer does not.
  Failed checks prove nothing. Checking continues after a restart.
- **Hyperliquid checks:** start about 11 seconds after the send. Only after the request has expired for 90 seconds,
  with two clean "not found" answers and no fill, is the order treated as never placed. Failed reads retry after 5, then
  15 seconds, then at the usual slower pace.
- **Binance crypto checks:** come at 4, 6 and 9 seconds. If they succeed and show no order or fill, the order is sent again
  with the same id. If the first is still open, Binance refuses the duplicate and goodcryptoX recovers the original. A fill
  Binance shows later can still double the order; goodcryptoX warns you that it is over-filled.
- **Found: it carries on from what the exchange holds.** A resting order is kept; a filled one is counted. For a
  market order that filled in part, the rest of a stop-loss, take-profit or Close is sent from the size the exchange
  says executed, never from the fills goodcryptoX happens to have seen so far.
- **Its other exit waits.** While a take-profit's or a stop-loss's answer is unknown, the other exit of the same pair
  is not sent, on futures too, and the cancel of the unknown one waits as well. Once the first is settled, the waiting
  exit goes, sized from what is left, however long it waited; the position is unprotected meanwhile, and the unknown
  one's repair (below) is the one message.
- **Hyperliquid can receive the same request again safely.** Every Hyperliquid order is signed with a number
  (its nonce) that Hyperliquid accepts only once from the key that signs goodcryptoX's orders. goodcryptoX may send the same order again
  under the same number within the two minutes, and Hyperliquid then executes at most one of them. If it answers
  "duplicate nonce", goodcryptoX knows one of them arrived and checks at once.
- **Proven not placed: sent again by itself.** Once goodcryptoX proves the first never arrived, however long after it was due,
  it sends it again by itself, sized from what is still needed: with a new id on Hyperliquid, the same id on Binance crypto,
  at most three times; a fourth stops in repair with the reason "sent 4 times". The proof itself is never shortened: nothing is sent again while the answer is
  unknown. If the order was already in repair as unknown, the repair clears; no second message.

## The one case that needs you

An order **still unknown at two minutes** waits in repair as "Unknown: The order's state on the exchange is unknown"
while goodcryptoX keeps checking; it is never sent again until the exchange's records answer. If it is a stop-loss, the position
has no stop until it is settled, and goodcryptoX says so. Check the exchange itself if you want to know sooner. Two rarer cases
end in repair as "The order was never placed" with **Retry** and **Cancel**, because a second send could double
the order: a proof that comes while another send of the same order is still live, and a proof of a send goodcryptoX recorded
before it marked its sends for a proof.

## A cancel with no answer

When goodcryptoX cancels an order (your Cancel, a change, a bot's cancel) and the exchange does not confirm it, goodcryptoX
keeps cancelling for about 11 minutes. Before each new try it checks the order's status, your open orders and your
fills; an order the exchange shows cancelled or filled ends there, and "not found" is never taken as cancelled. If the
exchange still has not confirmed it after those 11 minutes, the order goes to repair ("cancel unknown") with one
notification, and **Retry** cancels it again. A bot keeps running meanwhile.

## When goodcryptoX was off between deciding and sending

If goodcryptoX stops (a restart, a sleep, a drain) after it decided to send an order but before the request left, goodcryptoX knows it
never reached the exchange: no lookup is needed. When it is back, the order goes by itself, whatever its kind and
however long goodcryptoX was away ([After goodcryptoX was off](missed-orders.md)).

## For agents and scripts

An order in this state is a row of the `orders` topic with `status: "unknown"` and no `reason` (checking), or with a
`reason` once it is in repair. The journal carries the event `not-placed` (with `measured`, and the counts of clean
reads) and `proof` on `unknown`; both are additive. A small file, `pins.json` in the data folder, carries the measured
numbers; with no file, the cautious values apply.
