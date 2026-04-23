import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return NextResponse.json({
    supabaseUrl: supabaseUrl ? 'SET (' + supabaseUrl.substring(0, 20) + '...)' : 'NOT SET',
    supabaseKey: supabaseKey ? 'SET (len=' + supabaseKey.length + ')' : 'NOT SET',
  });
}

export async function GET() {
  return NextResponse.json({ route: '/api/campaigns', method: 'GET' });
}