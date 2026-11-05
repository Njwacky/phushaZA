# Pusha — project structure

The after-matric kit. **Static only:** no server, no build step required to run,
no account, no tracking. Open `index.html` and it works.

```
app/
├── index.html              the markup only (~24 KB) — loads the fourteen files in js/
├── styles.css              all styling: tokens, light/dark, the desktop tier,
│                           print (A4)                                    (~29 KB)
├── theme.js                tiny <head> script that sets the colour scheme
│                           before paint (stops the white flash)          (<1 KB)
├── js/                     all behaviour, ten small files (~175 KB total)
│   ├── data-ideas.js 42 KB   the 31 ideas — pure data
│   ├── data-learn.js 31 KB   resources, learning steps, the method
│   ├── core.js        9 KB   helpers, storage, theme, nav, SA ID check
│   ├── i18n.js       41 KB   four hand-written languages
│   ├── pack.js       16 KB   copy-paste blocks (4 versions each), detail sheet
│   ├── cv-checks.js  12 KB   CV completeness, A4 CV, printing
│   ├── misc.js       10 KB   your own ideas, About
│   ├── ideas.js      12 KB   list, filters, calculator, quiz
│   ├── money.js       3 KB   cashbook + goal
│   ├── path.js       12 KB   7-day plan, opportunities, scams, PIN lock, boot
│   ├── data-diy.js   12 KB   the 10 make-and-sell projects — pure data
│   ├── diy-art.js    40 KB   thirty inline SVG panels (how-to drawings)
│   ├── diy.js        10 KB   project list, project detail, copy the shopping list
│   ├── hint-resize.js 2 KB   the once-off resize hint
│   └── hint-ios.js    3 KB   the one-time iPhone home-screen card (stops iOS
│                             deleting the vault after 7 days without a visit)
├── img/                    the ten finished-project photos (JPEG, 640 px, ~27 KB each)
│                           cached by the service worker and inlined by the single-file build
├── manifest.webmanifest    install-as-app manifest (only used when served over http)
├── icon.svg                the app icon (inline SVG, no PNG to ship)
├── build-single-file.js    optional: bakes all of it into one file
├── build-dist.js           makes the folder you upload (../site) with Netlify
│                           headers, CSP and a 404 — no internal notes inside
├── pusha-standalone.html   the baked single file — ship this by WhatsApp
│                           or flash drive (works from a file:// path)
├── IMPROVEMENT-AUDIT.md    what is missing, and how each gap was scored
└── MARKET-AND-GROWTH.md    market case, who pays, distribution, moat, risks
```

**Script order in `index.html` is load-bearing** — the ten files are classic
scripts sharing one global scope, so `i18n.js` must come before anything that
calls `t()`, and `path.js` last. Nothing here needs a bundler.

Everything the user sees is in the files above. The only material outside this
folder is `../research/learning-resources.md` — the note that records which free
course links were checked, and when. Nothing in the app links to it, so the
shipped folder is 100% product.

There are exactly **two** HTML files, and they are the same app:

| file | use it for |
|------|------------|
| `index.html` | editing — the real source, needs `styles.css`, `theme.js` and `js/` next to it |
| `pusha-standalone.html` | shipping — everything inlined into one file, opens from a `file://` path or a flash drive |

Hosting on Netlify: **[DEPLOY-NETLIFY.md](DEPLOY-NETLIFY.md)**.
Deployment generally: **[DEPLOYMENT.md](DEPLOYMENT.md)** — the pre-flight
steps, what the host must provide, and the 25-check script
(`tests/deploy.js`) that proves PWA installability, offline boot and that a person's
data survives closing the browser.

They are **not two apps and not two versions**: the second is generated from the
first, so `PUSHA_VERSION`, the data and every string are identical. They never need
each other at runtime — the single file has zero external references. What they do
share is browser storage: opened on the same browser from the same place, a detail
typed into one is already there in the other. Never edit `pusha-standalone.html` by
hand — `node build-single-file.js` overwrites it from the source.

