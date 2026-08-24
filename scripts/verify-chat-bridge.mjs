/**
 * End-to-end check of the chat bridge without a live pod.
 *
 * Spins a local stand-in for the Machina pod that speaks the EXACT NDJSON
 * contract of client-api's `/agent/stream/{agent}` (lines shaped
 * `{type, content, metadata, timestamp, chunk_index}` — see client-api
 * core/system/redis_stream.py), then drives the app's /api/assistant/chat
 * route and asserts the UI-message-stream that comes out carries the pod's
 * words. Run it against a dev server started with MACHINA_API_URL pointing
 * at this stand-in:
 *
 *   node scripts/verify-chat-bridge.mjs serve          # terminal 1 (port 3901)
 *   MACHINA_API_URL=http://127.0.0.1:3901 MACHINA_API_KEY=test-key npm run dev
 *   node scripts/verify-chat-bridge.mjs check          # terminal 3
 *
 * `check` exits non-zero unless the bridge streamed the expected text and
 * the stand-in received the X-Api-Token and the message history.
 */

import http from 'node:http';

const POD_PORT = Number(process.env.FAKE_POD_PORT || 3901);
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const EXPECTED_TOKEN = process.env.MACHINA_API_KEY || 'test-key';
const REPLY_CHUNKS = ['The Machina pod ', 'answered this ', 'through the bridge.'];

function ndjson(type, content, extra = {}) {
  return `${JSON.stringify({ type, content, metadata: extra, timestamp: Date.now() / 1000, chunk_index: 0 })}\n`;
}

function serve() {
  const seen = { token: null, agent: null, messages: null };
  const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/__seen') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(seen));
      return;
    }
    // The sidebar also lists agents/workflows on load; answer them empty so
    // a manual demo against this stand-in has a clean console.
    if (req.method === 'POST' && /^\/(agent|workflow)\/search$/.test(req.url || '')) {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ status: true, data: [] }));
      return;
    }
    const match = /^\/agent\/stream\/(.+)$/.exec(req.url || '');
    if (req.method !== 'POST' || !match) {
      res.writeHead(404).end();
      return;
    }
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      seen.token = req.headers['x-api-token'] || null;
      seen.agent = decodeURIComponent(match[1]);
      try {
        seen.messages = JSON.parse(body).messages;
      } catch {
        seen.messages = null;
      }
      if (seen.token !== EXPECTED_TOKEN) {
        res.writeHead(401, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ status: 401, message: 'bad token' }));
        return;
      }
      res.writeHead(200, { 'content-type': 'application/x-ndjson', 'x-task-id': 'fake-task-1' });
      res.write(ndjson('start', ''));
      for (const chunk of REPLY_CHUNKS) res.write(ndjson('content', chunk, { partial: true }));
      res.write(ndjson('done', REPLY_CHUNKS.join('')));
      res.end();
    });
  });
  server.listen(POD_PORT, () => console.log(`fake pod listening on http://127.0.0.1:${POD_PORT}`));
}

async function check() {
  const response = await fetch(`${APP_URL}/api/assistant/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', parts: [{ type: 'text', text: 'Say hello through the pod.' }] }],
    }),
  });
  if (!response.ok || !response.body) {
    console.error(
      `FAIL: chat route answered ${response.status}: ${(await response.text()).slice(0, 300)}`
    );
    process.exit(1);
  }
  const raw = await response.text();
  const deltas = [...raw.matchAll(/"type":"text-delta"[^\n]*?"delta":"((?:[^"\\]|\\.)*)"/g)].map(
    (m) => JSON.parse(`"${m[1]}"`)
  );
  const streamed = deltas.join('');
  const expected = REPLY_CHUNKS.join('');
  const failures = [];
  if (streamed !== expected)
    failures.push(`streamed text ${JSON.stringify(streamed)} != ${JSON.stringify(expected)}`);
  if (!raw.includes('"type":"text-start"') || !raw.includes('"type":"text-end"')) {
    failures.push('missing text-start/text-end frames');
  }
  const seen = await (await fetch(`http://127.0.0.1:${POD_PORT}/__seen`)).json();
  if (seen.token !== EXPECTED_TOKEN) failures.push(`pod saw token ${JSON.stringify(seen.token)}`);
  if (
    !Array.isArray(seen.messages) ||
    seen.messages.at(-1)?.content !== 'Say hello through the pod.'
  ) {
    failures.push(`pod saw messages ${JSON.stringify(seen.messages)}`);
  }
  if (failures.length > 0) {
    console.error('FAIL:\n  - ' + failures.join('\n  - '));
    process.exit(1);
  }
  console.log('PASS: chat round-trips the pod contract');
  console.log(
    `  pod received agent=${seen.agent} messages=${seen.messages.length} with X-Api-Token`
  );
  console.log(`  UI stream carried: ${JSON.stringify(streamed)}`);
}

const mode = process.argv[2];
if (mode === 'serve') serve();
else if (mode === 'check') check();
else {
  console.error('usage: node scripts/verify-chat-bridge.mjs serve|check');
  process.exit(2);
}
