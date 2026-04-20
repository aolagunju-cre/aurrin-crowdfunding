'use client';

import Link from 'next/link';

interface CampaignCardProps {
  id: string;
  title: string;
  founderName?: string;
  description?: string | null;
  raised: number;
  goal: number;
  donorCount: number;
}

export function CampaignCard({
  id,
  title,
  founderName,
  description,
  raised,
  goal,
  donorCount,
}: CampaignCardProps) {
  const percent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

  return (
    <Link
      href={`/campaigns/${id}`}
      className="campaign-card block rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"
    >
      {founderName && (
        <p className="text-xs text-default-500 mb-1">{founderName}</p>
      )}
      <h3 className="text-lg font-bold leading-tight mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-default-400 mb-4 line-clamp-2">{description}</p>
      )}
      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-white/10 mb-3">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet to-teal"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between text-sm">
        <span>
          <strong>${(raised / 100).toLocaleString('en-CA', { minimumFractionDigits: 0 })}</strong> raised
        </span>
        <span className="text-default-500">{percent}%</span>
      </div>
      <p className="text-xs text-default-500 mt-1">
        {donorCount} {donorCount === 1 ? 'backer' : 'backers'}
      </p>
    </Link>
  );
}