/* Pusha — js/misc.js — your own ideas, About, the error safety net */
/* ---- the user's own ideas ---- */
/* Your own ideas can also arrive inside a backup file from someone else, so
   they are reduced to the shape this app understands before anything is drawn:
   a slug id (no quotes to break out of an attribute), a whitelisted category,
   numbers, and length caps. Anything else is dropped. */
const IDEA_CATS = ["food","beauty","clean","trade","tech","hands","people","grow"];
function cleanIdea(i){
  if (!i || typeof i !== "object") return null;
  const str = (v, n) => String(v == null ? "" : v).slice(0, n);
  const id = str(i.id, 40).replace(/[^A-Za-z0-9_-]/g, "");
  return {
    id: id || ("mine_" + Math.random().toString(36).slice(2, 8)),
    custom: true,
    name: str(i.name, 80),
    tag: str(i.tag, 200),
    cat: IDEA_CATS.indexOf(i.cat) > -1 ? i.cat : "trade",
    ic: /^[a-z]{1,12}$/.test(String(i.ic || "")) ? i.ic : "sparkle",
    unit: str(i.unit, 24) || "item",
    minCapital: Math.max(0, Number(i.minCapital) || 0),
    price: Math.max(0, Number(i.price) || 0),
    cost: Math.max(0, Number(i.cost) || 0),
    notes: str(i.notes, 500),
    hours: "part", likes: []
  };
}
let myIdeas = (Array.isArray(Store.get("pusha_myideas", [])) ? Store.get("pusha_myideas", []) : [])
  .map(cleanIdea).filter(Boolean);
const allIdeas = () => myIdeas.concat(IDEAS);
const saveMyIdeas = () => { if (!Store.set("pusha_myideas", myIdeas)) storageFail(); };

function renderMyIdeas(){
  const rows = myIdeas.map(i => `
    <div class="ideacard" data-id="${esc(i.id)}" style="border-left:3px solid var(--accent)">
      <div class="row" style="gap:11px;align-items:flex-start">
        <div class="tile ${esc(i.cat)}">${ico(i.ic || "sparkle")}</div>
        <div style="flex:1">
          <div class="name">${esc(i.name)}<span class="mine">Mine</span></div>
          <div class="tag">${esc(i.tag || "Your own idea")}</div>
          <div class="meta">
            <span>${i.minCapital ? "from " + R(i.minCapital) : "your budget"}</span>
            <span>${R(i.price)} / ${esc(i.unit)}</span>
            <span>${i.cost ? R(i.price - i.cost) + " per " + esc(i.unit) : "set your cost"}</span>
          </div>
        </div>
      </div>
    </div>`).join("");
  $("#myIdeasWrap").innerHTML = myIdeas.length
    ? '<div class="sechead" style="margin:2px 2px 8px"><span class="tiny muted" style="letter-spacing:.12em;text-transform:uppercase;font-weight:800">Your own ideas</span><span class="tiny muted">' + myIdeas.length + " saved</span></div>" + rows
    : "";
  $$("#myIdeasWrap .ideacard").forEach(c => c.addEventListener("click", () => openIdea(c.dataset.id)));
}

