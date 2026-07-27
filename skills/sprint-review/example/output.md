# Example output — sprint-review

Running the generator on the demo `DATA{}` writes:

```text
✅  Written: Acme_Tasks_Sprint2_Review.pptx
```

The deck is a 10-slide PPTX with the fixed structure:

1. Cover — "Acme Tasks", sprint subtitle, dates, stats line
2. Sprint at a Glance — 4 KPI cards + sprint-over-sprint comparison table
3. Metrics Detail — Velocity & Time / Code & Quality + AI-leverage callout
4. What We Shipped — 4 feature panels with bullets
5. Story Table — Story / Title / PR(s) / +Lines / Duration (merge order)
6. Story Cadence — 5 day cards
7. Quality & Testing — 4 KPI cards + support PRs table + postmortem
8. Architecture Conventions — 6 numbered convention cards
9. Handoff — carry-overs (left) + next-sprint stories (right)
10. Officially Closed — 4 large KPIs + closing line + next-sprint teaser

All content is driven by `DATA{}`; the slide structure never changes. Automatic
population of `DATA{}` from GitHub / Linear is available via Factory MCP.
