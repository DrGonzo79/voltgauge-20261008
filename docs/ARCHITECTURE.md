# Architecture

```text
Buyer inputs ──> Next.js static assessment ──> brief/checklist
                      │
                      └── shared demo_ev.json

POST /assess ──> Pydantic validation ──> fixture lookup ──> deterministic scorer
      │                  │                    │                    │
      └─422 invalid      └─ bounded fields   ├─404 unknown        └─ score/reasons/flags
                                               └─503 unavailable
```

The frontend is deliberately self-contained for GitHub Pages. FastAPI is runnable source and is not called by the deployed page. Both implement the same transparent rules over one explicit fixture. CI installs locked dependencies, typechecks, runs desktop/mobile browser tests and Python tests, performs a production build/audit, then deploys `out/`.

Production boundaries: verified ingestion adapters, Postgres with provenance and assessment snapshots, a versioned policy engine, queue-backed report generation, and audit/metrics. Never make an upstream provider failure look like “healthy battery.” Observe assessment latency, missing/stale evidence rate, rule-version distribution, 4xx/5xx, inspection conversion, false-reassurance reports, and refunds.
