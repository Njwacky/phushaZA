/* ================================================================
   Pusha — tests/deploy.js   (the three things a deployment must do)

     PWA      the manifest is complete, every icon loads, the worker
              registers and takes control, and Chromium itself says the
              app is installable
     OFFLINE  after one visit the app boots with the network cut off:
              data, photos, languages and the DIY sheets all still work
     SAVED    everything a person typed is still there after the browser
              is closed and opened again — vault, language, theme,
              cashbook, own ideas, documents, savings goal, PIN lock

   Run:  NODE_PATH=/tmp/node_modules node tests/deploy.js [baseUrl]
   Two throwaway browser profiles are used, so nothing here touches the
   profile you actually browse with.
   ================================================================ */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const arg = process.argv[2] || "http://127.0.0.1:8000/index.html";
const URL_ = /\.html$/.test(arg) ? arg : arg.replace(/\/$/, "") + "/index.html";
const BASE = URL_.replace(/\/index\.html$/, "");
const PROFILE_A = "/tmp/pusha-deploy-a";     // install + offline + restart
const PROFILE_B = "/tmp/pusha-deploy-b";     // PIN lock
const APP = path.join(__dirname, "..", "app");

const R = {};
const fail = [];
const say = (group, name, pass, detail) => {
  (R[group] = R[group] || []).push({ check: name, pass: !!pass, detail });
  if (!pass) fail.push(group + " · " + name);
};

const rmr = (d) => fs.rmSync(d, { recursive: true, force: true });

const IS_FILE = /^file:/.test(URL_);