## Running it

* **Simplest:** double-click `index.html`. Everything works from a `file://`
  path, including saving to `localStorage`.
* **Like a website:** serve the folder —
  `python3 -m http.server 8000` → <http://localhost:8000/app/index.html>
* **Deploy:** upload the folder to any static host (Netlify, Cloudflare Pages,
  GitHub Pages, S3). There is nothing to configure and nothing to compile.

## On a phone, and on a computer

The same file, no second page and no separate build. One media-query tier does the
work, so a school computer lab and a R700 Android get the same app:

| | phone (< 900 px) | computer (≥ 900 px) |
|---|---|---|
| the five sections | a bar pinned to the **bottom**, thumb reach | a **column on the left**, icon + label in a row |
| brand | in the header | at the top of the rail (the header shows the section name instead) |
| a sheet | slides up from the bottom edge, full width | a **centred dialog** with rounded corners, 640 px wide |
| busy views | one column, full width | two or three columns: the idea list is 2-up from 1024 px and 3-up from 1240 px, school + banking cards sit side by side, money and path pair their short cards |
| primary buttons | full width | content width (`#saveVault`, *Add to cashbook* stop being bars) |
| toasts | above the bottom bar | bottom, centred over the content (not over the rail) |

Why it matters: the offline, no-account promise is worthless if the app only works
on a phone — the people who most need a CV and a cashbook often borrow a PC at a
library or a friend's house. Nothing is hidden on the wide layout and nothing extra
is downloaded for it: it is 29 KB of CSS and one `@media` block.

## Where things live

| File | What it does |
|------|--------------|
| `js/core.js` | `Store` (localStorage with a graceful fallback — `set()` now returns `false` when storage is full), `$` / `$$`, `ico()`, `storageFail()`, `toastAction()` (Undo), theme, nav, vault fields, SA ID checksum |
| `js/i18n.js` | `LANGS`, `I18N` (English / isiZulu / Sesotho / isiNdebele), `t()`, `applyLang()`, the language picker |
| `js/pack.js` | the four copy-paste blocks **with four hand-written versions each**, the copy engine, detail sheet, custom CV sections |
| `js/cv-checks.js` | `cvMissing()` / `cvScore()`, the CV banner, the A4 CV build + printing, PIN lock rendering |
| `js/misc.js` | your own ideas, **backup export/import**, About, feedback report, the "never leave a dead button" safety net |
| `js/ideas.js` | list, **search**, filters, idea detail + calculator + share, the matcher quiz, sheet keyboard handling |
| `js/data-ideas.js` | the 31 ideas — **add an idea here** |
| `js/data-learn.js` | `RES` (58 verified resources), `LEARN` (3 skills + 3 free practice steps per idea), `METHOD` |
| `js/money.js` | cashbook (with delete + Undo and "copy my cashbook"), savings goal |
| `js/path.js` | 7-day plan, opportunities, scams, the PIN lock, **auto-lock**, boot |

All state lives in `localStorage` under `pusha_*` keys:

| key | holds |
|-----|-------|
| `pusha_vault` | every vault field, the photo (300×300 JPEG data URL), `cvExtra` sections |
| `pusha_theme` | `"light"` or `"dark"` |
| `pusha_lang` | `"en"` (default) · `"zu"` · `"st"` · `"nr"` |
| `pusha_myideas` | ideas the user added |
| `pusha_cash` | cashbook lines |
| `pusha_docs` | ticked documents |
| `pusha_blockvar` | which version of each copy-paste block the user picked (`{intro:2, cv:0, pitch:3, fund:1}`) |
| `pusha_goal` | savings goal name and target |
| `pusha_plan` | the 7-day plan ticks |
| `pusha_autolock` | minutes before the vault locks itself (0 = off) |
| `pusha_myplan`, `pusha_rank`, `pusha_calc_*` | chosen idea, quiz ranking, per-idea calculator numbers |
| `pusha_vault.__enc` | when a PIN is set, `pusha_vault` holds only `{__enc, salt, iv, ct, iter}` — AES-GCM-256 ciphertext, PBKDF2-SHA256 at the round count this device calibrated (150 000–900 000). The PIN is never stored, in any form. |

