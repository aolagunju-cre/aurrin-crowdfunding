import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-12-18.acacia',
});

interface DonateParams {
  campaignId: string;
  tierIndex: number;       // index into pledge_tiers array
  tierAmountCents: number;
  campaignTitle: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createDonationCheckout(params: DonateParams): Promise<{ url: string }> {
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
  return stripe.checkout.sessions.retrieve(sessionId);
}