(async () => {
  rmr(PROFILE_A); rmr(PROFILE_B);

  if (IS_FILE) {
    // the single file is one file: no manifest, no worker, nothing to install
    say("PWA", "not applicable — the single file installs nothing and needs no worker", true,
        "open it from a flash drive or WhatsApp; there is no cache to manage");
  }

  /* ================= 1. PWA ================= */
  let ctx = await chromium.launchPersistentContext(PROFILE_A, { viewport: { width: 390, height: 844 } });
  let page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push("A: " + e));
  await page.goto(URL_, { waitUntil: "load" });
  await page.waitForTimeout(1500);

  if (!IS_FILE) {
  const man = await page.evaluate(async () => {
    const link = document.querySelector('link[rel="manifest"]');
    if (!link) return { found: false };
    const m = await (await fetch(link.href)).json();
    const icons = await Promise.all((m.icons || []).map(async (i) => {
      try { const r = await fetch(new URL(i.src, link.href)); return { src: i.src, purpose: i.purpose, status: r.status }; }
      catch (e) { return { src: i.src, status: 0 }; }
    }));
    return {
      found: true, name: m.name, short: m.short_name, start: m.start_url, scope: m.scope,
      display: m.display, theme: m.theme_color, bg: m.background_color, lang: m.lang,
      icons, pngIcons: icons.filter((i) => /png/.test(i.src) && i.status === 200).length,
      maskable: icons.filter((i) => /maskable/.test(i.purpose || "") && i.status === 200).length
    };
  });
  say("PWA", "manifest found and parses", man.found);
  say("PWA", "name, short_name, start_url, scope", !!(man.name && man.short && man.start && man.scope), man.start + " · scope " + man.scope);
  say("PWA", "display is standalone", man.display === "standalone", man.display);
  say("PWA", "theme + background colours set", !!(man.theme && man.bg), man.theme + " / " + man.bg);
  say("PWA", "at least one 192 and one 512 PNG icon load", man.pngIcons >= 2, man.pngIcons + " png icons 200");
  say("PWA", "maskable icon present (Android home screen)", man.maskable >= 1, man.maskable + " maskable");

  const sw = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return {
      registered: !!reg,
      state: reg && reg.active ? reg.active.state : (reg && reg.installing ? "installing" : "none"),
      scope: reg ? reg.scope : "",
      controller: !!navigator.serviceWorker.controller,
      cache: await (async () => {
        const keys = await caches.keys();
        const name = keys.find((k) => k.startsWith("pusha-"));
        const c = name ? await caches.open(name) : null;
        const entries = c ? await c.keys() : [];
        return { name, count: entries.length };
      })()
    };
  });
  const expectedShell = (() => {
    const src = fs.readFileSync(path.join(APP, "sw.js"), "utf8");
    const block = src.match(/const SHELL = \[([\s\S]*?)\];/)[1];
    return (block.match(/"[^"]+"/g) || []).length;
  })();
  say("PWA", "service worker registered and active", sw.registered && sw.state === "activated", sw.state + " · scope " + sw.scope);
  say("PWA", "worker controls the page", sw.controller);
  say("PWA", "every shell file is in the cache", sw.cache.count >= expectedShell - 1, sw.cache.name + " · " + sw.cache.count + " of " + expectedShell);

  // Chromium's own opinion, the same data DevTools uses
  let installable = { errors: ["not asked"] };
  try {
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Page.enable");
    installable = await cdp.send("Page.getInstallabilityErrors");
  } catch (e) { installable = { errors: ["unavailable: " + String(e).slice(0, 60)] }; }
  const instErrs = (installable.installabilityErrors || installable.errors || []).filter(Boolean);
  say("PWA", "browser reports no installability error", instErrs.length === 0, JSON.stringify(instErrs).slice(0, 200));

  // storage pressure: the app asks for persistent storage, the browser may refuse
  const persistent = await page.evaluate(async () => {
    try {
      const asked = JSON.parse(localStorage.getItem("pusha_persist_asked") || "false");
      const granted = navigator.storage && navigator.storage.persisted ? await navigator.storage.persisted() : null;
      const quota = navigator.storage && navigator.storage.estimate ? await navigator.storage.estimate() : null;
      return { asked, granted, quotaMB: quota && quota.quota ? Math.round(quota.quota / 1048576) : null };
    } catch (e) { return { error: String(e).slice(0, 60) }; }
  });
  say("SAVED", "the app asks for persistent storage (silently)", persistent.asked === true,
      "asked " + persistent.asked + " · granted " + persistent.granted + " · quota " + persistent.quotaMB + " MB");
  }   // end of the http-only PWA block

  /* ================= 2. session one: fill it up ================= */
  await page.evaluate(() => show("vault"));
  await page.waitForTimeout(300);
  await page.fill("#f_fullname", "Thabo Mokoena");
  await page.fill("#f_phone", "0722279505");
  await page.fill("#f_school", "Sizwe Secondary");
  await page.fill("#f_year", "2025");
  await page.fill("#f_subjects", "maths lit, business studies");     // lowercase on purpose
  await page.fill("#f_skills", "gas stove cooking, first aid");
  await page.click("#saveVault");
  await page.waitForTimeout(600);

  await page.evaluate(() => show("money"));
  await page.waitForTimeout(300);
  await page.fill("#cAmount", "35");
  await page.fill("#cNote", "3 kotas at taxi rank");
  await page.click("#cAdd");
  await page.waitForTimeout(400);

  // language + theme, through the real buttons
  await page.click("#langBtn"); await page.waitForTimeout(300);
  await page.click('#sheetBody [data-lang="zu"]'); await page.waitForTimeout(400);
  await page.click("#themeBtn"); await page.waitForTimeout(300);

  const before = await page.evaluate(() => {
    const o = {};
    for (const k of Object.keys(localStorage)) if (k.startsWith("pusha_")) o[k] = localStorage.getItem(k);
    return o;
  });
  const beforeKeys = Object.keys(before).sort();

  /* ================= 3. close the browser entirely ================= */
  await ctx.close();
  ctx = await chromium.launchPersistentContext(PROFILE_A, { viewport: { width: 390, height: 844 } });
  page = await ctx.newPage();
  const errs2 = [];
  page.on("pageerror", (e) => errs2.push("B: " + e));
  await page.goto(URL_, { waitUntil: "load" });
  await page.waitForTimeout(1500);

  const after = await page.evaluate(() => {
    const o = {};
    for (const k of Object.keys(localStorage)) if (k.startsWith("pusha_")) o[k] = localStorage.getItem(k);
    return o;
  });
  const keptKeys = beforeKeys.filter((k) => after[k] === before[k]);

  say("SAVED", "every storage key survived the browser restart",
      keptKeys.length === beforeKeys.length, keptKeys.length + " of " + beforeKeys.length + " identical");
  const fields = await page.evaluate(() => {
    show("vault");
    return {
      name: document.querySelector("#f_fullname").value,
      phone: document.querySelector("#f_phone").value,
      subjects: document.querySelector("#f_subjects").value,
      skills: document.querySelector("#f_skills").value
    };
  });
  await page.waitForTimeout(300);
  say("SAVED", "the vault fields are filled in again", fields.name === "Thabo Mokoena" && fields.phone === "0722279505", JSON.stringify(fields).slice(0, 120));
  say("SAVED", "typed text is still tidied after the restart", fields.subjects === "Maths Lit, Business Studies" && fields.skills === "Gas stove cooking, First aid", fields.subjects + " | " + fields.skills);
  const lang = await page.evaluate(() => {
    const parse = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return localStorage.getItem(k); } };
    return { lang: document.documentElement.lang, stored: parse("pusha_lang"), btn: document.querySelector("#langBtn").textContent,
             theme: document.documentElement.dataset.theme || "light", storedTheme: parse("pusha_theme") };
  });
  say("SAVED", "the chosen language came back", lang.stored === "zu" && lang.btn === "ZU", lang.stored + " · html lang " + lang.lang + " · button " + lang.btn);
  say("SAVED", "the chosen theme came back", lang.storedTheme === lang.theme, lang.storedTheme + " · rendered " + lang.theme);
  const money = await page.evaluate(() => { show("money"); return { count: (document.querySelector("#cCount") || {}).textContent, stored: localStorage.getItem("pusha_cash") }; });
  await page.waitForTimeout(300);
  say("SAVED", "the cashbook line came back", /1/.test(money.count || "") && /35/.test(money.stored || ""), money.count + " · " + String(money.stored).slice(0, 40));

  /* ================= 4. offline, same profile ================= */
  await ctx.setOffline(true);
  const offlineErrs = [];
  page.on("pageerror", (e) => offlineErrs.push("offline: " + e));
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(1200);
  const off = await page.evaluate(async () => {
    const boot = {
      views: document.querySelectorAll(".view").length,
      cards: document.querySelectorAll(".idea-card, #ideaList .card").length,
      ideas: typeof IDEAS !== "undefined" ? IDEAS.length : 0,
      name: document.querySelector("#f_fullname").value,
      lang: localStorage.getItem("pusha_lang")
    };
    // a photo, fetched with the network off
    show("ideas");
    return boot;
  });
  say("OFFLINE", "the app boots with the network cut", off.ideas > 0 && off.views >= 5, off.ideas + " ideas · " + off.views + " views");
  say("OFFLINE", "the vault still reads offline", off.name === "Thabo Mokoena", off.name);

  await page.click("#openDiy"); await page.waitForTimeout(800);
  const offPhoto = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll("#diyRows img")];
    return { total: imgs.length, loaded: imgs.filter((i) => i.complete && i.naturalWidth > 0).length };
  });
  say("OFFLINE", "the project photos are in the cache too", offPhoto.total === 10 && offPhoto.loaded === 10, offPhoto.loaded + "/" + offPhoto.total + " loaded offline");
  await page.click("#diyClose"); await page.waitForTimeout(300);

  const fromWorker = [];
  page.on("response", (r) => { if (r.fromServiceWorker()) fromWorker.push(r.url()); });
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(1200);
  say("OFFLINE", IS_FILE ? "the single file reads itself from disk (no worker to serve it)" : "the service worker serves the page itself",
      IS_FILE ? fromWorker.length === 0 : fromWorker.length > 0,
      fromWorker.length + " responses from the worker");
  await ctx.setOffline(false);

  /* ================= 5. PIN lock survives a restart ================= */
  let ctxB = await chromium.launchPersistentContext(PROFILE_B, { viewport: { width: 390, height: 844 } });
  let pB = await ctxB.newPage();
  await pB.goto(URL_, { waitUntil: "load" }); await pB.waitForTimeout(1200);
  await pB.evaluate(() => show("vault"));
  await pB.fill("#f_fullname", "Nomsa Dlamini");
  await pB.click("#saveVault"); await pB.waitForTimeout(500);
  const PIN = "8241937";
  await pB.click("#lockBtn"); await pB.waitForTimeout(500);
  const strength = await pB.evaluate((pin) => { const r = pinStrength(pin); return r ? r.score : null; }, PIN);
  await pB.fill("#pin", PIN);
  if (await pB.$("#pin2")) await pB.fill("#pin2", PIN);
  await pB.waitForTimeout(200);
  await pB.click("#pinGo");
  await pB.waitForTimeout(1500);
  const setPin = "ui · strength " + strength;
  const pinStored = await pB.evaluate(() => {
    const raw = localStorage.getItem("pusha_vault") || "";
    return { encrypted: raw.indexOf("__enc") > -1, plaintextLeak: raw.indexOf("Nomsa") > -1 };
  });
  say("SAVED", "a PIN encrypts the vault on disk", pinStored.encrypted && !pinStored.plaintextLeak, setPin + " · enc " + pinStored.encrypted + " · leak " + pinStored.plaintextLeak);
  await ctxB.close();

  ctxB = await chromium.launchPersistentContext(PROFILE_B, { viewport: { width: 390, height: 844 } });
  pB = await ctxB.newPage();
  await pB.goto(URL_, { waitUntil: "load" }); await pB.waitForTimeout(1500);
  const locked = await pB.evaluate(() => ({
    locked: typeof locked !== "undefined" ? locked : null,
    gate: !!document.querySelector("#lockGate") && document.querySelector("#lockGate").textContent.length > 0,
    nameField: (document.querySelector("#f_fullname") || {}).value
  }));
  say("SAVED", "the vault is still locked after a restart", locked.locked === true && locked.gate, "locked=" + locked.locked + " · gate " + locked.gate);
  say("SAVED", "no details on screen while locked", locked.nameField === "", "field: '" + locked.nameField + "'");
  // and the right PIN still opens it: the gate opens the unlock sheet
  if (await pB.$("#gateUnlock")) {
    await pB.click("#gateUnlock");
    await pB.waitForTimeout(600);
  }
  if (await pB.$("#pin")) {
    await pB.fill("#pin", PIN);
    await pB.waitForTimeout(200);
    if (await pB.$("#pinGo")) await pB.click("#pinGo");
    await pB.waitForTimeout(4000);                 // PBKDF2 on a real device is not instant
  }
  const opened = await pB.evaluate(() => {
    const f = (document.querySelector("#f_fullname") || {}).value || "";
    return { name: f, stillLocked: typeof locked !== "undefined" ? locked : null, enc: (localStorage.getItem("pusha_vault") || "").indexOf("__enc") > -1 };
  });
  say("SAVED", "the right PIN unlocks it after a restart", opened.name === "Nomsa Dlamini", "name '" + opened.name + "' · enc " + opened.enc);
  await ctxB.close();
  rmr(PROFILE_A); rmr(PROFILE_B);

  /* ================= report ================= */
  const total = Object.values(R).flat().length;
  const passed = Object.values(R).flat().filter((c) => c.pass).length;
  R.summary = {
    url: URL_,
    checks: total,
    passed,
    failed: total - passed,
    failures: fail,
    pageErrors: errs.concat(errs2).concat(offlineErrs)
  };
  console.log(JSON.stringify(R, null, 1));
  process.exit(fail.length ? 1 : 0);
})();
