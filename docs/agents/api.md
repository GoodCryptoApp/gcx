# API

Your own program reads and trades on the exchanges you connect through goodcryptoX's API, which its OpenAPI document describes. A program uses the same keys, permissions and limits as an AI agent ([Keys and limits](README.md#keys-and-limits)).

Each figure comes in its trade's own currency: prices and values in the market's quote, a PnL in the asset its row names, credits and `GET /api/v1/portfolio` in USD, a key's limits in the currency they were set in. `GET /api/v1/rates` answers your base currency and its rate per 1 USD, to show a figure as goodcryptoX does.

The `instruments` MCP tool and `GET /api/v1/instruments?venue=…` include each market's known 24h volume (quote notional) and price change (percent) and, where the exchange sends it, the last traded price. The API also serves `instrument-stats/<venue>` through its [topics route](../reference/runtime/api.md#the-socket). These figures remain decimal strings. For volume and change, null retains a previous known figure; optional `invalidate` names figures to clear. For `lastPrice`, absent retains the previous price for compatibility and explicit null clears it.

In **Settings › MCP & API**, make a key ([how](README.md#connect-any-mcp-app-or-program)); the connect block's **API** side then has three lines, each with a copy icon: the **Address**, the **Key**, and the header your program sends with every request, with the chosen key in it: `Authorization: Bearer <your key>`. The copy icon beside the header copies it whole.

<details>
<summary>Example API request</summary>

Set `GCX_URL` to the origin your program reaches and supply `GCX_KEY` in its environment. This example reads accounts:

```sh
curl --fail-with-body -H "Authorization: Bearer $GCX_KEY" "$GCX_URL/api/v1/accounts"
```

The OpenAPI document is at `$GCX_URL/api/v1/openapi.json`. A program requests the document with the same Bearer header; the description includes only what its key may call. Amounts, prices and sizes are decimal strings.

</details>

## From another computer

For a program on another computer, run the connector there in its `connect` mode: while it runs, it serves your installation at a local address ([pairing](README.md#from-another-computer)). Press **Show** beside **Cursor and other apps** on that computer and run the connector with the values of its `env` (all but `GCX_URL` and `GCX_KEY`; your program sends its own key):

```sh
GCX_RELAY=… GCX_MAILBOX=… GCX_R=… GCX_PROFILE=… GCX_PAIR=… npx -y goodcryptox-connector@<version>-<build> connect --profile <the GCX_PROFILE value>
```

It prints the connection address, then the API address ending in `/api/v1`. Keep it running while your program uses the connection, and use the first address as `GCX_URL`, for example `http://127.0.0.1:8130`.

<details>
<summary>Later starts and address changes</summary>

On later starts, run `npx -y goodcryptox-connector@<version>-<build> connect --profile <the profile>`; the saved pairing is reused. Each installation has its own profile and address. If its saved address is in use, add `--choose-new-address`, then copy the new address into your program.

</details>

While disconnected, calls fail; they are not saved for later. To connect without our relay, use [an SSH tunnel](README.md#use-an-ssh-tunnel-instead).

Opened at a [home address](../install/mac.md#your-home-network), the **API** side's **Address** is that address: a program on the same network sends its requests there with its key, without the connector or our relay, and uses the address without `/api/v1` as `GCX_URL`. Use it on a network you trust, or through your own trusted HTTPS address: over HTTP, someone who can read the traffic can copy the key.

## Sending an order

Ask for a preview first ([Checking an order first](README.md#checking-an-order-first)). Then `POST /api/v1/orders` with:

```json
{
  "requestId": "my-strategy-0001",
  "sourceId": "YOUR-ACCOUNT-ID",
  "instrumentId": "ETH",
  "type": "limit",
  "side": "buy",
  "size": "90",
  "sizeUnit": "quote",
  "price": "3000",
  "overrides": [],
  "bracket": {
    "reduceOnly": true,
    "tp": { "type": "market", "mode": "percent", "targets": [{ "value": "3", "share": "100" }] },
    "sl": { "type": "market", "mode": "percent", "value": "1.5" }
  }
}
```

On an account in hedge mode a futures market has two ids, `…:long` and `…:short`, and the side opens or closes: a Sell on the long or a Buy on the short only reduces that position, with or without `reduceOnly`; `reduceOnly: true` on the other side is refused (`reduce-only-opens`).

A lost reply after sending does not mean an order failed: check the result before trying again. When retrying a trading request, keep the same `requestId` and body so it cannot place the same order twice.

`POST /api/v1/margin` adds (a positive `amount`) or removes (a negative one) isolated margin on a position, in its margin coin (MCP `change_margin`). A Trade key does it on the accounts and markets its limits name, as it sets leverage: a key with no limits, or one for another account or market, gets 422 `key.*` and nothing is sent.

The request bodies and the refusal messages of every route are in the OpenAPI document at `/api/v1/openapi.json`.

## Settings only you change

Some routes change something only you decide: a key that calls them gets 403 `person-only` with a sentence to pass on to you, and nothing is sent to the exchange. Their MCP tools exist so an agent can tell you what to do.

* `POST /api/v1/accounts/{id}/bnb-fees` with `{"on": true}` turns **Pay fees in BNB** on or off for a Binance account (MCP `set_bnb_fees`). The account's row in `GET /api/v1/accounts` shows it as `bnbFees`: `on`, and the settings behind it, `spot` and `usdm`.

## Withdrawing a proposal

A key that proposed an order or a bot can take it back while it waits for you: `POST /api/v1/proposals/{id}/withdraw` with `{"requestId": "..."}`, scope **Propose** or above. The answer is `{"accepted": true}`; asking again answers the same. A proposal of another key answers 404, as if it did not exist; one you launched answers 422 `proposal-launched`, and one you rejected 422 `proposal-rejected`. Rejecting stays yours: a key cannot reject.

## Paying credits with $GOOD

Credits are paid from the person's own wallet; a program or an agent can only quote, never pay. `POST /api/v1/credits/pay` with `build: false` answers what a payment would add ([schema](../reference/schemas/credits-pay.schema.json)). Ask by the coin amount, as Add credits does: `input` is the amount in the coin's own units, one route call, and the payment spends exactly that. On Solana, `burn: true` with any coin but $GOOD buys $GOOD in the same payment and burns it, for the $GOOD discount:

```json
{"chain":"solana","token":"native","input":"0.1007","burn":true,"payer":"<the wallet's address>","build":false}
```

The answer's `quote.credits` is the credits in USD and `quote.goodMore` how many more than the same SOL buys without $GOOD (here about 9.90 and 0.90). With `token` the $GOOD mint itself, the $GOOD held is burned (no `burn`). `amount` (credits wanted) and `spend` (USD to spend on the $GOOD paths) are still accepted.

On Tron, TRX is swapped to USDT in the payment; any other TRC-20 answers `no-route`.

## Credits History totals

After the person pays, `POST /api/v1/credits/pay/receipt` with the payment's `{chain, id}` reads its status on any of our networks; the credits usually show in `GET /api/v1/credits` seconds after the first confirmation, and a payment the network later drops is taken back by a history row of `reason: "reversed"` (below zero, naming its `chain` and `tx`, and the payment's `token`, `amount` and `seq` under `payment`).

`GET /api/v1/credits` and MCP `credits` return the same optional additive `totals` object ([schema](../reference/schemas/credits-api.schema.json)). `totalPaid`, `paymentCredits`, `grants`, `totalVolume`, `totalFees`, `dailyVolume`, `dailyFees`, `monthlyVolume`, `monthlyFees` and `balanceDifference` are USD decimal strings. `firstDay` is the first recorded trade's UTC date or null, `throughDay` is today's UTC date, `dayCount` counts both ends and idle dates. Monthly averages mean thirty times daily, even with ten dates of history or a calendar-month boundary. `paidEstimated` marks inferred payment costs, including every $GOOD payment. `balanceDifference = paymentCredits + grants - totalFees - balance`; nonzero alerts, never blocks. Waiting and reverted payments are excluded; a payment the network dropped is taken out of `totalPaid` and `paymentCredits` by its `reversed` row, never counted in `grants`. Missing totals on an older runtime: use known days/history and state that the figures are partial. Compare balances only with complete totals. The existing `days` and `?before=YYYY-MM-DD` pagination are unchanged. A payment stays the person's wallet action.

## Trading volume

Use `GET /api/v1/trading-volume?before=YYYY-MM-DD` with read permission, or ask the MCP tool `trading_volume`. It shows how much you traded in USD, how many trades filled, what you paid in fees, and your closed P&L, by account, market and who placed the order, since you connected each account to goodcryptoX. See the [response schema](../reference/schemas/trading-volume.schema.json).

`totals` covers all the trades we kept. `days` shows the latest 31 UTC days that have trades, newest first. To get the next page, pass `next` as `before`; that day is excluded from the next page. Amounts are decimal strings in USD. Funding, transfers and orders that have not filled do not count. Spot closed P&L does not enter these totals. Exchange fees and goodcryptoX fees are separate; a rebate is negative.

`manual` means an order placed by a person or an access key. `dca` and `grid` mean bot orders. `gcx` means we know the order came through goodcryptoX, but no longer know which kind of order or whose key placed it. `external` includes trades placed outside goodcryptoX, liquidations and auto-deleveraging.

Check each account's `state` and `reason` before treating its totals as complete. Trades from before you connected an account are not counted. An account you removed with its history kept and put back keeps what it counted and counts again from the put-back. `since` is the time of the oldest trade we kept, in milliseconds; it does not promise that every trade after it is present. If a history read fails, the account stays incomplete until we retry successfully. A newly connected account stays pending while we read the trades since its connection. On Binance, we count trades placed outside goodcryptoX while it runs. Trades made while it was off, or lost during a crash, may be missing, especially on markets we did not know about.

`missing` counts trades we could not fully price in USD: a fee in a coin the exchange gave us no price for, or a trade on a market we did not know yet. What we could not price counts as zero; a trade on a market we did not know yet stays that way. `estimated` counts trades priced with a rate we held rather than a price from the time of the fill. We keep the original amounts so we can improve these figures later. `unknownFees` counts trades whose exchange fee is unknown, including equity trades. `unknownPnl` counts perpetual trades whose closed P&L is unknown, rather than known to be zero. The recovery fields show how far we have checked the saved history. For the person, `unmatchedFees` counts credits charges we could not link to a retained trade.

A key sees only the connected accounts it is allowed to read. It sees its own `keyId`; figures for other keys and the person are combined without their identifiers. Demo figures and erased accounts are excluded. A date that does not exist returns 400.

## Portfolio identities

`GET /api/v1/portfolio` and the read-only MCP `portfolio` tool add `assets` beside the existing account supplements, snapshots and PnL. Each asset has `assetId`, `assetKind` (`bundled` or `exchange`), `symbol`, `name`, `amount`, `value`, `unpriced` and `holdings`. `bundled` means an explicit registry identity, even if currently held on one account. `exchange` means an unmapped venue asset; its id includes the venue and exact asset code. Never join rows by `symbol`.

`holdings` retains each account, venue, original code, amount, price, value and missing-price flag. Values and prices are USD decimal strings. Amounts are in that holding's units; value-only wallet amounts are null. A group's value sums the holding values: 2 UBTC at 60,000 on one exchange plus 1 BTC at 61,000 on another is 181,000, not three times a reference price. With no price, the amount remains and the value contributes zero; `unpriced` is true if any constituent lacks a price. Prices are the latest known at the local runtime; this read does not invent a price or require a goodcryptoX service. Accounts excluded from balances and demo money are absent from connected asset totals. Older runtimes omit `assets`; all older fields retain their meaning.

The answer's `pnl` is what the accounts made since they were connected to goodcryptoX, from goodcryptoX's own record, on every exchange alike: closed futures trades after fees, and funding. Each row of `accounts` carries `connected`, the moment that account's PnL counts from; nothing before it is in any period.

## Questions

### Is there an OpenAPI document?

Yes: at `/api/v1/openapi.json` on your installation's address, requested with the same Bearer header. It describes only what the key may call.

### Does the API work from another computer?

Yes: run the connector there in its `connect` mode, and while it runs it serves your installation at a local address. An [SSH tunnel](README.md#use-an-ssh-tunnel-instead) works too.

### Can a program place orders?

Yes, with a **Trade** key: `POST /api/v1/orders`, within the key's accounts, markets and limits. Ask for a preview first; it sends nothing.

### What happens if my request times out?

A lost reply does not mean an order failed: check the result before trying again. When retrying, keep the same `requestId` and body so it cannot place the same order twice.
