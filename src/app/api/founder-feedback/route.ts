import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { founder_id, founder_name, company_name, feedback, voter_name } = body;
  if (!founder_id || !feedback) {
    return NextResponse.json({ error: 'founder_id and feedback required' }, { status: 400 });
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('founder_feedback')
    .insert({
      founder_id,
      founder_name: typeof founder_name === 'string' ? founder_name : null,
      company_name: typeof company_name === 'string' ? company_name : null,
      feedback,
      voter_name: typeof voter_name === 'string' ? voter_name : null,
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const founderId = searchParams.get('founder_id');
  if (!founderId) return NextResponse.json({ error: 'founder_id required' }, { status: 400 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('founder_feedback')
    .select('*')
    .eq('founder_id', founderId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ feedback: data ?? [] });
}
