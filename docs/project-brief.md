# Lead Bouncer — MVP Project Brief

## 1. Product Overview
Lead Bouncer is a lightweight SaaS that stops fake, spam, and low-quality form submissions before they ever reach a CRM. A single JavaScript snippet filters obvious bots, validates contact fields, and pushes only qualified leads to sales tools—saving service businesses and digital agencies hours of manual sorting every week.

## 2. Core Problem
• Local service businesses and agencies waste 5-10 hours/week sifting through spam & bot leads.
• Existing solutions (CAPTCHA, IP blocking, basic regex) annoy real users and miss increasingly sophisticated bots.
• Dirty CRMs hurt conversion rates, pollute ad platforms, and inflate sales-ops costs.

## 3. Target Users
1. Home-service contractors (plumbers, roofers, electricians)
2. Local digital agencies managing multiple client sites
3. DIY marketers using WordPress / Webflow / Shopify forms

## 4. Solution & Value Proposition
By dropping a 10 kB JavaScript bundle onto any form, customers instantly:
• Block honeypot & sub-3 s submissions (most bots)
• Flag disposable emails on the fly
• Log behavioural signals for future ML scoring
• Route only "passed" leads to HubSpot (or a generic webhook)
• Visualise blocked vs passed leads in a self-serve dashboard
• Pay in minutes via Stripe Checkout

## 5. Six Launch-Critical Features
1. **JavaScript Filtering Snippet** — honeypot + timing + disposable-email blocklist
2. **Supabase Edge Function `validate-lead`** — writes all submissions to the `leads` table with status (`passed | blocked | review`)
3. **Next.js Dashboard** — lists leads, lets user flip status inline
4. **Form Setup Page** — generates a unique `form_id` and copy-paste snippet
5. **Stripe Checkout & Portal** — three subscription tiers, plan stored in `customers.plan`
6. **HubSpot Integration / Generic Webhook** — fires on `status = passed` events

## 6. Revised 3-Day MVP Build Plan (Focused on Must-Haves)

### Day 1 — Core Library + Minimal Backend
| Slot | Scope | Output |
|------|-------|--------|
| Morning (4 h) | Single `leadbouncer.js` bundle (honeypot, <3 s timing, disposable email, mouse logging) | Script pastes into any form |
| Afternoon (4 h) | Supabase schema (`customers`, `forms`, `leads`) + Edge Function `validate-lead` | API endpoint ready |
| Evening (2 h, Stretch) | Central `rules.ts` engine, log all rules, block only obvious spam | Extensible rule set |

### Day 2 — Dashboard + Form Management
| Slot | Scope | Output |
|------|-------|--------|
| Morning (4 h) | Minimal dashboard `/dashboard` (lead table, counts) | Users see passed/blocked leads |
| Afternoon (4 h) | `/forms` page → create form → snippet generator | Copy-paste FORM_ID script |
| Evening (2 h, Stretch) | Inline status toggle (blocked ↔ passed) auto-saves | Manual review flow |

### Day 3 — Payments + Integration + Deploy
| Slot | Scope | Output |
|------|-------|--------|
| Morning (4 h) | Stripe Checkout + Portal, store plan, basic monthly usage counter | Paid plans live |
| Afternoon (3 h) | HubSpot Forms API push + generic webhook option | Leads flow to CRM |
| Evening (3 h) | Vercel deploy (Next.js + static JS), one-page landing, Supabase email trigger | Public launch ready |

## 7. Tech Stack
* **Frontend:** Next.js 14 (App Router), Tailwind CSS, Shadcn/ui
* **Backend / DB:** Supabase (Postgres, Auth, Edge Functions, RLS)
* **Payments:** Stripe Checkout + Customer Portal
* **Hosting/CDN:** Vercel (dashboard, landing, JS bundle)
* **Library:** Vanilla JS (<10 kB gzipped)
* **Key Libraries:** `validator.js`, `libphonenumber-js` (week 2), `@supabase/supabase-js`, `stripe`

## 8. Bare-Minimum Launch Checklist
- [ ] Lead script blocks honeypot and <3 s submissions
- [ ] `validate-lead` writes to `leads` with status
- [ ] Dashboard lists leads & toggles status
- [ ] Stripe Checkout persists `customers.plan`
- [ ] Snippet generator outputs working script with `FORM_ID`
- [ ] HubSpot or generic webhook fires on passed leads

## 9. Post-MVP Roadmap (Week 2+)
* Phone validation (Twilio Lookup) + Libphonenumber formatting
* IP rate limiting & geographic checks
* Analytics dashboard (time saved, block rate charts)
* Multi-CRM connectors (Salesforce, Zoho, Pipedrive)
* ML-based behavioural scoring using logged mouse/keystroke data
* White-label / agency sub-accounts

## 10. Success Metrics
* **Day-3 Demo:** end-to-end flow works with first paying user
* **Block Rate:** ≥ 90 % of obvious spam blocked on sample sites
* **Time Saved:** ≥ 5 h/week reported by pilot customers
* **Scalability:** handle 100 active forms on free Supabase tier
* **Conversion:** ≥ 30 % of sign-ups finish payment & snippet install

Lead Bouncer focuses on doing one job exceptionally well—stopping fake leads—so small teams can reclaim their time and boost conversion rates with minimal friction.