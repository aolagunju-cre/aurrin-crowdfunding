# Aurrin Crowdfunding — MVP Specification
_Last updated: 2026-04-19_

---

## 1. What We're Building

A public-facing crowdfunding platform where donors can browse campaigns, read founder stories, and back projects with real money.

**Core donor flow:**
1. Browse `/campaigns` → select campaign → `/campaigns/[id]` → choose pledge tier → Stripe Checkout → `/confirm/[id]?session_id=xxx`

**Core founder flow:**
- Founder applies via Google Form → admin creates campaign in Supabase → campaign goes live
- *(Campaign creation wizard comes after MVP)*

---

## 2. Design Language

- **Primary bg:** `#0D1B2E` (deep navy)
- **Gradient:** `#4831B0` (violet) → `#2EE5F2` (teal)
- **Text:** `#F1F3F2` (off-white)
- **Fonts:** Montserrat (headlines), Inter (body)
- **Style:** Card-based, dark premium, dot-grid accents

---

## 3. Architecture

**This repo** (`aurrin-crowdfunding-dev`) = public donor UI, calls **aurrin-platform** API.

```
aurrin-crowdfunding-dev/
├── src/app/
│   ├── campaigns/
│   │   ├── page.tsx          # Listing
│   │   └── [id]/page.tsx     # Detail
│   ├── confirm/[campaignId]/  # Post-Stripe redirect
│   ├── donate/[campaignId]/  # POST-only, Stripe redirect
│   └── api/
│       ├── donate/route.ts   # Creates Stripe session
│       └── campaigns/route.ts # Proxy to aurrin-platform
├── src/components/
│   ├── CampaignCard.tsx
│   ├── ProgressBar.tsx
│   ├── PledgeTierSelector.tsx
│   └── DonationList.tsx
└── src/lib/
    ├── campaigns.ts    # Fetches from aurrin-platform API
    ├── stripe.ts       # Stripe checkout session
    └── email.ts       # Resend donor receipt + founder notification
```

**Stack:** Next.js 15 · TypeScript · Tailwind v4 · Inter + Montserrat

---

## 4. Environment Variables

```env
NEXT_PUBLIC_PLATFORM_API_URL=   # aurrin-platform base URL
NEXT_PUBLIC_APP_URL=             # This app's URL (for Stripe redirects)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
```

---

## 5. MVP Scope

### Must ship (P0)
- [x] `/campaigns` listing page
- [x] `/campaigns/[id]` detail page
- [x] Pledge tier selector → Stripe Checkout
- [x] `/confirm/[id]?session_id=xxx` success page
- [x] Stripe webhook to record donation in aurrin-platform DB

### After MVP (P1)
- [ ] Campaign creation wizard (founder portal)
- [ ] Email templates in Resend
- [ ] Social sharing with OG images
- [ ] Search/filter campaigns

---

## 6. Open Questions

1. **Platform API URL:** What is the current Vercel URL for aurrin-platform?
2. **Stripe webhook:** Is `checkout.session.completed` already handled in aurrin-platform? We may need to add campaign donation recording there.
3. **Demo campaigns:** Should I seed 2-3 test campaigns so the listing page isn't empty?
4. **Domain:** Will this deploy to a subdomain of aurrinventures.ca, or standalone?

---

## 7. Lessons from Dialdynamics Build

*[Awaiting response from master bot and dialdynamics-content. Will update.]*

---

_Code must match this document. Update SPEC.md before changing implementation._