This document outlines the complete architectural blueprint for our SaaS product, the "Invisible Bouncer." Our mission is to save businesses from spam leads by creating an intelligent, multi-layered defense system that is both highly accurate and transparent.

The core philosophy is built on a defense-in-depth model using a weighted risk scoring engine. We will never rely on a single signal. Each incoming lead submission will be processed through four distinct layers, each gathering signals that contribute to a final spamScore.

Here is the detailed breakdown of the stack and data flow:

The Four-Layered Defense Architecture
Layer 1: The Front Door (Client-Side JavaScript - leadbouncer.js)
This layer performs instant, low-latency checks in the user's browser to block the most primitive bots without needing a server roundtrip.

Honeypot Field: An invisible form field. If filled, it's an immediate high-confidence bot signal.
Submission Timing: Blocks submissions completed in an impossibly short time (e.g., < 3 seconds).
Behavioral Data Collection: We will passively collect mouse movement coordinates and interaction timings. This data will be passed to the backend for analysis in Layer 2 but will not be used for blocking on the client-side to maintain performance.
Layer 2: The Gatekeeper (Server-Side Pre-Filtering)
This is the first stop on our backend (Vercel Edge Function / Supabase Edge Function). These checks are designed to be extremely fast and low-cost, using local data to filter out a large portion of spam before engaging expensive APIs.

Server-Side Honeypot/Timing Validation: A redundant check to ensure client-side scripts were not bypassed.
Open-Source Disposable Email Blocklist: This is a critical component. We will ingest and locally host the comprehensive list from github.com/disposable-email-domains. This provides an instantaneous, zero-latency, zero-cost check against thousands of known disposable email providers. This is our primary email pre-filter.
Mouse Movement Analysis: The behavioral data collected in Layer 1 is analyzed here. A lack of movement or suspiciously linear patterns will add points to the spamScore.
Layer 3: The Investigator (Conditional, API-Based Intelligence)
Only if a lead passes the initial, low-cost checks of Layer 2 do we proceed to this layer. This conditional logic is key to managing API costs and latency.

IP & Geolocation Intelligence (API: IPinfo.io):

We will check the submission IP to identify its type and location.
High-Weight Signals: VPNs, Proxies, Tor Exit Nodes, and Hosting/Data Center IPs will add significant points to the spamScore.
Moderate-Weight Signals: Geographic mismatches (e.g., a lead for a local US business originating from outside the country).
Deep Email Intelligence (API: ZeroBounce):

We will validate the specific mailbox for any email that is not on our Layer 2 disposable list.
Critical Signals: We will check for undeliverable status and, most importantly, if the email is a known spam trap. A spam trap hit is a definitive block signal.
Lower-Weight Signals: Catch-all domains or role-based emails (info@, admin@) will add minor points.
Phone Number Validation (API: Twilio Lookup):

We will validate the provided phone number.
High-Weight Signals: Invalid numbers add significant points.
Moderate-Weight Signals: VoIP line types will be flagged as higher risk than mobile or landline numbers.
Layer 4: The Judge (The AI-Powered Decision Core)
This is the final and most intelligent layer, where we use an LLM (like GPT-4 or Claude via API) for contextual understanding that goes beyond simple rules. This is our "magic" component.

Input: The LLM receives all the raw text from the form (name, company, message) along with a summary of signals from the previous layers.
Primary Task: Intent Classification. The LLM will be prompted to analyze the message and classify its intent as one of the following:
BUYER_INQUIRY: A genuine customer asking about the business's services.
SELLER_SOLICITATION: An unsolicited attempt to sell services (e.g., SEO, web design, AI consulting) to the business.
SPAM_GIBBERISH: Nonsensical, irrelevant, or malicious content.
UNCLEAR: The intent cannot be determined.
Secondary Task: Intelligent Reporting. The LLM will generate a concise, human-readable sentence explaining why a lead was blocked (e.g., "Blocked due to an unsolicited sales pitch for marketing services and submission from a known VPN."). This will be displayed in the client's dashboard.
The Ultimate Stack Summary
Frontend/Client: Vanilla JavaScript (leadbouncer.js) for maximum compatibility.
Backend/Hosting: Vercel / Netlify for hosting, with Edge Functions for server-side logic.
Database: Supabase (PostgreSQL) for storing leads, scores, reasons, and the ingested disposable email list.
Core APIs (Layer 3):
IP Intelligence: IPinfo.io
Email Validation: ZeroBounce
Phone Validation: Twilio Lookup
AI Core (Layer 4):
An API-driven Large Language Model (e.g., OpenAI GPT-4-Turbo or Anthropic Claude 3 Haiku) for intent classification and reporting.
Final Decision Logic
The spamScore from all layers will be tallied.

spamScore >= 85 OR Intent = SELLER_SOLICITATION OR Is Spam Trap = true -> BLOCKED
40 <= spamScore < 85 -> REVIEW
spamScore < 40 -> PASSED
This finished architecture provides a powerful, scalable, and intelligent system that not only blocks spam but also provides clear, actionable insights to our users. We are ready to begin development.