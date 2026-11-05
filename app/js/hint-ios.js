/* Pusha — js/hint-ios.js — the one time an iPhone needs telling about the
   home screen
   -------------------------------------------------------------------------
   WebKit deletes a website's script-writable storage — the vault, the cashbook,
   everything — after seven days of Safari use without visiting the site. A web
   app added to the Home Screen is exempt, because it counts as its own app.

   So on iOS this is not a "get our icon" nag. It is the difference between a
   vault that is still there next month and one that is not. It is shown:

     · only in Safari on an iPhone/iPad (never in the installed app itself,
       never on Android, never on a computer)
     · only once there is actually something to lose — a filled vault or a
       cashbook line
     · once per session at most, and never again after "Got it"
     · in the language the person chose, in three short lines
   ------------------------------------------------------------------------- */
(function(){
  const KEY = "pusha_tip_ios";

  const ua = navigator.userAgent || "";
  const isIOS = /iPhone|iPad|iPod/.test(ua) ||
    // iPadOS 13+ reports itself as a Mac; the touch points give it away
    (navigator.platform === "MacIntel" && (navigator.maxTouchPoints || 0) > 1);
  if (!isIOS) return;

  const installed = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
                    window.navigator.standalone === true;
  if (installed) return;                       // already on the home screen: nothing to warn about
  if (Number(Store.get(KEY, 0)) === 1) return; // they have dealt with it

  // is there anything worth protecting yet?
  const hasVault = !!(vault && (vault.fullname || vault.phone || vault.school || vault.id));
  const hasCash  = (Store.get("pusha_cash", []) || []).length > 0;
  if (!hasVault && !hasCash) return;

  let shown = false;

  function explain(){
    if (shown) return;
    shown = true;
    $("#sheetBody").innerHTML =
      '<div class="h1row"><h2 style="margin:0">' + esc(t("ios_title")) + "</h2>" +
        '<svg class="icon startic" aria-hidden="true"><use href="#i-shield"/></svg></div>' +
      '<p class="small" style="margin:0 0 10px">' + esc(t("ios_body")) + "</p>" +
      '<ol class="steps big">' +
        "<li>" + esc(t("ios_step1")) + "</li>" +
        "<li>" + esc(t("ios_step2")) + "</li>" +
      "</ol>" +
      '<div class="btns" style="margin-top:14px">' +
        '<button class="btn" id="iosOk">' + esc(t("ios_ok")) + "</button>" +
        '<button class="btn ghost" id="iosBackup">' + esc(t("ios_backup")) + "</button>" +
        '<button class="btn ghost" id="iosLater">' + esc(t("ios_later")) + "</button>" +
      "</div>";
    openSheet();
    const ok = $("#iosOk");
    if (ok) ok.addEventListener("click", () => { Store.set(KEY, 1); closeSheet(); });
    const later = $("#iosLater");
    if (later) later.addEventListener("click", closeSheet);            // asks again next session
    const bk = $("#iosBackup");
    if (bk) bk.addEventListener("click", () => {
      Store.set(KEY, 1);
      closeSheet();
      try { backupSave(); } catch (e) {}
    });
  }

  // give the app a moment to paint and to finish filling the vault from storage
  const arm = () => setTimeout(explain, 1200);
  if (document.readyState === "complete") arm();
  else window.addEventListener("load", arm, { once: true });
})();
