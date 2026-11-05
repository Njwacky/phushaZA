# Pusha 1.5 — what is missing, and how it is scored

Written 4 November 2026, after an audit of the app as it actually runs
(`index.html`, the ten files in `js/`, and the baked `pusha-standalone.html`,
each opened in Chromium at a 390 px phone viewport).

Two things are scored in this document, and they are not the same thing:

1. **the PIN score a user sees** — how strong is the PIN protecting the vault (section 2);
2. **the backlog score** — which missing feature is worth building first (section 3).

No CV sections were added in this round. Nothing here proposes a second CV.

---

## 1. The vault PIN was not working at all. It is fixed now.

Before this round the app promised, in the About sheet, "your documents and
details, encrypted with a PIN if you want". Every path of that feature was
broken. Found by driving the real UI with Playwright, not by reading code.

| # | What happened | Evidence | Severity |
|---|---|---|---|
| 1 | **A new user could never set a PIN.** Tapping "Set a PIN" did nothing — the click handler was only attached when a PIN already existed. | `#pinVisible: false`, `#pinWrap display: none` after the tap; nothing written to `localStorage` | Critical — the feature did not exist for anyone |
| 2 | **Unlocking threw a crash.** `$("#setPin")` is null in unlock mode, so `lockSheet()` threw `Cannot read properties of null (reading 'addEventListener')` and the sheet never opened. | page error captured exactly as above; `#pin` never visible | Critical |
| 3 | **"Remove PIN" had no handler.** A dead button in the same sheet. | no listener anywhere in the source | High |
| 4 | **The first autosave after unlocking wrote plain text over the encrypted record.** `saveVault()` always stored the object; it never re-encrypted. One keystroke and the PIN was silently gone, with the app still claiming "locked". | reproduced: `enc:true` → type one character → `enc:false` | Critical — silent data exposure |
| 5 | **Locking left your details on the screen.** Lock only set `vault = {}`; `fillVault()` never clears fields, so the disabled inputs still showed name, ID, bank details. | `shown:"Sipho Dlamini"` while `disabled:true` | High |

All five are fixed in `js/path.js` (`lockSheet`, `lockNow`, `removePinSheet`,
`pinStrength`) plus `saveVault()` in `js/i18n.js`. What the lock does now:

* **Setting a PIN** opens the form immediately; the field takes digits only and
  scores the PIN as you type.
* **Unlocking** derives the key, puts it in memory, fills the fields, and
  re-renders the CV thumbnail and banner.
* **Every save while unlocked re-encrypts** with the key already in memory
  (`enc.encryptWith`), with a fresh 12-byte IV each time and the original salt.
* **Lock now** wipes the object, blanks every field, disables them and shows the
  "your vault is locked" gate.
* **Change PIN / Remove PIN** are reachable from the lock sheet; removing a PIN
  writes the record back as plain text *on purpose*, and says so before it does it.
* **Three wrong tries** start a cooldown of 5 s, doubling to 60 s.
* The sheet is in all four languages (see section 6 for what is still English).

Verified end to end on both `index.html` and `pusha-standalone.html`:
set PIN → edit a field → reload (locked) → wrong PIN refused → correct PIN →
edit again (still encrypted) → reload (still locked) → change PIN (old refused,
new works) → lock (fields blank) → remove PIN (plain, unlocked, survives reload).
**No page errors in any run.**

---

## 2. How the PIN is scored — the part users see

*(Rewritten in 1.7: the scoring now comes from measured work, not from a table of
opinions. Section 10 explains what changed and why.)*

The score is the honest cost of guessing the PIN:

```
combinations  = 10^digits   (10 for 111111, 20 for 123456, 100 for 121212)
cost per guess = measured ms on THIS phone × calibrated rounds
seconds       = combinations × cost per guess
score (0-100) = ( log10(seconds) - 2 ) × 14
```

The KDF work factor is calibrated on first use of the lock: one 150 000-round
PBKDF2 derivation is timed, and the round count is scaled so a single guess costs
about **350 ms**, capped at 900 000 rounds. A cheap phone therefore gets fewer
rounds and a fast one more, and the number shown to the user is the measured one,
not a guess.

**A new PIN must be 6–8 digits and must score at least 40.** Runs, repeats and
years are refused with a reason. What the form says, on the build machine:

| PIN | combinations | score | shown | saved? |
|---|---|---|---|---|
| `1357` | 10 000 | 17 | ≈ 27 min of guessing | **no** |
| `111111` | 10 | 0 | ≈ 2 sec of guessing | **no** |
| `123456` | 20 | 0 | a few seconds | **no** |
| `741905` | 1 000 000 | 45 | ≈ 2 days of guessing | yes |
| `48291736` | 100 000 000 | 74 | ≈ 7 months of guessing | yes |

Why a 4-digit PIN can never score well: 10 000 combinations is 10 000 guesses. At
the old 150 000 rounds a guess cost **28 ms** on this machine, so the whole vault
fell in **≈ 5 minutes**. At the calibrated 900 000 rounds a guess costs **168 ms**,
so the same 10 000 guesses take **≈ 28 minutes** — better, and still not something
to hand to a stranger. That is exactly why 1.7 refuses to save one.

## 3. How the rest of the backlog is scored

Every gap gets four numbers:

* **I — impact (1–5):** does it protect money, data or dignity?
* **R — reach (1–5):** what share of users hit it?
* **C — confidence (0–1):** how sure am I that the fix actually fixes it?
* **E — effort (days, 0.5–5):** including translation and testing, not just typing.

**Score = (I × R × C) ÷ E** — top score 50, practical cut-offs:

| Score | Meaning |
|---|---|
| 15+ | do it next; it is cheap and it protects something |
| 8–14 | worth a round of its own |
| 4–7 | when there is room |
| under 4 | leave it |

---

> **Status 4 November 2026 — all sixteen items below are closed in Pusha 1.6.**
> Section 9 lists what changed and the test that proves each one.

## 4. The gaps, ranked

