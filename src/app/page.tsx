import Link from 'next/link';
import { listCampaigns } from '@/lib/campaigns';

export default async function Home() {
  const campaigns = await listCampaigns();
  const totalRaised = campaigns.reduce((sum, c) => sum + (c.amount_raised_cents ?? 0), 0);
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;
  const fundedCampaigns = campaigns.filter((c) => c.status === 'funded').length;
  const displayCampaigns = campaigns.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-600 mb-6">
            Community-Powered Funding
          </p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-slate-900">
            The future of<br />
            <span className="bg-gradient-to-r from-violet-600 to-teal-500 bg-clip-text text-transparent">
              funding
            </span>{' '}
            is here.
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed mb-10">
            Crowdfunding for founders who want to own their future. No VC gatekeeping. No government dependency. Just your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="px-10 py-4 rounded-full bg-slate-900 text-white font-bold text-lg hover:bg-slate-700 transition-colors"
            >
              Start Your Campaign →
            </Link>
            <Link
              href="/campaigns"
              className="px-10 py-4 rounded-full border border-gray-300 text-slate-700 font-semibold hover:border-slate-900 hover:text-slate-900 transition-colors"
            >
              Browse Campaigns
            </Link>
          </div>
        </div>
      </div>

      {/* Social proof */}
      <div className="bg-slate-900 text-white py-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-extrabold">
                {campaigns.length > 0 ? campaigns.length : '—'}
              </p>
              <p className="text-sm text-slate-400 mt-1">Campaigns</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-extrabold">
                {totalRaised > 0 ? `$${(totalRaised / 100).toLocaleString('en-CA')}` : '$0'}
              </p>
              <p className="text-sm text-slate-400 mt-1">Raised</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-extrabold">
                {fundedCampaigns > 0 ? fundedCampaigns : '0'}
              </p>
              <p className="text-sm text-slate-400 mt-1">Funded</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent campaigns */}
      {displayCampaigns.length > 0 && (
        <div className="max-w-xl mx-auto px-4 py-14 w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Campaigns</h2>
            <Link href="/campaigns" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              See all →
            </Link>
          </div>
          <div className="space-y-3">
            {displayCampaigns.map((c) => {
              const raised = c.amount_raised_cents ?? 0;
              const goal = c.funding_goal_cents;
              const pct = goal > 0 ? Math.round((raised / goal) * 100) : 0;
              return (
                <Link
                  key={c.id}
                  href={`/campaigns/${c.id}`}
                  className="block bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      {c.category && (
                        <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-1">
                          {c.category}
                        </p>
                      )}
                      <h3 className="font-bold text-slate-900">{c.title}</h3>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      c.status === 'funded' ? 'bg-emerald-100 text-emerald-700' :
                      c.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-600 to-teal-500 rounded-full"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-slate-500">
                      ${(raised / 100).toLocaleString('en-CA')} raised
                    </span>
                    <span className="text-xs text-slate-500">{pct}%</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center pb-16 px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Ready to build?</h2>
        <p className="text-slate-500 mb-6">Your community is waiting.</p>
        <Link
          href="/create"
          className="inline-block px-8 py-3 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-700 transition-colors"
        >
          Start a Campaign
        </Link>
      </div>
    </div>
  );
}
