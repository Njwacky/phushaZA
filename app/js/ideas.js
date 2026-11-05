/* Pusha — js/ideas.js — ideas list, filters, idea detail + calculator, the matcher quiz */
/* ---------- 6. IDEAS ---------- */
let filter = "all";
let query = "";
function matches(i){
  if (!query) return true;
  const q = query.toLowerCase();
  return (i.name + " " + (i.tag || "") + " " + (i.unit || "") + " " + (i.cat || "")).toLowerCase().indexOf(q) > -1;
}
function renderFilters(){
  $("#ideaFilters").innerHTML = CATS.map(c =>
    '<button class="chip sm' + (filter === c[0] ? " on" : "") + '" data-cat="' + c[0] + '">' + c[1] + "</button>").join("");
  $$("#ideaFilters .chip").forEach(b => b.addEventListener("click", () => {
    filter = b.dataset.cat;
    renderFilters(); renderMyIdeas(); renderIdeas(); renderCVThumb(); renderCVBanner();
  }));
}
function renderIdeas(){
  const list = IDEAS.filter(i => (filter === "all" || (filter === "zero" ? (LEARN[i.id] && LEARN[i.id].zero) : i.cat === filter)) && matches(i));
  $("#ideaList").innerHTML = list.map(i => `
    <div class="ideacard" data-id="${esc(i.id)}">
      <div class="row" style="gap:11px;align-items:flex-start">
        <div class="tile ${esc(i.cat)}">${ico(i.ic)}</div>
        <div style="flex:1">
          <div class="name">${esc(i.name)}</div>
          <div class="tag">${esc(i.tag)}</div>
          <div class="meta">
            <span>${i.minCapital === 0 ? "R0 to start" : "from " + R(i.minCapital)}</span>
            <span>${i.margin} margin</span>
            <span>${R(i.price)} / ${esc(i.unit)}</span>
          </div>
          ${LEARN[i.id] && LEARN[i.id].zero ? `<div class="metazero">${ico("sparkle","sm")} ${t("lrn_zero")}</div>` : ""}
        </div>
      </div>
    </div>`).join("");
  if (!list.length) $("#ideaList").innerHTML = '<p class="small muted" style="padding:12px 2px">' + t("se_none") + '</p>';
  $$("#ideaList .ideacard").forEach(c => c.addEventListener("click", () => openIdea(c.dataset.id)));
  applyRank();
}
function applyRank(){
  const rank = Store.get("pusha_rank", null);
  if (!rank) return;
  const order = {};
  rank.forEach((id, i) => order[id] = i);
  const cards = $$("#ideaList .ideacard");
  cards.sort((a, b) => (order[a.dataset.id] ?? 99) - (order[b.dataset.id] ?? 99));
  cards.forEach(c => $("#ideaList").appendChild(c));
}

