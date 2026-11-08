import { getStore } from '@netlify/blobs';
import core from './lib/usage-core.js';
const { collect, response } = core;
function toResponse(result){ return new Response(result.body, {status:result.statusCode, headers:result.headers}); }
export default async request => {
  if ((process.env.CONTEXT && process.env.CONTEXT !== 'production') || !process.env.PUSHA_ANALYTICS_KEY || process.env.PUSHA_ANALYTICS_KEY.length < 24) return toResponse(response(503, {error:'not configured'}));
  try {
    const headers = Object.fromEntries(request.headers);
    headers.host = new URL(request.url).host;
    let body = '';
    if (request.body) {
      const reader = request.body.getReader(), decoder = new TextDecoder(); let bytes = 0;
      while (true) {
        const {done,value} = await reader.read(); if (done) break;
        bytes += value.byteLength;
        if (bytes > 2048) { await reader.cancel(); return toResponse(response(400, {error:'body'})); }
        body += decoder.decode(value, {stream:true});
      }
      body += decoder.decode();
    }
    const event = {httpMethod:request.method, headers, body};
    return toResponse(await collect(event, getStore({name:'pusha-usage', consistency:'strong'})));
  } catch (_) { return toResponse(response(503, {error:'unavailable'})); }
};
