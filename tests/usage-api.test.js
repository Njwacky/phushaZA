const test = require('node:test');
const assert = require('node:assert/strict');
const {collect, report, TYPES, validKey} = require('../netlify/functions/lib/usage-core');
const now = Date.parse('2026-11-08T10:00:00Z');
const secret = 'this-is-a-very-long-test-only-secret';
function store(){
  const data = new Map();
  return { data, async set(key, value, options){ assert.equal(options.onlyIfNew, true); if (!data.has(key)) data.set(key, value); },
    list({prefix}){ return {async *[Symbol.asyncIterator](){ yield {blobs:[...data.keys()].filter(k => k.startsWith(prefix)).map(key => ({key}))}; }}; } };
}
const event = data => ({httpMethod:'POST', headers:{host:'pusha.netlify.app',origin:'https://pusha.netlify.app','content-type':'application/json'}, body:JSON.stringify(data)});
const sample = () => ({id:'0123456789abcdef0123456789abcdef', day:'2026-11-08', counts:{open:2,ideas:3,cv_print:1,pdf_download:1}});
const owner = key => ({httpMethod:'GET', headers:{authorization:'Bearer ' + key}});

test('accepts only allowlisted aggregate counts and retries are idempotent', async () => {
  const db=store(), e=event(sample());
  assert.equal((await collect(e,db,now)).statusCode,200);
  assert.equal((await collect(e,db,now)).statusCode,200);
  assert.equal(db.data.size,1);
  const reportResult = await report(owner(secret),db,secret,now);
  assert.equal(reportResult.statusCode,200);
  const data=JSON.parse(reportResult.body);
  assert.equal(data.totals.open,2); assert.equal(data.totals.ideas,3);
  assert.equal(data.totals.cv_print,1); assert.equal(data.totals.pdf_download,1);
  assert.equal(data.partial,false);
  assert.equal(db.data.values().next().value,'');
});

test('rejects identifying fields, invented actions, invalid dates and oversized counts', async () => {
  const db=store();
  for (const modify of [
    b=>b.name='Nomsa', b=>b.counts.id_number=123, b=>b.counts.open=-1,
    b=>b.counts.open=101, b=>b.counts={open:0}, b=>b.day='2026-11-01x',
    b=>b.day='2026-10-01', b=>b.day='2026-11-12', b=>b.id='user-123',
    b=>b.counts=[1], b=>b.counts.open='2', b=>b.counts.open=1.5
  ]) { const b=sample(); modify(b); assert.equal((await collect(event(b),db,now)).statusCode,400); }
  assert.equal(db.data.size,0);
});

test('requires same HTTPS origin, correct method and bounded JSON body', async () => {
  const db=store(), e=event(sample());
  assert.equal((await collect({...e,headers:{...e.headers,origin:'https://other.example'}},db,now)).statusCode,403);
  assert.equal((await collect({...e,headers:{...e.headers,origin:'http://pusha.netlify.app'}},db,now)).statusCode,403);
  assert.equal((await collect({...e,headers:{...e.headers,origin:''}},db,now)).statusCode,403);
  assert.equal((await collect({...e,httpMethod:'GET'},db,now)).statusCode,405);
  assert.equal((await collect({...e,headers:{...e.headers,'content-type':'text/plain'}},db,now)).statusCode,415);
  assert.equal((await collect({...e,body:'x'.repeat(2049)},db,now)).statusCode,400);
  assert.equal((await collect({...e,body:'{'},db,now)).statusCode,400);
  assert.equal(db.data.size,0);
});

test('report requires a strong key and returns only last 30 days', async () => {
  const db=store(), b=sample();
  await collect(event(b),db,now);
  assert.equal(validKey('short','Bearer short'),false);
  assert.equal((await report(owner('bad'),db,secret,now)).statusCode,401);
  assert.equal((await report(owner(secret),db,'short',now)).statusCode,401);
  assert.equal((await report({...owner(secret),httpMethod:'POST'},db,secret,now)).statusCode,405);
  db.data.set('v1/2026-10-01/0123456789abcdef0123456789abcdef/1-0-0-0-0-0-0-0','');
  const result=JSON.parse((await report(owner(secret),db,secret,now)).body);
  assert.equal(result.totals.open,2);
  assert.deepEqual(Object.keys(result.totals),TYPES);
});