| # | What is missing | I | R | C | E | Score |
|---|---|---|---|---|---|---|
| 1 | **Saved-but-not-saved.** `Store.set()` swallows every error. When `localStorage` is full (a 5 MB phone, or a few photos), the app still says "Saved to this phone" and the change is gone. | 5 | 3 | 1 | 0.5 | **30.0** |
| 2 | **No backup and no export.** One "clear browsing data" and the vault, cashbook, CV sections and own ideas are gone for ever. The app says this in About but gives no way out. | 5 | 5 | 1 | 2 | **12.5** |
| 3 | **No "save my CV as a PDF" guidance.** The CV prints correctly, but on a phone the route is *Print → Save as PDF*, and nothing says so. | 3 | 4 | 1 | 1 | **12.0** |
| 4 | **No freshness date on the numbers.** "Costs are 2026 estimates" is a claim with no date on the card. Each idea should carry "checked November 2026". | 3 | 5 | 1 | 1 | **15.0** |
| 5 | **No auto-lock.** If the vault is unlocked and the phone is passed around or the tab is left open, it stays open until the lock button is tapped. | 4 | 3 | 0.9 | 1 | **10.8** |
| 6 | **No share.** Every distribution story for this app is WhatsApp, but there is no share button for a CV summary or an idea. | 3 | 4 | 0.9 | 1 | **10.8** |
| 7 | **No undo.** Deleting a CV section, a cashbook line or your own idea is instant and final. | 3 | 3 | 1 | 1 | **9.0** |
| 8 | **Search.** 31 idea cards plus your own; finding "kettle" means scrolling. | 3 | 4 | 1 | 1.5 | **8.0** |
| 9 | **Lock sheet and photo errors are English only** — 16 `toast()` strings ("Saved to this phone", "Unlock the vault first", "That is not an image", "Could not read that photo", "Put in an amount first", "Deleted", …). Section 6 is the full list. | 3 | 5 | 1 | 2 | **7.5** |
| 10 | **No way to remove or retake your photo** — once added it is on the CV until the vault is cleared. | 2 | 3 | 1 | 0.5 | **12.0** |
| 11 | **No cashbook export** — totals and the 7-day chart exist, but the lines cannot leave the phone (a landlord or funder may ask). | 3 | 2 | 1 | 1 | **6.0** |
| 12 | **No install prompt.** Served over http(s) there is no `manifest`, so "add to home screen" is a browser menu, not a button. From `file://` it is irrelevant. | 3 | 4 | 0.8 | 1.5 | **6.4** |
| 13 | **No feedback channel.** About says "tell us and it gets fixed", but there is no address or button to tell anyone. | 2 | 2 | 1 | 0.5 | **8.0** |
| 14 | **Keyboard and screen-reader pass on the sheet** — no focus trap, no Esc, focus is not returned to the button that opened it. | 2 | 2 | 1 | 1.5 | **2.7** |
| 15 | **320 px tap-target and contrast sweep** — nothing overflows (tested), but small `.btn.xs` targets and muted-on-line text have not been measured. | 2 | 5 | 0.8 | 1 | **8.0** |
| 16 | **`research/learning-resources.md` is behind** — 18 verified links are live in the app but not written up in the research note. | 1 | 1 | 1 | 1 | **1.0** |

Two gaps that were on the list and are **not real** — checked before writing
them down: `<html lang>` already follows the chosen language
(`pack.js:151`), and the vault photo is already downscaled to a 300×300 JPEG
before it is stored, so it cannot blow the storage budget on its own.

---

## 5. The next five, with the test that proves each is done

1. **Make saving fail loudly** (score 30). `Store.set()` returns `true`/`false`;
   `saveVault()` shows a red banner "Phone storage is full — your last change was
   not saved" instead of "Saved to this phone".
   *Test:* fill `localStorage` to the quota in the harness, type one character,
   expect the banner and no success toast.
2. **Backup: export and import one file** (12.5). A "Save a backup" button writes
   `pusha-backup-2026-11-04.json` (encrypted if a PIN is set, with a clear warning
   that the file is the vault); "Load a backup" restores it after a confirmation.
   *Test:* export, clear storage, import, every field plus `cvExtra` and the
   photo comes back.
3. **Auto-lock** (10.8). Lock on `visibilitychange` after 5 minutes hidden, and
   offer a 1/5/15-minute setting that is off by default.
   *Test:* unlock, hide the tab for 5 minutes (clock-mocked), expect the gate.
4. **Freshness line** (15). "Prices checked November 2026 — confirm at your
   wholesaler before you spend" on every idea card and in About.
   *Test:* the string renders on all 31 ideas in all four languages, and the
   standalone build carries the same date.
5. **Share to WhatsApp** (10.8). One small button on the CV summary and on an
   idea, using `navigator.share` with a clipboard fallback.
   *Test:* the payload is plain text, contains no vault fields that are not
   already in the block being copied, and degrades to the copy button.

---

## 6. What is still in English, exactly

The lock sheet's buttons, headings and toasts are now in English, isiZulu,
Sesotho and isiNdebele (29 new strings in each of the four languages — 116 hand-written lines — verified by
opening the sheet in each language). What is **not** translated yet:

* 16 `toast()` messages and the photo-upload errors, spread across `i18n.js`, `money.js`, `misc.js`, `ideas.js` and `cv-checks.js`;
* the print footers and the CV document itself — deliberately: a South African
  CV goes to an employer in English;
* the long idea and learning explanations (already flagged in-app as English).

---

## 7. What I would not add, and why

* **Accounts, cloud sync, or "log in to restore"** — it ends "no account", it
  creates a database of children's ID numbers, and POPIA duties come with it.
  A backup file is the honest version.
* **More ideas, more languages, more tools** — 31 ideas with real costs and a
  learning path each is deeper than 60 with none. Depth is the product.
* **Fingerprint unlock** — not available from `file://`, and a promise the app
  cannot keep on half the phones it ships to.
* **A service worker for offline** — it does nothing from `file://`, and the app
  is already offline. A manifest for the http version is enough.
* **Machine translation to fill the last 16 strings** — the standing rule is
  hand-written or English, never machine output passed off as local language.

---

## 8. What was run

| Suite | Result |
|---|---|
| `tests/check.js` on `file:///…/index.html` | 7 missing chips, fix-jumps-to-field, custom section prints, 4 languages, no overflow at 320/1280, **0 errors** |
| `tests/check.js` on `file:///…/pusha-standalone.html` | same, **0 errors** |
| `tests/learn.js` on the standalone build | 31 cards, 14 zero-skill, `perIdea: []`, **0 errors** |
| PIN end-to-end (new, both builds) | 12 steps green, including the encrypted-survives-edit and change/remove paths, **0 errors** |
| PIN in 4 languages | Protect / unlock / options sheets render in en, zu, st, nr |
| Build | `node build-single-file.js` → 224.6 KB (CSS 24.5, JS 175.2), ten files in order |

---

## 9. What 1.6 closed, and how each one is proved

Every item below is now in `app/` and in `pusha-standalone.html`, proven by
`tests/features.js` (a new suite that drives the real UI) plus the existing
`tests/check.js` and `tests/learn.js`. Nothing here is a claim from a code read.

