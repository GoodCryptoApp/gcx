# Signing in and staying connected

The panel in your browser talks to goodcryptoX on your computer, NAS or server over one connection

## Signing in

Open **goodcryptoX** from the menu bar and choose **Open the dashboard**, or double-click the app. Elsewhere, run `gcx open` on the computer that runs goodcryptoX. The link contains a code that works once, for 60 seconds, and never reaches a log. The browser swaps it for a sign-in that lasts until you have not used the panel for 30 days

To use another browser, choose **Copy sign-in link** and paste it into that browser's address bar. Without the menu, `gcx open --print` gives the same kind of link. The panel never puts a secret in its address; an already signed-in browser keeps its sign-in when you open the dashboard again

To use goodcryptoX in another browser on this Mac, type localhost:8118 in its address bar and press Unlock. If that address does not open, choose Copy sign-in link in the goodcryptoX menu and paste it there.

## Protecting the panel

The first opening offers **Protect goodcryptoX on this computer** with **Create passkey**, **Use a passphrase instead** and **Not now**. When the browser cannot create a passkey, the passphrase form appears instead, with two fields. Its back arrow returns to Create passkey, and Not now stays available

**Not now** turns the protection switch (**Ask for Touch ID to open the dashboard** on a Mac, **Ask for a passkey to open the dashboard** on a NAS or a server) off and opens the panel without storing a credential. To protect the panel later, use the protection switch in Settings › General › Installation. Turning it on with no credential opens setup beside the switch immediately

Once protection is set, the lock shows the logo and **Unlock**. On arrival, a passkey check starts automatically only when the page is visible and focused. Inactivity expiry only locks: it shows the mask and sends no request, even on a visible page. The first later focus or click on the page asks once per lock; a visible but unfocused tab on another desktop does not ask. Unlock remains available for a manual check. An expired passphrase-only lock reveals its field on the first focused interaction; arriving at a passphrase-only lock still starts with Unlock. If it succeeds, the panel opens; if it fails, the plain Unlock button stays. Nothing concludes that your browser cannot use the passkey before you click Unlock and that check is refused

After a refused Unlock check, the lock offers your passphrase if one exists. Otherwise, it says to open goodcryptoX where you made the passkey and set a passphrase using the Installation protection row. **Lost your passkey or passphrase?** expands the recovery instructions. With only a passphrase set, clicking Unlock opens its field

A passkey works at `http://localhost:<port>/gcx`, the address the menu opens; `127.0.0.1` and the earlier `gcx.localhost` lead there. A passkey made at the earlier address is created again once: the lock says so, and **Create passkey** makes it. A password manager that handles passkeys may refuse this address (Proton Pass does): turn its passkey saving off, or choose **Use a passphrase instead**. A passkey may also work in another browser on the same computer; if it does not, set a passphrase where it works, enter that in the other browser, then add a passkey there

The panel stays unlocked while a page of it is on screen. After 5 minutes with no page visible, the next opening asks again. The lock has no Not now; turning protection off in Settings requires a fresh check

## Recovering access

On a computer with the menu-bar app, choose **Reset passkey…** (or **Reset passphrase…** when only a passphrase exists). The item appears only after protection is set. It asks for your computer's password or biometric confirmation, removes the local passkey and passphrase, signs every browser out and opens setup again.

On a NAS or server, expand the recovery link on the lock for a command with **Copy**. Run it on that machine, inside the container on a NAS or over SSH on a server

goodcryptoX stores only the passkey's public half and a scrambled form (Argon2id) of the passphrase. This passphrase confirms access to the panel; it is separate from the key store's passphrase, so a computer without a keychain may ask for both. See [Safety and keys](../concepts/safety.md#the-passkey-on-this-computer)

## When the connection drops

Quitting goodcryptoX from the menu bar leaves the browser open and shows the existing disconnected message as soon as the runtime stops; after Quit in Settings on a Linux desktop the message says goodcryptoX has quit and how to open it again

- **Connection lost. Reconnecting…**: the panel lost its connection or heard nothing for 3 seconds. Prices and buttons grey so stale figures cannot be used. After 9 seconds of silence it closes the connection (on a phone, at my.goodcrypto.app, the panel waits longer: it greys after 10 seconds and closes after 30) and retries after 1, 2, 4 and 8 seconds, then every 10 seconds. It does not retry while the browser tab is hidden; showing the tab reconnects at once
- **Not signed in**: your sign-in ended. Open the dashboard from the menu or run `gcx open` again
- **Did not answer. Is it running?**: the runtime is stopped, or its computer is asleep or off the network

After reconnection, lists and prices resume from where they stopped. A network drop preserves market streams for 2 minutes; after a restore or move to another computer, the page reloads once

## What stays connected

Market data runs while a visible block needs it: the orderbook, trades and chart close their streams when hidden. Every connected account's fills, orders and positions stay connected while goodcryptoX runs

A refused order, cancel or leverage change shows the runtime's reason where you pressed. It never says an order was not placed when the runtime could not confirm that

See [Local API](../reference/runtime/api.md) for the sign-in and connection contract
