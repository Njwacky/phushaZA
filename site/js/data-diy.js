/* Pusha — js/data-diy.js — 10 things a person can make and sell
   -----------------------------------------------------------------
   For people who do not want to study further, or cannot afford to. Each
   project: what it costs, what to buy, what to do with your hands, where
   to sell it, and what goes wrong. No machine, no studio, no account.
   Rand figures are estimates for November 2026 — the app says so.        */

const DIY = [
{
  id: "paperbeads",
  name: "Paper-bead jewellery",
  tag: "Old magazines into jewellery",
  price: [60, 140], time: "1½ h per set",
  need: [["Old magazines, flyers or newspaper", 0], ["Clear craft glue (50 ml)", 18], ["Thin string, elastic or beading thread", 12], ["Nail varnish or craft varnish (to seal)", 0]],
  steps: [
    "Tear out pages with colour and pattern — food, adverts and photo pages work best. Cut long thin triangles: 12 mm at the wide end, 2 mm at the point, about 20 cm long.",
    "Put a thin line of glue along the wide end. Start from the wide end and roll the paper around a matchstick or thin knitting needle, tight and even.",
    "Slide the bead off the stick. The narrow tip should glue down flat. Make 25–40 beads and leave them to dry for an hour.",
    "Paint them with clear varnish and dry again — this is what stops sweat and rain from ruining them.",
    "Thread them: necklace first, then matching earrings. Tie a knot, add a clasp or just a long loop you can slip over your head.",
    "Photograph on a plain white sheet in daylight, on a friend's neck, next to a ruler so people can see the size."
  ],
  sell: "Church and stokvel groups, WhatsApp status, Facebook Marketplace, school tuckshops, and the salon where you get your hair done — ask to leave a small stand.",
  watch: "Loose rolls look cheap. Roll tight and use the same bead size through one piece. Do not sell the first five you make — wear them and see what breaks.",
  safety: "Varnish and glue: open a window, and keep it away from children.",
  art: ["magazines", "rolling", "necklace"]
},
{
  id: "wirename",
  name: "Copper-wire name art",
  tag: "Names bent from copper wire",
  price: [120, 280], time: "40 min per name",
  need: [["Copper or aluminium craft wire, 2 mm (10 m)", 65], ["Round-nose pliers", 45], ["Side cutters", 35], ["A4 paper and a pen", 0]],
  steps: [
    "Write the name in big, joined handwriting on paper — one line, letters touching, so the wire never has to be cut.",
    "Cut about 1,2 m of wire. Start at the first letter and lay the wire along your drawing, bending with your fingers for curves and pliers for sharp corners.",
    "Bend one continuous piece. Where the letter lifts (the dot of an i, the top of an e), leave a small loop instead of a gap.",
    "When the name is done, curl the two ends into small spirals so it hangs neatly and has no sharp tips.",
    "Bend a hook or a small ring at the top so it can hang on a wall or a chain.",
    "Wipe with a cloth. Sell it mounted on card with the person's name written underneath."
  ],
  sell: "Parents buying for matric dances and birthdays, wedding stalls, decor shops, and Instagram/WhatsApp where you post a video of the wire bending — people love watching it made.",
  watch: "Wire that is too thin hangs crooked; too thick and your hands will ache. Practise on the first two metres before you sell anything. Aluminium bends easily and is cheaper; copper sells better and photographs warmer.",
  safety: "Cut wire ends fly — wear glasses and cut away from your face.",
  art: ["wirecoil", "bending", "wirename"]
},
{
  id: "beadcharms",
  name: "Beaded keyrings & phone charms",
  tag: "Small, fast, kids love them",
  price: [35, 75], time: "15 min each",
  need: [["Mixed beads (a 500 g bag)", 50], ["Keyring split rings and clips (20)", 25], ["Strong nylon thread or 0,6 mm elastic", 15], ["Small scissors or nail clippers to cut thread", 0], ["Blank cards to pin them on", 10]],
  steps: [
    "Sort your beads into colours on a plate — one pile of shiny, one of matte, one of letters (the letter beads are what makes them personal).",
    "Plan the pattern on the table before you thread anything: three small, one big, three small.",
    "Thread on doubled nylon, tie a double knot, and pull tight — a single knot pulls through beads and the whole thing comes apart in a pocket.",
    "Add a split ring or a phone clip at the top. For a phone charm, add a small loop of cord that fits a phone case hole.",
    "Make sets of three in the same colours — they sell faster as a set than one by one.",
    "Pin them to a card with your WhatsApp number written on the back. That card is your shop."
  ],
  sell: "School gates at home time, taxi ranks (keep eyes on your stock), church, and any WhatsApp group where a parent is asking what to buy for a party pack.",
  watch: "Cheap elastic snaps in the sun. Use nylon doubled and test by hanging your keys on one for a week.",
  safety: "Beads are a choking danger for under-3s — write that on the card.",
  art: ["beads", "threading", "charms"]
},
{
  id: "tasselhanging",
  name: "Tassel wall hanging",
  tag: "Wool on a wooden dowel",
  price: [250, 450], time: "3 h",
  need: [["Chunky wool or cotton yarn, 2–3 balls", 70], ["Wooden dowel or a straight stick, 50 cm", 20], ["Strong string or twine", 10], ["Scissors and a ruler", 0]],
  steps: [
    "Cut the dowel to length and sand the ends with a nail file. Tie the hanging string to both ends in a triangle.",
    "Wrap wool around a 15 cm piece of cardboard 30 times. Slide it off, tie a tight knot around the top third, and cut the bottom loop open. That is one tassel.",
    "Make 12 tassels the same length. Trim the bottoms together in one straight cut — uneven tassels are the whole difference between homemade and handmade.",
    "Lay the dowel flat. Tie each tassel on with a double knot, measuring from the ends so the gaps are even.",
    "Hang it on a wall and stand back. Adjust any tassel that sits higher or lower, and trim again.",
    "Photograph it against a plain wall, with something for scale, and list the size in centimetres."
  ],
  sell: "Home decor pages on Facebook, salons, baby showers, and markets. Big pieces sell best in person — people need to see the length.",
  watch: "Wool sheds for the first week. Shake it out hard twice before you hand it over. If you cannot tie evenly, do fewer, bigger tassels.",
  safety: "Nothing dangerous here — just keep pins and nails off the floor.",
  art: ["wool", "wrapping", "tassels"]
},
{
  id: "stringart",
  name: "String art on a board",
  tag: "Nails and wool on a board",
  price: [150, 300], time: "2½ h",
  need: [["Wooden board, 25 × 25 cm (pallet wood is free)", 0], ["Panel pins or small nails (200)", 30], ["Wool or embroidery thread, 2 colours", 35], ["Hammer", 0], ["Sandpaper", 12]],
  steps: [
    "Sand the board smooth. Print or draw your shape on paper at the size of the board and tape it on.",
    "Hammer a nail every 1 cm along your outline, through the paper, leaving about 8 mm standing out. Keep the height even.",
    "Tear the paper off carefully — do not pull the nails out with it.",
    "Tie one end of the wool to a nail and start criss-crossing. Go back and forth across the shape, not around the edge, until it is filled.",
    "Tie the end off on a nail at the back, and add a second colour for the outline if you like.",
    "Add a picture hanger or a loop of string at the back and it is finished."
  ],
  sell: "Decor shops, markets, and gifts for birthdays — initials and hearts sell fastest. Ask the person for their colours before you make it.",
  watch: "Ugly shapes come from too few nails. If the outline looks jagged, add nails halfway between the ones you have.",
  safety: "Nails and a hammer: hammer on a hard floor, not on your lap, and sweep up afterwards.",
  art: ["board", "nails", "stringart"]
},
{
  id: "candles",
  name: "Scented candles in tins",
  tag: "Recycled tins, new wax",
  price: [60, 120], time: "2 h for 8",
  need: [["Soy or paraffin candle wax, 1 kg", 95], ["Cotton wicks with metal bases (10)", 35], ["Fragrance oil (10 ml)", 45], ["Old tins, jars or tea cups, cleaned", 0], ["A pot, a heat-proof jug and a wooden skewer", 0]],
  steps: [
    "Clean and dry every tin. Dent the wick base onto the bottom centre with a drop of hot wax, then wrap the top of the wick around a skewer across the tin so it stands straight.",
    "Melt the wax in a jug standing in a pot of hot water (never over a flame directly). Stir slowly and keep the water under a simmer.",
    "When the wax is fully melted, take it off the heat, wait 2 minutes, then add 10 ml fragrance per kilogram of wax and stir for 30 seconds.",
    "Pour slowly into the tins, leaving 1 cm at the top. Pouring too fast traps air and makes a dip in the middle.",
    "Leave to set somewhere level and cool for 4 hours. Do not put them in the fridge — they crack.",
    "Trim each wick to 5 mm, put the lid on, and write the scent and burn time on a paper label."
  ],
  sell: "Gifts for Mother's Day, birthdays and weddings, guest houses, and hair salons that want to smell nice. Sell in sets of two or three.",
  watch: "The first candle you sell will make or break you: if it tunnels or smells like nothing, nobody comes back. Test one from every batch yourself.",
  safety: "Wax and hot water burn skin. Use a pot you do not eat from, keep water away from the wax, and never leave melting wax alone. Label every candle: never leave a burning candle alone.",
  art: ["waxsupplies", "pouring", "tincandles"]
},
{
  id: "soap",
  name: "Melt-and-pour soap bars",
  tag: "One kilo makes 10 bars",
  price: [25, 45], time: "1½ h for 10",
  need: [["Melt-and-pour soap base, 1 kg (clear or white)", 85], ["Soap colour (a few drops)", 20], ["Fragrance or essential oil", 35], ["Silicone moulds or clean plastic containers", 0], ["Rubbing alcohol in a spray bottle (optional)", 15]],
  steps: [
    "Cut the soap base into small blocks and melt it in a jug over hot water, or in short bursts in a microwave, stirring every 20 seconds.",
    "Take it off the heat and stir in colour, one drop at a time, then fragrance — about 5 ml per kilogram.",
    "Spray the mould lightly with alcohol, then pour slowly. Trapped bubbles are what make soap look cheap.",
    "Spray the surface again and leave to set for 2 hours at room temperature.",
    "Pop them out, cut any rough edges with a warm knife, and wrap in cling film or paper with a band around the middle.",
    "Write the scent on the band, and keep one bar back to test on your own hands for a week."
  ],
  sell: "Church and school fundraisers, guest houses, markets, and gift hampers at Christmas — soap is the easiest thing to add to somebody else's hamper.",
  watch: "Fragrance that is too strong gives people a headache; colour that is too much stains a face cloth. Start weak — you can make a stronger batch next time, but you cannot fix a batch that is too strong.",
  safety: "Melted soap base is hot. Do not use food bowls for soap, and keep essential oils away from eyes and children.",
  art: ["soapbase", "moulds", "soapbars"]
},
{
  id: "planters",
  name: "Cement planters",
  tag: "Concrete pots, plastic moulds",
  price: [80, 180], time: "2 days drying",
  need: [["Cement, 25 kg bag", 95], ["Sharp sand (a bucket)", 25], ["Plastic tubs, bottles or bowls as moulds", 0], ["Cooking oil and a brush", 0], ["Sandpaper", 12]],
  steps: [
    "Oil the inside of your mould (an ice-cream tub, a cut bottle, a plastic bowl) so the pot comes out cleanly.",
    "Mix 1 part cement to 2 parts sand, add water a little at a time and stir until it looks like thick porridge — not runny.",
    "Pour or spoon it into the mould and tap the sides to let air out.",
    "For a pot with a hole, push a small oiled bottle or pipe into the centre and hold it with tape.",
    "Cover with plastic and leave for 24 hours. Unmould gently, then leave another 24 hours before you sand the edges.",
    "Wipe with a damp cloth, and paint a band or a pattern if you like. Plant something in one so buyers see it used."
  ],
  sell: "Nurseries and garden shops buy them in sets, coffee shops want them for tables, and everyone moving into a new flat wants three small ones. Sell as a set of three sizes.",
  watch: "Wet cement cracks if it dries too fast. Do not leave a fresh pot in the sun or wind, and do not skip the 24 hours.",
  safety: "Cement dust is harmful to breathe and burns skin. Mix outdoors or by an open window, wear a mask, gloves, and wash cement off your skin — never let it dry on you.",
  art: ["cementbag", "mixing", "planters"]
},
{
  id: "saltdough",
  name: "Salt-dough ornaments & keyrings",
  tag: "Flour, salt, water, paint",
  price: [25, 60], time: "1 h + drying",
  need: [["Flour (2 cups)", 8], ["Salt (1 cup)", 4], ["Water (1 cup)", 0], ["Acrylic paint and a brush", 25], ["Keyring rings and ribbon", 15], ["A straw, a fork and a knife", 0]],
  steps: [
    "Mix 2 cups flour, 1 cup salt and about 1 cup water. Knead for 5 minutes until it stops sticking to your hands.",
    "Roll it out 6 mm thick and cut shapes with a glass, a bottle cap or a knife.",
    "Make the hanging hole with a straw before it dries — you cannot make it afterwards.",
    "Dry flat for 24–48 hours, turning once, or bake at 100 °C for 2 hours with the oven door slightly open. Slow drying means no cracks.",
    "Paint with acrylic, let it dry, and paint a second coat on the side that shows.",
    "Thread ribbon or a keyring ring through, and varnish if you want it to survive a handbag."
  ],
  sell: "Christmas markets, school events, gift tags for other people's hampers, and name ornaments for families — write names on them while people wait.",
  watch: "Dough that is too wet puffs and cracks. If it sticks, add flour a spoon at a time, not water.",
  safety: "It is food: keep it away from pets, and do not eat it after it has been painted.",
  art: ["doughball", "cutting", "ornaments"]
},
{
  id: "wordart",
  name: "Hand-lettered quote cards",
  tag: "Hand-lettered prints",
  price: [80, 200], time: "30 min each",
  need: [["Good paper or card, A4 (20 sheets)", 35], ["Black fineliner pen and one colour", 25], ["Old frames from a charity shop or a second-hand shop", 20], ["A ruler and a pencil", 0]],
  steps: [
    "Write your quote in pencil first, using a ruler for a straight bottom line. Short quotes sell: five to nine words.",
    "Draw the letters as boxes first — block letters are easier and look more valuable than shaky handwriting.",
    "Go over the pencil with the fineliner. Thick strokes down, thin strokes up: that is the whole trick of lettering.",
    "Add one shape — a sun, a leaf, a small heart — in your colour so it is not just words.",
    "Rub out the pencil once the ink is dry, and sign the bottom in small letters.",
    "Frame it, or sell it unframed and rolled with a paper band. Framed sells for double."
  ],
  sell: "Frames make the price. Sell framed at markets and hairdressers, unframed to students. Take orders: people want their own names and their own words.",
  watch: "Do not copy a quote somebody else is selling in the same town. Write your own lines, or use old proverbs everybody knows.",
  safety: "Nothing dangerous — but keep ink off walls and clothes.",
  art: ["paperpen", "lettering", "framedprint"]
}
];

const DIY_TOTAL = DIY.length;
