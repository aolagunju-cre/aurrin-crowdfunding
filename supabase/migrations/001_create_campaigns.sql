CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  founder_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
  title TEXT NOT NULL,
  description TEXT,
  story TEXT,
  category TEXT,
  funding_goal_cents INTEGER NOT NULL DEFAULT 0,
  amount_raised_cents INTEGER NOT NULL DEFAULT 0,
  duration_days INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'active',
  pledge_tiers JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON campaigns FOR SELECT USING (status = 'active');
CREATE POLICY "Service insert" ON campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "Service update" ON campaigns FOR UPDATE USING (true);

CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_category ON campaigns(category);
CREATE INDEX idx_campaigns_created_at ON campaigns(created_at DESC);
