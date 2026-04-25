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

const PREVIEW_COMPANIES = [
  { name: 'Levyne', score: 75 },
  { name: 'SynthGrid', score: 50 },
  { name: 'Serenity Power', score: 50 },
];

export default function ValidateForm() {
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
    } catch { setError('Failed to validate. Try again.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-lg mx-auto">
      {!result ? (
        <form onSubmit={handleValidate}>
          <div className="flex gap-2">
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourstartup.com"
              className="flex-1 px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600 text-sm shadow-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
            >
              {loading ? 'Checking...' : 'Check →'}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-2 text-left">{error}</p>}
        </form>
      ) : (
        <div className="space-y-3 animate-in fade-in duration-300">
          {/* Score */}
          <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-center min-w-[56px]">
              <div className="text-2xl font-extrabold text-slate-900">{result.score}/{result.maxScore}</div>
              <div className="text-xs text-slate-400">signals</div>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                <div
                  className={`h-full rounded-full ${result.pct >= 75 ? 'bg-emerald-500' : result.pct >= 50 ? 'bg-violet-600' : 'bg-amber-500'}`}
                  style={{ width: `${result.pct}%` }}
                />
              </div>
              <p className="text-sm font-semibold text-slate-900">{result.tier}</p>
            </div>
            <button
              onClick={() => { setResult(null); setUrl(''); }}
              className="text-xs text-slate-400 hover:text-slate-600 underline ml-2 shrink-0"
            >
              Try another
            </button>
          </div>

          {/* 3 companies shown */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">What fundable looks like</p>
            <div className="space-y-2">
              {PREVIEW_COMPANIES.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(c.score / 8) * 100}%` }} />
                    </div>
                    <span className="text-xs text-slate-400">{c.score}/8</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm opacity-30">
                <span className="font-medium text-slate-400">5 more companies</span>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-300 rounded-full" style={{ width: '50%' }} />
                  </div>
                  <span className="text-xs text-slate-400">—</span>
                </div>
              </div>
            </div>
          </div>

          {/* Access CTA — two equal options */}
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl p-4 text-white text-center">
            <p className="font-semibold text-sm mb-2">See all funded companies</p>
            <div className="flex flex-col gap-2">
              <Link
                href="/create"
                className="block w-full px-4 py-2.5 rounded-lg bg-white text-violet-700 font-semibold text-sm text-center hover:bg-violet-50 transition-colors"
              >
                Start a campaign (free) →
              </Link>
              <button
                className="block w-full px-4 py-2.5 rounded-lg border border-white/40 text-white font-semibold text-sm text-center hover:bg-white/10 transition-colors"
                onClick={() => alert('Subscription coming soon. Email hello@aurrinventures.com for early access.')}
              >
                or pay $20/month
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
