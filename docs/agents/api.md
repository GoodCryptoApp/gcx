# API

Your own program reads and trades through goodcryptoX's API, which its OpenAPI document describes. A program uses the same keys, permissions and limits as an AI agent ([Keys and limits](README.md#keys-and-limits)).

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

A lost reply after sending does not mean an order failed: check the result before trying again. When retrying a trading request, keep the same `requestId` and body so it cannot place the same order twice.

For a program's connection, request bodies, worked order and refusal messages, use the [API reference](../reference/runtime/api.md#worked-order-example).

## Withdrawing a proposal

A key that proposed an order or a bot can take it back while it waits for you: `POST /api/v1/proposals/{id}/withdraw` with `{"requestId": "..."}`, scope **Propose** or above. The answer is `{"accepted": true}`; asking again answers the same. A proposal of another key answers 404, as if it did not exist; one you launched answers 422 `proposal-launched`, and one you rejected 422 `proposal-rejected`. Rejecting stays yours: a key cannot reject.
