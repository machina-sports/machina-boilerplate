import { NextResponse, NextRequest } from 'next/server';

import { MACHINA_API_URL, podAuthHeaders } from '@/lib/pod-auth';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
  }

  try {
    // Check if it's a slug or ID
    const isObjectId = /^[0-9a-f]{24}$/i.test(id);
    const filters = isObjectId ? { _id: id } : { 'value.slug': id };

    const response = await fetch(`${MACHINA_API_URL}/document/search`, {
      method: 'POST',
      headers: {
        ...podAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filters,
        page: 1,
        page_size: 1,
      }),
      next: { revalidate: 0 },
    });

    const data = await response.json();

    if (data.status && data.data && data.data.length > 0) {
      return NextResponse.json({ article: data.data[0] });
    }

    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
