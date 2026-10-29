# Telegram: your own bot

goodcryptoX sends its messages through a Telegram bot that is yours. You get the bot in one touch, or with Telegram's BotFather; then you press **Start** in your bot's chat once, and the messages arrive there. Your computer talks to Telegram directly; nothing you are told passes through a server of ours.

Messages come in the language you chose in Settings › General › Language. Which messages you get and when: [Notifications](../reference/notifications.md).

## One touch

The runtime reads `GCX_TELEGRAM_RELAY` (the relay URL, with no trailing slash) and `GCX_TELEGRAM_MANAGER` (the manager bot username, without `@`). Both override the public build defaults. Both must be nonempty to show **Create my Telegram bot** first; if either is empty or absent from a build whose defaults are empty, the card offers the BotFather token only. An explicit empty override disables one touch. These settings are public addresses, never bot tokens.

The setup card is titled **Connect Telegram to receive alerts**; once connected, the card is gone and the Telegram section of the page ends with a row, **Connected to** your bot, with **Disconnect** as a red word at its right. **Re-check** keeps its quiet outline. It explains both paths in two grey lines, with the green **Create my Telegram bot** at their right. The card is the same until Telegram is connected, except that while goodcryptoX waits for you in Telegram it adds one grey line under the button, **Waiting for Telegram** with a small spinner, which goes when the wait ends. **Enter your bot's token**, under them, opens a short token field with **Connect** at its right, under the link; the rest of the card stays. The field closes when the token is accepted. Both paths have the same alerts and shortcut buttons.

1. Open **Settings › Alerts** and press **Create my Telegram bot**. Telegram opens. If your browser blocks it, press the button again: it opens the same link and starts nothing new.
2. Telegram shows the new bot with its suggested name ("goodcryptoX alerts", in your language at the press) and a short username such as `gcx_a1b2c3_bot` already filled in. Confirm it. You do not need to do anything in BotFather.
3. Press **Start** in your bot's chat. Your bot writes "Your goodcryptoX is now linked to this Telegram chat" and the alerts arrive there. goodcryptoX looks for your confirmation every three seconds for ten minutes, or until goodcryptoX stops or restarts; closing the page does not stop it. If it stays silent, press **Open your bot** in Settings › Alerts, then **Start**.

You can edit the name in Telegram. Keep the suggested username; if you change it, press **Create my Telegram bot** again after ten minutes.

A newly created bot gets the manager bot’s current photo and one short description, once. A failed cosmetic update does not delay or undo the connection.

## What our server does

The one-touch way needs one small server of ours, for one reason: Telegram tells only the bot that manages new bots (ours) that yours was created, and your computer has no public address to be told at. The server does this:

- It keeps a short-name reservation, the private claim's derived mapping, your new bot's public id and the Telegram id of the account that created it for at most 15 minutes, until your goodcryptoX collects the bot's token once. The short public username alone cannot collect a token.
- During that one claim, it copies the manager bot’s largest photo to your new bot in the background. It never stores the token or photo and never sees a message. It never keeps a log; cosmetic failures are silent on the relay.
- After the set-up, messages and button presses go between your computer and Telegram only. If our server is down, a bot that is already linked keeps working; only a new one-touch set-up fails, and the card says so.

What you should know, honestly: if our set-up server were compromised, it could read your alerts and write to you as your bot. It could not trade and could not reach goodcryptoX. Our manager bot is allowed by Telegram to read or replace the token of any bot created this way. A leaked manager token would expose those bots; we would replace it at once. You can leave at any time: disconnect, and set up your own bot with BotFather (below). Whether Telegram lets an owner detach the manager from a bot is not documented.

goodcryptoX checks what our server hands over: the token must be accepted by Telegram as the bot your own set-up named, or it is thrown away. Our server also tells goodcryptoX which Telegram account created the bot: goodcryptoX links that account by writing to it, and a plain Start links only from that account. Telegram lets a bot write only to someone who pressed its Start, so our server cannot link an account that never opened your bot; if another account was linked first, your Start answers "This bot is linked to another chat"

## The BotFather steps (no server of ours)

If you want no server of ours anywhere, create the bot yourself. The steps are Telegram's own:

1. Open Telegram and start a chat with **@BotFather**.
2. Send `/newbot`.
3. Send a name for the bot (any).
4. Send a username for it: 5 to 32 letters, digits or `_`, ending in `bot`.
5. BotFather answers with a token that looks like `110201543:AAH…`. Copy it.
6. Paste it into **Settings › Alerts** and press **Connect**.

