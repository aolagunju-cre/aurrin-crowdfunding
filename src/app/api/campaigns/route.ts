import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_SUPABASE_URL not set' }, { status: 500 });
  }
  if (!supabaseKey) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 500 });
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { title, tagline, story, category, funding_goal_cents, duration_days, pledge_tiers } = body;

  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }
  if (!funding_goal_cents || typeof funding_goal_cents !== 'number') {
    return NextResponse.json({ error: 'funding_goal_cents is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      founder_id: '00000000-0000-0000-0000-000000000000',
      title,
      description: typeof tagline === 'string' ? tagline : null,
      story: typeof story === 'string' ? story : null,
      category: typeof category === 'string' ? category : null,
      funding_goal_cents,
      duration_days: typeof duration_days === 'number' ? duration_days : 30,
      pledge_tiers: Array.isArray(pledge_tiers) ? pledge_tiers : [],
      status: 'active',
      published_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message, code: error.code, hint: error.hint },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}

export async function GET() {
  return NextResponse.json({ route: '/api/campaigns', status: 'ok' });
}