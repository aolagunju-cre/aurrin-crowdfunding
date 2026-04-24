import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'session_id required' }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey || stripeKey === 'sk_test_placeholder' || stripeKey === '') {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  try {
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      amount: session.amount_total,
      status: session.payment_status,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
  }
}
