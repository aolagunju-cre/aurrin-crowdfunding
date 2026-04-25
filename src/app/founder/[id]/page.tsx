'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import QRCode from 'qrcode';

interface FounderProfile {
  id: string;
  pitch_number: number;
  founder_name: string;
  company_name: string;
  one_liner: string;
  linkedin_url?: string;
  event_context: string;
  event_date?: string;
  validation_score?: number;
  validation_max?: number;
  validation_pct?: number;
  validation_tier?: string;
}

interface FeedbackItem {
  id: string;
  feedback: string;
  voter_name?: string;
  created_at: string;
}

function QRCodeImage({ url, size = 160 }: { url: string; size?: number }) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    QRCode.toDataURL(url, {
      width: size,
      margin: 2,
      color: { dark: '#0D1B2E', light: '#FFFFFF' },
    }).then(setSrc).catch(() => {});
  }, [url, size]);
  if (!src) return <div className="w-40 h-40 bg-gray-100 rounded-2xl animate-pulse" />;
  return <img src={src} alt="QR Code" className="w-40 h-40 rounded-2xl shadow-sm" />;
}

export default function FounderProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const baseUrl = 'https://claw-aurrin-crowdfunding.vercel.app';
  const profileUrl = `${baseUrl}/founder/${id}`;

  // Mock data — in production this comes from pitch_night_submissions
  const FOUNDER_DATA: Record<string, FounderProfile> = {
    'joshua-strub': { id: 'joshua-strub', pitch_number: 1, founder_name: 'Joshua Strub', company_name: 'SynthGrid', one_liner: 'EnergyPassport — independent performance certification for battery energy storage systems. Think Moody\'s for battery infrastructure.', event_context: 'Energy Pitch Night', event_date: 'April 29, 2026', validation_score: 5, validation_max: 8, validation_pct: 63, validation_tier: 'Promising — a few gaps to close' },
    'luiz-di-grado': { id: 'luiz-di-grado', pitch_number: 2, founder_name: 'Luiz Felipe Di Grado', company_name: 'Inspekto AI', one_liner: 'AI that turns photos and audio into audit-ready inspection reports. API 570, 510, 653 compliant. 4x faster than manual.', event_context: 'Energy Pitch Night', event_date: 'April 29, 2026', validation_score: 4, validation_max: 8, validation_pct: 50, validation_tier: 'Early stage — a few basics to add' },
    'todd-luker': { id: 'todd-luker', pitch_number: 3, founder_name: 'Todd Luker', company_name: 'Link NRG', one_liner: 'Software platform coordinating clean fuel supply chains. Hydrogen, RNG, CNG — matching producers to heavy industry.', event_context: 'Energy Pitch Night', event_date: 'April 29, 2026', validation_score: 4, validation_max: 8, validation_pct: 50, validation_tier: 'Promising — a few gaps to close' },
    'peter-knight': { id: 'peter-knight', pitch_number: 4, founder_name: 'Peter Knight', company_name: 'WACORP Wireline', one_liner: 'KWAT tool — sets and pressure tests wellbore barriers without a service rig. 600% faster than conventional methods.', event_context: 'Energy Pitch Night', event_date: 'April 29, 2026', validation_score: 3, validation_max: 8, validation_pct: 38, validation_tier: 'Early stage — build traction first' },
    'aleesha-cerny': { id: 'aleesha-cerny', pitch_number: 5, founder_name: 'Aleesha Cerny', company_name: 'Serenity Power', one_liner: 'Solid oxide fuel cell systems for remote O&G operations. 60% electrical efficiency. 50-60% CO2 reduction immediately.', event_context: 'Energy Pitch Night', event_date: 'April 29, 2026', validation_score: 4, validation_max: 8, validation_pct: 50, validation_tier: 'Promising — a few gaps to close' },
  };

  const profile = FOUNDER_DATA[id] || null;

  // Feedback state
  const [feedback, setFeedback] = useState('');
  const [voterName, setVoterName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    // Load mock feedback
    const mockFeedback: FeedbackItem[] = id === 'joshua-strub' ? [
      { id: '1', feedback: 'Loved the Moodys analogy — super clear for non-technical investors', voter_name: 'Sarah K.', created_at: '2026-04-28T10:00:00Z' },
      { id: '2', feedback: 'Would love to see more on your traction so far', voter_name: 'Mike R.', created_at: '2026-04-28T09:30:00Z' },
    ] : id === 'aleesha-cerny' ? [
      { id: '3', feedback: 'The efficiency claim is compelling. Have you tested this in the field yet?', voter_name: 'David L.', created_at: '2026-04-28T11:00:00Z' },
    ] : [];
    setFeedbackList(mockFeedback);
  }, [id]);

  async function handleFeedbackSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSubmitting(true);
    try {
      await fetch('/api/founder-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ founder_id: id, founder_name: profile?.founder_name, company_name: profile?.company_name, feedback, voter_name: voterName || null }),
      });
      const newItem: FeedbackItem = { id: Date.now().toString(), feedback, voter_name: voterName || undefined, created_at: new Date().toISOString() };
      setFeedbackList(prev => [newItem, ...prev]);
      setSubmitted(true);
      setFeedback('');
      setVoterName('');
      setTimeout(() => { setSubmitted(false); setShowFeedbackForm(false); }, 3000);
    } finally {
      setSubmitting(false);
    }
  }

  if (!profile) {
    return (
      <div className="max-w-sm mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Profile not found</h1>
        <p className="text-slate-500 text-sm mb-6">This founder profile doesn&apos;t exist yet.</p>
        <Link href="/events" className="text-violet-600 font-medium text-sm">See who&apos;s pitching →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-8">
      {/* Pitch order badge */}
      <div className="text-center mb-4">
        <span className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold">
          Pitch #{profile.pitch_number} · {profile.event_context}
        </span>
      </div>

      {/* Header */}
      <div className="text-center mb-5">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 mx-auto mb-3 flex items-center justify-center text-white text-lg font-bold">
          {profile.founder_name.charAt(0)}
        </div>
        <h1 className="text-xl font-bold text-slate-900">{profile.company_name}</h1>
        <p className="text-sm text-slate-500">{profile.founder_name}</p>
      </div>

      {/* QR Code */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Scan to view + back</p>
        <div className="flex justify-center mb-3">
          <QRCodeImage url={profileUrl} />
        </div>
        <p className="text-xs text-slate-400">{profileUrl.replace('https://', '')}</p>
      </div>

      {/* Validation score */}
      {profile.validation_score && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Fundability Score</p>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">{profile.validation_score}/{profile.validation_max}</div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2 mx-auto max-w-[120px]">
            <div className="h-full bg-violet-600 rounded-full" style={{ width: `${profile.validation_pct}%` }} />
          </div>
          <p className="text-sm font-medium text-slate-700">{profile.validation_tier}</p>
        </div>
      )}

      {/* Description */}
      {profile.one_liner && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
          <p className="text-sm text-slate-600 leading-relaxed">{profile.one_liner}</p>
        </div>
      )}

      {/* Support CTA */}
      <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl p-5 text-white text-center mb-4">
        <p className="font-semibold text-sm mb-1">Support this founder</p>
        <Link href={`/campaigns`} className="inline-block w-full px-4 py-2.5 rounded-lg bg-white text-violet-700 font-semibold text-sm hover:bg-violet-50 transition-colors">
          Back this campaign →
        </Link>
      </div>

      {/* Feedback section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Audience Feedback</p>
          <button
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            className="text-xs text-violet-600 font-medium hover:text-violet-700"
          >
            {showFeedbackForm ? 'Cancel' : '+ Leave feedback'}
          </button>
        </div>

        {showFeedbackForm && !submitted && (
          <form onSubmit={handleFeedbackSubmit} className="mb-4 space-y-2">
            <textarea
              required
              rows={2}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What's one thing they should sharpen?"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600 resize-none"
            />
            <input
              type="text"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send feedback'}
            </button>
          </form>
        )}

        {submitted && (
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium mb-4">
            ✅ Feedback sent directly to the founder!
          </div>
        )}

        {feedbackList.length === 0 && !showFeedbackForm ? (
          <p className="text-xs text-slate-400 italic">Be the first to leave feedback.</p>
        ) : (
          <div className="space-y-3">
            {feedbackList.map((f) => (
              <div key={f.id} className="border-b border-gray-100 pb-2">
                <p className="text-sm text-slate-700">{f.feedback}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {f.voter_name || 'Anonymous'} · {new Date(f.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share */}
      <div className="text-center mb-4">
        <button
          onClick={() => {
            const text = `I just backed ${profile.company_name} on @AurrinVentures! Calgary's community funding platform. #DreamItPitchItBuildIt`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`, '_blank');
          }}
          className="text-sm text-slate-400 hover:text-slate-600 underline"
        >
          Share on X →
        </button>
      </div>

      {/* Back link */}
      <div className="text-center">
        <Link href="/events" className="text-xs text-slate-400 hover:text-slate-600">
          ← See all pitchers · April 29
        </Link>
      </div>
    </div>
  );
}
