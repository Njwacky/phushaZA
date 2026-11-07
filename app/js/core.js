/* Pusha — js/core.js — helpers, storage, theme, nav, vault fields, SA ID check */
const CATS = [["all","Everything"],["zero","No skill yet"],["food","Food"],["beauty","Beauty"],["clean","Cleaning"],["trade","Buy & sell"],["tech","Phone & print"],["hands","Hands & feet"],["people","Teaching"],["grow","Growing"]];

const DOCS = [
  "Certified copy of my ID (not older than 3 months)",
  "Original matric certificate or statement of results",
  "Proof of address (letter from ward councillor, or a bill in your name)",
  "Bank confirmation letter (get it free at your bank branch)",
  "Tax number or SARS registration (only for business or formal work)",
  "CV — 1 page, typed (use the Pack tab)",
  "Two contactable references with phone numbers",
  "Police clearance (only if the job asks — about R150 at SAPS)",
  "Certified copies of qualifications or certificates",
  "A recent photo of yourself (some learnerships ask)"
];

const PLAN7 = [
  ["Day 1","Fill in your Vault","Get your name, ID number, address, school and bank details saved in one place. That is 90% of every form you will ever fill in."],
  ["Day 2","Build your pack","Copy the CV summary and intro block, tick your documents, and print your detail sheet. Put the copies in one plastic sleeve."],
  ["Day 3","Pick ONE idea","Use the matcher, then read the idea properly. Write down what you will need first and what it costs — that is your shopping list."],
  ["Day 4","Get your first 3 customers before you spend anything","Talk to 10 real people. If nobody will pre-order or pre-pay, the idea is wrong — pick another. This is the most important day."],
  ["Day 5","Price it properly","Use the calculator. Know your cost per unit and your profit per sale. If you cannot say your margin out loud, you are not ready."],
  ["Day 6","Do the boring legal bit","Ask your municipality about a trading permit, register the business on CIPC (R125) or decide not to — write down your plan either way."],
  ["Day 7","Start small and count","Sell to 5 customers. Record every cent in the Money tab. Next week, do 10."]
];

const OPPS = [
  ["NSFAS","Free funding for TVET college or university. Apply every year from September — even if you think you won't qualify, apply. You keep the allowance."],
  ["TVET colleges","N1–N6 engineering, business and hospitality. Cheaper than university, and you can study with a matric pass in any band."],
  ["SETA learnerships","You get paid a stipend while you learn a trade. Search '[your sector] SETA learnership 2026' — sectors: merSETA, Services, W&RSETA, FoodBev."],
  ["NYDA","Free business advice, and the NYDA Grant Programme funds tools and equipment for young businesses (up to R250,000, but start with the small grant)."],
  ["SEFA / SEFA township fund","Small business loans and support. Ask for the nearest branch or the online application."],
  ["YES Programme","A 12-month paid placement with a company for unemployed youth aged 18–34. Free to you, always."],
  ["CIPC","Register a company yourself online for R125. You do not need an accountant to start."],
  ["Harambee / job portals","Free placement programmes for matric-level jobs. Never pay anyone to apply."]
];

const SCAMS = [
  ["“You must pay to get the job”","No real employer charges you for a job, a learnership, or an interview. Not for a uniform, not for 'registration', not for 'training'."],
  ["Fake SASSA / SRD links","Paste the link in your browser — the real site is sassa.gov.za. Never enter your ID on a link someone sent you on WhatsApp."],
  ["“Your account will be closed — send your OTP”","No bank will ever ask for your PIN or a one-time PIN. Not on a call, not on WhatsApp, not by SMS. Hang up."],
  ["Business funding that wants a fee upfront","'Pay R950 to unlock your R50,000 grant' is theft. Real funders (SEFA, NYDA) publish their numbers on official sites."],
  ["Stock or bales from a 'wholesaler' on Facebook","Pay cash on delivery or use a wholesaler with a physical address you have walked into. Never EFT a deposit to a stranger."],
  ["Your ID copy in a WhatsApp group","Send a stamped, purpose-marked copy instead — write 'For [X] only, [date]' across it in a photo editor before you send."]
];

