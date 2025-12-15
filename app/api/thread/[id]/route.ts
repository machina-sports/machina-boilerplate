import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MACHINA_API_URL = process.env.MACHINA_API_URL || 'https://api-staging.machina.gg';
const MACHINA_API_KEY = process.env.MACHINA_API_KEY || '';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET endpoint for fetching a thread/document by ID
 */
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'Thread ID is required' }, { status: 400 });
    }

    console.log('[Thread GET] Fetching thread:', id);

    // Fetch thread from Machina API using document search
    // Try both _id (MongoDB ObjectId) and document_id (UUID) formats
    const isObjectId = id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);
    const filters = isObjectId ? { _id: id } : { document_id: id, name: 'thread' };

    console.log('[Thread GET] Search filters:', filters);

    const response = await fetch(`${MACHINA_API_URL}/document/search`, {
      method: 'POST',
      headers: {
        'X-Api-Token': MACHINA_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filters,
        page: 1,
        page_size: 1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Thread GET] Machina API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch thread', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log('[Thread GET] API response:', {
      status: data.status,
      dataLength: data.data?.length,
      hasData: !!data.data,
    });

    if (data.data && data.data.length > 0) {
      console.log('[Thread GET] Thread found:', data.data[0]._id);
      return NextResponse.json({ thread: data.data[0] });
    }

    console.log('[Thread GET] No documents found for filters:', filters);
    return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
  } catch (error) {
    console.error('[Thread GET] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', message: errorMessage },
      { status: 500 }
    );
  }
}
