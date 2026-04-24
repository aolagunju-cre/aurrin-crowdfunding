import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Judges — Aurrin Ventures',
  description: 'Meet the judges evaluating founders at Aurrin Ventures pitch events.',
};

interface Judge {
  name: string;
  role: string;
  company: string;
  bio: string;
  linkedin: string;
  initials: string;
  color: string;
}

const APRIL_29_JUDGES: Judge[] = [
  {
    name: 'Siva Sam',
    role: 'Founder',
    company: 'Refreshed',
    bio: 'Early-stage investor and founder building in the Calgary tech ecosystem.',
    linkedin: 'https://www.linkedin.com/in/siva-sam-refreshed/',
    initials: 'SS',
    color: 'bg-violet-600',
  },
  {
    name: 'Roxanne Molnar',
    role: 'Founder',
    company: 'Roxanne Molnar Consulting',
    bio: 'Startup operator and ecosystem builder focused on Calgary founders.',
    linkedin: 'https://www.linkedin.com/in/roxoanne-molnar/',
    initials: 'RM',
    color: 'bg-teal-600',
  },
  {
    name: 'Henry Huynh',
    role: 'Angel Investor',
    company: 'Independent',
    bio: 'Active angel investor in early-stage tech and energy startups across Western Canada.',
    linkedin: 'https://www.linkedin.com/in/henry-huynh/',
    initials: 'HH',
    color: 'bg-amber-600',
  },
  {
    name: 'Ammar Al-Aghbari',
    role: 'Founder',
    company: 'Calgary Tech Hub',
    bio: 'Building the connective tissue of Calgary\'s tech community.',
    linkedin: 'https://www.linkedin.com/in/ammar-alaghbari/',
    initials: 'AA',
    color: 'bg-rose-600',
  },
  {
    name: 'Natalie Pang',
    role: 'Product Lead',
    company: 'Tech Calgary',
    bio: 'Product and strategy leader working at the intersection of tech and community.',
    linkedin: 'https://www.linkedin.com/in/natalie-pang/',
    initials: 'NP',
    color: 'bg-indigo-600',
  },
  {
    name: 'Shubham Garg',
    role: 'Investor',
    company: 'Eclipse RegTech Ventures',
    bio: 'Investing in regulatory technology and energy innovation.',
    linkedin: 'https://www.linkedin.com/in/shubham-garg/',
    initials: 'SG',
    color: 'bg-emerald-600',
  },
  {
    name: 'Jana McDonald',
    role: 'Founder',
    company: 'McDonald Consulting',
    bio: 'Business strategist and mentor helping early-stage founders find product-market fit.',
    linkedin: 'https://www.linkedin.com/in/jana-mcdonald/',
    initials: 'JM',
    color: 'bg-cyan-600',
  },
];

function JudgeCard({ judge }: { judge: Judge }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 transition-all hover:shadow-sm">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-full ${judge.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
          {judge.initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900">{judge.name}</h3>
          <p className="text-sm text-slate-500">{judge.role} · {judge.company}</p>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">{judge.bio}</p>
          {judge.linkedin && (
            <a
              href={judge.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-xs text-teal-600 hover:text-teal-700 font-medium"
            >
              LinkedIn →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JudgesPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-teal-600 mb-3">Energy Pitch Night</p>
        <h1 className="text-3xl font-bold text-slate-900">Meet the Judges</h1>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          Seven investors, operators, and founders evaluating the next wave of energy innovation in Calgary.
        </p>
      </div>

      <div className="text-center mb-8">
        <Link
          href="/events/energy-pitch-night-2026"
          className="inline-block px-5 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
        >
          April 29, 2026 · Energy Startups
        </Link>
      </div>

      <div className="space-y-4">
        {APRIL_29_JUDGES.map((judge) => (
          <JudgeCard key={judge.name} judge={judge} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm text-slate-500">
          Interested in judging at a future event?{' '}
          <a href="mailto:hello@aurrinventures.com" className="text-teal-600 hover:text-teal-700 font-medium">
            Get in touch
          </a>
        </p>
      </div>
    </div>
  );
}
