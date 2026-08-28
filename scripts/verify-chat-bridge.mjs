/**
 * End-to-end verification of both chat proxy paths against a local fake pod.
 *
 * `run` expects a completed `npm run build`, starts the built app twice, and
 * verifies API-key and project-token authentication independently.
 */

import { spawn } from 'node:child_process';
import http from 'node:http';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';

const POD_PORT = Number(process.env.FAKE_POD_PORT || 3901);
const APP_PORT = Number(process.env.FAKE_APP_PORT || 3900);
const APP_URL = process.env.APP_URL || `http://127.0.0.1:${APP_PORT}`;
const API_KEY = process.env.MACHINA_API_KEY || 'test-api-key';
const PROJECT_TOKEN = process.env.MACHINA_PROJECT_TOKEN || 'test-project-token';
const AGENT = process.env.MACHINA_AGENT || 'test-agent';
const REPLY_CHUNKS = ['The Machina pod ', 'answered this ', 'through the bridge.'];
const API_KEY_HEADER = 'x-api-token';
const PROJECT_TOKEN_HEADER = 'x-project-token';

function ndjson(type, content, extra = {}) {
  return `${JSON.stringify({ type, content, metadata: extra, timestamp: Date.now() / 1000, chunk_index: 0 })}\n`;
}

function createFakePod() {
  const requests = [];
  const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/__seen') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(requests));
      return;
    }
    if (req.method === 'POST' && req.url === '/__reset') {
      requests.length = 0;
      res.writeHead(204).end();
      return;
    }
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
      let parsed = null;
      try {
        parsed = JSON.parse(body);
      } catch {
        // The assertions below report malformed input with the captured body.
      }
      requests.push({
        agent: decodeURIComponent(match[1]),
        authorization: req.headers.authorization || null,
        xApiToken: req.headers[API_KEY_HEADER] || null,
        xProjectToken: req.headers[PROJECT_TOKEN_HEADER] || null,
        body: parsed,
      });

      res.writeHead(200, {
        'content-type': 'application/x-ndjson',
        'x-task-id': 'fake-task-1',
      });
      res.write(ndjson('start', ''));
      for (const chunk of REPLY_CHUNKS) res.write(ndjson('content', chunk, { partial: true }));
      res.write(ndjson('done', '', { content: REPLY_CHUNKS.join(''), suggestions: [] }));
      res.end();
    });
  });
  return { requests, server };
}

async function listen(server) {
  server.listen(POD_PORT, '127.0.0.1');
  await once(server, 'listening');
}

async function close(server) {
  server.close();
  await once(server, 'close');
}

async function resetFakePod() {
  await fetch(`http://127.0.0.1:${POD_PORT}/__reset`, { method: 'POST' });
}

/**
 * The canonical machina-client-api contract: a pod API key travels as
 * X-Api-Token, a project JWT travels as X-Project-Token, and neither mode
 * ever sends an Authorization header — the middleware does not read it.
 */
function expectedAuth(mode) {
  return mode === 'project-token'
    ? { xApiToken: null, xProjectToken: PROJECT_TOKEN }
    : { xApiToken: API_KEY, xProjectToken: null };
}

function assertRequest(request, mode, failures) {
  const expected = expectedAuth(mode);
  if (request.xApiToken !== expected.xApiToken) {
    failures.push(
      `${mode}: X-Api-Token ${JSON.stringify(request.xApiToken)} != ${JSON.stringify(expected.xApiToken)}`
    );
  }
  if (request.xProjectToken !== expected.xProjectToken) {
    failures.push(
      `${mode}: X-Project-Token ${JSON.stringify(request.xProjectToken)} != ${JSON.stringify(expected.xProjectToken)}`
    );
  }
  if (request.authorization !== null) {
    failures.push(
      `${mode}: pod received an Authorization header ${JSON.stringify(request.authorization)}; project JWTs belong in X-Project-Token`
    );
  }
  if (request.agent !== AGENT) failures.push(`${mode}: pod received agent ${request.agent}`);

  const messages = request.body?.messages;
  const contextMessages = request.body?.['context-agent']?.messages;
  if (!Array.isArray(messages) || messages.at(-1)?.content !== 'Say hello through the pod.') {
    failures.push(`${mode}: pod saw messages ${JSON.stringify(messages)}`);
  }
  if (
    !Array.isArray(contextMessages) ||
    JSON.stringify(contextMessages) !== JSON.stringify(messages)
  ) {
    failures.push(`${mode}: request did not mirror messages under context-agent`);
  }
}

