/* Exercises the actual Netlify v2 handlers and @netlify/blobs client against a
   local fake Blob HTTP API. This is not a live Netlify deployment test. */
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import collect from '../netlify/functions/usage-collect.mjs';
import report from '../netlify/functions/usage-report.mjs';

test('v2 handlers use the configured Blob context and protect reports', async () => {
  const blobs = new Map();
  const server = http.createServer(async (req,res) => {
    const url = new URL(req.url, 'http://localhost');
    const prefix = '/test-site/site:pusha-usage';
    if (!url.pathname.startsWith(prefix) || req.headers.authorization !== 'Bearer local-test-token') { res.writeHead(403).end(); return; }
    const key = decodeURIComponent(url.pathname.slice(prefix.length + 1));
    if (req.method === 'PUT' && key){
      if (blobs.has(key) && req.headers['if-none-match'] === '*') { res.writeHead(412).end(); return; }
      blobs.set(key, ''); res.writeHead(200, {etag:'"test-etag"'}).end(); return;
    }
    if (req.method === 'GET' && !key){
      const filter = url.searchParams.get('prefix') || '';
      const list = [...blobs.keys()].filter(k=>k.startsWith(filter)).map(key=>({key,etag:'"test-etag"'}));
      res.writeHead(200, {'content-type':'application/json'}).end(JSON.stringify({blobs:list})); return;
    }
    res.writeHead(404).end();
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  const previous = {context:process.env.CONTEXT, key:process.env.PUSHA_ANALYTICS_KEY, blobs:globalThis.netlifyBlobsContext};
  const secret='test-only-secret-1234567890-abcdef';
  try {
    process.env.CONTEXT='production'; process.env.PUSHA_ANALYTICS_KEY=secret;
    globalThis.netlifyBlobsContext=Buffer.from(JSON.stringify({siteID:'test-site',token:'local-test-token',edgeURL:url,uncachedEdgeURL:url})).toString('base64');
    const body={id:'0123456789abcdef0123456789abcdef',day:new Date().toISOString().slice(0,10),counts:{open:1,pack:2}};
    const request = () => new Request('https://pusha.netlify.app/.netlify/functions/usage-collect', {method:'POST',headers:{origin:'https://pusha.netlify.app','content-type':'application/json'},body:JSON.stringify(body)});
    assert.equal((await collect(request())).status,200);
    assert.equal((await collect(request())).status,200);
    assert.equal(blobs.size,1);
    const get = key => new Request('https://pusha.netlify.app/.netlify/functions/usage-report', {headers:{authorization:'Bearer '+key}});
    assert.equal((await report(get('incorrect'))).status,401);
    const good = await report(get(secret)); assert.equal(good.status,200);
    const data = await good.json(); assert.equal(data.totals.open,1); assert.equal(data.totals.pack,2);
    process.env.CONTEXT='deploy-preview'; assert.equal((await collect(request())).status,503);
    process.env.CONTEXT='production'; delete process.env.PUSHA_ANALYTICS_KEY;
    assert.equal((await collect(request())).status,503);
  } finally {
    if (previous.context === undefined) delete process.env.CONTEXT; else process.env.CONTEXT=previous.context;
    if (previous.key === undefined) delete process.env.PUSHA_ANALYTICS_KEY; else process.env.PUSHA_ANALYTICS_KEY=previous.key;
    globalThis.netlifyBlobsContext=previous.blobs;
    await new Promise(resolve=>server.close(resolve));
  }
});
