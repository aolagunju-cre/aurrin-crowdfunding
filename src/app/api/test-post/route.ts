import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.json({ ok: true, method: 'POST', path: '/api/test-post' });
}

export async function GET() {
  return NextResponse.json({ ok: true, method: 'GET', path: '/api/test-post' });
}