| # | Fixed | Proof |
|---|---|---|
| 1 | `Store.set()` returns `true`/`false`; `saveVault()`, the cashbook, own ideas, PIN settings and the backup all check it. A failed write shows a red banner *and* the toast says "Not saved — phone storage is full". | `features.js §quota` — with `localStorage.setItem` forced to throw: banner text = "Phone storage is full — your last change was not saved." and toast = "Not saved — phone storage is full" |
| 2 | **Backup**: "Save a backup file" downloads `pusha-backup-YYYY-MM-DD.json` (every `pusha_*` key); "Load a backup" validates the file, asks for confirmation, replaces everything and reloads. The note under the buttons tells the truth: encrypted if a PIN is set, plain if not. | `features.js §backup*` — export → wipe → import restores name and email; a backup taken with a PIN contains `"__enc":true` and no readable name |
| 3 | "On a phone: tap Print, then choose *Save as PDF*" sits directly above the print button in the CV sheet. | `features.js §cvSheet.pdfHint` |
| 4 | "Prices checked November 2026 — confirm at your wholesaler before you spend" on the Ideas tab and in About's Accuracy paragraph. | `features.js §freshness`, `§about.novemberAcc` |
| 5 | **Auto-lock**: Off / 1 / 5 / 15 minutes in the lock sheet; on return from a hidden tab it locks if you were away longer than the setting. Off by default. | `features.js §autoLock` — set to 1 minute, simulated 70 s away → fields disabled |
| 6 | **Share** on the CV, on every idea and on the cashbook, through `navigator.share` with the copy button as fallback. | `features.js §cashExport`, `§cvSheet.shareBtn` — headless Chromium has no `navigator.share`, the fallback clipboard holds the text |
| 7 | **Undo** on the "Deleted" toast for CV sections, own ideas and cashbook lines (6-second window). | `features.js §undo` — 1 line → delete → 0 → Undo → 1 |
| 8 | **Search** box at the top of Ideas; matches name, tag, unit and category; while searching the intro cards and the chips step aside so the first match is on screen. | `features.js §search` — "kota" → 1 card, "zzzznothing" → "Nothing matches that" |
| 9 | All 16 `toast()` strings and the photo errors now go through `t()` — 47 new keys × 4 languages, hand-written (188 strings). **Zero** hardcoded toasts remain (`grep 'toast("' js/*.js` returns nothing). | lock sheet, backup card, money tab and About opened in en / zu / st / nr |
| 10 | "Remove photo" button appears next to "Add photo" whenever a photo exists; removal takes it off the CV too. | `features.js §photo` — add → button visible → remove → gone, button hidden |
| 11 | "Copy my cashbook" builds plain text (totals + every line) and shares or copies it; each line can be deleted, with Undo. | `features.js §cashExport` |
| 12 | `manifest.webmanifest` + `icon.svg`, linked from `index.html`, so a served copy can be installed. The single-file build strips the link (no folder, nothing to install). | `curl` over http: index 200, manifest 200, icon 200; build asserts no `rel="manifest"` survives |
| 13 | "Tell us what is wrong" in About opens a report sheet pre-filled with version, language, screen size and date, and a Copy button. No invented email address — the report goes through whichever channel the user has. | `features.js §about.feedbackButton`, `§feedback` |
| 14 | Sheets trap Tab, close on Esc, focus the first control on open and return focus to the button that opened them. | `features.js §sheetKeyboard` — Esc closes, focus back on `openQuiz` |
| 15 | Tap targets: header buttons 44×44, buttons ≥44, small buttons ≥40, chips ≥40, delete dots 38. The deliberately-small **Copy** button keeps its 28 px look but gets a 44 px touch area from an invisible `::after`. Contrast: 4.68:1 to 16.77:1 on body text (AA passes at 4.5). | `features.js §tapTargets` — **0** violations after the sweep (the Copy button is the one documented exception), `§contrast` |
| 16 | `research/learning-resources.md` now documents the 18 new search links, each re-checked at **HTTP 200** on 4 November 2026, with the re-check command written down. | `curl` run in this session: 18/18 = 200 |

Two things I did **not** quietly ignore: the lock sheet and every new control are
translated, but the long explanatory paragraphs (why a PIN is scored, what a
backup contains, the feedback instructions) stay in English — that is the same
standing rule the app already states, and About says so in plain words.

### Size after 1.6

`node build-single-file.js` → **249.5 KB** (CSS 26.2 KB, JS 196.1 KB), ten scripts
in order, zero external references. The app is now 30 KB heavier than 1.5, and the
whole of that is backup, undo, search, share, auto-lock, the manifest hook and 140
new translated strings.

---

## 10. 1.7 — the PIN's real weakness, closed

The open caveat at the end of 1.6 was: *a 4-digit PIN still reads Weak · 26/100,
and 10 000 combinations at 28 ms a guess is about five minutes of work.* That was
honest, but honesty is not a fix. Four things changed, and none of them is a
label change.

**1. The keyspace floor is enforced.** A new PIN must be 6–8 digits **and** must
score ≥ 40/100. `111111`, `123456`, `121212`, a year, or anything too short is
refused with a reason instead of being accepted with a warning. The **Save button
also stays disabled** until the field holds a PIN that would pass, so the refusal
is visible before the tap rather than as a toast after it. The check runs before
anything is written, so a refused PIN leaves no half-encrypted vault.

**2. Every guess costs what it should cost on the device in front of you.**
`calibrate()` times a 150 000-round PBKDF2 derivation and scales the rounds to
about 350 ms per guess, clamped to 900 000. That is **6× the work of 1.5** on fast
hardware and more on hardware that was previously under-protected; on a slow phone
it settles below the cap and still costs ~350 ms. The round count travels with the
blob (`iter`), so nothing is unreadable — and an old vault is **silently
re-encrypted at the new cost** the first time it is unlocked.

**3. One stale save path was closed on the way through.** The CV share button
copied the fields into memory and shared them without ever writing the vault, so a
detail typed just before sharing existed only in RAM — and in a vault with a PIN the
disk copy stayed behind. It now calls `saveVault(true)`, the same guarded path the
rest of the app uses; the in-memory sync helper was renamed `syncVaultFields()` and
documented so it cannot be mistaken for a save again.

**4. The score stopped being an opinion.** It is now
`(log10(combinations × measured cost per guess) − 2) × 14`, and the form prints
the human version of that number: "≈ 2 days of guessing". A user no longer has to
trust a coloured bar; they can see the arithmetic.

### Before and after, same machine

| | 1.6 | 1.7 |
|---|---|---|
| cheapest key a user could save | `1111` | `741905`-class, 6 digits |
| rounds | 150 000 | 900 000 (calibrated) |
| cost per guess | 28 ms | 168 ms |
| full search of a 4-digit PIN | ≈ 5 minutes | ≈ 28 minutes (**and refused**) |
| full search of what can be saved | ≈ 5 minutes | ≈ 2 days (6 digits) → ≈ 7 months (8 digits) |
| what the number on screen means | a weighted opinion | measured work |

### What is still true, and stays in the app

* A 6-digit PIN is **Fair**, not strong. Two days of guessing stops a person who
  finds your phone; it does not stop somebody determined with a copied file. The
  form says "≈ 2 days", not "safe".
* The 3-try cooldown remains a speed bump against a person at the screen only.
* There is no recovery. Losing the PIN loses the vault — stated before a PIN is
  set, in all four languages.

### Proof

`tests/features.js §pinPolicy` (local, standalone and http):

```
fourDigits:  meter "Weak · 17/100 — ≈ 27 min of guessing"   stored: false
111111:      meter "Weak · 0/100 — ≈ 2 sec of guessing"     stored: false
741905:      meter "Fair · 45/100 — ≈ 2 days of guessing"   stored: true, iter 900000
```

A separate drive of the same build confirmed: an 8-digit PIN reads "Strong · 74/100
— ≈ 7 months"; a hand-built 1.5-era vault (150 000 rounds, 4-digit PIN) still
unlocks, is upgraded to 900 000 rounds in place, and the same 4-digit PIN keeps
working afterwards; change-PIN, remove-PIN, auto-lock and the cooldown all behave.
Dictionary parity is now 251/251 in all four languages.

---

## 11. 1.8 — the app on a computer

The complaint was exact: *"if someone is using this app via a computer, that is not
a good way of navbar in the bottom — it's only better for a mobile."* It was true.
The layout was a 620 px column with a bar bolted to the bottom of a 1440 px screen,
where a mouse never goes, and every sheet slid up from an edge nobody was near. The
app's whole promise is offline, no-account, on whatever device is in the house — so
a borrowed library PC was getting the worst version of it.

