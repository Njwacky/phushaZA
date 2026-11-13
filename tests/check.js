// Pusha regression + language check. Run: NODE_PATH=/tmp/node_modules node tests/check.js
const { chromium } = require("playwright");
const URL = process.argv[2] || "file:///home/user/app/index.html";
const TAG = process.argv[3] || "run";
const out = {}; const errs = [];
const log = (k, v) => { out[k] = v; };

(async () => {
  const b = await chromium.launch({ args: ["--no-sandbox"] });

  // ---------- A. default state (English) ----------
  let p = await (await b.newContext({ viewport:{width:430,height:940}, deviceScaleFactor:2,
        permissions:["clipboard-read","clipboard-write"] })).newPage();
  p.on("pageerror", e => errs.push("A:" + e.message));
  p.on("console", m => { if (m.type()==="error") errs.push("A:" + m.text()); });
  await p.goto(URL); await p.waitForTimeout(400);
  log("defaultLang", await p.evaluate(() => document.documentElement.lang));

  await p.click('#tabs button[data-view="pack"]'); await p.waitForTimeout(300);
  log("packDotWhenIncomplete", await p.$eval('#tabs button[data-view="pack"]', el => el.classList.contains("alert")));
  await p.click("#openCV"); await p.waitForTimeout(350);
  log("missingChips", await p.$$eval("#sheetBody [data-fix]", e => e.length));
  await p.click("#sheetBody [data-fix]"); await p.waitForTimeout(500);
  log("fixJumpsToField", [await p.$eval("#v-vault", el => el.classList.contains("on")),
                          await p.evaluate(() => document.activeElement.id)]);

  for (const [id, v] of [["f_fullname","Thabo Mokoena"],["f_phone","072 445 1180"],["f_email","thabo.m@gmail.com"],
      ["f_school","Sizwe Secondary"],["f_year","2025"],["f_skills","cooking, cash handling, driving"],
      ["f_kin","Mama Doris 082 111 2299"],["f_subjects","Maths Lit, Business Studies, English"]])
    await p.fill("#" + id, v);
  await p.waitForTimeout(700);
  await p.click('#tabs button[data-view="pack"]'); await p.waitForTimeout(350);
  log("packDotWhenComplete", await p.$eval('#tabs button[data-view="pack"]', el => el.classList.contains("alert")));
  log("copyBtnSize", await p.$eval("#copyPreviewBtn", el => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }));

  // copy really copies: pick the CV block, then the preview's Copy only button
  await p.click('#blockList .blockrow[data-block="cv"]'); await p.waitForTimeout(300);
  await p.click('#copyPreviewBtn'); await p.waitForTimeout(400);
  log("clipboard", (await p.evaluate(() => navigator.clipboard.readText())).slice(0, 24));
  await p.waitForTimeout(1300);
  log("copyLabelRestored", await p.$eval('#copyPreviewBtn', el => el.textContent.trim()));

  // custom CV section survives reload and prints
  await p.click("#openCV"); await p.waitForTimeout(300);
  await p.click("#addSection"); await p.waitForTimeout(250);
  await p.fill("#xs_title", "Volunteering");
  await p.fill("#xs_text", "Youth centre kitchen, Daveyton, weekends 2025.");
  await p.click("#xs_save"); await p.waitForTimeout(400);
  log("extraOnCv", await p.$eval("#sheetBody", el => el.textContent.includes("Benoni") || el.textContent.includes("Daveyton")));
  await p.reload(); await p.waitForTimeout(600);
  log("extraPersists", await p.evaluate(() => JSON.stringify(vault.cvExtra || [])));

  await p.click('#tabs button[data-view="pack"]'); await p.waitForTimeout(300);
  await p.click("#openCV"); await p.waitForTimeout(300);
  await p.evaluate(() => { window.print = () => {}; });
  await p.click("#printCV"); await p.waitForTimeout(300);
  log("printHasExtra", await p.$eval("#printArea", el => el.innerText.includes("Daveyton")));
  await p.emulateMedia({ media:"print" });
  await p.locator("#printArea .doc").screenshot({ path:`/tmp/shots/${TAG}-cv-print.png` });
  await p.emulateMedia({ media:"screen" });
  await p.evaluate(() => document.querySelector("#sheet").classList.remove("on"));

  // ---------- B. every language renders without errors ----------
  const seen = {};
  for (const code of ["zu","st","nr","en"]) {
    await p.click("#langBtn"); await p.waitForTimeout(300);
    await p.screenshot({ path:`/tmp/shots/${TAG}-langs-${code}.png` });
    await p.click(`#sheetBody [data-lang="${code}"]`); await p.waitForTimeout(450);
    const tabs = await p.$$eval("#tabs button span", els => els.map(e => e.textContent).join("/"));
    const lang = await p.evaluate(() => document.documentElement.lang);
    await p.click('#tabs button[data-view="pack"]'); await p.waitForTimeout(250);
    seen[code] = { lang, tabs, cvBtn: await p.$eval("#openCV", e => e.textContent.trim()) };
  }
  log("languages", seen);

  // persisted choice + no overflow at 320 and 1280
  await p.click("#langBtn"); await p.waitForTimeout(250);
  await p.click('#sheetBody [data-lang="nr"]'); await p.waitForTimeout(350);
  await p.reload(); await p.waitForTimeout(600);
  log("langPersists", await p.evaluate(() => document.documentElement.lang));
  for (const w of [320, 1280]) {
    await p.setViewportSize({ width:w, height:900 }); await p.waitForTimeout(350);
    log("overflow@"+w, await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
  }
  await p.screenshot({ path:`/tmp/shots/${TAG}-desktop-nr.png` });

  // ---------- C. the same app on a computer: rail on the left, bottom bar on a phone ----------
  await p.click("#langBtn"); await p.waitForTimeout(250);
  await p.click('#sheetBody [data-lang="en"]'); await p.waitForTimeout(350);

  const geo = async () => p.evaluate(() => {
    const nav = document.querySelector("#tabs").getBoundingClientRect();
    const app = document.querySelector(".app").getBoundingClientRect();
    const cs = getComputedStyle(document.body);
    return {
      nav: { x:Math.round(nav.x), y:Math.round(nav.y), w:Math.round(nav.width), h:Math.round(nav.height) },
      app: { x:Math.round(app.x), w:Math.round(app.width) },
      bodyPadBottom: cs.paddingBottom, bodyPadLeft: cs.paddingLeft,
      title: getComputedStyle(document.querySelector("#pageTitle")).display,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });

  // 1440: rail, not a bottom bar
  await p.setViewportSize({ width:1440, height:900 }); await p.waitForTimeout(400);
  const wide = await geo();
  log("desktop1440", { nav: wide.nav, app: wide.app, bodyPadBottom: wide.bodyPadBottom,
    railIsTall: wide.nav.h >= 880 && wide.nav.w <= 300 && wide.nav.x === 0,
    contentClearOfRail: wide.app.x >= wide.nav.w,
    pageTitleShown: wide.title !== "none",
    overflow: wide.overflow });

  // the section name in the toolbar follows the tab
  const titles = {};
  for (const v of ["pack","ideas","money","path","vault"]) {
    await p.click(`#tabs button[data-view="${v}"]`); await p.waitForTimeout(220);
    titles[v] = await p.$eval("#pageTitle", e => e.textContent.trim());
  }
  log("pageTitlePerView", titles);

  // a sheet is a dialog in the middle on a computer, a drawer on a phone
  await p.evaluate(() => show("path"));
  await p.evaluate(() => document.querySelector("#aboutBtn").click()); await p.waitForTimeout(420);
  log("sheetAt1440", await p.evaluate(() => {
    const i = document.querySelector(".sheet .inner").getBoundingClientRect();
    return { radius: getComputedStyle(document.querySelector(".sheet .inner")).borderRadius,
      gapBelow: Math.round(window.innerHeight - i.bottom), width: Math.round(i.width),
      centredOnContent: Math.abs((i.left + i.width / 2) - (document.querySelector(".app").getBoundingClientRect().left +
        document.querySelector(".app").getBoundingClientRect().width / 2)) < 4 };
  }));
  await p.screenshot({ path:`/tmp/shots/${TAG}-pc-sheet.png` });
  await p.evaluate(() => closeSheet()); await p.waitForTimeout(250);

  // the idea list uses the width instead of one long column
  const cols = async () => p.evaluate(() => {
    const c = [...document.querySelectorAll("#ideaList .ideacard")].slice(0, 8);
    if (!c.length) return 0;
    const top = Math.round(c[0].getBoundingClientRect().top);
    return c.filter(x => Math.round(x.getBoundingClientRect().top) === top).length;
  });
  await p.evaluate(() => show("ideas")); await p.waitForTimeout(400);
  log("ideaColumns", { at1440: await cols() });
  await p.setViewportSize({ width:1024, height:768 }); await p.waitForTimeout(400);
  log("ideaColumns.at1024", await cols());
  log("desktop1024", await geo());
  await p.screenshot({ path:`/tmp/shots/${TAG}-pc-ideas.png` });

  // the primary button on a computer is a button, not a full-width bar
  await p.evaluate(() => show("vault")); await p.waitForTimeout(350);
  log("saveButtonWidthAt1024", await p.$eval("#saveVault", e => Math.round(e.getBoundingClientRect().width)));

  // 430: back to the bottom bar, nothing left over from the desktop layout
  await p.setViewportSize({ width:430, height:940 }); await p.waitForTimeout(400);
  const phone = await geo();
  log("phone430", { navAtBottom: phone.nav.y > 800 && phone.nav.w >= 425,
    bodyPadBottom: phone.bodyPadBottom, bodyPadLeft: phone.bodyPadLeft,
    pageTitleHidden: phone.title === "none", overflow: phone.overflow });
  await p.screenshot({ path:`/tmp/shots/${TAG}-phone-after-desktop.png` });

  /* ---------- i18n integrity: every key the code asks for must exist ----------
     A mangled key name ships silently (the screen just prints the key), so this
     compares the keys found in the source and the markup with the dictionaries. */
  const fs = require("fs"), path = require("path");
  const srcDir = path.join(__dirname, "..", "app");
  const refd = new Set();
  const scanText = (txt) => {
    for (const m of txt.matchAll(/\bt\(\s*"([a-z0-9_]+)"\s*\)/g)) refd.add(m[1]);
    for (const m of txt.matchAll(/t\(\s*\[([\s\S]*?)\]/g))
      for (const q of m[1].matchAll(/"([a-z0-9_]+)"/g)) refd.add(q[1]);
    for (const m of txt.matchAll(/data-i18n(?:-ph|-aria)?="([a-z0-9_]+)"/g)) refd.add(m[1]);
  };
  if (fs.existsSync(srcDir)) {
    scanText(fs.readFileSync(path.join(srcDir, "index.html"), "utf8"));
    for (const f of fs.readdirSync(path.join(srcDir, "js"))) scanText(fs.readFileSync(path.join(srcDir, "js", f), "utf8"));
  }
  const dict = await p.evaluate(() => {
    const out = {};
    for (const l of ["en", "zu", "st", "nr"]) out[l] = Object.keys(I18N[l]);
    return out;
  });
  const enKeys = new Set(dict.en);
  const missing = [...refd].filter(k => !enKeys.has(k)).sort();
  const parity = ["zu", "st", "nr"].map(l => ({
    l, missingInLang: dict.en.filter(k => !dict[l].includes(k)).slice(0, 8),
    extra: dict[l].filter(k => !enKeys.has(k)).slice(0, 8)
  }));
  log("i18nKeys", {
    keys: dict.en.length,
    referenced: refd.size,
    missing,
    parityBroken: parity.filter(x => x.missingInLang.length || x.extra.length)
  });
  // the two real contacts, on Path, tappable
  await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(300);
  await p.evaluate(() => show("path")); await p.waitForTimeout(400);
  log("contact", await p.evaluate(() => {
    const c = document.querySelector("#contactCard");
    if (!c) return { there: false };
    const links = [...c.querySelectorAll("a")];
    const href = (p) => { const a = links.find(x => x.getAttribute("href").startsWith(p)); return a ? a.getAttribute("href") : ""; };
    return {
      there: true,
      rows: links.length,
      tel: href("tel:"),
      wa: href("https://wa.me/"),
      // the row tries the phone's own WhatsApp first, wa.me is only the fallback
      waApp: (links.find(x => x.getAttribute("href").startsWith("https://wa.me/")) || {getAttribute:()=>""})
        .getAttribute("data-app") || "",
      mail: href("mailto:"),
      digits: href("tel:").replace("tel:", "").length,     // a SA mobile is 10
      minTap: Math.min(...links.map(a => Math.round(a.getBoundingClientRect().height))),
      version: (document.querySelector("#verText") || {}).textContent
    };
  }));

  log("errors", errs);
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
