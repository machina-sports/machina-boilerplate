import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    ok: true,
    app: '{{APP_SLUG}}',
    podConfigured: Boolean(process.env.MACHINA_API_URL && process.env.MACHINA_API_KEY),
  });
}
