/* Pusha — js/data-ideas.js — the 31 ideas — pure data, no logic (edit here to add an idea) */
/* ================================================================
   Pusha — app.js
   All behaviour. No dependencies, no build step, no bundler.

     A. storage + DOM helpers          B. theme + text size
     C. languages (LANGS / I18N / t / applyLang)
     D. vault: fields, photo, ID check, PIN lock
     E. CV: completeness, custom sections, A4 build
     F. pack: copy-paste blocks, detail sheet, printing
     G. ideas: 16 built-in + your own + matcher
     H. money: cashbook + savings goal
     I. path: 7-day plan, opportunities, scams
   ================================================================ */

/* (the mid-file "use strict" was a no-op here; strictness is left as the browser default) */

/* ============================================================
   0. SAFE STORAGE (works even when localStorage is blocked)
   ============================================================ */
const Store = (function(){
  let ok = false, mem = {};
  try { localStorage.setItem("__t","1"); localStorage.removeItem("__t"); ok = true; } catch(e){ ok = false; }
  return {
    ok: ok,
    get(k, d){ try { const v = ok ? localStorage.getItem(k) : mem[k]; return v == null ? d : JSON.parse(v); } catch(e){ return d; } },
    set(k, v){
      // returns false when the write did not happen (usually: storage full).
      // No caller may claim "saved" unless this is true.
      try { const s = JSON.stringify(v); if (ok) localStorage.setItem(k, s); else mem[k] = s; return true; }
      catch(e){ return false; }
    },
    del(k){ try { if (ok) localStorage.removeItem(k); else delete mem[k]; } catch(e){} }
  };
})();

