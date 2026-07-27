---
name: sprint-review
description: "Use when compiling sprint metrics and a handoff doc into a 10-slide sprint review PPTX."
version: 3.0
spec-source: reference sprint-review template + a real sprint review (anonymized authoritative specimen)
---

# Sprint Review Skill

## Purpose

Generate the 10-slide client sprint review PPTX matching the reference output format exactly.
Triggered at sprint close. Delivered with the sprint summary email; triggers the 5-day UAT window.

## Authoritative reference

An anonymized real sprint review PDF — the reference specimen. Every layout decision
is derived from this file. When in doubt, open the specimen.

---

## Slide Map (10 slides, fixed order)

| # | Title | Key content |
|---|---|---|
| 1 | Cover | Product name centered, sprint subtitle, epic name, dates, stats line (gold) |
| 2 | Sprint [N] at a Glance | 4 KPI cards horizontal (each w/ subtitle) + teal summary bar + SoS comparison table + dark epic footer |
| 3 | Sprint [N] — Metrics Detail | 2-panel card (Velocity & Time / Code & Quality) + dark AI leverage callout with calc |
| 4 | What We Shipped — [Epic] Highlights | 4 panels 2×2, colored header per category, bullet lists |
| 5 | Story Table — [Epic] | Story / Title-Deliverable / PR(s) / +Lines / Duration — merge order, totals row |
| 6 | Story Cadence — 5-Day Delivery | 5 day cards horizontal, story count badge, hours in teal, PR refs, summary footer bar |
| 7 | Quality & Testing | 4 KPI cards 2×2 + postmortem callout + support PRs table with badge system |
| 8 | Architecture Conventions Locked in [Epic] | 6 numbered convention cards 3×2, colored number circles |
| 9 | Handoff — Sprint [N] → Sprint [M] ([Next Epic]) | Left: carry-over cards with status badges. Right: next sprint story list (teal) |
| 10 | Sprint [N] — Officially Closed | Dark bg, 4 large KPIs, closing line gold, next sprint teaser |

---

## Brand tokens

```
Primary navy:  2E1E4C   — slide 1 + 10 bg, section headers, story IDs
Teal:          1D9E75   — title underlines, KPI card 2 accent, positive deltas, Res panel, day hours
Gold:          C9A961   — KPI card 3 accent, AI leverage value, carry-over borders, closing line
Purple:        6D48E5   — story ID color in table
Lavender:      C2AEFF   — cover subtitle, AI calc text
Red:           EF4444   — convention 3 accent, hotfix badges, blocking carry-over badges
Orange:        F59E0B   — fix/index badges, branch-open badges
BG:            F8FAFC   — all light slides
Row alt:       F5F3FF   — alternating table rows
GoldBg:        FFF8E8   — postmortem callout, carry-over card fill

KPI accent colors (slide 2, left to right): primary, teal, gold, primary
Quality KPI accents (slide 7, top-left clockwise): teal, teal, primary, primary
```

---

## Slide 2 — KPI card spec

- 4 cards in a horizontal 1×4 row (not 2×2)
- Each card: colored top bar (varies) + large value + bold label + smaller subtitle line
- Subtitle carries the formula/context: "35,816 net LOC / 37.6 active hours"
- Below cards: full-width teal summary bar with sprint narrative
- Below summary: "Sprint-over-Sprint Comparison" heading + 5-column table (metric header / prev→curr / delta green)
- Custom dark footer bar: epic name · dates · stories · AI leverage (italic)

## Slide 3 — Metrics Detail spec

- Left panel (navy top): Velocity & Time — 6 label/value rows, muted label + bold value
- Right panel (teal top): Code & Quality — 6 rows, teal "Code & Quality" heading
- Dark callout: large gold leverage value left, formula + calc + note right in lavender/muted

## Slide 4 — What We Shipped spec

- 4 panels in 2×2 grid
- Each: full-width colored header strip + "Category: Title (story range)" + bullet list
- Bullet dot = same color as header. Panel bg white.
- No [Epic] badge tags here (those are for the multi-epic variant)

## Slide 5 — Story Table spec

- Columns: Story | Title / Deliverable | PR(s) | +Lines | Duration
- Sorted by merge order (not story ID order)
- +Lines in teal, Story IDs in purple
- Totals row at bottom (indigo-tinted bg)

## Slide 6 — Story Cadence spec

- 5 cards 1×5 horizontal
- Each: navy top accent + "Day N" bold + date + colored story count badge + bullet story list + separator + teal hours + PR refs
- Count badge colors: days 1-2 navy, days 3-4 gold, day 5 teal
- Dark summary footer bar

## Slide 7 — Quality & Testing spec

- 4 KPI cards 2×2 (left side): ~1,477 / +773–1,009 / 0 / 0
- Each: colored top bar + value + bold label + subtitle
- Postmortem callout (gold-bordered box, bottom-left): title bold + body
- Support PRs table (right side): PR# colored badge + type badge (outline) + description

## Slide 8 — Architecture Conventions spec

- 6 cards in 3×2 grid
- Each: colored top accent + numbered circle (same color) + title (bold, colored) + separator line + body text

## Slide 9 — Handoff spec

- Left: "Carry-overs to Sprint [M]" (gold label) + carry-over cards (gold border/bg, status badge right-aligned)
- Status badge colors: orange=branch open/tech-debt, red=not written/blocking, grey=nice-to-have
- Right: "Sprint [M] — [Epic]" (teal label) + story list (full-width teal bars)
- Footer: italic doc path reference

## Slide 10 — Closing spec

