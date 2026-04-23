import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: 'Env vars not set', url: !!url, key: !!key }, { status: 500 });
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, key);

  const title = req.nextUrl.searchParams.get('title') || 'Test Campaign';
  const category = req.nextUrl.searchParams.get('category') || 'startup';
  const goal = req.nextUrl.searchParams.get('goal') || '50000';

  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      founder_id: '00000000-0000-0000-0000-000000000000',
      title,
      category,
      funding_goal_cents: parseInt(goal),
      pledge_tiers: [
        { name: 'Backer', amount_cents: 5000, description: 'Thank you' },
        { name: 'Supporter', amount_cents: 15000, description: 'All of above' },
      ],
      status: 'active',
    })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id });
}
