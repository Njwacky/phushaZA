/* Optional, aggregate-only usage counts. Personal fields are never read here.
   Preference and queued counts are deliberately excluded from Pusha backups. */
var UsageAnalytics = (function(){
  const CONSENT = "usage_choice_v1", QUEUE = "usage_queue_v1";
  const TYPES = ["open", "vault", "pack", "ideas", "money", "path", "cv_print", "pdf_download"];
  const MAX = 100, DAYS = 7, DAY_MS = 86400000;
  const supported = !document.documentElement.hasAttribute("data-standalone") &&
    (location.protocol === "https:" || (location.protocol === "http:" && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)));
  let timer = null, sending = false, controller = null, sessionStopped = false;
  function storageGet(key){ try { return localStorage.getItem(key); } catch(e){ return null; } }
  function storageSet(key, value){ try { localStorage.setItem(key, value); return localStorage.getItem(key) === value; } catch(e){ return false; } }
  function consent(){ return supported && !sessionStopped && storageGet(CONSENT) === "on"; }
  function today(){ return new Date().toISOString().slice(0, 10); }
  function validDay(day){
    if (typeof day !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
    const date = new Date(day + "T00:00:00Z");
    if (isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== day) return false;
    const diff = (Date.parse(today()) - date.getTime()) / DAY_MS;
    return diff >= -1 && diff <= DAYS;
  }
  function clean(raw){
    let data; try { data = JSON.parse(raw || "{}"); } catch(e){ data = {}; }
    if (!data || typeof data !== "object") data = {};
    const events = Array.isArray(data.events) ? data.events.filter(e => e && TYPES.includes(e.type) && validDay(e.day)).slice(-MAX).map(e => ({type:e.type, day:e.day})) : [];
    let pending = data.pending;
    if (!pending || !/^[a-f0-9]{32}$/.test(pending.id || "") || !validDay(pending.day) || !pending.counts || typeof pending.counts !== "object") pending = null;
    if (pending){
      const counts = {}; let sum = 0;
      TYPES.forEach(type => { const n = pending.counts[type]; if (Number.isInteger(n) && n > 0 && n <= MAX) { counts[type] = n; sum += n; } });
      pending = sum > 0 && sum <= MAX ? {id:pending.id, day:pending.day, counts} : null;
    }
    return {events, pending};
  }
  function load(){ return clean(storageGet(QUEUE)); }
  function save(data){ return storageSet(QUEUE, JSON.stringify(data)); }
  function clearQueue(){ try { localStorage.removeItem(QUEUE); } catch(e){} }
  function batchId(){
    if (!window.crypto || !crypto.getRandomValues) return null;
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, n => n.toString(16).padStart(2, "0")).join("");
  }
  function schedule(){
    if (!consent() || timer) return;
    timer = setTimeout(() => { timer = null; flush(); }, 5000);
  }
  function record(type){
    if (!consent() || !TYPES.includes(type)) return;
    const state = load();
    // Pending + new events are bounded; if full, discard the oldest new count.
    if (state.events.length >= MAX) state.events.shift();
    state.events.push({type, day:today()});
    if (save(state)) schedule();
  }
  async function flush(){
    if (!consent() || sending || navigator.onLine === false) return;
    const state = load();
    if (!state.pending && state.events.length){
      const id = batchId(); if (!id) return;
      const day = state.events[0].day, counts = {};
      const keep = [];
      state.events.forEach(e => { if (e.day === day) counts[e.type] = (counts[e.type] || 0) + 1; else keep.push(e); });
      state.events = keep; state.pending = {id, day, counts};
      if (!save(state)) return;
    }
    if (!state.pending) return;
    const batch = state.pending; sending = true;
    controller = typeof AbortController === "function" ? new AbortController() : null;
    try {
      const options = {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(batch), credentials:"omit", referrerPolicy:"no-referrer", cache:"no-store"};
      if (controller) options.signal = controller.signal;
      const result = await fetch("/.netlify/functions/usage-collect", options);
      if (!result.ok || !consent()) return;
      const current = load();
      if (current.pending && current.pending.id === batch.id){ current.pending = null; save(current); }
      if (current.events.length) schedule();
    } catch(e) { /* stays on the phone for a later attempt */ }
    finally { sending = false; controller = null; }
  }
  function choose(value){
    if (value !== "on"){
      sessionStopped = true;
      // Even if storage is blocked, do not send or retain anything further.
      if (controller) controller.abort();
      if (timer) clearTimeout(timer); timer = null;
      clearQueue();
      if (!storageSet(CONSENT, "off")) { try { localStorage.removeItem(CONSENT); } catch(e){} }
      render(); return;
    }
    const wasOn = consent();
    if (!supported || !window.crypto || !crypto.getRandomValues || !storageSet(CONSENT, "on")){
      clearQueue(); try { localStorage.removeItem(CONSENT); } catch(e){}
      toast(t("usage_error")); render(); return;
    }
    sessionStopped = false; render(); if (!wasOn) record("open");
  }
  function options(host, settings){
    host.replaceChildren();
    const title = document.createElement("h3"); title.textContent = t("usage_title"); host.appendChild(title);
    const text = document.createElement("p"); text.className = "small muted"; text.textContent = t("usage_body"); host.appendChild(text);
    if (settings){
      const state = document.createElement("p"); state.className = "small"; state.textContent = t(consent() ? "usage_on" : "usage_off"); host.appendChild(state);
    }
    const note = document.createElement("p"); note.className = "tiny muted"; note.textContent = t("usage_clear"); host.appendChild(note);
    const buttons = document.createElement("div"); buttons.className = "btns";
    [["usage_yes", "on"], [settings ? "usage_disable" : "usage_no", "off"]].forEach(([key, value]) => {
      const button = document.createElement("button"); button.type = "button"; button.className = "btn sm " + (value === "on" ? "" : "ghost"); button.textContent = t(key);
      button.addEventListener("click", () => { choose(value); if (settings) closeSheet(); }); buttons.appendChild(button);
    });
    if (settings){ const close = document.createElement("button"); close.type = "button"; close.className = "btn sm ghost"; close.textContent = t("btn_close"); close.addEventListener("click", closeSheet); buttons.appendChild(close); }
    host.appendChild(buttons);
  }
  function render(){
    const card = $("#usageChoice"), settings = $("#usageSettings");
    if (!card || !settings) return;
    settings.hidden = !supported;
    const choice = storageGet(CONSENT);
    card.hidden = !supported || choice === "on" || choice === "off";
    if (!card.hidden) options(card, false); else card.replaceChildren();
  }
  const settings = $("#usageSettings");
  if (settings) settings.addEventListener("click", () => { options($("#sheetBody"), true); openSheet(); });
  addEventListener("online", flush);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) flush(); });
  setInterval(() => { if (consent()) flush(); }, 30000);
  render();
  if (consent()) { record("open"); flush(); }
  return {record, render};
})();
