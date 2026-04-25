'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
  domain: string;
  description: string;
  category: string;
  year: number;
  source: string;
  signals: string[];
  raised?: string;
  city: string;
}

const COMPANIES: Company[] = [
  {
    id: '1',
    name: 'Ranch Ehrlo',
    domain: 'ranchehrlo.ca',
    description: 'Social services organization providing foster care, corrections, and community support across Saskatchewan.',
    category: 'Social Services',
    year: 1969,
    source: 'Dragon\'s Den',
    signals: ['Founded in Saskatchewan', 'Serves vulnerable populations', 'Long operating history'],
    city: 'Calgary',
  },
  {
    id: '2',
    name: 'Saturves',
    domain: 'saturves.com',
    description: 'Plant-based functional beverage brand targeting gut health and mental wellness.',
    category: 'Food & Beverage',
    year: 2020,
    source: 'Dragon\'s Den',
    signals: ['Consumer brand', 'Health & wellness trend', 'National retail distribution'],
    raised: '$500K+ raised',
    city: 'Calgary',
  },
  {
    id: '3',
    name: 'Breathair',
    domain: 'breathair.ca',
    description: 'Air purification company with a focus on indoor air quality solutions.',
    category: 'Clean Tech',
    year: 2015,
    source: 'Dragon\'s Den',
    signals: ['Clean tech', 'Post-pandemic relevance', 'B2C and B2B channels'],
    raised: '$150K',
    city: 'Calgary',
  },
  {
    id: '4',
    name: 'Hemperors',
    domain: 'hemperors.ca',
    description: 'Premium hemp-based food products including protein powder and snacks.',
    category: 'Food & Beverage',
    year: 2019,
    source: 'Dragon\'s Den',
    signals: ['Plant-based trend', 'Sustainable packaging', 'Health-focused consumer brand'],
    raised: '$150K',
    city: 'Calgary',
  },
  {
    id: '5',
    name: 'N不及格',
    domain: 'calgarytire.ca',
    description: 'Mobile tire installation service operating across Calgary.',
    category: 'Automotive Services',
    year: 2018,
    source: 'Dragon\'s Den',
    signals: ['Mobile service model', 'Blue collar trade', 'Local service expansion'],
    raised: '$100K',
    city: 'Calgary',
  },
  {
    id: '6',
    name: 'Levyne',
    domain: 'levyne.com',
    description: 'B2B SaaS platform for real estate agents with AI-powered property matching.',
    category: 'Real Estate Tech',
    year: 2021,
    source: 'Aurrin Ventures',
    signals: ['SaaS recurring revenue', 'AI/ML differentiation', 'B2B sales motion'],
    city: 'Calgary',
  },
  {
    id: '7',
    name: 'SynthGrid',
    domain: 'synthgrid.com',
    description: 'Independent performance certification for battery energy storage systems.',
    category: 'Energy Tech',
    year: 2024,
    source: 'Aurrin Ventures',
    signals: ['Energy transition', 'Certification standard', 'B2B2C platform'],
    raised: 'Pre-revenue',
    city: 'Calgary',
  },
  {
    id: '8',
    name: 'Serenity Power',
    domain: 'serenitypower.ca',
    description: 'Solid oxide fuel cell systems for remote oil & gas operations.',
    category: 'Clean Energy',
    year: 2024,
    source: 'Aurrin Ventures',
    signals: ['Hardware + software', 'Decarbonization play', 'Industrial customer base'],
    raised: 'Pre-revenue',
    city: 'Calgary',
  },
];

const CATEGORIES = ['All', 'Food & Beverage', 'Clean Tech', 'Energy Tech', 'Social Services', 'Automotive Services', 'Real Estate Tech', 'Clean Energy'];
const SOURCES = ['All', 'Dragon\'s Den', 'Aurrin Ventures', 'YC', 'Other'];

export default function DatabasePage() {
  const [category, setCategory] = useState('All');
  const [source, setSource] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = COMPANIES.filter((c) => {
    const matchCat = category === 'All' || c.category === category;
    const matchSrc = source === 'All' || c.source === source;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSrc && matchSearch;
  });

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-violet-600 mb-3">The Index</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Funded Companies</h1>
        <p className="text-slate-500 max-w-md mx-auto">
          Every company from Aurrin pitch events, Dragon&apos;s Den, and Calgary competitions that has raised money. Study what works.
        </p>
      </div>

      {/* Stats bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{COMPANIES.length}</p>
            <p className="text-xs text-slate-500">Companies</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{new Set(COMPANIES.map(c => c.city)).size}</p>
            <p className="text-xs text-slate-500">Cities</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{new Set(COMPANIES.map(c => c.category)).size}</p>
            <p className="text-xs text-slate-500">Categories</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600 text-sm"
        />
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                category === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-gray-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {SOURCES.map((s) => (
            <button
              key={s}
              onClick={() => setSource(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                source === s
                  ? 'bg-violet-600 text-white'
                  : 'bg-white border border-gray-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-sm">No companies match your filters.</p>
          <button
            onClick={() => { setCategory('All'); setSource('All'); setSearch(''); }}
            className="text-xs text-violet-600 hover:text-violet-700 mt-2 underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((company) => (
            <div key={company.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-slate-900">{company.name}</h3>
                  <a
                    href={`https://${company.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-violet-600 hover:text-violet-700"
                  >
                    {company.domain} →
                  </a>
                </div>
                <div className="flex gap-1.5 flex-wrap justify-end">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{company.category}</span>
                  <span className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full">{company.source}</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">{company.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {company.signals.map((sig) => (
                  <span key={sig} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">✓ {sig}</span>
                ))}
                {company.raised && (
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">$ {company.raised}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-10 text-center">
        <p className="text-sm text-slate-500 mb-3">
          Building a company not in the index?
        </p>
        <Link
          href="/validate"
          className="inline-block px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
        >
          Get your validation score →
        </Link>
      </div>
    </div>
  );
}
