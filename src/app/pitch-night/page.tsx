'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function PitchNightPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    founderName: '',
    companyName: '',
    oneLiner: '',
    linkedinUrl: '',
    companyLinkedinUrl: '',
    eventContext: 'is pitching at Aurrin Ventures Energy Pitch Night.',
    eventDate: 'April 29, 2026',
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/pitch-night', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }
      setSuccess(true);
    } catch {
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Submitted!</h1>
        <p className="text-slate-500 mb-6">
          {form.founderName}&apos;s info is saved. Tell Abdul-Samad to draft your post.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setForm({
              founderName: '',
              companyName: '',
              oneLiner: '',
              linkedinUrl: '',
              companyLinkedinUrl: '',
              eventContext: 'is pitching at Aurrin Ventures Energy Pitch Night.',
              eventDate: 'April 29, 2026',
            });
          }}
          className="text-sm text-slate-500 hover:text-slate-900 underline"
        >
          Submit another founder
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-teal-600 mb-3">Founder Submission</p>
        <h1 className="text-3xl font-bold text-slate-900">Pitch Night</h1>
        <p className="text-slate-500 mt-2">Fill this out to get your LinkedIn post drafted.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Founder Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Founder name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.founderName}
            onChange={(e) => update('founderName', e.target.value)}
            placeholder="e.g. Joshua Strub"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Company name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.companyName}
            onChange={(e) => update('companyName', e.target.value)}
            placeholder="e.g. SynthGrid"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* One-liner */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            What do they fix or build? <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={form.oneLiner}
            onChange={(e) => update('oneLiner', e.target.value)}
            placeholder="e.g. An independent performance certification for battery energy storage systems. By ingesting real operating data and applying physics-based validation, they produce reports that lenders, insurers, and regulators can trust."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-slate-400 mt-1">Copy from their pitch or description. I'll make it punchy.</p>
        </div>

        {/* LinkedIn Profile */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Founder LinkedIn URL
          </label>
          <input
            type="url"
            value={form.linkedinUrl}
            onChange={(e) => update('linkedinUrl', e.target.value)}
            placeholder="https://www.linkedin.com/in/joshuastrub"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Company LinkedIn */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Company LinkedIn URL
          </label>
          <input
            type="url"
            value={form.companyLinkedinUrl}
            onChange={(e) => update('companyLinkedinUrl', e.target.value)}
            placeholder="https://www.linkedin.com/company/synthgrid"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Event Context */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Event context <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.eventContext}
            onChange={(e) => update('eventContext', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <p className="text-xs text-slate-400 mt-1">e.g. "is pitching at Aurrin Ventures Energy Pitch Night."</p>
        </div>

        {/* Event Date */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Event date
          </label>
          <input
            type="text"
            value={form.eventDate}
            onChange={(e) => update('eventDate', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Founder'}
        </button>
      </form>
    </div>
  );
}
