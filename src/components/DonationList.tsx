'use client';

interface Donation {
  id: string;
  donor_name: string;
  amount_cents: number;
  is_anonymous?: boolean;
  created_at: string;
}

interface DonationListProps {
  donations: Donation[];
}

export function DonationList({ donations }: DonationListProps) {
  if (!donations || donations.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 text-sm">
        No backers yet. Be the first!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {donations.map((donation) => (
        <div
          key={donation.id}
          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
              {(donation.is_anonymous ? '?' : donation.donor_name?.charAt(0) || '?').toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                {donation.is_anonymous ? 'Anonymous' : donation.donor_name || 'Backer'}
              </p>
              {donation.created_at && (
                <p className="text-xs text-slate-400">
                  {new Date(donation.created_at).toLocaleDateString('en-CA', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
          <span className="text-sm font-bold text-violet-600">
            ${(donation.amount_cents / 100).toLocaleString('en-CA')}
          </span>
        </div>
      ))}
    </div>
  );
}
