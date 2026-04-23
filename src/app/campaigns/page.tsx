'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Campaign {
  id: string;
  title: string;
  tagline?: string;
  category: string;
  funding_goal_cents: number;
  amount_raised_cents?: number;
  pledge_tiers?: Array<{ name: string; amount_cents: number }>;
  status: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/list')
      .then((r) => r.json())
      .then((data) => {
        if (data.campaigns) setCampaigns(data.campaigns);
        else if (Array.isArray(data)) setCampaigns(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-teal-600 mb-3">Community-Powered</p>
        <h1 className="text-3xl font-bold text-slate-900">Founders building.<br />Community backing.</h1>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading campaigns...</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="text-4xl">🚀</div>
          <h2 className="text-xl font-bold text-slate-900">No campaigns yet</h2>
          <p className="text-slate-500">Be the first to launch a campaign.</p>
          <Link
            href="/create"
            className="inline-block px-8 py-3 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-700 transition-colors"
          >
            Start a Campaign
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((c) => {
            const raised = c.amount_raised_cents ?? 0;
            const goal = c.funding_goal_cents;
            const pct = goal > 0 ? Math.round((raised / goal) * 100) : 0;
            const lowestTier = c.pledge_tiers?.[0];

            return (
              <Link
                key={c.id}
                href={`/campaigns/${c.id}`}
                className="block rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-gray-300 transition-all"
              >
                <div className="h-1 bg-gradient-to-r from-violet-600 to-teal-500" />
                <div className="p-5 space-y-3">
                  {c.category && (
                    <p className="text-xs text-teal-600 uppercase tracking-widest font-semibold">{c.category}</p>
                  )}
                  <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
                  {c.tagline && <p className="text-sm text-slate-500">{c.tagline}</p>}

                  <div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-600 to-teal-500"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div                    <p className="text-xs text-gray-400 mt-1">
                      ${(raised / 100).toLocaleString('en-CA', { minimumFractionDigits: 0 })} raised · {pct}% of ${(goal / 100).toLocaleString('en-CA', { minimumFractionDigits: 0 })} goal
                    </p>
                  </div>

                  {lowestTier && (
                    <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-gray-500">From</span>
                      <span className="text-sm font-bold text-teal-600">
                        ${(lowestTier.amount_cents / 100).toLocaleString('en-CA', { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}

          <div className="text-center pt-4">
            <Link
              href="/create"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              + Start a new campaign
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}