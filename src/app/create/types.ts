export interface PledgeTier {
  name: string;
  amount_cents: number;
  description: string;
}

export interface CampaignFormData {
  title: string;
  tagline: string;
  story: string;
  category: string;
  funding_goal_cents: number;
  duration_days: number;
  pledge_tiers: PledgeTier[];
  founder_name?: string;
  founder_email?: string;
}
