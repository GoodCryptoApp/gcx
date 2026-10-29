# Reports to goodcryptoX

goodcryptoX sends anonymous records from your computer for two purposes: to find and fix problems, and to understand how the app is used and what to improve. A problem report is written when an order fails, the exchange does not answer or goodcryptoX stops unexpectedly. A small daily usage record says whether you used goodcryptoX and how much it traded.

No keys, account addresses or balances go in these records. A random number chosen when you installed goodcryptoX identifies the installation to our server. See the [Privacy policy](legal/privacy.md) for what is sent and how it is kept.

## Read your reports

Open **Settings › Installation › Reports to goodcryptoX**. The introduction includes your installation number. **See past reports** starts closed; open it to see every report and daily record, before and after sending. A daily row reads **Daily usage record** and its date; **What was sent** opens its contents. Problem rows show their date, size, subject and sending state.

- **Still collecting**: goodcryptoX is still gathering the records around the problem
- **Not sent yet**: the report has not left your computer. If no reports server is configured, the row says so. After a failed automatic send it shows the error and says goodcryptoX tries again
- **Not sent: automatic is off**: the report stays here unless you send it yourself
- **Kept on this computer**: an address was found in the report, so it is never sent
- **Sent**: includes the time it was sent
- A skipped report says the queue was full and you can send it yourself; a refused report shows the server's answer

**Open** shows a compact report at the clicked row: its subject, time, version and timeline. If there are no timeline lines, the report says so. **Show as sent** opens its JSON in place. **Send to gcx** is offered only for a closed report that will not go automatically because sending is off or the report was skipped. It is never offered for a held, sent, refused or still-collecting report, nor merely because an automatic report is waiting for the server.

## Tell us something feels wrong

Press **Send to gcx** above **See past reports**. This works with automatic reports off. **goodcryptoX's state and recent log** shows your open warnings and when the report was built; it does not refresh while open. You can add a line, read **See what will be sent**, then confirm the send. Your line is optional and is sent as written; never add a key or passphrase.

This report includes every account's open orders, bots and positions; app, system and browser facts; memory and processor use, uptime and free disk; and up to 1,000 recent lines from goodcryptoX's log. Names, folder paths and network addresses are removed first. An account's earlier name can remain, so check the preview. The log is plain JSON, and a note names any old log lines left out to fit the 1 MiB limit. An order's own journal and exchange traffic are not included in this kind of report.

A send is stored and posted once. If the server does not answer, **Send again** sends the stored report; it is not retried automatically.

## Turn automatic sending off

The last row is **Send bug reports and daily usage to goodcryptoX**. Turning it off asks first, at that row, why these anonymous reports help us find problems and choose what to build. **Keep on** leaves the setting unchanged. Turning it on asks nothing.

With automatic sending off, goodcryptoX sends only a daily sign that it exists: the random number and the date. Reports still get written and kept on your computer. You can send a report yourself from an order's or bot's **What happened?**, with a line of your own if you wish.

## What is recorded

Problem reports contain the orders, bots and positions involved, the exchange messages around the problem, the app and system versions and the error if goodcryptoX stopped unexpectedly. Repeated instances of the same problem join the open report. Trading continues regardless of the reports server's state. Before a record is kept to be sent, goodcryptoX checks for addresses; if one is found, the record is held locally.

Daily records include whether you opened the Dashboard; for each exchange, whether a bot ran or an order rested, whether you created one, and the volume goodcryptoX's orders filled in the market's quote currency. They also say where goodcryptoX runs and the system, chip and browser families. Demo accounts are excluded. A day with goodcryptoX entirely off has no record.

Reports and daily records stay in your data folder until you delete them. A report is at most 1 MB. The automatic sending queue is bounded at 500 reports or 50 MB; older reports skipped from it remain readable and can be sent manually. Your installation number in the introduction is the reference to include when asking us to delete records from our server, as the Privacy policy explains.