/* ---------- idea detail + calculator ---------- */
function openIdea(id){
  const i = allIdeas().find(x => x.id === id); if (!i) return;
  const saved = Store.get("pusha_calc_" + id, {});
  const monthly = i.billing === "month";
  const price = saved.price ?? i.price, cost = saved.cost ?? i.cost,
        qty = saved.qty ?? (i.dQty ?? 10), days = saved.days ?? (i.dDays ?? 5);
  $("#sheetBody").innerHTML = `
    <div class="row" style="gap:12px;align-items:flex-start;margin-bottom:6px">
      <div class="tile ${esc(i.cat)}" style="width:48px;height:48px;border-radius:14px">${ico(i.ic,"lg")}</div>
      <div><h2 style="margin:0">${esc(i.name)}</h2><div class="small muted">${esc(i.tag)}</div></div>
    </div>
    <div class="meta" style="margin:10px 0 14px">
      <span>${i.minCapital ? "from " + R(i.minCapital) : "your own budget"}</span>
      <span>${i.custom ? "your idea" : i.margin + " margin"}</span>
      <span>${i.hours === "full" ? "Full time" : "Part time"}</span>
    </div>

    <h3>What it costs to start</h3>
    ${i.custom
      ? (i.minCapital ? `<ul class="list"><li><span class="k">Start-up money you set</span><b>${R(i.minCapital)}</b></li></ul>
           <p class="small muted">Add the real prices as you buy things — the calculator below is what matters.</p>`
         : '<p class="small muted">You did not set a start-up amount. Use the calculator below with what you can afford today.</p>')
      : `<ul class="list">${i.costs.map(c => `<li><span class="k">${c[0]}</span><b>R${c[1]}</b></li>`).join("")}
      <li style="border-top:2px solid var(--line);margin-top:4px"><span class="k"><b>Total</b></span><b>R${i.costs.reduce((s,c)=>s+c[1],0)}</b></li>
    </ul>`}

    <div class="card flat calc">
      <h3>Do the numbers</h3>
      <p class="small muted" style="margin-bottom:10px" data-i18n="i_prices">Change these to your real prices. This is the part most people skip — and it's the only part that matters.</p>
      <div class="grid3">
        <label class="f"><span>Price each</span><input id="calcP" inputmode="decimal" value="${price}"></label>
        <label class="f"><span>Cost each</span><input id="calcC" inputmode="decimal" value="${cost}"></label>
        <label class="f"><span>${monthly ? "Clients" : "Per day"}</span><input id="calcQ" inputmode="numeric" value="${qty}"></label>
      </div>
      <label class="f" style="display:${monthly ? "none" : "block"}"><span>Days you sell per week</span><input id="calcD" inputmode="numeric" value="${days}"></label>
      <div class="grid3" style="margin-top:2px">
        <div class="stat"><span>Profit each</span><b id="calcPU">R0</b></div>
        <div class="stat"><span>Per week</span><b id="calcPW">R0</b></div>
        <div class="stat"><span>Per month</span><b id="calcPM">R0</b></div>
      </div>
      <div class="small" id="calcNote" style="margin-top:10px;color:var(--brand);font-weight:600"></div>
    </div>

    ${i.custom ? "" : learnBlock(i.id)}

    ${i.custom
      ? `<h3 style="margin-top:18px">Your plan</h3>
         <p class="small">${i.notes ? esc(i.notes).replace(/\n/g, "<br>") : "No notes yet — tap Edit and write down what you need to buy and who buys first."}</p>
         <div class="btns" style="margin-top:14px">
           <button class="btn" id="useIdea">Make this my plan</button>
           <button class="btn ghost sm" id="editIdea">${ico("edit","sm")} Edit</button>
           <button class="btn ghost sm" id="shareIdea">${ico("share","sm")} ${t("btn_share")}</button>
           <button class="btn ghost sm" id="ideaClose">Close</button>
         </div>
         <p class="tiny muted">Your own idea — the numbers are yours. Check prices before you spend.</p>`
      : `<h3 style="margin-top:18px">Who buys first</h3>
         <ul class="list">${i.first10.map(f => `<li><span class="k">${esc(f)}</span></li>`).join("")}</ul>

         <h3 style="margin-top:14px">Licences &amp; the boring bit</h3>
         <p class="small">${esc(i.licence)}</p>

         <h3>What goes wrong</h3>
         <ul class="list">${i.risks.map(f => `<li><span class="k">${esc(f)}</span></li>`).join("")}</ul>

         <h3>If it works</h3>
         <p class="small">${esc(i.growth)}</p>

         <div class="btns" style="margin-top:16px">
           <button class="btn" id="useIdea">Make this my plan</button>
           <button class="btn ghost sm" id="shareIdea">${ico("share","sm")} ${t("btn_share")}</button>
           <button class="btn ghost sm" id="ideaClose">Close</button>
         </div>
         <p class="tiny muted">Costs are realistic estimates for 2026 — check prices at your local wholesaler before you spend.</p>`}`;

  const recalc = () => {
    const p = +$("#calcP").value || 0, c = +$("#calcC").value || 0, q = +$("#calcQ").value || 0, d = +$("#calcD").value || 0;
    const pu = p - c;
    const pw = monthly ? pu * q / 4.3 : pu * q * d;
    const pm = monthly ? pu * q : pw * 4.3;
    $("#calcPU").textContent = R(pu);
    $("#calcPW").textContent = R(pw);
    $("#calcPM").textContent = R(pm);
    $("#calcNote").textContent = pu <= 0
      ? "You're selling at a loss or at zero. Raise the price or cut a cost — this is why people work all month and stay broke."
      : monthly
        ? (q > 0 ? "You need " + Math.ceil(3000 / pu) + " paying clients to clear R3,000 a month." : "")
        : q * d > 0 ? "You need " + Math.ceil(3000 / pu / Math.max(1,d)) + " sales a day to clear R3,000 a month." : "";
    Store.set("pusha_calc_" + id, { price:p, cost:c, qty:q, days:d });
  };
  ["calcP","calcC","calcQ","calcD"].forEach(k => $("#" + k).addEventListener("input", recalc));
  recalc();

  const on = (sel, ev, fn) => { const el = $(sel); if (el) el.addEventListener(ev, fn); };
  on("#ideaClose", "click", closeSheet);
  on("#shareIdea", "click", async () => {
    const text = i.name + " — " + i.tag + "\nStart-up: " + (i.minCapital ? "from " + R(i.minCapital) : "your own budget") +
      "\n" + R(i.price) + " per " + i.unit + (i.cost ? ", costs you " + R(i.cost) : "") +
      "\n\nFrom Pusha — the after-matric kit (free, offline, no account).";
    const r = await shareText(text, i.name);
    if (r === "failed") toast(t("toast_blocked"));
  });
  if (i.custom) $("#editIdea").addEventListener("click", () => { closeSheet(); setTimeout(() => ideaForm(i), 160); });
  $("#useIdea").addEventListener("click", () => {
    Store.set("pusha_myplan", id);
    closeSheet();
    toast(t("toast_locked_in") + ": " + i.name + " — 3 customers before you spend a cent");
    show("money");
  });
  openSheet();
}
let sheetReturnFocus = null;
function sheetFocusables(){
  return $$("#sheet button, #sheet a[href], #sheet input, #sheet select, #sheet textarea")
    .filter(el => !el.disabled && el.offsetParent !== null && el.type !== "file");
}
function openSheet(){
  sheetReturnFocus = document.activeElement;
  $("#sheet").classList.add("on");
  document.body.style.overflow = "hidden";
  const first = $("#sheetBody input, #sheetBody button, #sheetBody select, #sheetBody textarea");
  if (first) setTimeout(() => { try { first.focus({ preventScroll:true }); } catch(e){} }, 40);
}
function closeSheet(){
  $("#sheet").classList.remove("on");
  document.body.style.overflow = "";
  const back = sheetReturnFocus; sheetReturnFocus = null;
  if (back && back.focus) { try { back.focus({ preventScroll:true }); } catch(e){} }
}
$("#sheet").addEventListener("click", e => { if (e.target.id === "sheet") closeSheet(); });
document.addEventListener("keydown", e => {
  if (!$("#sheet").classList.contains("on")) return;
  if (e.key === "Escape"){ e.preventDefault(); return closeSheet(); }
  if (e.key !== "Tab") return;
  const f = sheetFocusables();
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && (document.activeElement === first || document.activeElement === document.body)){
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last){
    e.preventDefault(); first.focus();
  }
});

