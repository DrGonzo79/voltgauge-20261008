from fastapi.testclient import TestClient

from main import BuyerProfile, app, assess_vehicle, load_fixture

client = TestClient(app)


def test_strong_fit_is_prioritized_for_inspection():
    response = client.post("/assess", json={"listing_id": "EV-411", "budget": 23_000, "minimum_range": 220, "road_trips": True})
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "inspect_first"
    assert data["score"] == 100
    assert data["fictional"] is True


def test_battery_and_charging_risks_lower_score():
    response = client.post("/assess", json={"listing_id": "EV-315", "budget": 23_000, "minimum_range": 220, "road_trips": True})
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "pass_for_now"
    assert data["score"] == 38
    assert any("Battery health" in flag for flag in data["flags"])
    assert any("fast charging" in flag for flag in data["flags"])


def test_invalid_budget_is_rejected():
    response = client.post("/assess", json={"listing_id": "EV-104", "budget": 500, "minimum_range": 220, "road_trips": True})
    assert response.status_code == 422


def test_unknown_listing_is_visible():
    response = client.post("/assess", json={"listing_id": "MISSING", "budget": 23_000, "minimum_range": 220, "road_trips": True})
    assert response.status_code == 404
    assert response.json()["detail"] == "Demo listing not found"


def test_fixture_failure_is_visible(monkeypatch):
    import main
    monkeypatch.setattr(main, "load_fixture", lambda: (_ for _ in ()).throw(FileNotFoundError()))
    response = client.post("/assess", json={"listing_id": "EV-104", "budget": 23_000, "minimum_range": 220, "road_trips": True})
    assert response.status_code == 503
    assert response.json()["detail"] == "Vehicle fixture is unavailable"


def test_domain_operation_directly():
    listing = load_fixture()["listings"][1]
    result = assess_vehicle(listing, BuyerProfile(listing_id=listing["id"], budget=23_000, minimum_range=220, road_trips=False))
    assert result["score"] == 78
    assert result["verdict"] == "verify_before_travel"
