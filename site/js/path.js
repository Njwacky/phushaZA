/* Pusha — js/path.js — 7-day plan, free opportunities, scams, PIN lock, boot */
/* ---------- 8. PATH ---------- */
const planState = Store.get("pusha_plan", {});
function renderPlan(){
  $("#plan7").innerHTML = PLAN7.map((p, i) => `
    <label class="check ${planState[i] ? "done" : ""}">
      <input type="checkbox" ${planState[i] ? "checked" : ""} data-i="${i}">
      <span class="t">${p[0]} — ${p[1]}<span class="d">${p[2]}</span></span>
    </label>`).join("") +
    `<div class="small muted" style="text-align:center;margin:4px 0 14px">${Object.values(planState).filter(Boolean).length} of 7 done</div>`;
  $("#plan7").querySelectorAll("input").forEach(inp => inp.addEventListener("change", e => {
    planState[e.target.dataset.i] = e.target.checked; Store.set("pusha_plan", planState); renderPlan();
  }));
}
renderPlan();
$("#opps").innerHTML = OPPS.map(o => `<li><span class="k"><b>${o[0]}</b><br><span class="small muted">${o[1]}</span></span></li>`).join("");
$("#scams").innerHTML = SCAMS.map(o => `<li><span class="k"><b>${o[0]}</b><br><span class="small muted">${o[1]}</span></span></li>`).join("");

/* ---------- 9. LOCK (PIN, encrypted on this device) ---------- */
const KDF_BASE = 150000;          // what 1.5 shipped with, still used to read old vaults
const KDF_TARGET_MS = 350;        // one guess should cost this much on this device
const KDF_MAX = 900000;
let kdfIter = 0;                  // calibrated once per session
let kdfMs = 0;                    // measured cost of one KDF_BASE guess, in ms

const enc = {
  async key(pin, salt, iter){
    const rounds = iter || KDF_BASE;
    const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey({ name:"PBKDF2", salt, iterations:rounds, hash:"SHA-256" }, base, { name:"AES-GCM", length:256 }, false, ["encrypt","decrypt"]);
  },
  b64: buf => btoa(String.fromCharCode(...new Uint8Array(buf))),
  unb64: s => Uint8Array.from(atob(s), c => c.charCodeAt(0)),
  /* encrypt with a key we already hold — same salt, fresh IV on every save */
  async seal(key, obj){
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name:"AES-GCM", iv }, key, new TextEncoder().encode(JSON.stringify(obj)));
    return { __enc:true, iv: enc.b64(iv), ct: enc.b64(ct) };
  },
  async encryptWith(holder, obj){
    const blob = await enc.seal(holder.key, obj);
    blob.salt = holder.salt;
    blob.iter = holder.iter || KDF_BASE;
    return blob;
  },
  async encrypt(obj, pin, iter){
    const rounds = iter || KDF_BASE;
    const saltBytes = crypto.getRandomValues(new Uint8Array(16));
    const salt = enc.b64(saltBytes);
    const key = await enc.key(pin, saltBytes, rounds);
    const blob = await enc.seal(key, obj);
    blob.salt = salt; blob.iter = rounds;
    return { blob, holder: { key, salt, iter: rounds } };
  },
  async decrypt(blob, pin){
    /* the round count travels inside the file, so treat it as untrusted: a blob
       claiming a billion rounds must not freeze the phone on unlock. */
    const rounds = Math.min(KDF_MAX, Math.max(KDF_BASE, Number(blob.iter) || KDF_BASE));
    const key = await enc.key(pin, enc.unb64(blob.salt), rounds);
    const pt = await crypto.subtle.decrypt({ name:"AES-GCM", iv: enc.unb64(blob.iv) }, key, enc.unb64(blob.ct));
    return { obj: JSON.parse(new TextDecoder().decode(pt)), holder: { key, salt: blob.salt, iter: rounds } };
  }
};

/* Measure what one guess costs HERE, then spend about 350 ms per guess.
   A phone that runs PBKDF2 slowly gets fewer rounds, a fast phone gets more,
   so the wall-clock cost of an offline attack is roughly the same everywhere. */
async function calibrate(){
  if (kdfIter) return kdfIter;
  try {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const t0 = performance.now();
    await enc.key("000000", salt, KDF_BASE);
    kdfMs = Math.max(4, performance.now() - t0);
    kdfIter = Math.min(KDF_MAX, Math.max(KDF_BASE, Math.round(KDF_BASE * (KDF_TARGET_MS / kdfMs))));
  } catch(e){ kdfIter = KDF_BASE; kdfMs = 150; }
  return kdfIter;
}

