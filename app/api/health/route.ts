import { NextResponse } from 'next/server';

import { podConfigured } from '@/lib/pod-auth';

export function GET() {
  return NextResponse.json({
    ok: true,
    app: '{{APP_SLUG}}',
    podConfigured: podConfigured(),
  });
}
