import { NextRequest } from 'next/server';

import { MACHINA_API_URL, podAuthHeaders } from '@/lib/pod-auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

/**
 * Every upstream call from this route is signed with the server's pod
 * credential, so the browser must never get to pick which pod endpoint that
 * credential reaches. Both targets are resolved server-side:
 *
 *   type=agent     always MACHINA_AGENT; any ?target= the browser sends is ignored
 *   type=workflow  must appear verbatim in MACHINA_WORKFLOWS; an unset list
 *                  closes the workflow path entirely
 *
 * Exact allowlist matching already rejects `../` and every encoding of it
 * (`%2E%2E`, `..%2F`, …) because such a string is not a member of the list. The
 * resolved name is still shape-checked and percent-encoded before it reaches
 * the URL, so no name can widen or escape the intended path.
 */
const MACHINA_AGENT = process.env.MACHINA_AGENT || 'machina-assistant-executor';

const ALLOWED_WORKFLOWS = new Set(
  (process.env.MACHINA_WORKFLOWS || '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
);

/** A Machina agent/workflow name: no slashes, and never a `.`-leading segment. */
const SAFE_TARGET_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

function errorResponse(content: string, status: number) {
  return new Response(JSON.stringify({ type: 'error', content }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: NextRequest) {
  try {
    // Resolve the target before touching the body: a request that is not
    // allowed to reach the pod is refused without forwarding anything.
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'agent';

    if (type !== 'agent' && type !== 'workflow') {
      return errorResponse('Target type must be agent or workflow', 400);
    }

    let target: string;
    if (type === 'agent') {
      target = MACHINA_AGENT;
    } else {
      const requestedWorkflow = (searchParams.get('target') || '').trim();
      if (!ALLOWED_WORKFLOWS.has(requestedWorkflow)) {
        console.warn('[Thread Stream] Rejected workflow target outside MACHINA_WORKFLOWS');
        return errorResponse('Workflow target is not allowed', 403);
      }
      target = requestedWorkflow;
    }

    if (!SAFE_TARGET_NAME.test(target)) {
      console.error('[Thread Stream] Server-configured target is not a usable name');
      return errorResponse('Server target configuration is invalid', 500);
    }

    const body = await req.json();

    console.log('[Thread Stream] Target:', target, 'Type:', type);

    // Forward request to Flask backend streaming endpoint (agent-specific or
    // workflow-specific). The final segment is encoded so it stays one segment.
    const endpoint = `${MACHINA_API_URL}/${type}/stream/${encodeURIComponent(target)}`;

    console.log('[Thread Stream] Calling endpoint:', endpoint);
    console.log('[Thread Stream] Request body:', JSON.stringify(body, null, 2));

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...podAuthHeaders(),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Thread Stream] Machina API error:', response.status, errorText);
      return errorResponse(`Backend error: ${response.status}`, response.status);
    }

    console.log('[Thread Stream] Response received, streaming back to client...');

    // Create a readable stream that logs chunks as they pass through
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is null');
    }

    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              console.log('[Thread Stream] Stream completed');
              controller.close();
              break;
            }

            // Decode and log chunks for debugging
            const text = decoder.decode(value, { stream: true });
            buffer += text;

            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.trim()) {
                try {
                  const parsed = JSON.parse(line);
                  console.log(
                    '[Thread Stream] Chunk type:',
                    parsed.type,
                    'has metadata:',
                    !!parsed.metadata
                  );
                  if (parsed.type === 'start' || parsed.type === 'done') {
                    console.log(
                      '[Thread Stream] Important chunk:',
                      JSON.stringify(parsed, null, 2)
                    );
                  }
                } catch {
                  // Not JSON, skip logging
                }
              }
            }

            // Forward the chunk to the client
            controller.enqueue(value);
          }
        } catch (error) {
          console.error('[Thread Stream] Stream error:', error);
          controller.error(error);
        }
      },
    });

    // Stream the response back to the client (NDJSON format)
    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[Thread Stream] Error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Stream failed', 500);
  }
}
