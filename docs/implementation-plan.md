# LeadBouncer — Implementation Roadmap

_Revision 1 – generated after reviewing the Technical Blueprint_

---

## Guiding Principles
1. **Iterate layer-by-layer** – each layer must ship independently and deliver incremental value.
2. **Control latency & cost** – cheap checks first, expensive APIs last, cache aggressively.
3. **Fail-open for false-positives** – default to REVIEW rather than BLOCK until confident.
4. **Metrics from day 1** – log rule hits, API latency, and false-positive overrides.

---

## Phase 0 – Foundations (Day 0-1)
| Scope | Output |
|-------|--------|
| Repo & CI | Vercel + Supabase projects, env-vars scaffold, PR checks |
| DB Schema | `customers`, `forms`, `leads`, `rule_logs`, disposable-email table |
| RLS | row-level security policies for per-customer isolation |
| Telemetry | Supabase `realtime` + simple logging util |

---

## Phase 1 – Layer 1 & 2 MVP (Day 1-2)
| Layer | Tasks | Notes |
|-------|-------|-------|
| **Layer 1 – leadbouncer.js** | • Honeypot injection<br/>• Timing check (<3 s)<br/>• Mouse logger (desktop) + touch fallback (mobile)<br/>• Payload POST to `/validate-lead` | Keep bundle ≤10 kB gzipped |
| **Layer 2 – Edge Function** | • Verify honeypot/elapsed<br/>• Disposable email check (local table)<br/>• Mouse log heuristic (min points)<br/>• Write to `leads` with status `passed/blocked/review` | <20 ms P95 |
| Dashboard | • Surface lead table & toggle | Already in progress |
| Docs | • Public snippet docs + basic FAQ |  |

Milestone 1 = spam blocking works without paid APIs.

---

## Phase 2 – Paid Intelligence (Day 3-5)
| Layer 3 | Tasks | Cost Mitigation |
|---------|-------|----------------|
| IP Intelligence | • Integrate **IPinfo**; cache results 24 h in `ip_cache` table | Only if lead == `passed` after Layer 2 |
| Email Validation | • **ZeroBounce** lookup; cache by email hash | Skip disposable domains |
| Phone Lookup | • **Twilio Lookup** when phone present | Allow opt-out per plan |

All checks append scores in `rule_logs` for transparency.

---

## Phase 3 – AI Judge (Day 6-8)
| Layer 4 | Tasks |
|---------|-------|
| Prompt Design | • Few-shot examples for BUYER / SELLER / SPAM / UNCLEAR |
| LLM Integration | • Claude Haiku via API (fallback GPT-4) |
| Cost Control | • Only run when spamScore ∈ 40-85 |
| Dashboard | • Show LLM reason & allow override (writes back to `leads.status`) |

---

## Phase 4 – Payments & Plans (Day 8-9)
| Scope | Tasks |
|-------|-------|
| Stripe Checkout & Portal | Implemented (Checkout / Portal endpoints live) |
| Webhook | Update `customers.plan`, `billing_status`; downgrade on failed payment |
| Usage Quotas | Supabase row counts; enforce per-plan limits on forms & API calls |

---

## Phase 5 – Integrations & Launch Polish (Day 10-12)
| Topic | Tasks |
|-------|-------|
| HubSpot / Webhook Push | Send `passed` leads via API or customer-defined webhook |
| Analytics | Charts for block rate, time saved |
| Landing Page | Add video walkthrough & pricing CTA tied to Checkout |
| Docs | Public API docs, snippet guide |

---

## Post-Launch Backlog
* Native WordPress / Webflow plugins
* ML model to weight mouse/timing features
* Geo-fencing & rate-limit rules
* Agency sub-accounts & white-labeling

---

### Ownership & Next Steps
* **Backend Lead:** set up Edge Function scaffolding & Supabase RLS.
* **Frontend Lead:** finish snippet generator + dashboard review UI.
* **DevOps:** configure Vercel preview env vars and Stripe test keys.

> Update this roadmap after each milestone; treat it as the single source of truth for engineering progress. 