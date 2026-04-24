'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ValidateForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    score: number;
    maxScore: number;
    pct: number;
    tier: string;
    domain: string;
  } | null>(null);
  const router = useRouter();

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
      // Navigate to validate page with result in URL params for shareability
      router.push(`/validate?url=${encodeURIComponent(url.trim())}&score=${data.score}&max=${data.maxScore}&pct=${data.pct}&tier=${encodeURIComponent(data.tier)}&domain=${encodeURIComponent(data.domain)}`);
    } catch {
      setError('Failed to validate. Check the URL and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleValidate} className="max-w-md mx-auto">
      <div className="flex gap-2">
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yourstartup.com"
          className="flex-1 px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3.5 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-400 transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
        >
          {loading ? 'Checking...' : 'Validate →'}
        </button>
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-2 text-left">{error}</p>
      )}
    </form>
  );
}