function ideaForm(existing){
  const e = existing || {};
  const cats = [["food","Food"],["beauty","Beauty"],["clean","Cleaning"],["trade","Buy & sell"],["tech","Phone & print"],["hands","Hands & feet"],["people","Teaching"],["grow","Growing"]];
  $("#sheetBody").innerHTML = `
    <h2 style="margin:0 0 4px">${existing ? "Edit your idea" : "Your own idea"}</h2>
    <p class="small muted" style="margin:0 0 14px">Name it, then put in your own numbers. Pusha works out the profit so you can see if it is worth doing before you spend a cent.</p>
    <label class="f"><span>Name of the business *</span><input id="ni_name" placeholder="e.g. Sipho's Shoe Shine" value="${esc(e.name)}"></label>
    <label class="f"><span>What you sell, and to who</span><input id="ni_tag" placeholder="Shoe shine and repairs for taxi commuters" value="${esc(e.tag)}"></label>
    <div class="grid2">
      <label class="f"><span>Category</span><select id="ni_cat">${cats.map(c => '<option value="' + c[0] + '"' + ((e.cat || "trade") === c[0] ? " selected" : "") + '>' + c[1] + "</option>").join("")}</select></label>
      <label class="f"><span>Your unit</span><input id="ni_unit" placeholder="shoe, plate, head" value="${esc(e.unit || "item")}"></label>
    </div>
    <div class="grid2">
      <label class="f"><span>Start-up money (R)</span><input id="ni_cap" inputmode="decimal" placeholder="600" value="${e.minCapital != null ? e.minCapital : ""}"></label>
      <label class="f"><span>Price each (R) *</span><input id="ni_price" inputmode="decimal" placeholder="20" value="${e.price != null ? e.price : ""}"></label>
    </div>
    <label class="f"><span>Cost to you each (R)</span><input id="ni_cost" inputmode="decimal" placeholder="6" value="${e.cost != null ? e.cost : ""}"></label>
    <label class="f"><span>Your plan — what you need, who buys first</span><textarea id="ni_notes" placeholder="Buy polish, brushes and a stool at the rank. First customers: commuters at Benoni taxi rank, 06:00–08:00.">${esc(e.notes || "")}</textarea></label>
    <div class="btns" style="margin-top:4px">
      <button class="btn" id="ni_save">${existing ? "Save changes" : "Add my idea"}</button>
      ${existing ? '<button class="btn ghost sm" id="ni_delete">' + ico("trash","sm") + " Delete</button>" : ""}
    </div>`;
  $("#ni_save").addEventListener("click", () => {
    const name = $("#ni_name").value.trim();
    const price = +$("#ni_price").value;
    if (!name) return toast(t("toast_name_first"));
    if (!price || price <= 0) return toast(t("toast_price_first"));
    const obj = {
      id: existing ? e.id : "mine_" + Date.now(),
      custom: true,
      name,
      tag: $("#ni_tag").value.trim(),
      cat: $("#ni_cat").value,
      unit: $("#ni_unit").value.trim() || "item",
      minCapital: +$("#ni_cap").value || 0,
      price,
      cost: +$("#ni_cost").value || 0,
      notes: $("#ni_notes").value.trim(),
      hours: "part",
      likes: [],
      ic: "sparkle"
    };
    if (existing){ myIdeas = myIdeas.map(x => x.id === e.id ? obj : x); }
    else { myIdeas = [obj].concat(myIdeas); }
    saveMyIdeas(); renderMyIdeas(); renderIdeas(); closeSheet();
    toast(existing ? t("toast_saved") : t("toast_saved"));
    setTimeout(() => openIdea(obj.id), 250);
  });
  if (existing) $("#ni_delete").addEventListener("click", () => {
    const before = myIdeas.slice();
    myIdeas = myIdeas.filter(x => x.id !== e.id); saveMyIdeas(); renderMyIdeas(); renderIdeas(); closeSheet();
    toastAction(t("toast_deleted"), t("btn_undo"), () => {
      myIdeas = before; saveMyIdeas(); renderMyIdeas(); renderIdeas(); toast(t("toast_restored"));
    });
  });
  openSheet();
}
$("#addIdeaBtn").addEventListener("click", () => ideaForm(null));
const learnBtn = $("#openLearn");
if (learnBtn) learnBtn.addEventListener("click", learnSheet);

/* ---- about ---- */
const ctWa = $("#ctWa");
if (ctWa) ctWa.addEventListener("click", (e) => {
  // same rule everywhere: the phone's WhatsApp first, wa.me only if it never opened
  if (!/Android|iPhone|iPad|iPod|Windows Phone|Mobile/i.test(navigator.userAgent)) return;
  e.preventDefault();
  openWhatsApp("");
});

