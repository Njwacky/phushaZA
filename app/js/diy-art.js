/* Pusha — js/diy-art.js — the drawings for the make-and-sell projects
   --------------------------------------------------------------------
   Every picture is drawn here as plain SVG: no photos, no downloads, no
   external files. That keeps the app honest (nothing to fetch, nothing to
   phone home) and keeps the single file small — all 30 drawings together
   are smaller than one photo.
   Style: paper panel, ink outline, one gold accent, one green accent.     */

const DIY_ART = (function(){
  const INK = "#0e211b", GOLD = "#c8891f", GREEN = "#0b5c46", PAPER = "#fdfcf9", SOFT = "#c9c3b4";

  const panel = inner =>
    '<svg viewBox="0 0 320 190" role="img" aria-hidden="true" style="width:100%;height:auto;display:block;border-radius:14px;background:#f7f5ef">' +
    '<rect x="0.5" y="0.5" width="319" height="189" rx="14" fill="#fdfcf9" stroke="#e4e2d9"/>' + inner + '</svg>';

  const p = (d, c = INK, w = 3) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const r = (x, y, w, h, fill = "none", c = INK, rx = 5, sw = 3) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${c}" stroke-width="${sw}"/>`;
  const c = (cx, cy, rad, fill = GOLD, c2 = "none", sw = 3) =>
    `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${fill}" stroke="${c2}" stroke-width="${sw}"/>`;
  const l = (x1, y1, x2, y2, c2 = INK, w = 3) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c2}" stroke-width="${w}" stroke-linecap="round"/>`;
  const dot = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="2.5" fill="${SOFT}"/>`;

  /* scissors, used in a few panels */
  const scissors = (x, y) =>
    p(`M${x} ${y}l26 20M${x + 4} ${y + 22}l22 -20`) +
    c(x - 4, y - 3, 6, "none", INK, 2.5) + c(x + 1, y + 26, 6, "none", INK, 2.5);

  return {

  /* ---------------- 1. paper-bead jewellery ---------------- */
  magazines: panel(
    r(40, 58, 104, 92, "#fff", INK, 4) + r(34, 66, 104, 92, "#fff", INK, 4) +
    r(34, 66, 104, 16, GOLD, INK, 4, 2.5) +
    p("M46 100h80M46 112h60M46 124h72M46 136h44", SOFT, 2.5) +
    r(160, 74, 104, 92, "#fff", INK, 4) + r(160, 74, 104, 14, GREEN, INK, 4, 2.5) +
    p("M172 104h56M172 116h70M172 128h48M172 140h64", SOFT, 2.5) +
    scissors(224, 20)
  ),
  rolling: panel(
    // a strip of paper, and the bead it turns into, on a stick
    p("M40 128l118 -34 10 22 -118 34z", "#fff") + p("M40 128l118 -34 10 22 -118 34z", INK, 2.5) +
    p("M52 126l96 -28M58 134l96 -28", SOFT, 1.6) +
    l(196, 116, 286, 90, INK, 4) +
    `<ellipse cx="216" cy="110" rx="24" ry="18" fill="${GOLD}" stroke="${INK}" stroke-width="3"/>` +
    p("M204 98c8 6 18 8 26 4", INK, 2) +
    p("M258 66c8 10 8 22 0 30", INK, 2.5) + p("M244 66c8 10 8 22 0 30", INK, 2.5) +
    r(38, 146, 52, 26, "#fff", INK, 5, 2.5) + c(120, 158, 4, GREEN) + c(136, 152, 3, GOLD)
  ),
  necklace: panel(
    p("M78 46c0 66 164 66 164 0", INK, 3) +
    c(112, 92, 8) + c(134, 100, 8) + c(158, 104, 8) + c(182, 100, 8) + c(206, 92, 8) +
    c(158, 104, 3.5, "#fff") +
    p("M246 62v26", INK, 2.5) + c(246, 96, 7) + c(246, 116, 6) +
    p("M276 62v26", INK, 2.5) + c(276, 96, 6) + c(276, 116, 7) +
    p("M36 150h248", SOFT, 2)
  ),

  /* ---------------- 2. copper-wire name art ---------------- */
  wirecoil: panel(
    `<ellipse cx="92" cy="104" rx="46" ry="46" fill="none" stroke="${INK}" stroke-width="3"/>` +
    `<ellipse cx="92" cy="104" rx="30" ry="46" fill="none" stroke="${SOFT}" stroke-width="2.5"/>` +
    p("M120 132c26 18 46 18 62 4 14-12 10-30-8-34", GOLD, 4) +
    r(196, 62, 22, 74, "#fff", INK, 6) +                      // pliers head
    p("M218 74l26 -18M218 104l26 18M240 56l20 12M240 122l20 -12", INK, 3)
  ),
  bending: panel(
    r(46, 44, 228, 108, "#fff", INK, 6, 2.5) +
    p("M68 118c14 -34 28 -8 40 -34 10-22 20 18 32 -8 8-18 18 6 30 -14 8-14 14 4 26 -10", SOFT, 2.5) +
    p("M68 118c14 -34 28 -8 40 -34 10-22 20 18 32 -8 8-18 18 6 30 -14 8-14 14 4 26 -10", GOLD, 3) +
    c(258, 62, 5, GOLD)
  ),
  wirename: panel(
    p("M52 128c14 -46 30 -52 40 -20 8 24 18 26 26 -2 6-22 16-24 22 2 6 24 16 22 26 0 10-22 22-18 30 4", INK, 4) +
    c(196, 40, 5, "none", INK, 3) +
    p("M232 122c18 -8 22 -30 6 -34 -16 -4 -22 22 -4 30 16 8 34 -4 40 -20", GOLD, 3.5) +
    p("M40 148h240", SOFT, 2)
  ),

  /* ---------------- 3. beaded keyrings ---------------- */
  beads: panel(
    r(46, 108, 228, 44, "#f1eee6", INK, 10, 3) +
    c(88, 124, 9) + c(112, 132, 9, GREEN) + c(136, 124, 9) + c(160, 132, 9, "#fff") +
    c(184, 124, 9) + c(208, 132, 9, GREEN) + c(232, 124, 9) +
    p("M62 60l14 28M86 56v32M110 60l-14 28", SOFT, 2.5) +
    c(120, 74, 4, GOLD) + c(150, 66, 4, GREEN) + c(180, 74, 4, GOLD) + c(210, 66, 4, GREEN)
  ),
  threading: panel(
    p("M30 96h176", INK, 3) +
    c(70, 96, 10, "#fff") + c(96, 96, 10, GOLD) + c(122, 96, 10, "#fff") + c(148, 96, 10, GREEN) +
    p("M206 96c26 -22 30 22 44 0", INK, 2.5) +
    `<ellipse cx="256" cy="118" rx="12" ry="16" fill="none" stroke="${INK}" stroke-width="3" transform="rotate(24 256 118)"/>` +
    p("M30 96l-10 -12", INK, 2.5)
  ),
  charms: panel(
    c(84, 54, 12, "none", INK, 3) + p("M84 66v20", INK, 2.5) + c(84, 96, 8) + c(84, 116, 7, GREEN) +
    c(160, 54, 12, "none", INK, 3) + p("M160 66v16", INK, 2.5) +
    r(140, 82, 40, 54, "none", INK, 12) +
    c(248, 54, 12, "none", INK, 3) + p("M248 66v18", INK, 2.5) +
    p("M248 84c14 10 16 40 0 52", INK, 2.5) + c(248, 142, 8, GOLD)
  ),

  /* ---------------- 4. tassel wall hanging ---------------- */
  wool: panel(
    c(96, 92, 34, GOLD) + p("M70 78c18 14 34 26 52 30M72 104c20 8 36 12 50 8", INK, 2.5) +
    c(170, 118, 26, GREEN) + p("M148 110c16 12 30 18 44 14M150 128c16 6 28 6 40 2", INK, 2.5) +
    l(48, 158, 272, 158, INK, 5) +
    p("M268 158l8 -30", GOLD, 3)
  ),
  wrapping: panel(
    r(84, 44, 96, 116, "none", INK, 6, 3) +
    p("M84 60h96M84 76h96M84 92h96M84 108h96M84 124h96M84 140h96", GOLD, 3) +
    p("M180 102c40 0 44 -40 74 -40", SOFT, 2.5) +
    p("M196 122c30 0 46 -16 62 -14", SOFT, 2.5) +
    scissors(210, 128)
  ),
  tassels: panel(
    l(60, 44, 260, 44, INK, 5) +
    p("M60 44c40 -34 160 -34 200 0", SOFT, 2) +
    [0, 1, 2, 3, 4].map(i => {
      const x = 78 + i * 42;
      return p(`M${x} 44v34`, INK, 2.5) + c(x, 84, 6, GOLD) +
             p(`M${x - 11} 92h22l-4 46h-14z`, INK, 2.5) +
             p(`M${x - 8} 104l16 0M${x - 8} 114l16 0M${x - 8} 124l16 0`, SOFT, 2);
    }).join("")
  ),

  /* ---------------- 5. string art ---------------- */
  board: panel(
    r(48, 52, 156, 96, "#f1eee6", INK, 6, 3) +
    p("M60 60h132M60 140h132", SOFT, 1.6) +
    p("M96 116c0 -22 12 -34 30 -34s30 12 30 34", SOFT, 2.4) +   // pencil outline
    p("M96 116h60", SOFT, 2.4) +
    r(216, 122, 62, 26, GOLD, INK, 4, 2.5) + p("M226 130l42 0M226 140l42 0", "rgba(0,0,0,.25)", 2.5) +
    l(206, 60, 246, 84, INK, 5) + c(252, 90, 6, "none", INK, 2.5)
  ),
  nails: panel(
    r(52, 96, 200, 54, "#f1eee6", INK, 5, 3) +
    [0, 1, 2, 3, 4, 5].map(i => p(`M${72 + i * 32} 96v-16`, INK, 3.5)).join("") +
    [0, 1, 2, 3, 4, 5].map(i => c(72 + i * 32, 78, 3.5, INK)).join("") +
    p("M232 40l-24 46", INK, 5) + r(214, 24, 34, 18, GOLD, INK, 5, 2.5)
  ),
  stringart: panel(
    r(60, 34, 200, 122, "#f1eee6", INK, 6, 3) +
    (function(){
      let out = "";
      const pts = [];
      for (let i = 0; i <= 16; i++){
        const t = (i / 16) * Math.PI * 2;
        const x = 160 + Math.sin(t) * 62 + Math.sin(t) * Math.cos(t) * 16;
        const y = 96 - Math.cos(t) * 46 - Math.cos(t) * 12;
        pts.push([x.toFixed(0), y.toFixed(0)]);
      }
      pts.forEach((a, i) => { const b = pts[(i + 6) % pts.length]; out += p(`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`, GOLD, 1.6); });
      pts.forEach(a => { out += c(a[0], a[1], 2.6, INK); });
      return out;
    })()
  ),

  /* ---------------- 6. candles ---------------- */
  waxsupplies: panel(
    // jug of melted wax
    p("M50 74h64l-8 62h-48z", "#f1eee6", INK, 3) + p("M114 86c12 6 12 26 0 32", INK, 3) +
    p("M60 104h44", GOLD, 3) +
    // tin with a wick standing up
    r(168, 96, 56, 44, "none", INK, 7, 3) + p("M196 96v-16", INK, 2.5) +
    p("M196 80c-7 -7 -7 -14 0 -19 7 5 7 12 0 19", GOLD, 2.6) +
    l(180, 74, 212, 74, INK, 2.5) +
    // fragrance bottle
    r(244, 84, 34, 56, "none", INK, 8, 3) + r(254, 70, 14, 14, GOLD, INK, 3, 2.5) +
    p("M261 62v8", INK, 2.5) + p("M40 160h240", SOFT, 2)
  ),
  pouring: panel(
    // pot of hot water
    r(38, 118, 90, 44, "none", INK, 8, 3) + p("M38 132h90", SOFT, 2) +
    p("M84 118l-8 -18M100 118l6 -18", SOFT, 2.2) +
    // jug tilted, pouring
    `<g transform="rotate(28 168 76)"><path d="M140 56h52l-6 44h-40z" fill="#f1eee6" stroke="${INK}" stroke-width="3"/><path d="M192 66c10 4 10 18 0 22" fill="none" stroke="${INK}" stroke-width="3"/></g>` +
    p("M196 96c14 12 20 30 22 48", GOLD, 4) +
    // the tin receiving it
    r(196, 118, 62, 62, "none", INK, 8, 3) + p("M196 132h62", SOFT, 2) +
    p("M227 118v-10", INK, 2.5)
  ),
  tincandles: panel(
    [0, 1, 2].map(i => {
      const x = 54 + i * 76, h = 58 + (i === 1 ? 10 : 0);
      return r(x, 150 - h, 58, h, "#f1eee6", INK, 6, 3) +
             p(`M${x + 29} 150h0`, INK, 2) +
             p(`M${x + 29} ${150 - h}v-16`, INK, 2.5) +
             p(`M${x + 29} ${134 - h}c-8 -8 -8 -16 0 -22 8 6 8 14 0 22`, GOLD, 3);
    }).join("") + p("M30 150h260", SOFT, 2.5)
  ),

  /* ---------------- 7. soap ---------------- */
  soapbase: panel(
    r(64, 62, 120, 84, "#fff", INK, 6, 3) +
    p("M64 90h120M64 118h120M104 62v84M144 62v84", SOFT, 2.5) +
    p("M190 60l30 30 -18 44", SOFT, 2.5) +
    r(206, 116, 64, 30, GOLD, INK, 5, 2.5) +
    c(96, 40, 6, GREEN) + c(126, 34, 5, GOLD)
  ),
  moulds: panel(
    r(48, 96, 148, 58, "#fff", INK, 8, 3) +
    [0, 1, 2, 3].map(i => r(60 + i * 34, 110, 24, 30, "#f1eee6", INK, 6, 2.5)).join("") +
    p("M226 58c18 10 24 34 12 48", GOLD, 4) +
    p("M238 106v-14", INK, 2.5) + c(238, 106, 4, GOLD) +
    p("M40 168h240", SOFT, 2)
  ),
  soapbars: panel(
    r(58, 74, 84, 46, "#fff", INK, 7, 3) + r(58, 90, 84, 14, GREEN, INK, 2, 2) +
    r(172, 60, 84, 46, "#fff", INK, 7, 3) + r(172, 76, 84, 14, GOLD, INK, 2, 2) +
    r(112, 130, 84, 46, "#fff", INK, 7, 3) + r(112, 146, 84, 14, INK, INK, 2, 2) +
    p("M212 148c8 -8 20 -8 28 0", SOFT, 2.5)
  ),

  /* ---------------- 8. cement planters ---------------- */
  cementbag: panel(
    r(56, 52, 92, 116, "#f1eee6", INK, 6, 3) +
    p("M56 76h92", SOFT, 2.5) + p("M70 100h64M70 114h48M70 128h58", SOFT, 2.5) +
    p("M190 150h84", INK, 4) + p("M196 150l34 -46 32 46", INK, 3) +
    p("M210 118c14 10 30 10 44 0", GOLD, 3) +
    c(264, 60, 8, GOLD) + p("M264 68v22", INK, 2.5)
  ),
  mixing: panel(
    p("M62 84h116l-12 66h-92z", "#f1eee6", INK, 3) +
    p("M58 84h124", INK, 4) +
    p("M76 104c26 12 66 12 92 0", SOFT, 2.4) +
    p("M84 132c20 10 52 10 72 0", GOLD, 2.6) +
    p("M206 46l22 82", INK, 6) +
    r(196, 34, 26, 14, GOLD, INK, 4, 2.5) +
    c(52, 168, 4, SOFT) + c(66, 174, 3, SOFT) + c(40, 176, 3, SOFT)
  ),
  planters: panel(
    p("M60 112h56l-6 52h-44z", "#f1eee6", INK, 3) + p("M56 112h64", INK, 4) +
    p("M140 96h60l-8 68h-44z", "#f1eee6", INK, 3) + p("M134 96h72", INK, 4) +
    p("M228 120h48l-6 44h-36z", "#f1eee6", INK, 3) + p("M224 120h56", INK, 4) +
    p("M88 112c-14 -8 -16 -26 -2 -32 10 -4 18 4 18 12", GREEN, 3) +
    p("M170 96c-16 -10 -18 -30 -2 -38 12 -6 22 4 22 14", GREEN, 3) +
    p("M252 120c-10 -6 -12 -20 -2 -26 8 -4 14 2 14 8", GREEN, 3) +
    p("M60 164h232", SOFT, 2.5)
  ),

  /* ---------------- 9. salt dough ---------------- */
  doughball: panel(
    p("M76 110h168c0 32 -26 52 -84 52s-84 -20 -84 -52z", "#fff", INK, 3) +
    `<ellipse cx="160" cy="110" rx="84" ry="18" fill="#f7f5ef" stroke="${INK}" stroke-width="3"/>` +
    c(150, 96, 22, "#f1eee6", INK, 3) + c(188, 92, 14, "#f1eee6", INK, 3) +
    p("M104 74l40 40", INK, 6) + p("M104 74h-8M104 74v-8", INK, 3) +
    c(246, 66, 4, GOLD) + c(262, 78, 3, GOLD)
  ),
  cutting: panel(
    r(44, 108, 232, 44, "#f1eee6", INK, 5, 3) +
    // a circle cutter with a straw hole
    `<circle cx="104" cy="130" r="20" fill="#fdfcf9" stroke="${INK}" stroke-width="3"/>` +
    `<circle cx="104" cy="130" r="5" fill="none" stroke="${INK}" stroke-width="2.4"/>` +
    p("M104 110v-14", INK, 2.4) + c(104, 92, 7, "none", INK, 2.6) +
    // a star-ish shape being cut
    p("M256 112L260.7 123.5L273.1 124.4L263.6 132.5L266.6 144.6L256 138L245.4 144.6L248.4 132.5L238.9 124.4L251.3 123.5Z", "#fdfcf9", INK, 2.6) +
    p("M232 84l16 8", INK, 3) +
    // the straw making a hole
    l(250, 84, 262, 122, GOLD, 5) + c(262, 126, 4, "none", INK, 2)
  ),
  ornaments: panel(
    p("M40 40c60 30 180 30 240 0", SOFT, 2.5) +
    [0, 1, 2, 3].map(i => {
      const x = 84 + i * 50, y = 52 + (i % 2) * 6;
      return p(`M${x} ${y}v14`, INK, 2.5) +
             c(x, y + 34, 20, i % 2 ? GOLD : "#f1eee6", INK, 3) +
             p(`M${x - 6} ${y + 28}l12 0`, "rgba(0,0,0,.2)", 2.5);
    }).join("")
  ),

  /* ---------------- 10. hand-lettered cards ---------------- */
  paperpen: panel(
    r(48, 56, 132, 96, "#fff", INK, 5, 3) + r(60, 44, 132, 96, "#fff", INK, 5, 3) +
    p("M74 74h100M74 92h84M74 110h96", SOFT, 2.5) +
    p("M206 148l50 -50 16 16 -50 50 -22 6z", GOLD, INK) +
    p("M240 92l16 16", INK, 2.5) + p("M206 148l-4 14 12 -8", INK, 2.5)
  ),
  lettering: panel(
    r(44, 44, 232, 108, "#fff", INK, 5, 3) +
    p("M64 70h192M64 96h192M64 122h192", SOFT, 1.5) +
    p("M74 92v-16h14v16M74 92h14M74 84h14", INK, 3) +
    p("M100 92v-16h16v8h-16M116 76v16", INK, 3) +
    p("M134 92v-16h16M134 84h12M150 92v-16", INK, 3) +
    p("M166 76v16h16", INK, 3) +
    p("M196 92v-16h14v16", INK, 3) +
    p("M226 76c8 -6 14 2 14 8s-6 10 -14 8v-16", GOLD, 3)
  ),
  framedprint: panel(
    r(84, 30, 152, 126, "#f1eee6", INK, 8, 3) + r(98, 44, 124, 98, "#fff", INK, 3, 2.5) +
    p("M112 70h96M112 88h72M112 106h84M112 124h48", INK, 3) +
    c(196, 122, 9, GOLD) +
    p("M60 168h200", SOFT, 2)
  )
  };
})();
