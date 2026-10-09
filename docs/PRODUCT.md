# Product plan

## ICP, JTBD, and wedge

ICP: first-time used-EV shoppers with a $15k–$30k budget, considering vehicles outside comprehensive warranty. JTBD: “When I have several plausible EV listings, help me choose which one deserves inspection so I do not gamble on the battery.” MVP: compare up to three listings, verify evidence recency, expose disqualifiers, and generate an inspection/negotiation brief. It does not certify a battery or broker a sale.

## Workflow and data model

Buyer profile (`budget`, `minimum_range`, `road_trips`) → listing (`VIN` later; demo ID now, price, mileage, model) → evidence (`battery_soh`, source, captured_at) → assessment (`score`, reasons, flags, ruleset_version) → checklist/inspection referral. Production records need provenance, consent, expiration, and immutable assessment snapshots.

## Technical architecture and AI strategy

Current: Next.js static UI and deterministic TypeScript scoring; FastAPI implements the matching domain operation against the same explicit JSON fixture. Production: API + Postgres, provider adapters for listing/history/diagnostic inputs, event log, and signed evidence artifacts. AI may summarize inspection notes or map seller language to structured fields, but cannot invent battery data or issue the verdict; deterministic policy and provenance remain authoritative.

## Economics and offer ladder

- $49: three-listing shortlist brief, manual fulfillment target <25 minutes ($1.96/minute gross labor allowance before tooling).
- $199: battery report + inspector coordination; target ≥55% gross margin after data and dispatch.
- $499: negotiation concierge; only after licensing and liability review.
- Later: $29/month alerting or dealer/lender API. No revenue is proven; these are test prices.

## Validation and GTM

Recruit 10 live buyers from model-specific groups and high-intent search. Sell five $49 briefs before automating data acquisition. Measure offer-view → paid conversion, minutes per brief, inspection-order rate, decision reversal rate, refund rate, and “avoided inspection” value. Kill/reshape if fewer than 3/50 qualified visitors buy, or briefs do not change inspection choices.

## Moat, risks, and future

Potential moat is a provenance-rich outcome dataset linking pre-purchase signals to inspection findings and later battery outcomes—not generic scoring UI. Risks: inaccurate seller data, diagnostic fragmentation, broker rules, referral conflicts, discrimination from opaque scores, stale reports, and catastrophic false reassurance. Mitigations: source labels, expiration, independent inspection as a required step, explainable rules, audit logs, and jurisdiction review.

## 30 / 60 / 90 days

- **30:** run concierge test; 10 observations; 5 payments; document evidence sources and failure taxonomy.
- **60:** automate intake and brief assembly; onboard 3 EV-qualified inspectors in one metro; track outcomes.
- **90:** test $199 coordination offer; add consented diagnostic adapter for one high-volume model; decide whether unit economics justify expansion.
