/**
 * API Route: /api/assistant/agents
 *
 * Proxy for Machina API agent search endpoint
 * POST /agent/search
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const MACHINA_API_URL = process.env.MACHINA_API_URL || 'http://127.0.0.1:3001';
const MACHINA_API_KEY = process.env.MACHINA_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log('[Agent Search] Using API URL:', MACHINA_API_URL);

    // Forward request to Machina API with X-Api-Token header
    const response = await fetch(`${MACHINA_API_URL}/agent/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Token': MACHINA_API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Agent Search] Machina API error:', response.status, errorText);

      return NextResponse.json(
        {
          error: 'Failed to fetch agents from Machina API',
          details: errorText,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Agent Search] Error proxying agent search:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for retrieving agent by name
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json({ error: 'Agent name is required' }, { status: 400 });
    }

    // Forward request to Machina API with X-Api-Token header
    const response = await fetch(`${MACHINA_API_URL}/agent/${encodeURIComponent(name)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Token': MACHINA_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Agent Get] Machina API error:', response.status, errorText);

      return NextResponse.json(
        {
          error: 'Failed to fetch agent from Machina API',
          details: errorText,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Agent Get] Error proxying agent get:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
