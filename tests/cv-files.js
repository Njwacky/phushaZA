/* CV layouts and encrypted uploads in a real browser.
   Run: node tests/cv-files.js [http://localhost:8000/]
   Optional: PUSHA_CHROMIUM=/path/to/chromium */
const assert = require("assert");
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox"],
    ...(process.env.PUSHA_CHROMIUM ? { executablePath: process.env.PUSHA_CHROMIUM } : {})
  });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(process.argv[2] || "http://localhost:8000/");
    await page.fill("#f_fullname", "Nomsa Dlamini");
    await page.fill("#f_skills", "Cooking, Sewing");
    await page.click('#tabs button[data-view="pack"]');
    await page.click("#openCV");
    assert.equal(await page.locator("[data-cv-template]").count(), 3);
    for (const name of ["classic", "modern", "simple"]) {
      await page.click(`[data-cv-template="${name}"]`);
      assert.equal(await page.locator(`#cvDocument .cv-template-${name}`).count(), 1);
      assert.equal(await page.locator(`[data-cv-template="${name}"]`).getAttribute("aria-pressed"), "true");
      assert.match(await page.locator("#cvDocument").innerText(), /Nomsa Dlamini/);
      await page.evaluate(() => { window.print = () => {}; });
      await page.click("#printCV");
      assert.equal(await page.locator(`#printArea .cv-template-${name}`).count(), 1);
    }
    await page.reload();
    await page.click('#tabs button[data-view="pack"]');
    await page.click("#openCV");
    assert.equal(await page.locator("#cvDocument .cv-template-simple").count(), 1);
    await page.evaluate(() => closeSheet());
    await page.click('#tabs button[data-view="vault"]');
    assert.equal(await page.locator("#filesIn").isDisabled(), true);
    await page.click("#filesPin");
    await page.fill("#pin", "86423957");
    await page.fill("#pin2", "86423957");
    await page.waitForFunction(() => !document.querySelector("#pinGo").disabled);
    await page.click("#pinGo");
    await page.waitForFunction(() => !document.querySelector("#filesIn").disabled);
    await page.waitForFunction(() => document.querySelector("#filesStatus").textContent === t("files_empty"));
    assert.equal(await page.locator("#filesPin").isVisible(), false);
    assert.equal(await page.locator("#filesAddLabel").isVisible(), true);
    await page.setInputFiles("#filesIn", { name: "large.pdf", mimeType: "application/pdf", buffer: Buffer.alloc(10 * 1024 * 1024 + 1) });
    await page.waitForFunction(() => document.querySelector("#filesStatus").textContent === t("files_too_large"));
    // Exercise the FileReader fallback used by older mobile browsers.
    await page.evaluate(() => { Blob.prototype.arrayBuffer = undefined; });
    const [chooser] = await Promise.all([page.waitForEvent("filechooser"), page.locator("#filesAddLabel").click()]);
    await chooser.setFiles({ name: "certificate.txt", mimeType: "text/plain", buffer: Buffer.from("private certificate contents") });
    await page.waitForFunction(() => document.querySelectorAll("#filesList .local-file").length === 1);
    const encrypted = await page.evaluate(async () => {
      const records = await LocalDocuments.backupRecords();
      return records.length === 1 && !JSON.stringify(records).includes("certificate.txt") &&
        !atob(records[0].ciphertext).includes("private certificate contents");
    });
    assert.equal(encrypted, true);
    await page.reload();
    await page.click("#filesPin");
    await page.fill("#pin", "86423957");
    await page.click("#pinGo");
    await page.waitForFunction(() => document.querySelectorAll("#filesList .local-file").length === 1);
    const [download] = await Promise.all([page.waitForEvent("download"), page.locator("#filesList button").first().click()]);
    const fs = require("fs");
    assert.equal(fs.readFileSync(await download.path(), "utf8"), "private certificate contents");
    assert.deepEqual(errors, []);
    console.log("CV templates, print, persistence, PIN, upload, size error, encryption and download passed.");
    await context.close();
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