## The 10 make-and-sell projects (2.0)

A second door for people who do not want to study further, or cannot afford to:
things you can make with your hands and sell from a WhatsApp status. It sits in
the **Ideas** tab as *"Make it yourself, then sell it"* and opens a list of ten
projects, each with pictures, a shopping list with prices, six steps, who buys,
what goes wrong and the safety line.

| project | to start | sells for | time |
|---|---|---|---|
| Paper-bead jewellery | R30 | R60–R140 | 1½ h per set |
| Copper-wire name art | R145 | R120–R280 | 40 min per name |
| Beaded keyrings & phone charms | R100 | R35–R75 | 15 min each |
| Tassel wall hanging | R100 | R250–R450 | 3 h |
| String art on a board | R77 | R150–R300 | 2½ h |
| Scented candles in tins | R175 | R60–R120 | 2 h for 8 |
| Melt-and-pour soap bars | R155 | R25–R45 | 1½ h for 10 |
| Cement planters | R132 | R80–R180 | 2 days drying |
| Salt-dough ornaments & keyrings | R52 | R25–R60 | 1 h + drying |
| Hand-lettered quote cards | R80 | R80–R200 | 30 min each |

Files: `js/data-diy.js` (the words), `js/diy-art.js` (the drawings),
`js/diy.js` (the list and the how-to sheet). Long teaching text stays in English
and the sheet says so; the labels around it are translated into all four
languages (281 keys each): `diy_*` and `btn_back`.

**The pictures are drawn, not downloaded.** All 30 panels are plain SVG in
`js/diy-art.js` — 40 KB for the lot, no photos, no external files, nothing to
fetch in an app that promises nothing leaves the phone. Each project has three:
*what you need*, *the main move*, *finished*. `tests/features.js` asserts that a
project sheet contains no `http://` or `https://` anywhere in its markup, so a
stray remote image can never creep back in.

## The corner of the Skills box (2.0)

A textarea can be pulled taller by its corner, but on a phone that native corner
is invisible, missing, or two grey pixels nobody recognises. So the **Skills &
certificates** box carries its own grip (`js/hint-resize.js`):

* a 44 × 44 pull handle in the bottom-right corner, drawn as three diagonal lines
  on a soft amber pill — it looks like something you may touch;
* the first time, a breathing ring around it. **Tap it** and a sheet explains, in
  the chosen language, that the corner is a handle and the box remembers its
  size. One button: **Got it**. Nothing is blocked, nothing is modal until tapped;
* **pull** it with one finger (or the mouse) and the box grows between 74 px and
  340 px; the height is stored in `pusha_skills_h` and restored next time;
* once read or pulled, `pusha_tip_resize` is set and the ring stops for good. Tap
  the grip again any time to re-read the note — that is the only way it talks to
  you, so it can never nag.

Accessibility: the grip is a real `<button>` with a translated `aria-label`
(`data-i18n-aria` is now supported by `applyLang()`), it is reachable by Tab and
answered by Enter/Space, it has `touch-action:none` so a pull never scrolls the
page, and the pulse is switched off under `prefers-reduced-motion`.

Four new keys in all four languages (265 keys each): `grip_title`, `grip_body`,
`grip_gotit`, `grip_aria`.

## The icon, and the two ways to "install" Pusha (2.0)

**The mark:** a cream letter **P** and three gold bars that rise and end in an
arrowhead — a plan that goes up. It is drawn once, as geometry, in
`icons/make-svg2.js`, and every size is generated from that one drawing.

