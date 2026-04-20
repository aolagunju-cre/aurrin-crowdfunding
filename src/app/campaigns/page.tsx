import type { Metadata } from 'next';
import Link from 'next/link';
import { listCampaigns, formatCurrency, fundingPercent } from '@/lib/campaigns';
import { ProgressBar } from '@/components/ProgressBar';
import { CampaignCard } from '@/components/CampaignCard';

export const metadata: Metadata = {
  title: 'Browse Campaigns — Aurrin Crowdfunding',
  description: 'Find founders in Calgary building things worth backing. No minimum. No gatekeeping.',
};

export default async function CampaignsPage() {
  const campaigns = await listCampaigns();

  return (
    <div className="px-4 sm:px-6 py-10 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-12">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal mb-4 font-montserrat">
          Community-Powered Funding
        </p>
        <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">
          Founders building.<br />
          <span className="gradient-text">Community backing.</span>
        </h1>
        <p className="text-default-400 max-w-xl mx-auto">
          No government program. No VC gatekeeping. Just founders with ideas and people with
          the conviction to back them.
        </p>
      </div>

      {/* Campaign grid */}
      {campaigns.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl font-montserrat font-bold mb-2">No campaigns yet.</h2>
          <p className="text-default-500 mb-8">
            The first founders are setting up their campaigns now.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-navy font-semibold hover:bg-violet-100 transition-colors"
          >
            Be the first to launch →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => {
            const raised = campaign.amount_raised_cents;
            const goal = campaign.funding_goal_cents;
            const percent = fundingPercent(raised, goal);

            return (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.id}`}
                className="campaign-card block rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"
              >
                {/* Header */}
                <div className="mb-4">
                  {campaign.founder_name && (
                    <p className="text-xs text-default-500 mb-1">{campaign.founder_name}</p>
                  )}
                  <h3 className="text-lg font-bold leading-tight">{campaign.title}</h3>
                  {campaign.description && (
                    <p className="text-sm text-default-400 mt-1 line-clamp-2">{campaign.description}</p>
                  )}
                </div>

                {/* Progress */}
                <ProgressBar percent={percent} className="mb-3" />

                {/* Stats */}
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="font-bold">{formatCurrency(raised)}</span>
                    <span className="text-default-500"> raised of {formatCurrency(goal)}</span>
                  </div>
                  <div className="text-default-500">
                    {percent}%
                  </div>
                </div>

                <div className="mt-2 text-xs text-default-500">
                  {campaign.donor_count} {campaign.donor_count === 1 ? 'backer' : 'backers'}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 text-center">
        <p className="text-default-500 mb-4">Have an idea worth backing?</p>
        <Link
          href="/start"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-navy font-semibold text-lg hover:bg-violet-100 transition-colors"
        >
          Start a Campaign →
        </Link>
      </div>
    </div>
  );
}