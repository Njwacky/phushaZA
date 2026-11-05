# Pusha — who the market is, and who actually pays

**The app:** `index.html` — a static, offline "after-matric kit". One page, no server, no login, no data cost after download. It gives a young person: a private vault of their documents and details, a printable application pack, 16 realistic business starters with real rand numbers, a cashbook, and a 7-day plan.

---

## 1. Who the user is (the market)

| Fact | Number | Source |
|---|---|---|
| Wrote matric in 2025 | 746,110 | DBE 2025 NSC report |
| Passed | 656,415 (88%) | DBE / Daily Maverick, Jan 2026 |
| Bachelor passes (university door) | 345,857 | DBE 2025 NSC report |
| **Passed, but no bachelor's pass** | **~310,500** | Calculated |
| Youth 15–24 not in employment, education or training (NEET) | 36.4% ≈ 3.8 million | Stats SA QLFS Q2 2026 |
| Youth unemployment, ages 15–34 | 47.4% | Stats SA QLFS Q2 2026 |

So the beachhead is not "young people" in general. It is a **renewing annual cohort of roughly 300,000+ matric passes with no university place** — plus the backlog of the same people from the last five years, and the 3.8 million NEET youth behind them. Every January the cohort resets. That is a rare thing: a market that refills itself once a year, on a known date, in every town in the country.

What they have: a smartphone (often a R1,500 Android on prepaid data), a matric certificate, an ID, no email habit, no credit card, and no patience for sign-ups.
What they do not have: money to pay for tools, a bank account that supports subscriptions, or a laptop.

**That is exactly why a static app wins.** A 70 KB offline page costs the user nothing after the first load, needs no OTP, no password, no data, and cannot be breached. Any competitor that needs an account has already lost half this market at the login screen.

---

## 2. Who pays (because the user can't)

The user will not pay R50. Do not pretend otherwise. Three models that actually work for a free, static tool aimed at unemployed youth:

### A. Sponsored deployment (the main one)
The people who *need* this cohort to succeed already have budgets for it:
- **SEFA / NYDA** — youth enterprise development mandates.
- **Municipal LED (local economic development) offices** — every metro and most local municipalities fund SMME programmes.
- **SETAs** — learnership and work-readiness budgets.
- **Banks and retailers' ESD / CSI spend** — enterprise & supplier development counts toward B-BBEE scorecards; youth skills is the easiest story to fund.
- **TVET colleges and NGOs** — they need a "student support" artifact and will pay a licence to put their logo on it.

The pitch is simple: *“A 70 KB offline starter kit, branded to your programme, pre-loaded with your local opportunities list. Zero hosting cost. We can deploy to 5,000 phones for less than one printed brochure run.”*

Rates that are realistic for a first deal: **R15,000–R60,000 per sponsored deployment**, or R8–R25 per learner reached when bundled into an existing programme.

### B. Printed pack (small but real cash)
Static websites can't charge, but a printed thing can. The detail sheet + cashbook + 7-day plan printed as a 12-page A5 booklet costs roughly **R9–R14 to print** at a copy shop and sells for **R40–R60**. Sold at taxi ranks, school gates, church stalls, and by the same youth the app is for. The app becomes the free demo; the paper is the product.

### C. White-label licence
R2,000–R5,000 per school / TVET campus / NGO per year for their logo, their local opportunity list, their brand colour. Marginal cost to you: zero (it's one HTML file). Ten campuses = R20,000–R50,000 a year with no infrastructure.

**What not to do:** ads (they break the "works offline, tracks nothing" promise and pay cents per thousand in this audience), subscriptions (no cards), and app-store apps (install friction, data cost, review cycles).

---

## 3. How it spreads (distribution, not marketing)

This audience does not find products through search ads. It spreads by being **handed over**:

1. **January registration weeks** — TVET colleges, NSFAS help desks, labour centres. Print 200 QR stickers, hand them out at the gate.
2. **Churches and stokvels** — one youth leader showing it on a phone in a WhatsApp group of 250 people beats any campaign.
3. **Taxi ranks and spaza shops** — a laminated QR card taped to the counter: "Free: your ID, your plan, your hustle."
4. **Facebook groups and TikTok** — "Matric Class of 2025/2026", "learnerships SA", local buy-and-sell groups. Post the *numbers*, not the app: "Here's exactly what a kota stand costs to start — R800, and here's the profit per kota."
5. **The shareable artifact** — the printed detail sheet and the cashbook export. Every print has your URL at the bottom. The user prints it at a shop where 40 other people are standing.

The SEO play is not "free tools" (that war is lost to the tool farms). It is **long-tail, local, and money-flavoured**: "how much does it cost to start a kota stand in South Africa", "learnerships for matric graduates with no experience", "must I register my business to sell from home". Each answer lives inside the app as a page.

---

## 4. The moat

The code is copyable in a weekend — there is nothing clever in it. What is not copyable quickly:

- **The numbers.** Rand-accurate start-up costs, per-unit margins and supplier reality for each idea, checked locally, updated yearly. Global tool sites will never do this.
- **The voice.** Written for someone who just failed to get into varsity — no "entrepreneur ecosystem" language, no "leverage your synergies".
- **The distribution relationships.** One MOU with a TVET college or a municipal LED office is worth more than any amount of code.
- **The trust of zero collection.** Provable by turning the phone's data off in front of the user.

---

## 5. Honest risks

| Risk | Reality | What to do |
|---|---|---|
| Content ages | Prices change yearly; learnership pages move | Date every number. Add a "last checked" line. Budget one content refresh a year. |
| No direct revenue | Users can't pay | Sponsor and white-label from day one, not year two. |
| Everyone "knows" a business idea | The value is the numbers and the cashbook, not the list | Lead with margin per unit and the 7-day plan, never with "10 business ideas". |
| Single-file app = no analytics | You won't know usage | Ask sponsors for a "downloads handed out" count; use QR codes per channel to count scans. |
| Safety of advice | You are not a financial adviser | Keep the language plain and factual; point to official sources for funding and registration. |

---

## 6. What to build next (in order)

1. **PDF export of the whole pack** (detail sheet + cashbook + business plan) so a user can print once at a shop.
2. **isiZulu / Sesotho / Afrikaans language toggle** — this doubles reach in the same market and no competitor bothers.
3. **Local opportunity feed from a simple JSON file** — sponsors supply their own programmes without touching the code.
4. **Supplier directory per area** (wholesalers, bale suppliers, print shops) — the thing people ask for after they decide on an idea.
5. **A second track: "work" instead of "start"** — CV builder + interview prep + learnership tracker, for the half of the audience that doesn't want to be an entrepreneur.
