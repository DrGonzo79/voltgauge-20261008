"use client";

import {useMemo, useState} from "react";
import fixture from "../data/demo_ev.json";

type Listing = (typeof fixture.listings)[number];
type Assessment = {score: number; verdict: string; reasons: string[]; flags: string[]; next: string[]};

function assess(listing: Listing, budget: number, minRange: number, roadTrips: boolean): Assessment {
  let score = 100;
  const reasons: string[] = [];
  const flags: string[] = [];
  if (listing.price > budget) { score -= Math.min(30, Math.ceil((listing.price - budget) / 500)); flags.push(`$${(listing.price - budget).toLocaleString()} over budget`); }
  else reasons.push(`$${(budget - listing.price).toLocaleString()} budget headroom`);
  if (listing.epaRange < minRange) { score -= 18; flags.push(`${minRange - listing.epaRange} mi below range target`); }
  else reasons.push(`${listing.epaRange} mi listed range clears target`);
  if (listing.batterySoh < 80) { score -= 24; flags.push(`Battery health is ${listing.batterySoh}%`); }
  else if (listing.batterySoh < 88) { score -= 10; flags.push(`Battery health needs verification at ${listing.batterySoh}%`); }
  else reasons.push(`${listing.batterySoh}% reported battery health`);
  if (listing.reportAgeDays > 30) { score -= 12; flags.push(`Battery report is ${listing.reportAgeDays} days old`); }
  if (roadTrips && !listing.dcFastCharge) { score -= 20; flags.push("No DC fast charging in demo fixture"); }
  const verdict = score >= 82 ? "Inspect first" : score >= 65 ? "Verify before travel" : "Pass for now";
  const next = ["Verify VIN, title, recalls, and warranty", "Order an independent battery-health report", "Book an EV-qualified pre-purchase inspection"];
  if (score >= 65) next.push(`Use the flags to negotiate from $${listing.price.toLocaleString()}`);
  return {score: Math.max(0, score), verdict, reasons, flags, next};
}

