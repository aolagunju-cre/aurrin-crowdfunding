'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Input,
  Textarea,
  Button,
  RadioGroup,
  Radio,
  Card,
  CardBody,
} from '@heroui/react';
import type { CampaignFormData } from './types';

const STEPS = [
  { id: 'goal', label: 'Goal', icon: '1' },
  { id: 'story', label: 'Story', icon: '2' },
  { id: 'tiers', label: 'Tiers', icon: '3' },
  { id: 'preview', label: 'Preview', icon: '4' },
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

  function update<K extends keyof CampaignFormData>(key: K, value: CampaignFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="min-h-screen bg-[#0D1B2E] text-[#F1F3F2]">
      {/* Nav */}
      <div className="border-b border-white/10 px-6 py-5">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Aurrin" className="h-8 w-auto" />
            <span className="font-montserrat font-bold text-sm tracking-widest text-[#F1F3F2]">CROWDFUNDING</span>
          </div>
          <span className="text-sm text-white/40 font-medium">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
      </div>

      {/* Step indicator */}
      <div className="border-b border-white/10 px-6 py-5">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  i === step
                    ? 'text-white'
                    : i < step
                    ? 'text-[#2EE5F2] cursor-pointer hover:opacity-80'
                    : 'text-white/30'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                    i === step
                      ? 'border-[#2EE5F2] bg-[#2EE5F2]/10 text-[#2EE5F2]'
                      : i < step
                      ? 'border-[#2EE5F2] bg-[#2EE5F2] text-[#0D1B2E]'
                      : 'border-white/20 text-white/30'
                  }`}
                >
                  {i < step ? '✓' : s.icon}
                </div>
                <span className="hidden sm:inline">{s.label}</span>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 sm:w-16 h-px mx-2 ${i < step ? 'bg-[#2EE5F2]' : 'bg-white/10'}`} />
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
  );
}

// ─── Step 1: Goal ───────────────────────────────────────────────────────────

const CATEGORIES = [
  'Technology', 'Creative / Art', 'Community', 'Health',
  'Education', 'Environment', 'Food & Beverage', 'Sports', 'Other',
];

type UpdateFn = (key: keyof CampaignFormData, value: unknown) => void;

