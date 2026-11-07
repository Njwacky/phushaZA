/* Run with Playwright and pdf-lib installed: node tests/pdf-pack.js [app URL].
   Set PUSHA_CHROMIUM to use a non-default Chromium executable. */
const assert = require("assert");
const fs = require("fs");
const { chromium } = require("playwright");
const { PDFDocument, PDFName, PDFRawStream } = require("pdf-lib");

async function pdfWithWidths(widths){
  const doc = await PDFDocument.create();
  widths.forEach(width => doc.addPage([width, 500]));
  return Buffer.from(await doc.save());
}
(async () => {
  const browser = await chromium.launch({ args:["--no-sandbox"], ...(process.env.PUSHA_CHROMIUM ? {executablePath:process.env.PUSHA_CHROMIUM} : {}) });
  const errors = [], requests = [];
  try {
    const context = await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true});
    const page = await context.newPage();
    page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript(() => document.addEventListener("securitypolicyviolation", e => { window.__cspErrors = (window.__cspErrors || []).concat(e.violatedDirective); }));
    const target = process.argv[2] || "http://127.0.0.1:8000/";
    const origin = new URL(target).origin;
    page.on("request", req => { if (/^https?:/.test(req.url()) && new URL(req.url()).origin !== origin) requests.push(req.url()); });
    await page.goto(target);
    await page.fill("#f_fullname", "Nomsa Dlamini");
    await page.fill("#f_phone", "0721112222");
    await page.fill("#f_skills", "Cooking, Sewing");
    await page.click('#tabs button[data-view="pack"]');
    await page.click("#openPdfPack");
    assert.equal(await page.locator("#pdfPackSave").isDisabled(), true);
    await page.click("#pdfPackAddVault");
    await page.waitForFunction(() => document.querySelector("#pdfPackStatus").textContent === t("files_pin_first"));
    const [chooser] = await Promise.all([page.waitForEvent("filechooser"), page.click("#pdfPackAddFiles")]);
    await chooser.setFiles([{name:"first.pdf",mimeType:"application/pdf",buffer:await pdfWithWidths([310,320])},
      {name:"second.pdf",mimeType:"application/pdf",buffer:await pdfWithWidths([410])},
      {name:"invalid.pdf",mimeType:"application/pdf",buffer:Buffer.from("not a PDF")}]);
    await page.waitForFunction(() => document.querySelectorAll(".pdf-pack-page").length === 3 && !document.querySelector("#pdfPackAddFiles").disabled);
    assert.match(await page.locator("#pdfPackStatus").innerText(), /invalid\.pdf/);
    await page.click("#pdfPackAddCV");
    await page.waitForFunction(() => document.querySelectorAll(".pdf-pack-page").length === 4 && !document.querySelector("#pdfPackAddCV").disabled, null, {timeout:60000});
    assert.match(await page.locator(".pdf-pack-page").nth(3).innerText(), /Pusha CV/);
    // Move the CV to the front and put page 2 ahead of page 1.
    for (let i = 3; i > 0; i--) await page.locator(".pdf-pack-page").nth(i).getByRole("button", {name:/Move up/}).click();
    await page.locator(".pdf-pack-page").nth(2).getByRole("button", {name:/Move up/}).click();
    // Remove second.pdf.
    await page.locator(".pdf-pack-page").nth(3).getByRole("button", {name:/Remove/}).click();
    const [download] = await Promise.all([page.waitForEvent("download"), page.click("#pdfPackSave")]);
    const result = await PDFDocument.load(fs.readFileSync(await download.path()));
    assert.equal(result.getPageCount(), 3);
    assert.deepEqual(result.getPages().map(p => Math.round(p.getWidth())), [595,320,310]);
    // The CV must actually contain an embedded image, not a blank PDF page.
    const images = result.context.enumerateIndirectObjects().map(([,obj]) => obj).filter(obj => obj instanceof PDFRawStream && obj.dict.get(PDFName.of("Subtype"))?.toString() === "/Image");
    assert(images.length > 0, "CV image missing");
    assert(images.some(img => img.contents.length > 5000), "CV image unexpectedly empty");
    assert.deepEqual(errors, []);
    assert.deepEqual(requests, []);
    assert.deepEqual(await page.evaluate(() => window.__cspErrors || []), []);
    await page.click("#pdfPackClose");
    await page.click("#openPdfPack");
    assert.equal(await page.locator(".pdf-pack-page").count(), 0, "temporary pages cleared on close");
    await page.setInputFiles("#pdfPackInput", {name:"locked.pdf",mimeType:"application/pdf",buffer:fs.readFileSync(require("path").join(__dirname,"fixtures/password-protected.pdf"))});
    await page.waitForFunction(() => document.querySelector("#pdfPackStatus").textContent.includes("locked.pdf"));
    assert.match(await page.locator("#pdfPackStatus").innerText(), /password-protected/);
    await page.setInputFiles("#pdfPackInput", {name:"large.pdf",mimeType:"application/pdf",buffer:Buffer.alloc(10 * 1024 * 1024 + 1)});
    await page.waitForFunction(() => document.querySelector("#pdfPackStatus").textContent.includes("10 MB"));
    await page.setInputFiles("#pdfPackInput", {name:"many.pdf",mimeType:"application/pdf",buffer:await pdfWithWidths(Array(101).fill(300))});
    await page.waitForFunction(() => document.querySelector("#pdfPackStatus").textContent.includes("100 pages"));
    assert.equal(await page.locator(".pdf-pack-page").count(), 0);
    // A long CV is split into separately reorderable pages rather than truncated.
    await page.evaluate(() => { vault.cvExtra = [{title:"Experience", text:Array(65).fill("A long line about my work and community volunteering experience.").join("\n")}]; });
    await page.click("#pdfPackAddCV");
    await page.waitForFunction(() => document.querySelectorAll(".pdf-pack-page").length > 1 && !document.querySelector("#pdfPackAddCV").disabled, null, {timeout:60000});
    const cvPages = await page.locator(".pdf-pack-page").count();
    const [longDownload] = await Promise.all([page.waitForEvent("download"), page.click("#pdfPackSave")]);
    assert.equal((await PDFDocument.load(fs.readFileSync(await longDownload.path()))).getPageCount(), cvPages);
    await page.click("#pdfPackClose");
    // A locked vault never exposes the CV or temporary pack.
    await page.evaluate(() => { locked = true; });
    await page.click("#openPdfPack");
    assert.equal(await page.locator("#pdfPackList").count(), 0);
    await context.close();

    // A PDF stored in the encrypted Vault can be added without a separate download.
    const vaultContext = await browser.newContext({viewport:{width:390,height:844}, acceptDownloads:true});
    const vp = await vaultContext.newPage();
    await vp.goto(target);
    await vp.click("#filesPin"); await vp.fill("#pin", "86423957"); await vp.fill("#pin2", "86423957");
    await vp.waitForFunction(() => !document.querySelector("#pinGo").disabled);
    await vp.click("#pinGo"); await vp.waitForFunction(() => !document.querySelector("#filesIn").disabled);
    await vp.setInputFiles("#filesIn", {name:"certificate.pdf",mimeType:"application/pdf",buffer:await pdfWithWidths([440])});
    await vp.waitForFunction(() => document.querySelectorAll("#filesList .local-file").length === 1);
    await vp.click('#tabs button[data-view="pack"]'); await vp.click("#openPdfPack");
    await vp.click("#pdfPackAddVault"); await vp.waitForSelector(".pdf-vault-file");
    assert.equal(await vp.locator(".pdf-vault-file").innerText(), "certificate.pdf");
    await vp.click(".pdf-vault-file"); await vp.waitForFunction(() => document.querySelectorAll(".pdf-pack-page").length === 1);
    const [vaultDownload] = await Promise.all([vp.waitForEvent("download"), vp.click("#pdfPackSave")]);
    assert.equal(Math.round((await PDFDocument.load(fs.readFileSync(await vaultDownload.path()))).getPage(0).getWidth()), 440);
    await vp.evaluate(() => lockNow());
    assert.equal(await vp.locator("#sheet").evaluate(el => el.classList.contains("on")), false);
    assert.equal(await vp.locator(".pdf-pack-page").count(), 0);
    await vaultContext.close();

    if (target.startsWith("http://127.0.0.1:8000/")) {
      const offline = await browser.newContext({viewport:{width:320,height:640},acceptDownloads:true});
      const p = await offline.newPage();
      await p.goto(target); await p.evaluate(() => navigator.serviceWorker.ready);
      await p.reload(); await p.waitForFunction(() => !!navigator.serviceWorker.controller);
      await offline.setOffline(true); await p.reload();
      await p.click('#tabs button[data-view="pack"]'); await p.click("#openPdfPack");
      await p.setInputFiles("#pdfPackInput", {name:"offline.pdf",mimeType:"application/pdf",buffer:await pdfWithWidths([300])});
      await p.waitForFunction(() => document.querySelectorAll(".pdf-pack-page").length === 1);
      await p.click("#pdfPackAddCV");
      await p.waitForFunction(() => document.querySelectorAll(".pdf-pack-page").length === 2 && !document.querySelector("#pdfPackAddCV").disabled, null, {timeout:60000});
      const [offDownload] = await Promise.all([p.waitForEvent("download"), p.click("#pdfPackSave")]);
      assert.equal((await PDFDocument.load(fs.readFileSync(await offDownload.path()))).getPageCount(), 2);
      assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "320px horizontal overflow");
      await offline.close();
    }
    console.log("PDF selection, encrypted Vault, errors, multipage CV, page order, download, privacy and cleanup passed.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