export default function Home() {
  const [budget, setBudget] = useState("23000");
  const [minRange, setMinRange] = useState("220");
  const [roadTrips, setRoadTrips] = useState(true);
  const [selectedId, setSelectedId] = useState(fixture.listings[0].id);
  const [result, setResult] = useState<Assessment | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const selected = fixture.listings.find((item) => item.id === selectedId)!;
  const preview = useMemo(() => assess(selected, Number(budget) || 0, Number(minRange) || 0, roadTrips), [selected, budget, minRange, roadTrips]);

  function runAssessment() {
    setError("");
    const dollars = Number(budget); const miles = Number(minRange);
    if (!Number.isFinite(dollars) || dollars < 5000 || dollars > 150000) { setError("Enter a budget from $5,000 to $150,000."); return; }
    if (!Number.isFinite(miles) || miles < 50 || miles > 500) { setError("Enter a minimum range from 50 to 500 miles."); return; }
    setLoading(true);
    window.setTimeout(() => { setResult(assess(selected, dollars, miles, roadTrips)); setChecked([]); setLoading(false); }, 350);
  }

  function selectListing(id: string) { setSelectedId(id); setResult(null); setChecked([]); }
  function toggle(item: string) { setChecked((items) => items.includes(item) ? items.filter((x) => x !== item) : [...items, item]); }

  return <main>
    <header className="topbar"><a className="brand" href="#top" aria-label="VoltGauge home"><span>VG</span>VoltGauge</a><span className="demo-pill">Fictional listings · simulated scoring</span></header>
    <section className="hero" id="top"><div><p className="eyebrow">USED EV BUYER WORKSPACE</p><h1>Buy the battery.<br/>Not the sales pitch.</h1><p className="lede">Turn a used-EV listing into a buyer-side decision: shortlist, surface battery risk, and leave with an inspection brief.</p></div><div className="market-card"><small>DEMO MARKET</small><strong>{fixture.market}</strong><span>{fixture.listings.length} shared fixtures · updated {fixture.updated}</span></div></section>
    <section className="workspace" aria-label="EV screening workspace">
      <aside className="rail"><p className="eyebrow">YOUR BUY BOX</p><label>Maximum budget ($)<input aria-label="Maximum budget" inputMode="numeric" value={budget} onChange={(e) => {setBudget(e.target.value); setResult(null);}}/></label><label>Minimum listed range (mi)<input aria-label="Minimum listed range" inputMode="numeric" value={minRange} onChange={(e) => {setMinRange(e.target.value); setResult(null);}}/></label><label className="check"><input type="checkbox" checked={roadTrips} onChange={(e) => {setRoadTrips(e.target.checked); setResult(null);}}/><span>I need reliable road-trip charging</span></label><div className="boundary"><strong>Demo boundary</strong><p>Scores use fictional fixtures and deterministic rules—not live listings, diagnostics, valuation, or mechanical advice.</p></div></aside>
      <div className="content">
        <div className="section-head"><div><p className="eyebrow">STEP 1 · SHORTLIST</p><h2>Choose a candidate</h2></div><span className="count">{fixture.listings.length} demo vehicles</span></div>
        <div className="listings">{fixture.listings.map((item) => {const score = assess(item, Number(budget) || 0, Number(minRange) || 0, roadTrips).score; return <button key={item.id} className={`listing ${selectedId === item.id ? "selected" : ""}`} onClick={() => selectListing(item.id)} aria-pressed={selectedId === item.id}><span className="vehicle"><b>{item.year} {item.make}</b><strong>{item.model}</strong><small>{item.miles.toLocaleString()} mi · {item.seller}</small></span><span className="price"><b>${item.price.toLocaleString()}</b><small>fit {score}/100</small></span></button>})}</div>
        <section className="assessment"><div className="section-head"><div><p className="eyebrow">STEP 2 · VERIFY</p><h2>{selected.year} {selected.make} {selected.model}</h2></div><div className={`score ${preview.score < 65 ? "risk" : preview.score < 82 ? "warn" : "good"}`}><strong>{preview.score}</strong><span>preview</span></div></div>
          <div className="metrics"><div><small>ASKING</small><b>${selected.price.toLocaleString()}</b></div><div><small>BATTERY SOH</small><b>{selected.batterySoh}%</b></div><div><small>LISTED RANGE</small><b>{selected.epaRange} mi</b></div><div><small>REPORT AGE</small><b>{selected.reportAgeDays}d</b></div></div>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="primary" onClick={runAssessment} disabled={loading}>{loading ? "Building buyer brief…" : "Build buyer brief"}</button>
          {!result && <div className="empty"><span>↗</span><h3>No buyer brief yet</h3><p>Adjust your buy box, choose a vehicle, then run the deterministic screen.</p></div>}
          {result && <div className="results" aria-live="polite"><div className="verdict"><div><small>DEMO VERDICT</small><h3>{result.verdict}</h3></div><strong>{result.score}/100</strong></div><div className="columns"><section><h3>What supports it</h3>{result.reasons.length ? result.reasons.map((x) => <p className="positive" key={x}>✓ <span>{x}</span></p>) : <p className="muted">No positive fit signals yet.</p>}</section><section><h3>What could break the deal</h3>{result.flags.length ? result.flags.map((x) => <p className="flag" key={x}>! <span>{x}</span></p>) : <p className="muted">No fixture-level flags. Independent verification is still required.</p>}</section></div><section className="next"><div className="next-head"><h3>Inspection & negotiation brief</h3><small>{checked.length}/{result.next.length} ready</small></div>{result.next.map((item) => <label key={item}><input type="checkbox" checked={checked.includes(item)} onChange={() => toggle(item)}/><span>{item}</span></label>)}</section></div>}
        </section>
      </div>
    </section>
    <footer><strong>VoltGauge prototype</strong><span>Static frontend demo · FastAPI scoring engine ships as tested source, not a live service</span></footer>
  </main>;
}
