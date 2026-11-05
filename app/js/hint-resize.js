/* Pusha — js/hint-resize.js — the pull-corner on the Skills box
   ------------------------------------------------------------------
   A textarea can be made taller by pulling the little corner. On a phone that
   native corner is invisible, missing, or just a few grey pixels nobody
   recognises — so the Skills box carries its own grip, and the first time it
   shows a breathing ring. Tap the grip and Pusha explains it in words, in the
   chosen language, with one button: "Got it".
   The height is remembered, so the box stays the size the person chose.      */
(function(){
  const KEY_TIP = "pusha_tip_resize";     // 1 once they have read it or pulled it
  const KEY_H   = "pusha_skills_h";       // the height they chose, in px
  const MIN = 74, MAX = 340, TAP_SLOP = 6;

  const ta = $("#f_skills");
  const grip = $("#skillsGrip");
  if (!ta || !grip) return;

  const clampH = h => Math.max(MIN, Math.min(MAX, Math.round(h)));
  const learned = () => Number(Store.get(KEY_TIP, 0)) === 1;
  const learn = () => { Store.set(KEY_TIP, 1); grip.classList.remove("new"); };

  /* the size they pulled last time */
  const savedH = Number(Store.get(KEY_H, 0));
  if (savedH) ta.style.height = clampH(savedH) + "px";

  if (!learned()) grip.classList.add("new");

  /* ---- the explanation ---- */
  function explain(){
    $("#sheetBody").innerHTML =
      '<h2 style="margin:0 0 8px">' + esc(t("grip_title")) + "</h2>" +
      '<p class="small">' + esc(t("grip_body")) + "</p>" +
      '<div class="btns" style="margin-top:16px">' +
        '<button class="btn" id="gripOk">' + esc(t("grip_gotit")) + "</button>" +
      "</div>";
    openSheet();
    const ok = $("#gripOk");
    if (ok) ok.addEventListener("click", () => { closeSheet(); learn(); });
  }

  /* ---- pull it (finger or mouse) ---- */
  let dragging = false, startY = 0, startH = 0, lastH = 0, moved = false;

  grip.addEventListener("pointerdown", e => {
    if (e.button && e.button !== 0) return;
    dragging = true; moved = false;
    startY = e.clientY;
    startH = ta.getBoundingClientRect().height;
    lastH = startH;
    try { grip.setPointerCapture(e.pointerId); } catch (_) {}
  });

  grip.addEventListener("pointermove", e => {
    if (!dragging) return;
    const dy = e.clientY - startY;
    if (!moved && Math.abs(dy) <= TAP_SLOP) return;
    moved = true;
    if (e.cancelable) e.preventDefault();
    lastH = clampH(startH + dy);
    ta.style.height = lastH + "px";
  });

  function end(){
    if (!dragging) return;
    dragging = false;
    if (moved){
      Store.set(KEY_H, Math.round(lastH));   // what we actually set, not a mid-paint measurement
      learn();
    } else {
      explain();                       // a tap, not a pull: tell them how it works
    }
  }
  grip.addEventListener("pointerup", end);
  grip.addEventListener("pointercancel", () => { dragging = false; });
  grip.addEventListener("click", e => e.preventDefault());   // pointerup already handled it
  grip.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar"){ e.preventDefault(); explain(); }
  });

  /* if they use the browser's own corner instead, that counts as knowing it */
  if ("ResizeObserver" in window){
    let first = true;
    try {
      new ResizeObserver(() => {
        if (first){ first = false; return; }
        if (!learned()) learn();
      }).observe(ta);
    } catch (_) {}
  }
})();
