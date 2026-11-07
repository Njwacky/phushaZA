/* Run with Playwright and pdf-lib installed: node tests/pdf-pack-duplicates.js [URL].
   Optional: PUSHA_CHROMIUM=/path/to/chromium */
const assert = require("assert");
const fs = require("fs");
const { chromium } = require("playwright");
const { PDFDocument } = require("pdf-lib");

async function makePdf(widths){
  const doc = await PDFDocument.create();
  widths.forEach(width => doc.addPage([width, 500]));
  return Buffer.from(await doc.save());
}
const upload = (name, buffer) => ({ name, mimeType:"application/pdf", buffer });

(async () => {
  const browser = await chromium.launch({ args:["--no-sandbox"], ...(process.env.PUSHA_CHROMIUM ? {executablePath:process.env.PUSHA_CHROMIUM} : {}) });
  try {
    const ctx = await browser.newContext({ viewport:{width:390,height:844}, acceptDownloads:true });
    const p = await ctx.newPage(), errors = [];
    p.on("pageerror", e => errors.push(e.message));
    const target = process.argv[2] || "http://127.0.0.1:8000/";
    const a = await makePdf([300, 310]), b = await makePdf([400]);
    await p.goto(target);
    await p.click("#filesPin"); await p.fill("#pin", "86423957"); await p.fill("#pin2", "86423957");
    await p.waitForFunction(() => !document.querySelector("#pinGo").disabled);
    await p.click("#pinGo"); await p.waitForFunction(() => !document.querySelector("#filesIn").disabled);
    await p.setInputFiles("#filesIn", [upload("certificate.pdf", a), upload("other.pdf", b), upload("broken.pdf", Buffer.from("bad pdf"))]);
    await p.waitForFunction(() => document.querySelectorAll("#filesList .local-file").length === 3);
    await p.click('#tabs button[data-view="pack"]'); await p.click("#openPdfPack");
    await p.click("#pdfPackAddVault"); await p.waitForFunction(() => document.querySelectorAll(".pdf-vault-file").length === 3);
    await p.getByRole("button", {name:"certificate.pdf", exact:true}).click();
    await p.waitForFunction(() => document.querySelectorAll(".pdf-pack-page").length === 2 && !document.querySelector("#pdfPackAddVault").disabled);
    assert.equal(await p.getByRole("button", {name:"certificate.pdf", exact:true}).count(), 0, "selected Vault file hidden immediately");
    assert.equal(await p.getByRole("button", {name:"other.pdf", exact:true}).count(), 1, "other files stay available");
    await p.click("#pdfPackAddVault");
    await p.waitForFunction(() => !document.querySelector("#pdfPackAddVault").disabled);
    assert.equal(await p.getByRole("button", {name:"certificate.pdf", exact:true}).count(), 0, "selected file stays hidden when reopened");

    await p.getByRole("button", {name:"broken.pdf", exact:true}).click();
    await p.waitForFunction(() => document.querySelector("#pdfPackStatus").textContent.includes("broken.pdf") && !document.querySelector("#pdfPackAddVault").disabled);
    assert.equal(await p.getByRole("button", {name:"broken.pdf", exact:true}).count(), 1, "failed upload remains selectable");
    await p.setInputFiles("#pdfPackInput", upload("renamed.pdf", a));
    await p.waitForFunction(() => document.querySelector("#pdfPackStatus").textContent.includes("already in your pack"));
    assert.equal(await p.locator(".pdf-pack-page").count(), 2, "Vault to device duplicate refused");

    await p.locator(".pdf-pack-page").first().getByRole("button", {name:/Remove/}).click();
    assert.equal(await p.getByRole("button", {name:"certificate.pdf", exact:true}).count(), 0, "file remains hidden while one page remains");
    await p.locator(".pdf-pack-page").first().getByRole("button", {name:/Remove/}).click();
    assert.equal(await p.getByRole("button", {name:"certificate.pdf", exact:true}).count(), 1, "file available after last page removed");
    await p.getByRole("button", {name:"certificate.pdf", exact:true}).click();
    await p.waitForFunction(() => document.querySelectorAll(".pdf-pack-page").length === 2 && !document.querySelector("#pdfPackAddVault").disabled);
    const [download] = await Promise.all([p.waitForEvent("download"), p.click("#pdfPackSave")]);
    assert.deepEqual((await PDFDocument.load(fs.readFileSync(await download.path()))).getPages().map(x => x.getWidth()), [300,310]);
    assert.equal(await p.locator("#filesList .local-file").count(), 3, "Vault files were not deleted");

    // Starting a new pack clears selections. Identical content is rejected across
    // device and Vault; same name with different contents is not a duplicate.
    await p.click("#pdfPackClose"); await p.click("#openPdfPack");
    await p.setInputFiles("#pdfPackInput", [upload("same.pdf", a), upload("same.pdf", b), upload("copy.pdf", a)]);
    await p.waitForFunction(() => !document.querySelector("#pdfPackAddFiles").disabled && document.querySelector("#pdfPackStatus").textContent.includes("already in your pack"));
    assert.equal(await p.locator(".pdf-pack-page").count(), 3, "same content rejected but different PDF with same name accepted");
    await p.click("#pdfPackAddVault"); await p.waitForSelector(".pdf-vault-file");
    await p.getByRole("button", {name:"certificate.pdf", exact:true}).click();
    await p.waitForFunction(() => document.querySelector("#pdfPackStatus").textContent.includes("already in your pack") && !document.querySelector("#pdfPackAddVault").disabled);
    assert.equal(await p.locator(".pdf-pack-page").count(), 3, "device to Vault duplicate refused");
    assert.equal(await p.getByRole("button", {name:"certificate.pdf", exact:true}).count(), 0, "matching Vault choice now hidden");
    await p.click("#pdfPackClose"); await p.click("#openPdfPack"); await p.click("#pdfPackAddVault");
    await p.waitForSelector(".pdf-vault-file");
    assert.equal(await p.getByRole("button", {name:"certificate.pdf", exact:true}).count(), 1, "new pack starts fresh");
    assert.deepEqual(errors, []);
    console.log("Vault choice visibility, partial/full removal, failed uploads, duplicate detection and pack reset passed.");
    await ctx.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
