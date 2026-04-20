import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Donate — Aurrin Crowdfunding',
  robots: 'noindex',
};

export default function DonatePage() {
  // This route is only reached via POST from PledgeTierSelector
  // GET requests redirect home
  return (
    <div className="text-center py-20">
      <p className="text-default-500">Redirecting to payment...</p>
    </div>
  );
}