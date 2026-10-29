# Updates

goodcryptoX updates itself, on a Mac, on Windows, on a Linux desktop and in Docker on a NAS or a server.

## Versions and builds

A fix or a small addition raises PATCH (3.0.1, 3.0.2); a new capability such as another bot or exchange raises MINOR (3.1.0 brought the Grid bot); a new generation raises MAJOR. Between two versions every update raises the build only, and machine stamps retain that build (6731). Every release a person notices has What's new. An internal change nobody notices can raise only the build count, silently, with no notes.

People see all three parts of the semantic version: **3.0.0**, **3.0.1**, **3.5.6**. Installation shows the version, the actual running tier and the recorded installed-build day; The menu, update notices, What's new, Version history and published release titles use the same three-part rule. Machine stamps, comparisons, release tags, disk-image names and Docker tags keep their build numbers. `gcx status`, reports and cases retain the full stamp where required. A healthy build-only update still has no Dashboard notice; a failed installation or withdrawn build keeps its existing runtime notice and recovery action.

## Internal, Beta and Everyone

Each build of goodcryptoX is published in up to three lists on GitHub: **Internal** (goodcryptoX's own team; a private list, which an Internal copy reads with a token placed once in its data folder) first, then **Beta** (testers) or straight to **Everyone**, both public pages. The copy you download carries the name of its list. If you are on Beta, you also get every release that goes to everyone. Automatic updates install only newer builds; taking an Everyone release keeps your Beta choice. Your data folder keeps the highest list you ever ran (`install.json`). A build made before the lists existed belongs to Everyone.

**Switching lists.** Where your data folder has run a higher list than Everyone, Settings › General › For developers › **Updates from** shows the lists up to that one, whichever you run now. Pick one and goodcryptoX asks once, installs that list's latest build, newer or older than yours, and restarts in a few seconds (`gcx tier beta` does the same in a terminal). Each list shows its current build: the version, the build number and when it was published. From then on updates follow your choice (Beta includes Everyone’s releases), and only newer builds; a build you name (`gcx tier beta 15795`) below its list's latest stays until a build newer than that latest is published. Your data folder is kept. Going to an older build, the line before the restart says so: stops for newer features are not sent until you update, and goodcryptoX does not page about them. In Docker the image is the program: the row, and `gcx tier`, show the line to put in `compose.yaml`, the list's image with its tag; `docker compose up -d` then runs it (a build named with `gcx tier` stays until you set the list's tag again).

## What goodcryptoX checks, and what it sends

goodcryptoX asks GitHub, where goodcryptoX is published, for the latest release of its list (Beta also checks Everyone) when goodcryptoX starts and when you open it in your browser, if it has no answer yet, its last check failed more than a minute ago, or its last answer is older than its interval; and while goodcryptoX runs it asks by itself every hour (every 5 minutes on an Internal version), whether a page is open or not. A check that failed is not repeated at every read, and no page says so. The request carries nothing about you or your accounts: no version, no identifier, only the word goodcryptoX as the program's name. GitHub sees your internet address, as any website does. The answer is kept in your data folder (`updates/check.json`), so after a restart Settings shows it at once. See the [privacy policy](legal/privacy.md).

## Updating on a Mac: by itself

