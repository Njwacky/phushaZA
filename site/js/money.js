/* Pusha — js/money.js — cashbook, totals, savings goal */
/* ---------- 7. MONEY ---------- */
let cash = Store.get("pusha_cash", []);
function dayKey(d){ return new Date(d).toISOString().slice(0,10); }
function renderMoney(){
  const today = dayKey(new Date());
  const week = [], month = [];
  const now = new Date();
  const wkStart = new Date(now); wkStart.setDate(now.getDate() - 6);
  let tToday = 0, tWeek = 0, tMonth = 0;
  cash.forEach(e => {
    const k = e.d || "";
    const amt = e.type === "in" ? e.amt : -e.amt;
    if (k === today) tToday += amt;
    if (new Date(k) >= new Date(dayKey(wkStart))) tWeek += amt;
    if (k.slice(0,7) === today.slice(0,7)) tMonth += amt;
  });
  $("#mToday").textContent = R(tToday);
  $("#mWeek").textContent = R(tWeek);
  $("#mMonth").textContent = R(tMonth);

  const days = [];
  for (let i = 6; i >= 0; i--){ const d = new Date(now); d.setDate(now.getDate() - i); days.push(dayKey(d)); }
  const totals = days.map(d => cash.filter(e => e.d === d).reduce((s, e) => s + (e.type === "in" ? e.amt : -e.amt), 0));
  const max = Math.max(1, ...totals.map(Math.abs));
  $("#cBars").innerHTML = days.map((d, i) =>
    `<div class="${totals[i] ? "on" : ""}" style="height:${Math.max(4, Math.abs(totals[i]) / max * 100)}%" title="${d}: ${R(totals[i])}"></div>`).join("");
  $("#cCount").textContent = cash.length + " " + t("m_lines");

  const idxs = cash.map((e, i) => i).slice(-8).reverse();
  $("#cEntries").innerHTML = idxs.length
    ? idxs.map(i => { const e = cash[i]; return `<div class="entry">
        <span>${esc(e.note || "—")}<br><span class="tiny muted">${esc(e.d)}</span></span>
        <span class="${e.type === "in" ? "in" : "out"}">${e.type === "in" ? "+" : "−"}${R(e.amt)}</span>
        <button class="deldot" data-del="${i}" aria-label="${t("btn_delline")}">${ico("trash","sm")}</button>
      </div>`; }).join("")
    : '<p class="small muted" style="margin:10px 0 0">' + t("m_empty") + '</p>';
  renderGoal();
}
let lastAdd = { sig:"", at:0 };
$("#cAdd").addEventListener("click", () => {
  const raw = $("#cAmount").value;
  const amt = parseMoney(raw);
  if (isNaN(amt)) return toast(raw.trim() ? t("toast_amount_bad") : t("toast_amount_first"));
  if (!amt || amt <= 0) return toast(t("toast_amount_first"));
  const note = $("#cNote").value.trim(), type = $("#cType").value;
  /* a double tap on a slow phone must not write the same line twice */
  const sig = type + "|" + amt + "|" + note, now = Date.now();
  if (sig === lastAdd.sig && now - lastAdd.at < 4000) return toast(t("toast_dup_line"));
  lastAdd = { sig, at: now };
  cash.push({ id: "c" + now, d: dayKey(new Date()), type, amt, note });
  if (!Store.set("pusha_cash", cash)) storageFail();
  $("#cAmount").value = ""; $("#cNote").value = "";
  renderMoney(); toast(t("toast_cash_added"));
});

let goal = Store.get("pusha_goal", { name:"", target:0, saved:0 });
function renderGoal(){
  $("#gName").value = goal.name || "";
  $("#gTarget").value = goal.target || "";
  $("#gSaved").textContent = R(goal.saved || 0);
  const pct = goal.target ? Math.min(100, (goal.saved / goal.target) * 100) : 0;
  $("#gFill").style.width = pct + "%";
  if (!goal.target) $("#gHint").textContent = "Set a target to see how many sales you need.";
  else if (goal.saved >= goal.target) $("#gHint").innerHTML = '<span style="color:var(--brand)">' + ico("sparkle","sm") + '</span> <b>Goal reached.</b> Buy the thing, then set the next one.';
  else $("#gHint").textContent = R(goal.target - goal.saved) + " to go (" + Math.round(pct) + "% there).";
}
$("#gName").addEventListener("input", () => { goal.name = $("#gName").value; Store.set("pusha_goal", goal); });
$("#gTarget").addEventListener("input", () => { goal.target = +$("#gTarget").value || 0; Store.set("pusha_goal", goal); renderGoal(); });
renderMoney();


/* delete a line (with Undo) and copy the cashbook out */
$("#cEntries").addEventListener("click", e => {
  const b = e.target.closest("[data-del]");
  if (!b) return;
  const before = cash.slice();
  cash.splice(+b.dataset.del, 1);
  if (!Store.set("pusha_cash", cash)) { cash = before; return storageFail(); }
  renderMoney();
  toastAction(t("toast_deleted"), t("btn_undo"), () => {
    cash = before; Store.set("pusha_cash", cash); renderMoney(); toast(t("toast_restored"));
  });
});

function cashText(){
  const head = ($("#gName") && $("#gName").value) || "";
  const t0 = $("#mToday").textContent, t1 = $("#mWeek").textContent, t2 = $("#mMonth").textContent;
  const lines = cash.map(e => e.d + "  " + (e.type === "in" ? "IN  +" : "OUT −") + R(e.amt) + (e.note ? "  " + e.note : ""));
  return [
    "My cashbook" + (head ? " — " + head : ""),
    "Today " + t0 + " · this week " + t1 + " · this month " + t2,
    "",
    lines.length ? lines.join("\n") : "No lines yet.",
    "",
    "Kept in Pusha — free, offline, no account."
  ].join("\n");
}
$("#cExport").addEventListener("click", async (e) => {
  const r = await shareText(cashText(), "My cashbook");
  if (r === "failed") toast(t("toast_blocked"));
});
