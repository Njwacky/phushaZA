#!/usr/bin/env node
/* ================================================================
   Pusha — build-single-file.js
   Turns the split source (index.html + styles.css + theme.js + app.js)
   into one offline file: pusha-standalone.html

   Use it for: WhatsApp / flash-drive / "one file, works with no
   internet and nothing to install" distribution.

   Run from the app/ folder:      node build-single-file.js
   ================================================================ */
const fs = require("fs");
const read = f => fs.readFileSync(f, "utf8");

const html  = read("index.html");
const mark  = read("icons/icon.svg");

/* the project photos: one JPEG per project, inlined so the single file still
   works from a flash drive with no folder next to it */
const DIY_IDS = ["paperbeads","wirename","beadcharms","tasselhanging","stringart",
                 "candles","soap","planters","saltdough","wordart"];
const photos = {};
for (const id of DIY_IDS){
  const f = "img/diy-" + id + ".jpg";
  must(fs.existsSync(f), "missing project photo: " + f);
  photos[f] = "data:image/jpeg;base64," + fs.readFileSync(f).toString("base64");
}
const css   = read("styles.css");
const theme = read("theme.js");

// every js/ file, in exactly the order index.html loads them
const JS_ORDER = ["data-ideas","data-learn","data-diy","diy-art","core","i18n","pack","cv-checks","misc","ideas","money","path","diy","hint-resize", "hint-ios"];
const app = JS_ORDER.map(f => read("js/" + f + ".js")).join("\n\n");

function must(cond, msg){ if (!cond){ console.error("build failed: " + msg); process.exit(1); } }
must(html.includes('href="styles.css"'), 'index.html must link styles.css');
must(html.includes('href="manifest.webmanifest"'), 'index.html must link the web app manifest');
must(html.includes('src="theme.js"'),    'index.html must load theme.js');
const firstJs = JS_ORDER[0];
must(html.includes('src="js/' + firstJs + '.js"'), 'index.html must load js/' + firstJs + '.js');
must(JS_ORDER.every(f => html.indexOf('src="js/' + f + '.js"') !== -1), 'index.html must load every js/ file');
// and nothing may be loaded that the build does not know about: a file left out
// of JS_ORDER would silently vanish from the single file
const loaded = (html.match(/src="js\/[a-z0-9-]+\.js"/g) || []).map(m => m.replace(/^src="js\//, "").replace(/\.js"$/, ""));
must(loaded.every(f => JS_ORDER.indexOf(f) !== -1), "index.html loads a js/ file missing from JS_ORDER: " + loaded.filter(f => JS_ORDER.indexOf(f) === -1).join(", "));
must(loaded.length === JS_ORDER.length, "index.html and JS_ORDER disagree on how many js/ files there are");
must(JS_ORDER.every((f, i, a) => i === 0 || html.indexOf('js/' + a[i-1] + '.js') < html.indexOf('js/' + f + '.js')),
     'js/ files must be loaded in order in index.html');

// note: function replacers, never string replacements — a string replacement
// would eat "$$" in the source (JS treats $$ as an escaped $) and silently
// turn the $$ helper into a second $ declaration.
const out = html
  .replace('<link rel="stylesheet" href="styles.css">', () => "<style>\n" + css.trim() + "\n</style>")
  .replace('<script src="theme.js"></script>', () => "<script>\n" + theme.trim() + "\n</script>")
  // a single file has no folder next to it, so the manifest (and its icon)
  // would 404. Installed-app behaviour only matters when this is served
  // from a web address anyway — the offline single file does not need it.
  .replace('<link rel="manifest" href="manifest.webmanifest">', () => "<!-- manifest + service worker are only used when the folder is served over http(s) -->")
  // a single file has no icons/ folder next to it, so the icon links become one
  // inline favicon drawn from the same mark
  .replace('<link rel="icon" href="icons/favicon-16.png" sizes="16x16" type="image/png">', () => "")
  .replace('<link rel="icon" href="icons/favicon-32.png" sizes="32x32" type="image/png">', () => "")
  .replace('<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">', () => "")
  .replace('<link rel="icon" href="icons/icon.svg" sizes="any" type="image/svg+xml">',
           () => '<link rel="icon" href="data:image/svg+xml,' + encodeURIComponent(mark.trim()) + '">')
  .replace(/<script src="js\/[a-z0-9-]+\.js"><\/script>/g, () => "")
  .replace("</body>", () => "<script>\n" + app.trim() + "\n</script>\n</body>");

must(!out.includes('src="js/'), "unreplaced js/ reference left behind");
must(!out.includes('src="app.js"') && !out.includes('src="theme.js"'), "unreplaced script reference left behind");
must(!out.includes('href="styles.css"'), "unreplaced css reference left behind");
must(!out.includes('rel="manifest"'), "manifest link left behind in the single file");
must(out.includes("const $$ ="), "$$ helper was mangled in the build");
must(!out.includes('href="icons/'), "icon file reference left behind in the single file");
must(out.includes('rel="icon" href="data:image/svg+xml,'), "the single file has no icon");

// every photo path in the joined app becomes its own data URI
let withPhotos = out;
for (const [path, uri] of Object.entries(photos)){
  withPhotos = withPhotos.split(path).join(uri);   // split/join: never a $-pattern
}
must(!withPhotos.includes('"img/diy-'), "a project photo path was left behind in the single file");
must(!withPhotos.includes('src="img/'), "an img/ reference was left behind in the single file");

fs.writeFileSync("pusha-standalone.html", withPhotos);
const kb = n => (n / 1024).toFixed(1) + " KB";
console.log("built pusha-standalone.html  " + kb(withPhotos.length) +
            "  (css " + kb(css.length) + ", js " + kb(app.length + theme.length) + ")");
