#!/usr/bin/env node
/* Pusha — icons/make-svg.js
   Draws the app icon as SVG: one letter geometry, three colourways, and a
   "maskable" cut of each with the artwork pulled inside the circle Android
   crops to.  Run from app/:   node icons/make-svg.js                      */
const fs = require("fs");
const GREEN = "#0b5c46", PAPER = "#f7f5ef", GOLD = "#c8891f";

/* The P. Stem 58 wide; bowl outer radius 96 centred on (268,228); the counter
   is flush with the stem so the bowl keeps an even weight when the whole thing
   is shown at 48 px on a home screen. */
const P_BOWL = "M176 132H268a96 96 0 0 1 0 192H234V380H176Z";
const P_HOLE = "M234 180H268a48 48 0 0 1 0 96H234Z";

/* Optical size: glyph is drawn once, then magnified about its own centre so
   the same numbers work for the tile icon and the maskable cut. */
const MAG = 1.14;

function mark({ fg, dot, glyph = "dot" }){
  const g = [
    `<path fill-rule="evenodd" d="${P_BOWL} ${P_HOLE}" fill="${fg}"/>`
  ];
  if (glyph === "dot")      g.push(`<circle cx="372" cy="356" r="30" fill="${dot}"/>`);
  if (glyph === "arrow")    g.push(`<path d="M372 300l46 52h-30v46h-32v-46h-30z" fill="${dot}"/>`);
  if (glyph === "steps")    g.push(`<path d="M330 394h26v-52h-26zM364 394h26v-84h-26zM398 394h26v-118h-26z" fill="${dot}"/>`);
  return g.join("");
}

function svg({ bg, fg, dot, glyph, scale = MAG, rx = 114, safe = 1 }){
  const body = `<g transform="translate(256 256) scale(${scale * safe}) translate(-256 -256)">${mark({fg, dot, glyph})}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="Pusha">` +
         `<rect width="512" height="512" rx="${rx}" fill="${bg}"/>${body}</svg>\n`;
}

const A = { bg: GREEN,  fg: PAPER, dot: GOLD, glyph: "dot" };   // green tile, cream P, gold full stop
const B = { bg: GREEN,  fg: PAPER, dot: GOLD, glyph: "arrow" }; // the same, but the dot is an up arrow
const C = { bg: PAPER,  fg: GREEN, dot: GOLD, glyph: "dot" };   // paper tile, green P

const out = {
  "icon-a.svg":          svg(A),
  "icon-b.svg":          svg(B),
  "icon-c.svg":          svg(C),
  "icon-a-maskable.svg": svg({ ...A, rx: 0, safe: 0.80 }),
  "icon-b-maskable.svg": svg({ ...B, rx: 0, safe: 0.80 }),
  "icon-c-maskable.svg": svg({ ...C, rx: 0, safe: 0.80 })
};
for (const [f, s] of Object.entries(out)) fs.writeFileSync(__dirname + "/" + f, s);
console.log("wrote " + Object.keys(out).join(", "));
