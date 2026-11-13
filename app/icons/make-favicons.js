#!/usr/bin/env node
/* Pusha — icons/make-favicons.js
   A browser tab has no room for the full mark: at 16 px the bars and the
   arrowhead turn into mush and the letter stops reading. So the tiny favicon
   is a deliberately simplified drawing of the same mark — a bolder letter on
   the same green, with the gold reduced to one bar. Rendered by hand, not by
   shrinking the big icon. Run from app/.                                    */
const fs = require("fs");

/* bold letter: stem twice as thick as the big icon's, so it survives 16 px */
const BOLD_P = "M148 122H286a108 108 0 0 1 0 216H250V404H148Z";
const BOLD_HOLE = "M250 186H286a44 44 0 0 1 0 88H250Z";

function small({ bars }){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img" aria-label="Pusha">` +
    `<rect width="512" height="512" fill="#0b5c46"/>` +
    `<path fill="#f7f5ef" fill-rule="evenodd" d="${BOLD_P} ${BOLD_HOLE}"/>` +
    (bars ? `<rect x="382" y="330" width="44" height="74" rx="6" fill="#c8891f"/>` +
            `<rect x="432" y="286" width="44" height="118" rx="6" fill="#000000"/>` : "") +
    `</svg>\n`;
}

fs.writeFileSync(__dirname + "/favicon-small.svg", small({ bars: false }));  // 16 px: letter only
fs.writeFileSync(__dirname + "/favicon-mid.svg", small({ bars: true }));     // 32 px: letter + gold bars
console.log("wrote favicon-small.svg, favicon-mid.svg");
