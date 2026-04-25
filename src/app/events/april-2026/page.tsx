'use client';

import { useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';

const EVENT_URL = 'https://claw-aurrin-crowdfunding.vercel.app/events/april-2026';

const FOUNDERS = [
  {
    id: 'joshua-strub',
    pitch_number: 1,
    name: 'Joshua Strub',
    company: 'SynthGrid',
    one_liner: 'EnergyPassport — independent performance certification for battery energy storage systems. Think Moody\'s for battery infrastructure.',
    score: 5,
    maxScore: 8,
    pct: 63,
    tier: 'Promising — a few gaps to close',
    validation_score: 5,
  },
  {
    id: 'luiz-di-grado',
    pitch_number: 2,
    name: 'Luiz Felipe Di Grado',
    company: 'Inspekto AI',
    one_liner: 'AI that turns photos and audio into audit-ready inspection reports. API 570, 510, 653 compliant. 4x faster than manual.',
    score: 4,
    maxScore: 8,
    pct: 50,
    tier: 'Early stage — a few basics to add',
    validation_score: 4,
  },
  {
    id: 'todd-luker',
    pitch_number: 3,
    name: 'Todd Luker',
    company: 'Link NRG',
    one_liner: 'Software platform coordinating clean fuel supply chains. Hydrogen, RNG, CNG — matching producers to heavy industry.',
    score: 4,
    maxScore: 8,
    pct: 50,
    tier: 'Promising — a few gaps to close',
    validation_score: 4,
  },
  {
    id: 'peter-knight',
    pitch_number: 4,
    name: 'Peter Knight',
    company: 'WACORP Wireline',
    one_liner: 'KWAT tool — sets and pressure tests wellbore barriers without a service rig. 600% faster than conventional methods.',
    score: 3,
    maxScore: 8,
    pct: 38,
    tier: 'Early stage — build traction first',
    validation_score: 3,
  },
  {
    id: 'aleesha-cerny',
    pitch_number: 5,
    name: 'Aleesha Cerny',
    company: 'Serenity Power',
    one_liner: 'Solid oxide fuel cell systems for remote O&G operations. 60% electrical efficiency. 50-60% CO2 reduction immediately.',
    score: 4,
    maxScore: 8,
    pct: 50,
    tier: 'Promising — a few gaps to close',
    validation_score: 4,
  },
];

function QRCodeDisplay({ url, size = 200 }: { url: string; size?: number }) {
  const [src, setSrc] = useState('');
  useState(() => {
    QRCode.toDataURL(url, {
      width: size,
      margin: 2,
      color: { dark: '#0D1B2E', light: '#FFFFFF' },
    }).then(setSrc).catch(() => {});
  });
  if (!src) return <div className="w-48 h-48 bg-gray-100 rounded-2xl animate-pulse" />;
  return <img src={src} alt="Event QR Code" className="w-48 h-48 rounded-2xl shadow-lg" />;
}

export default function April29EventPage() {
  const [activeFounder, setActiveFounder] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackFor, setFeedbackFor] = useState<string | null>(null);

  const founder = FOUNDERS[activeFounder];

  function handleFeedback(founderId: string) {
    if (!feedbackText.trim()) return;
    setFeedbackFor(founderId);
    setFeedbackSubmitted(true);
    setFeedbackText('');
    setFeedbackName('');
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackFor(null);
    }, 3000);
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-8">
      {/* Event header */}
      <div className="text-center mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-violet-600 mb-2">Energy Pitch Night · April 29, 2026</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">April 29, 2026</h1>
        <p className="text-sm text-slate-500">5 founders. 1 room. Your chance to back them.</p>
      </div>

      {/* QR Code */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Scan to browse + back each founder</p>
        <div className="flex justify-center mb-3">
          <QRCodeDisplay url={EVENT_URL} size={180} />
        </div>
        <p className="text-xs text-slate-400">{EVENT_URL.replace('https://', '')}</p>
      </div>

      {/* Judges */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Judges</p>
        <div className="flex gap-2 flex-wrap">
          {['Shubham Garg', 'Siva Sam', 'Jana McDonald'].map((j) => (
            <span key={j} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{j}</span>
          ))}
        </div>
      </div>

      {/* Founders in pitch order */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tonight&apos;s Founders</p>
        {FOUNDERS.map((f, i) => (
          <div
            key={f.id}
            className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all ${i === activeFounder ? 'border-violet-400 ring-1 ring-violet-100' : 'border-gray-200 hover:border-gray-300'}`}
            onClick={() => setActiveFounder(i)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">#{f.pitch_number}</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{f.company}</h3>
                  <p className="text-xs text-slate-500">{f.name}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <div className="text-lg font-extrabold text-slate-900">{f.score}/{f.maxScore}</div>
                <div className="h-1.5 w-12 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(f.score / f.maxScore) * 100}%` }} />
                </div>
              </div>
            </div>
            {i === activeFounder && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-3 animate-in fade-in duration-200">
                <p className="text-xs text-slate-600 leading-relaxed">{f.one_liner}</p>
                <div className="flex gap-2">
                  <button
                    className="flex-1 px-3 py-2 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors"
                    onClick={(e) => { e.stopPropagation(); setActiveFounder(i); document.getElementById('back-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                  >
                    Back this founder →
                  </button>
                  <button
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-slate-700 text-xs font-semibold hover:border-violet-300 hover:text-violet-700 transition-colors"
                    onClick={(e) => { e.stopPropagation(); setActiveFounder(i); document.getElementById('feedback-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                  >
                    Leave feedback
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active founder detail */}
      {founder && (
        <div id="back-section" className="mt-4 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl p-5 text-white text-center">
          <p className="font-bold text-base mb-1">Back {founder.company}</p>
          <p className="text-white/75 text-xs mb-4">Every dollar helps a Calgary founder build.</p>
          <Link
            href="/create"
            className="inline-block w-full px-4 py-2.5 rounded-lg bg-white text-violet-700 font-semibold text-sm hover:bg-violet-50 transition-colors"
          >
            Browse all campaigns →
          </Link>
        </div>
      )}

      {/* Feedback form */}
      <div id="feedback-section" className="mt-4 bg-white rounded-2xl border border-gray-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Feedback for {founder?.company}
        </p>
        {feedbackSubmitted ? (
          <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg text-sm font-medium">
            ✅ Feedback sent directly to the founder!
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); handleFeedback(founder.id); }}
            className="space-y-2"
          >
            <textarea
              required
              rows={2}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="What's one thing they should sharpen?"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600 resize-none"
            />
            <input
              type="text"
              value={feedbackName}
              onChange={(e) => setFeedbackName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
            >
              Send feedback
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-xs text-slate-400 mb-1">Aurrin Ventures · Calgary</p>
        <p className="text-xs text-slate-400">Dream it. Pitch it. Build it.</p>
      </div>
    </div>
  );
}
