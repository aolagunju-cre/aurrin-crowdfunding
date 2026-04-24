import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  const { campaignId } = await params;

  let body: { amount_cents?: number; campaignTitle?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const amount = body.amount_cents;
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'amount_cents is required' }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aurrin-crowdfunding.vercel.app';

  // Try Stripe first — if keys are real, redirect to Checkout
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey && stripeKey !== 'sk_test_placeholder' && stripeKey !== '') {
    try {
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(stripeKey);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'cad',
              product_data: {
                name: `Back: ${body['campaignTitle'] || 'Campaign'}`,
                description: 'Aurrin Ventures Crowdfunding',
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${appUrl}/confirm/${campaignId}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/campaigns/${campaignId}`,
        metadata: { campaign_id: campaignId, amount_cents: String(amount) },
      });
      return NextResponse.json({ url: session.url });
    } catch (err) {
      console.error('[donate] Stripe error:', err);
      // Fall through to demo mode
    }
  }

  // Demo mode: redirect to confirm page
  return NextResponse.json({
    url: `${appUrl}/confirm/${campaignId}?amount=${amount}&demo=1`,
  });
}