There is still **one page and one file**. The fix is one `@media (min-width: 900px)`
block in `styles.css`, one `.navbrand`/`.navfoot` in the markup, one `#pageTitle`,
and four `.half` class names:

| | before 1.8 | 1.8 on a computer |
|---|---|---|
| navigation | fixed bottom bar, stretched across 1440 px | full-height left rail, icon + label per row, brand on top |
| where the eye starts | brand in the header | the section name, as a small eyebrow in the toolbar |
| a sheet | drawer from the bottom, 620 px of a 1440 px screen | 640 px dialog, centred over the content, 20 px radius, no grab handle |
| the idea list | one long column | 2-up from 1024 px, 3-up from 1240 px |
| vault | 4 stacked cards, full width | school + banking side by side; the long personal form keeps the width |
| money / path | stacked, lines up to 950 px long | short cards paired, so the reading measure stays sane |
| primary buttons | full-width bars | content width — *Save my details* is 200 px, *Add to cashbook* likewise |
| toast | bottom, centred on the viewport | bottom, centred over the content, clear of the rail |

What deliberately did **not** change: the phone layout (still one column, bottom
bar, full-height sheets — all asserted back at 430 px in the same run), the file
count, the script order, and anything that touches storage, the PIN or the data.
No new dependency, no second page, no second CV template.

### Proof

`tests/check.js §C` (local, standalone and http), at 1440 px:

```
nav      { x: 0, y: 0, w: 252, h: 900 }   railIsTall: true
app      { x: 326, w: 1040 }              contentClearOfRail: true
body     padding-bottom: 0px              overflow: 0
titles   pack → Pack, ideas → Ideas, money → Money, path → Path, vault → Vault
sheet    radius 20px, 63px of screen below it, centredOnContent: true
ideas    3 per row at 1440, 2 at 1024, 1 at 430
#saveVault 200px wide at 1024
phone430   navAtBottom: true, padding-bottom 78px, padding-left 0, title hidden
```

`tests/features.js` on all three builds afterwards: `"errors": []`, tap targets
under 40 px = 0, dictionary parity 250/250 in all four languages, About reads
`Pusha 1.8`. Screenshots: `check.js` writes `local-pc-ideas.png`,
`local-pc-sheet.png` and `local-phone-after-desktop.png`.

---

## 12. 1.9 — four voices for the four blocks, and one stray line removed

Two complaints, one sentence each:

> *"I need at least 4 diff temps on short intro, cv summary, business pitch,
> funding motivation, if someone doesn't like this one."*
> *"Remove that [nav offline] — looks like a bug or you were doing something."*

**The blocks were one voice each.** That is a real design failure for this audience:
a matric leaver who has never written a motivation letter, and a young hairdresser
with three years of customers, cannot send the same paragraph. Worse, the single
version read like a form — `My business: (name it — e.g. Thabo's Kotas)` — which is
fine to *fill in* and terrible to *copy*. Someone who disliked the tone had nothing
to switch to.

Each block now has four hand-written versions (16 texts in total), chosen by number
under the preview and remembered per block:

| block | v1 | v2 | v3 | v4 |
|---|---|---|---|---|
| Short intro | plain, formal | WhatsApp length | skills first | two sentences |
| CV summary | profile first | skills first | results + study plans | honest no-experience |
| Business pitch | line-by-line prompts | 30-second spoken | problem → proof → ask | numbers only |
| Funding motivation | 5-section letter | short, word-limited | budget first | what I have proved |

What stays honest: every version is built from the vault, and an empty field shows
as `[a bracket]` rather than a flattering guess. The app does not tell a
19-year-old with no job that they have "5 years' experience" because the text is
nicer that way.

**The rail line.** `nav_offline` ("No account, no server. Works offline.") sat at
the bottom of the desktop rail, stranded by `margin-top:auto` under five menu items.
It reads as a rendering bug, not as information — the sentence already appears in
the Vault lede, the hero chips and the About sheet. Removed: the `.navfoot` element,
its CSS rule and its key in all four dictionaries. Dictionary parity is exact again
(251 keys × 4, no leftovers in either direction — the test checks missing *and*
extra).

### Proof

`tests/features.js §13b` (local, standalone and http):

```
blockVariants  intro 4 distinct · cv 4 · pitch 4 · fund 4
               shortest / longest: 176/352, 395/491, 269/540, 657/867 characters
copyUsesSelected  true      (the button hands over the version on screen)
blockVariantsPersist true   (pusha_blockvar survives a reload)
railHasNoFooter  0          (no .navfoot anywhere)
i18nParity        251 / 251 / 251 / 251, 0 missing, 0 extra
```

Also driven by hand: 4 chips per block, every version distinct, the preview label
reads e.g. *"Business pitch · edit it before you send"*, the chips are 40 px, and
the mobile layout still collapses to one column with the bottom bar (all the 1.8
desktop/phone assertions still pass unchanged).

---

## 13. 2.0 — human error, and the one real hole

The brief was two words: *"human error handling and vulnerabilities."* Both turned
out to be about the same thing — **text that came from outside the code and was
treated as markup.**

### The vulnerability (real, and reachable)

Every list in the app was built with `innerHTML`. A user typing
`<img src=x onerror=…>` into a name only attacked themselves — but a **backup
file** is designed to be shared, and `backupLoad()` wrote whatever keys arrived.
So: send a friend a "Pusha backup" → they load it → a name containing a script
runs on the next render → it can read `localStorage` (every detail they have) and
POST it anywhere the moment they are online. On an app whose promise is "nothing
leaves your phone", that is the worst possible hole. The import path also
accepted foreign keys, `__proto__`, unbounded size, and replaced everything after a
`window.confirm` that a sandboxed preview blocks silently.

| # | hole | before | 2.0 |
|---|---|---|---|
| 1 | script in any text field | ran as code | `esc()` at every sink — 26 call sites |
| 2 | "photo" pointing at a server | fetched on render/print | `safePhoto()`: raster data URLs only |
| 3 | shared backup file | any keys, any size, any script | `pusha_*` only, no `__proto__`, ≤4 MB, else refused |
| 4 | replacing the phone's data | `window.confirm` (blocked in previews) | in-app sheet: *Download mine first* / *Replace* / *Cancel* |
| 5 | `iter` in an encrypted blob | trusted | clamped to 150 000–900 000 |

### Human error (the mistakes people actually make)

* **A PIN is now typed twice.** It is the only value in the app that cannot be
  recovered from: one wrong digit and the vault is gone forever. A mismatch
  disables the button *and* is refused in the click path.
* **Money is parsed, not coerced.** `+value` turned `R1 200,50` into `NaN` → `0`,
  so a real sale quietly vanished. `parseMoney()` reads `R`, spaces, `,` and `.`
  correctly and refuses rubbish with a sentence.
* **The same line twice** (a double tap, or the same sale entered again) is
  caught within 4 s.
* **Quiet warnings** on an email with no `@` and a phone number with letters —
  they inform, they never block.
* Undo already existed for a deleted cashbook line and a deleted CV section; the
  photo removal now matches them.

