'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { CampaignFormData } from './types';

const STEPS = [
  { id: 'goal', label: 'Goal', icon: '1' },
  { id: 'story', label: 'Story', icon: '2' },
  { id: 'tiers', label: 'Tiers', icon: '3' },
  { id: 'preview', label: 'Preview', icon: '4' },
];

const CATEGORIES = [
  'Technology', 'Creative / Art', 'Community', 'Health',
  'Education', 'Environment', 'Food & Beverage', 'Sports', 'Other',
];

export default function CreatePage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Partial<CampaignFormData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function update<K extends keyof CampaignFormData>(key: K, value: CampaignFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handlePublish() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
    <div className="min-h-screen bg-white text-slate-900">
      {/* Step indicator */}
      <div className="border-b border-gray-200 bg-white px-6 py-5">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-400 font-medium">Step {step + 1} of {STEPS.length}</p>
            <p className="text-xs text-gray-400">{STEPS[step].label}</p>
          </div>
          <div className="flex items-center">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
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
                  {i < step ? '✓' : s.icon}
                </div>
                <span className="ml-2 hidden sm:inline text-sm">{s.label}</span>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 sm:w-16 h-px mx-2 ${i < step ? 'bg-teal-500' : 'bg-gray-200'}`} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && <GoalStep form={form} update={update} onNext={() => setStep(1)} />}
            {step === 1 && <StoryStep form={form} update={update} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
            {step === 2 && <TiersStep form={form} update={update} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
            {step === 3 && (
              <PreviewStep form={form} onBack={() => setStep(2)} onPublish={handlePublish} loading={loading} error={error} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Step 1: Goal ─────────────────────────────────────────────────────────────

function GoalStep({
  form,
  update,
  onNext,
}: {
  form: Partial<CampaignFormData>;
  update: <K extends keyof CampaignFormData>(k: K, v: CampaignFormData[K]) => void;
  onNext: () => void;
}) {
  const [title, setTitle] = useState(form.title ?? '');
  const [category, setCategory] = useState(form.category ?? '');
  const [goalDollars, setGoalDollars] = useState(form.funding_goal_cents ? form.funding_goal_cents / 100 : 500);
  const [duration, setDuration] = useState(form.duration_days ?? 30);

  function handleNext() {
    update('title', title);
    update('category', category);
    update('funding_goal_cents', Math.round(goalDollars * 100));
    update('duration_days', duration);
    if (!title.trim() || !category) return;
    onNext();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2 text-slate-900">What are you building?</h2>
        <p className="text-slate-500">Name your campaign and pick a category.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Campaign Name</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Bear Valley Rescue Equipment"
          maxLength={80}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-slate-900 placeholder:text-gray-400 outline-none focus:border-teal-500 focus:bg-white transition-all text-base"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                category === cat
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-gray-200 text-slate-500 hover:border-gray-300 hover:text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Funding Goal (CAD)</label>
          <input
            type="number"
            value={goalDollars}
            onChange={(e) => setGoalDollars(Number(e.target.value))}
            min={100}
            max={1000000}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-slate-900 outline-none focus:border-teal-500 focus:bg-white transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Duration (days)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min={7}
            max={90}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-slate-900 outline-none focus:border-teal-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={!title.trim() || !category}
        className="w-full bg-slate-900 text-white font-bold text-lg rounded-full py-4 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Next: Your Story →
      </button>
    </div>
  );
}

// ─── Step 2: Story ────────────────────────────────────────────────────────────

function StoryStep({
  form,
  update,
  onNext,
  onBack,
}: {
  form: Partial<CampaignFormData>;
  update: <K extends keyof CampaignFormData>(k: K, v: CampaignFormData[K]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [tagline, setTagline] = useState(form.tagline ?? '');
  const [story, setStory] = useState(form.story ?? '');

  function handleNext() {
    update('tagline', tagline);
    update('story', story);
    if (story.trim().length < 50) return;
    onNext();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2 text-slate-900">Tell your story.</h2>
        <p className="text-slate-500">Why are you raising? Where will every dollar go?</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">One-line pitch</label>
        <input
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="e.g. Equipment to rescue animals in northern Alberta"
          maxLength={120}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-slate-900 placeholder:text-gray-400 outline-none focus:border-teal-500 focus:bg-white transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Your story <span className="text-gray-400">(min 50 characters)</span>
        </label>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Share why this matters. Who are you? What problem are you solving? Where will every dollar go? Be specific — donors want to know exactly what they're funding."
          rows={9}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-slate-900 placeholder:text-gray-400 outline-none focus:border-teal-500 focus:bg-white transition-all resize-none leading-relaxed"
        />
        <p className="text-xs text-gray-400 mt-1.5 text-right">{story.length} characters</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-8 py-4 rounded-full border border-gray-200 text-slate-500 font-semibold hover:border-gray-300 hover:text-slate-700 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={story.trim().length < 50 || !tagline.trim()}
          className="flex-1 bg-slate-900 text-white font-bold text-lg rounded-full py-4 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Next: Pledge Tiers →
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Pledge Tiers ────────────────────────────────────────────────────

function TiersStep({
  form,
  update,
  onNext,
  onBack,
}: {
  form: Partial<CampaignFormData>;
  update: <K extends keyof CampaignFormData>(k: K, v: CampaignFormData[K]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const tiers = form.pledge_tiers ?? [
    { name: 'Early Backer', amount_cents: 2500, description: 'A thank you and your name on our donor wall.' },
    { name: 'Community Sponsor', amount_cents: 10000, description: 'All of the above + a branded rescue thank-you card.' },
    { name: 'Lead Patron', amount_cents: 25000, description: 'All of the above + an invite to the equipment unveiling event.' },
  ];

  function updateTier(i: number, field: string, value: string | number) {
    const updated = [...tiers];
    updated[i] = {
      ...updated[i],
      [field]: field === 'amount_cents' ? Math.round(Number(value) * 100) : value,
    };
    update('pledge_tiers', updated);
  }

  function addTier() {
    update('pledge_tiers', [...tiers, { name: '', amount_cents: 5000, description: '' }]);
  }

  function removeTier(i: number) {
    update('pledge_tiers', tiers.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2 text-slate-900">Set your pledge tiers.</h2>
        <p className="text-slate-500">What do backers get at each level? Add at least 2 tiers.</p>
      </div>

      <div className="space-y-4">
        {tiers.map((tier, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-teal-600">Tier {i + 1}</span>
              {tiers.length > 2 && (
                <button
                  onClick={() => removeTier(i)}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              type="text"
              value={tier.name}
              onChange={(e) => updateTier(i, 'name', e.target.value)}
              placeholder="Tier name (e.g. Early Backer)"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-gray-400 outline-none focus:border-teal-500 transition-all"
            />
            <div className="flex gap-3">
              <input
                type="number"
                value={tier.amount_cents / 100}
                onChange={(e) => updateTier(i, 'amount_cents', e.target.value)}
                min={1}
                placeholder="CAD"
                className="w-24 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-teal-500 transition-all"
              />
              <input
                type="text"
                value={tier.description}
                onChange={(e) => updateTier(i, 'description', e.target.value)}
                placeholder="What backers get at this tier"
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-gray-400 outline-none focus:border-teal-500 transition-all"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addTier}
        className="w-full py-3 rounded-xl border border-dashed border-gray-300 text-gray-400 text-sm hover:border-teal-500 hover:text-teal-600 transition-all"
      >
        + Add another tier
      </button>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-8 py-4 rounded-full border border-gray-200 text-slate-500 font-semibold hover:border-gray-300 hover:text-slate-700 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={tiers.length < 2 || tiers.some((t) => !t.name || t.amount_cents <= 0)}
          className="flex-1 bg-slate-900 text-white font-bold text-lg rounded-full py-4 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Next: Preview →
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: Preview ─────────────────────────────────────────────────────────

function PreviewStep({
  form,
  onBack,
  onPublish,
  loading,
  error,
}: {
  form: Partial<CampaignFormData>;
  onBack: () => void;
  onPublish: () => void;
  loading: boolean;
  error: string | null;
}) {
  const raised = form.funding_goal_cents ? Math.round(form.funding_goal_cents * 0.05) : 0;
  const pct = form.funding_goal_cents ? Math.round((raised / form.funding_goal_cents) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2 text-slate-900">Review & publish.</h2>
        <p className="text-slate-500">This is how your campaign will look to donors.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-violet-600 to-teal-500" />
        <div className="p-6 space-y-4">
          {form.category && (
            <p className="text-xs text-teal-600 uppercase tracking-widest font-medium">
              {form.category}
            </p>
          )}
          <h3 className="text-xl font-bold text-slate-900">{form.title || 'Your Campaign'}</h3>
          {form.tagline && <p className="text-slate-500 text-sm">{form.tagline}</p>}

          <div>
            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-teal-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              ${(raised / 100).toLocaleString('en-CA', { minimumFractionDigits: 0 })} raised · {pct}% funded
            </p>
          </div>

          {form.pledge_tiers && form.pledge_tiers.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Pledge options</p>
              {form.pledge_tiers.map((tier, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate-600">{tier.name}</span>
                  <span className="font-bold text-teal-600">
                    ${new Intl.NumberFormat('en-CA', { minimumFractionDigits: 0 }).format(tier.amount_cents / 100)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-8 py-4 rounded-full border border-gray-200 text-slate-500 font-semibold hover:border-gray-300 hover:text-slate-700 disabled:opacity-50 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={onPublish}
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-violet-600 to-teal-500 text-white font-bold text-lg rounded-full py-4 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Publishing...' : '🎉 Publish My Campaign'}
        </button>
      </div>
    </div>
  );
}