/* ---- how good is a PIN? the score is the real cost of guessing it ---- */
function pinDigits(raw){ return String(raw || "").replace(/\D/g, "").slice(0, 8); }

/* how many PINs would an attacker actually have to try? */
function pinCombos(pin){
  if (/^(\d)\1+$/.test(pin)) return 10;                                          // 111111
  if ("0123456789".indexOf(pin) > -1 || "9876543210".indexOf(pin) > -1) return 20;  // 123456
  if (/^(\d\d)\1+$/.test(pin)) return 100;                                      // 121212
  if (/^(19|20)\d\d$/.test(pin)) return Math.min(200, Math.pow(10, pin.length));
  return Math.pow(10, pin.length);
}
/* seconds of work for a full offline search, at the calibrated cost of one guess */
function pinSeconds(pin){
  const perGuess = (kdfMs || 150) * ((kdfIter || KDF_BASE) / KDF_BASE) / 1000;
  return pinCombos(pin) * perGuess;
}
function pinTimeText(secs){
  const units = [[31536000,"u_year"],[2592000,"u_month"],[86400,"u_day"],[3600,"u_hour"],[60,"u_min"],[1,"u_sec"]];
  for (const [size, key] of units){
    if (secs >= size){
      const n = Math.max(1, Math.round(secs / size));
      return n + " " + t(n === 1 ? key : key + "s");
    }
  }
  return "< 1 " + t("u_secs");
}
function pinStrength(pin){
  if (!pin) return null;
  const secs = pinSeconds(pin);
  // log10 of the seconds: 100 s → 0, 2.8 h → 14, 28 h → 28, 1 month → 42, 1 year → 56, 30 years → 70
  const score = Math.max(0, Math.min(100, Math.round((Math.log10(secs) - 2) * 14)));
  const label = score < 40 ? t("pin_weak") : score <= 65 ? t("pin_fair") : t("pin_strong");
  return { score, label, secs, time: pinTimeText(secs), tone: score < 40 ? "bad" : score <= 65 ? "warn" : "ok" };
}
function pinMeterHTML(p){
  const r = pinStrength(p); if (!r) return "";
  return `<div class="pinmeter ${r.tone}"><i style="width:${r.score}%"></i></div>` +
    `<div class="tiny muted" style="margin:5px 0 0"><b>${r.label} · ${r.score}/100</b> — ${t("pin_guess").replace("%s", r.time)}` +
    `${r.score < 40 ? " · " + t("pin_why") : ""}</div>`;
}

const MIN_PIN = 6;          // what a NEW pin must be. Old 4-digit vaults still unlock.
let pinFails = 0, pinBlockUntil = 0;
function pinWait(){
  if (Date.now() >= pinBlockUntil) return 0;
  return Math.ceil((pinBlockUntil - Date.now()) / 1000);
}

/* ---- auto-lock: close the vault when the phone is put down ---- */
let autoMin = Store.get("pusha_autolock", 0) || 0;
let hiddenAt = 0;
document.addEventListener("visibilitychange", () => {
  if (document.hidden){ hiddenAt = Date.now(); return; }
  if (!hiddenAt) return;
  const awayMin = (Date.now() - hiddenAt) / 60000;
  hiddenAt = 0;
  const protectedNow = !!vaultPin || !!Store.get("pusha_vault", {}).__enc;
  if (!locked && protectedNow && autoMin > 0 && awayMin >= autoMin) lockNow();
});

function lockNow(){
  vault = {}; vaultPin = null; locked = true;
  VAULT_FIELDS.forEach(k => { const el = $("#f_" + k); if (el) el.value = ""; });
  fillVault(); setLockedUI();
  if (typeof renderCVThumb === "function") renderCVThumb();
  show("vault", false);
  toast(t("toast_locked"));
}