### Two bugs found on the way (both pre-existing)

* **Your own idea was half-broken.** The detail sheet attached a listener to
  `#shareIdea`, a button the "own idea" layout did not have, so opening your own
  idea threw a `TypeError` and every control after that point — Edit, Close —
  was dead. Own ideas now have the Share button the code expected, and every
  listener on that sheet is guarded (`on()` helper) so one missing button can
  never kill the rest.
* Attribute injection through saved ideas: `data-id="${id}"` and `class="${cat}"`
  were never escaped, so a backup file could put `onmouseover=` on a card.
  `cleanIdea()` slugs the id and whitelists the category, and both are escaped at
  render. A hostile payload now produces a card with exactly three attributes:
  `class`, `data-id`, `style`.

### Proof — `tests/features.js` §13c/§13d/§13e, all three builds

```
ownIdea        create → sheet opens with Close/Edit/Share → edit → delete → Undo = 1
               (no page errors: this used to throw)
inputSafety    executed: false · cvEscaped: true · printEscaped: true
               remotePhotoDropped: true · svgPhotoDropped: true
backupSanitised keysKept ["pusha_vault"] · foreignKeyDropped · protoDropped
               rejectsNonPusha · rejectsGarbage
pinDoubleEntry secondBox · mismatchBlocked · matchesUnblock
pinTypoRefused encrypted: false · toast "Those two PINs are not the same…"
moneyTyping    R1 200,50 → 1200.5 · typo refused · duplicate dropped
contactHints   warns on both, clears on both
tampered iter  999 999 999 → 169 ms (clamped), vault still opens
i18nParity     261/261/261/261, 0 missing, 0 extra
errors         [] on local, standalone and http
```

Standalone: 278.0 KB. Version 2.0 in the About sheet, with both changes written
in plain words there rather than only in this file.

---

## 14. 2.0 — an icon, and made installable

### The icon

There was no real icon — only a data-URI SVG in `index.html` with a text "P"
rendered in whatever font the phone had, and a 371-byte `icon.svg` that nothing
referenced by a standard size. A person who added Pusha to their home screen got a
blurry letter.

Now the mark is **drawn once** in `icons/make-svg.js` (letter geometry + one gold
mark) and every size is generated from it: 32 px favicon, 180 px Apple touch icon,
192/512 px for the install prompt, and **maskable** versions with the artwork
pulled inside the 80 % safe circle Android crops to. The same mark is used in the
app's own header (`#i-logo` in the SVG sprite), so the tile at the top left and
the icon on the home screen are visibly the same thing.

### Installable (and honest about which kind of "app")

| piece | what it does |
|---|---|
| `manifest.webmanifest` | name, `short_name`, standalone display, theme `#0b5c46`, background `#f7f5ef`, six icons (3 × any, 3 × maskable) |
| `sw.js` | caches the app's own 18 files, versioned `pusha-2.0.0`; same-origin GETs only |
| navigation requests | **network-first** — a new version is picked up when online, the stored copy when not |
| asset requests | cache-first, refreshed in the background |
| `js/core.js` §1c | registers the worker, but only when `location.protocol` is http(s), so a downloaded file never tries and never errors |
| `index.html` | `apple-touch-icon`, `apple-mobile-web-app-capable`, `mobile-web-app-capable` for iPhone |
| About sheet | plain words on the difference between the installed app and the single file, and the exact taps on Android and iPhone |

Two things this deliberately does **not** do: it does not cache anything
cross-origin (a learning link is never touched until a person taps it), and it does
not claim the installed app is required — the single file remains the answer when
there is no data to install from.

### Proof — `tests/features.js` §13f (http only; on `file://` it records why it skipped)

```
pwa.registered        true      scope http://127.0.0.1:8000/
pwa.cache             ['pusha-2.0.0'], 18 files, shell present
pwa.manifest          standalone · #0b5c46 · png 192+512 · maskable · all icons 200
pwa.offline (network cut, full reload)
                      booted true · 31 idea cards · typing accepted
```

### The mark that could disappear

The user's report — *"light mode letter P is not showing"* — pointed at a real
fragility rather than a single pixel. The in-app tile was drawn with
`background:var(--brand); color:var(--on-brand)`, and those two variables **swap
in dark mode** (deep green + cream becomes mint + near-black). So the mark beside
the word "Pusha" changed colour with the theme, no longer matched the icon on the
home screen, and in a high-contrast (forced-colours) setting the tile and the
letter could both be repainted into the same colour — a letter that is there in
the DOM and invisible on the screen.

Fixed three ways, each one testable:

1. **Fixed colours, not theme variables.** `.logo` is `#0b5c46` / `#f7f5ef` in
   both themes — the icon's own colours — and the symbol's paths carry explicit
   fills so no inherited `fill` can blank the letter.
2. **`forced-color-adjust:none`** on the tile, so Windows high-contrast keeps the
   green, cream and gold instead of repainting them.
3. **A 16 px favicon drawn by hand.** At that size the full mark's bars and
   arrowhead turn to mush and the letter stops reading; the tab icon is now a
   bolder letter (16 px) and letter + two bars (32 px), not the big icon shrunk.

`tests/features.js` §13g asserts the computed colours in **both** themes and that
they are identical, so a future edit that reintroduces `var(--brand)` there fails
the suite instead of shipping an invisible letter.

```
mark.light / mark.dark   tile rgb(11,92,70) · letter rgb(247,245,239) · bar rgb(200,137,31)
mark.sameInBoth          true
mark.letterCream         true
mark.onIcon              36 x 36
pwa.manifest.favicons    [200, 200, 200]
```

The three earlier icon options were temporary review pages (`icon-choices*.html`)
and have been deleted; the chosen drawing lives in `icons/` and no review files
are part of the app.

---

## 15. 2.0 — the field nobody knew they could pull

**The report:** *"in the Skills & certificates field, bottom right corner there's
two lines that show you can drag to adjust the field; some people don't know that
— put a ring in there that hovers over it with info text, they read it and press
Got it."*

The corner they had noticed is the browser's native resize grip
(`textarea{resize:vertical}`). Two problems with relying on it:

1. **It is not a promise the phone keeps.** Several mobile browsers draw nothing
   there, so the same app teaches one person a gesture and leaves the next with a
   box they cannot enlarge.
2. **It is unexplained.** A grey triangle in a corner is a convention, not a
   label — exactly the kind of quiet UI this app is supposed to avoid.

### What was built

* **A real grip, in the app's own hands** — 44 × 44, three diagonal lines on a soft
  amber pill, pinned to the corner of the Skills box. It pulls with one finger
  between 74 px and 340 px, sets `touch-action:none` so the pull never turns into
  a page scroll, and stores the height (`pusha_skills_h`) so the box stays the
  size the person chose.
* **One explanation, on demand** — the first time it shows, a breathing ring
  (accent, 2 s, off under `prefers-reduced-motion`) marks it. Tapping the grip
  opens the normal bottom sheet with a plain sentence and a single **Got it**
  button. After that the ring is gone for good (`pusha_tip_resize`), and the grip
  stays as a quiet, working control.
* **It never blocks anything.** Nothing is modal on arrival, nothing is required
  to save your details, and there is no second nag.
