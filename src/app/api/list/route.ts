import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
);

export async function GET() {
  const { data, error } = await supabase
    .from('campaigns')
    .select('id, title, description, story, category, funding_goal_cents, amount_raised_cents, pledge_tiers, status, created_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ campaigns: data ?? [] });
}

export async function POST(req: Request) {
  const { title, description, story, category, funding_goal_cents, duration_days, pledge_tiers } = await req.json();
  if (!title || !funding_goal_cents) return NextResponse.json({ error: 'title and funding_goal_cents required' }, { status: 400 });

  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      founder_id: '00000000-0000-0000-0000-000000000000',
      title,
      description: typeof description === 'string' ? description : null,
      story: typeof story === 'string' ? story : null,
      category: typeof category === 'string' ? category : null,
      funding_goal_cents,
      duration_days: typeof duration_days === 'number' ? duration_days : 30,
      pledge_tiers: Array.isArray(pledge_tiers) ? pledge_tiers : [],
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}
