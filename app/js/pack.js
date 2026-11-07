/* Pusha — js/pack.js — copy-paste blocks, the copy engine, detail sheet, CV extras */
/* ---------- 5. PACK ---------- */
/* Four hand-written versions of every block. Version 1 is the plain, formal one;
   the others change the order and the voice, never the facts. Nothing here invents
   a skill, a number or a reference: the vault supplies it, or a [bracket] tells the
   person what to fill in. If one version does not fit the person, they pick another. */
function blocks(){
  const v = vault;
  const name = v.fullname || "";
  const nm = name || "[your full name]";
  const first = (name || "your name").split(" ")[0];
  const firstSkill = (v.skills || "").split(",")[0].trim().toLowerCase();
  const age = v.dob ? (new Date().getFullYear() - Number(v.dob.slice(0,4))) : "";
  const skills = (v.skills || "").trim();
  const school = v.school || "[school]";
  const year = v.year || "[year]";
  const phone = v.phone || "[phone]";
  const email = v.email || "[email]";
  const addr = v.address || "[address]";
  const subj = (v.subjects || "").trim();
  const kin = v.kin || "[reference: name, phone, relationship]";
  const exam = v.examno ? " (exam no. " + v.examno + ")" : "";
  const today = new Date().toLocaleDateString("en-ZA");
  return {
    intro: [
`Good day,

My name is ${nm}, I am ${age || "[age]"} years old and I completed my matric at ${school} in ${year}.

I am looking for an opportunity to work and learn. I am reliable, I arrive on time, and I am willing to start at the bottom. I have practical skills${firstSkill ? " (" + firstSkill + ")" : ""} and I learn fast.

You can reach me on ${phone} or ${email}.

Thank you for your time.
${name}`,

`Good day, my name is ${nm}. I completed my matric at ${school} in ${year}.

I am looking for work or a learnership and I can start immediately.${skills ? " What I can already do: " + skills + "." : ""}

Please call or WhatsApp me on ${phone}${v.email ? " or email " + email : ""}. Thank you.`,

`${nm} — ${phone}${v.email ? "  ·  " + email : ""}

What I can already do, from my first day: ${skills || "[list 3 real skills — 'gas stove cooking', 'cash handling', 'driving Code 8']"}.

I finished matric at ${school} in ${year}${subj ? ", and my best subjects were " + subj : ""}. I am looking for a first job, a learnership or piece work where I can be useful on day one. I answer my phone, I arrive on time, and I stay until the work is finished.`,

`I am ${nm}${age ? ", " + age + " years old," : ""} and I finished matric at ${school} in ${year}. I am looking for work or a learnership, I learn fast and I can start immediately — call or WhatsApp me on ${phone}.`
    ],

    cv: [
`${name || "Name"}  |  ${phone}  |  ${email}  |  ${addr}

PROFILE
Matric pass (${year}), ${school}. ${subj ? "Strongest subjects: " + subj + "." : ""}${skills ? " Skills: " + skills + "." : ""} Looking for a first job, learnership or internship where hard work is noticed.

EDUCATION
${school} — National Senior Certificate, ${year}${exam}

SKILLS
${skills || "[list 4 skills — be specific: 'gas stove cooking', 'cash handling', 'WhatsApp catalogue', 'driving Code 8']"}

REFERENCES
${kin}`,

`${name || "Name"}  |  ${phone}  |  ${email}  |  ${addr}

SKILLS
${skills || "[list 4 skills — be specific: 'gas stove cooking', 'cash handling', 'WhatsApp catalogue', 'driving Code 8']"}

EDUCATION
${school} — National Senior Certificate, ${year}${exam}

PROFILE
Matric pass (${year}). I work with ${firstSkill || "[your main skill]"} and I am looking for a first job where the work is practical and the training is real. I learn by doing, I ask when I am unsure, and I finish what I start.

REFERENCES
${kin}`,

`${name || "Name"}  |  ${phone}  |  ${email}  |  ${addr}

RESULTS
${school} — National Senior Certificate, ${year}${exam}.${subj ? " Best subjects: " + subj + "." : ""}

WHAT I WANT TO STUDY
[One line: the qualification you want — e.g. NC(V) Electrical Engineering — and the job you want after it.]

WHAT I BRING TO THE CLASS
${skills || "[2 or 3 things you can already do with your hands or on a phone]"}. I am looking for a place where I can study further and work at the same time.

REFERENCES
${kin}`,

`${name || "Name"}  |  ${phone}  |  ${email}  |  ${addr}

I completed my matric at ${school} in ${year}. I do not have work experience yet. What I do have is ${skills || "[your skills]"} and a way to get to work every day, including weekends.

I am looking for a first job — shop floor, kitchen, yard, deliveries, cleaning, or a learnership. I am available to start immediately and I will do the training.

REFERENCES
${kin}`
    ],

    pitch: [
`My business: ${"(name it — e.g. Thabo's Kotas)"}
What I sell: ${"(one line — what, for who, where)"}
Where I sell: ${"(taxi rank, school gate, WhatsApp, spaza shops)"}
Why people buy from me: ${"(price, speed, consistency, delivery — pick one and own it)"}
What I need to start: ${"(tools and stock, with rands)"}
Start-up money needed: R${"(total)"}
What I'll do with it: ${"(equipment + first stock — be exact)"}
What I expect to make: ${"(sales per day × profit per sale × days = monthly profit)"}
My first 5 customers: ${"(name them — if you can't, you don't have a business yet)"}`,

`My name is ${first} and I run ${"[business name]"}. I sell ${"[what]"} to ${"[who]"} at ${"[where]"}.

People buy from me because ${"[price, speed, consistency — pick one and own it]"}. On a normal day I sell about ${"[x]"} and I make ${"[R]"} profit on each one.

I want to grow that to ${"[x]"} a day. To do it I need R${"[amount]"} for ${"[the equipment]"}. So far ${"[two names]"} have already said they will buy from me.`,

`The problem: ${"[what is missing, slow or too expensive where you sell]"}.

What I do about it: ${"[your offer in one line]"} at ${"[price]"}.

Who buys: ${"[the exact person, and where they are at 7am]"}.

Proof it works: ${"[customers by name, or orders you already have]"}.

Why me: ${"[the one thing you do better than the next person]"}.

What I need: R${"[amount]"} for ${"[items with prices]"}. That buys me ${"[sales per day]"} a day at ${"[R]"} profit, which is about R${"[month]"} a month.`,

`${first} sells ${"[what]"} at ${"[price]"} each. Cost is ${"[cost]"}, so profit is ${"[R]"} per sale. At ${"[x]"} sales a day, ${"[n]"} days a week, that is about R${"[month]"} a month before other costs. Start-up cost is R${"[total]"}, mostly ${"[the biggest item]"}, and the first customers are ${"[names]"} at ${"[where]"}.`
    ],

    fund: [
`MOTIVATION FOR START-UP SUPPORT

Applicant: ${nm}   ID: ${v.id || "[ID number]"}   Phone: ${phone}
Address: ${addr}
Business: ${"[business name]"} — ${"[what it does in one line]"}
Sector: ${"[food / clothing / services / agriculture / other]"}

1. The opportunity
${"[What is happening in your area that makes this work now? Who is buying and why isn't anyone serving them properly?]"}

2. What I am asking for
R${"[amount]"} for ${"[equipment + stock, itemised with prices]"}. I am contributing R${"[your own money or tools]"} myself.

3. What it will do
${"[Expected sales per week, profit per unit, jobs created — your own words, real numbers.]"}

4. My plan for the money
${"[Item — R — why it is needed]"}

5. Why me
I completed matric in ${year} and I have been ${"[working / running a small stand / helping at home]"} since then. I keep a daily cashbook and I can show it.

Signature: ${name}    Date: ${today}`,

`MOTIVATION — SHORT VERSION (for an online form with a word limit)

I live at ${addr} and I finished matric at ${school} in ${year}. I want to start ${"[business name]"} — ${"[one line about what it does]"}.

The opportunity: ${"[what is happening in your area, and who is not being served]"}. I have already ${"[what you have done so far — sold to X people, saved R Y, built Z]"}. What is missing is ${"[the one thing money buys]"}, which is why I am asking for R${"[amount]"}. ${"[x]"} people have told me they will buy.

With the money I will buy ${"[items]"}. I expect ${"[x]"} sales a week at ${"[R]"} profit each — about R${"[month]"} a month. I keep a daily cashbook and I can show it to anyone who asks.

${name} · ${phone} · ${today}`,

`BUDGET FIRST — MOTIVATION FOR START-UP SUPPORT

${nm} · ID ${v.id || "[ID number]"} · ${phone} · ${addr}

WHAT THE MONEY BUYS
[Item] — R[cost] — [why this item and not another]
[Item] — R[cost] — [why]
[Item] — R[cost] — [why]
Total: R[amount]. My own contribution: R[your money, tools or stock].

WHAT IT DOES AFTER THAT
[Sales per week] × [profit per sale] = R[weekly profit]. It pays itself back in [weeks].

WHO HAS ALREADY SAID YES
[Name, where they are, what they will buy, how much.]

WHAT I HAVE DONE WITHOUT MONEY
[The work already done: customers served, places asked, the cashbook kept, what you have saved.]

Signature: ${name}    Date: ${today}`,

`WHY ME — AND WHAT I HAVE ALREADY PROVED

${nm} · ${phone} · ${addr}

1. What I have already done
   [The sales you have made, customers by name, the cashbook you keep, the stock you already own.]

2. What I am asking for
   R${"[amount]"} — ${"[the 3 or 4 items it buys, with prices]"}. I am putting in R${"[your own money or tools]"} myself.

3. What changes with it
   [From x a day to y a day, hours saved, the customers who can finally be served.]

4. What I do if it does not work
   [The honest fallback: a smaller version, a different product, or the plan you already have.]

5. Why the money is safe with me
   I write down every cent in a cashbook, I save what I can, and I will show both to anyone who asks.

Signature: ${name}    Date: ${today}`
    ]
  };
}

