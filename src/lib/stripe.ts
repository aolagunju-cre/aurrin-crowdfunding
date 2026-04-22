import Stripe from 'stripe';

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
      apiVersion: '2026-03-25.dahlia',
    });
  }
  return _stripe;
}

interface DonateParams {
  campaignId: string;
  tierIndex: number;
  tierAmountCents: number;
  campaignTitle: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createDonationCheckout(params: DonateParams): Promise<{ url: string }> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'cad',
          unit_amount: params.tierAmountCents,
          product_data: {
            name: `Back: ${params.campaignTitle}`,
            description: `Pledge to ${params.campaignTitle}`,
          },
        },
      },
    ],
    metadata: {
      campaign_id: params.campaignId,
      tier_index: String(params.tierIndex),
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    allow_promotion_codes: true,
  });

  if (!session.url) throw new Error('No checkout URL returned');
  return { url: session.url };
}

export async function verifySession(sessionId: string) {
  return getStripe().checkout.sessions.retrieve(sessionId);
}
