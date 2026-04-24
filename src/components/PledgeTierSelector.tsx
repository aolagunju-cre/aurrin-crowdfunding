'use client';

import { useState } from 'react';

interface PledgeTier {
  name: string;
  amount_cents: number;
  description: string;
}

interface PledgeTierSelectorProps {
  campaignId: string;
  campaignTitle: string;
  pledgeTiers: PledgeTier[];
  onPledge?: (tier: PledgeTier) => void;
}

export function PledgeTierSelector({
  campaignId,
  campaignTitle,
  pledgeTiers,
  onPledge,
}: PledgeTierSelectorProps) {
  const [selectedTier, setSelectedTier] = useState<PledgeTier | null>(
    pledgeTiers[0] || null
  );
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePledge() {
    const amount = selectedTier?.amount_cents || parseInt(customAmount) * 100;
    if (!amount || amount <= 0) {
      setError('Please select or enter a valid amount.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/donate/${campaignId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount_cents: amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      if (data.url) {
        window.location.href = data.url; // Stripe Checkout redirect
      } else {
        // Demo mode — redirect to confirm page
        window.location.href = `/confirm/${campaignId}?amount=${amount}`;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  }

  if (!pledgeTiers.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <p className="text-sm text-slate-500">No pledge tiers available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h3 className="font-bold text-slate-900">Back this campaign</h3>

      {/* Tier selection */}
      <div className="space-y-2">
        {pledgeTiers.map((tier, i) => (
          <label
            key={i}
            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
              selectedTier === tier
                ? 'border-violet-500 bg-violet-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="tier"
              checked={selectedTier === tier}
              onChange={() => setSelectedTier(tier)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-900">{tier.name}</span>
                <span className="font-bold text-teal-600">
                  ${(tier.amount_cents / 100).toLocaleString('en-CA')}
                </span>
              </div>
              {tier.description && (
                <p className="text-sm text-slate-500 mt-1">{tier.description}</p>
              )}
              {selectedTier === tier && i === 0 && (
                <p className="text-xs text-violet-600 font-medium mt-1">🎁 Early backer — first 5 get this tier!</p>
              )}
            </div>
          </label>
        ))}
      </div>

      {/* Custom amount */}
      <div className="flex gap-2 items-center">
        <span className="text-slate-500 font-medium">$</span>
        <input
          type="number"
          min="1"
          placeholder="Custom amount"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setSelectedTier(null);
          }}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* CTA */}
      <button
        onClick={handlePledge}
        disabled={loading}
        className="w-full py-3 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Redirecting...' : `Back for $${selectedTier ? (selectedTier.amount_cents / 100).toLocaleString('en-CA') : customAmount || '—'}`}
      </button>

      {/* Share */}
      <div className="flex gap-2">
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://aurrin-crowdfunding.vercel.app'}/campaigns/${campaignId}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 text-center text-xs font-medium text-slate-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Share on LinkedIn
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just backed "${campaignTitle}" on @AurrinVentures! `)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://aurrin-crowdfunding.vercel.app'}/campaigns/${campaignId}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 text-center text-xs font-medium text-slate-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Share on X
        </a>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <p className="text-xs text-slate-400 text-center">
        Powered by Aurrin Ventures · Secure payment
      </p>
    </div>
  );
}
