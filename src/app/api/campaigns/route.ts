import { NextRequest, NextResponse } from 'next/server';
import { getCampaign } from '@/lib/campaigns';

export async function GET(request: NextRequest) {
  const campaignId = request.nextUrl.searchParams.get('campaignId');

  if (!campaignId) {
    return NextResponse.json({ error: 'campaignId required' }, { status: 400 });
  }

  try {
    const campaign = await getCampaign(campaignId);
    if (!campaign) return NextResponse.json({ data: null }, { status: 404 });
    return NextResponse.json({ data: campaign });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 });
  }
}