/* ---- copy engine: clipboad API, then a real fallback that actually copies ---- */
function selectText(el){ try { const r = document.createRange(); r.selectNodeContents(el);
  const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); } catch(e){} }

async function copyText(text, btn){
  let ok = false;
  try { await navigator.clipboard.writeText(text); ok = true; } catch(e){ ok = false; }
  if (!ok){
    try {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly","");
      ta.style.cssText = "position:fixed;top:-2000px;left:0;opacity:0";
      document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, ta.value.length);
      ok = document.execCommand("copy");
      document.body.removeChild(ta);
    } catch(e){ ok = false; }
  }
  if (btn){
    const label = btn.dataset.label || btn.innerHTML;
    btn.dataset.label = label;
    btn.innerHTML = ico(ok ? "check" : "alert", "sm") + " " + (ok ? t("btn_copied") : t("btn_selected"));
    btn.classList.toggle("ok", ok);
    setTimeout(() => { btn.innerHTML = label; btn.classList.remove("ok"); }, 1500);
  }
  toast(ok ? t("toast_copied") : t("toast_blocked"));
  return ok;
}

/* share first (WhatsApp, the phone's own sheet), fall back to the copy button */
async function shareText(text, title){
  if (navigator.share){
    try { await navigator.share({ title: title || "Pusha", text }); return "shared"; }
    catch(e){ if (e && e.name === "AbortError") return "cancelled"; }
  }
  const ok = await copyText(text);
  return ok ? "copied" : "failed";
}

