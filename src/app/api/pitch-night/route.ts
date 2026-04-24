import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const {
    founderName,
    companyName,
    oneLiner,
    linkedinUrl,
    companyLinkedinUrl,
    eventContext,
    eventDate,
  } = body;

  if (!founderName || !companyName || !oneLiner || !eventContext) {
    return NextResponse.json(
      { error: 'founderName, companyName, oneLiner, and eventContext are required' },
      { status: 400 }
    );
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('pitch_night_submissions')
    .insert({
      founder_name: founderName,
      company_name: companyName,
      one_liner: oneLiner,
      linkedin_url: linkedinUrl || null,
      company_linkedin_url: companyLinkedinUrl || null,
      event_context: eventContext,
      event_date: eventDate || null,
    })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: data.id, founderName, companyName }, { status: 201 });
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('pitch_night_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ submissions: data ?? [] });
}
