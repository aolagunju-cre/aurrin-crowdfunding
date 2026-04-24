import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  // Read raw body first to debug
  const rawBody = await req.text();

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON', received: rawBody.substring(0, 100) }, { status: 400 });
  }

  const { title, description, story, category, funding_goal_cents, duration_days, pledge_tiers } = body;

  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'title is required', received: { title, fg: funding_goal_cents } }, { status: 400 });
  }
  if (!funding_goal_cents || typeof funding_goal_cents !== 'number') {
    return NextResponse.json({ error: 'funding_goal_cents is required', received: typeof funding_goal_cents }, { status: 400 });
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      founder_id: '00000000-0000-0000-0000-000000000000',
      title,
      description: typeof description === 'string' ? description : null,
      story: typeof story === 'string' ? story : null,
      category: typeof category === 'string' ? category : null,
      funding_goal_cents,
      amount_raised_cents: 0,
      duration_days: typeof duration_days === 'number' ? duration_days : 30,
      pledge_tiers: Array.isArray(pledge_tiers) ? pledge_tiers : [],
      status: 'active',
    })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message, code: error.code, hint: error.hint }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}

export async function GET() {
  return NextResponse.json({ route: '/api/campaigns', ok: true });
}