/* Pusha — js/cv-checks.js — CV completeness, the CV banner, the A4 document, printing */
function cvMissing(){
  const v = vault, has = x => !!(x || "").trim();
  return [
    { field:"f_fullname", ok:has(v.fullname), label:{en:"your full name", zu:"igama lakho eliphelele", st:"lebitso la hao le felletseng", nr:"ibizo lakho elipheleleko"} },
    { field:"f_phone",    ok:has(v.phone),    label:{en:"a phone number", zu:"inombolo yocingo", st:"nomoro ea mohala", nr:"inombolo yefoni"} },
    { field:"f_email",    ok:has(v.email),    label:{en:"an email address", zu:"i-imeyili", st:"aterese ea imeile", nr:"i-imeyili"} },
    { field:"f_school",   ok:has(v.school),   label:{en:"your high school", zu:"isikole sakho", st:"sekolo sa hao", nr:"isikolo sakho samabanga aphezulu"} },
    { field:"f_year",     ok:has(v.year),     label:{en:"your matric year", zu:"unyaka kamatric", st:"selemo sa matric", nr:"umnyaka wakho kamatric"} },
    { field:"f_skills",   ok:(v.skills||"").split(",").filter(x=>x.trim()).length >= 2, label:{en:"at least 2 skills", zu:"amakhono ama-2", st:"bokgoni bo 2", nr:"amakghono ama-2"} },
    { field:"f_kin",      ok:has(v.kin),      label:{en:"a reference (next of kin)", zu:"umuntu ongabhekisa kuye", st:"motho oa ho bua le eena", nr:"umuntu ongabhekisa kuye"} }
  ].filter(x => !x.ok);
}
function cvScore(){ const m = cvMissing().length; return Math.round((7 - m) / 7 * 100); }

function focusField(id){
  show("vault");
  setTimeout(() => {
    const el = $("#" + id); if (!el) return;
    el.scrollIntoView({ behavior:"smooth", block:"center" });
    try { el.focus({ preventScroll:true }); } catch(e){ el.focus(); }
  }, 220);
}

function renderCVBanner(){
  const box = $("#cvBanner"); if (!box) return;
  syncVaultFields();
  const miss = cvMissing(), score = cvScore();
  $("#tabs button[data-view=\"pack\"]").classList.toggle("alert", score < 100);
  if (!miss.length){ box.innerHTML = ""; return; }
  box.innerHTML = `<div class="banner"><span class="bi">${ico("alert","sm")}</span>
      <div style="flex:1">
        <b>${t("cv_needs")} (${score}% ${t("cv_done")}).</b>
        <div class="tiny" style="margin-top:2px">${miss.map(m => m.label[LANG] || m.label.en).join(" · ")}</div>
        <button class="btn xs ghost" id="fixCV" style="margin-top:8px">${t("notif_fix")}</button>
      </div>
    </div>`;
  $("#fixCV").addEventListener("click", () => focusField(miss[0].field));
}
/* copies the inputs into the in-memory vault only. It must NOT persist: it runs from
   renderCVBanner(), which saveVault() itself calls, so persisting here would loop.
   Anything that should be written to the phone uses saveVault() instead. */
function syncVaultFields(){ try { VAULT_FIELDS.forEach(k => { const el = $("#f_" + k); if (el) vault[k] = el.value; }); if (typeof tidyVaultText === "function") tidyVaultText(false); } catch(e){} }

/* ---- extra CV sections the template has no field for ---- */
function cvExtras(){ return Array.isArray(vault.cvExtra) ? vault.cvExtra : []; }
function addSectionSheet(){
  $("#sheetBody").innerHTML = `
    <h2 style="margin:0 0 4px">${t("cv_custom_title")}</h2>
    <p class="small muted" style="margin:0 0 14px">${t("cv_custom_hint")}</p>
    <label class="f"><span>${LANG==="zu"?"Isihloko":LANG==="st"?"Sehlooho":"Title"}</span>
      <input id="xs_title" placeholder="${t("cv_sec_work")}"></label>
    <label class="f"><span>${LANG==="zu"?"Incazelo":LANG==="st"?"Tlhaloso":"Details"}</span>
      <textarea id="xs_text" placeholder="Shop assistant, Benoni Mini Market, 2025–2026. Till, stock, closing up."></textarea></label>
    <div class="btns" style="margin-top:4px">
      <button class="btn" id="xs_save">${t("btn_add")}</button>
      <button class="btn ghost sm" id="xs_cancel">${t("btn_cancel")}</button>
    </div>`;
  $("#xs_cancel").addEventListener("click", openCV);
  $("#xs_save").addEventListener("click", () => {
    const title = $("#xs_title").value.trim(), text = $("#xs_text").value.trim();
    if (!title) return toast(LANG==="zu"?"Faka isihloko":LANG==="st"?"Kenya sehlooho":"Give the section a title");
    vault.cvExtra = cvExtras().concat([{ title, text }]);
    persistVault();
    openCV(); toast(LANG==="zu"?"Isigaba sengeziwe":LANG==="st"?"Karolo e kentsoe":"Section added to your CV");
  });
  openSheet();
}

