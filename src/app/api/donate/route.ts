import { NextRequest, NextResponse } from 'next/server';
import { createDonationCheckout } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  let body: { campaignId?: string; tierIndex?: number; tierAmountCents?: number; campaignTitle?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { campaignId, tierIndex, tierAmountCents, campaignTitle } = body;

  if (!campaignId || tierIndex === undefined || !tierAmountCents || !campaignTitle) {
    return NextResponse.json(
      { error: 'Missing required fields: campaignId, tierIndex, tierAmountCents, campaignTitle' },
      { status: 400 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  try {
    const { url } = await createDonationCheckout({
      campaignId,
      tierIndex,
      tierAmountCents,
      campaignTitle,
      successUrl: `${appUrl}/confirm/${campaignId}?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/campaigns/${campaignId}`,
    });

    return NextResponse.json({ url });
  } catch (err) {
    console.error('[donate API]', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}