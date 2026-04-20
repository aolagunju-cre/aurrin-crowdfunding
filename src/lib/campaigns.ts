// ─── Types ────────────────────────────────────────────────────────────────────

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
  funding_goal_cents: number;
  amount_raised_cents: number;
  donor_count: number;
  status: 'active' | 'funded';
  pledge_tiers: PledgeTier[];
  donations: Donation[];
  founder_name?: string;
  company_name?: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  amount_cents: number;
  created_at: string;
}

// ─── API Base ────────────────────────────────────────────────────────────────

const PLATFORM_BASE = process.env.NEXT_PUBLIC_PLATFORM_API_URL ?? 'https://aurrin-platform.vercel.app';

// ─── Fetch Campaigns (public listing) ───────────────────────────────────────

export async function listCampaigns(): Promise<Campaign[]> {
  try {
    const res = await fetch(`${PLATFORM_BASE}/api/public/campaigns`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

// ─── Fetch Single Campaign ────────────────────────────────────────────────────

export async function getCampaign(id: string): Promise<Campaign | null> {
  try {
    const res = await fetch(`${PLATFORM_BASE}/api/public/campaigns/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok || res.status === 404) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

export function daysRemaining(endDate?: string | null): number | null {
  if (!endDate) return null;
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}