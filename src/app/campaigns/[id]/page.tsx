import Link from 'next/link';
import { notFound } from 'next/navigation';
import { listCampaigns } from '@/lib/campaigns';
import { ProgressBar } from '@/components/ProgressBar';
import { PledgeTierSelector } from '@/components/PledgeTierSelector';
import { DonationList } from '@/components/DonationList';
import { UpdateFeed } from './UpdateFeed';

type PageProps = { params: Promise<{ id: string }> };

export default async function CampaignDetailPage({ params }: PageProps) {
  const { id } = await params;
  const campaigns = await listCampaigns();
  const campaign = campaigns.find((c) => c.id === id);
  if (!campaign) notFound();

  const raised = campaign.amount_raised_cents ?? 0;
  const goal = campaign.funding_goal_cents;
  const percent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Back */}
      <Link
        href="/campaigns"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors"
      >
        ← Back to campaigns
      </Link>

      {/* Hero */}
      <div className="mb-10">
        {campaign.category && (
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 mb-3">
            {campaign.category}
          </p>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
          {campaign.title}
        </h1>
        {campaign.description && (
          <p className="text-lg text-slate-500 leading-relaxed">{campaign.description}</p>
        )}
        <div className="flex gap-4 mt-4 text-sm text-slate-400 flex-wrap">
          <span>{campaign.donor_count ?? 0} backers</span>
          <span>·</span>
          <span>{percent}% funded</span>
          {campaign.status === 'active' && (
            <>
              <span>·</span>
              <span className="text-emerald-600 font-medium">Accepting donations</span>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left: Story + updates + share */}
        <div className="md:col-span-2 space-y-8">
          {/* Progress card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <ProgressBar percent={percent} className="mb-4" />
            <div className="flex justify-between items-end">
              <div>
                <span className="text-3xl font-bold text-slate-900">
                  ${(raised / 100).toLocaleString('en-CA', { minimumFractionDigits: 0 })}
                </span>
                <span className="text-slate-500 text-lg">
                  {' '}raised of ${(goal / 100).toLocaleString('en-CA', { minimumFractionDigits: 0 })} goal
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">{campaign.donor_count ?? 0}</div>
                <div className="text-sm text-slate-500">backers</div>
              </div>
            </div>
          </div>

          {/* Story */}
          {campaign.story ? (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">The Story</h2>
              <div className="text-slate-600 leading-relaxed whitespace-pre-line">
                {campaign.story}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-sm text-slate-500 italic">
                The founder hasn&apos;t added a story yet. Back the campaign to be the first to hear more.
              </p>
            </div>
          )}

          {/* Campaign updates */}
          <UpdateFeed campaignId={campaign.id} />

          {/* Share */}
          <div className="flex gap-3">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://aurrin-crowdfunding.vercel.app/campaigns/${campaign.id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-medium text-slate-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
            >
              Share on LinkedIn
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just backed "${campaign.title}" on @AurrinVentures! `)}&url=${encodeURIComponent(`https://aurrin-crowdfunding.vercel.app/campaigns/${campaign.id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-medium text-slate-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
            >
              Share on X
            </a>
          </div>
        </div>

        {/* Right: Pledge tiers */}
        <div className="md:col-span-1">
          <div className="sticky top-8">
            <PledgeTierSelector
              campaignId={campaign.id}
              campaignTitle={campaign.title}
              pledgeTiers={campaign.pledge_tiers ?? []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
