/* Pusha — js/diy.js — the make-and-sell projects: the list and the how-to
   ------------------------------------------------------------------------
   Ten things a person can make with their hands and sell, for people who do
   not want to study further or cannot afford to. Every project opens with
   pictures, the shopping list with prices, the steps, where to sell it, and
   what goes wrong. Long teaching text stays in English and the app says so. */

const R0 = n => "R" + Math.round(n).toLocaleString("en-ZA");

/* A real photo of each finished project. Kept as its own table with plain
   paths so the single-file build can swap every one for a data URI. */
const DIY_PHOTO = {
  paperbeads: "img/diy-paperbeads.jpg",
  wirename: "img/diy-wirename.jpg",
  beadcharms: "img/diy-beadcharms.jpg",
  tasselhanging: "img/diy-tasselhanging.jpg",
  stringart: "img/diy-stringart.jpg",
  candles: "img/diy-candles.jpg",
  soap: "img/diy-soap.jpg",
  planters: "img/diy-planters.jpg",
  saltdough: "img/diy-saltdough.jpg",
  wordart: "img/diy-wordart.jpg"
};
function diyPic(p){
  const src = DIY_PHOTO[p.id];
  if (src) return '<img class="diyphoto" src="' + src + '" alt="" loading="lazy" decoding="async">';
  return DIY_ART[p.art[2]] || "";        // no photo? fall back to the drawing
}

function diyTotalCost(p){
  return p.need.reduce((s, n) => s + (Number(n[1]) || 0), 0);
}

/* ---------- the list ---------- */
function diyListSheet(){
  const rows = DIY.map(p => {
    return '<button class="diyrow" data-diy="' + esc(p.id) + '">' +
        '<span class="diyart">' + diyPic(p) + "</span>" +
        '<span class="diytext">' +
          '<span class="diyname">' + esc(p.name) + "</span>" +
          '<span class="diytag">' + esc(p.tag) + "</span>" +
          '<span class="diymeta">' + R0(diyTotalCost(p)) + " to start · sells " +
            R0(p.price[0]) + "–" + R0(p.price[1]) + "</span>" +
        "</span>" +
        '<svg class="icon sm" aria-hidden="true"><use href="#i-arrow"/></svg>' +
      "</button>";
  }).join("");

  $("#sheetBody").innerHTML =
    '<div class="h1row"><h2 style="margin:0">' + esc(t("diy_title")) + "</h2>" +
      '<svg class="icon startic" aria-hidden="true"><use href="#i-foundation"/></svg></div>' +
    '<div id="diyRows">' + rows + "</div>" +
    '<p class="tiny muted" style="margin-top:10px">' + esc(t("diy_note")) + "</p>" +
    '<div class="btns" style="margin-top:14px"><button class="btn ghost sm" id="diyClose">' +
      esc(t("btn_close")) + "</button></div>";

  $$("#diyRows [data-diy]").forEach(b => b.addEventListener("click", () => openDiy(b.dataset.diy)));
  const cl = $("#diyClose");
  if (cl) cl.addEventListener("click", closeSheet);
  openSheet();
}

/* ---------- one project ---------- */
function openDiy(id){
  const p = DIY.find(x => x.id === id);
  if (!p) return;
  const total = diyTotalCost(p);

  const need = p.need.map(n =>
    '<li><span class="k">' + esc(n[0]) + '</span><b>' +
      (Number(n[1]) ? R0(n[1]) : esc(t("diy_free"))) + "</b></li>").join("");

  const steps = p.steps.map(s => "<li>" + esc(s) + "</li>").join("");

  const pics = [p.art[0], p.art[1]].map((a, i) =>
    '<figure class="diypic">' + (DIY_ART[a] || "") +
    '<figcaption>' + esc(t(["diy_pic1", "diy_pic2"][i] || "diy_pic2")) + "</figcaption></figure>"
  ).join("");

  $("#sheetBody").innerHTML =
    '<div class="h1row"><h2 style="margin:0">' + esc(p.name) + "</h2>" +
      '<svg class="icon startic" aria-hidden="true"><use href="#i-foundation"/></svg></div>' +
    '<figure class="diyhero">' + diyPic(p) +
      '<figcaption>' + esc(t("diy_photo_note")) + "</figcaption></figure>" +
    '<div class="diystats">' +
      "<div><span>" + esc(t("diy_cost")) + "</span><b>" + R0(total) + "</b></div>" +
      "<div><span>" + esc(t("diy_price")) + "</span><b>" + R0(p.price[0]) + "–" + R0(p.price[1]) + "</b></div>" +
      "<div><span>" + esc(t("diy_time")) + "</span><b>" + esc(p.time) + "</b></div>" +
    "</div>" +
    '<div class="diygrid">' + pics + "</div>" +

    '<h3 style="margin-top:16px">' + esc(t("diy_need")) + "</h3>" +
    '<ul class="list">' + need + "</ul>" +
    '<p class="tiny muted" style="margin:-2px 0 0">' + esc(t("diy_need_note")) + "</p>" +

    '<h3 style="margin-top:16px">' + esc(t("diy_steps")) + "</h3>" +
    '<ol class="diysteps">' + steps + "</ol>" +

    '<h3 style="margin-top:14px">' + esc(t("diy_sell")) + "</h3>" +
    '<p class="small">' + esc(p.sell) + "</p>" +

    '<h3 style="margin-top:14px">' + esc(t("diy_watch")) + "</h3>" +
    '<p class="small">' + esc(p.watch) + "</p>" +

    (p.safety ? '<h3 style="margin-top:14px">' + esc(t("diy_safety")) + "</h3>" +
      '<p class="small">' + esc(p.safety) + "</p>" : "") +

    '<div class="btns" style="margin-top:16px">' +
      '<button class="btn sm" id="diyCopy"><svg class="icon sm" aria-hidden="true"><use href="#i-copy"/></svg> ' +
        esc(t("diy_copy")) + "</button>" +
      '<button class="btn ghost sm" id="diyBack">' + esc(t("btn_back")) + "</button>" +
      '<button class="btn ghost sm" id="diyClose2">' + esc(t("btn_close")) + "</button>" +
    "</div>" +
    '<p class="tiny muted" style="margin-top:8px">' + esc(t("diy_note")) + "</p>";

  openSheet();

  const cp = $("#diyCopy");
  if (cp) cp.addEventListener("click", () => {
    const list = p.name + " — " + t("diy_need") + "\n" +
      p.need.map(n => "• " + n[0] + (Number(n[1]) ? " " + R0(n[1]) : "")).join("\n") +
      "\n\n" + t("diy_cost") + ": " + R0(total) + " · " + t("diy_price") + ": " + R0(p.price[0]) + "–" + R0(p.price[1]) +
      "\n\nPusha — free, offline, no account.";
    copyText(list, cp);
  });
  const back = $("#diyBack");
  if (back) back.addEventListener("click", () => { closeSheet(); setTimeout(diyListSheet, 160); });
  const cl = $("#diyClose2");
  if (cl) cl.addEventListener("click", closeSheet);
}

/* ---------- wiring ---------- */
(function(){
  const b = $("#openDiy");
  if (b) b.addEventListener("click", diyListSheet);
})();
