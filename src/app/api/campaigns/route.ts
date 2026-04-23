import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return NextResponse.json({
    envCheck: {
      urlSet: !!url,
      urlValue: url ? url.substring(0, 30) + '...' : 'NOT SET',
      keySet: !!key,
      keyLength: key ? key.length : 0,
    }
  });
}