* **Four languages, hand-written** — `grip_title`, `grip_body`, `grip_gotit`,
  `grip_aria` in English, isiZulu, Sesotho and isiNdebele (265 keys each).
  `applyLang()` learned `data-i18n-aria` along the way, so the button's label is
  translated too.
* **Keyboard and screen reader** — a real `<button>`, Tab-reachable, Enter/Space
  opens the same note; the ring is decoration, not the control.

### Proof — `tests/features.js` §13h (passes on local, standalone and http)

```
skillsGrip.first   there true · ring true · 44 x 44 · aria "How to make this box bigger"
skillsGrip.sheet   open true · title true · body "The little lines in the corner…" · "Got it"
skillsGrip.learned ring gone · pusha_tip_resize = 1
skillsGrip.dragged 74 px → 154 px · stored 154 · same after reload
i18nParity         265 / 265 / 265 / 265
tapTargets         every control ≥ 40 px (0 offenders)
errors             [] on local, standalone and http
```

Screenshots checked by hand: the pill in the corner at rest, the pulsing ring on
first visit, the taller box, and the sheet in place on a 390 px phone.

---

## 16. 2.0 — ten things you can make, for the people who will not study

**The ask:** *"Some people have money but do not want to study, and some have no
money — help them start DIY projects. This one needs pictures, because the app
will be teaching them."* The four reference pictures were a hand-drawn light
bulb, a black tassel wall hanging, copper-wire geometric lamps, and a resin
printer: handmade things with a look, not a course.

### What was built

A second door inside **Ideas** — *Make it yourself, then sell it* — with ten
projects that need no training, no machine and no studio, ordered by how little
they cost to start:

| project | to start | sells for |
|---|---|---|
| Paper-bead jewellery | R30 | R60–R140 |
| Salt-dough ornaments & keyrings | R52 | R25–R60 |
| String art on a board | R77 | R150–R300 |
| Hand-lettered quote cards | R80 | R80–R200 |
| Beaded keyrings & phone charms | R100 | R35–R75 |
| Tassel wall hanging | R100 | R250–R450 |
| Cement planters | R132 | R80–R180 |
| Copper-wire name art | R145 | R120–R280 |
| Melt-and-pour soap bars | R155 | R25–R45 |
| Scented candles in tins | R175 | R60–R120 |

Each opens with: three pictures, **what you need** with prices (and the total
added up for you), **six steps in order**, **who buys it**, **what goes wrong**,
and a **be careful** line where it matters (cement dust, hot wax, wire ends).
There is a *copy the shopping list* button, because the first thing anybody does
is send that list to the person who will buy with them.

### Three decisions worth recording

1. **Pictures are drawn, not downloaded.** 30 SVG panels, 40 KB in total, in
   `js/diy-art.js`. Photos would have meant either a 2–3 MB single file or a
   remote fetch — and this app's whole promise is that it works with the data off
   and never loads anything from a server. The test asserts no `http` in a
   project sheet.
2. **The teaching text stays in English, and says so** — same honesty rule as the
   learn layer. The labels (*What you need*, *Sells for*, *Who buys it*) are
   hand-written in all four languages: 21 new keys, 286 per language.
3. **Prices are estimates, labelled as November 2026**, and the sheet pushes the
   person to check at their own shop. No invented "you will make R10 000".

### Proof — `tests/features.js` §13i (local, standalone and http)

```
diy.card    there · "Show me the 10 projects" · 40 px
diy.list    10 rows · 10 thumbnails · none under 48 px
            "R30 to start · sells R60–R140", "R145 to start · sells R120–R280", …
diy.one     3 pictures · captions What you need / The main move / Finished
            4 shopping lines · 6 steps · 5 sections · copy + back buttons · remote false
diy.data    10 projects · every one 3 drawings, 4+ items, 6 steps · ids unique
i18n        286 / 286 / 286 / 286
errors      [] · overflow 0 at 320 px and 1440 px · every tap target ≥ 40 px
```

Standalone rebuilt: **330.4 KB** (art adds 40 KB). Service-worker cache bumped to
`pusha-2.0.3` so installed copies get the new files.

---

# §17 · Feedback round: real photos, and headings that stop eating space

Two corrections, both from using the app:

> "try to get a real picture on some point bcs sometimes your drawings are not
> good or create a real pictures, to show it looks like … also the title called
> NO SKILL YET? START HERE, there is a subheading that eating too much space …
> remove all sub heading replace with an icon of a person who put a brick on a
> foundation, meaning start here, do it across the app, i hate long heading"

## 1. Ten real photos, one per project

The drawings were doing two jobs: teaching the steps, and showing what the
finished thing looks like. They are good at the first and unreliable at the
second, so the second job now belongs to a photograph.

* `app/img/diy-<id>.jpg` — one photo per project, 640 px wide, JPEG q68, stripped.
  **274 KB for all ten** (~27 KB each). Daylight, plain surface, finished object,
  no hands, no logos, no readable brand text.
* `DIY_PHOTO` in `js/diy.js` is a plain table of paths, so the single-file build
  can find and replace every one: `build-single-file.js` swaps each path for a
  `data:image/jpeg;base64,…` URI and **fails the build** if any `img/diy-` path
  survives. Data URIs are not network requests, so the "nothing is fetched"
  promise and the `remote: false` assertion both still hold.
* The list uses the photo as its thumbnail; the project sheet opens with the
  photo as a full-width hero, captioned *"Yours will look a little different —
  that is normal."* The two teaching drawings stay below it, marked *What you
  need* and *The main move*. `diy_pic3` / "Finished" is gone — the photo is the
  finished shot now.
* Service worker: cache bumped to `pusha-2.0.4`, and the ten JPEGs are added to
  the shell (**32 files**), so the photos are there with the data off after the
  first visit.

**Cost of the honesty:** the single file went from 330.4 KB to **686.8 KB**.
That is still one WhatsApp message, and still smaller than a single phone photo
of the same object — but it is the price of a photo-led app that works offline,
and it is stated here rather than hidden.

## 2. Headings: one short line, then an icon

The rule the person actually wants: **no paragraph between a title and the
thing itself.** Applied across the app.

| was | now |
|-----|-----|
| `h1` + a two-line `p.lede` on every tab | `h1` + the start mark, nothing under it |
| 4 big idea cards: title + 2-line description + button | 4 icon tiles: **Match me · Start here · My own idea · Make & sell** |
| "Used on your CV and detail sheet. Stays on this phone." | "On your CV and detail sheet." |
| "Four versions. Pick the one that sounds like you — you can switch any time." | "Pick the one that sounds like you." |
| "Prices checked November 2026 — confirm at your wholesaler before you spend." | "Prices: November 2026 — confirm before you spend." |
| detail sheet: title + tagline paragraph | title + the start mark |
| project list: taglines ending in "…" | ten tags rewritten to one line ("Old magazines into jewellery") |

The mark is a new sprite symbol, `#i-foundation`: a person standing at a partly
built wall, one hand on the brick that is going down on the course below. It sits
at 19 px, brand green, 62 % opacity, next to a title — a "start here" mark, not
decoration. Comparison page with the three rejected variants:
`/home/user/icons/foundation-compare.html`.