function removePinSheet(){
  $("#sheetBody").innerHTML = `
    <h2 style="margin:0 0 6px">${t("btn_rmpin")}</h2>
    <p class="small muted" style="margin:0 0 14px">${t("lock_rm_confirm")}</p>
    <div class="btns">
      <button class="btn accent" id="rmYes">${t("btn_yes_remove")}</button>
      <button class="btn ghost" id="rmNo">${t("btn_cancel")}</button>
    </div>`;
  $("#rmNo").addEventListener("click", () => lockSheet("set"));
  $("#rmYes").addEventListener("click", () => {
    if (locked) return lockSheet("unlock");
    Store.set("pusha_vault", vault); vaultPin = null; locked = false;
    fillVault(); setLockedUI(); closeSheet(); toast(t("toast_pin_removed"));
    if (typeof bkNoteUpdate === "function") bkNoteUpdate();
  });
  openSheet();
}

/* mode: "set" (change / remove / lock, plus the PIN form when none is set) or "unlock" */
function lockSheet(mode){
  const blob = Store.get("pusha_vault", {});
  const hasPin = !!vaultPin || !!blob.__enc;
  const unlocking = mode === "unlock";
  const form = `
    <div id="pinWrap" style="display:${hasPin && !unlocking ? "none" : "block"}">
      <label class="f"><span>${unlocking ? t("lock_pin_short") : t("lock_pin_label")}</span>
        <input id="pin" type="tel" inputmode="numeric" maxlength="8" autocomplete="off"></label>
      ${unlocking ? "" : `<label class="f"><span>${t("lock_pin_again")}</span>
        <input id="pin2" type="tel" inputmode="numeric" maxlength="8" autocomplete="off"></label>`}
      <div id="pinMeter"></div>
      <button class="btn ${unlocking ? "" : "accent"}" id="pinGo">${unlocking ? t("btn_unlock") : t("btn_savepin")}</button>
    </div>`;
  const options = (!unlocking && hasPin) ? `
    <div class="btns">
      <button class="btn" id="lockNowBtn">${t("btn_locknow")}</button>
      <button class="btn ghost" id="setPin">${t("btn_changepin")}</button>
      <button class="btn ghost" id="rmPin">${t("btn_rmpin")}</button>
    </div>
    <div style="margin:14px 0 2px">
      <div class="tiny muted" style="font-weight:800;letter-spacing:.03em;margin-bottom:7px">${t("al_title")}</div>
      <div class="chips">
        ${[[0, t("al_off")], [1, t("al_1")], [5, t("al_5")], [15, t("al_15")]]
          .map(([m, lab]) => `<button class="chip sm${autoMin === m ? " on" : ""}" data-al="${m}">${lab}</button>`).join("")}
      </div>
    </div>` : "";
  $("#sheetBody").innerHTML = `
    <h2 style="margin:0 0 6px">${unlocking ? t("lock_unlock_title") : hasPin ? t("lock_lock_title") : t("lock_protect_title")}</h2>
    <p class="small muted" style="margin-bottom:14px">${unlocking ? t("lock_unlock_help") : t("lock_set_help")}</p>
    ${options}
    ${form}
    <button class="btn ghost" id="pinCancel" style="margin-top:8px">${t("btn_cancel")}</button>`;

  const setBtn = $("#setPin");
  if (setBtn) setBtn.addEventListener("click", () => {
    const w = $("#pinWrap"), el = $("#pin");
    if (!w) return;
    w.style.display = w.style.display === "none" ? "block" : "none";
    if (w.style.display === "block" && el) el.focus();
  });
  const lockBtn2 = $("#lockNowBtn");
  if (lockBtn2) lockBtn2.addEventListener("click", () => { closeSheet(); lockNow(); });
  const rmBtn = $("#rmPin");
  if (rmBtn) rmBtn.addEventListener("click", async () => {
    try {
      if (typeof LocalDocuments !== "undefined" && await LocalDocuments.hasFiles())
        return toast(t("files_keep_pin"));
      removePinSheet();
    } catch(error) {
      toast(t("files_error"));
    }
  });
  $$('#sheetBody [data-al]').forEach(b => b.addEventListener("click", () => {
    autoMin = +b.dataset.al;
    if (!Store.set("pusha_autolock", autoMin)) storageFail();
    $$('#sheetBody [data-al]').forEach(x => x.classList.toggle("on", +x.dataset.al === autoMin));
  }));
  $("#pinCancel").addEventListener("click", closeSheet);

  const pinOk = v => {
    if (!v) return false;
    if (v.length < MIN_PIN) return false;
    const st = pinStrength(v);
    return !!st && st.score >= 40;
  };
  const syncPinButton = () => {
    const g = $("#pinGo"), el = $("#pin"), el2 = $("#pin2");
    if (!g || !el || unlocking) return;
    g.disabled = !pinOk(el.value) || (!!el2 && el2.value !== el.value);
  };
  const pinEl = $("#pin");
  if (pinEl) pinEl.addEventListener("input", () => {
    pinEl.value = pinDigits(pinEl.value);
    const m = $("#pinMeter"); if (m) m.innerHTML = unlocking ? "" : pinMeterHTML(pinEl.value);
    syncPinButton();
  });
  const pin2El = $("#pin2");
  if (pin2El) pin2El.addEventListener("input", () => { pin2El.value = pinDigits(pin2El.value); syncPinButton(); });
  syncPinButton();

  $("#pinGo").addEventListener("click", async () => {
    const pin = pinDigits(($("#pin") || {}).value || "");
    if (unlocking){
      // old 4-digit vaults must still open, so unlocking accepts 4+
      if (pin.length < 4) return toast(t("toast_pin_short_unlock"));
      const wait = pinWait();
      if (wait) return toast(t("pin_wait").replace("%s", wait));
    } else {
      if (pin.length < MIN_PIN) return toast(t("toast_pin_short"));
      await calibrate();
      const st = pinStrength(pin);
      if (st && st.score < 40) return toast(t("pin_too_weak"));
      /* setting a PIN is the one place a typo cannot be undone: if there is a
         second box, both must match before a single byte is encrypted. */
      const p2 = $("#pin2");
      if (p2 && pinDigits(p2.value) !== pin) return toast(t("toast_pin_mismatch"));
    }
    try {
      if (unlocking){
        const blob0 = Store.get("pusha_vault", {});
        const res = await enc.decrypt(blob0, pin);
        vault = res.obj || {}; vaultPin = res.holder;
        locked = false; pinFails = 0; pinBlockUntil = 0;
        fillVault(); setLockedUI();
        restoreLastView();
        if (typeof renderCVThumb === "function") renderCVThumb();
        try { renderCVBanner(); } catch(e){}
        closeSheet(); toast(t("toast_unlocked"));
        /* quietly upgrade an old, weaker key while we still have the PIN in hand */
        const target = await calibrate();
        if ((res.holder.iter || KDF_BASE) < target){
          try {
            const saltBytes = enc.unb64(blob0.salt);
            const key = await enc.key(pin, saltBytes, target);
            const holder = { key, salt: blob0.salt, iter: target };
            const nb = await enc.encryptWith(holder, vault);
            if (Store.set("pusha_vault", nb)) vaultPin = holder;
          } catch(e){}
        }
      } else {
        await calibrate();
        syncVaultFields();
        const made = await enc.encrypt(vault, pin, kdfIter);
        if (!Store.set("pusha_vault", made.blob)) { storageFail(); return toast(t("toast_nosave")); }
        vaultPin = made.holder;
        locked = false; fillVault(); setLockedUI();
        if (typeof bkNoteUpdate === "function") bkNoteUpdate();
        closeSheet(); toast(t("toast_pin_set"));
      }
    } catch(e){
      if (unlocking){
        pinFails++;
        if (pinFails >= 3) pinBlockUntil = Date.now() + Math.min(5000 * Math.pow(2, pinFails - 3), 60000);
        const wait = pinWait();
        toast(t("toast_pin_bad") + (wait ? " · " + t("pin_wait").replace("%s", wait) : ""));
      } else {
        toast(t("toast_pin_bad"));
      }
    }
  });

  calibrate().then(() => {
    const el = $("#pin");
    if (el && !unlocking && el.value) { const m = $("#pinMeter"); if (m) m.innerHTML = pinMeterHTML(el.value); }
  }).catch(() => {});
  if (!Store.ok) { $("#sheetBody").insertAdjacentHTML("afterbegin", '<div class="banner bad">Storage is blocked in this preview, so the lock cannot be saved here. Download the file and open it in a browser.</div>'); }
  if (!(window.crypto && crypto.subtle)) { $("#sheetBody").insertAdjacentHTML("afterbegin", '<div class="banner bad">This browser does not support encryption (needs https or a local file in Chrome/Firefox).</div>'); }
  openSheet();
}

$("#lockBtn").addEventListener("click", () => {
  if (locked) return lockSheet("unlock");
  lockSheet("set");
});
applyLang();
restoreLastView();
