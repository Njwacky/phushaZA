# Learning resources — what Pusha links to, and why

Compiled 4 November 2026. Every URL below was requested and returned a page
(200) on that date. Anything unreachable from the build machine was left out
rather than guessed at (SEDA, SEFA and DSBD were all unreachable, so they are
not linked from the app).

## South African, free

| Resource | What it is | Data |
|---|---|---|
| [SA Youth](https://sayouth.mobi) | Free courses, learnerships, work experience; 18–34; managed by Harambee | **Zero-rated** on MTN, Vodacom, Cell C, Telkom, Rain |
| [Harambee](https://www.harambee.co.za) | Work-readiness training and job connections | Needs data |
| [NYDA](https://www.nyda.gov.za) | Youth business training and grants, 14–35 | Needs data |
| [WeThinkCode_](https://wethinkcode.co.za/enrol/) | Free 16-month software engineering programme, 17–35, **no matric required**, aptitude test, stipend | Needs data |
| [Umuzi](https://www.umuzi.org) | Free tech/creative academy; matric + aptitude test | Needs data |
| [CapaCiTi](https://www.capaciti.org.za) | Free 12-month tech training with placement, 18–35 | Needs data |
| [Digify Africa](https://digifyafrica.com/digify-pro-online-applications/) | Free digital marketing bootcamp, 18–35, low-data app | Needs data |
| [Vodacom e-School](https://www.vodacom.co.za/vodacom/services/vodacom-e-school) | CAPS lessons and exercises | **Zero-rated** on Vodacom |
| [Second Chance Matric](https://www.education.gov.za/Programmes/SecondChanceProgramme.aspx) | Free support to rewrite or improve matric subjects | Needs data |
| [NSFAS](https://www.nsfas.org.za) | Free TVET/university funding. 2027 applications closed 31 Oct 2026 — next window opens once a year | Needs data |

## Free platforms

Google Digital Skills (40-hour digital marketing certificate) · Microsoft Learn ·
Khan Academy · Siyavula (free CAPS maths) · freeCodeCamp · Alison (free courses,
paid certificate) · Coursera (audit free) · HubSpot Academy · Meta Blueprint ·
iFixit (photo tear-down guides).

## Video searches

Where a skill is mostly hand work — vetkoek, braids, fades, ironing, screen swaps,
bale sorting — the app links a **YouTube search**, not a single video: search links
survive a video being deleted, which single video links do not.

## Deliberately left out

* **SEDA, SEFA, DSBD** — no reachable site from the build machine; not linked rather
  than risk sending a 19-year-old to a dead page.
* **Canva Design School, OpenLearn** — bot-block the checker (403). They work in a
  browser, but "worked when I tried" is not the same as verified, so they wait.
* Any paid course, any affiliate link, any "start your own business" guru channel.

## Ideas 17–31 — the second round of links (re-checked 4 November 2026)

The 15 ideas added in this round (juice, lunch, alter, mow, plumb, paint, gutter,
shoe, decor, party, aftercare, social, design, scrap, repair) each point at a
**YouTube search**, for the same reason as the first round: a search link cannot be
killed by one uploader deleting a video.

All 18 below returned **HTTP 200** to a browser user agent on 4 November 2026, in
the same run that produced this note.

| Idea | Search term that is linked |
|---|---|
| juice — cold drink & ice | `how to start a cold drink and ice business south africa` |
| lunch — lunch delivery | `how to start a lunch delivery business from home south africa` |
| alter — alterations & hemming | `how to do basic clothing alterations and hemming for beginners` |
| mow — lawn & brush cutter | `how to start a lawn mowing business with a brush cutter` |
| plumb — drains & taps | `how to unblock a drain for beginners` |
| paint — painting & small repairs | `how to paint a room like a professional beginner` |
| gutter — gutters & solar panels | `how to clean solar panels safely` and `how to clean gutters safely on a house` |
| shoe — sneaker cleaning | `how to clean white sneakers properly` |
| decor — party decor & chair hire | `how to start a party decor and chair hire business` |
| party — party packs | `how to make party packs for kids parties` |
| aftercare — homework club | `how to run an after school care homework club` |
| social — social media for small business | `how to manage social media for small businesses beginners` |
| design — logos on a phone | `how to design a logo on your phone free` |
| scrap — scrap metal | `how to start a scrap metal business south africa` |
| repair — small appliances | `how to fix an electric kettle at home` and `how to test appliances with a multimeter for beginners` |
| all of the above (pricing) | `how to quote a job for a small painting or cleaning job` |

### How to re-check them

```bash
curl -s -o /dev/null -w "%{http_code}\n" -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/125.0" \
  "https://www.youtube.com/results?search_query=how+to+clean+white+sneakers+properly"
```

A `200` means the search page renders. A `000` from this machine is **not** proof
the site is dead — it is proof that this machine could not reach it. That is why
SEDA, SEFA and DSBD are still excluded and can now be found in-app only through
their telephone and municipal routes, not a link.

### What the app says about data cost

Only two links in the whole app are marked **ZERO-RATED** — SA Youth and Vodacom
e-School. Everything else, including every YouTube search above, carries the
**NEEDS DATA** pill, because watching a video without data will fail.
