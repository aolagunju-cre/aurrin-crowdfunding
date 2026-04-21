'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { CampaignFormData } from './types';

const STEPS = [
  { id: 'goal', label: 'Goal', description: 'What are you building?' },
  { id: 'story', label: 'Story', description: 'Tell your story' },
  { id: 'tiers', label: 'Tiers', description: 'Set your pledge rewards' },
  { id: 'preview', label: 'Preview', description: 'Review & publish' },
];

export default function CreatePage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Partial<CampaignFormData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  function updateField<K extends keyof CampaignFormData>(key: K, value: CampaignFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const current = STEPS[step];

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Top bar */}
      <div className="border-b border-white/10 px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-montserrat font-bold text-white tracking-wide">AURRIN</span>
            <span className="text-default-500 text-sm">CROWDFUNDING</span>
          </div>
          <span className="text-sm text-default-500">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
      </div>

      {/* Step indicator */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    i === step
                      ? 'text-white'
                      : i < step
                      ? 'text-teal cursor-pointer hover:opacity-80'
                      : 'text-default-600 cursor-default'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                      i === step
                        ? 'border-teal bg-teal/20 text-teal'
                        : i < step
                        ? 'border-teal bg-teal text-navy'
                        : 'border-white/20 text-default-600'
                    }`}
                  >
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px ${i < step ? 'bg-teal' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {step === 0 && (
                <GoalStep form={form} update={updateField} onNext={() => setStep(1)} />
              )}
              {step === 1 && (
                <StoryStep form={form} update={updateField} onNext={() => setStep(2)} onBack={() => setStep(0)} />
              )}
              {step === 2 && (
                <TiersStep form={form} update={updateField} onNext={() => setStep(3)} onBack={() => setStep(1)} />
              )}
              {step === 3 && (
                <PreviewStep
                  form={form}
                  onBack={() => setStep(2)}
                  onPublish={handlePublish}
                  loading={loading}
                  error={error}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Goal ────────────────────────────────────────────────────────────

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
  const [goalCents, setGoalCents] = useState(form.funding_goal_cents ?? 50000);
  const [duration, setDuration] = useState(form.duration_days ?? 30);

  const categories = [
    'Technology', 'Creative / Art', 'Community', 'Health', 'Education',
    'Environment', 'Food & Beverage', 'Sports', 'Other',
  ];

  function handleNext() {
    update('title', title);
    update('category', category);
    update('funding_goal_cents', goalCents);
    update('duration_days', duration);
    if (!title.trim() || !category) return;
    onNext();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-montserrat font-bold mb-2">What are you building?</h2>
        <p className="text-default-500">Give your campaign a name and tell us the category.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">Campaign Name *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Bear Valley Rescue Equipment"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-default-600 outline-none focus:border-teal transition-colors"
            maxLength={80}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  category === cat
                    ? 'border-teal bg-teal/20 text-teal'
                    : 'border-white/10 text-default-400 hover:border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">Funding Goal (CAD)</label>
            <input
              type="number"
              value={goalCents / 100}
              onChange={(e) => setGoalCents(Math.round(Number(e.target.value) * 100))}
              min={100}
              max={1000000}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Campaign Duration (days)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min={7}
              max={90}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-teal"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={!title.trim() || !category}
        className="w-full py-4 rounded-full bg-white text-navy font-bold text-lg hover:bg-teal/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next: Your Story →
      </button>
    </div>
  );
}

// ─── Step 2: Story ───────────────────────────────────────────────────────────

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
  const [story, setStory] = = useState(form.story ?? '');
  const [goalAmount, setGoalAmount] = useState(
    form.funding_goal_cents ? form.funding_goal_cents / 100 : 500
  );

  function handleNext() {
    update('tagline', tagline);
    update('story', story);
    if (story.length < 50) return;
    onNext();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-montserrat font-bold mb-2">Tell your story.</h2>
        <p className="text-default-500">Why are you raising? What will the money fund?</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">One-line pitch</label>
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="e.g. Equipment to rescue animals in northern Alberta"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-default-600 outline-none focus:border-teal"
            maxLength={120}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Your story <span className="text-default-600">(min 50 chars)</span>
          </label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Share why this matters. Who are you? What problem are you solving? Where will every dollar go? Be specific — donors want to know exactly what they're funding."
            rows={10}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-default-600 outline-none focus:border-teal resize-none leading-relaxed"
          />
          <p className="text-xs text-right mt-1 text-default-600">{story.length} characters</p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-8 py-4 rounded-full border border-white/10 text-default-400 font-semibold hover:border-white/30 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={story.length < 50 || !tagline.trim()}
          className="flex-1 py-4 rounded-full bg-white text-navy font-bold text-lg hover:bg-teal/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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

  function updateTier(index: number, field: string, value: string | number) {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: field === 'amount_cents' ? Math.round(Number(value) * 100) : value };
    update('pledge_tiers', updated);
  }

  function addTier() {
    update('pledge_tiers', [...tiers, { name: '', amount_cents: 5000, description: '' }]);
  }

  function removeTier(index: number) {
    update('pledge_tiers', tiers.filter((_, i) => i !== index));
  }

  function formatAmount(cents: number) {
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0 }).format(cents / 100);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-montserrat font-bold mb-2">Set your pledge tiers.</h2>
        <p className="text-default-500">What do backers get at each level? Add at least 2 tiers.</p>
      </div>

      <div className="space-y-5">
        {tiers.map((tier, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
            <div className="flex items-start justify-between">
              <span className="text-sm font-bold text-teal">Tier {i + 1}</span>
              {tiers.length > 2 && (
                <button onClick={() => removeTier(i)} className="text-xs text-default-600 hover:text-red-400 transition-colors">
                  Remove
                </button>
              )}
            </div>
            <input
              value={tier.name}
              onChange={(e) => updateTier(i, 'name', e.target.value)}
              placeholder="Tier name (e.g. Early Backer)"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-default-600 outline-none focus:border-teal"
            />
            <div className="flex gap-3">
              <input
                type="number"
                value={tier.amount_cents / 100}
                onChange={(e) => updateTier(i, 'amount_cents', e.target.value)}
                min={1}
                className="w-28 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-teal"
              />
              <input
                value={tier.description}
                onChange={(e) => updateTier(i, 'description', e.target.value)}
                placeholder="What backers get at this tier"
                className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-default-600 outline-none focus:border-teal"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addTier}
        className="w-full py-3 rounded-xl border border-dashed border-white/20 text-default-500 text-sm hover:border-teal hover:text-teal transition-colors"
      >
        + Add another tier
      </button>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-8 py-4 rounded-full border border-white/10 text-default-400 font-semibold hover:border-white/30 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={tiers.length < 2 || tiers.some((t) => !t.name || t.amount_cents <= 0)}
          className="flex-1 py-4 rounded-full bg-white text-navy font-bold text-lg hover:bg-teal/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next: Preview →
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: Preview + Publish ───────────────────────────────────────────────

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
  const raised = form.funding_goal_cents ? Math.round(form.funding_goal_cents * 0.1) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-montserrat font-bold mb-2">Review & publish.</h2>
        <p className="text-default-500">This is how your campaign will look to donors.</p>
      </div>

      {/* Mock campaign card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <div>
          {form.category && (
            <p className="text-xs text-teal uppercase tracking-wider mb-2">{form.category}</p>
          )}
          <h3 className="text-xl font-bold">{form.title || 'Campaign Name'}</h3>
          {form.tagline && <p className="text-default-400 text-sm mt-1">{form.tagline}</p>}
        </div>
        <div>
          <div className="w-full h-2 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-violet to-teal w-[10%]" />
          </div>
          <p className="text-xs text-default-600 mt-1">
            ${(raised / 100).toLocaleString('en-CA', { minimumFractionDigits: 0 })} raised ·{' '}
            {(form.funding_goal_cents ?? 0) > 0
              ? Math.round((raised / (form.funding_goal_cents ?? 1)) * 100)
              : 0}% funded
          </p>
        </div>
        {form.pledge_tiers && form.pledge_tiers.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-default-600 uppercase tracking-wider">Pledge options</p>
            {form.pledge_tiers.map((tier, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-default-300">{tier.name}</span>
                <span className="font-bold text-teal">
                  ${new Intl.NumberFormat('en-CA', { minimumFractionDigits: 0 }).format(tier.amount_cents / 100)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-4 py-3">{error}</p>
      )}

      <div className="flex gap-4">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-8 py-4 rounded-full border border-white/10 text-default-400 font-semibold hover:border-white/30 disabled:opacity-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onPublish}
          disabled={loading}
          className="flex-1 py-4 rounded-full bg-gradient-to-r from-violet to-teal text-white font-bold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {loading ? 'Publishing...' : '🎉 Publish My Campaign'}
        </button>
      </div>
    </div>
  );
}