When a check finds a newer build, goodcryptoX downloads it at once (only the part for your Mac's chip, Apple silicon or Intel: about half the size of the app in the download from the website) and checks it (its checksum against the release's list signed by goodcryptoX's release key, its version and build number, and the signature on the app). It installs by itself **when none of your stops is near the price**: only a trigger goodcryptoX watches within 1 % of the last price holds it until a later check. Orders resting on the exchange keep working during the restart and do not hold it; an open page does not hold it either. Press **Update** to install at once. Just before it installs, goodcryptoX asks GitHub once more: a build withdrawn since it was downloaded is dropped and never installed (below); if GitHub cannot be reached then, the checked build installs. Installing means: goodcryptoX finishes what it is doing (no new orders start; orders already on their way to the exchange are settled first, for at most 30 seconds), restarts as the new version in a few seconds, and the number in the menu bar and in Settings › General › Installation changes. Your orders on the exchange stay where they are, your bots go on, your data folder is kept, and the new version picks up from where the old one stopped. A tab you open again, or one that stayed open in the background, reloads by itself once when it reconnects to the new version.

While goodcryptoX restarts, a stop-loss goodcryptoX holds itself is not watched (the [terms](legal/terms.md) say the same): however long the restart takes, a stop whose price is still past it when goodcryptoX is back fires on the coin's first trade, and one whose price was crossed and came back stays in place ([After goodcryptoX was off](trading/missed-orders.md)).

**If the new version does not run.** goodcryptoX keeps the previous version in your data folder until the new one has run for five minutes (or until goodcryptoX next starts, if you quit it sooner). If the new one stops with an error before that, or cannot start at all, goodcryptoX puts the previous one back and starts it, and Settings › General › Installation says so. If the new version could not be installed at all (for example, goodcryptoX may not write to your Applications folder), the version you had keeps running and Settings says why. Either way goodcryptoX does **not** try that build again by itself: **Try again** in Settings installs it at once. A newer build than that one is downloaded as usual. The previous version opens your data as the new one left it and keeps running. What only the new version knows it cannot read: orders resting at the exchange keep working, but a stop or order of such a feature that goodcryptoX itself held is not sent until the new version runs again, and goodcryptoX pages you once if it skipped any such record. Press **Try again** to bring the new version back.

Settings › General › **Installation** (its version row) says:

- **Up to date · version**: you run the latest release.
- **Updating…**: goodcryptoX is downloading and checking a newer build, or restarting as it. From the moment you press Update it says this on the row, on the Dashboard and at the bottom of the page while it restarts; when the page comes back it says **goodcryptoX updated to 3.0.1** until goodcryptoX is running again, then the usual row.
- **Version 3.0.1 ready · installs when idle**: goodcryptoX installs it by itself when none of your stops is near the price. Press **Update** to install at once.
- **Version 3.0.1 available**, with **Try again**, and the reason under it: the last install did not take (for example "The update to 3.0.1 did not start; goodcryptoX put back 3.0.0."), or the download failed. Try again installs at once.
- A check that could not reach GitHub or read its answer says nothing on any page. It tries again the next time goodcryptoX starts or you open it, a minute later at the earliest.
- **Version 3.0.1 has a problem: go back to the previous version**, with **Go back to 3.0.0**: this build was withdrawn (below).

The Dashboard shows one yellow update line only for a ready build, an install that failed or a withdrawn build; a failed check puts no line there.

## Updating on a Linux desktop: by itself

On a Linux desktop set up with `./gcx install`, goodcryptoX updates itself as on a Mac: it downloads the new build (one file for both kinds of computer, x64 and ARM), checks it against the release's list signed by goodcryptoX's release key, waits for the same quiet moment, finishes what it is doing and restarts as the new version within about 10 seconds. Settings › General › Installation shows the same lines and the same **Update** and **Try again**.

The previous version stays beside the program, in `~/.local/opt/gcx.old`, until the new one has run for five minutes. If the new one stops with an error before that, or cannot start at all, goodcryptoX puts the previous one back, starts it and Settings says so, as on a Mac. To put the previous one back yourself during those five minutes, from a terminal (add `--data <folder>` if you gave one at install):

```
~/.local/opt/gcx.old/gcx update undo
```

## Updating on Windows: by itself

As on a Mac: the same quiet moment and the same Settings lines. goodcryptoX downloads only the part for your PC (Intel or AMD, or Arm) and checks its checksum against the release's list signed by goodcryptoX's release key. If a new version does not run, goodcryptoX puts the previous one back by itself (it keeps it beside the program until the new one has run for five minutes), Settings says so, and that build is not installed again by itself.

## Going back to the previous build

If a new build gives you trouble, go back to the one before it from Terminal. On a Mac, with goodcryptoX running:

```
/Applications/gcx.app/Contents/MacOS/node /Applications/gcx.app/Contents/Resources/app/gcx.mjs rollback
```

On Windows, in a Command Prompt:

```
"%LOCALAPPDATA%\Programs\GCX\app\node.exe" "%LOCALAPPDATA%\Programs\GCX\app\gcx.mjs" rollback
```

On a Linux desktop, `gcx rollback` does the same.

goodcryptoX downloads the previous published build and checks it as it checks an update: its checksum against its release's list signed by goodcryptoX's release key, and on a Mac also its version and build number and the signature on the app. Then it says how many of the stops and trails it watches itself will be unwatched for a few seconds ("2 internal stops and trails will be unwatched for a few seconds."), finishes what it is doing (no new orders start; orders already on their way to the exchange are settled first, for at most 30 seconds) and restarts as that build. It never goes to a development build, to a build that was never published, or to one that was withdrawn. A development build does not go back at all: install a release by hand.

**What goes back: only the program.** Your data folder stays exactly as it is: the history, bots, settings, accounts and API wallet keys, the logs and the copies goodcryptoX keeps before a database change. Nothing is deleted and nothing is restored. The older build reads your data as the newer one left it. What only the newer build knows it skips, and goodcryptoX pages you once: orders resting at the exchange keep working, but a stop or order of such a feature that goodcryptoX held itself is not sent until the newer build runs again.

Afterwards goodcryptoX does not reinstall the build you left by itself: Settings › General › Installation offers it with **Try again**. A build newer than that one installs as usual.

**An older build.** Add its build number, the number in brackets in Settings › General › Installation (`… gcx.mjs rollback 2290`). goodcryptoX goes only to a published build older than the one running, and warns first: "Builds older than the previous one may not understand rows this version wrote; what they skip is paged, and the stops goodcryptoX held for it are not sent." If that build cannot open your data at all, it stops at once and goodcryptoX puts the newer build back by itself, as after an update that did not run: Installation still shows the newer build's number, and the log says why.

In Docker on a NAS or a server, `docker exec gcx gcx rollback` (or `docker compose run --rm gcx rollback` while the container keeps restarting) asks nothing of the running goodcryptoX: it prints the line to put in `compose.yaml` in place of the image line, such as `image: ghcr.io/goodcryptoapp/gcx:3.0.0-2290`, then `docker compose up -d` to run there. Your data volumes are kept as they are. While the line names a build, `docker compose pull` brings no update: to take updates again, set it back to the line the command prints last, such as `image: ghcr.io/goodcryptoapp/gcx:latest`.

## When a build is withdrawn

If a published build turns out to be broken, we withdraw it: GitHub then stops offering it, so nothing installs it again (new installs, updates and `gcx rollback` skip it). A goodcryptoX that has already downloaded it and waits to install it drops it at its next check, or when it asks once more just before installing. A goodcryptoX running that build learns it at its usual check (when it starts, when you open it, and by itself every hour while it runs, every 5 minutes on an Internal version). The Dashboard and Settings › General › Installation then say:

**Version 3.0.1 has a problem: go back to the previous version** · **Go back to 3.0.0**

The button does what `gcx rollback` does with no build number (above): goodcryptoX downloads the previous published build and checks it, says how many of the stops and trails it watches itself will be unwatched for a few seconds, then finishes what it is doing and restarts as that build, at once. Only the program goes back; your data folder stays as it is. Afterwards goodcryptoX does not reinstall the withdrawn build by itself, and a newer build installs as usual. If goodcryptoX cannot go back (for example, no published build is older), the reason stands where the button was.

goodcryptoX only says a build is withdrawn when GitHub marks that very build. A newer build published since is an update as usual, and then no such line shows; the two lines never show together.

**In Docker** the button's place holds the line to run on the machine, in the folder of `compose.yaml`: `docker compose pull && docker compose up -d`. Withdrawing a build also moves the image's tag back to the previous build, so that line goes back. If your `compose.yaml` names a build instead of `latest`, the banner also says which tag to put there (such as `3.0.0-4`).

## What's new

The first time you open goodcryptoX after a new **version** (not after a new build of the same one), a window says "What's new in 3.0.1" with a short list; **OK** closes it. It shows once per browser: the browser remembers the last version it showed. On your first visit to goodcryptoX in a browser it shows nothing. Settings › General › Version history keeps every version's list.

## On a NAS or a VPS (Docker)

goodcryptoX's `compose.yaml` runs a small updater beside it, from the same image. It looks for a newer goodcryptoX as often as a Mac does, and when one is out it waits for the same quiet moment as a Mac (no trigger goodcryptoX itself watches within 1 % of the last price), lets goodcryptoX finish what it is doing (up to 60 seconds), then starts the new image on the same volumes; the new version picks up where the old one stopped. Settings › General › Installation shows **Update** when a new version is out, to take it at once. The updater never goes back to an older build by itself, and a `compose.yaml` that names a build (such as `3.0.0-2312`) stays on it. It can manage the machine's Docker containers, which is how it restarts goodcryptoX; it has no network of its own.

A `compose.yaml` from before the updater has none: take the new one once, or install each version on the machine, in the folder of `compose.yaml` (with `sudo` where Docker needs it):

```
docker compose pull && docker compose up -d
```

Docker stops goodcryptoX (it finishes what it is doing first, for up to 60 seconds), starts the new image on the same volumes, and the new version picks up from where the old one stopped. `gcx update` inside the container says the same; `gcx update download` refuses there, since there is nothing to download by hand. There is no automatic going back: a version that does not start is restarted by Docker again and again, and `docker logs gcx` says why. To go back, put the earlier build's tag (such as `3.0.0-2312`) in place of `latest` in `compose.yaml` and run the same line.

## On a Linux server without Docker

The Linux download is made for a desktop; a server without Docker has no goodcryptoX of its own yet, and no program there swaps goodcryptoX for you, so goodcryptoX never replaces itself there. Instead:

```
gcx update             # is a newer release out?
gcx update download    # download it for this system and check it against the release's checksums
```

`gcx update download` puts the file in your data folder, under `updates/download/`, prints where it is, and says what to do: stop goodcryptoX (`gcx stop`), unpack the file over the folder goodcryptoX runs from, and start goodcryptoX again. Your data folder is kept; the new version updates what it stores when it starts. Linux builds follow the same lists as every other computer: a list's download is there once a build has been published in it; until then, the download says the release has none for this system.
