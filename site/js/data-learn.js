/* Pusha — js/data-learn.js — RES + LEARN + METHOD — the learning layer, pure data */
const RES = {
  /* ---- South African, free, mostly just needs airtime ---- */
  sayouth:  {n:"SA Youth", w:"Free courses, learnerships and work experience. Zero-rated, so it uses no data on MTN, Vodacom, Cell C, Telkom or Rain.", u:"https://sayouth.mobi", z:1},
  harambee: {n:"Harambee", w:"The people behind SA Youth. Free work-readiness training and job connections.", u:"https://www.harambee.co.za", z:0},
  nyda:     {n:"NYDA", w:"Free business training and youth grants — bring your idea and your numbers.", u:"https://www.nyda.gov.za", z:0},
  wtc:      {n:"WeThinkCode_", w:"Free 2-year software engineering programme. No matric and no coding needed — they test aptitude, and there is a stipend.", u:"https://wethinkcode.co.za/enrol/", z:0},
  umuzi:    {n:"Umuzi", w:"Free tech and creative academy (coding, data, design). Needs matric and an aptitude test.", u:"https://www.umuzi.org", z:0},
  capaciti: {n:"CapaCiTi", w:"Free year-long tech training with placement, for unemployed 18–35s.", u:"https://www.capaciti.org.za", z:0},
  digify:   {n:"Digify Africa", w:"Free digital marketing bootcamp for unemployed 18–35s. Their app is built for low data.", u:"https://digifyafrica.com/digify-pro-online-applications/", z:0},
  veschool: {n:"Vodacom e-School", w:"Free CAPS lessons and exercises, zero-rated on Vodacom.", u:"https://www.vodacom.co.za/vodacom/services/vodacom-e-school", z:1},
  scmatric: {n:"Second Chance Matric", w:"Free support to rewrite or improve matric subjects — this is how you fix a bad symbol.", u:"https://www.education.gov.za/Programmes/SecondChanceProgramme.aspx", z:0},
  nsfas:    {n:"NSFAS", w:"Free funding for TVET college or university. Applications open once a year — check the date early, they close hard.", u:"https://www.nsfas.org.za", z:0},

  /* ---- free learning platforms, need data ---- */
  khan:     {n:"Khan Academy", w:"Free maths and science from the basics up. Start one grade below where you think you are.", u:"https://www.khanacademy.org", z:0},
  siyavula: {n:"Siyavula", w:"Free CAPS-aligned maths and science practice, made for South African schools.", u:"https://www.siyavula.com", z:0},
  mslearn:  {n:"Microsoft Learn", w:"Free, structured paths — Office, Excel, data, AI. No account needed to read.", u:"https://learn.microsoft.com/en-us/training/", z:0},
  google:   {n:"Google Digital Skills", w:"Free 40-hour digital marketing course with a Google certificate at the end.", u:"https://learndigital.withgoogle.com/digitalskills", z:0},
  fcc:      {n:"freeCodeCamp", w:"Free coding with real projects and certificates. Works on a slow connection.", u:"https://www.freecodecamp.org/learn", z:0},
  alison:   {n:"Alison", w:"Free courses — food safety, hospitality, customer service, business. Pay only if you want the printed certificate.", u:"https://alison.com", z:0},
  coursera: {n:"Coursera", w:"University courses you can sit in on for free (audit). You pay only for the certificate.", u:"https://www.coursera.org", z:0},
  hubspot:  {n:"HubSpot Academy", w:"Free marketing and sales certificates that agencies actually recognise.", u:"https://academy.hubspot.com", z:0},
  meta:     {n:"Meta Blueprint", w:"Free training on Facebook and Instagram ads and selling online.", u:"https://www.facebook.com/business/learn", z:0},
  ifixit:   {n:"iFixit", w:"Photo step-by-step repair guides for almost every phone. Slow, careful, with every screw named.", u:"https://www.ifixit.com/Guide", z:0},

  /* ---- video searches: pictures beat paragraphs for hand work ---- */
  "yt-vetkoek":{n:"Vetkoek, step by step", w:"Watch 2 or 3 videos before you buy flour. Copy one recipe exactly the first time.", u:"https://www.youtube.com/results?search_query=how+to+make+vetkoek+south+africa", z:0},
  "yt-braai":  {n:"Braaiing meat for a crowd", w:"Timing, heat control and how not to burn the outside while the inside is raw.", u:"https://www.youtube.com/results?search_query=how+to+braai+meat+for+a+crowd+south+africa", z:0},
  "yt-price":  {n:"Costing food per portion", w:"How to work out what one plate really costs you — the number that decides your price.", u:"https://www.youtube.com/results?search_query=how+to+work+out+food+cost+per+portion", z:0},
  "yt-muffins":{n:"Muffins that rise every time", w:"Oven temperature and mixing are the two things beginners get wrong.", u:"https://www.youtube.com/results?search_query=how+to+bake+muffins+for+business+south+africa", z:0},
  "yt-braid":  {n:"Box braids for beginners", w:"Parting, tension and finishing — practise on a R150 mannequin head, not a client.", u:"https://www.youtube.com/results?search_query=how+to+braid+box+braids+for+beginners", z:0},
  "yt-nails":  {n:"Gel nails at home", w:"Prep and curing are why nails lift. Watch the whole video before buying gel.", u:"https://www.youtube.com/results?search_query=how+to+do+gel+nails+at+home+for+beginners", z:0},
  "yt-fade":   {n:"A clean fade", w:"Guard sizes, guide lines and blending. Do 5 free heads before you charge.", u:"https://www.youtube.com/results?search_query=how+to+do+a+barber+fade+for+beginners", z:0},
  "yt-carwash":{n:"Washing a car without scratches", w:"Two buckets, top to bottom, and never a dry sponge on dirty paint.", u:"https://www.youtube.com/results?search_query=how+to+wash+a+car+properly+without+scratches", z:0},
  "yt-cleanbiz":{n:"Starting a cleaning business", w:"What to quote, what to bring, and how to keep the client every week.", u:"https://www.youtube.com/results?search_query=how+to+start+a+cleaning+business+south+africa", z:0},
  "yt-iron":   {n:"Ironing a shirt properly", w:"Collars, cuffs, no shine. This is the skill people pay for.", u:"https://www.youtube.com/results?search_query=how+to+iron+a+shirt+properly", z:0},
  "yt-screen": {n:"Replacing a phone screen", w:"Heat, picks, screws in order. Watch it twice, then open a dead phone first.", u:"https://www.youtube.com/results?search_query=how+to+replace+a+phone+screen+step+by+step", z:0},
  "yt-cvtyping":{n:"Running a typing and print business", w:"Layout, saving, and printing without wasting paper — waste is your profit.", u:"https://www.youtube.com/results?search_query=how+to+build+a+cv+typing+business", z:0},
  "yt-tutor":  {n:"Tutoring high-school maths", w:"How to find the gap fast and explain one thing three different ways.", u:"https://www.youtube.com/results?search_query=how+to+tutor+maths+to+high+school+learners", z:0},
  "yt-bale":   {n:"Sorting clothing bales", w:"What sells, what sits, and how to spot fakes and stains before you pay.", u:"https://www.youtube.com/results?search_query=how+to+sort+clothing+bales+south+africa", z:0},
  "yt-resell": {n:"Reselling with no stock", w:"Sell first, buy after — the way to start with R0 and no risk of dead stock.", u:"https://www.youtube.com/results?search_query=how+to+resell+online+without+stock+south+africa", z:0},
  "yt-photo":  {n:"Product photos on a phone", w:"Daylight, a plain background, and 3 edits. That is the whole job.", u:"https://www.youtube.com/results?search_query=how+to+take+product+photos+with+your+phone", z:0},
  "yt-edit":   {n:"Editing on the phone", w:"Brightness, contrast, crop. Learn those three and stop over-filtering.", u:"https://www.youtube.com/results?search_query=how+to+edit+photos+on+your+phone+for+beginners", z:0},
  "yt-spinach":{n:"Growing spinach in a small space", w:"Tyres, buckets and shade cloth. Watering is where beginners fail.", u:"https://www.youtube.com/results?search_query=how+to+grow+spinach+in+a+small+backyard+south+africa", z:0},
  "yt-farm":   {n:"Vegetables for a beginner", w:"Soil prep with what you have, and what to plant when.", u:"https://www.youtube.com/results?search_query=how+to+start+a+vegetable+garden+in+a+small+space+south+africa", z:0},
  "yt-colddrinks":{n:"A cold drink business", w:"Where to stand, how to keep stock cold, and what sells on a hot day.", u:"https://www.youtube.com/results?search_query=how+to+start+a+cold+drink+and+ice+business+south+africa", z:0},
  "yt-lunch":  {n:"Lunch delivery from home", w:"Cooking 10 plates at once, packing so it arrives hot, and timing the route.", u:"https://www.youtube.com/results?search_query=how+to+start+a+lunch+delivery+business+from+home+south+africa", z:0},
  "yt-alter":  {n:"Alterations and hems", w:"Straight hems, taking in a waist, and finishing so nobody sees the stitching.", u:"https://www.youtube.com/results?search_query=how+to+do+basic+clothing+alterations+and+hemming+for+beginners", z:0},
  "yt-mow":    {n:"A lawn service", w:"Cutting evenly, edging, and quoting a garden before you arrive.", u:"https://www.youtube.com/results?search_query=how+to+start+a+lawn+mowing+business+with+a+brush+cutter", z:0},
  "yt-drain":  {n:"Unblocking a drain", w:"How to use an auger, and how to know when the problem is bigger than you.", u:"https://www.youtube.com/results?search_query=how+to+unblock+a+drain+for+beginners", z:0},
  "yt-paint":  {n:"Painting a room properly", w:"Prep, cutting in and two coats. The preparation is 70% of the job.", u:"https://www.youtube.com/results?search_query=how+to+paint+a+room+like+a+professional+beginner", z:0},
  "yt-solar":  {n:"Cleaning solar panels", w:"Soft brush, early morning, no chemicals — and why dust costs 15–20%.", u:"https://www.youtube.com/results?search_query=how+to+clean+solar+panels+safely", z:0},
  "yt-gutter": {n:"Cleaning gutters safely", w:"Ladder angles, a second person, and never leaning a ladder on the gutter.", u:"https://www.youtube.com/results?search_query=how+to+clean+gutters+safely+on+a+house", z:0},
  "yt-sneaker":{n:"Cleaning white sneakers", w:"Soap, brush and whitener — and what bleach does to synthetics.", u:"https://www.youtube.com/results?search_query=how+to+clean+white+sneakers+properly", z:0},
  "yt-decor":  {n:"Party décor and chair hire", w:"Backdrops, chairs and the deposit rules that keep your stock yours.", u:"https://www.youtube.com/results?search_query=how+to+start+a+party+decor+and+chair+hire+business", z:0},
  "yt-partypack":{n:"Party packs for kids", w:"What goes in a R35 pack, and how to build 20 in an hour.", u:"https://www.youtube.com/results?search_query=how+to+make+party+packs+for+kids+parties", z:0},
  "yt-aftercare":{n:"An after-school club", w:"Structure, snacks, homework time and how to keep parents informed.", u:"https://www.youtube.com/results?search_query=how+to+run+an+after+school+care+homework+club", z:0},
  "yt-social": {n:"Social media for small shops", w:"What to post, how often, and how to show a shop it worked.", u:"https://www.youtube.com/results?search_query=how+to+manage+social+media+for+small+businesses+beginners", z:0},
  "yt-logo":   {n:"Designing on your phone", w:"Free tools, free fonts, and making a logo that reads at small sizes.", u:"https://www.youtube.com/results?search_query=how+to+design+a+logo+on+your+phone+free", z:0},
  "yt-scrap":  {n:"Scrap metal in South Africa", w:"What dealers buy, how it is weighed — and the registration rules.", u:"https://www.youtube.com/results?search_query=how+to+start+a+scrap+metal+business+south+africa", z:0},
  "yt-quote":  {n:"Quoting a small job", w:"How to price labour, materials and travel without undercutting yourself.", u:"https://www.youtube.com/results?search_query=how+to+quote+a+job+for+a+small+painting+or+cleaning+job", z:0},
  "yt-kettle": {n:"Fixing a kettle", w:"Testing the element and the switch, and when it is not worth repairing.", u:"https://www.youtube.com/results?search_query=how+to+fix+a+electric+kettle+at+home", z:0},
  "yt-multimeter":{n:"Using a multimeter", w:"Continuity, voltage and resistance — the three tests that find most faults.", u:"https://www.youtube.com/results?search_query=how+to+test+appliances+with+a+multimeter+for+beginners", z:0},
  "yt-delivery":{n:"Delivery work with a bicycle", w:"Routes, times, keeping the food upright and the customer informed.", u:"https://www.youtube.com/results?search_query=how+to+start+delivering+with+a+bicycle+makro", z:0}
};

