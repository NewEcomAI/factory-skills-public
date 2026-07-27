# Example input — sprint-review

Free-tier manual `DATA{}` (fictional demo — Acme Tasks). This is a trimmed excerpt
showing the shape; see `generators/sprint_review_gen.js` for every field.

```js
const DATA = {
  product:   "Acme Tasks",
  sprint:    "2",
  dates:     "Jul 6–10, 2026",
  closeDate: "2026-07-10",
  epicName:  "E2: Task Board",

  coverStats: "9 stories · 5 active days · ~12.4× AI leverage",

  kpis: [
    { v: "9",      l: "stories shipped", sub: "board + drag-and-drop" },
    { v: "~12.4×", l: "AI leverage proxy", sub: "18,600 net LOC / 30 active hours" },
    { v: "40h",    l: "wall-clock span",   sub: "5 active days" },
    { v: "14",     l: "PRs merged",        sub: "9 story + 5 support" },
  ],
  // ...sosTable, velocityMetrics, qualityMetrics, shippedPanels[4],
  // storyTable[], cadence[5], qualityKpis[4], supportPRs[], conventions[6],
  // carryOvers[], nextSprintStories[], closingKpis[4] ...
};
```

Run:

```bash
npm i pptxgenjs
node generators/sprint_review_gen.js
```