const R = n => "R" + Math.round(Number(n) || 0).toLocaleString("en-ZA");
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
function toast(msg){ const t = $("#toast"); t.classList.remove("act"); t.textContent = msg; t.classList.add("on"); clearTimeout(t._x); t._x = setTimeout(()=>t.classList.remove("on"), 2200); }
/* inline SVG icon from the sprite — no emoji anywhere in the UI */
function ico(name, cls){ return '<svg class="icon ' + (cls || '') + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>'; }

/* ============================================================
   1. IDEA CRAFT — 16 starters with real numbers
   ============================================================ */
const IDEAS = [
  {
    id:"kota", ic:"food", name:"Kota & vetkoek stand", tag:"The classic township lunch. Cheap stock, fast cash, no fridge needed.",
    cat:"food", minCapital:800, margin:"45–55%", hours:"full", space:"none", transport:"none",
    likes:["food"],
    price:35, cost:18, unit:"kota",
    costs:[["Gas burner + pot",350],["Table, cloth, signage",250],["First stock (flour, chips, polony, atchar, cheese)",550],["Municipal trading permit + food handling",300]],
    licence:"Municipal trading permit (street trading by-law) + a food handling / certificate of acceptability from your local Environmental Health office. Ask at your municipality — it is usually cheap, not scary.",
    first10:["Taxi rank at 12:00–14:00 — walk the queue with a tray, don't wait for them to come to you.","School gate at 13:30 on Fridays; learners buy in groups of 3.","Put a photo of a kota on your WhatsApp status every morning at 10:00 with 'order by 11:30'."],
    risks:["Bread and polony go off fast in summer — buy daily, not weekly.","Load-shedding or rain kills a gas-and-table setup. Have a backup spot under a shop awning."],
    growth:"Add cold drinks (R8 profit per can, no cooking) then a second stand with someone you trust — not a family member who 'will pay you later'."
  },
  {
    id:"braai", ic:"fire", name:"Weekend braai plates", tag:"One day, one crowd. Sell 40 plates on a Saturday and clear more than a month of grant money.",
    cat:"food", minCapital:1500, margin:"35–40%", hours:"part", space:"corner", transport:"taxi",
    likes:["food","people"],
    price:65, cost:40, unit:"plate",
    costs:[["Braai stand + tongs + knife",450],["Cooler box",350],["Charcoal / wood (per weekend)",200],["First meat + pap + chakalaka",500]],
    licence:"Same as any food trading: municipal permit + food handling. Selling at an event? Get the organiser's written okay — and never set up without it.",
    first10:["Saturday sports fixtures — arrive 90 minutes before kick-off.","Ask a stokvel or church group to pre-order 30 plates for a meeting; that is your guaranteed base.","Dress like a business: apron, cap, name. People pay more to someone who looks organised."],
    risks:["Meat prices move weekly — reprice your plate, don't eat your profit.","Rain. Always have a gazebo or a partner's garage booked."],
    growth:"Move from plates to pre-ordered catering (birthdays, funerals, small weddings) where you take a 50% deposit."
  },
  {
    id:"baking", ic:"cupcake", name:"Muffins & scones run", tag:"Bake at home, sell by the dozen to schools, offices and churches.",
    cat:"food", minCapital:600, margin:"55–60%", hours:"part", space:"corner", transport:"taxi",
    likes:["food"],
    price:8, cost:3.5, unit:"muffin",
    costs:[["Muffin trays + mixing bowls",300],["First ingredients",250],["Packaging (bags, labels)",120]],
    licence:"Home baking for sale needs a food handling certificate from Environmental Health. A tuckshop supply deal usually asks for it too.",
    first10:["School tuck shop: offer to supply 60 muffins every Friday, delivered by 06:45.","Office tea time: find one admin person and give them 6 free muffins — they will collect the orders.","Church after-service on Sunday sells out fastest."],
    risks:["You cannot bake without a working oven — confirm yours (or a neighbour's) first.","Wastage: bake to order after week one. Never guess."],
    growth:"Add a printed price list and take weekly standing orders from 3 schools; that is a salary."
  },
  {
    id:"braid", ic:"comb", name:"Braiding & nails from home", tag:"Zero stock, high margin, your hands are the capital.",
    cat:"beauty", minCapital:500, margin:"75–80%", hours:"full", space:"corner", transport:"none",
    likes:["people","hands"],
    price:250, cost:60, unit:"head",
    dQty:2, dDays:4, costs:[["Hair, threads, gel",300],["Combs, clips, spray bottle",150],["Mirror + chair",150]],
    licence:"No licence needed for hair styling. If you sell products or do piercings, that changes — check with your municipality.",
    first10:["Two free styles for the loudest girls in your street, in exchange for a before/after post on their status.","Saturdays are for school girls; weekdays after 17:00 for working women.","A R20 referral fee to anyone who brings you a paying client works better than discounts."],
    risks:["Your hands will give out — cap bookings at 4 heads a day.","A bad knot-out travels faster than a good one. Practise on family first."],
    growth:"Train one apprentice on a 50/50 split and take bookings while you braid."
  },
  {
    id:"barber", ic:"scissors", name:"Mobile barber", tag:"Clippers, a cape and a mirror. Go to the client's house — they pay for that.",
    cat:"beauty", minCapital:2500, margin:"85–90%", hours:"full", space:"none", transport:"taxi",
    likes:["hands","people"],
    price:40, cost:4, unit:"cut",
    costs:[["Cordless clippers (rechargeable — load-shedding proof)",1600],["Clippers, brushes, sprays",400],["Cape, mirror, neck strips",250],["Backpack",250]],
    licence:"None for cutting hair at a client's home. Renting a chair in a salon means a rental agreement, not a licence.",
    first10:["Saturday morning rounds in one street — 6 cuts in 3 hours, R40 each, no travel between.","Free cut for 3 taxi drivers; their rank becomes your waiting room.","Kids' cuts at R25 on Sunday afternoons get the whole family to follow."],
    risks:["One dropped clipper = R1,600 gone. Keep a spare blade and a hard case.","Never cut while distracted — a bad line is a lost client forever."],
    growth:"Book 5 regulars a week on a monthly 'club' (R140 for 4 cuts, paid upfront). That is R2,800 before you wake up."
  },
  {
    id:"wash", ic:"drop", name:"Mobile car wash", tag:"Waterless wash for estates and office parks. R60 a car, 20 minutes.",
    cat:"hands", minCapital:700, margin:"75%", hours:"full", space:"none", transport:"none",
    likes:["hands"],
    price:60, cost:15, unit:"car",
    dQty:6, dDays:5, costs:[["Waterless wash concentrate + wax",300],["Buckets, cloths, brushes, squeegee",250],["Water container (20L)",150]],
    licence:"Estate or office park: get written permission from the body corporate or building manager and offer them a cut. Washing in the street can get you moved on.",
    first10:["Pick ONE complex. Walk it on a Saturday and wash 3 cars free. Then put a laminated price list at the gate.","Taxis at the rank: R45 each, in bulk, while they wait for passengers.","Car dealerships and panel shops need someone reliable weekly — walk in and ask for the manager."],
    risks:["Scratching a car with a dirty cloth is a R3,000 fight. Rinse cloths after every car.","Winter and rain kill walk-up business — sell a monthly subscription instead."],
    growth:"Monthly plan: R180 for 4 washes on one car. Ten cars on plan = R1,800 predictable."
  },
  {
    id:"clean", ic:"spray", name:"Cleaning crew (2 people)", tag:"Estate agents need move-out cleans, offices need weekly. R300 a job.",
    cat:"clean", minCapital:450, margin:"80%", hours:"full", space:"none", transport:"taxi",
    likes:["clean"],
    price:300, cost:60, unit:"job",
    dQty:2, dDays:4, costs:[["Bucket, mop, brooms, cloths",250],["Chemicals (bleach, floor cleaner, window)",150],["Gloves, masks, apron",80]],
    licence:"Not needed. For anything food-related or after a building project, expect the client to ask for your ID and sometimes a police clearance (about R150 at SAPS).",
    first10:["Walk into 5 estate agencies and ask who does their move-out cleans. Tell them you can be there tomorrow morning.","Offer a R250 'first clean, no risk' to 3 neighbours — then ask for the review and the referral.","Guesthouses and B&Bs need turnarounds on short notice; be the person who says yes."],
    risks:["Working alone in a stranger's house is unsafe — always go in two.","Never write off 'a small job for a friend' as free twice."],
    growth:"Contract one office for a weekly 3-hour clean. That single retainer pays your month."
  },
  {
    id:"laundry", ic:"shirt", name:"Wash & iron, picked up", tag:"Nurses, students and gogos pay R80 a load so they never touch an iron.",
    cat:"clean", minCapital:600, margin:"70%", hours:"part", space:"corner", transport:"taxi",
    likes:["clean"],
    price:80, cost:22, unit:"load",
    dQty:5, dDays:5, costs:[["Iron + ironing board",400],["Basins, pegs, hangers, bags",150],["Detergent + starch",150]],
    licence:"None at home scale. Using a laundromat's machines is fine — you are paying per load.",
    first10:["Nurses finishing night shift at the clinic — 3 of them will say yes on day one.","Student digs: one poster in a res kitchen gets 10 loads a week.","A guesthouse's linen contract is your jackpot — ask about towels too."],
    risks:["Losing someone's shirt costs you the client and the trust. Tag every bag with a name and count the items in front of them.","Rain in summer slows drying — agree 48 hours, not 24."],
    growth:"Buy a second-hand washer on a lay-by from the profits, then raise capacity not prices."
  },
  {
    id:"phones", ic:"phone", name:"Covers, chargers & screen swap", tag:"Small stock, huge margin, everyone breaks a screen.",
    cat:"trade", minCapital:3000, margin:"45–60%", hours:"part", space:"corner", transport:"taxi",
    likes:["tech","people"],
    price:80, cost:35, unit:"cover",
    costs:[["Starter stock: 20 covers + 15 protectors + chargers",1800],["Small toolkit + heat gun",450],["Display stand + price labels",250],["Float for change",300]],
    licence:"Trading permit if you sell from a stand. If you repair, be clear with clients about warranty — put it in writing on the slip.",
    first10:["Set up next to a busy taxi rank for two weekends and watch which phone models people actually carry — then stock those only.","Bundle: cover + protector fitted for R120. Fitting is free labour and feels like service.","Leave cards at 3 phone-repair kiosks: they send you the customers who only want a cover."],
    risks:["Dead stock. Never buy 50 of one model because a wholesaler pushed it.","Breaking a client's screen while 'just checking' — always test in front of them, before you touch it."],
    growth:"Move into repairs (R350+ per screen) once you can do 3 practice phones without damage."
  },
  {
    id:"print", ic:"print", name:"CV typing, printing & laminating", tag:"Every job application in your street needs this. R50 a CV.",
    cat:"tech", minCapital:2200, margin:"85%", hours:"part", space:"corner", transport:"none",
    likes:["tech","people"],
    price:50, cost:5, unit:"CV",
    costs:[["Second-hand printer",1200],["Ink + 2 reams of paper",600],["Laminator + pouches",300],["Extension cord, surge plug",150]],
    licence:"None at home. If you register as a business later, CIPC company registration is R125 online.",
    first10:["Sit outside the labour centre / Thusong centre on grant-and-job days with a sign: 'CV typed R50, print R2'.","Schools need consent forms and certificates copied in bulk — ask the admin clerk.","Offer a R180 'job pack': CV + cover letter + 5 certified-style copies, printed and stapled."],
    risks:["Ink is the hidden cost. Charge per page properly or you will work for free.","Load-shedding: get a cheap inverter or agree to work from a shop with power."],
    growth:"Add a WhatsApp number for orders and a QR code on your sign — people screenshot and come back."
  },
  {
    id:"tutor", ic:"book", name:"Homework club", tag:"5 learners at R80 an hour in someone's garage. Your matric is the product.",
    cat:"people", minCapital:150, margin:"95%", hours:"part", space:"corner", transport:"none",
    likes:["people","kids"],
    price:80, cost:10, unit:"learner",
    dQty:5, dDays:4, costs:[["Printed worksheets + notebook",80],["Data for past papers",70],["Chairs (borrow first)",0]],
    licence:"None. If you use a school or church venue, get a letter of permission. Never claim to be a registered school.",
    first10:["Start with 4 kids from your own street at R80 each, 3 afternoons a week — that is R960 a week.","Ask one teacher you trust to recommend you to two parents.","Free 30-minute diagnostic session: show the parent exactly what the child can't do. That closes the sale."],
    risks:["You cannot fix a subject you got 40% for. Start with Maths Lit and primary homework only.","Parents pay late. Take the week's fee upfront, every Monday."],
    growth:"Run a Saturday group of 10 and hire a second tutor from your matric class on a 50/50 split."
  },
  {
    id:"resell", ic:"hanger", name:"Clothing resale & bale splits", tag:"Buy a bale, split it with two friends, sell item by item at 3× the cost.",
    cat:"trade", minCapital:2500, margin:"60–120%", hours:"part", space:"corner", transport:"taxi",
    likes:["fashion","people"],
    price:120, cost:40, unit:"item",
    dQty:6, dDays:5, costs:[["Half a bale with a partner",1500],["Rail, hangers, mirror",400],["Data + packaging",150],["Float",300]],
    licence:"None to start. Selling from home is fine; a market stand needs the market's permission.",
    first10:["Photograph 20 items on a real person in daylight — not on a bed. That is the whole difference.","Post a 9-item 'drop' every Friday at 18:00 in 3 WhatsApp groups and on Facebook Marketplace.","One pop-up in your yard on a Saturday: R50 entry gets you 40 buyers."],
    risks:["Dead stock ties up your money. If an item hasn't sold in 3 weeks, drop it 30% and move on.","Never buy a sealed bale you haven't seen opened unless you know the supplier."],
    growth:"Once you know what your buyers want, buy those items directly instead of bales."
  },
  {
    id:"online", ic:"bag", name:"Online reseller (no stock)", tag:"Sell first, buy after. You need data and screenshots, not capital.",
    cat:"trade", minCapital:300, margin:"40–50%", hours:"part", space:"none", transport:"taxi",
    likes:["tech","fashion"],
    price:150, cost:85, unit:"order",
    dQty:5, dDays:5, costs:[["Data + airtime",200],["Sample item to photograph",100],["Deposit for first order",0]],
    licence:"None to begin. SARS only wants to hear from you once you're turning over real money — keep every receipt from day one so you're ready.",
    first10:["Pick ONE product category (phone gadgets, hair, kids' clothes) — generalists die.","Post 3 items a day on TikTok with the price in the caption and 'DM to order'.","Take a 50% deposit before you order. No deposit, no order — that rule protects you."],
    risks:["Suppliers who take your money and vanish. Use a wholesaler with a physical address you have seen, or cash on delivery.","Late deliveries destroy your name. Promise 10 days, not 3."],
    growth:"Save the profit until you can hold 10 units of your best seller in stock — then you ship same-day."
  },
  {
    id:"veg", ic:"leaf", name:"Backyard spinach & tomato", tag:"6 weeks from seedlings to R12 a bunch, sold to spazas who currently buy far away.",
    cat:"grow", minCapital:900, margin:"65%", hours:"part", space:"yard", transport:"none",
    likes:["grow","hands"],
    price:12, cost:4, unit:"bunch",
    costs:[["Seedlings + compost",400],["Drip pipe + watering can",250],["Spade, fork, gloves",250],["Netting / shade cloth",150]],
    licence:"None for backyard growing. Selling to a shop means they may ask for a simple invoice — write one.",
    first10:["Walk into 3 spaza shops with 10 free bunches. Ask what they pay and what day they want delivery.","Restaurants and caterers buy weekly — ask the chef, not the waiter.","Neighbours first: a handwritten 'fresh spinach R12' board at your gate sells out on Saturday."],
    risks:["Water and heat. Spinach bolts in a hot January — shade cloth is not optional.","Theft and stray animals. Fence before you plant, not after."],
    growth:"Plant on a 3-week rotation so you always have something to sell, then add a tunnel to grow through winter."
  },
  {
    id:"runner", ic:"bike", name:"Delivery runner", tag:"Bicycle, backpack, phone. R25 a drop for spazas, pharmacies and people who can't leave work.",
    cat:"hands", minCapital:0, margin:"80%", hours:"full", space:"none", transport:"none",
    likes:["people","hands"],
    price:25, cost:5, unit:"drop",
    costs:[["Insulated backpack",350],["Bicycle service",150],["Phone data",100]],
    licence:"None. Obey traffic rules — one accident ends the business and your body.",
    first10:["Two spaza shops: 'I fetch your stock from the wholesaler every morning for R40 a trip.'","A pharmacy needs chronic-medicine drops daily. This is the single best client in the business.","Put your number on a card and give it to every customer you deliver to."],
    risks:["Safety. Don't carry big cash, vary your route, and don't deliver alone after dark.","One client is not a business — always be signing the next two."],
    growth:"Add a second rider with a bicycle on commission, and move into scheduled daily runs instead of one-offs."
  },
  {
    id:"photo", ic:"camera", name:"Phone photography & event covers", tag:"Matric dances, birthdays, church events. R450 a shoot, same-day album.",
    cat:"tech", minCapital:1200, margin:"88%", hours:"part", space:"none", transport:"taxi",
    likes:["tech","people"],
    price:450, cost:50, unit:"shoot",
    dQty:1, dDays:2, costs:[["Gimbal / tripod + lens clip set",700],["Editing app subscription",150],["Business cards + sample album",200],["Light (ring or panel)",150]],
    licence:"None. For big public events, check whether the venue has a media policy.",
    first10:["Do one free shoot for a church youth event and deliver it the same night with your watermark.","Ask 3 small businesses for a 5-photo product shoot at R250 — faster money than parties.","Post 'next 3 bookings this month get a free 20-photo WhatsApp album'."],
    risks:["Losing photos loses clients. Back up to two places before you sleep.","Charging R150 kills your price forever. Start at R450 and hold it."],
    growth:"Sell a 'content day' to one salon or restaurant monthly: 15 photos + 3 clips, R1,200, on a recurring invoice."
  }
  ,{
    id:"juice", ic:"drop", name:"Cold drinks & ice", tag:"The simplest R450 in this app. Cold sells itself on a hot day.",
    cat:"food", minCapital:450, margin:"40–55%", hours:"full", space:"corner", transport:"taxi",
    likes:["people","food"],
    price:15, cost:7, unit:"cold drink",
    dQty:25, dDays:6, costs:[["Second-hand chest freezer or paid freezer space",180],["Crate of 24 cold drinks",180],["Ice, cups, straws, jug",90],["Municipal trading permit",150]],
    licence:"Municipal street trading permit. If you squeeze fresh juice or make ice lollies at home, you also need the food handling certificate (certificate of acceptability) from your local Environmental Health office.",
    first10:["Taxi rank from 11:00 — the queue is your shop, walk it with a crate.","Builders, road workers and car guards buy two at a time; give them a R2 discount on two.","Put 'cold ones, R15, at the rank now' on your WhatsApp status at 10:30 and 14:00.","Wash bays and garages — the people working in the sun all day."],
    risks:["Load-shedding melts your stock and your profit with it — keep only what you can sell in a day.","Cheap shops nearby sell at R12. Sell cold, not cheap — a warm R12 is worse than a cold R15.","A crate walks away when you are not looking. Count crates at the start and end of every day."],
    growth:"Once you sell 40 a day, put a second crate with a spaza shop you trust and share the profit — then buy your own freezer on lay-bye."
  },{
    id:"lunch", ic:"fire", name:"Work lunch run", tag:"Same 10 people, same time, every day. Recurring money, not one-off money.",
    cat:"food", minCapital:900, margin:"40–50%", hours:"full", space:"corner", transport:"taxi",
    likes:["food","people"],
    price:45, cost:24, unit:"lunch box",
    dQty:12, dDays:5, costs:[["Two big pots + gas refill",400],["First week of ingredients",350],["Containers, labels, carrier bag",150],["Food handling certificate",200]],
    licence:"Food handling certificate of acceptability from Environmental Health, plus a municipal trading permit if you sell from a stand. Cooking at home for sale is allowed, but the kitchen must pass a basic inspection.",
    first10:["Three workshops or offices within walking distance — walk in at 10:00 and ask for the person who orders lunch for the team.","Security guards, car guards and petrol attendants: they cannot leave their post, so you bring lunch to them.","A construction site: agree a 12:30 delivery for 10 plates, paid for on a Friday.","A school staffroom on Fridays — teachers order in groups."],
    risks:["Daily cash means daily chasing. Take the whole week's money on Sunday, not per plate.","One person drops out and you cooked 10 plates. Confirm numbers by 20:00 the night before.","Transport time is the killer — if the food arrives at 13:15 the order dies. Leave 20 minutes earlier than you think."],
    growth:"Ten clients × 5 days is around R1,000 a week profit on two pots. Add a Friday special, then a second route with a helper who delivers while you cook."
  },{
    id:"alter", ic:"shirt", name:"Alterations & hemming", tag:"Every school, church and dry cleaner needs a hem this week.",
    cat:"hands", minCapital:950, margin:"55–70%", hours:"part", space:"corner", transport:"none",
    likes:["fashion","hands"],
    price:80, cost:15, unit:"hem",
    dQty:4, dDays:5, costs:[["Second-hand sewing machine (Gumtree, cash converters)",700],["Threads, needles, tape measure, pins",120],["Scissors, tailor's chalk, iron",130]],
    licence:"Nothing to register to sew from home. Register with your municipality only if you take on staff or trade from a shop.",
    first10:["Dry cleaners: they send alterations out and pay weekly. Walk in with 3 finished samples.","School uniform shops in December and January — hems and name tapes, in bulk.","Churches before a wedding or a big Sunday — choir robes and dresses.","School gate at 07:30: mothers with a skirt that is too long."],
    risks:["You ruin one dress and you pay for it. Fold and pin first, and never cut before the client has looked in the mirror.","A written price list stops the 'just a small thing' discount.","Cheap thread snaps in the wash — buy proper thread or do it twice."],
    growth:"Two dry-cleaning contracts plus school-uniform season can carry the whole year. Then buy a second machine and train one person on hems only."
  },{
    id:"mow", ic:"leaf", name:"Lawn & garden service", tag:"One street, four gardens, one trip. That is the business model.",
    cat:"hands", minCapital:1500, margin:"50–60%", hours:"full", space:"none", transport:"car",
    likes:["hands","grow"],
    price:150, cost:60, unit:"garden",
    dQty:3, dDays:5, costs:[["Second-hand brush cutter or mower",900],["Rake, bags, gloves, fuel can",200],["Transport (taxi or bakkie hire, per day)",250],["Two-stroke oil + petrol",150]],
    licence:"No licence for gardening. Check municipal noise by-laws for start times, and take garden refuse to the designated dump — dumping in a field is a fine.",
    first10:["Pick 20 houses in one street close to you and knock. Neighbours copy neighbours.","Rental agents and landlords with a garden that is out of control before a viewing.","Creches and churches — big grounds, small budget, they pay for regular work.","Builders who have just finished and left rubble and overgrown grass."],
    risks:["A broken machine means no income that week. Learn to fix the carburettor yourself.","Doing 6 gardens in a day to chase money means the 7th customer gets a bad job.","Quotes on the phone go wrong — measure the yard with your own eyes."],
    growth:"Turn every job into a monthly contract, then group four houses in one street so transport is paid once. Add tree work only after proper training."
  },{
    id:"plumb", ic:"wrench", name:"Basic plumbing & drain unblocking", tag:"A leaking tap is R80 of washers and 20 minutes. Plumbers charge R450 to come out.",
    cat:"hands", minCapital:900, margin:"60–75%", hours:"full", space:"none", transport:"taxi",
    likes:["hands"],
    price:350, cost:80, unit:"callout",
    dQty:2, dDays:5, costs:[["Drain auger (snake), 5m",400],["Basin wrench, spanners, teflon tape",250],["Bucket, torch, overalls, gloves",150],["Caustic drain cleaner + washers kit",100]],
    licence:"Nothing to register for taps, drains and pipes. **Do not touch geysers, gas lines or the main municipal connection** — those need a registered plumber and a Certificate of Compliance, and the fine is on you.",
    first10:["Your own street first: a leaking tap, a blocked kitchen sink, a toilet that runs. Do the first three for the price of the parts.","Spaza shops and salons — sinks and toilets get blocked weekly.","Landlords: one landlord with four flats is worth more than twenty once-off calls.","Ask a working plumber if you can carry his tools for a month. You learn, and you get paid while you learn."],
    risks:["Flooding a neighbour's ceiling costs more than the whole job. Test the pipe before you close up, and watch it for 10 minutes.","The crack you cannot see: give a worst-case price in writing before you start.","Do not guess at electrical geysers. Say 'I don't do geysers' and mean it."],
    growth:"A standing call-out rate of R450 for three landlords is steady money. Then do the N2 and trade test — a qualified plumber earns artisan wages."
  },{
    id:"paint", ic:"brush", name:"Painting & small repairs", tag:"Landlords pay to turn a flat over fast. Two coats and a clean floor.",
    cat:"hands", minCapital:800, margin:"45–60%", hours:"full", space:"none", transport:"none",
    likes:["hands"],
    price:900, cost:380, unit:"room",
    dQty:1, dDays:5, costs:[["Brushes, rollers, tray, tape, drop sheets",300],["Two 20 L buckets of white paint",380],["Second-hand ladder",250],["Sanding blocks, filler, putty knife",120]],
    licence:"No licence. Working above 3 metres needs proper equipment — say no to a job rather than fall off a roof.",
    first10:["Landlords with a flat standing empty — they lose money every day it is not painted.","Estate agents before a viewing day.","Salons and spaza shops: walls get dirty fast and customers notice.","One house in a street, do it properly, then knock on both neighbours' doors."],
    risks:["Painting over damp peels in a month and you will be called back for free. Fix the damp first or walk away.","Never quote a room without looking at it — a dark colour over a dark wall is three coats.","Paint on a customer's floor is money out of your pocket. Sheets down before the lid is opened."],
    growth:"Sell a fixed 'rental turnover' package (two coats, one colour, clean floor) and get onto three letting agents' lists. Add a helper for ceilings."
  },{
    id:"gutter", ic:"sun", name:"Solar panel & gutter cleaning", tag:"A dusty panel loses up to a fifth of its power. Nobody remembers to clean it.",
    cat:"clean", minCapital:700, margin:"60–70%", hours:"part", space:"none", transport:"taxi",
    likes:["clean","hands"],
    price:450, cost:90, unit:"house",
    dQty:2, dDays:4, costs:[["Telescopic pole + soft brush head",450],["Squeegee, hose, cloths",120],["Gloves, safety rope, harness",130]],
    licence:"No licence, but this is a **ladder and roof** business: never work alone above the first floor, never walk a wet tiled roof, and never lean a ladder on a gutter. Check your municipality's water restrictions before you hose anything.",
    first10:["Houses with solar panels — knock and explain the 15–20% power loss from dust.","Body corporates and complexes: one quote covers 12 units.","Shops and churches with gutters full of leaves, two weeks before the rainy season.","Car washes and garden services can refer you for a fee."],
    risks:["Falls are what end this kind of business. If it does not feel safe, do not climb.","Hot panels burn and warp if you wash them in the afternoon. Early morning only.","Water down the wrong side of the roof is an inside ceiling. Move slowly and keep the hose low."],
    growth:"Annual contracts just before the rainy season, then add gutter guards (you supply and fit) and window cleaning on the same visit."
  },{
    id:"shoe", ic:"spray", name:"Sneaker cleaning & shoe repair", tag:"Friday drop-off, Monday pickup. White shoes are a weekly problem.",
    cat:"clean", minCapital:400, margin:"65–80%", hours:"part", space:"none", transport:"none",
    likes:["clean","fashion"],
    price:60, cost:12, unit:"pair",
    dQty:5, dDays:5, costs:[["Brush, saddle soap, suede eraser",180],["Whitener, cloths, polish, laces",120],["Drying rack, pegs, carry bag",100]],
    licence:"Nothing to register. Use products as the label says and keep the box — a burnt pair of sneakers is your money.",
    first10:["School gate on Friday: white shoes must be white on Monday.","Taxi rank on Monday morning, with a sample pair that you cleaned.","Soccer and netball teams — the whole team, one order.","Nurses and security guards: work shoes are part of the uniform."],
    risks:["Bleach burns synthetic fabric and there is no fix. Patch-test every pair out of sight first.","Photograph every pair at drop-off (with the customer watching) so nobody claims old damage.","Suede and nubuck need dry methods — if you have not learnt it, say no."],
    growth:"Turn it into a weekly subscription: R60 a pair, collected Friday, back Monday. Add laces, insoles and a cheap shoe glue repair — small ticket, high margin."
  },{
    id:"decor", ic:"sparkle", name:"Party décor & chair hire", tag:"Chairs, backdrop, balloons. The money is in the deposit and the returns.",
    cat:"trade", minCapital:3000, margin:"50–65%", hours:"part", space:"yard", transport:"car",
    likes:["people","hands"],
    price:1200, cost:400, unit:"event",
    dQty:1, dDays:2, costs:[["30 second-hand chairs",1500],["Fabric, balloons, backdrop frame",700],["Bakkie transport per event",400],["Cleaning and storage",400]],
    licence:"No licence to hire out décor. **Never sell or supply alcohol** — that needs a liquor licence you will not get for a party setup.",
    first10:["Churches: funerals and weddings pay the same day and they talk to each other.","Funeral parlours — they need chairs every weekend.","Creche graduations and school concerts (October to December).","One good photo album — take photos at every event and send them to the client the same night."],
    risks:["Chairs come back broken or do not come back at all. **Take a 50% deposit and never release the last chairs until the balance is paid.**","Late night returns with a bakkie you paid for: price the second day in from the start.","Storage is a real cost — if the chairs live in your bedroom, count the clutter as a cost."],
    growth:"Add a gazebo, tables and a small sound system, and quote the whole event. Photograph everything: your album sells the next booking."
  },{
    id:"party", ic:"cupcake", name:"Kids' party packs & face painting", tag:"R35 a pack, ten kids, two hours on a Saturday.",
    cat:"people", minCapital:450, margin:"50–60%", hours:"part", space:"none", transport:"taxi",
    likes:["people","kids"],
    price:35, cost:16, unit:"party pack",
    dQty:20, dDays:2, costs:[["Kid-safe face paint + brushes, sponges",150],["Bulk sweets, packets, small toys",250],["Sample photo album and a price sign",50]],
    licence:"Nothing to register. Use **water-based, kid-safe face paint only** and read the label — a reaction on a child's face is the end of your reputation.",
    first10:["Neighbours' birthday parties — start with one free to build the photo album.","Creches: charge per child with a minimum of 10.","Church youth days and Sunday school concerts.","School market days and sports days — sell packs from a table."],
    risks:["Allergies: always patch-test on the back of the hand, and ask the parent first.","'I'll pay you Monday' from a friend of a friend. Take 50% up front.","Paint that stains school uniforms ruins the party and your name."],
    growth:"Sell it as a package — packs, painting and a photo of each child sent to the parent for R10 each. Then train a second painter for Saturdays."
  },{
    id:"aftercare",billing:"month",  ic:"user", name:"After-school care & homework club", tag:"Working parents need 13:00 to 17:30 covered. That is the whole product.",
    cat:"people", minCapital:300, margin:"60–75%", hours:"part", space:"corner", transport:"none",
    likes:["people","kids"],
    price:350, cost:90, unit:"child / month",
    dQty:6, dDays:1, costs:[["Tables, chairs, stationery",150],["Snacks for the first month",100],["First-aid kit and a lockable gate",50]],
    licence:"**This is childcare, so check the rules before you open:** your municipality and the Department of Social Development both have requirements, and they get stricter as the number of children goes up. Stay at 6 children, get written parent consent, keep a first-aid kit, and ask your local office what registration looks like.",
    first10:["Parents on your street who finish work at 17:00.","Taxi drivers and nurses — shift work makes afternoons impossible.","Single parents and grandparents who cannot help with homework.","The primary school gate: one conversation, done well, brings three mothers."],
    risks:["A hurt child without consent forms, first aid or a lockable space is a serious problem. Do the paperwork first.","Homework you cannot help with damages trust — say 'we will do that one tomorrow' and ask a tutor.","Late pickups: charge R20 per 15 minutes and say it up front."],
    growth:"Add holiday camps during school holidays, and partner with a maths tutor (see the Homework club idea) for the subjects you cannot teach."
  },{
    id:"social",billing:"month",  ic:"phone", name:"Social media for salons & spazas", tag:"R0 to start. Ten shops on your street have a Facebook page last updated in 2023.",
    cat:"tech", minCapital:0, margin:"90%+", hours:"part", space:"none", transport:"taxi",
    likes:["tech","people"],
    price:800, cost:40, unit:"shop / month",
    dQty:3, dDays:1, costs:[["Data bundle",40],["Phone and WhatsApp Business (already yours)",0],["Free tools: Meta Business Suite, Canva",0]],
    licence:"Nothing to register to run someone else's page. Never promise followers or sales — promise a set number of posts a month, and put that in a WhatsApp message so it is in writing.",
    first10:["Walk your street and write down every business with a dead Facebook page.","Salons and barbers: before-and-after photos are free content and they always sell.","Spaza shops that want to show specials, and churches advertising events.","Mechanics and panel beaters — a before/after photo of a repair is the best advert they will ever have."],
    risks:["The shop expects customers by Friday. Explain in week one that posts build slowly, ads work faster, and neither is magic.","Never hold a client's password in your head — ask them to add you as an admin.","Free work for family is how this business dies. One free month, then the price."],
    growth:"Eight shops at R800 is R6,400 a month, and it repeats every month. Then learn ads properly (the free Google Digital Skills course) and charge for them."
  },{
    id:"design", ic:"edit", name:"Logos, flyers & posters", tag:"One phone, free tools, and a street full of shops that need a poster.",
    cat:"tech", minCapital:0, margin:"90%+", hours:"part", space:"none", transport:"none",
    likes:["tech","fashion"],
    price:250, cost:20, unit:"design",
    dQty:2, dDays:5, costs:[["Data",20],["Free design tools",0],["A print test page",20]],
    licence:"Nothing to register. **Do not use other people's logos, photos or paid fonts** — that is how a small job becomes a legal problem. Use free-for-commercial-use assets and keep the source files.",
    first10:["Funeral parlours and churches need a new poster almost every month.","School sports days and matric farewells: posters, tickets, programmes.","Spaza shops and salons: a price list poster with their logo.","Taxi associations and stokvels for their events."],
    risks:["'Make it pop' clients will ask for 20 changes. Fix one round of changes in the price and say so first.","Never send the final file before payment — send a screenshot with a watermark instead.","Someone else's Instagram photo in your flyer is a claim against your client."],
    growth:"Package it: logo R250, poster R120, and a monthly 'social pack' (10 posts) at R500. Build a template library so each job takes 30 minutes."
  },{
    id:"scrap", ic:"bag", name:"Scrap metal & e-waste runs", tag:"R0 to start, but there are rules — read the licence line before you touch a cable.",
    cat:"trade", minCapital:0, margin:"90%+", hours:"full", space:"yard", transport:"taxi",
    likes:["hands","clean"],
    price:380, cost:60, unit:"load",
    dQty:2, dDays:5, costs:[["Sack trolley (or a borrowed bakkie)",200],["Gloves, magnet, second-hand scale",150],["Transport per run",100]],
    licence:"**Read this twice.** Buying and selling second-hand goods (including scrap) is regulated by the Second-Hand Goods Act — a scrap yard needs a SAPS certificate. Collecting and selling to a registered dealer is different from running a yard. **Never cut or strip copper or fibre cable** — it is almost always stolen, and it is a criminal charge with your name on it.",
    first10:["Builders clearing a site: old window frames, pipes, off-cuts.","Plumbers and mechanics with old geysers, batteries and parts.","Your own street: dead fridges, stoves, microwaves (e-waste pays better than steel).","Small shops with cardboard and boxes — light, but steady every week."],
    risks:["Stolen metal is not a fine, it is a charge. Ask where it came from, and walk away from anything cut.","Weight is the whole business — a R150 scale pays for itself in a week.","E-waste and garden refuse go to different places; mixing them closes doors."],
    growth:"Plan a route so one trip covers five stops, then agree a standing weekly pickup with three workshops. That is recurring income with no stock."
  },{
    id:"repair", ic:"bolt", name:"Small appliance repair", tag:"Kettles, irons, stoves, fans. People throw away things worth R300 of repair.",
    cat:"tech", minCapital:600, margin:"60–80%", hours:"part", space:"corner", transport:"none",
    likes:["tech","hands"],
    price:180, cost:45, unit:"repair",
    dQty:3, dDays:5, costs:[["Multimeter, screwdriver set, pliers",300],["Soldering iron, wire, connectors",150],["Broken appliances to practise on (ask, don't buy)",0],["Spare elements, plugs, switches",150]],
    licence:"No licence to repair appliances. **Safety rules that are not optional:** unplug before you open anything, never work on a microwave (the capacitor can kill you even unplugged), and never repair a gas appliance or a gas fridge without registration.",
    first10:["Your street: ask for broken kettles and irons instead of money — you need practice, they get space back.","Spaza shops and salons: kettles, hair dryers and stoves fail constantly.","Landlords with flats: a dead stove plate is a week of lost rent.","Second-hand dealers who buy broken stock and need it working."],
    risks:["Electricity kills careless people. Unplug, discharge, and use one hand where you can.","Microwaves and gas appliances: say no every single time.","Parts that do not fit = the profit is gone. Photograph the old part and match it before you promise a price."],
    growth:"Charge a R80 'look at it' fee that comes off the repair price, then keep a small stock of the three parts that fail most (kettle element, stove plate, plug)."
  }
];

/* ================================================================
   LEARNING — for someone with no skill yet.
   Two ideas behind it:
     1. every idea in the list can be broken into 3 things you must be
        able to DO, and each of those can be practised at home for free;
     2. where a photo or video guide beats our words, link out — clearly
        marked "needs data" (or "zero-rated"), because the app is offline
        but a video is not.
   Every URL below was checked and returns a page. YouTube links are
   search links on purpose: they never go dead when one video is taken
   down.
   ================================================================ */
