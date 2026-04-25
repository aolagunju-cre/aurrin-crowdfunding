'use client';
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ValidationResult {
  score: number;
  maxScore: number;
  pct: number;
  tier: string;
  domain: string;
}

export default function ValidatePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ValidationResult | null>(null);

  async function handleValidate(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong'); return; }
      setResult(data);
    } catch { setError('Failed to validate. Check the URL and try again.'); }
    finally { setLoading(false); }
  }

  const COMPANIES = [
    { name: 'Levyne', domain: 'levyne.com', desc: 'Real team. Clear pricing. B2B SaaS.', score: 75 },
    { name: 'SynthGrid', domain: 'synthgrid.com', desc: 'Certification standard. Energy vertical.', score: 50 },
    { name: 'Serenity Power', domain: 'serenitypower.ca', desc: 'Specific efficiency claim. Industrial buyer.', score: 50 },
    { name: 'Inspekto AI', domain: 'inspektoai.com', desc: 'AI inspection reports. API standards.', score: 38 },
    { name: 'Link NRG', domain: 'linknrg.com', desc: 'Clean fuel supply chain platform.', score: 38 },
    { name: 'WACORP', domain: 'wacorp.com', desc: 'Wireline abandonment tool. 600% faster.', score: 25 },
    { name: 'Ranch Ehrlo', domain: 'ranchehrlo.ca', desc: 'Social services. Long operating history.', score: 20 },
    { name: 'Saturves', domain: 'saturves.com', desc: 'Plant-based beverages. Consumer brand.', score: 13 },
  ];

  const shown = result ? COMPANIES.slice(0, 3) : COMPANIES.slice(0, 3);
  const hidden = result ? COMPANIES.slice(3) : [];

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-violet-600 mb-3">Aurrin Ventures</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Is your startup fundable?</h1>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Enter your URL. See how your startup compares to companies that have raised money.
        </p>
      </div>

      {/* Step 1: Input */}
      <form onSubmit={handleValidate} className="mb-8">
        <div className="flex gap-2">
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourstartup.com"
            className="flex-1 px-4 py-3.5 rounded-xl border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
          >
            {loading ? 'Checking...' : 'Check →'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>

      {/* The funnel */}
      <div className="space-y-3">

        {/* ✅ Micro-close 1: Score */}
        {result && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
            <p className="text-sm text-slate-400 mb-1">{result.domain}</p>
            <div className="text-5xl font-extrabold text-slate-900 mb-2">{result.score}/{result.maxScore}</div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3 mx-auto max-w-xs">
              <div
                className={`h-full rounded-full ${
                  result.pct >= 75 ? 'bg-emerald-500' :
                  result.pct >= 50 ? 'bg-violet-600' :
                  result.pct >= 25 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${result.pct}%` }}
              />
            </div>
            <p className="text-base font-semibold text-slate-900">{result.tier}</p>
          </div>
        )}

        {/* ✅ Micro-close 2: See what fundable looked like — 3 shown, rest greyed */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            {result ? 'What funded companies looked like' : 'What fundable companies look like'}
          </p>
          <div className="space-y-2">
            {shown.map((c) => (
              <div key={c.name} className="flex items-center gap-3 text-sm">
                <div className="flex-1">
                  <span className="font-semibold text-slate-900">{c.name}</span>
                  <span className="text-slate-400 text-xs ml-2">{c.domain}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-slate-500">{c.score}/8</span>
                  <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden mt-1 ml-auto">
                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(c.score / 8) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
            {/* Greyed out preview of hidden companies */}
            {hidden.map((c) => (
              <div key={c.name} className="flex items-center gap-3 text-sm opacity-30">
                <div className="flex-1">
                  <span className="font-semibold text-slate-900">{c.name}</span>
                  <span className="text-slate-400 text-xs ml-2">{c.domain}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-slate-400">{c.score}/8</span>
                  <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden mt-1 ml-auto">
                    <div className="h-full bg-gray-300 rounded-full" style={{ width: `${(c.score / 8) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">{COMPANIES.length - 3} more funded companies in the full database</p>
        </div>

        {/* ✅ Micro-close 3: Access — subscribe or start a campaign */}
        <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl p-6 text-white text-center">
          <p className="font-bold text-lg mb-1">See all {COMPANIES.length}+ funded companies</p>
          <p className="text-white/75 text-sm mb-5">
            Get full access to the database — plus a campaign that puts your startup in front of 3 real funders.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/create"
              className="flex-1 px-5 py-3 rounded-xl bg-white text-violet-700 font-semibold text-sm hover:bg-violet-50 transition-colors"
            >
              Start a campaign (free) →
            </Link>
            <button
              className="flex-1 px-5 py-3 rounded-xl border border-white/40 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
              onClick={() => alert('Subscription coming soon. Email hello@aurrinventures.com for early access.')}
            >
              Pay $20/month
            </button>
          </div>
        </div>

        {/* ✅ Micro-close 4: Share */}
        {result && (
          <div className="text-center">
            <button
              onClick={() => {
                const text = `My startup scored ${result.score}/${result.maxScore} on @AurrinVentures. ${result.tier} — is yours fundable?`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="text-sm text-slate-400 hover:text-slate-600 underline"
            >
              Share your result on X →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