/* skills = the 3 things you must be able to DO.
   steps  = free practice you can do at home this week.
   res    = where to see it done, or learn it properly.               */
const LEARN = {
  kota: {zero:1,
    skills:["Fry a vetkoek that is cooked through","Cost one kota to the rand","Keep food safe at a stand"],
    steps:["Make 10 vetkoeks at home for the family. Cut one open — if the middle is doughy your oil is too hot, not too cold.",
           "Write every item in one kota and what it costs you. Add 50%. That is your price.",
           "Practise wrapping 10 kotas in 5 minutes. Speed is the whole business at a taxi rank."],
    res:["yt-vetkoek","yt-price","alison","sayouth"]},

  braai: {zero:0,
    skills:["Braai meat evenly on a small grill","Build a plate that looks full","Buy meat at the right price per kg"],
    steps:["Braai for the family twice and time every piece — chicken takes longest, boerewors is fastest.",
           "Build one plate and photograph it. If it does not look full, add salad and a roll, never more meat.",
           "Compare the same cut at three shops on one day and write down the cheapest price per kg."],
    res:["yt-braai","yt-price","alison"]},

  baking: {zero:1,
    skills:["Bake muffins that rise every time","Price per muffin, not per tray","Pack so they survive a taxi"],
    steps:["Bake one tray a day for three days with the same recipe. Change nothing — you are learning your oven, not a new recipe.",
           "Weigh your flour and sugar once with a R40 kitchen scale. Guessing is why some trays fail.",
           "Pack six in a paper bag and shake it in a taxi. Fix your packing until nothing breaks."],
    res:["yt-muffins","yt-price","alison"]},

  braid: {zero:0,
    skills:["Box braids neat and even","Nails that do not lift","Clean tools between clients"],
    steps:["Braid three friends for free. Time yourself and keep before/after photos for your status.",
           "Buy a mannequin head (about R150) and part it 20 times before you touch a paying head.",
           "Learn to sanitise clippers and tools between clients — that is what keeps clients coming back."],
    res:["yt-braid","yt-nails","sayouth"]},

  barber: {zero:0,
    skills:["A fade with no lines","Clipper care and sharpening","Cut hair at a client's home"],
    steps:["Cut five free fades on friends. Photograph every one — your phone is your shop window.",
           "Learn your own clipper: which guard, which direction, how to zero-gap it.",
           "Practise setting up and packing up in 10 minutes. Mobile work is a speed business."],
    res:["yt-fade","sayouth","nyda"]},

  wash: {zero:1,
    skills:["Wash a car without scratching it","Two-bucket method and proper drying","Turn one wash into a weekly customer"],
    steps:["Wash the same car three times. Look for swirl marks in direct sunlight — that is you damaging paint.",
           "Time yourself: a sedan should take 35–45 minutes including wheels.",
           "Ask ten neighbours for a weekly R60 wash. Sell the repeat, not the once-off."],
    res:["yt-carwash","sayouth","nyda"]},

  clean: {zero:1,
    skills:["Clean a kitchen to a standard","Quote a house correctly","Use chemicals safely"],
    steps:["Deep-clean your own kitchen and time it. That time, plus travel, is your quote.",
           "Learn dilution: one cap of bleach to five litres. Stronger ruins paint and your lungs.",
           "Do two free houses, photograph before and after, then start charging R250."],
    res:["yt-cleanbiz","alison","sayouth"]},

  laundry: {zero:1,
    skills:["Iron a shirt with no shine","Sort colours and fabrics","Pick up and deliver without losing anything"],
    steps:["Iron five shirts. A damp cloth over the collar stops the shine.",
           "Tag every item with the client's name. One lost shirt costs you that client forever.",
           "Do one free pickup for a neighbour and time the whole round trip, door to door."],
    res:["yt-iron","sayouth","alison"]},

  phones: {zero:0,
    skills:["Swap a screen without breaking anything","Test a phone properly before you buy it","Source parts at a fair price"],
    steps:["Open a dead phone and put it back together — twice. Never practise on a client's phone.",
           "Learn the test list by heart: touch, camera, speaker, mic, charging, network, IMEI.",
           "Buy one screen and swap it yourself. If you cannot yet, do not advertise the service."],
    res:["yt-screen","ifixit","sayouth"]},

  print: {zero:1,
    skills:["Type a CV in 20 minutes","Save and print without errors","Charge so the paper still makes a profit"],
    steps:["Type your own CV, then three friends' CVs for free. Speed only comes from repetition.",
           "Learn one free tool properly (Google Docs) — it opens on any phone and any computer.",
           "Price it: A4 print is about R1.50–2.50 a page. Charge R10 a page typed and printed."],
    res:["yt-cvtyping","google","sayouth"]},

  tutor: {zero:1,
    skills:["Explain one topic three ways","Find where a learner is stuck","Set a fee and a time limit"],
    steps:["Pick your best subject and teach one topic to a younger learner for free — then ask them to explain it back.",
           "Use a 5-question test to find the exact gap, then fix only that gap. Do not re-teach the whole book.",
           "Run two weeks free, then charge R150 an hour for a group of three."],
    res:["siyavula","khan","veschool","yt-tutor"]},

  resell: {zero:0,
    skills:["Spot what will sell in a bale","Price and display a rail","Judge quality in 10 seconds"],
    steps:["Sort a friend's bale with them and watch what does not sell. That is your real lesson.",
           "Hang twenty items and put the best five at eye level. Photograph the rail and compare it to a shop.",
           "Sell 20 single items before you buy a whole bale. Learn on small money, not big money."],
    res:["yt-bale","yt-resell","sayouth"]},

  online: {zero:1,
    skills:["Take a photo that sells","Write five lines that answer every question","Take an order without holding stock"],
    steps:["Photograph ten items on a white sheet in daylight. No flash, no filters.",
           "Write the five lines every buyer wants: what it is, size, condition, price, how to collect.",
           "Post three things you already own and sell them before you spend a cent on stock."],
    res:["yt-photo","yt-resell","meta"]},

  veg: {zero:0,
    skills:["Prepare soil with what you have","Water and feed correctly","Sell greens in your own street"],
    steps:["Plant ten spinach seedlings in used tyres or buckets. Watch what actually happens for three weeks.",
           "Water early morning; test by pushing a finger 5cm into the soil. Dry at 5cm means water more.",
           "Sell one bunch to five neighbours before you plant a hundred. Demand first, then planting."],
    res:["yt-spinach","yt-farm","nyda"]},

  runner: {zero:1,
    skills:["Plan a route that saves taxi fare","Handle other people's cash safely","Be the reliable one for one shop"],
    steps:["Do one delivery free and time it. Add the taxi fare and your time — that is your real cost per drop.",
           "Agree a per-drop price with three small shops, not a per-trip price. Drops are what you sell.",
           "Set a rule: customer money in one pocket, your money in another, counted at every drop."],
    res:["yt-delivery","sayouth","nyda"]},

  photo: {zero:0,
    skills:["Shoot in daylight with a phone","Edit three things only","Deliver the same night"],
    steps:["Shoot 100 photos of one object next to a window. No flash, ever.",
           "Learn three edits only: brightness, contrast, crop. That is enough to look professional.",
           "Do one free shoot and deliver it the same night — that promise is what you sell."],
    res:["yt-photo","yt-edit","digify"]},

  juice: {zero:1,
    skills:["Keep stock cold with no power","Sell fast at a queue","Count crates and cash every day"],
    steps:["Freeze water bottles and use them in a cooler box for a day. That is how you survive load-shedding.",
           "Stand at the taxi rank for two hours and count how many people buy a cold drink versus a snack.",
           "Keep a notebook: crates in, crates out, money counted. Missing R50 a day is R1,500 a month."],
    res:["yt-colddrinks","yt-quote","sayouth"]},

  lunch: {zero:0,
    skills:["Cook 10 plates at the same time","Cost a plate to the rand","Collect the money weekly"],
    steps:["Cook one dish for eight people at home and time it from washing up to sealing the last container.",
           "Write the cost of every ingredient in one plate and add 40%. Anything less and transport eats you.",
           "Take the whole week's payment on Sunday from three test clients. Never run a tab."],
    res:["yt-lunch","yt-price","alison"]},

  alter: {zero:0,
    skills:["Sew a straight hem","Take in a waist","Price a job and keep to it"],
    steps:["Hem three pairs of your own trousers, then unpick one and do it again. Straight is the whole skill.",
           "Practise on old shirts from a bale: take in the sides, then try it on a real person.",
           "Write a price list (hem R80, waist R120, zip R150) and do not negotiate it at the door."],
    res:["yt-alter","yt-quote","sayouth"]},

  mow: {zero:0,
    skills:["Cut a lawn evenly","Service a brush cutter","Quote a garden on sight"],
    steps:["Cut your own yard in lines and look at it from the gate. Patchy work is why you do not get called back.",
           "Learn to strip, clean and refit the air filter and spark plug — most 'broken' machines are just dirty.",
           "Quote three yards in your street before you buy a machine, so you know the work exists."],
    res:["yt-mow","yt-quote","nyda"]},

  plumb: {zero:0,
    skills:["Unblock a sink or drain","Replace a tap washer","Know what you must not touch"],
    steps:["Fix the leaking tap at home, then a neighbour's, with a R15 washer and teflon tape. Time yourself.",
           "Unblock a sink using a cup plunger before you buy an auger — most blocks do not need the machine.",
           "Learn the list you must refuse: geysers, gas lines, the municipal main. Say it out loud until it is easy."],
    res:["yt-drain","yt-quote","sayouth"]},

  paint: {zero:0,
    skills:["Prep and mask a room","Cut in a straight line","Quote per room, not per day"],
    steps:["Paint one wall at home: fill, sand, tape, mist coat, two coats. Feel the difference prep makes.",
           "Practise cutting in along a ceiling with a 50mm brush — 20 minutes a day for a week.",
           "Measure a room and work out litres needed. Guessing litres is how painters lose money."],
    res:["yt-paint","yt-quote","alison"]},

  gutter: {zero:0,
    skills:["Work safely on a ladder","Clean a panel without damaging it","Sell a yearly contract"],
    steps:["Set a ladder at the correct angle (1 out for every 4 up) and get on and off it 20 times before you go near a client.",
           "Clean one panel at home in the early morning with plain water and a soft brush. Look at your electricity meter before and after.",
           "Time one house. That time, plus travel, is your quote — and it takes 20 minutes to sell a yearly clean."],
    res:["yt-solar","yt-gutter","yt-quote"]},

  shoe: {zero:0,
    skills:["Clean white sneakers","Treat suede and fabric correctly","Run a Friday-to-Monday drop-off"],
    steps:["Clean your own white sneakers three ways (soap, paste, whitener) and keep the one that works.",
           "Patch-test on the tongue of an old pair first. Bleach on synthetics cannot be undone.",
           "Photograph every pair at drop-off, with the customer watching, and send the photo on WhatsApp."],
    res:["yt-sneaker","yt-photo","sayouth"]},

  decor: {zero:0,
    skills:["Hang a backdrop that stays up","Get 30 chairs back in one piece","Take a deposit and hold it"],
    steps:["Set up one backdrop in your own yard, photograph it, and take it down. Note what fell down.",
           "Hire 10 chairs from another decor company and deliver them yourself — you learn the whole job for R150.",
           "Write your rules on one page: 50% deposit, balance before the last chair leaves, replacement cost per chair."],
    res:["yt-decor","yt-quote","nyda"]},

  party: {zero:1,
    skills:["Face paint safely","Build 10 packs in an hour","Sell to creches by the child"],
    steps:["Buy kid-safe water-based paint and paint 5 children free at home. Ask the parent about allergies first.",
           "Build 10 packs with a R16 budget each, and time it. If it takes two hours, simplify the pack.",
           "Walk into two creches with a photo album and a per-child price with a minimum of 10."],
    res:["yt-partypack","yt-photo","sayouth"]},

  aftercare: {zero:0,
    skills:["Supervise homework without doing it","Keep a safe, lockable space","Handle parents and monthly money"],
    steps:["Run a free trial afternoon with two neighbour children: snack, homework, 20 minutes play, handover.",
           "Write a one-page consent form (name, allergies, who may fetch, emergency number) before you take a third child.",
           "Ask your municipality and the local Social Development office what registration needs — go in person, take notes."],
    res:["yt-aftercare","veschool","sayouth"]},

  social: {zero:1,
    skills:["Post three times a week, every week","Shoot a before and after","Read the numbers"],
    steps:["Take over one shop's dead page for a free month. Post 12 times with a simple before/after format.",
           "Learn one free tool (Meta Business Suite) and schedule a week of posts in one sitting.",
           "Show the shop the insights page at the end of the month. Numbers, not compliments, get you paid."],
    res:["yt-social","google","meta"]},

  design: {zero:1,
    skills:["Make a logo that reads small","Design a poster people can read in 2 seconds","Package and price the work"],
    steps:["Redesign three logos you hate, using free tools. Keep them and compare after a week.",
           "Design one poster for a real shop, print it at R3, and look at it from 3 metres away.",
           "Set packages (logo R250, poster R120, 10 social posts R500) and one round of changes included."],
    res:["yt-logo","google","yt-photo"]},

  scrap: {zero:1,
    skills:["Sort metal, e-waste and cardboard","Weigh and price a load","Know the law before you buy"],
    steps:["Collect from your own street for one week and sort into steel, aluminium, e-waste and cardboard.",
           "Weigh one load at a registered dealer and write down what each type paid per kg. That is your price list.",
           "Read the Second-Hand Goods Act summary and never touch cut copper or fibre — it is stolen, and it is your name on the charge."],
    res:["yt-scrap","sayouth","nyda"]},

  repair: {zero:0,
    skills:["Test a fault with a multimeter","Replace a kettle element or stove plate","Know what is too dangerous"],
    steps:["Ask neighbours for three broken kettles and irons. Open them, find the fault, and write it down.",
           "Learn three tests: continuity, voltage and resistance. Most appliances fail on a switch or an element.",
           "Say the refusal list out loud: microwaves (capacitor), gas appliances (registration), geysers (registered plumber)."],
    res:["yt-kettle","yt-multimeter","sayouth"]}
};

