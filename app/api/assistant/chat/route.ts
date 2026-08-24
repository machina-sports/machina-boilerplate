/**
 * API Route: /api/assistant/chat
 *
 * The bridge between the shipped chat UI and the Machina pod — the single
 * reason this boilerplate exists.
 *
 * The UI speaks the AI SDK UI-message-stream protocol (assistant-ui's
 * AssistantChatTransport, hooks/runtime.tsx). The pod speaks NDJSON from
 * `POST /agent/stream/{agent}` (client-api): lines shaped
 * `{type, content, metadata, timestamp, chunk_index}` with `type` in
 * start | workflow_* | content | done | error. This route translates one
 * into the other, so the scaffold's chat round-trips through the Machina
 * backend with nothing but the MACHINA_* variables in `.env.local`.
 *
 * Two deliberate choices:
 * - The agent is chosen by the SERVER (`MACHINA_AGENT`), never by the
 *   client payload — a browser must not be able to point the chat at an
 *   arbitrary agent on the pod.
 * - The pod credential stays server-side (`MACHINA_API_KEY`, sent as
 *   X-Api-Token). Nothing NEXT_PUBLIC_ is involved in the chat path.
 *
 * This route previously called a hosted LLM directly, which silently
 * required a provider key the template never declared — and meant the
 * "Machina AI app" chat never touched the Machina pod at all.
 */

import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { NextResponse } from 'next/server';

import { MACHINA_API_URL, podAuthHeaders, podConfigured } from '@/lib/pod-auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // streamed agent runs can be slow

const MACHINA_AGENT = process.env.MACHINA_AGENT || 'machina-assistant-executor';

type IncomingMessage = {
  role?: string;
  content?: unknown;
  parts?: Array<{ type?: string; text?: unknown }>;
};

/** Text of a UI message. UI messages carry `parts`; older clients may send a
 *  plain `content` string — accept both, forward only text. */
function textOf(message: IncomingMessage): string {
  if (Array.isArray(message.parts)) {
    const text = message.parts
      .filter((part) => part?.type === 'text' && typeof part.text === 'string')
      .map((part) => part.text as string)
      .join('\n');
    if (text) return text;
  }
  return typeof message.content === 'string' ? message.content : '';
}

/** NDJSON lines from the pod stream, tolerant of chunk boundaries. */
async function* ndjsonLines(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let newline = buffer.indexOf('\n');
      while (newline >= 0) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        newline = buffer.indexOf('\n');
        if (!line) continue;
        try {
          yield JSON.parse(line) as { type?: string; content?: unknown };
        } catch {
          // A malformed line is dropped rather than killing the stream —
          // the `done` event still carries the full response text.
        }
      }
    }
    const rest = buffer.trim();
    if (rest) {
      try {
        yield JSON.parse(rest) as { type?: string; content?: unknown };
      } catch {
        /* trailing garbage — ignore */
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function POST(req: Request) {
  if (!podConfigured()) {
    return NextResponse.json(
      {
        error:
          'Machina pod is not configured. Set MACHINA_API_URL plus MACHINA_API_KEY (pod API key) or MACHINA_PROJECT_TOKEN in .env.local (see .env.example).',
      },
      { status: 503 }
    );
  }

  const body = (await req.json().catch(() => null)) as { messages?: IncomingMessage[] } | null;
  const incoming = Array.isArray(body?.messages) ? body.messages : [];
  const messages = incoming
    .map((message) => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: textOf(message),
    }))
    .filter((message) => message.content);
  if (messages.length === 0) {
    return NextResponse.json({ error: 'No message text to send.' }, { status: 400 });
  }

  const upstream = await fetch(
    `${MACHINA_API_URL}/agent/stream/${encodeURIComponent(MACHINA_AGENT)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...podAuthHeaders(),
      },
      // `messages` top-level is what the executor hands the LLM; the copy
      // under `context-agent` is what agent workflow CONDITIONS and INPUTS
      // evaluate over (client-api AgentContext seeds its state from the
      // agent doc's `context` plus the request's `context-agent` — never
      // from top-level request fields). Omit either and the agent silently
      // skips every workflow.
      body: JSON.stringify({ messages, 'context-agent': { messages } }),
    }
  );

  if (!upstream.ok || !upstream.body) {
    const details = await upstream.text().catch(() => '');
    console.error('[Chat Bridge] Machina API error:', upstream.status, details.slice(0, 300));
    return NextResponse.json(
      { error: 'Machina pod rejected the chat request.', status: upstream.status },
      { status: upstream.status === 401 || upstream.status === 403 ? upstream.status : 502 }
    );
  }

  const podBody = upstream.body;
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const textId = 'machina-response';
      let started = false;
      let streamedAny = false;
      const start = () => {
        if (!started) {
          writer.write({ type: 'text-start', id: textId });
          started = true;
        }
      };
      for await (const line of ndjsonLines(podBody)) {
        const metadata = (line as { metadata?: { content?: unknown } }).metadata;
        // Incremental chunks carry text in `content`; the final `done` event
        // carries the full response inside `metadata.content` (its own
        // top-level `content` is empty on real pods).
        const content =
          typeof line.content === 'string' && line.content
            ? line.content
            : typeof metadata?.content === 'string'
              ? metadata.content
              : '';
        if (line.type === 'content' && content) {
          start();
          streamedAny = true;
          writer.write({ type: 'text-delta', id: textId, delta: content });
        } else if (line.type === 'done') {
          // `done` repeats the FULL response text. Only use it when no
          // incremental chunks arrived (short answers can skip `content`),
          // or the reply would be duplicated.
          if (!streamedAny && content) {
            start();
            writer.write({ type: 'text-delta', id: textId, delta: content });
          }
        } else if (line.type === 'error') {
          throw new Error(content || 'The Machina agent reported an error.');
        }
        // start / workflow_* lines are progress noise for this minimal UI.
      }
      if (!started) {
        throw new Error('The Machina agent stream ended without any content.');
      }
      writer.write({ type: 'text-end', id: textId });
    },
    onError: (error) =>
      error instanceof Error ? error.message : 'The Machina agent stream failed.',
  });

  return createUIMessageStreamResponse({ stream });
}