$("#aboutBtn").addEventListener("click", () => {
  $("#sheetBody").innerHTML = `
    <h2 style="margin:0 0 4px">Pusha ${PUSHA_VERSION}</h2>
    <p class="small muted" style="margin:0 0 14px">The after-matric kit — plain HTML, CSS and JS. No account. Optional usage counts are sent only with your permission. It also ships as a single file you can copy to a phone or a flash drive.</p>
    <h3>What is inside</h3>
    <ul class="list">
      <li><span class="k">Vault — your documents and details, encrypted with a PIN if you want</span></li>
      <li><span class="k">Pack — four copy-paste blocks (short intro, CV summary, business pitch, funding motivation) with four hand-written versions of each, a printable CV with your photo, a detail sheet</span></li>
      <li><span class="k">Idea Craft — 31 local businesses with real costs, the 3 skills each one needs, free practice for the week, and where to learn it (with links), plus your own ideas</span></li>
      <li><span class="k">Money — a daily cashbook and a savings goal</span></li>
      <li><span class="k">Path — a 7-day plan, free opportunities, free courses in South Africa and scam warnings</span></li>
    </ul>
    <h3 style="margin-top:16px">Privacy, in plain words</h3>
    <p class="small">Your personal details and files stay on this device. Optional usage counts are sent only if you agree; they contain no names, ID numbers, CV contents or files. Netlify receives network information such as your IP address when counts are sent. You can change your choice in Path → Usage privacy settings. If you clear your browser data, the details go with it — so use <b>Save a backup file</b> in the Vault tab, and print your CV and detail sheet when they matter.</p>
    <p class="small">When the phone refuses to store something — a full browser is the usual reason — Pusha now says so instead of pretending it saved.</p>
    <p class="small"><b>Your words are treated as words.</b> A name, a cashbook note, a CV section or a file someone sends you is never run as code — it is shown exactly as typed, and a "photo" that points at a website is thrown away instead of being fetched. That matters because one of the few doors into this app is a backup file from a friend: Pusha reads only its own keys, refuses a file that is not a Pusha backup, and asks before it replaces anything on your phone — offering to download your current data first.</p>
    <p class="small"><b>For the mistakes people actually make.</b> A PIN has to be typed twice before it is saved, because a mistyped PIN cannot be recovered. Amounts can be typed as <b>R1 200,50</b> or <b>1,200.50</b> and they still work, rubbish is refused with a reason instead of becoming R0, and the same line twice in four seconds is caught. An email with no @ or a phone number with letters gets a quiet warning — it never stops you saving.</p>
    <p class="small"><b>The vault PIN, in plain words.</b> Your details are encrypted with AES-256, and the key comes from your PIN — so a person who copies the file still has to guess the PIN. Two things make that hard: Pusha will not save a PIN shorter than <b>6 digits</b> or one that is a run or a repeat, and it times your phone once and then spends about a third of a second on <b>every</b> guess. Pusha shows you what that means in real time while you type: a 4-digit PIN is about half an hour of guessing, a clean 6-digit PIN about two days, eight digits about six months. There is no reset and no recovery — losing the PIN loses the details.</p>
    <h3 style="margin-top:16px">On a phone, and on a computer</h3>
    <p class="small">On a phone the five sections sit in a bar at the bottom, one thumb away. On a computer — a library PC, a friend's laptop, a work machine — the same five sections move to a column on the left, the cards use the wider screen, and anything that opens opens in the middle instead of sliding up from the bottom edge. It is the same file and the same data; it just reads the screen it is on. No app to install, and it still works with the internet off.</p>
    <h3 style="margin-top:16px">Put it on your home screen</h3>
    <p class="small"><b>If you opened Pusha from a web address</b> — a link someone sent you — you can install it like a real app. On an Android phone in Chrome: tap the three dots at the top, then <b>Add to Home screen</b> or <b>Install app</b>. On an iPhone in Safari: tap the share button, then <b>Add to Home Screen</b>. It then opens full screen with its own icon, and the app's own pages are kept on the phone, so it still opens when your data is finished.</p>
    <p class="small"><b>If someone sent you the single file</b> (<b>pusha-standalone.html</b>), there is nothing to install: keep it, open it with any browser, and it works in aeroplane mode. About 280 KB — smaller than one photo.</p>
    <p class="small">Which one is newer? The installed app picks up a new version the next time you open it online. A downloaded file only changes when you download it again — check the version number on this page if you are not sure.</p>
    <h3 style="margin-top:16px">Languages</h3>
    <p class="small">English, isiZulu, Sesotho and isiNdebele. English is the default. The isiZulu, Sesotho and isiNdebele wording was written by hand by the Pusha team, not translated by a machine. Menus, buttons, field labels and the CV checks change language; some long explanations stay in English for now. If a word is wrong where you live, use English and tell us — it gets fixed in the next version.</p>
    <h3 style="margin-top:16px">Accuracy</h3>
    <p class="small">Costs and prices were checked in <b>November 2026</b> for South Africa. They move — confirm them at your local wholesaler before you spend money. Pusha is not a funder, an employer or a financial adviser.</p>
    <div class="btns" style="margin-top:14px">
      <button class="btn ghost sm" id="aboutFb">${t("fb_title")}</button>
      <button class="btn" id="aboutClose">Close</button>
    </div>`;
  $("#aboutClose").addEventListener("click", closeSheet);
  $("#aboutFb").addEventListener("click", feedbackSheet);
  openSheet();
});

