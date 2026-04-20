import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'Aurrin Ventures <admin@aurrinventures.ca>';

export async function sendDonorReceipt({
  to,
  donorName,
  campaignTitle,
  amountCents,
  campaignId,
}: {
  to: string;
  donorName: string;
  campaignTitle: string;
  amountCents: number;
  campaignId: string;
}) {
  const amount = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
  }).format(amountCents / 100);

  return resend.emails.send({
    from: FROM,
    to,
    subject: `You're in! ${amount} backing "${campaignTitle}"`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #0D1B2E;">
        <h1 style="font-family: Montserrat, sans-serif; font-size: 24px; font-weight: 800;">You're in.</h1>
        <p>Hi ${donorName},</p>
        <p>You just backed <strong>${campaignTitle}</strong> with <strong>${amount}</strong>.</p>
        <p>Every dollar goes directly to the founder. No middleman. No platform cut on the first microgrant.</p>
        <p>We'll send you an update when the campaign reaches its goal — or if the founder shares a milestone.</p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
        <p style="font-size: 12px; color: #6B7280;">
          © ${new Date().getFullYear()} Aurrin Ventures · Dream it. Pitch it. Build it.<br/>
          <a href="https://www.aurrinventures.ca/campaigns/${campaignId}" style="color: #4831B0;">View your campaign</a>
        </p>
      </div>
    `,
  });
}

export async function notifyFounderOfDonation({
  to,
  founderName,
  campaignTitle,
  donorName,
  amountCents,
  campaignId,
}: {
  to: string;
  founderName: string;
  campaignTitle: string;
  donorName: string;
  amountCents: number;
  campaignId: string;
}) {
  const amount = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
  }).format(amountCents / 100);

  return resend.emails.send({
    from: FROM,
    to,
    subject: `New donation! ${amount} to "${campaignTitle}"`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #0D1B2E;">
        <h1 style="font-family: Montserrat, sans-serif; font-size: 24px; font-weight: 800;">New donation incoming.</h1>
        <p>Hi ${founderName},</p>
        <p><strong>${donorName}</strong> just backed your campaign with <strong>${amount}</strong>.</p>
        <p>This is what momentum looks like. Keep going.</p>
        <a href="https://www.aurrinventures.ca/campaigns/${campaignId}"
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#4831B0;color:white;text-decoration:none;border-radius:8px;font-weight:600;">
          View your campaign
        </a>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
        <p style="font-size: 12px; color: #6B7280;">
          Dream it. Pitch it. Build it. — Aurrin Ventures
        </p>
      </div>
    `,
  });
}