Twelve sub-heading keys were deleted from all four dictionaries rather than left
to rot (`v_lede`, `v_lede2`, `p_lede`, `p_lede2`, `i_lede`, `m_lede`, `pa_lede`,
`cv_desc`, `id_desc`, `docs_desc`, `m_goaldesc`, `lrn_start_lede`), plus the dead
`i_match_title` / `i_zero_*` / `i_own_title` / `diy_card_*` card copy. Two facts
worth keeping became small grey pills instead of sentences: *A4 · about R2 at a
library* and *Tick what you have*.

The learn sheet keeps the exact title asked for — **NO SKILL YET? START HERE** —
in all four languages, with nothing underneath it:

```
en  NO SKILL YET? START HERE
zu  AWUKABI YIKHONO? QALA LAPHA
st  HA O NA BOKGONI? QALA MONA
nr  AWUKABI NAKGHONO? QALA LAPHA
```

## Proof — `tests/features.js` §13i + §13j (local, standalone and http)

```
diy.card    there · "Make & sell" · 90 px · sparkle icon
diy.list    10 rows · 10 photos loaded · 0 rows under 48 px · 10/10 tags on one line
            photoKind: "http:" (served) / "data:" (single file)
diy.one     hero photo true · caption "Yours will look a little diffe…"
            noTagline true · 2 drawings · 4 shopping lines · 6 steps · remote false
diy.data    10 projects · bad [] · ids unique · art 40 169 bytes
heads       vault/pack/ideas/money/path: h1 in .h1row, marked, ledes 0
            allLedes 0 · learn.title "NO SKILL YET? START HERE" · nothing under it
i18n        274 / 274 / 274 / 274
errors      [] · overflow 0 at 320 / 1280 / 1440 px · tap targets ≥ 40 px
pwa         cache pusha-2.0.4 · 32 entries · boots offline with 31 idea cards
```

Standalone rebuilt: **686.8 KB** (css 35.1 KB, js 259.0 KB, photos ≈ 366 KB of
base64). No `img/` path and no `http` reference survives inside it.

---

# §18 · "Who do I tell when something is wrong?"

Pusha had a feedback sheet that copied a report and told the person to hand it to
whoever gave them the app. That is a dead end for a stranger who finds it through
a shared link. There are now two real addresses, supplied by the person running
the project:

* **072 227 9505** — call, SMS or WhatsApp
* **njwayelodlamini@gmail.com**

## What shipped

* A **contact card on Path**, under *About this app*: three rows — `tel:`,
  `https://wa.me/27722279505` and `mailto:` — each 66 px tall, so they clear the
  40 px tap rule with room for a thumb. WhatsApp first, because that is where a
  South African will actually send a voice note about a wrong price.
  Title *"Spotted a mistake? Tell us"*, and under it one short line that keeps the
  promise intact: **"Free to message. Nothing is sent unless you tap."**
* The **feedback sheet** can now send the report instead of only copying it:
  **Send on WhatsApp** (report prefilled into the message) or **Send it by email**
  (version in the subject, report in the body). Both fire only on that tap; Copy
  stays for phones with no WhatsApp or mail app.
* The *Version* line in the About card used to be a hard-coded "2.0". It now reads
  `PUSHA_VERSION`, so the number on screen cannot drift from the number in the
  file again.

## The honesty problem, stated rather than hidden

The number first arrived as **nine digits** (072 279 505). South African mobiles
are ten, so the app showed exactly what it was given rather than inventing a digit —
a wrong number that looks right is worse than one that is visibly short. The full
number came back as **072 227 9505** and is now in the `tel:` link, the WhatsApp
link (international form, `27722279505`) and the printed value. The check asserts
the dialled number is exactly **10 digits**, so a short number cannot ship again.

## A real bug this round caught, and the guard against it

While adding the keys, an edit merged two dictionary keys into one —
`lock_protelock_unlock_title` — so `t("lock_unlock_title")` would have printed the
raw key name on the vault-lock screen. Nothing in the old suite could see that: the
page did not throw, and the four languages still had identical counts.

`tests/check.js` now scans every `.js` file and `index.html` for the keys the code
actually asks for (`t("…")`, `t(["…"])`, `data-i18n*`) and asserts:

```
i18nKeys  keys 281 · referenced 242 · missing [] · parityBroken []
```

## Proof — all nine runs (check · learn · features × local · standalone · http)

```
i18nKeys  281 keys · 0 referenced-but-missing · 0 parity breaks
contact   3 rows · tel:0722279505 (10 digits) · wa.me/27722279505 ·
          mailto:njwayelodlamini@gmail.com · tap 66 px · version 2.3
diy       10 photos · http: / file: / data: per build
heads     ledes 0 · learn title unchanged
pwa       cache pusha-2.3.0 · 32 entries · boots offline
errors    [] everywhere · overflow 0 at 320 and 1280 px
```

Version **2.3**, cache `pusha-2.3.0`, standalone **691.4 KB**.

## §18a · WhatsApp opens the app, not a web page

The row used `wa.me` only, which on a phone with WhatsApp installed still routes
through a web page first — a slow, wrong-feeling detour for the one channel most
people will actually use.

`openWhatsApp(text)` in `core.js` now does the sensible thing:

1. **On a phone** it assigns `whatsapp://send?phone=27722279505[&text=…]`. If
   WhatsApp is installed it takes over immediately.
2. If the page is still visible 1.3 s later (nothing took over — no WhatsApp, or a
   browser that blocks the scheme) it falls back to `https://wa.me/…`.
3. **On a computer** it goes straight to `wa.me` in a new tab; desktop machines
   have no WhatsApp app handler and the scheme would just do nothing.

Both the Path row and *Send on WhatsApp* in the feedback sheet go through the same
function, so a report is carried into the message either way.

Measured in the standalone with a phone user-agent and no WhatsApp installed:

```
tap → whatsapp://send?phone=27722279505          (attempted first)
    → https://wa.me/27722279505                  (fallback, 1.3 s later)
    → api.whatsapp.com/send/?phone=27722279505   (WhatsApp Web takes over)
desktop tap → new tab: api.whatsapp.com/send/?phone=27722279505 (app untouched)
report tap  → whatsapp://send?phone=27722279505&text=Pusha 2.4 — report…
errors      → []
```

`tests/check.js` now asserts the row carries `data-app="whatsapp://send?phone=…"`
as well as the `wa.me` href, so the app-first behaviour cannot be dropped by a
later edit without a red test.

Version **2.4**, cache `pusha-2.4.0`, standalone **692.7 KB**.

---

# §19 · Two fields that people type in a hurry

> "on subjects make sure all words are capitalized, on skills and certificates,
> first word must be capitalized, before the comma"

Two different rules, because the two fields are different things:

| field | rule | example |
|---|---|---|
| **Best subjects** | every word capitalised | `maths lit, business studies` → **Maths Lit, Business Studies** |
| **Skills & certificates** | first word of each comma item only | `cutting hair, first aid` → **Cutting hair, First aid** |

`tidyText(s, mode)` in `core.js` does the work, and it is deliberately careful:

* **Nothing is lowercased.** Only a lowercase letter is raised, so `NQF`, `IT`,
  `TVET`, `N4` and `Code 8` come out exactly as typed instead of being mangled
  into `Nqf`, `It`, `Tvet`.
