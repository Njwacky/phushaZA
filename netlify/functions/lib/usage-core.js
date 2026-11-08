/* Aggregate-only usage collector. No personal fields, URLs, IPs or user IDs. */
const { timingSafeEqual } = require('node:crypto');
const TYPES = ['open', 'vault', 'pack', 'ideas', 'money', 'path', 'cv_print', 'pdf_download'];
const MAX_PER_BATCH = 100;
const MAX_AGE_DAYS = 7;
const DAY_MS = 86400000;
const headers = { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff' };
const response = (statusCode, body) => ({ statusCode, headers, body:JSON.stringify(body) });
function today(date){ return new Date(date).toISOString().slice(0, 10); }
function isDate(day){
  if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const value = new Date(day + 'T00:00:00Z');
  return !isNaN(value.getTime()) && value.toISOString().slice(0, 10) === day;
}
function validKey(secret, auth){
  if (typeof secret !== 'string' || secret.length < 24 || typeof auth !== 'string' || !auth.startsWith('Bearer ')) return false;
  const a = Buffer.from(secret), b = Buffer.from(auth.slice(7));
  return a.length === b.length && timingSafeEqual(a, b);
}
function readHeader(event, name){
  const entries = Object.entries(event.headers || {});
  return (entries.find(([key]) => key.toLowerCase() === name.toLowerCase()) || [])[1] || '';
}
async function collect(event, store, now = Date.now()){
  if (event.httpMethod !== 'POST') return response(405, { error:'method' });
  const contentType = readHeader(event, 'content-type').split(';')[0].trim().toLowerCase();
  if (contentType !== 'application/json') return response(415, { error:'content-type' });
  // Only accept requests initiated from this deployment's origin. This is not
  // authentication or rate limiting: public counters can still be forged.
  const origin = readHeader(event, 'origin'), host = readHeader(event, 'host');
  try { if (!origin || !host || new URL(origin).host !== host || new URL(origin).protocol !== 'https:') return response(403, {error:'origin'}); }
  catch (_) { return response(403, {error:'origin'}); }
  if (event.isBase64Encoded || typeof event.body !== 'string' || Buffer.byteLength(event.body) > 2048) return response(400, { error:'body' });
  let batch;
  try { batch = JSON.parse(event.body); } catch (_) { return response(400, { error:'json' }); }
  if (!batch || typeof batch !== 'object' || Array.isArray(batch) || Object.keys(batch).sort().join(',') !== 'counts,day,id') return response(400, {error:'fields'});
  if (typeof batch.id !== 'string' || !/^[a-f0-9]{32}$/.test(batch.id) || !isDate(batch.day)) return response(400, {error:'fields'});
  const delta = (Date.parse(today(now)) - Date.parse(batch.day)) / DAY_MS;
  if (delta < -1 || delta > MAX_AGE_DAYS) return response(400, {error:'date'});
  if (!batch.counts || typeof batch.counts !== 'object' || Array.isArray(batch.counts) || Object.keys(batch.counts).some(key => !TYPES.includes(key))) return response(400, {error:'counts'});
  const counts = TYPES.map(type => batch.counts[type] === undefined ? 0 : batch.counts[type]);
  if (counts.some(n => !Number.isInteger(n) || n < 0 || n > MAX_PER_BATCH) || counts.reduce((a,b) => a+b, 0) < 1 || counts.reduce((a,b) => a+b, 0) > MAX_PER_BATCH) return response(400, {error:'counts'});
  // Day and counters in the key let the owner count keys without reading data.
  // The random ID identifies a batch, never a person; retries are idempotent.
  const key = `v1/${batch.day}/${batch.id}/${counts.join('-')}`;
  await store.set(key, '', {onlyIfNew:true});
  return response(200, {ok:true});
}
async function report(event, store, secret, now = Date.now()){
  if (event.httpMethod !== 'GET') return response(405, {error:'method'});
  if (!validKey(secret, readHeader(event, 'authorization'))) return response(401, {error:'unauthorized'});
  const totals = Object.fromEntries(TYPES.map(type => [type, 0]));
  const days = {};
  const start = Date.parse(today(now)) - 29 * DAY_MS;
  let scanned = 0;
  // Bounded to prevent an unbounded report causing timeouts/costs. Clearly
  // report partial results; users can export/aggregate data if the app grows.
  const LIMIT = 50000;
  for (let n = 0; n < 30; n++){
    const day = today(start + n * DAY_MS);
    for await (const page of store.list({prefix:`v1/${day}/`, paginate:true})){
      for (const blob of page.blobs){
        if (scanned >= LIMIT) return response(200, {totals, days, partial:true, scanned, period:'last 30 days, UTC'});
        const match = /^v1\/(\d{4}-\d{2}-\d{2})\/[a-f0-9]{32}\/(\d+(?:-\d+){7})$/.exec(blob.key);
        if (!match || match[1] !== day) continue;
        const values = match[2].split('-').map(Number);
        if (values.some(value => !Number.isSafeInteger(value) || value > MAX_PER_BATCH) || values.reduce((a,b) => a+b, 0) > MAX_PER_BATCH) continue;
        if (!days[day]) days[day] = Object.fromEntries(TYPES.map(type => [type, 0]));
        TYPES.forEach((type, i) => { totals[type] += values[i]; days[day][type] += values[i]; });
        scanned++;
      }
    }
  }
  return response(200, {totals, days, partial:false, scanned, period:'last 30 days, UTC'});
}
module.exports = { TYPES, collect, report, validKey, response };