const QUIZ = [
  { q:"How much money can you put in right now?", opts:[["R0","r0",0],["Under R500",500,500],["R500 – R2,000",2000,2000],["R2,000 – R5,000",5000,5000],["R5,000+",99999,99999]] },
  { q:"How do you get around?", opts:[["I walk",null,"none"],["Taxi, mostly","taxi","taxi"],["I have a car or bakkie","car","car"]] },
  { q:"What space do you have?", opts:[["Nothing — I'm on the move",null,"none"],["A corner, kitchen or one room",null,"corner"],["A yard or garage",null,"yard"]] },
  { q:"How much time can you give it?", opts:[["Weekends and evenings only",null,"part"],["Most days, part time",null,"part"],["Full time — this is my job",null,"full"]] },
  { q:"What do you actually enjoy?", opts:[["Cooking and food","food",null],["Talking to people, selling","people",null],["Working with my hands","hands",null],["Phones, printing, online","tech",null],["Cleaning and organising","clean",null],["Growing things","grow",null],["Clothes and fashion","fashion",null]] }
];

/* ================= part 2: ideas, money, path ================= */

/* (the mid-file "use strict" was a no-op here; strictness is left as the browser default) */

/* ---------- 1b. TEXT AND NUMBER SAFETY ----------
   Everything a person types — or that arrives inside a backup file someone sent
   them — is data, never markup. esc() is the only way that text may reach
   innerHTML; safePhoto() is the only way a photo may reach an <img>. */
function esc(v){
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
/* a photo is only ever an inline raster data URL. A remote http(s) URL would
   phone home the moment a CV is printed — on an app that promises "nothing
   leaves your phone" — and an SVG or a javascript: string is worse. Anything
   that is not a raster data URL is dropped instead of rendered. */
function safePhoto(p){
  return (typeof p === "string" && /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(p)) ? p : "";
}
/* One place that reads money, so "R1 200,50" and "1,200.50" both become 1200.5
   and real rubbish becomes NaN (which the caller must refuse, never round to 0). */
function parseMoney(raw){
  let s = String(raw == null ? "" : raw).trim().replace(/[Rr\s\u00a0']/g, "");
  if (!s) return NaN;
  const hasC = s.indexOf(",") > -1, hasD = s.indexOf(".") > -1;
  if (hasC && hasD){
    if (s.lastIndexOf(",") > s.lastIndexOf(".")) s = s.replace(/\./g, "").replace(",", ".");
    else s = s.replace(/,/g, "");
  } else if (hasC){
    const parts = s.split(",");
    s = (parts.length === 2 && parts[1].length !== 3) ? parts[0] + "." + parts[1] : s.replace(/,/g, "");
  }
  s = s.replace(/^-/, "");
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return NaN;
  return parseFloat(s);
}

/* ---------- 1c. KEEP THE APP ON THE PHONE ----------
   A service worker stores the app's own files on the phone, so the folder
   version opens with no data at all — not even a first load. It only runs
   when the folder is served from a web address; a single downloaded file
   (file://) has no worker and needs none, it is already one file. */
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
  addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => { /* no worker here — the app still works */ });
  });
}

/* ---------- 2. NAV ---------- */
const LAST_VIEW_KEY = "pusha_last_view";
const APP_VIEWS = ["vault","pack","ideas","money","path"];
function show(view, remember){
  if (remember !== false && APP_VIEWS.indexOf(view) > -1 && !Store.set(LAST_VIEW_KEY, view)) storageFail();
  if (view === "vault" && typeof bkNoteUpdate === "function") { try { bkNoteUpdate(); } catch(e){} }
  $$(".view").forEach(v => v.classList.toggle("on", v.id === "v-" + view));
  if (view === "pack"){ try { showBlock(activeBlock); renderCVThumb(); } catch(e){} }
  $$("#tabs button").forEach(b => b.classList.toggle("on", b.dataset.view === view));
  /* desktop only: the header shows which section you are in (phones show the brand instead) */
  const pt = $("#pageTitle");
  if (pt){ pt.dataset.i18n = "nav_" + view; if (typeof t === "function") pt.textContent = t("nav_" + view); }
  window.scrollTo({ top:0, behavior:"instant" });
}
function restoreLastView(){
  const saved = Store.get(LAST_VIEW_KEY, "vault");
  show(locked ? "vault" : (APP_VIEWS.indexOf(saved) > -1 ? saved : "vault"), false);
}
$$("#tabs button").forEach(b => b.addEventListener("click", () => show(b.dataset.view)));