```
icons/make-svg2.js        the letter + the bars-that-become-an-arrow  → icon.svg, icon-maskable.svg
icons/make-favicons.js    a deliberately simpler drawing for a browser tab
icons/icon-192.png        home screen (Android, Chrome)
icons/icon-512.png        install prompt, store listing
icons/maskable-192.png    Android crops these to a circle/squircle — art inside 80 %
icons/maskable-512.png
icons/apple-touch-icon.png  180 px, iPhone/iPad
icons/favicon-32.png     tab: the letter plus two gold bars
icons/favicon-16.png     tab: the letter only — the bars are gone at that size
```

Two rules that came out of a real complaint ("in light mode the letter is not
showing"):

1. **The tile keeps the icon's own colours, in every theme.** `.logo` uses the
   literal `#0b5c46` / `#f7f5ef`, never `var(--brand)` / `var(--on-brand)` —
   because in dark mode those flip to mint and near-black, and the in-app mark
   stopped looking like the icon on the home screen. The symbol's paths also
   carry explicit fills, so no inherited `fill` can blank the letter, and the
   tile sets `forced-color-adjust:none` so Windows high-contrast cannot wipe it.
2. **A 16 px tab is not a 512 px icon.** The full mark is unreadable at 16 px, so
   the tiny favicon is redrawn bolder, without the bars. Shrinking the big icon
   is what made the letter disappear in a light tab.

**Installed app (PWA).** Served from any web address, Pusha installs like a real
app: `manifest.webmanifest` gives it a name, colour, icons and a standalone
window, and `sw.js` keeps the app's own 18 files on the phone. That worker is
deliberately narrow:

* only **same-origin GETs** are cached — a learning link still goes straight to
  the network, and only when a person taps it;
* the **page** is network-first (so a new version is picked up) and falls back to
  the stored copy (so it opens in aeroplane mode);
* every other app file is cache-first, refreshed quietly in the background;
* the cache is versioned (`pusha-2.0.1`) and old caches are deleted on activate.
  **Bump `CACHE` in `sw.js` whenever you ship new icons or CSS** — otherwise a
  returning user keeps the old files.

**Downloaded file.** `pusha-standalone.html` needs no worker — it is one file,
about 693 KB with the ten project photos inside it, and it opens from a flash drive or a
WhatsApp download with no internet. The build bakes the icon into it as an
inline data URI and fails if any `icons/` path is left behind.

Which is newer? The installed app updates when opened online; a downloaded file
only changes when downloaded again. The in-app **Details / About** sheet says
this in plain words, with the exact steps (Chrome: ⋮ → *Add to Home screen*;
iPhone Safari: Share → *Add to Home Screen*).

## Text is data, and mistakes are expected (2.0)

Two rules, both enforced in one place each:

**1. Nothing a person types becomes markup.** Every value in the vault, the
cashbook, a custom idea or a CV section goes through `esc()` before it reaches
`innerHTML`. That matters most for the one door into the app from outside: a
**backup file from someone else**. Before 2.0 a name like
`<img src=x onerror=…>` in a shared backup ran as code with access to
`localStorage`. Now:

* `esc()` escapes `& < > " '` at every sink (CV sheet, printed CV, printed detail
  sheet, idea cards, cashbook lines, own-idea forms).
* `safePhoto()` only accepts an inline **raster** data URL (`png / jpeg / webp /
  gif`). A photo that points at `https://…` is dropped rather than rendered —
  otherwise printing a CV would quietly tell a server that the CV was printed.
* `backupClean()` keeps only `pusha_*` keys of plain types, drops `__proto__`
  and friends, refuses more than 4 MB, and returns `null` for anything that is
  not a Pusha backup.
* `cleanIdea()` reduces the user's own ideas — which can also arrive inside a
  backup file — to the shape the app understands: a slug id (nothing that can
  break out of an attribute), a whitelisted category, numbers, and length caps. `backupConfirm()` then shows an in-app decision sheet —
  *Download my data first* / *Replace it anyway* / *Cancel* — instead of the
  browser `confirm()` that a sandboxed preview silently blocks.
* The `iter` round count inside an encrypted blob is clamped to
  `[150000, 900000]`, so a doctored file cannot ask the phone for a billion
  rounds and freeze it on unlock (169 ms instead of minutes).

**2. The common mistakes are caught, not punished.** None of these block a save
unless the data would be wrong:

| mistake | what happens |
|---|---|
| PIN typed wrong the first time | a second “type the PIN again” box; a mismatch keeps the Save button disabled **and** refuses the click with a reason — a typo here cannot be undone |
| `R1 200,50` / `1,200.50` / `1 200` in the cashbook | parsed correctly (`parseMoney()`) |
| `12oo` in the cashbook | refused: *“That is not an amount. Type 35 or 35.50.”* — never silently R0 |
| the same line entered twice | caught within 4 s, with a reason |
| email with no `@`, phone with letters | a quiet one-line warning under the fields, never a block |
| loading the wrong backup file | can't change anything until you confirm, and you can download your current data first |
| deleting a cashbook line, a photo, a CV section | Undo in the toast |

## The four copy-paste blocks, and their versions

`Pack → Copy-paste blocks` writes four things from the vault: a **short intro**, a
**CV summary**, a **business pitch** and a **funding motivation**. Each one has
**four hand-written versions**, because one voice does not fit everybody — the
person who talks like a shop manager and the person who is shy on the phone should
not be sending the same paragraph.

| block | v1 | v2 | v3 | v4 |
|---|---|---|---|---|
| Short intro | plain and formal, full length | short WhatsApp / SMS length | skills first, "what I can do on day one" | two sentences, for a form's small box |
| CV summary | profile first (default CV text) | skills first, then education | results and study plans (bursary / college) | honest "no experience yet" version |
| Business pitch | line-by-line prompts | 30-second spoken pitch | problem → offer → proof → ask | numbers only, for a form field |
| Funding motivation | 5-section letter (NYDA / SEFA style) | short version for a word limit | budget first, itemised | "what I have already proved" |

Rules that hold in all sixteen:

* Every fact comes from the vault — name, school, year, subjects, skills, phone,
  email, address, reference. Nothing is invented, and no version claims experience
  or money the person has not entered.
* Where the vault is empty the text says so in `[square brackets]` — that is the
  shopping list of what to fill in before sending, not filler.
* The choice is per block and is remembered (`pusha_blockvar`), the Copy button on
  the row and on the preview both copy **the version on screen**, and the chips are
  40 px tall for the thumb.

## The vault lock (PIN)

* PBKDF2-SHA256 → **AES-GCM-256**, 16-byte random salt, fresh 12-byte IV on every
  save. The PIN is never stored, in any form.
* **The work factor is measured, not guessed.** On first use of the lock,
  `calibrate()` times one 150 000-round derivation on *this* device and picks the
  number of rounds that costs about **350 ms** — clamped to 900 000 max. A slow
  phone gets fewer rounds, a fast one gets more, so an offline attack costs about
  the same wall-clock time either way. The round count is stored in the blob
  (`iter`), so an old vault still opens with the old cost.
* **A short PIN is refused.** New PINs must be **6–8 digits** and must not be a
  run (`123456`), a repeat (`111111`, `121212`) or a year — anything scoring under
  40/100 is rejected with a reason, and the **Save button stays disabled** until the
  PIN in the box is acceptable. PINs from 1.5 are still accepted on unlock
  (4 digits), and while unlocking, the vault is **silently re-encrypted at the new
  work factor** so old vaults get stronger the first time they are opened.
* While the vault is unlocked the derived `CryptoKey` lives **in memory only**
  (`vaultPin` in `js/core.js`) — that is what lets `saveVault()` re-encrypt on
  every autosave.
* **The score is the real cost of guessing.** `pinSeconds()` = combinations ×
  measured cost per guess; the 0–100 score is `(log10(seconds) − 2) × 14`, so the
  form shows what it actually means rather than a made-up number:

  | PIN | score | shown |
  |---|---|---|
  | `1357` | 17 | ≈ 27 min of guessing — *refused* |
  | `111111` | 0 | ≈ 2 sec — *refused* |
  | `741905` | 45 | ≈ 2 days of guessing |
  | `48291736` | 74 | ≈ 7 months of guessing |

  (measured on the build machine, where calibration lands on the 900 000 cap;
  a mid-range phone will read roughly double those times because it cannot go
  past the same cap.)
* Three wrong tries start a 5 s cooldown that doubles to 60 s. That slows a person
  tapping at the phone — it cannot stop someone who copies `localStorage`, which
  is exactly why the keyspace and the per-guess cost are the real defence.
* The lock sheet, its toasts and its errors are in all four languages. Losing the
  PIN loses the details; the sheet and the About page both say so first.

## Data safety (1.6)

* **A save that fails says so.** `Store.set()` returns `false` when the write did
  not happen (almost always a full browser), and the caller has to handle it:
  `saveVault()` shows a red banner plus a "Not saved" toast instead of "Saved to
  this phone".
* **Backup.** Vault tab → *Save a backup file* writes
  `pusha-backup-YYYY-MM-DD.json` containing every `pusha_*` key. *Load a backup*
  validates the file, confirms, replaces everything and reloads. If a PIN is set
  the vault inside the file is the same ciphertext, so the file cannot be read
  without the PIN — the note under the buttons says which case you are in.
* **Undo** for the three destructive actions (CV section, own idea, cashbook
  line): the toast keeps a six-second Undo button.
* **Auto-lock**: off / 1 / 5 / 15 minutes. When the tab comes back after being
  hidden longer than the setting, the vault locks itself.

## The learning layer

Every idea answers "but I have no skill". It opens with:

* **the 3 things you must be able to do** (skills, not subjects);
* **free practice for this week** — do it at home, with what is in the house;
* **where to learn it** — links marked `VIDEO` / `PHOTO GUIDE` / `COURSE`, each tagged
  `ZERO-RATED` (uses no data, e.g. SA Youth) or `NEEDS DATA`.

Plus a **"No skill yet? Start here"** card on the Ideas tab with a 5-step method and the
free South African route (SA Youth, Harambee, NYDA, WeThinkCode_, Umuzi, CapaCiTi,
Digify Africa, Vodacom e-School, Second Chance Matric, NSFAS) and the free global
platforms (Google, Microsoft Learn, Khan, Siyavula, freeCodeCamp, Alison, Coursera,
HubSpot, Meta, iFixit). The Ideas filter has a **"No skill yet"** chip (14 of the 31 ideas).

Rules for that data:

* every URL must return a page — check before adding; YouTube links are *search*
  links on purpose so they never go dead when one video is pulled;
* all links open with `target="_blank" rel="noopener noreferrer"`;
* the app never depends on a link working: offline, the skills and the practice steps
  still teach the thing.

## The single-file build

Keep editing the split files — never `pusha-standalone.html` directly. Then:

```bash
cd app
node build-single-file.js
```

It inlines `styles.css`, `theme.js` and all ten `js/` files into
`pusha-standalone.html`, in the order `index.html` loads them, and fails loudly if
anything is left dangling, out of order, or mangled. **Never edit the standalone
file** — it is generated. Use the single file when you
need "one thing to send someone" — everything else, use the folder.

## Editing rules that matter

* **No emoji.** Icons are inline SVG from the sprite at the top of `index.html`
  (`#i-*` symbols, rendered with `ico()`).
* **Never restructure `nav.tabs`.** CSS restyling only; the labels are swapped
  by `data-i18n` spans.
* **Every user-facing string goes through `t()`** with a key in all four
  dictionaries — English is the fallback for anything missing.
* **Script order matters.** These are classic scripts sharing one global scope,
  not ES modules. `index.html` must list all ten in order, or something runs
  before it is defined. The build script checks the order for you.
* `I18N` must be declared **before** the first render call, and `t()` must be
  available at load time (`renderIdInfo()` runs during start-up).
* When the build runs, replacements use function replacers — a string
  replacement would turn `$$` into `$` and silently break the `$$` helper.

## Testing

`tests/check.js` (repo root) drives the real app in headless Chromium:
CV completeness → fix-jump, copy to clipboard, custom CV section surviving a
reload and printing, all four languages, persistence, and overflow at
320 px and 1280 px. It also drives the **desktop tier** at 1440 px and 1024 px:
the rail is full-height and starts at x = 0, the content clears it, the toolbar
shows the section name, a sheet is a centred 20 px-radius dialog rather than a
drawer, the idea list is 3-up then 2-up, the Save button is 200 px and not a bar —
and then shrinks back to 430 px to prove the bottom bar and the mobile padding
come back unchanged.

```bash
NODE_PATH=/tmp/node_modules node tests/check.js file:///home/user/app/index.html local
NODE_PATH=/tmp/node_modules node tests/check.js file:///home/user/app/pusha-standalone.html standalone
NODE_PATH=/tmp/node_modules node tests/check.js http://127.0.0.1:8000/app/index.html http
NODE_PATH=/tmp/node_modules node tests/learn.js file:///home/user/app/index.html learn
```

`tests/learn.js` proves the learning layer: the "no skill yet" sheet, the filter, and for
**all 31 ideas** that each has 3 skills, ≥3 practice steps and ≥2 live https links, in
English and in isiZulu.

`tests/features.js` (1.6) covers the newer surface, in a real browser:

```bash
NODE_PATH=/tmp/node_modules node tests/features.js file:///home/user/app/index.html local
NODE_PATH=/tmp/node_modules node tests/features.js file:///home/user/app/pusha-standalone.html standalone
NODE_PATH=/tmp/node_modules node tests/features.js http://127.0.0.1:8000/index.html http
```

It proves: search (and the empty state), the freshness line, the tap-target sweep
(0 violations, the deliberately small Copy button excepted) and contrast, the four
versions of each copy-paste block (4 distinct texts each, the Copy button handing
over the one on screen, the choice surviving a reload), backup
export → wipe → import, a backup taken with a PIN containing no readable name,
the storage-full banner and toast, Undo on a deleted cashbook line, share falling
back to the clipboard, the Esc/focus behaviour of sheets, photo add + remove, the
PIN and the auto-lock, and the About/feedback sheets. Expected: `"errors": []`.

Expected: every value as asserted listed, `"errors": []`.

## Photos in the make-and-sell section

Ten JPEGs in `img/` — one finished-object photo per project, 640 px, ~27 KB each,
274 KB in total. Editing source is `img/diy-<id>.jpg`; the list shows them as
thumbnails and the project sheet opens with one as a hero above the drawings.

The service worker caches all ten (`pusha-2.0.4`, 32 shell files), and
`build-single-file.js` inlines each one as a data URI in the baked file, so both
builds stay fully offline. Add a project and the build fails until its photo
exists — that is deliberate.

## Contact

Suggestions and bug reports go to the three channels wired into **Path → Spotted
a mistake? Tell us**: `tel:0722279505`, `https://wa.me/27722279505` and
`mailto:njwayelodlamini@gmail.com`. The
feedback sheet can send its report to WhatsApp or email, prefilled with the running
version, and only when that button is tapped. WhatsApp uses `openWhatsApp()` in
`core.js`: the `whatsapp://` app scheme on phones first, `wa.me` as the 1.3 s
fallback, and `wa.me` directly on a computer — the app itself still sends
nothing on its own.

## Typing rules for two vault fields

`tidyText(s, mode)` in `core.js`, applied on blur and on every save:

* **Best subjects** — every word capitalised (`maths lit` → `Maths Lit`).
* **Skills & certificates** — first word of each comma item only
  (`cutting hair, first aid` → `Cutting hair, First aid`).

It only ever raises a lowercase letter, so `NQF`, `IT`, `TVET` and `N4` survive;
it never runs while the person is typing (the caret stays put); and
`syncVaultFields()` applies it on the export path, so the CV, the detail sheet and
every copy block are clean even if the field was never left.
