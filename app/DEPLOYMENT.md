# Deployment checklist — Pusha 2.8

Everything here is either a command you can run or a thing to do in a browser.
Nothing is "should work".

---

> **Hosting on Netlify?** There is a page for that: **[DEPLOY-NETLIFY.md](DEPLOY-NETLIFY.md)** —
> `node build-dist.js` produces a clean `site/` folder with the headers, CSP and
> 404 already written, ready to drag onto Netlify.

## 0 · The one command

```bash
NODE_PATH=/tmp/node_modules node tests/deploy.js https://your.host/
```

It opens a throwaway browser profile, installs the app, fills the vault, closes the
browser completely, reopens it, cuts the network, and reports 25 checks in three
groups. Exit code 1 if anything fails.

Single file instead of a server:

```bash
node tests/deploy.js file:///path/to/pusha-standalone.html     # 16 checks, no PWA group
```

The 2.8 release adds encrypted file attachments and last-section restore. Run the
deployment checks below against the final hosted build before publishing it.

---

## 1 · Before uploading

| # | step | why |
|---|------|-----|
| 1 | `node build-single-file.js` | bakes CSS, JS and the 10 photos into one file; **fails** if a project photo or an `img/` path is missing |
| 2 | bump `PUSHA_VERSION` in `js/core.js` | the About card prints it, so "which version are you on?" has an answer |
| 3 | **bump `CACHE` in `sw.js`** | the single rule that stops returning users getting yesterday's CSS |
| 4 | `node tests/check.js … && node tests/learn.js … && node tests/features.js …` (× local, standalone, http) | 9 runs, all must report `errors []` |
| 5 | `node tests/deploy.js <url>` | the three promises below |

Current state: version **2.8**, cache `pusha-2.8.3`, standalone **720.6 KB**,
33 service-worker shell entries. The committed historical test counts above were
recorded before 2.8 and must not be treated as this release's test results.

---

## 2 · What must be true on the host

- **HTTPS.** Not optional. The PIN lock uses WebCrypto (`crypto.subtle`) and the
  service worker only registers on https or localhost. On plain http the app still
  runs but says honestly that it cannot encrypt.
- **Serve the folder, not a lone file.** `manifest.webmanifest`, `sw.js`, `js/`,
  `img/` all sit beside `index.html`, and every path is relative — a subdirectory is
  fine, a missing neighbour is not (`sw.js` must be at the scope root).
- **Right content types** (most hosts do this already):
  `sw.js` → `text/javascript`, `.webmanifest` → `application/manifest+json`.
- **Don't cache `index.html` or `sw.js` aggressively.** The worker is network-first
  for the page and reloads the shell in `install`; a year-long `immutable` header on
  `index.html` would freeze people on an old build. The other files are safe to cache
  hard because the cache name busts them.
- **No CDN, no analytics, no third-party font.** Any of those breaks the offline
  promise and the "nothing leaves the phone" line on the About card.

---

## 3 · The three promises, as measured

### PWA — 11 checks
| measured | value |
|---|---|
| manifest parses, name / short_name / start_url / scope | `./index.html` · scope `./` |
| `display` | `standalone` |
| theme / background | `#0b5c46` / `#f7f5ef` |
| PNG icons returning 200 | 4 (incl. 192 and 512) |
| maskable icons (Android home screen) | 3 |
| worker | registered, **activated**, controls the page, scope = site root |
| shell files precached | 33 entries (32 files + navigation) |
| **Chromium's own installability check** (`Page.getInstallabilityErrors`) | `[]` — no error |

### OFFLINE — 4 checks (after one visit, network cut)
| measured | value |
|---|---|
| app boots | 31 ideas · 5 views |
| vault still readable | yes |
| project photos | 10/10 loaded with no network |
| page served by the worker | 17 responses from the SW |

### SAVED across a full browser restart — 10 checks
| measured | value |
|---|---|
| every `pusha_*` key | 5 of 5 identical after close/reopen |
| vault fields | name, phone, school, year, subjects, skills all back |
| tidying survives | `maths lit` came back as `Maths Lit` |
| language | `zu` restored, `<html lang>` and the EN/ZU button agree |
| theme | `dark` restored |
| cashbook | the R35 line is still there |
| PIN | vault stored encrypted (`__enc`), **no plaintext name on disk**, still locked after restart, empty fields while locked, right PIN opens it |
| persistent storage request | asked silently, quota ~595 MB |

