/* Pusha — tests/features.js
   The 1.6 features, driven in a real browser.
   usage: node tests/features.js <url> <tag>            e.g. file:///…/index.html local */
const { chromium } = require("playwright");
const fs = require("fs");
const os = require("os");
const path = require("path");

const url = process.argv[2] || "file://" + path.resolve(__dirname, "../app/index.html");
const tag = process.argv[3] || "local";

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ["clipboard-read", "clipboard-write"], acceptDownloads: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("dialog", d => d.accept());
  const R = {};

  const click = sel => page.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error("no " + s); e.click(); }, sel);
  const txt = sel => page.evaluate(s => { const e = document.querySelector(s); return e ? e.textContent.trim() : null; }, sel);
  const visible = sel => page.evaluate(s => { const e = document.querySelector(s); return !!(e && e.offsetParent); }, sel);

  await page.goto(url);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload();
  await page.waitForTimeout(400);

  /* ---------- 1. search ---------- */
  await page.evaluate(() => show("ideas"));
  await page.waitForTimeout(200);
  const allCards = await page.evaluate(() => document.querySelectorAll("#ideaList .ideacard").length);
  await page.fill("#ideaSearch", "kota");
  await page.waitForTimeout(250);
  R.search = {
    before: allCards,
    after: await page.evaluate(() => document.querySelectorAll("#ideaList .ideacard").length),
    names: await page.evaluate(() => Array.from(document.querySelectorAll("#ideaList .name")).map(n => n.textContent))
  };
  await page.fill("#ideaSearch", "zzzznothing");
  await page.waitForTimeout(250);
  R.searchEmpty = await txt("#ideaList p");
  await page.fill("#ideaSearch", "");
  await page.waitForTimeout(250);

  /* ---------- 2. freshness line ---------- */
  R.freshness = { ideas: await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll("#v-ideas p")).find(p => /November 2026/.test(p.textContent));
    return el ? el.textContent.trim().slice(0, 60) : null;
  }) };

  /* ---------- 3. tap targets + contrast sweep ---------- */
  R.tapTargets = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll("button, a[href], input:not([type=hidden]), select, label.btn").forEach(el => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      if (el.offsetParent === null) return;
      // deliberate exception: the primary Copy button is visually small by request,
      // its touch area is extended to 44px by a ::after in styles.css
      if (el.id === "copyPreviewBtn") return;
      if (r.height < 40) bad.push({ el: (el.id || el.className || el.tagName).toString().slice(0, 28), h: Math.round(r.height), w: Math.round(r.width) });
    });
    return { count: bad.length, worst: bad.slice(0, 12) };
  });

  R.contrast = await page.evaluate(() => {
    const lum = c => { const [r, g, b] = c.match(/\d+/g).slice(0, 3).map(Number).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return Math.round(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)) * 100) / 100; };
    const opaqueBg = el => {
      let n = el;
      while (n && n !== document.documentElement){
        const bg = getComputedStyle(n).backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return bg;
        n = n.parentElement;
      }
      return getComputedStyle(document.body).backgroundColor;
    };
    const out = [];
    [".lede", ".small.muted", ".tiny.muted", ".meta span", ".chip.sm", ".chip.on", ".hero .mini", ".btn.sm"].forEach(sel => {
      const el = document.querySelector(sel);
      if (!el) return;
      const cs = getComputedStyle(el);
      out.push({ sel, size: cs.fontSize, ratio: ratio(cs.color, opaqueBg(el)) });
    });
    out.push({ sel: "lowest size", size: Math.min(...Array.from(document.querySelectorAll("p,span,div,label")).map(e => parseFloat(getComputedStyle(e).fontSize)).filter(Boolean)) + "px" });
    return out;
  });

  /* ---------- 4. backup: export, wipe, import ---------- */
  await page.evaluate(() => show("vault"));
  await page.waitForTimeout(200);
  await page.fill("#f_fullname", "Naledi Backup");
  await page.fill("#f_phone", "0721234567");
  await page.waitForTimeout(700);
  await page.evaluate(() => { $("#f_email").value = "n@example.com"; $("#f_email").dispatchEvent(new Event("change")); });
  await page.waitForTimeout(500);
  await page.click('[data-view="vault"]').catch(() => {});
  await page.evaluate(() => show("vault"));
  const dl = await Promise.all([page.waitForEvent("download", { timeout: 8000 }).catch(() => null), click("#bkSave")]);
  const download = dl[0];
  let backupPath = null;
  if (download) {
    backupPath = path.join(os.tmpdir(), "pusha-backup-test.json");
    await download.saveAs(backupPath);
  }
  R.backupExport = { downloaded: !!download, name: download ? download.suggestedFilename() : null, bytes: backupPath ? fs.statSync(backupPath).size : 0 };
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload();
  await page.waitForTimeout(400);
  R.backupWiped = await page.evaluate(() => document.querySelector("#f_fullname").value || "");
  if (backupPath) {
    await page.evaluate(() => show("vault"));
    await page.setInputFiles("#bkIn", backupPath);
    await page.waitForTimeout(700);
    R.backupPrompt = await page.evaluate(() => ({
      asked: !!document.querySelector("#bkGo"),
      offersKeep: !!document.querySelector("#bkKeep")
    }));
    if (await page.evaluate(() => !!document.querySelector("#bkGo"))) {
      await page.evaluate(() => document.querySelector("#bkGo").click());
      await page.waitForTimeout(2000);
    }
  }
  R.backupRestored = await page.evaluate(() => ({ name: document.querySelector("#f_fullname").value, email: document.querySelector("#f_email").value, stored: !!localStorage.getItem("pusha_vault") }));

  /* ---------- 5. a save that fails must say so ---------- */
  await page.evaluate(() => {
    window.__realSet = Storage.prototype.setItem;
    Storage.prototype.setItem = function () { throw new DOMException("full", "QuotaExceededError"); };
  });
  await page.fill("#f_fullname", "Name That Cannot Save");
  await page.evaluate(() => { $("#f_fullname").dispatchEvent(new Event("change")); });
  await page.waitForTimeout(600);
  await page.evaluate(() => { try { saveVault(false); } catch (e) {} });
  await page.waitForTimeout(500);
  R.quota = {
    banner: await page.evaluate(() => { const b = document.getElementById("storeFail"); return b ? b.textContent.trim().slice(0, 60) : null; }),
    toast: await txt("#toast")
  };
  await page.evaluate(() => { Storage.prototype.setItem = window.__realSet; document.getElementById("storeFail") && document.getElementById("storeFail").remove(); });

  /* ---------- 6. undo: a cashbook line ---------- */
  await page.evaluate(() => show("money"));
  await page.fill("#cAmount", "35");
  await page.fill("#cNote", "3 kotas");
  await click("#cAdd");
  await page.waitForTimeout(300);
  const beforeDel = await page.evaluate(() => document.querySelectorAll("#cEntries .entry").length);
  await page.evaluate(() => { const b = document.querySelector("#cEntries [data-del]"); b.click(); });
  await page.waitForTimeout(300);
  const afterDel = await page.evaluate(() => document.querySelectorAll("#cEntries .entry").length);
  const undoShown = await page.evaluate(() => { const t = document.getElementById("toast"); return t.classList.contains("act") ? t.textContent.trim() : null; });
  await page.evaluate(() => { const b = document.getElementById("toastAct"); if (b) b.click(); });
  await page.waitForTimeout(300);
  R.undo = { beforeDel, afterDel, undoShown, afterUndo: await page.evaluate(() => document.querySelectorAll("#cEntries .entry").length) };

  /* ---------- 7. cashbook share / export ---------- */
  await page.evaluate(() => { const b = document.getElementById("cExport"); b && b.click(); });
  await page.waitForTimeout(500);
  R.cashExport = { hasShare: await page.evaluate(() => typeof navigator.share === "function"), clip: (await page.evaluate(() => navigator.clipboard.readText().catch(() => ""))).slice(0, 40) };

  /* ---------- 8. CV sheet: PDF hint + share ---------- */
  await page.evaluate(() => show("pack"));
  await page.evaluate(() => document.getElementById("openCV").click());
  await page.waitForTimeout(700);
  R.cvSheet = {
    pdfHint: await page.evaluate(() => { const b = document.getElementById("sheetBody"); return /Save as PDF/.test(b.textContent); }),
    shareBtn: await visible("#shareCV")
  };
  await page.evaluate(() => document.getElementById("sheetClose") && document.getElementById("sheetClose").click());
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  /* ---------- 9. Escape closes a sheet and focus comes back ---------- */
  await page.evaluate(() => { show("ideas"); document.getElementById("openQuiz").focus(); document.getElementById("openQuiz").click(); });
  await page.waitForTimeout(400);
  const sheetOpen = await page.evaluate(() => document.getElementById("sheet").classList.contains("on"));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  R.sheetKeyboard = {
    opened: sheetOpen,
    closedByEsc: await page.evaluate(() => !document.getElementById("sheet").classList.contains("on")),
    focusBack: await page.evaluate(() => document.activeElement && document.activeElement.id)
  };

  /* ---------- 10. photo: add then remove ---------- */
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==", "base64");
  const pngPath = path.join(os.tmpdir(), "pusha-photo.png");
  fs.writeFileSync(pngPath, png);
  await page.evaluate(() => show("vault"));
  await page.setInputFiles("#photoIn", pngPath);
  await page.waitForTimeout(900);
  const photoIn = await page.evaluate(() => !!vault.photo);
  const rmVisible = await visible("#photoRm");
  await page.evaluate(() => document.getElementById("photoRm").click());
  await page.waitForTimeout(500);
  R.photo = { added: photoIn, removeButton: rmVisible, removed: await page.evaluate(() => !vault.photo), buttonHiddenAfter: !(await visible("#photoRm")) };

  /* ---------- 11. PIN + auto-lock ---------- */
  await page.evaluate(() => document.getElementById("lockBtn").click());
  await page.waitForTimeout(300);
  await page.evaluate(() => { ["#pin", "#pin2"].forEach(sel => { const el = document.querySelector(sel); if (el) { el.value = "741905"; el.dispatchEvent(new Event("input", { bubbles: true })); } }); });
  await page.evaluate(() => document.getElementById("pinGo").click());
  await page.waitForTimeout(1400);
  const pinSet = await page.evaluate(() => !!JSON.parse(localStorage.getItem("pusha_vault")).__enc);
  await page.evaluate(() => document.getElementById("lockBtn").click());
  await page.waitForTimeout(300);
  R.autoLock = {
    pinSet,
    chips: await page.evaluate(() => Array.from(document.querySelectorAll("#sheetBody [data-al]")).map(b => b.textContent)),
    backupNoteEncrypted: await page.evaluate(() => { const n = document.getElementById("bkNote"); return n ? /PIN/.test(n.textContent) : null; })
  };
  await page.evaluate(() => { const b = document.querySelector('#sheetBody [data-al="1"]'); b.click(); });
  await page.waitForTimeout(200);
  R.autoLock.saved = await page.evaluate(() => JSON.parse(localStorage.getItem("pusha_autolock")));
  await page.evaluate(() => document.getElementById("pinCancel").click());
  // pretend the tab was hidden for 70 seconds
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    document.dispatchEvent(new Event("visibilitychange"));
    hiddenAt = Date.now() - 70 * 1000;
    Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(600);
  R.autoLock.lockedAfterAway = await page.evaluate(() => document.querySelector("#f_fullname").disabled);

  /* ---------- 11b. a backup taken with a PIN stays encrypted ---------- */
  const dl2 = await Promise.all([page.waitForEvent("download", { timeout: 8000 }).catch(() => null), (async () => {
    await page.evaluate(() => show("vault"));
    await page.waitForTimeout(200);
    await click("#bkSave");
  })()]);
  if (dl2[0]) {
    const p2 = path.join(os.tmpdir(), "pusha-backup-enc.json");
    await dl2[0].saveAs(p2);
    const raw = fs.readFileSync(p2, "utf8");
    R.backupWithPin = { hasCipher: /"__enc": ?true/.test(raw), leaksName: /Sipho|Naledi|Backup/.test(raw), bytes: raw.length };
  } else R.backupWithPin = { hasCipher: null, note: "no download event" };

  /* ---------- 12. About ---------- */
  await page.evaluate(() => show("path"));
  await page.evaluate(() => document.getElementById("aboutBtn").click());
  await page.waitForTimeout(400);
  R.about = {
    version: (await txt("#sheetBody h2")) || "",
    feedbackButton: await visible("#aboutFb"),
    novemberAcc: await page.evaluate(() => /November 2026/.test(document.getElementById("sheetBody").textContent))
  };
  await page.evaluate(() => document.getElementById("aboutFb").click());
  await page.waitForTimeout(300);
  R.feedback = { textarea: await visible("#fbText"), copy: await visible("#fbCopy") };

  /* ---------- 12b. PIN policy: short and weak PINs are refused ---------- */
  await page.evaluate(() => { try { localStorage.removeItem("pusha_vault"); } catch (e) {} });
  await page.reload(); await page.waitForTimeout(400);
  await page.evaluate(() => { show("vault"); });
  await page.fill("#f_fullname", "Policy Test");
  await page.waitForTimeout(500);
  const setPin = async (val) => {
    const open = await page.evaluate(() => !document.querySelector("#pin"));
    if (open) { await click("#lockBtn"); await page.waitForTimeout(250); }
    else { await click("#lockBtn"); await page.waitForTimeout(250); if (await visible("#setPin")) { await click("#setPin"); await page.waitForTimeout(150); } }
    await page.evaluate(v => { ["#pin", "#pin2"].forEach(sel => { const el = document.querySelector(sel); if (el) { el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); } }); }, val);
    await page.waitForTimeout(250);
    const meter = await page.evaluate(() => { const m = document.querySelector("#pinMeter"); return m ? m.textContent.trim() : null; });
    await click("#pinGo");
    await page.waitForTimeout(1800);
    const store = await page.evaluate(() => { const v = JSON.parse(localStorage.getItem("pusha_vault") || "null"); return v && v.__enc ? v : null; });
    const toast = await page.evaluate(() => { const t = document.getElementById("toast"); return t.classList.contains("on") ? t.textContent.trim() : null; });
    return { meter, stored: !!(store && store.__enc), iter: store ? store.iter : null };
  };
  const shortPin = await setPin("1357");
  const weakPin = await setPin("111111");
  await page.evaluate(() => { const el = document.querySelector("#pinCancel"); if (el) el.click(); });
  await page.waitForTimeout(200);
  await page.evaluate(() => document.getElementById("lockBtn").click());
  await page.waitForTimeout(250);
  if (await visible("#setPin")) { await click("#setPin"); await page.waitForTimeout(150); }
  await page.evaluate(() => { ["#pin", "#pin2"].forEach(sel => { const el = document.querySelector(sel); if (el) { el.value = "741905"; el.dispatchEvent(new Event("input", { bubbles: true })); } }); });
  await page.waitForTimeout(400);
  const goodMeter = await page.evaluate(() => document.querySelector("#pinMeter").textContent.trim());
  await click("#pinGo");
  await page.waitForTimeout(2200);
  const goodStore = await page.evaluate(() => JSON.parse(localStorage.getItem("pusha_vault") || "null"));
  R.pinPolicy = {
    fourDigits: shortPin,
    allOnes: weakPin,
    sixDigitsMeter: goodMeter,
    sixDigitsAccepted: !!(goodStore && goodStore.__enc),
    iterations: goodStore ? goodStore.iter : null
  };

  /* ---------- 13. every key exists in all four languages ---------- */
  R.i18nParity = await page.evaluate(() => {
    const en = Object.keys(I18N.en);
    const out = { en: en.length };
    ["zu", "st", "nr"].forEach(l => {
      out[l] = { count: Object.keys(I18N[l]).length, missing: en.filter(k => I18N[l][k] == null), extra: Object.keys(I18N[l]).filter(k => I18N.en[k] == null) };
    });
    return out;
  });

  /* ---------- 13b. four hand-written versions of every copy-paste block ---------- */
  await page.evaluate(() => { show("pack"); });
  await page.waitForTimeout(350);
  R.blockVariants = await page.evaluate(() => {
    const out = {};
    ["intro", "cv", "pitch", "fund"].forEach(k => {
      const texts = [0, 1, 2, 3].map(i => { setVariant(k, i); return showBlock(k, false, true); });
      out[k] = { count: new Set(texts).size, shortest: Math.min(...texts.map(t => t.length)),
                 longest: Math.max(...texts.map(t => t.length)) };
    });
    // the copy button must hand over the version that is on screen
    setVariant("pitch", 3);
    showBlock("pitch", false, true);
    const shown = document.getElementById("copyPreview").textContent;
    out.pitchV3Starts = shown.slice(0, 14);
    out.copyUsesSelected = shown === blocks().pitch[3] && shown !== blocks().pitch[0];
    // and the choice is remembered
    return out;
  });
  await page.reload(); await page.waitForTimeout(600);
  R.blockVariantsPersist = await page.evaluate(() => {
    const saved = Store.get("pusha_blockvar", {}) || {};
    const ok = saved.pitch === 3;
    Store.set("pusha_blockvar", {});
    return ok;
  });
  R.railHasNoFooter = await page.evaluate(() => document.querySelectorAll(".navfoot").length);

  /* ---------- 13c. text from a person or a file never becomes code ---------- */
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload(); await page.waitForTimeout(500);
  R.inputSafety = await page.evaluate(() => {
    show("vault");
    const evil = '<img src=x onerror="window.__pwned=1">';
    document.querySelector("#f_fullname").value = evil;
    document.querySelector("#f_fullname").dispatchEvent(new Event("input", { bubbles: true }));
    renderCVThumb();
    document.querySelector("#openCV").click();
    const sheet = document.getElementById("sheetBody").innerHTML;
    closeSheet();
    document.querySelector("#printSheet").click();
    const printed = document.getElementById("printArea").innerHTML;
    const out = {
      executed: !!window.__pwned,
      cvEscaped: sheet.indexOf("&lt;img src=x") > -1 && !/<img src=x onerror/.test(sheet),
      printEscaped: printed.indexOf("&lt;img src=x") > -1
    };
    // a "photo" that points at a server is dropped, not fetched
    vault.photo = "https://evil.example/track.png";
    const thumb = (renderCVThumb(), document.getElementById("cvThumb").innerHTML);
    out.remotePhotoDropped = thumb.indexOf("evil.example") === -1;
    vault.photo = "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=";
    out.svgPhotoDropped = renderCVThumb() === undefined && document.getElementById("cvThumb").innerHTML.indexOf("svg+xml") === -1;
    delete vault.photo;
    return out;
  });
  R.backupSanitised = await page.evaluate(() => {
    const hostile = { app:"pusha", v:1, at:"2026-11-04T00:00:00Z", data:{
      pusha_vault: { fullname: "Real Name", phone: "072 000 0000" },
      evil_key: "dropped",
      "__proto__": { polluted: true }
    } };
    const bk = backupClean(JSON.stringify(hostile));
    return {
      keysKept: bk ? Object.keys(bk.data) : [],
      foreignKeyDropped: bk ? !("evil_key" in bk.data) : false,
      protoDropped: bk ? !Object.prototype.hasOwnProperty.call(bk.data, "__proto__") : false,
      rejectsNonPusha: backupClean(JSON.stringify({ hello: "world" })) === null,
      rejectsGarbage: backupClean("not json") === null
    };
  });

  /* ---------- 13d. human error: the mistakes people actually make ---------- */
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload(); await page.waitForTimeout(500);
  await page.evaluate(() => { show("vault"); document.querySelector("#lockBtn").click(); });
  await page.waitForTimeout(400);
  R.pinDoubleEntry = await page.evaluate(() => {
    const set = (sel, v) => { const el = document.querySelector(sel); el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); };
    set("#pin", "741905"); set("#pin2", "741906");
    const mismatchBlocked = document.querySelector("#pinGo").disabled;
    set("#pin2", "741905");
    return { secondBox: !!document.querySelector("#pin2"), mismatchBlocked, matchesUnblock: !document.querySelector("#pinGo").disabled };
  });
  await page.evaluate(() => { const el = document.querySelector("#pin2"); el.value = "999999"; el.dispatchEvent(new Event("input", { bubbles: true })); document.querySelector("#pinGo").disabled = false; document.querySelector("#pinGo").click(); });
  await page.waitForTimeout(900);
  R.pinTypoRefused = await page.evaluate(() => ({
    encrypted: !!(JSON.parse(localStorage.getItem("pusha_vault") || "{}")).__enc,
    toast: document.getElementById("toast").textContent
  }));
  await page.evaluate(() => { const el = document.querySelector("#pinCancel"); if (el) el.click(); });
  await page.waitForTimeout(200);

  R.moneyTyping = await page.evaluate(() => {
    show("money");
    try { localStorage.removeItem("pusha_cash"); } catch (e) {}
    cash.length = 0;
    const add = (a, n) => { document.querySelector("#cAmount").value = a; document.querySelector("#cNote").value = n || ""; document.querySelector("#cAdd").click(); return JSON.parse(localStorage.getItem("pusha_cash") || "[]"); };
    const afterR = add("R1 200,50", "stock");
    const afterTypo = add("12oo", "typo");
    const typoToast = document.getElementById("toast").textContent;
    const afterDup = add("35", "kota");
    const afterDup2 = add("35", "kota");
    return {
      parsed: afterR.length ? afterR[afterR.length - 1].amt : null,
      typoRefused: afterTypo.length === afterR.length,
      typoToast,
      duplicateDropped: afterDup2.length === afterDup.length,
      duplicateToast: document.getElementById("toast").textContent
    };
  });
  R.contactHints = await page.evaluate(() => {
    show("vault");
    const set = (id, v) => { const el = document.querySelector("#" + id); el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); };
    const hint = () => document.getElementById("contactHint").textContent;
    set("f_email", "thabo.gmail.com"); const bad = hint();
    set("f_email", "thabo@gmail.com"); const good = hint();
    set("f_phone", "072 44o 1180"); const badPhone = hint();
    set("f_phone", "072 445 1180"); const goodPhone = hint();
    return { warnsBadEmail: !!bad, clearsOnGood: good === "", warnsBadPhone: !!badPhone, clearsOnGoodPhone: goodPhone === "" };
  });

  /* ---------- 13e. your own idea works all the way through ---------- */
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await page.reload(); await page.waitForTimeout(500);
  await page.evaluate(() => show("ideas"));
  await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelector("#addIdeaBtn").click());
  await page.waitForTimeout(350);
  await page.evaluate(() => {
    const set = (id, v) => { const el = document.querySelector(id); if (el) { el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); } };
    set("#ni_name", "Sipho Shoe Shine"); set("#ni_price", "20"); set("#ni_cost", "6"); set("#ni_unit", "shoe");
    set("#ni_notes", "Rank work, 06:00–08:00");
    document.querySelector("#ni_save").click();
  });
  await page.waitForTimeout(1200);
  const ownSheet = await page.evaluate(() => ({
    opened: (document.querySelector("#sheetBody h2") || {}).textContent || "",
    close: !!document.querySelector("#ideaClose"),
    edit: !!document.querySelector("#editIdea"),
    share: !!document.querySelector("#shareIdea"),
    cards: document.querySelectorAll("#myIdeasWrap .ideacard").length
  }));
  await page.evaluate(() => document.querySelector("#editIdea").click());
  await page.waitForTimeout(500);
  const ownEdit = await page.evaluate(() => ({ deleteButton: !!document.querySelector("#ni_delete"), name: (document.querySelector("#ni_name") || {}).value }));
  await page.evaluate(() => document.querySelector("#ni_delete").click());
  await page.waitForTimeout(400);
  const ownDeleted = await page.evaluate(() => document.querySelectorAll("#myIdeasWrap .ideacard").length);
  await page.evaluate(() => document.querySelector("#toastAct").click());
  await page.waitForTimeout(400);
  R.ownIdea = { ...ownSheet, edit: ownEdit, deleted: ownDeleted, undoRestored: await page.evaluate(() => document.querySelectorAll("#myIdeasWrap .ideacard").length) };

  /* ---------- 13f. installable app (only when served over http) ---------- */
  const isHttp = /^https?:/.test(page.url());
  if (isHttp) {
    const reg = await page.evaluate(async () => {
      try {
        const r = await navigator.serviceWorker.ready;
        return { scope: r.scope, state: (r.active || {}).state || "" };
      } catch (e) { return { scope: "", state: "none" }; }
    });
    await page.waitForTimeout(500);
    const cacheInfo = await page.evaluate(async () => {
      const keys = await caches.keys();
      if (!keys.length) return { caches: [], count: 0, hasShell: false };
      const c = await caches.open(keys[0]);
      const urls = (await c.keys()).map(r => new URL(r.url).pathname);
      return { caches: keys, count: urls.length, hasShell: urls.some(u => /index\.html$/.test(u)) };
    });
    const man = await page.evaluate(async () => {
      const link = document.querySelector('link[rel=manifest]');
      if (!link) return { ok: false };
      const m = await (await fetch(link.href)).json();
      const statuses = [];
      for (const i of m.icons) statuses.push((await fetch(new URL(i.src, link.href))).status);
      const favStatus = [];
      for (const l of document.querySelectorAll('link[rel=icon]')) {
        if (l.href.startsWith("data:")) { favStatus.push(200); continue; }
        favStatus.push((await fetch(l.href)).status);
      }
      return {
        favicons: favStatus,
        name: m.name, display: m.display, theme: m.theme_color,
        sizes: m.icons.filter(i => i.type === "image/png").map(i => i.sizes),
        maskable: m.icons.some(i => i.purpose === "maskable"),
        allIconsLoad: statuses.every(s => s === 200)
      };
    });
    // the promise that matters: with the network cut, a reload still works
    await ctx.setOffline(true);
    await page.reload({ waitUntil: "domcontentloaded" }).catch(() => {});
    await page.waitForTimeout(1200);
    const offline = await page.evaluate(() => {
      show("ideas");
      const cards = document.querySelectorAll("#ideaList .ideacard").length;
      show("vault");
      const f = document.querySelector("#f_fullname");
      if (f) { f.value = "Offline Check"; f.dispatchEvent(new Event("input", { bubbles: true })); }
      return { booted: document.title.indexOf("Pusha") === 0, cards, typed: f ? f.value : "" };
    });
    await ctx.setOffline(false);
    R.pwa = { registered: reg.state === "activated", scope: reg.scope, cache: cacheInfo, manifest: man, offline };
  } else {
    R.pwa = { skipped: "file:// has no service worker (it needs none — it is one file)" };
  }

  /* ---------- 13g. the mark shows up in every theme ---------- */
  const markIn = async theme => {
    await page.evaluate(t => document.documentElement.setAttribute("data-theme", t), theme);
    await page.waitForTimeout(150);
    return page.evaluate(() => {
      const tile = document.querySelector("header.top .logo");
      const letter = document.querySelector("#i-logo path");
      const bar = document.querySelector("#i-logo rect");
      const r = tile.getBoundingClientRect();
      return {
        tile: getComputedStyle(tile).backgroundColor,
        letter: letter ? getComputedStyle(letter).fill : "",
        bar: bar ? getComputedStyle(bar).fill : "",
        size: [Math.round(r.width), Math.round(r.height)],
        colourIndependent: getComputedStyle(tile).backgroundColor === "rgb(11, 92, 70)"
      };
    });
  };
  const markLight = await markIn("light");
  const markDark = await markIn("dark");
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  R.mark = {
    light: markLight,
    dark: markDark,
    sameInBoth: JSON.stringify(markLight) === JSON.stringify(markDark),
    letterCream: markLight.letter === "rgb(247, 245, 239)" && markDark.letter === "rgb(247, 245, 239)",
    barsGold: markLight.bar === "rgb(200, 137, 31)",
    onIcon: markLight.size[0] === 36 && markLight.size[1] === 36
  };

  /* ---------- 13h. the pull-corner on the Skills box ---------- */
  await page.evaluate(() => { try { localStorage.removeItem("pusha_tip_resize"); localStorage.removeItem("pusha_skills_h"); } catch (e) {} });
  await page.reload(); await page.waitForTimeout(600);
  await page.evaluate(() => show("vault"));
  await page.waitForTimeout(300);
  const gripFirst = await page.evaluate(() => {
    const g = document.querySelector("#skillsGrip");
    const r = g ? g.getBoundingClientRect() : { width: 0, height: 0 };
    return { there: !!g, ring: g ? g.classList.contains("new") : false,
             size: [Math.round(r.width), Math.round(r.height)],
             aria: g ? g.getAttribute("aria-label") : "" };
  });
  await page.click("#skillsGrip");
  await page.waitForTimeout(400);
  const gripSheet = await page.evaluate(() => ({
    open: document.querySelector("#sheet").classList.contains("on"),
    hasTitle: !!(document.querySelector("#sheetBody h2") || {}).textContent,
    body: ((document.querySelector("#sheetBody p") || {}).textContent || "").slice(0, 40),
    hasGotIt: !!document.querySelector("#gripOk"),
    button: (document.querySelector("#gripOk") || {}).textContent || ""
  }));
  await page.click("#gripOk");
  await page.waitForTimeout(300);
  const gripLearned = await page.evaluate(() => ({
    ringGone: !document.querySelector("#skillsGrip").classList.contains("new"),
    stored: localStorage.getItem("pusha_tip_resize")
  }));
  // pull it: the box must grow and keep that size
  await page.evaluate(() => document.querySelector("#f_skills").scrollIntoView({ block: "center" }));
  await page.waitForTimeout(200);
  const gBox = await page.evaluate(() => { const r = document.querySelector("#skillsGrip").getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  const beforeH = await page.evaluate(() => Math.round(document.querySelector("#f_skills").getBoundingClientRect().height));
  await page.mouse.move(gBox.x, gBox.y);
  await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(gBox.x, gBox.y + i * 10);
  await page.mouse.up();
  await page.waitForTimeout(300);
  const afterH = await page.evaluate(() => Math.round(document.querySelector("#f_skills").getBoundingClientRect().height));
  const storedH = await page.evaluate(() => localStorage.getItem("pusha_skills_h"));
  await page.reload(); await page.waitForTimeout(600);
  const reloadH = await page.evaluate(() => Math.round(document.querySelector("#f_skills").getBoundingClientRect().height));
  R.skillsGrip = {
    first: gripFirst, sheet: gripSheet, learned: gripLearned,
    dragged: { before: beforeH, after: afterH, stored: storedH, sameAfterReload: reloadH === afterH }
  };

  /* ---------- 13i. the 10 make-and-sell projects ---------- */
  await page.evaluate(() => show("ideas"));
  await page.waitForTimeout(300);
  const diyCard = await page.evaluate(() => {
    const b = document.querySelector("#openDiy");
    if (!b) return { there: false };
    const r = b.getBoundingClientRect();
    return { there: true, label: b.textContent.trim().slice(0, 40), h: Math.round(r.height),
             icon: !!b.querySelector("use[href='#i-sparkle']") };
  });
  await page.click("#openDiy");
  await page.waitForTimeout(400);
  const diyList = await page.evaluate(() => {
    const rows = [...document.querySelectorAll("#diyRows .diyrow")];
    const imgs = rows.map(r => r.querySelector("img"));
    return {
      open: document.querySelector("#sheet").classList.contains("on"),
      count: rows.length,
      photos: imgs.filter(i => i && i.complete && i.naturalWidth > 0).length,
      photoKind: (imgs[0] || {}).src ? imgs[0].src.slice(0, 5) : "",
      prices: rows.map(r => (r.querySelector(".diymeta") || {}).textContent.trim()).slice(0, 3),
      thumbsLow: rows.filter(r => Math.round(r.getBoundingClientRect().height) < 48).length,
      tagsOneLine: rows.filter(r => {
        const g = r.querySelector(".diytag");
        return g && g.getBoundingClientRect().height < 26;      // never wraps to 2 lines
      }).length,
      title: (document.querySelector("#sheetBody h2") || {}).textContent || ""
    };
  });
  await page.click("#diyRows .diyrow");
  await page.waitForTimeout(400);
  const diyOne = await page.evaluate(() => {
    const body = document.querySelector("#sheetBody");
    return {
      title: (body.querySelector("h2") || {}).textContent || "",
      hero: !!body.querySelector(".diyhero img") &&
            body.querySelector(".diyhero img").naturalWidth > 0,
      heroNote: ((body.querySelector(".diyhero figcaption") || {}).textContent || "").slice(0, 30),
      noTagline: !body.querySelector("p.small.muted"),   // no sub-heading under the title
      pictures: body.querySelectorAll(".diypic svg").length,
      captions: [...body.querySelectorAll(".diypic figcaption")].map(f => f.textContent),
      need: body.querySelectorAll(".list li").length,
      steps: body.querySelectorAll(".diysteps li").length,
      stats: [...body.querySelectorAll(".diystats b")].map(b => b.textContent),
      sections: [...body.querySelectorAll("h3")].map(h => h.textContent),
      hasCopy: !!body.querySelector("#diyCopy"),
      hasBack: !!body.querySelector("#diyBack"),
      // the promise: nothing in the teaching screens reaches for the network
      remote: body.innerHTML.indexOf("http://") > -1 || body.innerHTML.indexOf("https://") > -1
    };
  });
  await page.click("#diyBack");
  await page.waitForTimeout(400);
  const diyBackTo = await page.evaluate(() => document.querySelectorAll("#diyRows .diyrow").length);
  await page.click("#diyClose");
  await page.waitForTimeout(300);
  // every project has 3 drawings, 4+ shopping lines, 6 steps
  const diyData = await page.evaluate(() => {
    const bad = DIY.filter(p => p.art.filter(a => DIY_ART[a]).length !== 3 || p.need.length < 4 ||
      p.steps.length < 6 || !p.sell || !p.watch || !p.price[0] || !p.price[1])
      .map(p => p.id);
    const ids = DIY.map(p => p.id);
    return { total: DIY.length, bad, uniqueIds: new Set(ids).size === ids.length,
             artBytes: Object.values(DIY_ART).join("").length };
  });
  R.diy = { card: diyCard, list: diyList, one: diyOne, backTo: diyBackTo, data: diyData };

  /* ---------- 13j. short headings: one line + the start mark, no ledes ---------- */
  const heads = await page.evaluate(() => {
    const views = ["vault", "pack", "ideas", "money", "path"];
    const rows = views.map(v => {
      const sec = document.querySelector("#v-" + v);
      const h1 = sec && sec.querySelector("h1");
      return {
        v,
        hasH1: !!h1,
        inRow: !!(h1 && h1.closest(".h1row")),
        marked: !!(h1 && h1.closest(".h1row") &&
                   h1.closest(".h1row").querySelector("use[href='#i-foundation']")),
        ledes: sec ? sec.querySelectorAll("p.lede").length : -1
      };
    });
    const allLedes = document.querySelectorAll("p.lede").length;
    const sheetHeads = document.querySelectorAll("#sheetBody .h1row use[href='#i-foundation']").length;
    return { rows, allLedes, sheetHeads };
  });
  // the learn sheet keeps the exact title the person asked for
  await page.evaluate(() => show("ideas"));
  await page.click("#openLearn");
  await page.waitForTimeout(400);
  const learnTitle = await page.evaluate(() => ({
    title: ((document.querySelector("#sheetBody h2") || {}).textContent || "").trim(),
    mark: !!document.querySelector("#sheetBody .h1row use[href='#i-foundation']"),
    under: document.querySelectorAll("#sheetBody .h1row ~ p.small").length
  }));
  await page.click("#learnClose");
  await page.waitForTimeout(300);
  // the whole page, in every language: no link out of the app for the DIY photos
  const photoPages = await page.evaluate(() => {
    const bad = [...document.images].filter(i => /^https?:/.test(i.src)).length;
    return { images: document.images.length, remote: bad };
  });
  R.heads = { views: heads.rows, allLedes: heads.allLedes, sheetMarks: heads.sheetHeads,
              learn: learnTitle, photos: photoPages };

  /* ---------- 13k. subjects: every word · skills/certificates: first word ---------- */
  await page.evaluate(() => show("vault"));
  await page.waitForTimeout(300);
  const tidyUnits = await page.evaluate(() => [
    tidyText("maths lit, physical science", "every"),
    tidyText("cutting hair, doing nails, first aid", "first"),
    tidyText("NQF level 3, IT, TVET college", "first"),      // acronyms must survive
    tidyText("n4 business management, life-orientation", "every"),
    tidyText("  maths ,science  ", "every")
  ]);
  await page.fill("#f_subjects", "maths lit, business studies ,  english");
  await page.fill("#f_skills", "gas stove cooking, cash handling, first aid");
  await page.click("#f_year");                               // leaving the field tidies it
  await page.waitForTimeout(500);
  const tidyFields = await page.evaluate(() => ({
    subjects: document.querySelector("#f_subjects").value,
    skills: document.querySelector("#f_skills").value,
    stored: (() => { try { return JSON.parse(localStorage.getItem("pusha_vault") || "{}"); } catch(e){ return {}; } })()
  }));
  await page.fill("#f_subjects", "maths,");
  await page.waitForTimeout(650);
  R.subjectCommaSurvivesAutosave = await page.inputValue("#f_subjects") === "maths,";
  await page.fill("#f_subjects", "maths, physical science");
  await page.click("#f_year");
  await page.waitForTimeout(300);
  R.subjectsNormalizeOnBlur = await page.inputValue("#f_subjects") === "Maths, Physical Science";
  // the CV and the copy blocks read the vault, not the field
  const tidyExport = await page.evaluate(() => { syncVaultFields(); return { subjects: vault.subjects, skills: vault.skills }; });
  // leave the vault as we found it
  await page.fill("#f_subjects", ""); await page.fill("#f_skills", "");
  await page.click("#f_year"); await page.waitForTimeout(400);
  /* ---------- 13l. the iPhone home-screen hint (data durability, not a nag) ---------- */
  const IPHONE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
  const ANDROID_UA = "Mozilla/5.0 (Linux; Android 12; SM-A037F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36";
  const hintRun = async (ua, opts) => {
    const c = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: ua });
    if (opts && opts.standalone) await c.addInitScript(() => { try { Object.defineProperty(window.navigator, "standalone", { get: () => true }); } catch (e) {} });
    const pg = await c.newPage();
    const errs = [];
    pg.on("pageerror", e => errs.push(e.message));
    await pg.goto(url);
    await pg.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
    if (opts && opts.withData){
      await pg.evaluate(() => {
        const v = { fullname: "Thabo Mokoena", phone: "0722279505", school: "Sizwe Secondary", year: "2025" };
        localStorage.setItem("pusha_vault", JSON.stringify(v));
      });
      await pg.reload();
    }
    await pg.waitForTimeout(2200);                 // the hint arms itself after load
    const state = await pg.evaluate(() => ({
      sheet: document.querySelector("#sheet").classList.contains("on"),
      title: ((document.querySelector("#sheetBody h2") || {}).textContent || "").trim(),
      buttons: [...document.querySelectorAll("#sheetBody .btn")].map(b => b.textContent.trim()),
      len: (document.querySelector("#sheetBody") || {}).textContent ? document.querySelector("#sheetBody").textContent.trim().length : 0,
      fired: localStorage.getItem("pusha_tip_ios")
    }));
    let afterGotIt = null;
    if (state.sheet && (await pg.$("#iosOk"))){
      await pg.click("#iosOk");
      await pg.waitForTimeout(300);
      await pg.reload();
      await pg.waitForTimeout(2200);
      afterGotIt = await pg.evaluate(() => ({
        sheet: document.querySelector("#sheet").classList.contains("on"),
        fired: localStorage.getItem("pusha_tip_ios")
      }));
    }
    await c.close();
    return { state, afterGotIt, errs };
  };
  const iosPlain = await hintRun(IPHONE_UA, {});                       // nothing saved yet
  const iosData  = await hintRun(IPHONE_UA, { withData: true });       // something to lose
  const iosHome  = await hintRun(IPHONE_UA, { withData: true, standalone: true });
  const android  = await hintRun(ANDROID_UA, { withData: true });
  R.ios = {
    nothingSaved_showsNothing: !iosPlain.state.sheet,
    filled_showsHint: iosData.state.sheet,
    title: iosData.state.title,
    buttons: iosData.state.buttons,
    short: iosData.state.len > 0 && iosData.state.len < 300,          // the person hates long text
    goneAfterGotIt: !!(iosData.afterGotIt && !iosData.afterGotIt.sheet && /1/.test(iosData.afterGotIt.fired || "")),
    silentOnHomeScreen: !iosHome.state.sheet,
    silentOnAndroid: !android.state.sheet,
    errs: iosPlain.errs.concat(iosData.errs, iosHome.errs, android.errs)
  };

  R.tidy = {
    units: tidyUnits,
    fieldSubjects: tidyFields.subjects,
    fieldSkills: tidyFields.skills,
    storedSubjects: tidyFields.stored.subjects,
    storedSkills: tidyFields.stored.skills,
    exportMatches: tidyExport.subjects === tidyFields.subjects && tidyExport.skills === tidyFields.skills
  };

  /* ---------- 13m. encrypted local files + resume ---------- */
  await page.evaluate(async () => {
    localStorage.clear();
    await new Promise((resolve, reject) => {
      const request = indexedDB.open("pusha-files", 1);
      request.onupgradeneeded = () => request.result.createObjectStore("files", { keyPath:"id", autoIncrement:true });
      request.onsuccess = () => {
        const tx = request.result.transaction("files", "readwrite");
        tx.objectStore("files").clear();
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      };
      request.onerror = () => reject(request.error);
    });
  });
  await page.reload();
  await page.waitForTimeout(300);
  R.filesRequirePin = await page.evaluate(() => document.querySelector("#filesIn").disabled);
  await page.evaluate(() => lockSheet("set"));
  await page.fill("#pin", "86423957");
  await page.fill("#pin2", "86423957");
  await page.waitForFunction(() => !document.querySelector("#pinGo").disabled);
  await page.evaluate(() => document.querySelector("#pinGo").click());
  await page.waitForFunction(() => !!Store.get("pusha_vault", {}).__enc);
  await page.setInputFiles("#filesIn", {
    name:"certificate.txt",
    mimeType:"text/plain",
    buffer:Buffer.from("private certificate contents")
  });
  await page.waitForFunction(() => document.querySelectorAll("#filesList .local-file").length === 1);
  R.filesEncrypted = await page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const req = indexedDB.open("pusha-files", 1);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const records = await new Promise((resolve, reject) => {
      const req = db.transaction("files").objectStore("files").getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const raw = new TextDecoder().decode(records[0].ciphertext);
    const metadata = new TextDecoder().decode(records[0].metadata);
    return records.length === 1 && !raw.includes("private certificate contents") &&
      !metadata.includes("certificate.txt") && !("name" in records[0]);
  });
  R.filesBackupRoundTrip = await page.evaluate(async () => {
    const backup = await backupObj();
    const clean = backupClean(JSON.stringify(backup));
    if (!clean || clean.files.length !== 1) return false;
    await LocalDocuments.replaceBackupRecords(clean.files);
    return (await LocalDocuments.backupRecords()).length === 1;
  });
  await page.evaluate(() => { show("vault"); lockSheet("set"); document.querySelector("#rmPin").click(); });
  await page.waitForTimeout(100);
  R.filesPreventPinRemoval = await page.evaluate(() =>
    !!Store.get("pusha_vault", {}).__enc && $("#toast").textContent === t("files_keep_pin")
  );
  await page.evaluate(() => show("ideas"));
  await page.reload();
  await page.waitForTimeout(300);
  R.filesLockedOnRestart = await page.evaluate(() =>
    locked && document.querySelector(".view.on").id === "v-vault" &&
    document.querySelector("#filesList").children.length === 0
  );
  await page.evaluate(() => lockSheet("unlock"));
  await page.fill("#pin", "86423957");
  await page.evaluate(() => document.querySelector("#pinGo").click());
  await page.waitForFunction(() => !locked && document.querySelector(".view.on").id === "v-ideas" &&
    document.querySelectorAll("#filesList .local-file").length === 1);
  R.resumesSectionAndFiles = await page.evaluate(() =>
    document.querySelector(".view.on").id === "v-ideas" &&
    document.querySelectorAll("#filesList .local-file").length === 1
  );
  await page.evaluate(() => show("vault"));
  const [fileDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#filesList button").first().click()
  ]);
  const downloadedPath = await fileDownload.path();
  R.fileDownloadRestoresOriginal = (await fs.promises.readFile(downloadedPath, "utf8")) === "private certificate contents";

  /* ---------- 14. no page errors ---------- */
  R.errors = errors;
  R.tag = tag;
  console.log(JSON.stringify(R, null, 1));
  await browser.close();
})();
