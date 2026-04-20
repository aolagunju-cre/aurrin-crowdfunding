'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PledgeTier } from '@/lib/campaigns';

interface Props {
  campaignId: string;
  campaignTitle: string;
  pledgeTiers: PledgeTier[];
}

export function PledgeTierSelector({ campaignId, campaignTitle, pledgeTiers }: Props) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDonate() {
    if (selectedIndex === null) {
      setError('Please select a pledge level first.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const tier = pledgeTiers[selectedIndex];
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          tierIndex: selectedIndex,
          tierAmountCents: tier.amount_cents,
          campaignTitle,
        }),
      });

      if (!res.ok) throw new Error('Failed to create checkout session');
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  if (pledgeTiers.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-default-500 text-sm">No pledge tiers available yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
      <h3 className="font-montserrat font-bold text-lg">Choose Your Pledge</h3>

      <div className="space-y-3">
        {pledgeTiers.map((tier, i) => (
          <label
            key={i}
            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
              selectedIndex === i
                ? 'border-violet bg-violet/10'
                : 'border-white/10 hover:border-white/30'
            }`}
          >
            <input
              type="radio"
              name="tier"
              checked={selectedIndex === i}
              onChange={() => setSelectedIndex(i)}
              className="mt-1 accent-violet"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className="font-semibold">{tier.name}</span>
                <span className="font-montserrat font-bold text-teal">
                  {new Intl.NumberFormat('en-CA', {
                    style: 'currency',
                    currency: 'CAD',
                    minimumFractionDigits: 0,
                  }).format(tier.amount_cents / 100)}
                </span>
              </div>
              {tier.description && (
                <p className="text-sm text-default-400 mt-1">{tier.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <button
        onClick={handleDonate}
        disabled={loading || selectedIndex === null}
        className="w-full py-3 rounded-full bg-white text-navy font-bold text-lg hover:bg-violet-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Loading...' : 'Back This Project →'}
      </button>

      <p className="text-xs text-center text-default-600">
        Secure payment via Stripe. CAD only.
      </p>
    </div>
  );
}