'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const CAMPAIGN_TYPES = [
  { id: 'community', label: 'Community Project', emoji: '🏘️', description: 'Local initiatives, non-profits, events' },
  { id: 'startup', label: 'Business Startup', emoji: '🚀', description: 'Commercial ventures and new businesses' },
  { id: 'emergency', label: 'Emergency / Relief', emoji: '🚨', description: 'Urgent needs and crisis response' },
  { id: 'creative', label: 'Creative / Art', emoji: '🎨', description: 'Art, music, film, creative projects' },
  { id: 'research', label: 'Research / Education', emoji: '🔬', description: 'Academic, scientific, or learning projects' },
];

const AMOUNTS = [
  { value: 5000, label: '$500', description: 'Micro-campaign' },
  { value: 10000, label: '$1,000', description: 'Small project' },
  { value: 25000, label: '$2,500', description: 'Community goal' },
  { value: 50000, label: '$5,000', description: 'Solid campaign' },
  { value: 100000, label: '$10,000', description: 'Big goal' },
  { value: 250000, label: '$25,000', description: 'Major initiative' },
];

const DURATIONS = [
  { value: 7, label: '1 week' },
  { value: 14, label: '2 weeks' },
  { value: 30, label: '1 month' },
  { value: 60, label: '2 months' },
];

const STEPS = [
  { id: 'type', label: 'Type' },
  { id: 'details', label: 'Details' },
  { id: 'preview', label: 'Preview' },
];

export default function CreatePage() {
  const [step, setStep] = useState(0);
  const [campaignType, setCampaignType] = useState('');
  const [amount, setAmount] = useState<number>(25000);
  const [duration, setDuration] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handlePublish() {
    setLoading(true);
    setError(null);
    const type = CAMPAIGN_TYPES.find((t) => t.id === campaignType);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${type?.label ?? 'My'} Campaign`,
          tagline: `A ${type?.label.toLowerCase()} campaign`,
          story: `This is a ${type?.label.toLowerCase()} campaign on Aurrin Crowdfunding. Every dollar goes directly toward making this happen.`,
          category: campaignType,
          funding_goal_cents: amount,
          duration_days: duration,
          pledge_tiers: [
            { name: 'Backer', amount_cents: Math.round(amount * 0.1) || 500, description: 'A sincere thank you and your name on our donor wall.' },
            { name: 'Supporter', amount_cents: Math.round(amount * 0.3) || 1500, description: 'All of the above + a personalized thank-you note.' },
            { name: 'Champion', amount_cents: Math.round(amount * 0.6) || 3000, description: 'All of the above + an invite to the launch event.' },
          ],
        }),
      });
      if (!res.ok) throw new Error('Failed to create campaign');
      const { id } = await res.json();
      router.push(`/campaigns/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-slate-900">
      {/* Step indicator */}
      <div className="border-b border-gray-200 bg-white px-6 py-5">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">
              Step {step + 1} of {STEPS.length}
            </span>
            <span className="text-xs text-gray-400">{STEPS[step].label}</span>
          </div>
          <div className="flex items-center">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center text-sm font-medium ${
                    i === step ? 'text-slate-900' : i < step ? 'text-teal-600 cursor-pointer' : 'text-gray-300'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                      i === step
                        ? 'border-teal-500 bg-teal-50 text-teal-600'
                        : i < step
                        ? 'border-teal-500 bg-teal-500 text-white'
                        : 'border-gray-200 text-gray-300'
                    }`}
                  >
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className="ml-2 hidden sm:inline text-sm">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-3 ${i < step ? 'bg-teal-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.18 }}
          >
            {step === 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-1">What are you raising for?</h2>
                <p className="text-slate-500 mb-8">Pick the type that fits best.</p>
                <div className="grid grid-cols-1 gap-3">
                  {CAMPAIGN_TYPES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setCampaignType(t.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                        campaignType === t.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{t.emoji}</span>
                      <div>
                        <p className="font-semibold text-slate-900">{t.label}</p>
                        <p className="text-xs text-slate-500">{t.description}</p>
                      </div>
                      {campaignType === t.id && (
                        <div className="ml-auto w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => campaignType && setStep(1)}
                  disabled={!campaignType}
                  className="w-full mt-8 bg-slate-900 text-white font-bold text-base rounded-full py-4 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-1">Set your goal.</h2>
                <p className="text-slate-500 mb-8">How much do you need and how long?</p>

                <div className="mb-8">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Funding amount</p>
                  <div className="grid grid-cols-3 gap-2">
                    {AMOUNTS.map((a) => (
                      <button
                        key={a.value}
                        onClick={() => setAmount(a.value)}
                        className={`py-3 px-2 rounded-xl border-2 text-center transition-all ${
                          amount === a.value
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <p className="font-bold text-slate-900">{a.label}</p>
                        <p className="text-xs text-slate-500">{a.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Campaign duration</p>
                  <div className="grid grid-cols-4 gap-2">
                    {DURATIONS.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setDuration(d.value)}
                        className={`py-3 rounded-xl border-2 text-center transition-all ${
                          duration === d.value
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <p className="font-bold text-sm text-slate-900">{d.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(0)}
                    className="px-8 py-4 rounded-full border border-gray-200 text-slate-600 font-semibold hover:border-gray-300 transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-slate-900 text-white font-bold text-base rounded-full py-4 hover:bg-slate-700 transition-all"
                  >
                    Next: Preview →
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-1">Looks good?</h2>
                <p className="text-slate-500 mb-8">Here's the campaign card as donors will see it.</p>

                {/* Preview card */}
                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-violet-600 to-teal-500" />
                  <div className="p-6 space-y-4">
                    {(() => {
                      const type = CAMPAIGN_TYPES.find((t) => t.id === campaignType);
                      return (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{type?.emoji}</span>
                            <p className="text-xs text-teal-600 uppercase tracking-widest font-semibold">
                              {type?.label}
                            </p>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">
                            {type?.label} Campaign
                          </h3>
                          <p className="text-slate-500 text-sm">
                            A {type?.label.toLowerCase()} on Aurrin Crowdfunding
                          </p>
                          <div>
                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-teal-500 w-0" />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              $0 raised · 0% · {duration} days remaining
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Pledge options</p>
                            {[
                              { name: 'Backer', amount: Math.round(amount * 0.1) || 500 },
                              { name: 'Supporter', amount: Math.round(amount * 0.3) || 1500 },
                              { name: 'Champion', amount: Math.round(amount * 0.6) || 3000 },
                            ].map((tier) => (
                              <div key={tier.name} className="flex justify-between text-sm">
                                <span className="text-slate-600">{tier.name}</span>
                                <span className="font-bold text-teal-600">
                                  ${new Intl.NumberFormat('en-CA', { minimumFractionDigits: 0 }).format(tier.amount / 100)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="px-8 py-4 rounded-full border border-gray-200 text-slate-600 font-semibold hover:border-gray-300 disabled:opacity-50 transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-teal-500 text-white font-bold text-base rounded-full py-4 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? 'Publishing...' : '🎉 Publish Campaign'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