/* ---- CV: real A4 document with the photo ---- */
function ageFrom(dob){ if (!dob) return ""; const d = new Date(dob); if (isNaN(d)) return "";
  const t = new Date(); let a = t.getFullYear() - d.getFullYear();
  const m = t.getMonth() - d.getMonth(); if (m < 0 || (m === 0 && t.getDate() < d.getDate())) a--; return a > 0 ? a : ""; }

const CV_TEMPLATES = ["classic", "modern", "simple"];
function cvTemplate(){
  const selected = Store.get("pusha_cv_template", "classic");
  return CV_TEMPLATES.includes(selected) ? selected : "classic";
}

function cvDoc(){
  const v = vault;
  const name = v.fullname || "Your full name";
  const skills = (v.skills || "").split(/[,\n]/).map(x => x.trim()).filter(Boolean);
  const subjects = (v.subjects || "").split(/[,\n]/).map(x => x.trim()).filter(Boolean);
  const age = ageFrom(v.dob);
  const profile = [
    (v.year ? "Matric pass (" + v.year + ")" : "Matric") + (v.school ? " from " + v.school : "") + ".",
    subjects.length ? "Strongest subjects: " + subjects.join(", ") + "." : "",
    skills.length ? "Practical skills: " + skills.join(", ") + "." : "",
    "Looking for a first job, learnership or internship where reliability and hard work get noticed."
  ].filter(Boolean).join(" ");
  const contact = [v.phone, v.email, v.address].filter(Boolean).join("  ·  ") || "Add your phone, email and address in the Vault";
  const photo = safePhoto(v.photo);   // a remote or non-raster "photo" is dropped, never rendered

  return `<div class="doc cv-template-${cvTemplate()}">
    <div class="head">
      <div class="meta">
        <h1>${esc(name)}</h1>
        <div class="role">First-time job seeker${age ? " · age " + age : ""}</div>
        <div class="contact" style="margin-top:8px">${esc(contact)}</div>
      </div>
      <div class="ph">${photo ? '<img alt="" src="' + photo + '">' : '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4.6 20a7.4 7.4 0 0 1 14.8 0"/></svg>'}</div>
    </div>

    <h2>Profile</h2>
    <p>${esc(profile)}</p>

    <h2>Education</h2>
    <p><b>${esc(v.school || "High school")}</b>${v.year ? " — National Senior Certificate, " + esc(v.year) : ""}${v.examno ? " (exam no. " + esc(v.examno) + ")" : ""}${subjects.length ? "<br>Subjects: " + esc(subjects.join(", ")) : ""}</p>

    ${skills.length ? "<h2>Skills</h2><div class=\"pillrow\">" + skills.map(s => "<span>" + esc(s) + "</span>").join("") + "</div>" : ""}

    ${cvExtras().map(x => "<h2>" + esc(x.title) + "</h2><p>" + esc(String(x.text || "")).replace(/\n/g, "<br>") + "</p>").join("")}

    <h2>Availability &amp; references</h2>
    <p>Available immediately${v.licence && v.licence !== "None" ? " · Driver's licence: " + esc(v.licence) : ""}.${v.kin ? "<br>Reference: " + esc(v.kin) : "<br>Reference: add a name and number in your vault."}</p>

    <div class="foot">Printed with Pusha on ${new Date().toLocaleDateString("en-ZA")} · Keep this CV to one page and send the same file every time.</div>
  </div>`;
}

function renderCVThumb(){
  const v = vault;
  const skills = (v.skills || "").split(/[,\n]/).map(x => x.trim()).filter(Boolean).slice(0, 3);
  const photo = safePhoto(v.photo);
  $("#cvThumb").innerHTML = `
    <div class="ph">${photo ? '<img alt="" src="' + photo + '">' : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4.6 20a7.4 7.4 0 0 1 14.8 0"/></svg>'}</div>
    <div class="body">
      <div class="nm">${esc(v.fullname || "Your full name")}</div>
      <div class="sm">${esc([v.phone || "your phone", v.email || "your email"].join(" · "))}</div>
      <div class="rule"></div>
      <div class="ln"></div><div class="ln"></div><div class="ln s"></div>
      <div class="sm" style="margin-top:6px">${skills.length ? esc(skills.join(" · ")) : "add your skills in the vault"}</div>
    </div>`;
}

function cvText(){
  const v = vault;
  const skills = (v.skills || "").split(/[,\n]/).map(x => x.trim()).filter(Boolean);
  const subjects = (v.subjects || "").split(/[,\n]/).map(x => x.trim()).filter(Boolean);
  return [
    v.fullname || "Your full name",
    [v.phone, v.email, v.address].filter(Boolean).join(" | "),
    "",
    "PROFILE",
    (v.year ? "Matric pass (" + v.year + ")" : "Matric") + (v.school ? ", " + v.school : "") + "." +
      (subjects.length ? " Subjects: " + subjects.join(", ") + "." : "") +
      " Looking for a first job or learnership. Reliable, on time, willing to start at the bottom.",
    "",
    "EDUCATION",
    (v.school || "High school") + (v.year ? " — National Senior Certificate, " + v.year : ""),
    "",
    "SKILLS",
    skills.length ? skills.join(", ") : "—",
    "",
    "REFERENCE",
    v.kin || "—",
    "",
    "ID: " + (v.id || "—")
  ].join("\n");
}

