import { NextRequest, NextResponse } from 'next/server';

import { MACHINA_API_URL, podAuthHeaders } from '@/lib/pod-auth';

export const dynamic = 'force-dynamic';

/**
 * GET endpoint for searching threads
 * Query params:
 * - limit: number of results (default: 10)
 * - sort: sort order, e.g., "-updated" for most recent (default: "-updated")
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const sort = searchParams.get('sort') || '-updated';

    console.log('[Thread Search] Searching threads, limit:', limit, 'sort:', sort);

    // Search for thread documents, sorted by updated date
    const response = await fetch(`${MACHINA_API_URL}/document/search`, {
      method: 'POST',
      headers: {
        ...podAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filters: { name: 'thread' },
        page: 1,
        page_size: limit,
        sort: sort,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Thread Search] Machina API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to search threads', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log('[Thread Search] Found threads:', data.data?.length || 0);

    return NextResponse.json({
      threads: data.data || [],
      total: data.total || 0,
    });
  } catch (error) {
    console.error('[Thread Search] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', message: errorMessage },
      { status: 500 }
    );
  }
}
