/* Pusha — js/documents.js — encrypted, device-local document storage */
// `var` avoids a temporal-dead-zone during the single-file build, where all
// classic scripts share one compiled scope and setLockedUI runs before this file.
var LocalDocuments = (function(){
  const DB_NAME = "pusha-files";
  const DB_VERSION = 1;
  const STORE_NAME = "files";
  const MAX_FILE_BYTES = 10 * 1024 * 1024;
  const MAX_TOTAL_BYTES = 25 * 1024 * 1024;
  const MAX_FILES = 50;
  let dbPromise;
  let objectUrls = [];

  function openDB(){
    if (!("indexedDB" in window)) return Promise.reject(new Error("unsupported"));
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME))
          db.createObjectStore(STORE_NAME, { keyPath:"id", autoIncrement:true });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("open"));
      request.onblocked = () => reject(new Error("blocked"));
    }).catch(error => {
      dbPromise = null;
      throw error;
    });
    return dbPromise;
  }

  async function request(store, method, value){
    const db = await openDB();
    return new Promise((resolve, reject) => {
      let result;
      const tx = db.transaction(STORE_NAME, method === "getAll" || method === "count" ? "readonly" : "readwrite");
      const objectStore = tx.objectStore(STORE_NAME);
      const req = value === undefined ? objectStore[method]() : objectStore[method](value);
      req.onsuccess = () => { result = req.result; };
      req.onerror = () => reject(req.error || new Error(method));
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error || new Error(method));
      tx.onabort = () => reject(tx.error || new Error(method));
    });
  }

  function toBase64(bytes){
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  function fromBase64(value){
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  async function decryptMetadata(file, cryptoKey){
    const raw = await crypto.subtle.decrypt(
      { name:"AES-GCM", iv:new Uint8Array(file.metaIv) },
      cryptoKey,
      file.metadata
    );
    return JSON.parse(new TextDecoder().decode(raw));
  }

  async function key(create){
    if (vault.__fileKey) {
      return crypto.subtle.importKey("raw", fromBase64(vault.__fileKey), { name:"AES-GCM" }, false, ["encrypt","decrypt"]);
    }
    if (!create) throw new Error("missing-key");
    const made = await crypto.subtle.generateKey({ name:"AES-GCM", length:256 }, true, ["encrypt","decrypt"]);
    const raw = await crypto.subtle.exportKey("raw", made);
    vault.__fileKey = toBase64(new Uint8Array(raw));
    if (!(await persistVault())) {
      delete vault.__fileKey;
      throw new Error("vault-save");
    }
    return crypto.subtle.importKey("raw", raw, { name:"AES-GCM" }, false, ["encrypt","decrypt"]);
  }

  function hasUnlockedPin(){
    const savedVault = Store.get("pusha_vault", {});
    return !!(savedVault && savedVault.__enc && vaultPin && !locked);
  }

  function status(message, error){
    const el = $("#filesStatus");
    if (!el) return;
    el.textContent = message || "";
    el.classList.toggle("bad", !!error);
  }

  function releaseUrls(){
    objectUrls.forEach(url => URL.revokeObjectURL(url));
    objectUrls = [];
  }

  function formatSize(bytes){
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  async function render(){
    releaseUrls();
    const list = $("#filesList");
    const input = $("#filesIn");
    if (!list || !input) return;
    const ready = hasUnlockedPin();
    input.disabled = !ready;
    const label = $("#filesAddLabel"), pinButton = $("#filesPin");
    if (label) label.style.display = ready ? "inline-flex" : "none";
    if (pinButton) {
      pinButton.hidden = ready;
      pinButton.textContent = locked ? t("btn_unlock") : t("files_set_pin");
    }
    list.replaceChildren();
    if (locked) {
      status(t("files_unlock"), false);
      return;
    }
    if (!hasUnlockedPin()) {
      status(t("files_pin_first"), false);
      return;
    }
    status(t("files_loading"), false);
    try {
      const files = await request(null, "getAll");
      if (locked) return render();
      status(files.length ? t(files.length === 1 ? "files_one" : "files_count").replace("%s", files.length) : t("files_empty"), false);
      // A new vault has no file key until its first upload. An empty list is not an error.
      if (!files.length) return;
      const cryptoKey = await key(false);
      const rows = await Promise.all(files.map(async file => ({ file, meta:await decryptMetadata(file, cryptoKey) })));
      rows.sort((a, b) => b.meta.added - a.meta.added);
      rows.forEach(({file, meta:fileMeta}) => {
        const row = document.createElement("div");
        row.className = "local-file";
        const details = document.createElement("div");
        details.className = "local-file-info";
        const name = document.createElement("b");
        name.textContent = fileMeta.name;
        const info = document.createElement("span");
        info.className = "tiny muted";
        info.textContent = formatSize(file.size) + " · " + new Date(fileMeta.added).toLocaleDateString();
        details.append(name, info);

        const actions = document.createElement("div");
        actions.className = "local-file-actions";
        const download = document.createElement("button");
        download.type = "button";
        download.className = "btn sm ghost";
        download.textContent = t("files_download");
        download.addEventListener("click", () => downloadFile(file));
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "btn sm ghost";
        remove.textContent = t("files_remove");
        remove.addEventListener("click", async () => {
          if (!window.confirm(t("files_remove_confirm"))) return;
          try {
            await request(null, "delete", file.id);
            await dropUnusedKey();
            await render();
          } catch(error) {
            console.error("Could not remove local file", error);
            status(t("files_error"), true);
          }
        });
        actions.append(download, remove);
        row.append(details, actions);
        list.appendChild(row);
      });
    } catch(error) {
      console.error("Could not render local files", error);
      status(t("files_error"), true);
    }
  }

  async function downloadFile(file){
    if (locked || !hasUnlockedPin()) return status(t("files_unlock"), true);
    try {
      const cryptoKey = await key(false);
      const meta = await decryptMetadata(file, cryptoKey);
      const plain = await crypto.subtle.decrypt(
        { name:"AES-GCM", iv:new Uint8Array(file.iv) },
        cryptoKey,
        file.ciphertext
      );
      const blob = new Blob([plain], { type:meta.type || "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      objectUrls.push(url);
      const link = document.createElement("a");
      link.href = url;
      link.download = meta.name;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch(error) {
      status(t("files_decrypt_error"), true);
    }
  }

  function readFileBytes(file){
    if (typeof file.arrayBuffer === "function") return file.arrayBuffer();
    // Older mobile browsers expose FileReader but not Blob.arrayBuffer().
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error("read"));
      reader.onabort = () => reject(new Error("read"));
      reader.readAsArrayBuffer(file);
    });
  }

  async function addFile(file){
    if (file.size > MAX_FILE_BYTES) throw new Error("file-size");
    const existing = await request(null, "getAll");
    const used = existing.reduce((sum, item) => sum + item.size, 0);
    if (existing.length >= MAX_FILES || used + file.size > MAX_TOTAL_BYTES) throw new Error("quota");
    const cryptoKey = await key(true);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt({ name:"AES-GCM", iv }, cryptoKey, await readFileBytes(file));
    const metaIv = crypto.getRandomValues(new Uint8Array(12));
    const metadata = await crypto.subtle.encrypt(
      { name:"AES-GCM", iv:metaIv },
      cryptoKey,
      new TextEncoder().encode(JSON.stringify({
        name:file.name.slice(0, 255),
        type:file.type.slice(0, 128),
        size:file.size,
        added:Date.now()
      }))
    );
    await request(null, "add", {
      size:file.size,
      iv:iv.buffer,
      ciphertext,
      metaIv:metaIv.buffer,
      metadata
    });
  }

  async function handleFiles(files){
    if (!files.length) return;
    if (locked) return status(t("files_unlock"), true);
    if (!hasUnlockedPin()) return status(t("files_pin_first"), true);
    status(t("files_saving"), false);
    let saved = 0, rejected = 0, lastError = "";
    for (const file of files) {
      try {
        await addFile(file);
        saved++;
      } catch(error) {
        rejected++;
        console.error("Could not save local file", error);
        if (error && error.message === "file-size") lastError = t("files_too_large");
        else if (error && error.message === "quota") lastError = t("files_limit");
        else lastError = t("files_error");
      }
    }
    await render();
    if (rejected) status(lastError, true);
    if (saved && rejected) toast(t("files_partial").replace("%s", saved).replace("%d", rejected));
    else if (saved) toast(t("files_saved").replace("%s", saved));
    else if (rejected) toast(lastError);
  }

  async function dropUnusedKey(){
    if ((await request(null, "count")) !== 0 || !vault.__fileKey) return;
    const savedKey = vault.__fileKey;
    delete vault.__fileKey;
    if (!(await persistVault())) vault.__fileKey = savedKey;
  }

  async function hasFiles(){
    return (await request(null, "count")) > 0;
  }

  function backupRecords(){
    return request(null, "getAll").then(files => files.map(file => ({
      name:file.name,
      size:file.size,
      iv:toBase64(new Uint8Array(file.iv)),
      ciphertext:toBase64(new Uint8Array(file.ciphertext)),
      metaIv:toBase64(new Uint8Array(file.metaIv)),
      metadata:toBase64(new Uint8Array(file.metadata))
    })));
  }

  function cleanBackupRecords(records){
    if (records == null) return [];
    if (!Array.isArray(records) || records.length > MAX_FILES) return null;
    let total = 0;
    const clean = [];
    for (const file of records) {
      if (!file || typeof file !== "object" ||
          typeof file.iv !== "string" || typeof file.ciphertext !== "string" ||
          typeof file.metaIv !== "string" || typeof file.metadata !== "string") return null;
      const size = Number(file.size);
      if (!Number.isSafeInteger(size) || size < 0 || size > MAX_FILE_BYTES ||
          !/^[A-Za-z0-9+/]+={0,2}$/.test(file.iv) ||
          !/^[A-Za-z0-9+/]*={0,2}$/.test(file.ciphertext) ||
          !/^[A-Za-z0-9+/]+={0,2}$/.test(file.metaIv) ||
          !/^[A-Za-z0-9+/]+={0,2}$/.test(file.metadata)) return null;
      let iv, ciphertext, metaIv, metadata;
      try {
        iv = fromBase64(file.iv);
        ciphertext = fromBase64(file.ciphertext);
        metaIv = fromBase64(file.metaIv);
        metadata = fromBase64(file.metadata);
      } catch(error) { return null; }
      if (iv.length !== 12 || metaIv.length !== 12 || ciphertext.length !== size + 16) return null;
      total += size;
      if (total > MAX_TOTAL_BYTES) return null;
      clean.push({
        size,
        iv:iv.buffer,
        ciphertext:ciphertext.buffer,
        metaIv:metaIv.buffer,
        metadata:metadata.buffer
      });
    }
    return clean;
  }

  async function replaceBackupRecords(records){
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.clear();
      records.forEach(file => store.add(file));
      tx.oncomplete = () => { render(); resolve(); };
      tx.onerror = () => reject(tx.error || new Error("restore"));
      tx.onabort = () => reject(tx.error || new Error("restore"));
    });
  }

  const pinButton = $("#filesPin");
  if (pinButton) pinButton.addEventListener("click", () => lockSheet(locked ? "unlock" : "set"));
  const input = $("#filesIn");
  if (input) input.addEventListener("change", async () => {
    const files = Array.from(input.files || []);
    input.value = "";
    await handleFiles(files);
  });
  render();
  return {
    hasFiles,
    render,
    backupRecords,
    cleanBackupRecords,
    replaceBackupRecords
  };
})();

function setDocumentsLocked(isLocked){
  locked = isLocked;
  const input = $("#filesIn");
  if (input) input.disabled = locked || !(Store.get("pusha_vault", {}).__enc && vaultPin);
  if (typeof renderLocalDocuments === "function") renderLocalDocuments();
}

function renderLocalDocuments(){
  if (typeof LocalDocuments !== "undefined") LocalDocuments.render();
}