/* the "start with nothing" method — same for every idea */
const METHOD = [
  ["Pick one thing, not five","Choose the idea you can start this week with what is already in the house. Doing one badly beats planning five."],
  ["Watch it done, then do it badly","Watch two videos, then do it immediately with cheap material. The first three attempts are practice, not product."],
  ["Do it for 3 people free","Friends, family, neighbours. You are buying feedback and photos, and you are learning under no pressure."],
  ["Charge the 4th person","Once you can do it twice the same way, charge. A low price is not humble — it tells people it is worth nothing."],
  ["Fix the one thing that went wrong","Every job has one weak spot. Fix that one thing before you take on more work."]
];

/* the panel that goes inside every idea */
function learnBlock(id){
  const L = LEARN[id]; if (!L) return "";
  return `
  <div class="learnbox">
    <div class="lbhead">${ico("sparkle","sm")}<b>${t("lrn_title")}</b>${L.zero ? `<span class="pillz">${t("lrn_zero")}</span>` : ""}</div>
    <div class="lblabel">${t("lrn_skills")}</div>
    <div class="skillrow">${L.skills.map(s => `<span class="skl">${s}</span>`).join("")}</div>
    <div class="lblabel">${t("lrn_practise")}</div>
    <ol class="steps">${L.steps.map(s => `<li>${s}</li>`).join("")}</ol>
    <div class="lblabel">${t("lrn_where")}</div>
    <div class="reslist">${L.res.map(resLink).join("")}</div>
    <p class="tiny muted" style="margin:8px 0 0">${t("lrn_note")}</p>
  </div>`;
}