goodcryptoX asks Telegram whether the token is real before it keeps it, and says "Telegram refused this token." if it is not.

## Press Start in your bot

Whichever way you got the bot, until a chat is linked goodcryptoX shows **Open your bot** (after one touch, the bot has usually linked your chat already). It opens your bot's chat in Telegram with a one-time code; press **Start**. Your bot answers "Your goodcryptoX is now linked to this Telegram chat" and from then on the messages arrive there. Nothing that happened before is sent.

- The link works once and for 10 minutes. Pressed later, the bot answers "The token has expired. Please request a new one"; a link already used answers "Invalid token. Please check the link" Ask for a new link.
- Only your private chat with the bot can be linked: a Start in a group is ignored. Whoever presses Start with a valid link becomes the chat goodcryptoX writes to, so keep the link to yourself.
- Press **Open your bot**, then Start in the chat that opens, right away: for ten minutes after the press a plain Start links the bot. If the bot answers anything but "Your goodcryptoX is now linked to this Telegram chat", press **Disconnect** in Settings › Alerts and set up again. Later, with no chat linked, the bot answers "To link a chat, press Open your bot in Settings › Alerts"; once a chat is linked, a Start there answers "Your goodcryptoX is now linked to this Telegram chat" and one anywhere else "This bot is linked to another chat"
- Linking another chat moves the messages there, and the old chat is told "Your goodcryptoX has been disconnected from this Telegram chat"
- A new token for the same bot (after `/token` in BotFather) keeps your chat.

## Titles

Every title is one bold line, and every order and bot message names the account it is about, as the app shows its name: a manual order's title starts with it ("Hyperliquid 2 ETH Limit order filled"), a bot's title ends with it ("DCA Entry: Buy ETH Hyperliquid 2"), a liquidation opens with it, and an order's alert, a repair or an hourly reminder ends with it ("Needs repair: ETH Stop Market Hyperliquid 2"). A name longer than 13 characters is cut in the middle ("Maksim…ccount"). The price-feed and maintenance messages are the exchange's, and name the exchange.

## Which orders are told

**Settings › Alerts** shows the Orders, Bot defaults and Telegram sections, with the Telegram setup in a card on top until your chat is connected. Until your chat is connected, the switches are disabled and keep their saved values; connecting enables them without changing those values.

The switches below are all on at first; each is a field of `GET` and `POST /api/v1/settings` ([schema](../reference/schemas/notify-settings.schema.json)). Once Telegram is set up, nothing else is needed for these messages to arrive.

- **Orders from goodcryptoX** (`notifyManual`). On: the fill of a manual order and its trigger (a stop that triggers, a trailing stop that starts) are sent. Off: they are not. A manual order's repair or alert is always sent, and the away report still names the order.
- **External orders** (`notifyOutside`). On: a fill of an order you placed with the exchange's own app or another tool, on an account goodcryptoX holds, is sent with its title marked "(external)", for example "Hyperliquid 2 ETH fill (external)": its size and price, and nothing else, since goodcryptoX knows nothing more of that order. Off: it is not. One message per fill, once. goodcryptoX keeps every connected account's live updates open while it runs, so these fills are seen with the panel closed and nothing of goodcryptoX on the account too. An account beyond Hyperliquid's limit of live accounts per internet address (15 when measured) is read on a timer instead (every minute while up to 13 accounts are read that way, about every three minutes with 40), and its fills of orders placed outside goodcryptoX are sent within a few minutes ([Hyperliquid](../venues/hyperliquid.md#sub-accounts-and-vaults)). A fill older than three minutes when goodcryptoX reads it is not news and is not sent.
- **Bot defaults** (`notifyBotDefaults`: bot stops or errors, take-profit and stop-loss fills, entry and averaging fills, and the level those fills start from, 0 being the entry order). The switches a new DCA bot starts with: the bot form shows them, and you may change them for that bot alone. Changing them here does not change a bot that exists. **From level** appears only while **Entry and averaging orders** is on. Its value and pencil open a small input with the range `0–100`, a check to save and a cross to restore the saved value. A wrong value marks the input border red and sends nothing.

## Hyperliquid maintenance