function GoalStep({
  form,
  update,
  onNext,
}: {
  form: Partial<CampaignFormData>;
  update: UpdateFn;
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
        <h2 className="text-3xl font-montserrat font-bold mb-2">What are you building?</h2>
        <p className="text-white/50">Name your campaign and pick a category.</p>
      </div>

      <Input
        label="Campaign Name"
        placeholder="e.g. Bear Valley Rescue Equipment"
        value={title}
        onValueChange={setTitle}
        variant="bordered"
        classNames={{
          label: 'text-white/70 text-sm font-medium',
          input: 'text-white placeholder:text-white/30',
          inputWrapper: 'border-white/20 bg-white/5 hover:border-white/40 focus-within:border-[#2EE5F2] rounded-xl',
          errorMessage: 'text-red-400',
        }}
        maxLength={80}
        fullWidth
      />

      <RadioGroup
        label={<span className="text-white/70 text-sm font-medium">Category</span>}
        value={category}
        onValueChange={setCategory}
        classNames={{ label: 'text-white/70', wrapper: 'gap-3 flex flex-wrap' }}
      >
        {CATEGORIES.map((cat) => (
          <Radio key={cat} value={cat} classNames={{ label: 'text-white/70 text-sm' }}>
            {cat}
          </Radio>
        ))}
      </RadioGroup>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Funding Goal (CAD)"
          type="number"
          value={String(goalDollars)}
          onValueChange={(v) => setGoalDollars(Number(v))}
          variant="bordered"
          min={100}
          max={1000000}
          classNames={{
            label: 'text-white/70 text-sm font-medium',
            input: 'text-white',
            inputWrapper: 'border-white/20 bg-white/5 hover:border-white/40 focus-within:border-[#2EE5F2] rounded-xl',
          }}
          fullWidth
        />
        <Input
          label="Duration (days)"
          type="number"
          value={String(duration)}
          onValueChange={(v) => setDuration(Number(v))}
          variant="bordered"
          min={7}
          max={90}
          classNames={{
            label: 'text-white/70 text-sm font-medium',
            input: 'text-white',
            inputWrapper: 'border-white/20 bg-white/5 hover:border-white/40 focus-within:border-[#2EE5F2] rounded-xl',
          }}
          fullWidth
        />
      </div>

      <Button
        onPress={handleNext}
        isDisabled={!title.trim() || !category}
        className="w-full bg-white text-[#0D1B2E] font-bold text-lg rounded-full py-6 hover:bg-[#2EE5F2] disabled:opacity-40"
      >
        Next: Your Story →
      </Button>
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
  update: UpdateFn;
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
        <h2 className="text-3xl font-montserrat font-bold mb-2">Tell your story.</h2>
        <p className="text-white/50">Why are you raising? Where will every dollar go?</p>
      </div>

      <Input
        label="One-line pitch"
        placeholder="e.g. Equipment to rescue animals in northern Alberta"
        value={tagline}
        onValueChange={setTagline}
        variant="bordered"
        classNames={{
          label: 'text-white/70 text-sm font-medium',
          input: 'text-white placeholder:text-white/30',
          inputWrapper: 'border-white/20 bg-white/5 hover:border-white/40 focus-within:border-[#2EE5F2] rounded-xl',
        }}
        maxLength={120}
        fullWidth
      />

      <Textarea
        label="Your story"
        placeholder="Share why this matters. Who are you? What problem are you solving? Where will every dollar go? Be specific — donors want to know exactly what they're funding."
        value={story}
        onValueChange={setStory}
        variant="bordered"
        minRows={8}
        classNames={{
          label: 'text-white/70 text-sm font-medium mb-3',
          input: 'text-white placeholder:text-white/30 leading-relaxed',
          inputWrapper: 'border-white/20 bg-white/5 hover:border-white/40 focus-within:border-[#2EE5F2] rounded-xl text-white',
        }}
        fullWidth
      />
      <p className="text-xs text-white/30 -mt-4 text-right">{story.length} chars</p>

      <div className="flex gap-4">
        <Button
          onPress={onBack}
          variant="bordered"
          className="border-white/20 text-white/60 font-semibold rounded-full px-8 py-6 hover:border-white/40"
        >
          ← Back
        </Button>
        <Button
          onPress={handleNext}
          isDisabled={story.trim().length < 50 || !tagline.trim()}
          className="flex-1 bg-white text-[#0D1B2E] font-bold text-lg rounded-full py-6 hover:bg-[#2EE5F2] disabled:opacity-40"
        >
          Next: Pledge Tiers →
        </Button>
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
  update: UpdateFn;
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
    updated[i] = { ...updated[i], [field]: field === 'amount_cents' ? Math.round(Number(value) * 100) : value };
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
        <h2 className="text-3xl font-montserrat font-bold mb-2">Set your pledge tiers.</h2>
        <p className="text-white/50">What do backers get at each level? Add at least 2 tiers.</p>
      </div>

      <div className="space-y-5">
        {tiers.map((tier, i) => (
          <Card key={i} className="bg-white/5 border border-white/10 rounded-2xl">
            <CardBody className="gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#2EE5F2]">Tier {i + 1}</span>
                {tiers.length > 2 && (
                  <button
                    onClick={() => removeTier(i)}
                    className="text-xs text-white/30 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <Input
                label="Tier name"
                placeholder="e.g. Early Backer"
                value={tier.name}
                onValueChange={(v) => updateTier(i, 'name', v)}
                variant="bordered"
                size="sm"
                classNames={{
                  label: 'text-white/60 text-xs font-medium',
                  input: 'text-white placeholder:text-white/30',
                  inputWrapper: 'border-white/15 bg-black/20 hover:border-white/30 focus-within:border-[#2EE5F2] rounded-lg',
                }}
                fullWidth
              />
              <div className="flex gap-3">
                <Input
                  label="Amount (CAD)"
                  type="number"
                  value={String(tier.amount_cents / 100)}
                  onValueChange={(v) => updateTier(i, 'amount_cents', v)}
                  variant="bordered"
                  size="sm"
                  min={1}
                  classNames={{
                    label: 'text-white/60 text-xs font-medium',
                    input: 'text-white w-24',
                    inputWrapper: 'border-white/15 bg-black/20 hover:border-white/30 focus-within:border-[#2EE5F2] rounded-lg w-28',
                  }}
                />
                <Input
                  label="Description"
                  placeholder="What backers get at this tier"
                  value={tier.description}
                  onValueChange={(v) => updateTier(i, 'description', v)}
                  variant="bordered"
                  size="sm"
                  classNames={{
                    label: 'text-white/60 text-xs font-medium',
                    input: 'text-white placeholder:text-white/30',
                    inputWrapper: 'border-white/15 bg-black/20 hover:border-white/30 focus-within:border-[#2EE5F2] rounded-lg flex-1',
                  }}
                  fullWidth
                />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <button
        onClick={addTier}
        className="w-full py-3 rounded-xl border border-dashed border-white/20 text-white/40 text-sm hover:border-[#2EE5F2] hover:text-[#2EE5F2] transition-colors"
      >
        + Add another tier
      </button>

      <div className="flex gap-4">
        <Button
          onPress={onBack}
          variant="bordered"
          className="border-white/20 text-white/60 font-semibold rounded-full px-8 py-6 hover:border-white/40"
        >
          ← Back
        </Button>
        <Button
          onPress={onNext}
          isDisabled={tiers.length < 2 || tiers.some((t) => !t.name || t.amount_cents <= 0)}
          className="flex-1 bg-white text-[#0D1B2E] font-bold text-lg rounded-full py-6 hover:bg-[#2EE5F2] disabled:opacity-40"
        >
          Next: Preview →
        </Button>
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
  const raised = form.funding_goal_cents ? Math.round(form.funding_goal_cents * 0.05) : 0;
  const pct = form.funding_goal_cents ? Math.round((raised / form.funding_goal_cents) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-montserrat font-bold mb-2">Review & publish.</h2>
        <p className="text-white/50">This is how your campaign will look to donors.</p>
      </div>

      <Card className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <CardBody className="gap-4">
          {form.category && (
            <p className="text-xs text-[#2EE5F2] uppercase tracking-widest font-medium">
              {form.category}
            </p>
          )}
          <h3 className="text-xl font-bold">{form.title || 'Your Campaign'}</h3>
          {form.tagline && <p className="text-white/50 text-sm">{form.tagline}</p>}

          <div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#4831B0] to-[#2EE5F2] w-[5%]" />
            </div>
            <p className="text-xs text-white/30 mt-1">
              ${(raised / 100).toLocaleString('en-CA', { minimumFractionDigits: 0 })} raised · {pct}% funded
            </p>
          </div>

          {form.pledge_tiers && form.pledge_tiers.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-white/30 uppercase tracking-wider">Pledge options</p>
              {form.pledge_tiers.map((tier, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-white/60">{tier.name}</span>
                  <span className="font-bold text-[#2EE5F2]">
                    ${new Intl.NumberFormat('en-CA', { minimumFractionDigits: 0 }).format(tier.amount_cents / 100)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {error && (
        <div className="bg-red-400/10 border border-red-400/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button
          onPress={onBack}
          isDisabled={loading}
          variant="bordered"
          className="border-white/20 text-white/60 font-semibold rounded-full px-8 py-6 hover:border-white/40 disabled:opacity-50"
        >
          ← Back
        </Button>
        <Button
          onPress={onPublish}
          isLoading={loading}
          className="flex-1 bg-gradient-to-r from-[#4831B0] to-[#2EE5F2] text-white font-bold text-lg rounded-full py-6 hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Publishing...' : '🎉 Publish My Campaign'}
        </Button>
      </div>
    </div>
  );
}
