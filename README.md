# VoltGauge

A runnable buyer-side used-EV prototype. Set a buy box, compare fictional vehicles, surface battery and charging risk, and build an inspection/negotiation brief.

## Run the frontend

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. The static production export is produced by `npm run build` in `out/` and supports a GitHub repository base path.

## Run and test the Python API

```bash
uv sync --project api --locked --dev
uv run --project api uvicorn api.main:app --reload
uv run --project api pytest api/tests
```

Example operation: `POST /assess` with `{"listing_id":"EV-411","budget":23000,"minimum_range":220,"road_trips":true}`.

## Verify

```bash
npm run typecheck
npm run test:e2e
npm run build
npm run audit:prod
uv run --project api pytest api/tests
```

## Deployment boundary

GitHub Pages hosts the frontend only. FastAPI is runnable and tested source but is **not deployed**. Fixtures, battery reports, scores, and sellers are fictional; this is not a mechanical inspection, valuation, or purchase recommendation.

See [product plan](docs/PRODUCT.md), [architecture](docs/ARCHITECTURE.md), [opportunity score](docs/OPPORTUNITY_SCORE.md), and [source notes](research/notes.md).
