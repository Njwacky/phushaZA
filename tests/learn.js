// Learning-layer check. NODE_PATH=/tmp/node_modules node tests/learn.js [url] [tag]
const { chromium } = require("playwright");
const URL = process.argv[2] || "file:///home/user/app/index.html";
const TAG = process.argv[3] || "learn";
(async () => {
  const b = await chromium.launch({ args:["--no-sandbox"] });
  const p = await (await b.newContext({ viewport:{width:430,height:940}, deviceScaleFactor:2 })).newPage();
  const errs = []; p.on("pageerror", e => errs.push(e.message));
  p.on("console", m => { if (m.type()==="error") errs.push(m.text()); });
  const out = {};
  await p.goto(URL); await p.waitForTimeout(400);
  await p.click('#tabs button[data-view="ideas"]'); await p.waitForTimeout(350);

  out.learnCard = await p.isVisible("#openLearn");
  await p.screenshot({ path:`/tmp/shots/${TAG}-ideas.png` });

  // the "no skill yet" sheet
  await p.click("#openLearn"); await p.waitForTimeout(400);
  out.methodSteps = await p.$$eval("#sheetBody ol.steps.big li", e => e.length);
  out.resLinksInSheet = await p.$$eval("#sheetBody a.res", e => e.length);
  out.safeLinks = await p.$$eval("#sheetBody a.res", els => els.every(a => a.target === "_blank" && a.rel.includes("noopener")));
  out.hrefs = await p.$$eval("#sheetBody a.res", els => els.map(a => a.href));
  await p.screenshot({ path:`/tmp/shots/${TAG}-learnsheet.png` });
  await p.click("#learnClose"); await p.waitForTimeout(250);

  // the zero filter
  await p.click('#ideaFilters [data-cat="zero"]'); await p.waitForTimeout(350);
  out.zeroCards = await p.$$eval("#ideaList .ideacard", e => e.length);
  out.allCards = await p.evaluate(() => IDEAS.length);
  out.zeroIds = await p.evaluate(() => IDEAS.filter(i => LEARN[i.id] && LEARN[i.id].zero).map(i => i.id));
  await p.screenshot({ path:`/tmp/shots/${TAG}-zero-filter.png` });
  await p.click('#ideaFilters [data-cat="all"]'); await p.waitForTimeout(250);

  // every idea must have a learn panel with 3 skills, 3 steps and working links
  out.perIdea = [];
  for (const id of await p.evaluate(() => IDEAS.map(i => i.id))) {
    await p.evaluate(i => openIdea(i), id); await p.waitForTimeout(220);
    const r = await p.evaluate(() => ({
      skills: document.querySelectorAll("#sheetBody .skillrow .skl").length,
      steps: document.querySelectorAll("#sheetBody ol.steps li").length,
      links: document.querySelectorAll("#sheetBody a.res").length,
      dead: [...document.querySelectorAll("#sheetBody a.res")].filter(a => !/^https:\/\//.test(a.href)).length
    }));
    if (r.skills !== 3 || r.steps < 3 || r.links < 2 || r.dead) out.perIdea.push({ id, ...r });
    await p.evaluate(() => closeSheet());
  }
  // one idea, full screenshot
  await p.evaluate(() => openIdea("phones")); await p.waitForTimeout(300);
  await p.evaluate(() => document.querySelector("#sheetBody .learnbox").scrollIntoView({ block:"start" }));
  await p.waitForTimeout(250);
  await p.screenshot({ path:`/tmp/shots/${TAG}-idea-learn.png` });
  await p.evaluate(() => closeSheet());

  // still fine in another language
  await p.click("#langBtn"); await p.waitForTimeout(250);
  await p.click('#sheetBody [data-lang="zu"]'); await p.waitForTimeout(450);
  await p.evaluate(() => openIdea("kota")); await p.waitForTimeout(300);
  out.zuHeading = await p.$eval("#sheetBody .learnbox .lbhead", e => e.textContent.trim());
  await p.screenshot({ path:`/tmp/shots/${TAG}-zu-learn.png` });
  await p.evaluate(() => closeSheet());
  out.errors = errs;
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
