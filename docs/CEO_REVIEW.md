# CEO review

**Mode: scope reduction.** The source’s broker/platform vision contains data, marketplace, licensing, and liability risks before demand is proven. The accepted scope is one explainable shortlist-to-inspection slice.

## Premise, wedge, ICP, GTM, economics, moat

- “Carfax for EVs” is a trust promise without a proprietary record network. Reframed to buyer triage, not certification.
- The ICP is narrowed to first-time, budget-constrained, out-of-warranty shoppers; dealer tooling is deferred.
- The CTA is a paid $49 three-listing brief. Waitlist volume is not a success metric.
- Manual fulfillment must stay below 25 minutes and lead to inspection action; otherwise economics fail.
- The only credible moat is verified evidence plus outcome feedback. UI and LLM summaries are copyable.

## Architecture, security, observability, failure modes

- Deterministic rules outrank AI. Every verdict exposes supporting facts and flags.
- Nil/empty/wrong-range inputs become 422 or visible inline validation; unknown IDs are 404; missing/corrupt fixtures are 503.
- Stale battery evidence is penalized. In production, provider timeout, revoked consent, VIN mismatch, duplicate assessment, and contradictory reports must each be named states—not a generic score.
- No PII, VIN, credentials, or live seller data ships in this demo. Production requires consent, encryption, retention limits, role-based access, and referral disclosure.
- Track stale/missing evidence, provider errors, scoring-rule version, inspection conversion, refunds, and reported false reassurance. Alert on any false “healthy” default.

## UX/test review

Hierarchy is buy box → shortlist → evidence → brief. Empty, loading, invalid, strong-fit, and high-risk states are explicit. Keyboard focus and mobile overflow are tested. Double-click is disabled during assessment; changing inputs clears stale results. Navigation loss only loses demo-local state.

## Decisions

Accepted: fictional deterministic prototype, shared fixtures, inspection checklist, paid concierge validation. Deferred: live listings, OEM diagnostics, payments, accounts, inspector dispatch, negotiation, model-generated verdicts. Explicitly out of scope: battery certification, legal/mechanical advice, financing, seller contact, and live backend claims.
