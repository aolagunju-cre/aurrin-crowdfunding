import Link from 'next/link';
import ValidateForm from './ValidateForm';

export default async function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero — gradient background, bold headline */}
      <div
        className="relative overflow-hidden"
        style="background: linear-gradient(135deg, #b249f8 0%, #FF1CF7 100%);"
      >
        {/* Noise texture */}
        <div
          className="absolute inset-0"
          style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.08%22/%3E%3C/svg%3E'); background-repeat: repeat;"
        />

        <div className="relative max-w-xl mx-auto px-4 py-16 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/70 mb-4">
            Calgary&apos;s Funding Platform
          </p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight text-white mb-4">
            Is your startup<br />
            <span style={{ color: '#FFD700' }}>fundable?</span>
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            Drop your URL. Get an instant readout on whether it looks like something investors fund.
          </p>

          <div className="max-w-lg mx-auto">
            <ValidateForm />
          </div>

          <p className="text-xs text-white/50 mt-4">
            Based on signals from {87}+ funded companies.{' '}
            <Link href="/database" className="text-white/70 hover:text-white font-medium underline">
              See the database →
            </Link>
          </p>
        </div>
      </div>

      {/* Social proof ticker */}
      <div className="bg-slate-900 text-white py-3 px-4">
        <div className="max-w-xl mx-auto flex items-center justify-center gap-6 text-sm font-medium">
          <span>🔥 3 founders validated their startup this week</span>
          <span className="hidden sm:block text-white/40">·</span>
          <span className="hidden sm:block">Next pitch night: April 29</span>
          <span className="hidden sm:block text-white/40">·</span>
          <span className="hidden sm:block">Calgary, Alberta</span>
        </div>
      </div>

      {/* What Aurrin does */}
      <div className="max-w-xl mx-auto px-4 py-14 w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Dream it. Pitch it. Build it.
          </h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
            Aurrin Ventures is Calgary&apos;s funding platform for founders who don&apos;t have investor connections. No deck required. No VC gatekeeping. Just your idea and the community that backs it.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { emoji: '📅', label: 'Browse Events', desc: 'Judges, contestants, and what&apos;s coming up.', href: '/events' },
            { emoji: '💰', label: 'Raise Funds', desc: 'Launch a campaign. Let your community back you.', href: '/campaigns' },
            { emoji: '🚀', label: 'Pitch Live', desc: 'Apply to pitch at our next event. No connections needed.', href: '/pitch-night' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-violet-300 hover:shadow-md transition-all text-center group"
            >
              <div className="text-3xl mb-3">{item.emoji}</div>
              <h3 className="font-bold text-slate-900 mb-1 group-hover:text-violet-600 transition-colors">{item.label}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div
        className="py-12 px-4 text-center"
        style="background: linear-gradient(135deg, #b249f8 0%, #FF1CF7 100%);"
      >
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to pitch?</h2>
          <p className="text-white/80 text-sm mb-6">No deck. No connections. Just your idea and the room.</p>
          <Link
            href="/pitch-night"
            className="inline-block px-6 py-2.5 rounded-full bg-white text-violet-700 font-semibold text-sm hover:bg-violet-50 transition-colors"
          >
            Apply to Pitch →
          </Link>
        </div>
      </div>
    </div>
  );
}
