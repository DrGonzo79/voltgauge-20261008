from pathlib import Path
import json

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

FIXTURE_PATH = Path(__file__).resolve().parents[1] / "data" / "demo_ev.json"


class BuyerProfile(BaseModel):
    listing_id: str = Field(min_length=1, max_length=30)
    budget: int = Field(ge=5_000, le=150_000)
    minimum_range: int = Field(ge=50, le=500)
    road_trips: bool = True


def load_fixture() -> dict:
    if not FIXTURE_PATH.exists():
        raise FileNotFoundError("demo EV fixture is missing")
    return json.loads(FIXTURE_PATH.read_text())


def assess_vehicle(listing: dict, profile: BuyerProfile) -> dict:
    score = 100
    reasons: list[str] = []
    flags: list[str] = []
    if listing["price"] > profile.budget:
        difference = listing["price"] - profile.budget
        score -= min(30, -(-difference // 500))
        flags.append(f"${difference:,} over budget")
    else:
        reasons.append(f"${profile.budget - listing['price']:,} budget headroom")
    if listing["epaRange"] < profile.minimum_range:
        score -= 18
        flags.append(f"{profile.minimum_range - listing['epaRange']} mi below range target")
    else:
        reasons.append(f"{listing['epaRange']} mi listed range clears target")
    if listing["batterySoh"] < 80:
        score -= 24
        flags.append(f"Battery health is {listing['batterySoh']}%")
    elif listing["batterySoh"] < 88:
        score -= 10
        flags.append(f"Battery health needs verification at {listing['batterySoh']}%")
    else:
        reasons.append(f"{listing['batterySoh']}% reported battery health")
    if listing["reportAgeDays"] > 30:
        score -= 12
        flags.append(f"Battery report is {listing['reportAgeDays']} days old")
    if profile.road_trips and not listing["dcFastCharge"]:
        score -= 20
        flags.append("No DC fast charging in demo fixture")
    score = max(0, score)
    verdict = "inspect_first" if score >= 82 else "verify_before_travel" if score >= 65 else "pass_for_now"
    next_steps = ["Verify VIN, title, recalls, and warranty", "Order an independent battery-health report", "Book an EV-qualified pre-purchase inspection"]
    if score >= 65:
        next_steps.append(f"Use the flags to negotiate from ${listing['price']:,}")
    return {"fictional": True, "listing": listing, "score": score, "verdict": verdict, "reasons": reasons, "flags": flags, "next_steps": next_steps}


app = FastAPI(title="VoltGauge API", version="0.1.0")


@app.get("/health")
def health():
    return {"status": "ok", "fixture": "fictional"}


@app.post("/assess")
def assess(profile: BuyerProfile):
    try:
        fixture = load_fixture()
    except (FileNotFoundError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=503, detail="Vehicle fixture is unavailable") from exc
    listing = next((item for item in fixture["listings"] if item["id"] == profile.listing_id), None)
    if listing is None:
        raise HTTPException(status_code=404, detail="Demo listing not found")
    return assess_vehicle(listing, profile)