/* ---- safety net: never leave the user with a dead button ---- */
window.addEventListener("error", () => { try { toast(t("toast_error")); } catch(e){} });

const docState = Store.get("pusha_docs", {});
function renderDocs(){
  const host = $("#docList"); host.innerHTML = "";
  DOCS.forEach((d, i) => {
    const lab = document.createElement("label");
    lab.className = "check" + (docState[i] ? " done" : "");
    lab.innerHTML = '<input type="checkbox" ' + (docState[i] ? "checked" : "") + '><span class="t">' + t("d" + (i + 1)) + '</span>';
    lab.querySelector("input").addEventListener("change", e => {
      docState[i] = e.target.checked; Store.set("pusha_docs", docState);
      lab.classList.toggle("done", e.target.checked);
    });
    host.appendChild(lab);
  });
}
renderDocs();

$("#printSheet").addEventListener("click", () => {
  saveVault(true);
  const v = vault;
  const rows = [
    ["Full name", v.fullname], ["ID number", v.id], ["Date of birth", v.dob], ["Gender", v.gender],
    ["Phone", v.phone], ["Email", v.email], ["Home address", v.address],
    ["Next of kin", v.kin], ["Driver's licence", v.licence],
    ["High school", v.school], ["Matric year", v.year], ["Exam number", v.examno],
    ["Best subjects", v.subjects], ["Skills", v.skills]
  ];
  $("#printArea").innerHTML =
    '<div style="font:14px/1.5 Arial,sans-serif;padding:24px;max-width:720px">' +
    (safePhoto(v.photo) ? '<img src="' + safePhoto(v.photo) + '" alt="" style="float:right;width:82px;height:82px;object-fit:cover;border-radius:8px;margin:0 0 8px 12px">' : '') +
    '<h1 style="font-size:22px;margin:0 0 2px">' + esc(v.fullname || "My details") + '</h1>' +
    '<p style="margin:0 0 14px;color:#555">Personal detail sheet · printed ' + new Date().toLocaleDateString("en-ZA") + '</p>' +
    '<table style="width:100%;border-collapse:collapse">' +
    rows.map(r => '<tr><td style="padding:7px 8px;border-bottom:1px solid #ddd;width:38%;color:#555">' + esc(r[0]) +
      '</td><td style="padding:7px 8px;border-bottom:1px solid #ddd;font-weight:600">' + esc(r[1] || "—") + '</td></tr>').join("") +
    '</table>' +
    '<p style="margin-top:16px;font-size:11px;color:#777">Keep this with your certified copies. Do not leave copies with anyone you have not chosen.</p>' +
    '</div>';
  try { window.print(); }
  catch(e){ toast(t("toast_print_blocked")); }
});