const BLOCKS = [
  { key:"intro", icon:"copy",  name:"b_intro", desc:"b_intro_d", tile:"people" },
  { key:"cv",    icon:"doc",   name:"b_cv",    desc:"b_cv_d",    tile:"tech" },
  { key:"pitch", icon:"flag",  name:"b_pitch", desc:"b_pitch_d", tile:"trade" },
  { key:"fund",  icon:"coins", name:"b_fund",  desc:"b_fund_d",  tile:"clean" }
];
let activeBlock = "intro";

/* which of the four versions the person picked for each block — remembered */
function variantOf(key){
  const m = Store.get("pusha_blockvar", {}) || {};
  const i = Number(m[key]);
  return (i >= 0 && i < 4) ? i : 0;
}
function setVariant(key, i){
  const m = Store.get("pusha_blockvar", {}) || {};
  m[key] = i;
  Store.set("pusha_blockvar", m);
}
function renderVarRow(key, n, vi){
  const host = $("#varRow");
  if (!host) return;
  host.innerHTML = '<span class="tiny muted varrow-lab">' + t("p_version") + '</span>' +
    Array.from({ length:n }, (_, k) =>
      '<button class="chip sm' + (k === vi ? " on" : "") + '" data-var="' + k + '"' +
      ' aria-pressed="' + (k === vi) + '" aria-label="' + t("p_version") + ' ' + (k + 1) + '">' + (k + 1) + '</button>').join("") +
    '<span class="tiny muted varrow-help">' + t("p_var_help") + '</span>';
  $$("#varRow [data-var]").forEach(b => b.addEventListener("click", () => {
    setVariant(key, Number(b.dataset.var));
    showBlock(key);
  }));
}

