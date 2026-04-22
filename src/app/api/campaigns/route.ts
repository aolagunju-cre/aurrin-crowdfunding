import { NextRequest, NextResponse } from 'next/server';

const PLATFORM = process.env.NEXT_PUBLIC_PLATFORM_API_URL ?? 'https://aurrin-platform.vercel.app';

interface CampaignBody {
  title?: string;
  tagline?: string;
  story?: string;
  category?: string;
  funding_goal_cents?: number;
  duration_days?: number;
  pledge_tiers?: Array<{ name: string; amount_cents: number; description: string }>;
}

export async function POST(req: NextRequest) {
  let body: CampaignBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { title, tagline, story, category, funding_goal_cents, duration_days, pledge_tiers } = body;

  if (!title || !category || !funding_goal_cents) {
    return NextResponse.json({ error: 'title, category, funding_goal_cents required' }, { status: 400 });
  }

  if (!pledge_tiers || pledge_tiers.length < 2) {
    return NextResponse.json({ error: 'At least 2 pledge tiers required' }, { status: 400 });
  }

  try {
    const res = await fetch(`${PLATFORM}/api/public/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        tagline: tagline ?? null,
        description: tagline ?? null,
        story: story ?? null,
        category,
        funding_goal_cents,
        duration_days: duration_days ?? 30,
        pledge_tiers,
        status: 'draft',
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: err.message ?? 'Failed to create campaign' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ id: data.id, message: 'Campaign created' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Could not reach platform API' }, { status: 502 });
  }
}