/* ---- backup: the only thing that survives a new phone ---- */
const bkKeys = () => {
  const out = [];
  try { for (let i = 0; i < localStorage.length; i++){ const k = localStorage.key(i); if (k && k.indexOf("pusha_") === 0) out.push(k); } } catch(e){}
  return out;
};
async function backupObj(){
  const data = {};
  bkKeys().forEach(k => { data[k] = Store.get(k, null); });
  const files = typeof LocalDocuments !== "undefined" ? await LocalDocuments.backupRecords() : [];
  return { app:"pusha", v:2, at:new Date().toISOString(), data, files };
}
function bkNoteUpdate(){
  const el = $("#bkNote"); if (!el) return;
  const enc = !!(Store.get("pusha_vault", {}) || {}).__enc;
  el.textContent = enc ? t("bk_enc_note") : t("bk_plain_note");
}
async function backupSave(){
  let json;
  try {
    json = JSON.stringify(await backupObj(), null, 1);
  } catch(error) {
    return toast(t("files_error"));
  }
  if (json.length > 40 * 1024 * 1024) return toast(t("bk_too_large"));
  const name = "pusha-backup-" + new Date().toISOString().slice(0, 10) + ".json";
  let ok = false;
  try {
    const blob = new Blob([json], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    ok = true;
  } catch(e){ ok = false; }
  if (ok) toast(t("bk_done"));
  else copyText(json, null);     // no download in this browser: hand them the text instead
}
/* A backup file is data from outside this app — the one place where text someone
   else wrote gets in. So: parse, keep only Pusha keys of plain types, refuse a
   file that is too big, and never replace what is on the phone without saying so
   first and offering to keep a copy. */
function backupClean(raw){
  if (typeof raw !== "string" || raw.length > 40 * 1024 * 1024) return null;
  let obj = null;
  try { obj = JSON.parse(raw); } catch(e){ return null; }
  if (!obj || obj.app !== "pusha" || !obj.data || typeof obj.data !== "object") return null;
  const clean = {};
  let n = 0, bytes = 0;
  Object.keys(obj.data).forEach(k => {
    if (k.indexOf("pusha_") !== 0) return;
    if (k === "__proto__" || k === "constructor" || k === "prototype") return;
    const v = obj.data[k], ty = typeof v;
    if (v !== null && ty !== "string" && ty !== "number" && ty !== "boolean" && ty !== "object") return;
    let size = 0;
    try { size = JSON.stringify(v == null ? null : v).length; } catch(e){ return; }
    bytes += size + k.length;
    if (bytes > 4 * 1024 * 1024) return;
    clean[k] = v; n++;
  });
  /* a backup may predate the removal of the Banking section — leave those keys out of the restore */
  const sv = clean["pusha_vault"];
  if (sv && typeof sv === "object" && !Array.isArray(sv) && !sv.__enc){
    ["bank","acctype","accno","branch"].forEach(k => { delete sv[k]; });
  }
  if (!n) return null;
  const files = typeof LocalDocuments !== "undefined" ? LocalDocuments.cleanBackupRecords(obj.files) : [];
  if (!files) return null;
  return { data: clean, files, at: obj.at ? String(obj.at).slice(0, 10) : "", n: n + files.length, bytes };
}

function backupLoad(file){
  const done = txt => {
    const bk = backupClean(txt);
    if (!bk) return toast(t("bk_bad"));
    backupConfirm(bk);
  };
  if (file.text) file.text().then(done).catch(() => toast(t("bk_bad")));
  else { const fr = new FileReader(); fr.onload = () => done(String(fr.result || "")); fr.onerror = () => toast(t("bk_bad")); fr.readAsText(file); }
}

function backupConfirm(bk){
  $("#sheetBody").innerHTML = `
    <h2 style="margin:0 0 6px">${t("bk_replace_title")}</h2>
    <p class="small muted" style="margin:0 0 14px">${esc(t("bk_replace_body").replace("%s", bk.n).replace("%d", bk.at || "—"))}</p>
    <div class="btns">
      <button class="btn ghost sm" id="bkKeep">${ico("download","sm")} ${t("bk_keep_mine")}</button>
      <button class="btn accent sm" id="bkGo">${t("bk_replace_go")}</button>
    </div>
    <button class="btn ghost" id="bkCancel" style="margin-top:10px">${t("btn_cancel")}</button>`;
  $("#bkCancel").addEventListener("click", closeSheet);
  $("#bkKeep").addEventListener("click", () => { backupSave(); });
  $("#bkGo").addEventListener("click", async () => {
    const oldData = {};
    bkKeys().forEach(k => { oldData[k] = localStorage.getItem(k); });
    let oldFiles = [];
    let rollbackFailed = false;
    try {
      if (typeof LocalDocuments !== "undefined") {
        oldFiles = LocalDocuments.cleanBackupRecords(await LocalDocuments.backupRecords());
        await LocalDocuments.replaceBackupRecords(bk.files);
      }
      bkKeys().forEach(k => localStorage.removeItem(k));
      let bad = 0;
      Object.keys(bk.data).forEach(k => { if (!Store.set(k, bk.data[k])) bad++; });
      if (bad) throw new Error("storage-full");
      closeSheet(); toast(t("bk_loaded"));
      setTimeout(() => location.reload(), 800);
    } catch(error) {
      bkKeys().forEach(k => localStorage.removeItem(k));
      Object.keys(oldData).forEach(k => {
        try { localStorage.setItem(k, oldData[k]); } catch(restoreError) { rollbackFailed = true; }
      });
      if (typeof LocalDocuments !== "undefined" && oldFiles) {
        try { await LocalDocuments.replaceBackupRecords(oldFiles); }
        catch(restoreError) { rollbackFailed = true; }
      }
      storageFail();
      toast(rollbackFailed ? t("bk_restore_failed") : t("files_error"));
    }
  });
  openSheet();
}
(function(){
  const bs = $("#bkSave"); if (bs) bs.addEventListener("click", backupSave);
  const bi = $("#bkIn");
  if (bi) bi.addEventListener("change", e => {
    const f = e.target.files && e.target.files[0];
    if (f) backupLoad(f);
    e.target.value = "";
  });
  bkNoteUpdate();
})();

/* ---- feedback: no server, so the report is copied and sent by the user ---- */
function feedbackSheet(){
  const d = new Date();
  const report = [
    "Pusha " + PUSHA_VERSION + " — report",
    "Language: " + LANG,
    "Screen: " + window.innerWidth + "x" + window.innerHeight,
    "Date: " + d.toISOString().slice(0, 10),
    "",
    "What is wrong (a word, a price, a broken button):",
    "",
    ""
  ].join("\n");
  $("#sheetBody").innerHTML = `
    <h2 style="margin:0 0 4px">${t("fb_title")}</h2>
    <p class="small muted" style="margin:0 0 12px">${t("fb_help")}</p>
    <label class="f"><span>${t("fb_title")}</span><textarea id="fbText" rows="6">${report}</textarea></label>
    <div class="btns">
      <button class="btn" id="fbCopy">${ico("copy","sm")} ${t("fb_btn")}</button>
      <a class="btn ghost" id="fbWa">${ico("chat","sm")} ${t("fb_send_wa")}</a>
      <a class="btn ghost" id="fbMail">${ico("mail","sm")} ${t("fb_send_email")}</a>
      <button class="btn ghost" id="fbClose">${t("btn_cancel")}</button>
    </div>`;
  $("#fbClose").addEventListener("click", closeSheet);
  // the mail app is the only thing that leaves the phone, and only when this is tapped
  $("#fbWa").addEventListener("click", (e) => {
    e.preventDefault();
    openWhatsApp($("#fbText").value);        // app first, wa.me as the fallback
  });
  $("#fbMail").addEventListener("click", (e) => {
    e.preventDefault();                       // the report is read at the moment of the tap
    const body = encodeURIComponent($("#fbText").value);
    window.location.href = "mailto:njwayelodlamini@gmail.com?subject=" +
      encodeURIComponent("Pusha " + PUSHA_VERSION + " report") + "&body=" + body;
  });
  $("#fbCopy").addEventListener("click", async (e) => {
    await copyText($("#fbText").value, e.currentTarget);
    toast(t("fb_copied"));
  });
  openSheet();
}
