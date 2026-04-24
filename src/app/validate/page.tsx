'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Signal {
  id: string;
  label: string;
  value: boolean;
}

interface ValidationResult {
  domain: string;
  title: string;
  description: string;
  score: number;
  maxScore: number;
  pct: number;
  tier: string;
  signals: Signal[];
  missingSignals: string[];
  strongSignals: string[];
  url: string;
}

export default function ValidatePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preloaded, setPreloaded] = useState(false);

  // Check for results passed via URL params (from homepage)
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const score = sp.get('score');
    const max = sp.get('max');
    const pct = sp.get('pct');
    const tier = sp.get('tier');
    const domain = sp.get('domain');
    if (score && max && pct && tier && domain) {
      setResult({
        score: parseInt(score),
        maxScore: parseInt(max),
        pct: parseInt(pct),
        tier: decodeURIComponent(tier),
        domain: decodeURIComponent(domain),
        title: '',
        description: '',
        signals: [],
        missingSignals: [],
        strongSignals: [],
        url: '',
      });
      setPreloaded(true);
    }
  }, []);

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
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }
      setResult(data);
    } catch {
      setError('Failed to validate. Check the URL and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-teal-600 mb-3">Aurrin Ventures</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Get Validated</h1>
        <p className="text-slate-500 max-w-md mx-auto">
          Enter your startup URL. Get an instant readout on whether it looks fundable — based on signals from hundreds of pitches and investor reviews.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleValidate} className="mb-10">
        <div className="flex gap-2">
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourstartup.com"
            className="flex-1 px-4 py-3.5 rounded-xl border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
          >
            {loading ? 'Checking...' : 'Validate →'}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </form>

      {/* Result */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Score card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
            <div className="text-sm text-slate-500 mb-2">{result.domain}</div>
            <div className="text-6xl font-extrabold text-slate-900 mb-1">{result.score}/{result.maxScore}</div>
            <div className="text-sm text-slate-400 mb-4">signals detected</div>

            {/* Score bar */}
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full rounded-full transition-all ${
                  result.pct >= 75 ? 'bg-emerald-500' :
                  result.pct >= 50 ? 'bg-teal-500' :
                  result.pct >= 25 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${result.pct}%` }}
              />
            </div>

            <p className="text-base font-semibold text-slate-900">{result.tier}</p>

            {result.title && (
              <p className="text-sm text-slate-500 mt-2">{result.title}</p>
            )}
          </div>

          {/* Signals breakdown */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4">What we found</h3>

            {result.strongSignals.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">✓ Strong signals</p>
                <div className="space-y-1">
                  {result.strongSignals.map((s) => (
                    <div key={s} className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="text-emerald-500">✓</span> {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.missingSignals.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-2">✗ Missing signals</p>
                <div className="space-y-1">
                  {result.missingSignals.map((s) => (
                    <div key={s} className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="text-rose-400">—</span> {s}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="bg-slate-900 rounded-2xl p-6 text-center">
            <p className="text-white font-semibold mb-1">Want real feedback from investors?</p>
            <p className="text-slate-400 text-sm mb-4">
              Submit your startup to the Aurrin community — founders and investors who've seen what gets funded.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                href="/pitch-night"
                className="px-5 py-2.5 rounded-full bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-colors"
              >
                Submit for feedback →
              </Link>
              <Link
                href="/database"
                className="px-5 py-2.5 rounded-full border border-slate-600 text-slate-300 font-semibold text-sm hover:bg-slate-800 transition-colors"
              >
                See funded companies →
              </Link>
            </div>
          </div>

          {/* Share */}
          <div className="text-center">
            <button
              onClick={() => {
                const text = `My startup just validated on @AurrinVentures — ${result.pct}% fundable signal score. ${result.tier} ${url}`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="text-sm text-slate-500 hover:text-slate-700 underline"
            >
              Share your result on X →
            </button>
          </div>
        </div>
      )}

      {/* Placeholder state */}
      {!result && !loading && !error && (
        <div className="space-y-6">
          <div className="text-center py-10 text-slate-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">Enter your startup URL above to get your validation score</p>
          </div>

          {/* How it works */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4">What we're checking</h3>
            <div className="space-y-2 text-sm text-slate-600">
              {[
                'Is there a pricing page or clear value proposition?',
                'Does the site signal a real team?',
                'Is there a waiting list or early access signal?',
                'Is the copy specific — or does it sound like AI generated?',
                'Are they actively hiring, blogging, building in public?',
              ].map((q, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-teal-500 font-bold">{i + 1}.</span>
                  {q}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-slate-400">
              Based on signals from {87}+ funded companies and investor reviews.{' '}
              <Link href="/database" className="text-teal-600 hover:text-teal-700">
                See the database →
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