When you have an open order or a bot on Hyperliquid, goodcryptoX tells you when a maintenance began ("Hyperliquid maintenance": since when; orders wait and go by themselves when it ends; orders resting on Hyperliquid stay) and when it ended ("Hyperliquid maintenance ended": at what time, after how many minutes). The start goes once goodcryptoX has checked, 60 seconds after Hyperliquid's status first named it, that it is real. The end goes at the first order Hyperliquid accepts again; when nothing waited, at goodcryptoX's end check, and then it says that market and limit orders may still be refused for a few minutes. The end goes only when the start went. Both are information, not alerts: a maintenance is planned. There is no switch for them. With no open order and no bot, and no page of gcx open, goodcryptoX sees no maintenance and says nothing. [More on maintenance](../reference/hyperliquid.md#maintenance).

## The connection to the exchange

When goodcryptoX's live connection to an exchange stays down, it tells you ("Needs your attention"). It tells the first drop of an hour; the drops that follow in that hour are counted and told in one line when the hour ends, or when the connection has held for five minutes: "The connection to {exchange} dropped 3 times in the last hour". The count includes the drop you were told of, and nothing is sent for an hour with a single drop. Time the computer spent asleep is not an outage and starts no count.

## Disconnect

**Disconnect** (`POST /api/v1/notify/telegram/disconnect`) tells your chat "Your goodcryptoX has been disconnected from this Telegram chat", deletes the token file and forgets the chat. Nothing more is sent, and messages not sent yet are dropped. The bot itself stays yours in Telegram; delete it in BotFather if you no longer want it.

## When something does not work

| You see | What happened | What to do |
|---|---|---|
| No messages, and the state says blocked | You blocked the bot or deleted its chat | Open the bot and send it anything: sending resumes, the waiting messages first |
| The state says the token was refused | The token was revoked in BotFather, or the bot deleted | Press **Disconnect** (Re-check cannot clear it), then connect the new token (another bot is fine: it starts from its own first message) |
| A message "Telegram buttons stopped" | Another copy of goodcryptoX (a copied data folder, a second computer) reads the same bot | Stop the other copy, then press Re-check |
| Our set-up server did not answer | The relay is down or your computer is offline | Try again later |
| goodcryptoX could not save the token where goodcryptoX runs | The disk is full or the data folder is not writable | Free space or fix the folder's permissions, then press the button again |

While a set-up waits, the button opens the same link again; once the ten minutes are over, a press starts a new one.

## While goodcryptoX was away

When goodcryptoX was asleep, stopped or updating and something happened meanwhile, one message tells you once goodcryptoX has read the exchange again and waited three minutes for late fills: "goodcryptoX was away", from when to when, then each bot and order in the order things happened, with what it did and where it is now:

```
gcx was away
From 2026-10-01 12:00 UTC to 2026-10-01 14:30 UTC: gcx was not running. Meanwhile:
• Hyperliquid 2 ETH Limit order filled
↳ Now: filled
• DCA Avg.1: Buy ETH Hyperliquid 2
↳ Now: in position: 1.5 ETH; 1 averaging order placed
• Hyperliquid 2 Stop Market triggered on ETH
↳ Now: resting on the exchange
```

Each line is the title of a message you got on its own. A stop whose price is still past its level when goodcryptoX is back fires on the coin's first trade and says so here; one whose price crossed and came back stays armed ([After goodcryptoX was off](../trading/missed-orders.md)). A trailing stop's highest or lowest price while goodcryptoX was away is said ("the price reached 3,100 while goodcryptoX was away; the trail did not follow it"), and the stop stays where it was. An order whose time in force ended while goodcryptoX was away is cancelled when goodcryptoX comes back and said so. What goodcryptoX itself had to tell you meanwhile (a page, the API wallet's expiry) is a line too. A time away with nothing in it sends nothing.

## Buttons

A button press found in the first poll after a start gets a new message so Telegram can notify you: “While goodcryptoX was away you pressed <button> on <subject>.” It then asks with the current figures or gives the current Accepted/Refused answer. Its old keyboard shrinks; confirmation belongs to the new message. Presses received while goodcryptoX is already running retain the existing message edit.

Under a message about one of your bots or one of your own orders, goodcryptoX puts one to three buttons that fit it (four on an hourly reminder), chosen from the bot's or the order's state when the message is sent. A message about something that waits for your answer carries **that item's** answers, not another's; a message about an item you already answered carries none:

| The message is about | Buttons |
|---|---|
| A bot's count differs from the exchange's and nothing goodcryptoX saw explains it (the message waits for goodcryptoX to read the trades and shows what **Exchange is right** would give) | **Exchange is right** · **Bot is right** · **Stop bot** |
| Something else is trading the bot's coin (a notice, sent as an alert: nothing is held) | **Accept** · **Make the exchange match the bot** · **Stop bot** (no Make the exchange match the bot while the count above is also open) |
| Orders that are not the bot's rest on its coin, nothing traded (the same notice in its own words) | **Accept** · **Stop bot** |
| A bot's sale refused: coins missing on spot, or "already closed" on perpetuals | **Exchange is right** · **Retry** · **Stop bot** |
| The same, the coins held by a resting order of yours | **Cancel that order** · **Stop bot** |
| A bot's sale refused because the rest is below the exchange's minimum | **Exchange is right** · **Stop bot** |
| A bot's take-profit, stop-loss or close held after a refusal | **Retry** · **Close position** · **Stop bot** |
| A bot in repair: its entry refused, or the allowance | **Retry** · **Stop bot** |
| A bot waiting for a renewed API wallet or for room in an agent's limits | **Stop bot** (the renewal and the limit are in Settings) |
| Your own stop-loss, take-profit or triggered order held after a refusal | **Retry** · **Cancel order** |
| An hourly reminder (below) | its item's buttons and **Silence** |
| A running bot holding a position | **Stop bot** · **Close position** |
| A running bot holding nothing (its take-profit or stop-loss executed, it repeats) | **Stop bot** |
| A bot's averaging order that failed, the bot holding its position | **Stop bot** · **Retry order** |
| A bot that ended, nothing held | **Relaunch** |
| A bot that ended with its position open | **Relaunch** · **Close position** |
| Your own order that filled: a buy, or a sell on perpetuals | **TP +5 %** · **TP & SL 5 %** · **TP & SL 10 %** |

Another message about a bot that has an item open (a fill, say) carries that item's buttons; with only the notice open it carries the usual ones. Every other message has none. When goodcryptoX knows the panel's address, **Open in panel** sits on its own row below.

A refused sale is one message, with the exchange's own words in it; the order's separate "the exchange refused the order" alert is no longer sent beside it. Your own order's refusal still sends its alert.

Each button is the panel's own command for the same thing, with the same checks, written to goodcryptoX's ledger the same way and marked as sent from Telegram:

- **Stop bot** stops the bot whatever cycle it is in; **Close position** closes what the bot holds at market (on a running bot, the panel's Close pos.: with Repeat on, the bot then starts its next cycle); **Retry** places again what the repair is about (a refused sale, the same sale once more; your own order, the panel's Retry); **Retry order** places again each averaging order of the message that is still failed; **Cancel order** cancels your order.
- **Exchange is right**, **Bot is right**, **Accept**, **Make the exchange match the bot** and **Cancel that order** are the bot page's answers of the same names ([When the bot needs you](../bots/dca-running.md#when-the-bot-needs-you)). Bot is right and Accept send nothing: the bot keeps its count and goodcryptoX stops comparing it with the exchange.
- **Relaunch** starts a new bot on the same account and pair with the stopped bot's settings as they are now (not its name, note, start and end times or notification switches, as the panel's Repeat), on perpetuals at the leverage and margin mode the account has on that pair now, which the question names.
- **TP & SL 5 %** adds a take-profit 5 % above your fill price and a stop-loss 5 % below it (mirrored for a short), reduce-only on perpetuals when Settings › General › Trading's reduce-only is on as you press, attached to that order as the panel's Attach TP/SL does; **TP +5 %** a limit take-profit alone. A spot sell gets none (it opened nothing to protect).

**The count that differs.** That message is sent only after goodcryptoX has read the trades of the cycle from the exchange and rebuilt it, so it can say what **Exchange is right** would give: one line saying what the bot will be after the press: "After this: the bot counts 0.007 ETH at an average of 3,100 USDC, realised PnL +0.005 USDC; 0.002 ETH your fills do not explain becomes one correction with no profit or loss." (When your fills explain all of the difference the second part is left out.) The bot has already paused its new orders; only this message waits, for the read's own time (a few seconds), and your other messages are not held back. If the trades cannot be read, the message goes out at once with "The result could not be read yet; goodcryptoX keeps trying." and goodcryptoX tries again every minute while the item is open; when a read works, the item in the panel and the API shows the result, and no second message is sent. Exchange is right then reads the trades again when you press.

**The question.** With **Confirm before acting** on (the default), the first press turns the message into what will happen, read from the account now: "You are about to stop the bot ETH Long. It will close long 0.5 ETH at market. Confirm?", with **Confirm** and **Cancel**. Confirm within a minute; later, or after Cancel, the message gets its buttons back and the next press asks again. Off, the first press acts. One switch for every button, with one exception: a button that sends a market order whose size you have not seen yet always asks first, with the size and the value: **Make the exchange match the bot**, and **Exchange is right** on a refused sale (it sells what the account holds of the bot's count). **Exchange is right** on a count that differs always asks too, whatever the switch says: it moves the bot's count and books a profit or loss, and its question repeats the line the message showed. The exception to the exception: on a sale refused below the exchange's minimum, **Exchange is right** sells nothing (the bot's count goes to zero), so it follows the switch and its question says so.

**The answer.** The pressed message gains one last line, "Accepted: Stop bot.", "Accepted: Retry." and so on. What you did with a button sends no message of its result: a bot you stopped or whose position you closed is not told again as "DCA stopped" or "DCA Exit"; what happens later by itself arrives as its own message, as always. A button pressed while goodcryptoX was away receives a new message naming the bot or the order’s instrument. A refusal is always a last line, "Refused: <why>."; refused for something that may pass (goodcryptoX locked, starting, stopping, the disk full), the buttons come back and a later press is judged again.

**When the message is old.** A button acts only on what its message was about: Stop on the bot in any cycle; Close only on the cycle the message reported ("Refused: the bot has moved on since this message (cycle 4 now)."); an item's answer only while that item is open ("Refused: this repair has been resolved"; a refusal of what you pressed opens a new item with its own message); Retry only while that repair stands; Retry order only on that message's levels still failed; Relaunch only on a stopped bot; a TP/SL shortcut only while the position from that order is still held ("Refused: the position from this order is no longer held"). Sizes and prices are always read again.

**Who can press.** Only you, in your linked chat, on a message your current bot sent. A forwarded copy, a press from someone else or from another chat answers "Not available here" and does nothing. A second press, a press on another phone, or Telegram delivering a press twice acts once and answers "Already done". While goodcryptoX is locked every button answers "Refused: unlock first.".

**Turning them off.** **Shortcut buttons** (Settings › Alerts, on by default; the setting `telegramButtons`) off: new messages carry the panel link only, and a press on an older message answers "Shortcut buttons are off in Settings" and does nothing. Both switches are fields of `GET` and `POST /api/v1/settings` ([schema](../reference/schemas/notify-settings.schema.json)): `telegramButtons` and `telegramConfirm`, both `true` until you change them.

Whoever can use your Telegram can press these buttons (the [terms](../legal/terms.md), section 6): if someone else can use your phone or your Telegram, turn them off. The question guards against a mistaken tap, not against another person.

## Hourly reminders

When something leaves a position without its working stop-loss or close (a bot's sale refused, a bot's stop-loss or close held after a refusal, your own stop-loss held in repair), goodcryptoX reminds you every hour while it stays open: "Still needs you: ETH", for how many hours the position has been unprotected, with the item's buttons and **Silence**. Silence stops the reminders for that item; it stays on the Dashboard and the bot's page, and what it holds stays held. If what you pressed is refused again, that is a new item and is reminded again. After goodcryptoX was off, the next reminder comes at the next whole hour, never several at once. Nothing else is reminded. `POST /api/v1/attention/silence` with the item's key does the same as the button.

## Where the token is kept

In the file `telegram.token` in goodcryptoX's data folder, readable by you only. It is not in the key store: the token can send messages as your bot, but it cannot trade, and keeping it outside means goodcryptoX can still tell you "Runtime locked" when the key store is locked. It is never shown back, logged or written anywhere else. A backup of the data folder holds it; treat the folder as private.

## What goodcryptoX reads from your bot

goodcryptoX asks Telegram for your bot's new messages and button presses (a long poll from your computer, nothing reaches your computer from outside) to see your **Start**, your presses on its buttons, and that you unblocked the bot. It keeps the chat's and your Telegram ids, never what you write; anything else sent to the bot is ignored.
