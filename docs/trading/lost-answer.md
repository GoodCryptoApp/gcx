# When goodcryptoX gets no answer

Sometimes goodcryptoX sends an order to the exchange and the answer never comes back: the connection drops, the reply is
unreadable, or goodcryptoX stops between sending and the answer. The order may never have arrived, or it may already have
filled. goodcryptoX cannot tell which until the exchange says so, so it checks, and it never guesses.

## What you see

- **"Checking with Hyperliquid"** is what the order's row says (Trade page, orders list) while goodcryptoX is finding out. It
  is not an alarm: goodcryptoX planned this step, so you get no notification.
- **Usually it is settled within about two minutes**: the exchange shows the order (resting, filled or
  refused) and the row becomes what it really is, or the exchange's records show it never arrived.
- **Still not known after two minutes:** the order goes to repair and its row reads "Unknown: The order's state on the exchange is unknown" (every reason after "Unknown:": [What the status words mean](../concepts/states.md#the-reasons-after-unknown)), and goodcryptoX tells you once:
  it cannot yet confirm whether the order reached the exchange, it keeps checking, and it sends nothing meanwhile. If
  the answer arrives later, the order carries on from it and leaves repair.

## What goodcryptoX does

- **It never sends an order twice.** While the answer is unknown, nothing is sent again, for any order: a stop-loss or
  a Close is no exception, because two reduce-only sells can both fill when another position shares the coin (two
  bots, or a bot and your own trade).
- **It looks the order up by its own id, several ways.** About 11 seconds after the send (once the exchange can no
  longer accept that request) it asks for the order by id; then it reads your open orders and your recent fills. If
  the exchange has it, its word counts. If it has not, that proves nothing at first: the exchange can take a moment to
  show an order it accepted. Only after the request has expired for 90 seconds, with two clean "not found" answers
  and no fill, does goodcryptoX treat the order as never placed. A read that fails counts for nothing and is asked again
  after 5 and 15 seconds. This all continues after a restart, from what goodcryptoX wrote down before it sent.
- **Found: it carries on from what the exchange holds.** A resting order is kept; a filled one is counted. For a
  market order that filled in part, the rest of a stop-loss, take-profit or Close is sent from the size the exchange
  says executed, never from the fills goodcryptoX happens to have seen so far.
- **Its other exit waits.** While a take-profit's or a stop-loss's answer is unknown, the other exit of the same pair
  is not sent, on futures too, and the cancel of the unknown one waits as well. Once the first is settled, the waiting
  exit goes, sized from what is left, however long it waited; the position is unprotected meanwhile, and the unknown
  one's repair (below) is the one message.
- **A second send of the same order, only in a way Hyperliquid executes once.** Every order is signed with a number
  (its nonce) that Hyperliquid accepts only once from the key that signs goodcryptoX's orders. goodcryptoX may send the same order again
  under the same number within the two minutes, and Hyperliquid then executes at most one of them; every second send
  of an order uses the same number, never a new one. If it answers "duplicate nonce", goodcryptoX
  knows one of them arrived and checks at once.
- **Proven not placed: sent again by itself.** Once goodcryptoX proves the first never arrived, however long after it was due,
  it sends it again by itself: a new order with a new id, sized from what is still needed, at most three times; a
  fourth stops in repair with the reason "sent 4 times". The proof itself is never shortened: nothing is sent again while the answer is
  unknown. If the order was already in repair as unknown, the repair clears; no second message.

## The one case that needs you

An order **still unknown at two minutes** waits in repair as "Unknown: The order's state on the exchange is unknown"
while goodcryptoX keeps checking; it is never sent again until the exchange's records answer. If it is a stop-loss, the position
has no stop until it is settled, and goodcryptoX says so. Check the exchange itself if you want to know sooner. Two rarer cases
end in repair as "The order was never placed" with **Retry** and **Cancel**, because a second send could double
the order: a proof that comes while another send of the same order is still live, and a proof of a send goodcryptoX recorded
before it marked its sends for a proof.

## When goodcryptoX was off between deciding and sending

If goodcryptoX stops (a restart, a sleep, a drain) after it decided to send an order but before the request left, goodcryptoX knows it
never reached the exchange: no lookup is needed. When it is back, the order goes by itself, whatever its kind and
however long goodcryptoX was away ([After goodcryptoX was off](missed-orders.md)).

## For agents and scripts

An order in this state is a row of the `orders` topic with `status: "unknown"` and no `reason` (checking), or with a
`reason` once it is in repair. The journal carries the event `not-placed` (with `measured`, and the counts of clean
reads) and `proof` on `unknown`; both are additive. A small file, `pins.json` in the data folder, carries the measured
numbers; with no file, the cautious values apply.