function openCV(){
  saveVault(true); renderCVThumb();
  const miss = cvMissing(), score = cvScore(), extras = cvExtras();
  $("#sheetBody").innerHTML = `
    <div class="cvcheck">
      <div class="top">
        <b>${miss.length ? t("cv_needs") : t("cv_ready")}</b>
        <span class="tiny muted">${score}% ${t("cv_done")}</span>
      </div>
      <div class="cvbar"><i style="width:${score}%"></i></div>
      ${miss.length
        ? `<div class="misslist">${miss.map(m => `<button class="miss" data-fix="${m.field}">${ico("plus","sm")} ${m.label[LANG] || m.label.en}</button>`).join("")}</div>`
        : `<p class="tiny muted" style="margin:0">${t("notif_ok")}</p>`}
    </div>
    <p class="small muted" style="margin:0 0 12px">${miss.length ? t("cv_howto") : t("cv_howto_ok")}</p>
    <div class="cv-template-picker" role="group" aria-label="${t("cv_template")}">
      <span class="tiny muted">${t("cv_template")}</span>
      ${CV_TEMPLATES.map(name => `<button type="button" class="chip sm${cvTemplate() === name ? " on" : ""}" data-cv-template="${name}" aria-pressed="${cvTemplate() === name}">${t("cv_" + name)}</button>`).join("")}
    </div>
    <div id="cvDocument">${cvDoc()}</div>
    <p class="tiny muted" style="margin:10px 0 0">${t("cv_pdf_hint")}</p>
    <div class="btns" style="margin:8px 0 0">
      <button class="btn" id="printCV">${ico("print","sm")} ${t("cv_print")}</button>
      <button class="btn ghost sm" id="copyCVtext">${ico("copy","sm")} ${t("btn_copytext")}</button>
      <button class="btn ghost sm" id="shareCV">${ico("share","sm")} ${t("btn_share")}</button>
    </div>
    <div class="sechead" style="margin:18px 0 6px">
      <h3 style="margin:0">${t("bt_addsection")}</h3>
      ${extras.length ? `<span class="pill grey">${extras.length}</span>` : ""}
    </div>
    ${extras.map((x, i) => `<div class="extrarow">
        <div style="flex:1"><b>${esc(x.title)}</b><p>${esc(String(x.text || ""))}</p></div>
        <button class="deldot" data-del="${i}" aria-label="delete">${ico("trash","sm")}</button>
      </div>`).join("")}
    <button class="btn ghost" id="addSection" style="margin-top:8px">${ico("plus","sm")} ${t("bt_addsection")}</button>
    <p class="docnote">${safePhoto(vault.photo)
      ? "Your photo is on it. One page, printed or saved as a PDF — send the same file every time."
      : "No photo yet — add one in the Vault tab and it will appear here. A CV without a photo is fine too."}</p>`;

  $$("#sheetBody [data-cv-template]").forEach(button => button.addEventListener("click", () => {
    if (!Store.set("pusha_cv_template", button.dataset.cvTemplate)) storageFail();
    $("#cvDocument").innerHTML = cvDoc();
    $$("#sheetBody [data-cv-template]").forEach(option => {
      const selected = option.dataset.cvTemplate === cvTemplate();
      option.classList.toggle("on", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
  }));
  $$("#sheetBody [data-fix]").forEach(b => b.addEventListener("click", () => { closeSheet(); focusField(b.dataset.fix); }));
  $$("#sheetBody [data-del]").forEach(b => b.addEventListener("click", () => {
    const before = cvExtras().slice();
    const list = before.slice(); list.splice(+b.dataset.del, 1);
    vault.cvExtra = list; persistVault().then(ok => {
      if (!ok) { vault.cvExtra = before; }
    });
    openCV();
    toastAction(t("toast_deleted"), t("btn_undo"), () => {
      vault.cvExtra = before; persistVault(); openCV(); toast(t("toast_restored"));
    });
  }));
  $("#addSection").addEventListener("click", addSectionSheet);
  $("#printCV").addEventListener("click", () => {
    saveVault(true);
    $("#printArea").innerHTML = '<div style="padding:14mm;max-width:190mm">' + cvDoc() + '</div>';
    try { window.print(); } catch(e){ toast(t("toast_print_blocked")); }
  });
  $("#copyCVtext").addEventListener("click", async (e) => { await copyText(cvText(), e.currentTarget); });
  $("#shareCV").addEventListener("click", async () => {
    saveVault(true);   /* the CV is built from the vault, so the vault must be on disk */
    const r = await shareText(cvText(), vault.fullname || "My CV");
    if (r === "failed") toast(t("toast_blocked"));
  });
  openSheet();
}
$("#openCV").addEventListener("click", openCV);

$("#copyCV").addEventListener("click", async (e) => { saveVault(true); await copyText(cvText(), e.currentTarget); });
$("#cvThumb").addEventListener("click", () => $("#openCV").click());

