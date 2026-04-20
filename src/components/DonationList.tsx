import type { Donation } from '@/lib/campaigns';

interface Props {
  donations: Donation[];
}

export function DonationList({ donations }: Props) {
  const visible = donations.slice(0, 5);

  return (
    <div className="space-y-3">
      {visible.map((donation) => (
        <div
          key={donation.id}
          className="flex justify-between items-center py-3 border-b border-white/5"
        >
          <div>
            <span className="font-medium">{donation.donor_name}</span>
            <span className="text-xs text-default-500 ml-2">
              {new Date(donation.created_at).toLocaleDateString('en-CA', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <span className="font-montserrat font-bold text-teal">
            {new Intl.NumberFormat('en-CA', {
              style: 'currency',
              currency: 'CAD',
              minimumFractionDigits: 0,
            }).format(donation.amount_cents / 100)}
          </span>
        </div>
      ))}
    </div>
  );
}