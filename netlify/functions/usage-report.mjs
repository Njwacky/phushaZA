import { getStore } from '@netlify/blobs';
import core from './lib/usage-core.js';
const { report, response } = core;
function toResponse(result){ return new Response(result.body, {status:result.statusCode, headers:result.headers}); }
export default async request => {
  if ((process.env.CONTEXT && process.env.CONTEXT !== 'production') || !process.env.PUSHA_ANALYTICS_KEY || process.env.PUSHA_ANALYTICS_KEY.length < 24) return toResponse(response(503, {error:'not configured'}));
  try {
    const event = {httpMethod:request.method, headers:Object.fromEntries(request.headers)};
    return toResponse(await report(event, getStore({name:'pusha-usage', consistency:'strong'}), process.env.PUSHA_ANALYTICS_KEY));
  } catch (_) { return toResponse(response(503, {error:'unavailable'})); }
};
