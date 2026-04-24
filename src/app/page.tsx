import Link from 'next/link';
import ValidateForm from './ValidateForm';

export default async function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero — URL validator */}
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-teal-400 mb-4">
            Aurrin Ventures · Calgary
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Is your startup<br />fundable?
          </h1>
          <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
            Drop your URL. Get an instant readout on whether it looks like something investors fund.
          </p>

          {/* Embedded validate form */}
          <ValidateForm />

          <p className="text-xs text-slate-500 mt-4">
            Based on signals from {87}+ funded companies.{' '}
            <Link href="/database" className="text-teal-400 hover:text-teal-300">
              See the database →
            </Link>
          </p>
        </div>
      </div>

      {/* Social proof ticker */}
      <div className="bg-teal-600 text-white py-3 px-4">
        <div className="max-w-xl mx-auto flex items-center justify-center gap-6 text-sm font-medium overflow-hidden">
          <span className="whitespace-nowrap">🔥 3 founders validated their startup today</span>
          <span className="hidden sm:block text-teal-200">·</span>
          <span className="hidden sm:block whitespace-nowrap">$0 raised so far this month</span>
          <span className="hidden sm:block text-teal-200">·</span>
          <span className="hidden sm:block whitespace-nowrap">Next pitch night: April 29</span>
        </div>
      </div>

      {/* What Aurrin does */}
      <div className="max-w-xl mx-auto px-4 py-14 w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Dream it. Pitch it. Build it.
          </h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
            Aurrin Ventures is Calgary's funding platform for founders who don't have investor connections. No deck required. No VC gatekeeping. Just your idea and the community that backs it.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { emoji: '🔍', label: 'Get Validated', desc: 'Enter your URL. See if your startup looks fundable.', href: '/validate' },
            { emoji: '💰', label: 'Raise Funds', desc: 'Launch a campaign. Let your community back you.', href: '/campaigns' },
            { emoji: '🚀', label: 'Pitch Live', desc: 'Apply to pitch at our next event. No connections needed.', href: '/pitch-night' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all text-center group"
            >
              <div className="text-3xl mb-3">{item.emoji}</div>
              <h3 className="font-bold text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">{item.label}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent validated companies */}
      <div className="max-w-xl mx-auto px-4 pb-14 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Recently validated</h2>
          <Link href="/database" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
            See all →
          </Link>
        </div>
        <div className="space-y-2">
          {[
            { domain: 'levyne.com', score: 75, result: 'Looks fundable' },
            { domain: 'saturves.com', score: 63, result: 'Promising' },
            { domain: 'synthgrid.com', score: 50, result: 'Promising' },
          ].map((v) => (
            <div key={v.domain} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-900">{v.domain}</span>
                <span className="text-xs text-slate-400">{v.result}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${v.score >= 75 ? 'bg-emerald-500' : v.score >= 50 ? 'bg-teal-500' : 'bg-amber-500'}`}
                    style={{ width: `${v.score}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-700 w-8">{v.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
