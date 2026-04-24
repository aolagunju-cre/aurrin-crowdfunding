'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stat {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}

interface Campaign {
  id: string;
  title: string;
  founder_name: string;
  category: string;
  funding_goal_cents: number;
  amount_raised_cents: number;
  status: string;
  created_at: string;
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
      <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
      {stat.change && (
        <p className={`text-xs mt-1 ${stat.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {stat.change}
        </p>
      )}
    </div>
  );
}

function FundingChart({ campaigns }: { campaigns: Campaign[] }) {
  const maxGoal = Math.max(...campaigns.map((c) => c.funding_goal_cents), 1);
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-bold text-slate-900 mb-4">Funding Goals vs Raised</h3>
      <div className="space-y-3">
        {campaigns.slice(0, 8).map((c) => {
          const goalPct = (c.funding_goal_cents / maxGoal) * 100;
          const raisedPct = (c.amount_raised_cents / maxGoal) * 100;
          return (
            <div key={c.id}>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span className="truncate mr-2">{c.title}</span>
                <span>${(c.amount_raised_cents / 100).toLocaleString()} / ${(c.funding_goal_cents / 100).toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-200 rounded-full" style={{ width: `${goalPct}%` }} />
                <div
                  className="h-full bg-teal-500 rounded-full -mt-2"
                  style={{ width: `${raisedPct}%`, opacity: 0.7 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CategoryBreakdown({ campaigns }: { campaigns: Campaign[] }) {
  const counts: Record<string, number> = {};
  campaigns.forEach((c) => {
    const cat = c.category || 'Other';
    counts[cat] = (counts[cat] || 0) + 1;
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-bold text-slate-900 mb-4">Pitches by Category</h3>
      <div className="space-y-2">
        {sorted.map(([cat, count]) => (
          <div key={cat} className="flex items-center justify-between">
            <span className="text-sm text-slate-700">{cat}</span>
            <span className="text-sm font-semibold text-slate-900">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubscriptionGate() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="text-5xl mb-6">📊</div>
      <h1 className="text-2xl font-bold text-slate-900 mb-3">Aurrin Founder Research</h1>
      <p className="text-slate-500 mb-8 max-w-md mx-auto">
        Data on founders, funding, and outcomes from Aurrin Ventures pitch events. Subscribe to access the full research dashboard.
      </p>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-sm mx-auto">
        <p className="text-sm text-slate-500 mb-4">Research subscription</p>
        <p className="text-3xl font-extrabold text-slate-900 mb-1">$0 <span className="text-base font-normal text-slate-500">/ month</span></p>
        <p className="text-xs text-slate-400 mb-6">Early access — pricing coming soon</p>
        <button
          className="w-full py-3 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-700 transition-colors mb-3"
          onClick={() => alert('Stripe integration coming soon. Contact hello@aurrinventures.com to get early access.')}
        >
          Subscribe for Access
        </button>
        <p className="text-xs text-slate-400">
          Already a subscriber?{' '}
          <a href="/login" className="text-teal-600 hover:text-teal-700">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default function ResearchPage() {
  const [hasSubscription, setHasSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    // TODO: Replace with actual Stripe subscription check
    // const checkSubscription = async () => {
    //   const session = await fetch('/api/check-subscription').then(r => r.json());
    //   setHasSubscription(session.hasActiveSubscription);
    // };
    // checkSubscription();

    // Placeholder: check localStorage for now
    const sub = localStorage.getItem('aurrin_subscription');
    setHasSubscription(sub === 'active');
    setLoading(false);

    // Load campaign data for stats
    fetch('/api/list')
      .then((r) => r.json())
      .then((data) => {
        if (data.campaigns) setCampaigns(data.campaigns);
        else if (Array.isArray(data)) setCampaigns(data);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-slate-400">
        Loading...
      </div>
    );
  }

  if (!hasSubscription) {
    return <SubscriptionGate />;
  }

  const totalRaised = campaigns.reduce((sum, c) => sum + (c.amount_raised_cents || 0), 0);
  const totalGoal = campaigns.reduce((sum, c) => sum + c.funding_goal_cents, 0);
  const avgPct = totalGoal > 0 ? Math.round((totalRaised / totalGoal) * 100) : 0;
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;

  const stats: Stat[] = [
    { label: 'Total Founders Pitched', value: campaigns.length.toString() },
    { label: 'Funds Raised', value: `$${(totalRaised / 100).toLocaleString('en-CA')}` },
    { label: 'Active Campaigns', value: activeCampaigns.toString() },
    { label: 'Avg. Funded', value: `${avgPct}%`, positive: avgPct >= 50 },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-teal-600 mb-3">Live Data</p>
        <h1 className="text-3xl font-bold text-slate-900">Aurrin Founder Research</h1>
        <p className="text-slate-500 mt-2">
          Real data from Aurrin Ventures pitch events and crowdfunding campaigns.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="space-y-4 mb-8">
        <FundingChart campaigns={campaigns} />
        <CategoryBreakdown campaigns={campaigns} />
      </div>

      {/* CTA to manage subscription */}
      <div className="text-center">
        <button
          className="text-sm text-slate-500 hover:text-slate-900 underline"
          onClick={() => {
            localStorage.removeItem('aurrin_subscription');
            setHasSubscription(false);
          }}
        >
          Sign out of research
        </button>
      </div>
    </div>
  );
}