/* ---------- quiz ---------- */
let quizStep = 0, quizAns = [];
$("#openQuiz").addEventListener("click", () => { quizStep = 0; quizAns = []; renderQuiz(); openSheet(); });
function renderQuiz(){
  const host = $("#sheetBody");
  if (quizStep >= QUIZ.length){ return renderQuizResult(); }
  const q = QUIZ[quizStep];
  host.innerHTML = `
    <div class="tiny muted" style="letter-spacing:.08em;text-transform:uppercase;font-weight:800">Question ${quizStep+1} of ${QUIZ.length}</div>
    <h2 style="margin:8px 0 16px">${q.q}</h2>
    ${q.opts.map((o, i) => `<button class="btn ghost" data-o="${i}" style="justify-content:flex-start;margin-bottom:9px">${o[0]}</button>`).join("")}
    <p class="tiny muted">No right answers. This just ranks the ideas.</p>`;
  host.querySelectorAll("[data-o]").forEach(b => b.addEventListener("click", () => {
    const o = q.opts[+b.dataset.o];
    quizAns.push(o); quizStep++; renderQuiz();
  }));
}
function renderQuizResult(){
  const capital = quizAns[0][2] ?? 99999;
  const transport = quizAns[1][2] || "none";
  const space = quizAns[2][2] || "none";
  const time = quizAns[3][2] || "part";
  const like = quizAns[4][1] || null;

  const scored = allIdeas().map(i => {
    let s = 0, why = [];
    if (capital >= i.minCapital) { s += 30; why.push("fits your money"); }
    else if (capital >= i.minCapital * 0.6) { s += 12; why.push("needs a bit more than you have"); }
    else s -= 25;

    const need = i.transport;
    if (need === "none") s += 8;
    else if (need === "taxi" && (transport === "taxi" || transport === "car")) { s += 10; why.push("you can reach customers"); }
    else if (need === "taxi") s -= 5;
    else if (need === "car" && transport === "car") s += 8;

    if (i.space === "none") s += 8;
    else if (i.space === "corner" && (space === "corner" || space === "yard")) s += 8;
    else if (i.space === "yard" && space === "yard") { s += 10; why.push("you have the space"); }
    else s -= 6;

    if (i.hours === time) { s += 12; why.push("fits your time"); } else s -= 4;
    if (like && i.likes.indexOf(like) > -1) { s += 22; why.push("it's what you enjoy"); }
    return { i, s, why };
  }).sort((a, b) => b.s - a.s);

  const top = scored.slice(0, 4);
  Store.set("pusha_rank", top.map(t => t.i.id));

  $("#sheetBody").innerHTML = `
    <h2 style="margin:0 0 4px">Your best 4</h2>
    <p class="small muted" style="margin-bottom:14px" data-i18n="i_matcher2">Ranked against your money, transport, space, time and what you like doing.</p>
    ${top.map((t, n) => `
      <div class="card tight" style="margin-bottom:9px">
        <div class="row" style="gap:10px;align-items:flex-start">
          <div style="font-weight:800;color:var(--brand);font-size:17px;min-width:18px">${n+1}</div>
          <div style="flex:1">
            <div style="font-weight:800;display:flex;gap:7px;align-items:center"><span class="tile ${esc(t.i.cat)}" style="width:26px;height:26px;border-radius:8px">${ico(t.i.ic,"sm")}</span>${esc(t.i.name)}</div>
            <div class="tiny muted" style="margin:3px 0 7px">${t.why.slice(0,3).join(" · ") || "workable"}</div>
            <div class="meta"><span>${t.i.minCapital === 0 ? "R0" : "from " + R(t.i.minCapital)}</span><span>${R(t.i.price)} / ${esc(t.i.unit)}</span></div>
          </div>
        </div>
        <button class="btn sm ghost" data-open="${t.i.id}" style="width:100%;margin-top:9px">See the plan &amp; numbers</button>
      </div>`).join("")}
    <button class="btn ghost" id="retake">Start again</button>`;
  $("#sheetBody").querySelectorAll("[data-open]").forEach(b =>
    b.addEventListener("click", () => { closeSheet(); setTimeout(() => openIdea(b.dataset.open), 150); }));
  $("#retake").addEventListener("click", () => { quizStep = 0; quizAns = []; renderQuiz(); });
}
renderFilters(); renderMyIdeas(); renderIdeas(); renderCVThumb(); renderCVBanner();

/* search box — filters the list as you type, and keeps the chip filter */
(function(){
  const box = $("#ideaSearch");
  if (!box) return;
  box.addEventListener("input", () => {
    query = box.value.trim();
    // while searching, drop the three intro cards so the first match is on screen
    const v = $("#v-ideas"); if (v) v.classList.toggle("searching", !!query);
    renderIdeas(); renderMyIdeas();
  });
})();
