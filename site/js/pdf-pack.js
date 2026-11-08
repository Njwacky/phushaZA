/* Pusha — offline PDF pack builder. Temporary data is never sent or persisted. */
var PdfPack = (function(){
  const MAX_FILE = 10 * 1024 * 1024, MAX_TOTAL = 25 * 1024 * 1024, MAX_PAGES = 100;
  let pages = [], vaultRows = null, token = 0, busy = false;

  function clear(){
    pages = []; vaultRows = null; busy = false; token++;
    // Drop DOM listeners too: they close over source PDF documents.
    const list = $("#pdfPackList"), vaultList = $("#pdfVaultList");
    if (list) list.replaceChildren();
    if (vaultList) vaultList.replaceChildren();
    const status = $("#pdfPackStatus"); if (status) status.textContent = "";
  }
  function active(id){ return id === token && !locked && !!$("#pdfPackList") && $("#sheet").classList.contains("on"); }
  function message(text, error){
    const el = $("#pdfPackStatus");
    if (el) { el.textContent = text || ""; el.classList.toggle("bad", !!error); }
  }
  function pageLabel(page){ return page.name + " · " + t("pdf_page") + " " + (page.index + 1); }
  function totalSize(){ return [...new Set(pages.map(page => page.source))].reduce((sum, source) => sum + source.size, 0); }
  function selectedVaultIds(){
    return new Set(pages.flatMap(page => page.source.vaultIds || []));
  }
  function sameBytes(a, b){
    if (!a || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }
  function updateControls(){
    renderVaultChoices();
    ["pdfPackAddCV", "pdfPackAddFiles", "pdfPackAddVault", "pdfPackSave"].forEach(id => { const el = $("#" + id); if (el) el.disabled = busy || (id === "pdfPackSave" && !pages.length); });
    const list = $("#pdfPackList"); if (!list) return;
    list.replaceChildren();
    if (!pages.length){
      const empty = document.createElement("li"); empty.className = "small muted"; empty.textContent = t("pdf_empty"); list.appendChild(empty); return;
    }
    pages.forEach((item, i) => {
      const row = document.createElement("li"); row.className = "pdf-pack-page";
      const label = document.createElement("span"); label.className = "pdf-pack-name";
      label.textContent = (i + 1) + ". " + pageLabel(item); row.appendChild(label);
      const controls = document.createElement("div"); controls.className = "pdf-page-controls";
      [["pdf_up", -1], ["pdf_down", 1], ["pdf_remove", 0]].forEach(([key, direction]) => {
        const button = document.createElement("button"); button.type = "button"; button.className = "btn sm ghost";
        button.textContent = t(key); button.setAttribute("aria-label", t(key) + " · " + pageLabel(item));
        button.disabled = busy || (direction === -1 && i === 0) || (direction === 1 && i === pages.length - 1);
        button.addEventListener("click", () => {
          if (direction === 0) pages.splice(i, 1);
          else { const next = i + direction; [pages[i], pages[next]] = [pages[next], pages[i]]; }
          message(""); updateControls();
          const rows = $("#pdfPackList").querySelectorAll(".pdf-pack-page");
          const focusRow = rows[Math.max(0, Math.min(rows.length - 1, direction ? i + direction : i))];
          if (focusRow) { const buttons = focusRow.querySelectorAll("button"); const preferred = buttons[direction < 0 ? 0 : direction > 0 ? 1 : 2]; (preferred && !preferred.disabled ? preferred : buttons[2]).focus(); }
        });
        controls.appendChild(button);
      });
      row.appendChild(controls); list.appendChild(row);
    });
  }
  function setBusy(value){ busy = value; updateControls(); }
  function readFile(file){
    if (typeof file.arrayBuffer === "function") return file.arrayBuffer();
    return new Promise((resolve, reject) => {
      const reader = new FileReader(); reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error("read")); reader.onabort = () => reject(new Error("read"));
      reader.readAsArrayBuffer(file);
    });
  }
  async function addFiles(files){
    if (busy || !files.length || locked) return;
    const id = token; setBusy(true); message(t("pdf_busy"));
    const errors = [];
    try {
      for (const file of files){
        if (!active(id)) return;
        let reason = "";
        try {
          if (file.size > MAX_FILE) throw new Error("large");
          const bytes = new Uint8Array(await readFile(file));
          if (!active(id)) return;
          // Compare actual contents, not names: the same PDF can be selected from
          // the device or Vault under different names. Keep a source selected as
          // long as any of its pages remain in the pack.
          const duplicate = [...new Set(pages.map(page => page.source))].find(source => sameBytes(source.bytes, bytes));
          if (duplicate) {
            if (file.vaultId != null && !duplicate.vaultIds.includes(file.vaultId)) duplicate.vaultIds.push(file.vaultId);
            throw new Error("duplicate");
          }
          if (totalSize() + file.size > MAX_TOTAL) throw new Error("limit");
          // Do not trust the extension or MIME type selected by the browser.
          const header = new TextDecoder("latin1").decode(bytes.slice(0, 1024));
          if (!header.includes("%PDF-")) throw new Error("bad");
          const doc = await PDFLib.PDFDocument.load(bytes, { updateMetadata:false });
          const count = doc.getPageCount();
          if (!count) throw new Error("bad");
          if (pages.length + count > MAX_PAGES) throw new Error("limit");
          if (!active(id)) return;
          const source = { doc, bytes, size:file.size, kind:"file", vaultIds:file.vaultId == null ? [] : [file.vaultId] };
          for (let i = 0; i < count; i++) pages.push({ source, index:i, name:file.name.slice(0, 180) });
        } catch(error){
          reason = error.message === "large" ? t("pdf_large") : error.message === "limit" ? t("pdf_limit") : error.message === "duplicate" ? t("pdf_duplicate") : t("pdf_bad");
          errors.push(file.name.slice(0, 180) + ": " + reason);
        }
      }
      if (active(id)) message(errors.length ? errors.join("\n") : t("pdf_ready") + ": " + pages.length, !!errors.length);
    } finally { if (active(id)) setBusy(false); }
  }

  // Only hide choices in the pack builder; the actual encrypted Vault is never changed.
  // Removing the last page of a file makes it available to select again.
  function renderVaultChoices(){
    const list = $("#pdfVaultList");
    if (!list || vaultRows === null) return;
    list.replaceChildren();
    const selected = selectedVaultIds();
    const available = vaultRows.filter(row => !selected.has(row.id));
    const label = document.createElement("p"); label.className = "small muted";
    label.textContent = !vaultRows.length ? t("pdf_vault_empty") : !available.length ? t("pdf_vault_all_added") : t("pdf_vault_choose");
    list.appendChild(label);
    const id = token;
    available.forEach(row => {
      const button = document.createElement("button"); button.type = "button"; button.className = "btn sm ghost pdf-vault-file";
      button.textContent = row.name; button.disabled = busy;
      button.addEventListener("click", async () => {
        if (busy || !active(id) || selectedVaultIds().has(row.id)) return;
        setBusy(true); message(t("pdf_busy"));
        try {
          const file = await LocalDocuments.readPdf(row.id);
          if (!active(id)) return;
          setBusy(false);
          await addFiles([{name:file.name, size:file.bytes.byteLength, vaultId:row.id, arrayBuffer:() => Promise.resolve(file.bytes)}]);
        } catch(error) { if (active(id)) message(t("files_error"), true); }
        finally { if (active(id)) setBusy(false); }
      });
      list.appendChild(button);
    });
  }
  async function chooseVault(){
    if (busy || locked) return;
    const id = token; setBusy(true); message(t("pdf_busy"));
    try {
      const rows = await LocalDocuments.listPdfs();
      if (!active(id)) return;
      vaultRows = rows;
      message("");
    } catch(error) { if (active(id)) message(error.message === "locked" ? t("files_pin_first") : t("files_error"), true); }
    finally { if (active(id)) setBusy(false); }
  }

  /* Capture the same CV HTML the person previews, retaining their chosen style,
     photo, Unicode text and custom sections. Split at section boundaries where
     possible; pages are embedded as images so fonts remain device-independent. */
  async function createCV(){
    syncVaultFields();
    const host = document.createElement("div");
    host.style.cssText = "position:fixed;left:-10000px;top:0;width:704px;z-index:-1;pointer-events:none";
    host.innerHTML = cvDoc();
    const docEl = host.firstElementChild;
    docEl.style.cssText = "width:704px;padding:0;border:0;border-radius:0;box-shadow:none;font-size:15px";
    document.body.appendChild(host);
    try {
      const height = Math.ceil(docEl.scrollHeight);
      if (height > 12000) throw new Error("long");
      const width = docEl.offsetWidth;
      const rootTop = docEl.getBoundingClientRect().top;
      const bounds = Array.from(docEl.children).map(el => {
        const rect = el.getBoundingClientRect(); return {top:rect.top - rootTop, bottom:rect.bottom - rootTop};
      });
      // If one paragraph spans a page, split between its lines rather than
      // clipping letters across two pages.
      const lines = [], walker = document.createTreeWalker(docEl, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const range = document.createRange(); range.selectNodeContents(walker.currentNode);
        for (const rect of range.getClientRects()) if (rect.height) lines.push({top:rect.top - rootTop, bottom:rect.bottom - rootTop});
      }
      const canvas = await html2canvas(docEl, { backgroundColor:"#ffffff", scale:1.5, logging:false, useCORS:false });
      const pdf = await PDFLib.PDFDocument.create();
      const pageW = 595.28, pageH = 841.89, margin = 36;
      const usableW = pageW - margin * 2, usableH = pageH - margin * 2;
      const pageCssHeight = usableH * width / usableW;
      let top = 0;
      while (top < height){
        let end = Math.min(height, top + pageCssHeight);
        if (end < height){
          const crossed = bounds.find(b => b.top < end && b.bottom > end);
          if (crossed && crossed.top > top + pageCssHeight * 0.25) end = crossed.top;
          const crossedLine = lines.find(line => line.top < end && line.bottom > end);
          if (crossedLine && crossedLine.top > top + 1) end = crossedLine.top;
        }
        const scale = canvas.width / width;
        const sy = Math.round(top * scale), sh = Math.min(canvas.height - sy, Math.max(1, Math.round((end - top) * scale)));
        const part = document.createElement("canvas"); part.width = canvas.width; part.height = sh;
        const ctx = part.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, part.width, part.height);
        ctx.drawImage(canvas, 0, sy, canvas.width, sh, 0, 0, canvas.width, sh);
        const image = await pdf.embedJpg(part.toDataURL("image/jpeg", 0.94));
        const page = pdf.addPage([pageW, pageH]);
        const imageH = sh / canvas.width * usableW;
        page.drawImage(image, { x:margin, y:pageH - margin - imageH, width:usableW, height:imageH });
        part.width = part.height = 0;
        top = end;
      }
      canvas.width = canvas.height = 0;
      return pdf;
    } finally { host.remove(); }
  }
  async function addCV(){
    if (busy || locked) return;
    if (pages.some(p => p.source.kind === "cv")) return message(t("pdf_cv_added"), true);
    const id = token; setBusy(true); message(t("pdf_busy"));
    try {
      const doc = await createCV();
      if (!active(id)) return;
      const count = doc.getPageCount();
      if (pages.length + count > MAX_PAGES) return message(t("pdf_limit"), true);
      const source = { doc, size:0, kind:"cv" };
      for (let i = 0; i < count; i++) pages.push({ source, index:i, name:t("pdf_cv") });
      message(t("pdf_ready") + ": " + pages.length);
    } catch(error){ if (active(id)) message(error.message === "long" ? t("pdf_cv_long") : t("pdf_error"), true); }
    finally { if (active(id)) setBusy(false); }
  }
  async function save(){
    if (busy || locked) return;
    if (!pages.length) return message(t("pdf_no_pages"), true);
    const id = token; setBusy(true); message(t("pdf_busy"));
    try {
      const output = await PDFLib.PDFDocument.create();
      for (const item of pages){
        const [page] = await output.copyPages(item.source.doc, [item.index]);
        if (!active(id)) return;
        output.addPage(page);
      }
      const bytes = await output.save();
      if (!active(id)) return;
      const url = URL.createObjectURL(new Blob([bytes], {type:"application/pdf"}));
      const link = document.createElement("a"); link.href = url; link.download = "pusha-cv-pack.pdf";
      document.body.appendChild(link); link.click(); link.remove();
      if (typeof UsageAnalytics !== "undefined" && UsageAnalytics) UsageAnalytics.record("pdf_download");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      message(t("pdf_done"));
    } catch(error){ if (active(id)) message(t("pdf_error"), true); }
    finally { if (active(id)) setBusy(false); }
  }
  function open(){
    if (locked){ toast(t("toast_unlock_first")); return lockSheet("unlock"); }
    clear();
    $("#sheetBody").innerHTML = `
      <h2>${t("pdf_title")}</h2>
      <p class="small muted">${t("pdf_card_hint")}</p>
      <div class="pdf-pack-actions">
        <button type="button" class="btn sm" id="pdfPackAddCV">${t("pdf_add_cv")}</button>
        <button type="button" class="btn sm ghost" id="pdfPackAddFiles">${t("pdf_add_files")}</button>
        <button type="button" class="btn sm ghost" id="pdfPackAddVault">${t("pdf_add_vault")}</button>
        <input id="pdfPackInput" type="file" accept="application/pdf,.pdf" multiple>
      </div>
      <div id="pdfVaultList"></div>
      <p class="tiny muted">${t("pdf_privacy")}</p>
      <p class="tiny muted">${t("pdf_limits")}</p>
      <h3>${t("pdf_order")}</h3>
      <ol class="pdf-pack-list" id="pdfPackList"></ol>
      <p class="small pdf-pack-status" id="pdfPackStatus" role="status" aria-live="polite"></p>
      <div class="btns"><button type="button" class="btn" id="pdfPackSave">${t("pdf_save")}</button>
      <button type="button" class="btn ghost" id="pdfPackClose">${t("pdf_close")}</button></div>`;
    $("#pdfPackAddCV").addEventListener("click", addCV);
    $("#pdfPackAddVault").addEventListener("click", chooseVault);
    $("#pdfPackAddFiles").addEventListener("click", () => $("#pdfPackInput").click());
    $("#pdfPackInput").addEventListener("change", event => { const files = Array.from(event.target.files || []); event.target.value = ""; addFiles(files); });
    $("#pdfPackSave").addEventListener("click", save);
    $("#pdfPackClose").addEventListener("click", closeSheet);
    updateControls(); openSheet();
  }
  $("#openPdfPack").addEventListener("click", open);
  return { clear };
})();