/* ---------- theme ---------- */
const THEME_KEY = "pusha_theme";
function paintTheme(){
  const cur = document.documentElement.getAttribute("data-theme") || "light";
  const btn = $("#themeBtn");
  if (btn){ btn.innerHTML = '<svg class="icon lg"><use href="#i-' + (cur === "dark" ? "sun" : "moon") + '"/></svg>';
    btn.setAttribute("aria-label", cur === "dark" ? "Switch to light mode" : "Switch to dark mode"); }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", cur === "dark" ? "#0c1411" : "#0b5c46");
}
function setTheme(t){ document.documentElement.setAttribute("data-theme", t); Store.set(THEME_KEY, t); paintTheme(); }
paintTheme();
$("#themeBtn").addEventListener("click", () => {
  setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

/* ---------- sticky header state ---------- */
window.addEventListener("scroll", () => {
  const h = document.querySelector("header.top");
  if (h) h.classList.toggle("stuck", window.scrollY > 6);
}, { passive: true });

/* ---------- 3. STORAGE NOTE ---------- */
(function(){
  const n = $("#storageNote");
  if (!Store.ok){
    n.innerHTML = '<div class="banner"><b>Preview mode.</b> This preview window blocks storage, so nothing will be remembered after you close it. Download <code>index.html</code> and open it in your phone browser — then it saves and works offline.</div>';
  }
})();

/* ---------- 3c. ASK THE BROWSER NOT TO THROW THE VAULT AWAY ----------
   Browsers may clear a site's storage when the phone runs low on space. Asking for
   "persistent" storage makes that less likely and shows no UI in Chrome/Edge/Android.
   Firefox would show a permission bar for this, so it is skipped there; Safari
   decides by its own heuristic and cannot prompt either way. */
(function(){
  try {
    if (!(navigator.storage && navigator.storage.persist)) return;
    if (/firefox/i.test(navigator.userAgent)) return;
    if (Store.get("pusha_persist_asked", false)) return;
    Store.set("pusha_persist_asked", true);
    navigator.storage.persist().catch(() => {});
  } catch(e) {}
})();

/* ---------- 4. VAULT ---------- */
const VAULT_FIELDS = ["fullname","id","dob","gender","phone","email","address","kin","licence","school","year","examno","subjects","skills","bank","acctype","accno","branch"];
let vault = Store.get("pusha_vault", {});
let locked = false;
let vaultPin = null;                 // {key, salt} held in memory only while the vault is unlocked
if (vault && vault.__enc){ vault = {}; locked = true; }

/* --- South African ID number check (Luhn) --- */
function checkSAID(raw){
  const id = (raw || "").replace(/\D/g, "");
  if (id.length !== 13) return { ok:false, msg: id.length ? "Needs 13 digits — you have " + id.length : "" };
  let sum = 0, alt = false;
  for (let i = id.length - 1; i >= 0; i--){
    let d = parseInt(id[i], 10);
    if (alt){ d *= 2; if (d > 9) d -= 9; }
    sum += d; alt = !alt;
  }
  const checksumOK = sum % 10 === 0;
  const yy = +id.slice(0,2), mm = +id.slice(2,4), dd = +id.slice(4,6);
  const nowYY = new Date().getFullYear() % 100;
  const year = yy <= nowYY ? 2000 + yy : 1900 + yy;
  const validDate = mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31;
  const dob = validDate ? year + "-" + String(mm).padStart(2,"0") + "-" + String(dd).padStart(2,"0") : "";
  const gender = +id.slice(6,10) < 5000 ? "Female" : "Male";
  const citizen = id[10] === "0" ? "SA citizen" : id[10] === "1" ? "Permanent resident" : "";
  return { ok: checksumOK && validDate, checksumOK, validDate, dob, gender, citizen, id };
}


const PUSHA_VERSION = "2.9";

/* ---------- 3b. SAYING IT OUT LOUD WHEN A SAVE FAILS ---------- */
function storageFail(){
  if (document.getElementById("storeFail")) return;
  const el = document.createElement("div");
  el.id = "storeFail";
  el.className = "banner bad storefail";
  el.setAttribute("role", "alert");
  el.innerHTML = ico("alert","sm") + '<div style="flex:1"><b>' + t("store_full") + '</b>' +
    '<div class="tiny" style="margin-top:3px">' + t("store_help") + '</div></div>' +
    '<button class="btn sm ghost" id="storeFailX">OK</button>';
  document.body.appendChild(el);
  const x = el.querySelector("#storeFailX");
  if (x) x.addEventListener("click", () => el.remove());
}
function clearStorageFail(){ const el = document.getElementById("storeFail"); if (el) el.remove(); }

/* WhatsApp, app first: try the phone's own WhatsApp, and if nothing happens in
   a second fall back to the web link. Desktop browsers skip straight to the web.
   Nothing is sent until this is called — it only ever runs from a tap. */
/* ---------- tidying two fields that people type in a hurry ----------
   Subjects get every word capitalised ("maths lit" -> "Maths Lit").
   Skills and certificates get only the first word of each comma item
   ("first aid, cutting hair" -> "First aid, Cutting hair"), which is how a
   list of skills reads in English. Nothing is lowercased, so "NQF", "IT",
   "TVET" and "N4" survive untouched, and the caret is never moved while the
   person is still typing — this only runs on blur and on save.            */
function tidyText(s, mode){
  if (s == null) return s;
  let t = String(s)
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/(?:,\s*)+/g, ", ")
    .replace(/\n{3,}/g, "\n\n");
  const capFirst = w => w.replace(/^(\W*)([a-z])/, (m, pre, c) => pre + c.toUpperCase());
  const capEvery = w => w.replace(/(^|[\s\-\/])([a-z])/g, (m, pre, c) => pre + c.toUpperCase());
  return t.split("\n").map(line =>
    line.split(",").map(item => {
      const x = item.trim();
      if (!x) return "";
      return mode === "every" ? capEvery(x) : capFirst(x);
    }).filter(Boolean).join(", ")
  ).join("\n").trim();
}

function openWhatsApp(text){
  const NUM = "27722279505";
  const tail = text ? "?text=" + encodeURIComponent(text) : "";
  const web = "https://wa.me/" + NUM + tail;
  const app = "whatsapp://send?phone=" + NUM + (text ? "&text=" + encodeURIComponent(text) : "");
  const phone = /Android|iPhone|iPad|iPod|Windows Phone|Mobile/i.test(navigator.userAgent);
  if (!phone){ window.open(web, "_blank", "noopener"); return; }
  let gone = false;
  const seen = () => { gone = true; };
  document.addEventListener("visibilitychange", () => { if (document.hidden) gone = true; }, { once: true });
  window.addEventListener("pagehide", seen, { once: true });
  window.addEventListener("blur", seen, { once: true });
  setTimeout(() => { if (!gone && document.visibilityState === "visible") window.location.href = web; }, 1300);
  window.location.href = app;               // the app takes over if it is installed
}

function toastAction(msg, label, fn){
  const el = $("#toast");
  el.innerHTML = '<span style="flex:1">' + msg + '</span><button class="btn xs ghost" id="toastAct">' + label + '</button>';
  el.classList.add("on", "act");
  const b = el.querySelector("#toastAct");
  if (b) b.addEventListener("click", () => { el.classList.remove("on"); el.textContent = ""; fn(); });
  clearTimeout(el._x);
  el._x = setTimeout(() => { el.classList.remove("on"); el.textContent = ""; }, 6000);
}