---

## 4 · What the machine checks cannot cover — do these by hand

1. **A real cheap Android** (10 minutes): open the link in Chrome → menu → *Install
   app* → icon appears → airplane mode → launch → fill a detail → close the browser →
   reopen. This is the path most people will take.
2. **An iPhone** (10 minutes): fill in a name and phone so the vault has something in
   it → the *Keep this on your iPhone* card should appear once → **Got it** → Safari →
   Share → *Add to Home Screen* → launch from the icon → airplane mode → check the DIY
   photos → lock with a PIN → reopen. **This one matters more than it looks — see §5.**
3. **Private/incognito tab**: the app should show the "Preview mode — nothing is
   remembered" banner and still work. If it claims to save there, something is lying.
4. **Printing**: Pack → Print / PDF on a phone, confirm the CV is one A4 page. The
   sheet keeps the start-marks and tool tiles out of the printout.
5. **Local files**: set a Vault PIN, attach a small document, close and reopen the
   app, unlock, and download it. Confirm file names are hidden while locked and
   the PIN cannot be removed while attachments remain. Export/import a backup too.

---

## 5 · "Save for next login" — the part people get wrong

The app keeps everything in the browser's storage on that phone. That means:

- **It is per browser and per origin.** The same app opened in Chrome and in Samsung
  Internet are two separate vaults. A different phone starts empty. There is no
  account, so nothing syncs — by design.
- **A backup file is the only way to move or to recover.** *Vault → Save a backup*
  writes a JSON file containing settings and encrypted attachments; *Load a backup*
  restores them. The file contents remain encrypted with the Vault PIN.
- **iPhone, in a Safari tab, is the risky case.** WebKit's Intelligent Tracking
  Prevention deletes *all* script-writable storage — localStorage, IndexedDB, service
  worker caches — after **seven days of Safari use without visiting the site**.
  Visiting other sites counts; the clock is Safari use, not calendar time. Home Screen
  web apps are **exempt** (their first-party domain is excluded from the cap), which is
  why *Add to Home Screen* is not cosmetic on iOS — it is the thing that stops the
  vault disappearing.
  ([WebKit/ITP summary](https://progressivewebapps.com/platforms/ios-safari))
- **Storage pressure eviction** can still hit anyone, installed or not, and it takes
  the whole origin at once. Pusha now asks for persistent storage silently
  (Chrome/Edge/Android grant it by engagement heuristic — in this sandbox the request
  was made and **refused**, which is why the backup is still the real guarantee).
  Firefox is skipped on purpose: it shows a permission bar.
- **Shipped in 2.7 — the iOS hint.** `js/hint-ios.js` shows one short card, only in
  Safari on an iPhone/iPad, only when there is actually something to lose (a filled
  vault or a cashbook line), never inside the installed app, never on Android, and
  never again after **Got it**. It names the two taps — *Share → Add to Home Screen* —
  and offers **Save a backup** as the second button. Verified in `features.js` §13l
  on all three builds: silent with nothing saved, silent on Android, silent in the
  home-screen app, gone permanently after Got it.

---

## 6 · If something goes wrong

- Keep the previous release folder. To roll back: re-upload the old build, **bump
  `CACHE` again** (e.g. `pusha-2.6.1`), deploy. Installed copies pick the change up on
  the next visit because the page is fetched network-first.
- If a bad build is already cached: the worker deletes every cache that is not the
  current name on `activate`, so a new `CACHE` value is the reset button.
- 2.0.x users updating into 2.6 keep their vault: the storage keys did not change.

---

## 7 · Shipping the single file instead

`pusha-standalone.html` (695.2 KB) is the whole app with the photos inside it. It
needs no host, no HTTPS and no worker — it opens from a flash drive, a WhatsApp
download or a school computer. What you lose: installability, the home-screen icon
and the iOS storage exemption; what you keep: every feature, fully offline, and data
saved per browser as above.
