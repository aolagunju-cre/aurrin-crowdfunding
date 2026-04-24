export interface PledgeTier {
  name: string;
  amount_cents: number;
  description: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string | null;
  story: string | null;
  category: string;
  funding_goal_cents: number;
  amount_raised_cents: number;
  donor_count: number;
  status: string;
  pledge_tiers: PledgeTier[];
  created_at: string;
  updated_at?: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  amount_cents: number;
  is_anonymous: boolean;
  created_at: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aurrin-crowdfunding.vercel.app';

export async function listCampaigns(): Promise<Campaign[]> {
  try {
    const res = await fetch(`${SITE_URL}/api/list`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    const campaigns: Campaign[] = json.campaigns ?? json ?? [];
    return campaigns;
  } catch {
    return [];
  }
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  try {
    const res = await fetch(`${SITE_URL}/api/list`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    const campaigns: Campaign[] = json.campaigns ?? json ?? [];
    return campaigns.find((c) => c.id === id) ?? null;
  } catch {
    return null;
  }
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function fundingPercent(raised: number, goal: number): number {
  if (goal === 0) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
}