function showBlock(key, scroll, quiet){
  if (!quiet) saveVault(true);                       // always copy from the freshest fields
  activeBlock = key;
  const list = blocks()[key] || [""];
  const vi = Math.min(variantOf(key), list.length - 1);
  const text = list[vi];
  $("#copyPreview").textContent = text;
  const meta = BLOCKS.find(b => b.key === key) || BLOCKS[0];
  $("#previewLabel").textContent = t(meta.name) + " · " + t("b_edit");
  renderVarRow(key, list.length, vi);
  $$("#blockList .blockrow").forEach(r => r.classList.toggle("on", r.dataset.block === key));
  if (scroll) $("#copyPreview").scrollIntoView({ behavior:"smooth", block:"nearest" });
  return text;
}

function renderBlocks(){
  $("#blockList").innerHTML = BLOCKS.map(b => `
    <div class="blockrow" data-block="${b.key}">
      <div class="tile ${b.tile}">${ico(b.icon)}</div>
      <div class="bk"><b>${t(b.name)}</b><span>${t(b.desc)}</span></div>
      <button class="btn sm ghost" data-copy="${b.key}">${ico("copy","sm")} ${t("btn_copy")}</button>
    </div>`).join("");
  $$("#blockList .blockrow").forEach(row => {
    row.addEventListener("click", e => {
      const key = row.dataset.block;
      if (e.target.closest("[data-copy]")) return;   // the Copy button handles itself
      showBlock(key);
    });
  });
  $$("#blockList [data-copy]").forEach(btn => btn.addEventListener("click", async e => {
    e.stopPropagation();
    const text = showBlock(btn.dataset.copy);
    await copyText(text, btn);
  }));
  showBlock(activeBlock);
}
renderBlocks();

$("#copyPreviewBtn").addEventListener("click", async (e) => {
  const text = $("#copyPreview").textContent;
  await copyText(text, e.currentTarget);
});


/* ============================================================
   LANGUAGE — English, isiZulu, Sesotho (hand-written, not machine)
   ============================================================ */

function applyLang(){
  document.documentElement.setAttribute("lang", LANG === "en" ? "en-ZA" : LANG);
  $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $$("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  const lb = $("#langBtn"); if (lb) lb.textContent = LANG.toUpperCase();
  const vt = $("#verText"); if (vt) vt.textContent = PUSHA_VERSION;   // never a hard-coded number
  document.documentElement.toggleAttribute("data-lang-not-en", LANG !== "en");
  [renderBlocks, () => { try { showBlock(activeBlock, false, true); } catch(e){} },
   renderMyIdeas, renderIdeas, renderCVThumb, renderCVBanner, renderMoney, renderPlan,
   () => { if (typeof renderLocalDocuments === "function") renderLocalDocuments(); },
   () => { try { renderIdInfo(); renderDocs(); } catch(e){} }]
    .forEach(fn => { try { fn(); } catch(e){} });
}

function langSheet(){
  $("#sheetBody").innerHTML = `
    <h2 style="margin:0 0 4px">${t("lang_title")}</h2>
    <p class="small muted" style="margin:0 0 6px">${t("lang_note")}</p>
    <p class="tiny muted" style="margin:0 0 14px;padding:8px 10px;background:var(--brand-soft);border-radius:9px">${t("what_translated")}</p>
    ${LANGS.map(l => `
      <button class="btn ${l[0]===LANG?"":"ghost"}" data-lang="${l[0]}" data-name="${l[1]}" style="margin-bottom:8px;justify-content:space-between">
        <span>${l[1]}</span><span style="opacity:.7;font-size:11.5px;letter-spacing:.08em">${l[2]}</span>
      </button>`).join("")}
    <p class="tiny muted" style="margin-top:6px">isiZulu, Sesotho and isiNdebele were written by hand, not translated by a machine. If a word is wrong where you live, use the English version and tell us — we fix it.</p>
    <button class="btn ghost" id="langClose" style="margin-top:10px">${t("btn_close")}</button>`;
  $$("#sheetBody [data-lang]").forEach(b => b.addEventListener("click", () => {
    LANG = b.dataset.lang; Store.set("pusha_lang", LANG); applyLang(); closeSheet(); toast(I18N[LANG].lang_title + ": " + b.dataset.name);
  }));
  $("#langClose").addEventListener("click", closeSheet);
  openSheet();
}
$("#langBtn").addEventListener("click", langSheet);

/* ============================================================
   CV COMPLETENESS — reminders only where they actually help
   ============================================================ */