function resLink(id){
  const r = RES[id]; if (!r) return "";
  const kind = /youtube\.com/.test(r.u) ? "play" : /ifixit\.com/.test(r.u) ? "grid4" : "book";
  const kindText = kind === "play" ? t("lrn_video") : kind === "grid4" ? t("lrn_photos") : t("lrn_course");
  const tag = r.z ? `<span class="rz">${t("lrn_zero_rated")}</span>` : `<span class="rd">${t("lrn_data")}</span>`;
  return `<a class="res" href="${r.u}" target="_blank" rel="noopener noreferrer">
      <span class="rt">${ico(kind,"sm")}<span class="rn">${r.n}</span>${tag}</span>
      <span class="rw"><b class="rk">${kindText}</b> · ${r.w}</span>
    </a>`;
}

/* the big "no skill yet" sheet, opened from the Ideas tab */
function learnSheet(){
  $("#sheetBody").innerHTML = `
    <div class="h1row"><h2 style="margin:0">${t("lrn_start_title")}</h2>
      <svg class="icon startic" aria-hidden="true"><use href="#i-foundation"/></svg></div>
    <div class="lblabel">${t("lrn_method")}</div>
    <ol class="steps big">${METHOD.map((m, i) => `<li><b>${m[0]}</b><br>${m[1]}</li>`).join("")}</ol>
    <div class="lblabel" style="margin-top:16px">${t("lrn_free_sa")}</div>
    <div class="reslist">${["sayouth","harambee","nyda","wtc","umuzi","capaciti","digify","veschool","scmatric","nsfas"].map(resLink).join("")}</div>
    <div class="lblabel" style="margin-top:16px">${t("lrn_free_world")}</div>
    <div class="reslist">${["google","mslearn","khan","siyavula","fcc","alison","coursera","hubspot","meta","ifixit"].map(resLink).join("")}</div>
    <p class="tiny muted" style="margin:12px 0 0">${t("lrn_note")}</p>
    <button class="btn ghost" id="learnClose" style="margin-top:12px">${t("btn_close")}</button>`;
  $("#learnClose").addEventListener("click", closeSheet);
  openSheet();
}


