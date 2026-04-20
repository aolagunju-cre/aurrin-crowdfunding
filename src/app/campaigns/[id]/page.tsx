import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCampaign, formatCurrency, fundingPercent } from '@/lib/campaigns';
import { ProgressBar } from '@/components/ProgressBar';
import { PledgeTierSelector } from '@/components/PledgeTierSelector';
import { DonationList } from '@/components/DonationList';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const campaign = await getCampaign(id);
  if (!campaign) return { title: 'Campaign Not Found' };
  return {
    title: `${campaign.title} — Aurrin Crowdfunding`,
    description: campaign.description ?? undefined,
  };
}

export default async function CampaignDetailPage({ params }: Props) {
  const { id } = await params;
  const campaign = await getCampaign(id);
  if (!campaign) notFound();

  const raised = campaign.amount_raised_cents;
  const goal = campaign.funding_goal_cents;
  const percent = fundingPercent(raised, goal);

  return (
    <div className="px-4 sm:px-6 py-10 max-w-4xl mx-auto">
      {/* Back */}
      <Link
        href="/campaigns"
        className="inline-flex items-center gap-2 text-sm text-default-500 hover:text-violet-400 mb-8 transition-colors"
      >
        ← Back to campaigns
      </Link>

      {/* Hero */}
      <div className="mb-10">
        {campaign.founder_name && (
          <p className="text-sm text-teal font-medium mb-2 uppercase tracking-wider">
            {campaign.founder_name}
            {campaign.company_name ? ` · ${campaign.company_name}` : ''}
          </p>
        )}
        <h1 className="text-3xl md:text-4xl font-montserrat font-bold mb-4 leading-tight">
          {campaign.title}
        </h1>
        {campaign.description && (
          <p className="text-lg text-default-400 leading-relaxed">{campaign.description}</p>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left: Story + donations */}
        <div className="md:col-span-2 space-y-8">
          {/* Progress */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <ProgressBar percent={percent} className="mb-4" />
            <div className="flex justify-between items-end">
              <div>
                <span className="text-3xl font-montserrat font-bold">
                  {formatCurrency(raised)}
                </span>
                <span className="text-default-500 text-lg"> of {formatCurrency(goal)}</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{campaign.donor_count}</div>
                <div className="text-sm text-default-500">backers</div>
              </div>
            </div>
          </div>

          {/* Story */}
          {campaign.story && (
            <div>
              <h2 className="text-lg font-montserrat font-bold mb-3">The Story</h2>
              <div className="text-default-300 leading-relaxed whitespace-pre-line">
                {campaign.story}
              </div>
            </div>
          )}

          {/* Recent donations */}
          {campaign.donations && campaign.donations.length > 0 && (
            <div>
              <h2 className="text-lg font-montserrat font-bold mb-3">Recent Backers</h2>
              <DonationList donations={campaign.donations} />
            </div>
          )}
        </div>

        {/* Right: Pledge tiers */}
        <div className="md:col-span-1">
          <div className="sticky top-8">
            <PledgeTierSelector
              campaignId={campaign.id}
              campaignTitle={campaign.title}
              pledgeTiers={campaign.pledge_tiers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}