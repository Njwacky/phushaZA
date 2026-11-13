#!/usr/bin/env node
/* Pusha — icons/make-svg2.js
   The "P + arrow" family: four ways of putting growth next to the letter.
   Writes icon-d.svg … icon-g.svg (plus maskable cuts).  Run from app/.   */
const fs = require("fs");
const GREEN = "#0b5c46", PAPER = "#f7f5ef", GOLD = "#c8891f";
/* the shipping mark (E2): first bar gold, second black, third blue — keep in step with index.html #i-logo */
const BAR_BLACK = "#000000", BAR_BLUE = "#2563eb";
const BAR_COLS = [GOLD, BAR_BLACK, BAR_BLUE];

const P_BOWL = "M176 132H268a96 96 0 0 1 0 192H234V380H176Z";
const P_HOLE = "M234 180H268a48 48 0 0 1 0 96H234Z";
const LETTER = `<path fill-rule="evenodd" d="${P_BOWL} ${P_HOLE}" fill="${PAPER}"/>`;

/* a straight arrow with a mathematically straight head */
function arrow(x1, y1, x2, y2, w, head, col = GOLD){
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
  const ux = dx / L, uy = dy / L, px = -uy, py = ux;   // unit vector and its perpendicular
  const bx = x2 - ux * head, by = y2 - uy * head;      // where the head starts
  const hw = head * 0.60, k = w / 2;
  const P = (x, y) => `${x.toFixed(1)} ${y.toFixed(1)}`;
  return `<path fill="${col}" d="M${P(x1 + px * k, y1 + py * k)}` +
         `L${P(bx + px * k, by + py * k)}L${P(bx + px * hw, by + py * hw)}L${P(x2, y2)}` +
         `L${P(bx - px * hw, by - py * hw)}L${P(bx - px * k, by - py * k)}L${P(x1 - px * k, y1 - py * k)}Z"/>`;
}

/* a stepped chart line: flat, up, flat, up, flat, then a head pointing up */
function steps(){
  const s = 30, y0 = 412, xs = [286, 328, 370, 412], rise = 52;
  return `<path fill="none" stroke="${GOLD}" stroke-width="${s}" stroke-linejoin="miter" stroke-linecap="butt" ` +
         `d="M${xs[0]} ${y0}H${xs[1]}V${y0 - rise}H${xs[2]}V${y0 - rise * 2}H${xs[3]}V${y0 - rise * 2 - 34}"/>` +
         `<path fill="${GOLD}" d="M${xs[3] - 8} ${y0 - rise * 2 - 34}L${xs[3] + s / 2} ${y0 - rise * 2 - 100}L${xs[3] + s + 8} ${y0 - rise * 2 - 34}Z"/>`;
}

function bars(){
  const base = 412, w = 36, gap = 18, x0 = 286, hs = [64, 110, 156];
  return hs.map((h, i) => `<rect x="${x0 + i * (w + gap)}" y="${base - h}" width="${w}" height="${h}" rx="4" fill="${BAR_COLS[i]}"/>`).join("");
}

function caret(){
  return `<path fill="none" stroke="${GOLD}" stroke-width="38" stroke-linejoin="miter" stroke-linecap="butt" d="M326 392L372 322L418 392"/>`;
}

/* P whose bowl sweeps out and ends in an up arrow head */
function bowlArrow(){
  return LETTER + `<path fill="none" stroke="${GOLD}" stroke-width="26" stroke-linejoin="miter" stroke-linecap="butt" ` +
         `d="M232 380V326"/>` +
         `<path fill="${GOLD}" d="M300 300L266 246L334 246Z"/>`;
}

/* --- the bars, with an arrow among them (E1 / E2 / E3) --- */
const BAR_BASE = 412, BAR_W = 36, BAR_GAP = 18, BAR_X0 = 286, BAR_H = [64, 110, 156];
const barAt = (i, h, col = GOLD) =>
  `<rect x="${BAR_X0 + i * (BAR_W + BAR_GAP)}" y="${BAR_BASE - h}" width="${BAR_W}" height="${h}" rx="4" fill="${col}"/>`;

/* E1 — three gold bars and a cream arrow cutting up between them */
function barsArrowThrough(){
  return barAt(0, BAR_H[0]) + barAt(1, BAR_H[1]) + barAt(2, BAR_H[2]) +
         arrow(296, 428, 430, 214, 36, 56, PAPER);
}

/* E2 — the tallest bar keeps going and becomes the arrow */
function barsIntoArrow(){
  const x = BAR_X0 + 2 * (BAR_W + BAR_GAP) + BAR_W / 2;   // centre of the third bar
  return barAt(0, BAR_H[0], GOLD) + barAt(1, BAR_H[1], BAR_BLACK) +
         `<rect x="${x - BAR_W / 2}" y="${BAR_BASE - 118}" width="${BAR_W}" height="118" rx="4" fill="${BAR_BLUE}"/>` +
         `<path fill="${GOLD}" d="M${x} 196L${x + 44} ${BAR_BASE - 112}L${x - 44} ${BAR_BASE - 112}Z"/>`;
}

/* E3 — two bars, then a cream arrow standing where the third bar would be */
function barsPlusArrow(){
  const x = BAR_X0 + 2 * (BAR_W + BAR_GAP) + BAR_W / 2;
  return barAt(0, BAR_H[0]) + barAt(1, BAR_H[1]) +
         `<rect x="${x - BAR_W / 2}" y="${BAR_BASE - 96}" width="${BAR_W}" height="96" rx="4" fill="${PAPER}"/>` +
         `<path fill="${PAPER}" d="M${x} 206L${x + 46} ${BAR_BASE - 96}L${x - 46} ${BAR_BASE - 96}Z"/>`;
}

const variants = {
  d: LETTER + steps(),                       // stepped chart line rising, arrow up
  e: LETTER + bars(),                        // three bars, each taller
  f: LETTER + arrow(330, 424, 458, 176, 34, 78),  // bold diagonal arrow rising past the P
  g: LETTER + caret(),                       // the dot becomes a chevron pointing up
  e1: LETTER + barsArrowThrough(),           // bars + a cream arrow up between them
  e2: LETTER + barsIntoArrow(),              // the tallest bar becomes the arrow
  e3: LETTER + barsPlusArrow()               // bars, then a cream arrow as the third
};

function wrap(inner, safe = 1, rx = 114){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="Pusha">` +
    `<rect width="512" height="512" rx="${rx}" fill="${GREEN}"/>` +
    `<g transform="translate(256 256) scale(${safe}) translate(-256 -256)"><g transform="translate(-22 6)">${inner}</g></g></svg>\n`;
}

for (const [k, inner] of Object.entries(variants)) {
  fs.writeFileSync(__dirname + `/icon-${k}.svg`, wrap(inner));
  fs.writeFileSync(__dirname + `/icon-${k}-maskable.svg`, wrap(inner, 0.80, 0));
}
console.log("wrote icon-d/e/f/g (+ maskable)");