async function check(mode) {
  await resetFakePod();
  const message = { role: 'user', content: 'Say hello through the pod.' };
  const uiMessage = { role: 'user', parts: [{ type: 'text', text: message.content }] };

  const bridgeResponse = await fetch(`${APP_URL}/api/assistant/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages: [uiMessage] }),
  });
  if (!bridgeResponse.ok || !bridgeResponse.body) {
    throw new Error(
      `assistant chat answered ${bridgeResponse.status}: ${(await bridgeResponse.text()).slice(0, 300)}`
    );
  }
  const bridgeRaw = await bridgeResponse.text();
  const deltas = [
    ...bridgeRaw.matchAll(/"type":"text-delta"[^\n]*?"delta":"((?:[^"\\]|\\.)*)"/g),
  ].map((match) => JSON.parse(`"${match[1]}"`));

  const threadResponse = await fetch(
    `${APP_URL}/api/thread/stream?target=client-supplied-agent&type=agent`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: [message], 'context-agent': { messages: [message] } }),
    }
  );
  if (!threadResponse.ok || !threadResponse.body) {
    throw new Error(
      `thread stream answered ${threadResponse.status}: ${(await threadResponse.text()).slice(0, 300)}`
    );
  }
  const threadRaw = await threadResponse.text();

  const failures = [];
  const expectedReply = REPLY_CHUNKS.join('');
  if (deltas.join('') !== expectedReply) {
    failures.push(`${mode}: UI stream carried ${JSON.stringify(deltas.join(''))}`);
  }
  if (!bridgeRaw.includes('"type":"text-start"') || !bridgeRaw.includes('"type":"text-end"')) {
    failures.push(`${mode}: UI stream is missing text-start/text-end frames`);
  }
  for (const chunk of REPLY_CHUNKS) {
    if (!threadRaw.includes(JSON.stringify(chunk))) {
      failures.push(`${mode}: thread stream is missing ${JSON.stringify(chunk)}`);
    }
  }

  const requests = await (await fetch(`http://127.0.0.1:${POD_PORT}/__seen`)).json();
  if (!Array.isArray(requests) || requests.length !== 2) {
    failures.push(`${mode}: fake pod received ${requests?.length ?? 'invalid'} stream requests`);
  } else {
    for (const request of requests) assertRequest(request, mode, failures);
  }

  if (failures.length > 0) throw new Error(failures.join('\n  - '));
  console.log(`PASS: ${mode} authenticates both chat proxy paths correctly`);
}

function startApp(mode) {
  const env = { ...process.env };
  delete env.MACHINA_API_KEY;
  delete env.MACHINA_PROJECT_TOKEN;
  Object.assign(env, {
    MACHINA_API_URL: `http://127.0.0.1:${POD_PORT}`,
    MACHINA_AGENT: AGENT,
    PORT: String(APP_PORT),
  });
  if (mode === 'project-token') env.MACHINA_PROJECT_TOKEN = PROJECT_TOKEN;
  else env.MACHINA_API_KEY = API_KEY;

  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const child = spawn(
    command,
    ['run', 'start', '--', '--hostname', '127.0.0.1', '--port', String(APP_PORT)],
    { env, detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'] }
  );
  let output = '';
  const capture = (chunk) => {
    output = `${output}${chunk}`.slice(-12000);
  };
  child.stdout.on('data', capture);
  child.stderr.on('data', capture);
  return { child, getOutput: () => output };
}

async function waitForApp(processInfo) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (processInfo.child.exitCode !== null) {
      throw new Error(`Next.js exited before becoming ready:\n${processInfo.getOutput()}`);
    }
    try {
      const response = await fetch(`${APP_URL}/api/health`);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await delay(250);
  }
  throw new Error(`Next.js did not become ready:\n${processInfo.getOutput()}`);
}

async function stopApp(child) {
  if (child.exitCode !== null) return;
  if (process.platform === 'win32') child.kill('SIGTERM');
  else process.kill(-child.pid, 'SIGTERM');
  await Promise.race([once(child, 'exit'), delay(5000)]);
  if (child.exitCode === null) {
    if (process.platform === 'win32') child.kill('SIGKILL');
    else process.kill(-child.pid, 'SIGKILL');
    await once(child, 'exit');
  }
}

async function run() {
  const { server } = createFakePod();
  await listen(server);
  try {
    for (const mode of ['api-key', 'project-token']) {
      const processInfo = startApp(mode);
      try {
        await waitForApp(processInfo);
        await check(mode);
      } finally {
        await stopApp(processInfo.child);
      }
    }
  } finally {
    await close(server);
  }
  console.log('PASS: chat round-trips the fake pod with both credential types');
}

const mode = process.argv[2] || 'run';
if (mode === 'serve') {
  const { server } = createFakePod();
  await listen(server);
  console.log(`fake pod listening on http://127.0.0.1:${POD_PORT}`);
} else if (mode === 'check') {
  await check(process.env.EXPECTED_AUTH_MODE || 'api-key');
} else if (mode === 'run') {
  await run();
} else {
  console.error('usage: node scripts/verify-chat-bridge.mjs [run|serve|check]');
  process.exitCode = 2;
}
