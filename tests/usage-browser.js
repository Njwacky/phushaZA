/* Usage consent and offline queue. Requires playwright and pdf-lib.
   node tests/usage-browser.js [http://127.0.0.1:8000/]
   Optional: PUSHA_CHROMIUM=/path/to/chromium */
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { PDFDocument } = require('pdf-lib');
(async () => {
  const browser = await chromium.launch({args:['--no-sandbox'], ...(process.env.PUSHA_CHROMIUM ? {executablePath:process.env.PUSHA_CHROMIUM} : {})});
  const target = process.argv[2] || 'http://127.0.0.1:8000/';
  try {
    const ctx = await browser.newContext({viewport:{width:390,height:844}, acceptDownloads:true});
    const page = await ctx.newPage(); const errors=[], batches=[]; let failNext=false;
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/.netlify/functions/usage-collect', async route => {
      batches.push(JSON.parse(route.request().postData()));
      if (failNext) { failNext=false; return route.fulfill({status:503, body:'unavailable'}); }
      return route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});
    });
    await page.goto(target); await page.waitForTimeout(300);
    assert.equal(await page.locator('#usageChoice').isVisible(), true);
    await page.fill('#f_fullname','PRIVATE PERSON');
    await page.fill('#f_id','1234567890123');
    await page.click('#tabs button[data-view="ideas"]');
    await page.click('#tabs button[data-view="pack"]');
    assert.equal(batches.length, 0, 'no analytics before consent');
    assert.equal(await page.evaluate(() => localStorage.getItem('usage_queue_v1')), null);
    await page.click('#tabs button[data-view="vault"]');
    await page.locator('#usageChoice button').first().click();
    assert.equal(await page.evaluate(() => localStorage.getItem('usage_choice_v1')), 'on');
    assert.equal(await page.evaluate(() => bkKeys().some(key => key === 'usage_choice_v1' || key === 'usage_queue_v1')), false, 'choice and queue excluded from backups');
    assert.equal(await page.locator('#usageChoice').isVisible(), false);
    await page.click('#tabs button[data-view="ideas"]');
    await page.click('#tabs button[data-view="pack"]');
    await page.click('#openCV'); await page.evaluate(() => { window.print = () => {}; });
    await page.click('#printCV'); await page.evaluate(() => closeSheet());
    await page.click('#openPdfPack');
    const pdf=await PDFDocument.create(); pdf.addPage([300,500]);
    await page.setInputFiles('#pdfPackInput',{name:'private-certificate.pdf',mimeType:'application/pdf',buffer:Buffer.from(await pdf.save())});
    await page.waitForFunction(() => document.querySelectorAll('.pdf-pack-page').length===1);
    await Promise.all([page.waitForEvent('download'),page.click('#pdfPackSave')]);
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    await page.waitForFunction(() => { const s=JSON.parse(localStorage.getItem('usage_queue_v1')||'{}'); return !s.pending && (!s.events || !s.events.length); }, null, {timeout:15000});
    assert(batches.length>=1);
    const counts = {};
    for (const batch of batches){
      assert.deepEqual(Object.keys(batch).sort(), ['counts','day','id']);
      assert.match(batch.id,/^[a-f0-9]{32}$/);
      assert(!JSON.stringify(batch).includes('PRIVATE') && !JSON.stringify(batch).includes('1234567890123') && !JSON.stringify(batch).includes('certificate'));
      for (const [k,v] of Object.entries(batch.counts)) counts[k]=(counts[k]||0)+v;
    }
    assert.equal(counts.open,1); assert.equal(counts.ideas,1); assert.equal(counts.pack,1);
    assert.equal(counts.cv_print,1); assert.equal(counts.pdf_download,1);

    // Network errors retain exactly the same pending batch for an idempotent retry.
    await page.evaluate(() => closeSheet());
    failNext=true; await page.click('#tabs button[data-view="money"]');
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    await page.waitForFunction(() => !!JSON.parse(localStorage.getItem('usage_queue_v1')||'{}').pending);
    await page.waitForTimeout(300);
    const failed = batches[batches.length-1];
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    await page.waitForFunction(() => { const s=JSON.parse(localStorage.getItem('usage_queue_v1')||'{}'); return !s.pending && (!s.events || !s.events.length); });
    assert.deepEqual(batches[batches.length-1], failed, 'retry retains batch ID and counts');

    // Offline events stay local and opting out discards them without sending.
    await ctx.setOffline(true);
    const before=batches.length;
    await page.click('#tabs button[data-view="path"]');
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('usage_queue_v1')).events.length),1);
    await page.click('#usageSettings');
    await page.getByRole('button',{name:'Turn off'}).click();
    assert.equal(await page.evaluate(() => localStorage.getItem('usage_choice_v1')), 'off');
    assert.equal(await page.evaluate(() => localStorage.getItem('usage_queue_v1')), null);
    await ctx.setOffline(false); await page.evaluate(() => window.dispatchEvent(new Event('online'))); await page.waitForTimeout(300);
    assert.equal(batches.length,before,'opting out did not send queued events');
    await page.reload(); await page.waitForTimeout(200);
    assert.equal(await page.locator('#usageChoice').isVisible(),false);
    assert.equal(batches.length,before,'no event on reload after opt-out');
    assert.deepEqual(errors,[]);

    // Visiting the owner page must not replace the offline app's cached index.
    await page.evaluate(() => navigator.serviceWorker.ready); await page.reload();
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    let reportCalls = [];
    await page.route('**/.netlify/functions/usage-report', async route => {
      reportCalls.push({url:route.request().url(), auth:route.request().headers().authorization});
      if (reportCalls.length === 1) return route.fulfill({status:401,body:'{}'});
      return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({partial:true,totals:{open:7,pack:4,cv_print:2,pdf_download:3}})});
    });
    await page.goto(new URL('usage.html',target).href);
    const cached=await page.evaluate(async () => {const r=await caches.match('index.html');return r && r.text();});
    assert(cached.includes('id="v-vault"') && !cached.includes('Pusha usage totals'));
    await page.fill('#key','wrong-key'); await page.click('#login button');
    await page.waitForFunction(() => document.querySelector('#message').textContent.includes('not accepted'));
    await page.fill('#key','test-only-owner-secret'); await page.click('#login button');
    await page.waitForFunction(() => !document.querySelector('#results').hidden);
    assert.equal(await page.locator('.metric').first().innerText(), '7\nApp opens');
    assert((await page.locator('#message').innerText()).includes('Partial results'));
    assert.equal(await page.locator('#key').inputValue(), '');
    assert.equal(reportCalls[1].auth,'Bearer test-only-owner-secret');
    assert(!reportCalls[1].url.includes('secret'));
    assert.equal(await page.evaluate(() => caches.match('/.netlify/functions/usage-report').then(r => !!r)),false,'private report is never cached by the service worker');
    assert(!JSON.stringify(await page.evaluate(() => ({...localStorage}))).includes('test-only-owner-secret'));
    await ctx.close();

    // The distributed standalone never displays consent or sends usage events.
    const fileCtx=await browser.newContext(); const file=await fileCtx.newPage(); const fileErrors=[];
    file.on('pageerror',e=>fileErrors.push(e.message));
    await file.goto('file://' + require('path').resolve(__dirname,'../app/pusha-standalone.html'));
    assert.equal(await file.locator('#usageChoice').isVisible(),false);
    assert.equal(await file.locator('#usageSettings').isVisible(),false);
    assert.equal(await file.evaluate(() => document.documentElement.hasAttribute('data-standalone')),true);
    assert.deepEqual(fileErrors,[]); await fileCtx.close();
    console.log('Consent, private counts, actions, retry, opt-out, standalone and offline shell passed.');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e); process.exitCode=1;});