- Dark navy bg throughout
- Title centered white
- 4 large KPI values + labels in lavender
- Closing line in gold
- Next sprint teaser: bold white title + lavender detail

---

## DATA object sections (required inputs)

```
product, sprint, dates, closeDate, epicName, coverSubtitle, coverMeta, coverStats
kpis[4]:          { v, l, sub }         — slide 2
sprintSummaryLine                        — slide 2 teal bar
sosTable[5]:      { metric, prev, curr, delta }  — slide 2
slide2Footer                             — slide 2 dark bar
velocityMetrics[6], qualityMetrics[6]   — slide 3
aiLeverageCalc:   { value, formula, calc, note } — slide 3
shippedPanels[4]: { category, title, color, bullets[] } — slide 4
storyTable[]:     { id, title, prs, lines, dur } — slide 5 (merge order)
storyTableTotals                         — slide 5 totals row
cadence[5]:       { day, date, count, stories[], hours, prs } — slide 6
cadenceFooter                            — slide 6
qualityKpis[4]:   { v, l, sub }         — slide 7
supportPRs[]:     { num, type, desc, color } — slide 7
postmortem:       { title, body }        — slide 7
conventions[6]:   { num, color, title, body } — slide 8
carryOvers[]:     { title, badge, badgeColor, detail } — slide 9
nextSprintStories[]                      — slide 9 (formatted "E24-01  Title")
handoffDocPath                           — slide 9 footer
closingKpis[4]:   { v, l }             — slide 10
closingLine, nextTeaser, nextDetail      — slide 10
```

---

## Free tier — manual DATA{}

The free tier ships the generator and you populate the `DATA{}` object by hand — no
external service required. The generator lives at `generators/sprint_review_gen.js`,
referenced from this skill by relative path.

Steps:

1. Install the one runtime dependency: `npm i pptxgenjs`
2. Open `generators/sprint_review_gen.js` and edit the `DATA` object to match the required
   shape above. A placeholder sample `DATA{}` ships in the file so it runs out of the box.
3. Run from the repo root:

```bash
node generators/sprint_review_gen.js
```

4. The generator writes `<Product>_Sprint<N>_Review.pptx` to the current directory.

Minimal `DATA{}` skeleton (see the required-inputs list above for exact field shapes):

```js
const DATA = {
  product: "<your product>", sprint: "<N>", dates: "<range>", closeDate: "<YYYY-MM-DD>",
  epicName: "<epic>", coverSubtitle: "<epic>", coverMeta: "<dates>", coverStats: "<stats>",
  kpis: [ /* 4× { v, l, sub } */ ],
  sprintSummaryLine: "<summary>",
  sosTable: [ /* 5× { metric, prev, curr, delta } */ ],
  slide2Footer: "<footer>",
  velocityMetrics: [ /* 6× { label, val } */ ],
  qualityMetrics: [ /* 6× { label, val } */ ],
  aiLeverageCalc: { value: "", formula: "", calc: "", note: "" },
  shippedPanels: [ /* 4× { category, title, color, bullets: [] } */ ],
  storyTable: [ /* { id, title, prs, lines, dur } — merge order */ ],
  storyTableTotals: "<totals>",
  cadence: [ /* 5× { day, date, count, stories: [], hours, prs } */ ],
  cadenceFooter: "<footer>",
  qualityKpis: [ /* 4× { v, l, sub } */ ],
  supportPRs: [ /* { num, type, desc, color } */ ],
  postmortem: { title: "", body: "" },
  conventions: [ /* 6× { num, color, title, body } */ ],
  carryOvers: [ /* { title, badge, badgeColor, detail } */ ],
  nextSprintStories: [ /* "E24-01  Title" */ ],
  handoffDocPath: "<path>",
  closingKpis: [ /* 4× { v, l } */ ],
  closingLine: "<line>", nextTeaser: "<teaser>", nextDetail: "<detail>",
};
```

**Paid auto-populate:** filling `DATA{}` automatically from your GitHub/Linear activity
(PRs, story metadata, cadence) is a Factory MCP feature — see factory.newecom.ai. The free
tier always supports the manual path above; no internal tooling is ever required.

---

## Generation steps (manual field mapping)

If you keep your own metric notes, map them to `DATA{}` fields as follows:

1. Sprint metrics summary → kpis, sosTable, aiLeverageCalc, velocityMetrics, qualityMetrics
2. Epic metrics → storyTable (merge order), supportPRs, conventions
3. Handoff notes → carryOvers, nextSprintStories, nextDetail
4. Compute row height for slide 5: `rowH = (5.1 - 0.82) / (1 + stories.length + 1)` — must fit all rows
5. `node generators/sprint_review_gen.js` → pptx
6. Convert + inspect all 10 slides
7. The pptx is written to the current directory as `{Product}_Sprint{N}_Review.pptx` — move it to your outputs folder

## QA checklist

- [ ] Slide 2: 4 cards horizontal, subtitle line on each, teal bar, SoS table, dark epic footer
- [ ] Slide 3: 2-panel card, AI callout with calc text
- [ ] Slide 4: 4 panels with colored headers and bullets (not [Epic] badge style)
- [ ] Slide 5: merge order, +Lines in teal, totals row
- [ ] Slide 6: 5 day cards, count badges colored correctly
- [ ] Slide 7: postmortem callout present, all 8 support PRs listed
- [ ] Slide 8: 6 numbered convention cards, colored circles
- [ ] Slide 9: status badges correct colors, teal story list right side
- [ ] Slide 10: dark bg, 4 KPIs, gold closing line
