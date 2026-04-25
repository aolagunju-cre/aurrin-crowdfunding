import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events — Aurrin Ventures',
  description: 'Pitch events, judges, and founders. Calgary\'s startup community.',
};

const APRIL_29_JUDGES = [
  {
    name: 'Shubham Garg',
    role: 'Chairman',
    company: 'Prospera Energy',
    bio: 'Leading Prospera Energy with a focus on energy innovation and sustainable growth across Western Canada.',
    linkedin: 'https://www.linkedin.com/in/shubham-garg/',
    initials: 'SG',
    color: 'bg-violet-600',
  },
  {
    name: 'Siva Sam',
    role: 'President',
    company: 'USXI Group',
    bio: 'President of USXI Group, active judge and mentor for early-stage founders in the Calgary ecosystem.',
    linkedin: 'https://www.linkedin.com/in/siva-sam-refreshed/',
    initials: 'SS',
    color: 'bg-violet-600',
  },
  {
    name: 'Jana McDonald',
    role: 'Founder',
    company: 'McDonald Consulting',
    bio: 'Business strategist and mentor helping early-stage founders find product-market fit.',
    linkedin: 'https://www.linkedin.com/in/jana-mcdonald/',
    initials: 'JM',
    color: 'bg-amber-600',
  },
];

const APRIL_29_CONTESTANTS = [
  {
    id: 'joshua-strub',
    name: 'Joshua Strub',
    company: 'SynthGrid',
    description: 'EnergyPassport — independent performance certification for battery energy storage systems. Think Moody\'s for battery infrastructure.',
    linkedin: 'https://www.linkedin.com/in/joshuastrub/',
    category: 'Battery Storage',
  },
  {
    id: 'luiz-di-grado',
    name: 'Luiz Felipe Di Grado',
    company: 'Inspekto AI',
    description: 'AI that turns photos and audio into audit-ready inspection reports. API 570, 510, 653 compliant. 4x faster than manual.',
    linkedin: 'https://www.linkedin.com/in/luiz-di-grado/',
    category: 'Oil & Gas Tech',
  },
  {
    id: 'todd-luker',
    name: 'Todd Luker',
    company: 'Link NRG',
    description: 'Software platform coordinating clean fuel supply chains. Hydrogen, RNG, CNG — matching producers to heavy industry.',
    linkedin: 'https://www.linkedin.com/in/toddluker/',
    category: 'Energy Supply Chain',
  },
  {
    id: 'peter-knight',
    name: 'Peter Knight',
    company: 'WACORP Wireline',
    description: 'KWAT tool — sets and pressure tests wellbore barriers without a service rig. 600% faster than conventional methods.',
    linkedin: 'https://www.linkedin.com/in/peter1knight2wireline/',
    category: 'Oil & Gas',
  },
  {
    id: 'aleesha-cerny',
    name: 'Aleesha Cerny',
    company: 'Serenity Power',
    description: 'Solid oxide fuel cell systems for remote O&G operations. 60% electrical efficiency. 50-60% CO2 reduction immediately.',
    linkedin: 'https://www.linkedin.com/in/aleisha-reese-cerny/',
    category: 'Clean Energy',
  },
];

export default function EventsPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Events</h1>
        <p className="text-slate-500">Pitch nights, judges, and the founders building in Calgary.</p>
      </div>

      {/* Next Event Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 mb-10 text-white text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-violet-500 mb-2">Next Event</p>
        <h2 className="text-xl font-bold mb-1">Energy Pitch Night</h2>
        <p className="text-slate-400 text-sm mb-4">April 29, 2026 · Calgary</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/events/april-29"
            className="px-5 py-2 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors"
          >
            Browse Campaigns
          </Link>
          <Link
            href="/create"
            className="px-5 py-2 rounded-full border border-slate-600 text-slate-300 text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            Pitch at Next Event
          </Link>
        </div>
      </div>

      {/* Judges */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">Judges</h2>
          <span className="text-xs text-slate-400">April 29, 2026</span>
        </div>
        <div className="space-y-3">
          {APRIL_29_JUDGES.map((judge) => (
            <div key={judge.name} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
              <div className={`w-11 h-11 rounded-full ${judge.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                {judge.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900">{judge.name}</h3>
                    <p className="text-sm text-slate-500">{judge.role} · {judge.company}</p>
                  </div>
                  {judge.linkedin && (
                    <a
                      href={judge.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-violet-600 hover:text-violet-700 font-medium shrink-0"
                    >
                      LinkedIn →
                    </a>
                  )}
                </div>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{judge.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contestants */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">Pitching Founders</h2>
          <span className="text-xs text-slate-400">5 companies · April 29</span>
        </div>
        <div className="space-y-3">
          {APRIL_29_CONTESTANTS.map((founder) => (
            <div key={founder.company} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-slate-900">{founder.company}</h3>
                  <p className="text-sm text-slate-500">{founder.name}</p>
                </div>
                <Link
                  href={`/founder/${founder.id}`}
                  className="text-xs text-violet-600 hover:text-violet-700 font-medium shrink-0"
                >
                  Profile + QR →
                </Link>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full shrink-0">
                  {founder.category}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{founder.description}</p>
              {founder.linkedin && (
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs text-violet-600 hover:text-violet-700 font-medium"
                >
                  LinkedIn →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
