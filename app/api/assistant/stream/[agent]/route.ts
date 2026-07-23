/**
 * API Route: /api/assistant/stream/[agent]
 *
 * Proxy for Machina API agent streaming endpoint
 * POST /agent/stream/{agent_name}
 *
 * Streams NDJSON responses from Machina API
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes for streaming

const MACHINA_API_URL = process.env.MACHINA_API_URL || 'http://127.0.0.1:3001';
const MACHINA_API_KEY = process.env.MACHINA_API_KEY || '';

interface RouteContext {
  params: Promise<{
    agent: string;
  }>;
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { agent } = await context.params;
    const body = await req.json();

    console.log(`[Stream Proxy] Starting stream for agent: ${agent}`);

    // Forward request to Machina API streaming endpoint with X-Api-Token header
    const response = await fetch(`${MACHINA_API_URL}/agent/stream/${encodeURIComponent(agent)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Token': MACHINA_API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Stream Proxy] Machina API error:', response.status, errorText);

      return NextResponse.json(
        {
          error: 'Failed to start stream from Machina API',
          details: errorText,
          status: response.status,
        },
        { status: response.status }
      );
    }

    // Check if response is streamable
    if (!response.body) {
      console.error('[Stream Proxy] Response body is null');
      return NextResponse.json({ error: 'Stream response body is null' }, { status: 500 });
    }

    // Get task ID from response headers
    const taskId = response.headers.get('X-Task-ID');
    console.log(`[Stream Proxy] Task ID: ${taskId}`);

    // Create a TransformStream to proxy the NDJSON stream
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Pipe the response body to our stream
    (async () => {
      try {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            console.log('[Stream Proxy] Stream completed');
            await writer.close();
            break;
          }

          // Forward the chunk as-is (already NDJSON format)
          const chunk = decoder.decode(value, { stream: true });
          await writer.write(encoder.encode(chunk));
        }
      } catch (error) {
        console.error('[Stream Proxy] Stream error:', error);

        // Send error message in NDJSON format
        const errorMessage =
          JSON.stringify({
            type: 'error',
            content: `Stream proxy error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            metadata: {},
          }) + '\n';

        await writer.write(encoder.encode(errorMessage));
        await writer.close();
      }
    })();

    // Return streaming response
    return new NextResponse(stream.readable, {
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
        ...(taskId ? { 'X-Task-ID': taskId } : {}),
      },
    });
  } catch (error: any) {
    console.error('[Stream Proxy] Error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
