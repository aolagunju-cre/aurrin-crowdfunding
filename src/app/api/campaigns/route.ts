import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'campaigns-api-ok' });
}

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: 'Missing Supabase env vars' }, { status: 500 });
  }
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, key);
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const { title, tagline, story, category, funding_goal_cents, duration_days, pledge_tiers } = body;
  if (!title || typeof title !== 'string') return NextResponse.json({ error: 'title required' }, { status: 400 });
  if (!funding_goal_cents || typeof funding_goal_cents !== 'number') return NextResponse.json({ error: 'funding_goal_cents required' }, { status: 400 });
  const { data, error } = await supabase.from('campaigns').insert({
    founder_id: '00000000-0000-0000-0000-000000000000',
    title,
    description: typeof tagline === 'string' ? tagline : null,
    story: typeof story === 'string' ? story : null,
    category: typeof category === 'string' ? category : null,
    funding_goal_cents,
    duration_days: typeof duration_days === 'number' ? duration_days : 30,
    pledge_tiers: Array.isArray(pledge_tiers) ? pledge_tiers : [],
    status: 'active',
  }).select('id').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}