* **Hyphens and slashes count as word starts** in the subject rule:
  `life-orientation, business studies/accounting` → *Life-Orientation, Business
  Studies/Accounting*.
* **Spacing is normalised** on the way through: `maths ,science` → *Maths,
  Science*; runs of commas collapse; line breaks in the skills box are kept and
  each line is treated as a list of its own.
* **It never runs mid-keystroke.** Moving the caret while someone types is worse
  than untidy text, so it fires when the field is left (`change`) and inside
  `saveVault`. `syncVaultFields()` — the path used by the CV, the detail sheet,
  print and every copy block — tidies the vault values as well, so an export is
  clean even if the person never leaves the field.
* **Old saves are cleaned too.** `fillVault()` tidies whatever is already stored,
  so a vault filled in months of lowercase displays properly from the next open.

The skills placeholder was rewritten to model the rule:
`Cooking, Driving, Sewing, Computer basics, First aid…`

## Proof — `tests/features.js` §13k, on all three targets

```
units    "maths lit, physical science"        -> "Maths Lit, Physical Science"
         "cutting hair, doing nails, first aid"-> "Cutting hair, Doing nails, First aid"
         "NQF level 3, IT, TVET college"       -> "NQF level 3, IT, TVET college"
         "n4 business management, life-orientation" -> "N4 Business Management, Life-Orientation"
         "  maths ,science  "                  -> "Maths, Science"
field    subjects "maths lit, business studies ,  english" -> "Maths Lit, Business Studies, English"
         skills   "gas stove cooking, cash handling, first aid" -> "Gas stove cooking, Cash handling, First aid"
stored   the same two strings in localStorage
export   the CV / copy-block path reads exactly what the field shows
errors   [] on local, standalone and http
```

Version **2.5**, cache `pusha-2.5.0`, standalone **694.5 KB**.

---

# §20 · Deployment: the three promises, on the record

A checklist is only worth something if a machine can fail it. `tests/deploy.js` drives
two throwaway browser profiles through a real install, a real browser restart and a
real network cut, and prints 25 named checks.

**What it found the app was not doing:** one thing. The vault could be evicted under
storage pressure without anyone asking the browser to protect it. The app now calls
`navigator.storage.persist()` once, silently, on Chrome/Edge/Android (Firefox is
skipped because it shows a permission bar; Safari decides by heuristic without a
prompt). In the sandbox the request was made and **refused** — which is the honest
state of it: a mitigation, not a guarantee. The guarantee is still *Vault → Save a
backup*.

**What it confirmed, with numbers:** Chromium's own installer reports `[]` errors; the
worker is activated and precaches 35 entries; with the network off the app boots with
31 ideas, 5 views, the vault readable and 10/10 project photos; after closing the
browser entirely, 5/5 storage keys come back identical, including the chosen language
(`zu`), the dark theme, a R35 cashbook line, and a vault that is still PIN-locked with
no plaintext name on disk and opens with the right PIN.

**The risk that is not a bug, and cannot be fixed in code:** on iPhone in a Safari
tab, WebKit deletes localStorage and the worker's caches after seven days of Safari
use without visiting the site. Home Screen web apps are exempt. That makes *Add to
Home Screen* a data-durability feature on iOS, not a nicety — and it is the reason
the deployment page tells you to test that path by hand. An iOS-only one-time hint is
offered as the next change, not smuggled in.

Version **2.6**, cache `pusha-2.6.0`, standalone **695.2 KB**, 9/9 suite runs green,
25/25 deploy checks green, 16/16 on the single file.

---

# §21 · The iPhone week

The deployment pass left one hole that no amount of code quality fixes: on iOS, in a
Safari tab, WebKit deletes a site's script-writable storage — the vault, the cashbook,
the lot — after seven days of Safari use without a visit. Home Screen web apps are
exempt. For an app whose whole promise is "your details, on this phone, offline", that
is a data-loss bug in the platform, and the only lever is to tell the person.

`js/hint-ios.js` is that telling, and it is deliberately narrow:

| rule | why |
|---|---|
| iPhone/iPad only (incl. iPadOS reporting itself as a Mac) | nobody else has this problem |
| never inside the installed app | already immune, the card would be pure noise |
| only once there is something to lose — a name, a phone, a cashbook line | it earns its place at the moment it becomes true |
| once per session at most; **never again** after *Got it*, *Save a backup* | same contract as the resize hint |
| three short lines + two commands, in the chosen language | the person hates long text |
| the second button is *Save a backup*, not a link to a help page | a backup is the only guarantee any browser offers |

Wording, hand-written in all four languages (288 keys each): *"iPhone deletes a
website's saved details after 7 days without a visit. On the home screen it does
not."* Then **1.** Tap Share at the bottom of Safari. **2.** Choose "Add to Home
Screen", then open Pusha from the new icon. Buttons: **Got it · Save a backup · Not
now**.

## Proof — `features.js` §13l, on all three builds

```
nothingSaved_showsNothing  true
filled_showsHint           true      title "Keep this on your iPhone"
buttons                    Got it · Save a backup · Not now
short                      true      under 300 characters on screen
goneAfterGotIt             true      flag pusha_tip_ios = 1, reload shows nothing
silentOnHomeScreen         true      navigator.standalone = true
silentOnAndroid            true
errs                       []
```

Version **2.7**, cache `pusha-2.7.0`, standalone **700.0 KB**. 9/9 suite runs green,
25/25 deployment checks served, 15/15 on the single file.

---

# §22 · Uploading it: Netlify

`node build-dist.js` writes `../site` — 40 files, 666 KB, nothing internal. It
refuses to finish if a file the page asks for is missing, if a manifest or `<link>`
points at an icon that is not there, or if `sw.js` lists a shell file the folder does
not contain. The same list is checked from both directions, so a rename cannot ship
half an app.

It also writes the headers, and those are the interesting part: no file name in
Pusha carries a content hash, so **nothing may be cached hard by the HTTP cache** —
`max-age=0, must-revalidate` everywhere, and the service worker stays the only cache
because its name is versioned by hand each release. `manifest.webmanifest` is forced
to `application/manifest+json`, which some hosts get wrong and the browser then
silently ignores the manifest.

A strict CSP ships with it (`script-src 'self'`, `img-src 'self' data: blob:`,
`style-src 'self' 'unsafe-inline'` for the 39 inline style attributes). I did not
want to discover a CSP problem on a live site, so `tests/serve-netlify.js` serves the
upload folder with the exact `_headers` file applied, and the whole suite was run
through it:

```
deploy.js        25 / 25 passed, pageErrors []      (PWA · OFFLINE · SAVED)
check.js         errors []
learn.js         errors []
features.js      errors []
CSP violations   0   while opening sheets, exporting a backup, switching language
```

Netlify settings that matter, written into DEPLOY-NETLIFY.md: asset optimization off
(it rewrites files a service worker caches by name), no snippet injection (it would
break the CSP and the "nothing leaves your phone" line), test the PWA on the
production URL rather than a preview (previews are separate origins with separate
storage), and roll back by republishing the previous deploy.

Version **2.7**, cache `pusha-2.7.0`, upload folder **666 KB / 40 files**.
