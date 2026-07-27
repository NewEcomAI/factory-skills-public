/**
 * sprint_review_gen.js — v3.0
 * Generates the 10-slide client sprint-review PPTX from a hand-populated DATA{} object.
 * Free tier: populate DATA{} manually (see skills/sprint-review/SKILL.md).
 * Requires: npm i pptxgenjs
 *
 * SLIDE MAP:
 *  1 — Cover
 *  2 — Sprint at a Glance (4 KPI cards horizontal + SoS comparison table)
 *  3 — Metrics Detail (Velocity & Time / Code & Quality + AI Leverage callout)
 *  4 — What We Shipped — E3 Highlights (4 feature panels with bullets)
 *  5 — Story Table (sorted by merge order: Story / Title / PR(s) / +Lines / Duration)
 *  6 — Story Cadence — 5-Day Delivery (5 day cards)
 *  7 — Quality & Testing (4 KPI cards + support PRs table + postmortem)
 *  8 — Architecture Conventions (6 numbered convention cards)
 *  9 — Handoff (carry-overs left + next sprint right)
 * 10 — Officially Closed (4 large KPIs + closing line + next sprint teaser)
 */

import pptxgen from "pptxgenjs";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  primary:   "2E1E4C",  // navy purple
  teal:      "1D9E75",  // teal (used on KPI card 2 accent, positive deltas)
  gold:      "C9A961",  // gold (KPI card 3 accent, AI leverage)
  purple:    "6D48E5",  // accent violet
  lavender:  "C2AEFF",
  red:       "EF4444",
  orange:    "F59E0B",
  bg:        "F8FAFC",
  white:     "FFFFFF",
  textPrimary: "1E293B",
  textMuted:   "64748B",
  rowAlt:    "F5F3FF",
  tealBg:    "E8F5F0",
  goldBg:    "FFF8E8",
};

// KPI card accent colors (reference layout):
// Card 1 (stories): navy   Card 2 (AI leverage): teal
// Card 3 (wall-clock): gold  Card 4 (PRs): navy
const KPI_ACCENTS = [C.primary, C.teal, C.gold, C.primary];

// ─── Sample sprint data (placeholder — replace with your own DATA{}) ────────────
const DATA = {
  product:   "Sample Product",
  sprint:    "3a",
  dates:     "May 18–22, 2026",
  closeDate: "2026-05-22",
  epicName:  "E3: Core Feature Foundation",

  // SLIDE 1 — subtitle lines
  coverSubtitle: "E3: Core Feature Foundation",
  coverMeta:     "May 18 – 22, 2026",
  coverStats:    "15 stories · 5 active days · ~19.1× AI leverage",

  // SLIDE 2 — 4 KPI cards (horizontal)
  kpis: [
    { v: "15",      l: "stories shipped",     sub: "E3-foundation + 14 feature stories" },
    { v: "~19.1×",  l: "AI leverage proxy",   sub: "35,816 net LOC / 37.6 active hours" },
    { v: "97h",     l: "wall-clock span",      sub: "5 active days · May 18–22" },
    { v: "25",      l: "PRs merged",           sub: "17 story + 8 support/hotfix" },
  ],
  sprintSummaryLine: "+35% more stories · +57% more LOC · +35% AI leverage vs Sprint 2 — full core feature set shipped end-to-end in 5 days.",
  sosTable: [
    { metric: "Stories",     prev: "S2: 11",     curr: "S3a: 15",     delta: "+36%" },
    { metric: "Active hrs",  prev: "S2: 32.5h",  curr: "S3a: 37.6h",  delta: "+16%" },
    { metric: "Net LOC",     prev: "S2: 22,830", curr: "S3a: 35,816", delta: "+57%" },
    { metric: "Tests",       prev: "S2: 704",    curr: "S3a: ~1,477", delta: "+110%" },
    { metric: "AI Leverage", prev: "S2: 14.1×",  curr: "S3a: 19.1×",  delta: "+35%" },
  ],
  slide2Footer: "E3: Core Feature Foundation · May 18–22, 2026 · 15 stories · ~19.1× AI leverage",

  // SLIDE 3 — Metrics Detail
  velocityMetrics: [
    { label: "Stories shipped",        val: "15" },
    { label: "Wall-clock span",        val: "97.0 h (Mon–Fri)" },
    { label: "Active working time",    val: "~37.6 h (5 days)" },
    { label: "Story PRs",              val: "17 (+8 support = 25 total)" },
    { label: "Median PR duration",     val: "62 min (mean 64 min)" },
    { label: "Stories per active day", val: "avg 3.0 / day" },
  ],
  qualityMetrics: [
    { label: "Net new src lines",   val: "~35,816" },
    { label: "Total src/ at close", val: "~80,790 LOC" },
    { label: "Test definitions",    val: "~1,477 (79 files)" },
    { label: "Net new tests",       val: "+773 to +1,009" },
    { label: "TypeScript errors",   val: "0" },
    { label: "Lint errors",         val: "0" },
  ],
  aiLeverageCalc: {
    value:   "~19.1×",
    formula: "Formula: net_new_src_LOC ÷ (active_hours × 50 lines/h baseline)",
    calc:    "= 35,816 ÷ (37.6 × 50) = 35,816 ÷ 1,880 ≈ 19.1×",
    note:    "Baseline: senior dev comfortable steady-state with tests. Proxy only — not a billing metric.",
  },

  // SLIDE 4 — What We Shipped (4 panels with bullets, colored headers)
  shippedPanels: [
    {
      category: "UI",
      title: "Primary Views (E3-01 to E3-07)",
      color: C.primary,
      bullets: [
        "Main list/grid view with collapsible sidebar",
        "Alternate compact view toggle",
        "Status bars: draft, pending, active, done, sameday, blocked",
        "Click/right-click routing to detail popup & context menu",
        "Integration sync status bar with per-item pill badges",
      ],
    },
    {
      category: "Core",
      title: "Record Lifecycle (E3-08 to E3-11)",
      color: C.teal,
      bullets: [
        "Create modal: entity combobox + inline new-entity mini-form",
        "Persistent right sidebar with full record detail",
        "Edit, cancel, archive state transitions",
        "Server-enforced conflict guard via transactional overlap query",
      ],
    },
    {
      category: "iCal",
      title: "iCal Export & Privacy (E3-13, E3-16)",
      color: C.gold,
      bullets: [
        "RFC 5545 compliant /api/ical/export/[id] endpoint",
        "Signed token service — no auth required for calendar apps",
        "Availability-only mode: no personal names, no amounts",
        "GDPR headers + hashed VEVENT UIDs (SHA-256, tenant-keyed)",
      ],
    },
    {
      category: "Integ",
      title: "External Integration Shell (E3-15, E3-06)",
      color: C.primary,
      bullets: [
        "Read-only channel mapping table in Settings → Integrations",
        "Integration KPI strip + per-channel strip components",
        "Scope-aware sync status bar (org / item level)",
        "E12-02 sync tracking schema done — branch open for Sprint 3b",
      ],
    },
  ],

  // SLIDE 5 — Story Table (merge order, +Lines, Duration)
  storyTable: [
    { id: "E3-fdn", title: "Core domain layer (records / entities / actions)",   prs: "#38",    lines: "+5,360",  dur: "10 min" },
    { id: "E3-01",  title: "Main list/grid view + sidebar collapse",             prs: "#39",    lines: "+6,695",  dur: "79 min" },
    { id: "E3-02",  title: "Alternate compact view",                             prs: "#40",    lines: "+1,216",  dur: "10 min" },
    { id: "E3-05",  title: "Controls bar (legend + view toggle)",                prs: "#41",    lines: "+120",    dur: "9 min"  },
    { id: "E3-03",  title: "Click-triggered detail popup at cursor",             prs: "#44",    lines: "+1,154",  dur: "32 min" },
    { id: "E3-04",  title: "Secondary markers and popup",                        prs: "#45",    lines: "+2,257",  dur: "66 min" },
    { id: "E3-07",  title: "Cell click and right-click routing",                 prs: "#47",    lines: "+1,176",  dur: "9 min"  },
    { id: "E3-08",  title: "Record create modal (3 parts: form, brackets, entity)", prs: "#48–50", lines: "+5,257", dur: "207 min" },
    { id: "E3-09",  title: "Persistent right sidebar detail",                    prs: "#51",    lines: "+1,926",  dur: "99 min" },
    { id: "E3-10",  title: "Record edit, cancel, and archive",                   prs: "#56",    lines: "+4,523",  dur: "164 min" },
    { id: "E3-11",  title: "Server-enforced conflict guard (transactional)",     prs: "#57",    lines: "+819",   dur: "133 min" },
    { id: "E3-13",  title: "iCal export endpoint + token service (RFC 5545)",    prs: "#58",    lines: "+2,483",  dur: "62 min" },
    { id: "E3-16",  title: "iCal privacy layer — availability-only + GDPR headers", prs: "#59", lines: "+848",  dur: "19 min" },
    { id: "E3-15",  title: "Read-only integration mapping table in Settings",    prs: "#61",    lines: "+3,327",  dur: "113 min" },
    { id: "E3-06",  title: "Scope-aware integration sync status bar",            prs: "#62",    lines: "+3,016",  dur: "72 min" },
  ],
  storyTableTotals: "17 PRs · 15 stories · +40,177 gross ins (net: ~35,816) · median 62 min",

  // SLIDE 6 — Story Cadence (5 day cards)
  cadence: [
    { day: 1, date: "May 18", count: 2,  stories: ["E3-foundation (domain layer)", "E3-01 (main view)"],
      hours: "4.7h active", prs: "#38, #39" },
    { day: 2, date: "May 19", count: 5,  stories: ["E3-02 (compact view)", "E3-05 (controls bar)", "E3-03 (detail popup)", "E3-04 (markers)", "E3-07 (click routing)"],
      hours: "8.8h active", prs: "#40,41,44,45,47 + 2 index fixes" },
    { day: 3, date: "May 20", count: 2,  stories: ["E3-08 (record create ×3 PRs)", "E3-09 (right sidebar)"],
      hours: "8.0h active", prs: "#48,49,50,51 + 3 hotfixes" },
    { day: 4, date: "May 21", count: 4,  stories: ["E3-10 (edit/cancel/archive)", "E3-11 (conflict guard)", "E3-13 (iCal export)", "E3-16 (iCal privacy)"],
      hours: "10.4h active", prs: "#56,57,58,59 + bookend fix" },
    { day: 5, date: "May 22", count: 2,  stories: ["E3-15 (integration table)", "E3-06 (sync status bar)"],
      hours: "5.75h active", prs: "#61, #62 · sprint close" },
  ],
  cadenceFooter: "Total: 15 stories shipped · ~37.6h active · avg 3.0 stories/day · 25 PRs merged (17 story + 8 support)",

  // SLIDE 7 — Quality & Testing
  qualityKpis: [
    { v: "~1,477",    l: "Test definitions at close",   sub: "across ~79 test files" },
    { v: "+773–1,009",l: "Net new tests this sprint",    sub: "vs 704 at Sprint 2 close (+110%)" },
    { v: "0",         l: "TypeScript errors",            sub: "strict mode throughout" },
    { v: "0",         l: "Lint errors",                  sub: "1 pre-existing warning" },
  ],
  supportPRs: [
    { num: "#42", type: "fix/index", desc: "Composite indexes for multi-range query",         color: C.orange },
    { num: "#43", type: "fix/index", desc: "itemId+start range index",                        color: C.orange },
    { num: "#46", type: "fix",       desc: "Soft-fail reads while indexes build",             color: C.teal },
    { num: "#52", type: "hotfix",    desc: "Surface error detail in service-error logs",       color: C.red },
    { num: "#53", type: "hotfix",    desc: "status+itemId+startDate index (postmortem)",       color: C.red },
    { num: "#54", type: "docs",      desc: "Postmortem + datastore tech-debt proposal",        color: "6B7280" },
    { num: "#55", type: "hotfix",    desc: "status+startDate index for all-items query",       color: C.red },
    { num: "#60", type: "fix",       desc: "Cancel paired bookend markers on cancel",          color: C.teal },
  ],
  postmortem: {
    title: "Postmortem 2026-05-20 — Datastore Index Coverage",
    body: "2 hotfixes (#53 status+itemId+startDate index; #55 status+startDate index) shipped after list-view 500 errors. Root cause: IN-query field must lead composite index. Rule now locked in §11 conventions.",
  },

  // SLIDE 8 — Architecture Conventions
  conventions: [
    {
      num: 1, color: C.primary,
      title: "DateString is lexicographic",
      body: "All dates use YYYY-MM-DD string comparison inside a transaction. Never convert to Date() inside a datastore transaction.",
    },
    {
      num: 2, color: C.teal,
      title: "Monetary amounts as integer cents",
      body: "grossAmountCents is source of truth. Display amounts derived at render only — never persisted.",
    },
    {
      num: 3, color: C.red,
      title: "Ship each datastore index in the same PR",
      body: "IN-query field MUST lead the composite index. Two hotfixes (#53, #55) were the postmortem for breaking this rule.",
    },
    {
      num: 4, color: C.gold,
      title: "Every mutating write includes a domain-event side-effect",
      body: "Domain event batched in same transaction as the mutation. See cancelRecord as canonical pattern.",
    },
    {
      num: 5, color: C.primary,
      title: "External sync: always full nested patch",
      body: "set({channels: {}}, {merge:true}) is destructive. Always use single tx.set with full nested patch {channels: {[key]: patch}}.",
    },
    {
      num: 6, color: C.teal,
      title: "Modal scroll via inline style (not utility class)",
      body: "max-h: 90vh; overflow-y: auto must be inline style. The JIT compiler drops max-h-[90vh] silently on this codebase.",
    },
  ],

  // SLIDE 9 — Handoff
  carryOvers: [
    { title: "E12-02 sync tracking",            badge: "Branch open",        badgeColor: C.orange, detail: "Schema + service done on feature/e12-02-sync-tracking" },
    { title: "E2E test spec",                   badge: "Not written",         badgeColor: C.red,    detail: "Blocking CI gate — priority Sprint 3b" },
    { title: "Datastore index-coverage CI test",badge: "Tech-debt doc only",  badgeColor: C.orange, detail: "Recommended before E24-02 to prevent repeat postmortem" },
    { title: "Dashboard KPI real data",         badge: "Hardcoded zeros",     badgeColor: "6B7280", detail: "page.tsx still stubbed — nice-to-have Sprint 3b" },
  ],
  nextSprintStories: [
    "E24-01  External property sync",
    "E24-02  Rate plan push to integration",
    "E24-03  Record pull from integration",
    "E24-04  Channel A activation",
    "E24-05  Channel B activation",
    "E24-06  Availability sync cron",
    "E24-07  Integration conflict resolution",
  ],
  handoffDocPath: "docs/sprint-reviews/sprint-3a/handoff-sprint-3a-to-sprint-3b.md",

  // SLIDE 10 — Officially Closed
  closingKpis: [
    { v: "15",     l: "stories shipped" },
    { v: "~19.1×", l: "AI leverage"    },
    { v: "25",     l: "PRs merged"     },
    { v: "~1,477", l: "tests"          },
  ],
  closingLine: "Sprint 3a officially closed 2026-05-22 · 15 stories shipped · ~19.1× AI leverage · Onward to E24 — External Integration",
  nextTeaser:  "Next: Sprint 3b — E24: External Integration",
  nextDetail:  "7 stories · property sync · rate push · record pull · channel activation",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function footer(slide, text) {
  const t = text || `${DATA.product} · Sprint ${DATA.sprint} Review · ${DATA.closeDate} · CONFIDENTIAL`;
  slide.addText(t, {
    x: 0, y: 5.35, w: 10, h: 0.25, fontSize: 9, color: C.textMuted,
    align: "center", fontFace: "Calibri",
  });
}

function sectionTitle(slide, title) {
  slide.addText(title, {
    x: 0.4, y: 0.18, w: 9.2, h: 0.5,
    fontSize: 22, bold: true, color: C.textPrimary, fontFace: "Calibri", valign: "middle",
  });
  // teal top accent (teal underline on title)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 0.66, w: 9.2, h: 0.04,
    fill: { color: C.teal }, line: { color: C.teal },
  });
}

// ─── Presentation ─────────────────────────────────────────────────────────────
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "NewEcom.AI";
pres.title = `${DATA.product} Sprint ${DATA.sprint} Review`;

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — Cover
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.primary };

  s.addText(DATA.product, {
    x: 0, y: 1.2, w: 10, h: 1.4,
    fontSize: 72, bold: true, color: C.white, fontFace: "Calibri", align: "center",
  });
  s.addText(`Sprint ${DATA.sprint} Review`, {
    x: 0, y: 2.55, w: 10, h: 0.65,
    fontSize: 30, color: C.white, fontFace: "Calibri", align: "center",
  });
  s.addText(DATA.coverSubtitle, {
    x: 0, y: 3.25, w: 10, h: 0.4,
    fontSize: 16, color: C.lavender, fontFace: "Calibri", align: "center",
  });
  s.addText(DATA.coverMeta, {
    x: 0, y: 3.7, w: 10, h: 0.35,
    fontSize: 14, color: C.lavender, fontFace: "Calibri", align: "center",
  });
  s.addText(DATA.coverStats, {
    x: 0, y: 4.1, w: 10, h: 0.3,
    fontSize: 13, color: C.gold, fontFace: "Calibri", align: "center",
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — Sprint at a Glance
// 4 KPI cards horizontal + sprint summary line + SoS table + custom footer
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  sectionTitle(s, `Sprint ${DATA.sprint} at a Glance`);

  // 4 KPI cards horizontal — each 2.3w × 1.35h
  const cw = 2.28, ch = 1.35, cy = 0.82, gap = 0.1, x0 = 0.32;
  DATA.kpis.forEach((k, i) => {
    const cx = x0 + i * (cw + gap);
    // Card background
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cw, h: ch,
      fill: { color: C.white }, line: { color: "E2E8F0", width: 0.5 },
      shadow: { type: "outer", color: "000000", blur: 4, offset: 1, angle: 135, opacity: 0.08 },
    });
    // Colored top accent bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cw, h: 0.07,
      fill: { color: KPI_ACCENTS[i] }, line: { color: KPI_ACCENTS[i] },
    });
    // Value
    s.addText(k.v, {
      x: cx + 0.08, y: cy + 0.1, w: cw - 0.16, h: 0.72,
      fontSize: i === 1 ? 30 : 36, bold: true,
      color: KPI_ACCENTS[i] === C.gold ? C.gold : (KPI_ACCENTS[i] === C.teal ? C.teal : C.primary),
      fontFace: "Calibri", align: "center", valign: "middle",
    });
    // Label
    s.addText(k.l, {
      x: cx + 0.08, y: cy + 0.82, w: cw - 0.16, h: 0.26,
      fontSize: 11, bold: true, color: C.textPrimary, fontFace: "Calibri", align: "center",
    });
    // Subtitle
    s.addText(k.sub, {
      x: cx + 0.06, y: cy + 1.06, w: cw - 0.12, h: 0.22,
      fontSize: 9, color: C.textMuted, fontFace: "Calibri", align: "center",
    });
  });

  // Sprint summary highlight line (teal bg)
  const sumY = cy + ch + 0.12;
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.32, y: sumY, w: 9.36, h: 0.34,
    fill: { color: C.teal }, line: { color: C.teal },
  });
  s.addText(DATA.sprintSummaryLine, {
    x: 0.4, y: sumY, w: 9.2, h: 0.34,
    fontSize: 10, color: C.white, fontFace: "Calibri", align: "center", valign: "middle",
  });

  // Sprint-over-Sprint Comparison table
  const tableY = sumY + 0.44;
  s.addText("Sprint-over-Sprint Comparison", {
    x: 0.32, y: tableY, w: 9.36, h: 0.26,
    fontSize: 10.5, bold: true, color: C.textMuted, fontFace: "Calibri", align: "center",
  });

  const colW = 9.36 / DATA.sosTable.length;
  DATA.sosTable.forEach((col, i) => {
    const cx = 0.32 + i * colW;
    const headerY = tableY + 0.3;
    // Column header
    s.addText(col.metric, {
      x: cx, y: headerY, w: colW, h: 0.22,
      fontSize: 9.5, bold: true, color: C.textMuted, fontFace: "Calibri", align: "center",
    });
    // prev → curr
    s.addText(`${col.prev} → ${col.curr}`, {
      x: cx, y: headerY + 0.22, w: colW, h: 0.22,
      fontSize: 9, color: C.textPrimary, fontFace: "Calibri", align: "center",
    });
    // delta (green)
    s.addText(col.delta, {
      x: cx, y: headerY + 0.44, w: colW, h: 0.24,
      fontSize: 11, bold: true, color: C.teal, fontFace: "Calibri", align: "center",
    });
  });

  // Custom footer (epic + stats line)
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.1, w: 10, h: 0.28,
    fill: { color: C.primary }, line: { color: C.primary },
  });
  s.addText(DATA.slide2Footer, {
    x: 0.2, y: 5.1, w: 9.6, h: 0.28,
    fontSize: 9, color: C.white, align: "center", fontFace: "Calibri", italic: true, valign: "middle",
  });
  footer(s);
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — Metrics Detail
// 2-panel card (Velocity & Time / Code & Quality) + AI Leverage callout
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  sectionTitle(s, `Sprint ${DATA.sprint} — Metrics Detail`);

  const panelY = 0.82, panelH = 2.42;

  // Velocity & Time panel (left, navy top)
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.32, y: panelY, w: 4.5, h: panelH,
    fill: { color: C.white }, line: { color: "E2E8F0", width: 0.5 },
    shadow: { type: "outer", color: "000000", blur: 4, offset: 1, angle: 135, opacity: 0.06 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.32, y: panelY, w: 4.5, h: 0.06,
    fill: { color: C.primary }, line: { color: C.primary },
  });
  s.addText("Velocity & Time", {
    x: 0.42, y: panelY + 0.1, w: 4.2, h: 0.3,
    fontSize: 12, bold: true, color: C.textPrimary, fontFace: "Calibri",
  });
  DATA.velocityMetrics.forEach((m, i) => {
    const ry = panelY + 0.48 + i * 0.32;
    s.addText(m.label, { x: 0.42, y: ry, w: 2.1, h: 0.28, fontSize: 10, color: C.textMuted, fontFace: "Calibri" });
    s.addText(m.val,   { x: 2.52, y: ry, w: 2.2, h: 0.28, fontSize: 10, bold: true, color: C.textPrimary, fontFace: "Calibri" });
  });

  // Code & Quality panel (right, teal top)
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.18, y: panelY, w: 4.5, h: panelH,
    fill: { color: C.white }, line: { color: "E2E8F0", width: 0.5 },
    shadow: { type: "outer", color: "000000", blur: 4, offset: 1, angle: 135, opacity: 0.06 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.18, y: panelY, w: 4.5, h: 0.06,
    fill: { color: C.teal }, line: { color: C.teal },
  });
  s.addText("Code & Quality", {
    x: 5.28, y: panelY + 0.1, w: 4.2, h: 0.3,
    fontSize: 12, bold: true, color: C.teal, fontFace: "Calibri",
  });
  DATA.qualityMetrics.forEach((m, i) => {
    const ry = panelY + 0.48 + i * 0.32;
    s.addText(m.label, { x: 5.28, y: ry, w: 2.1, h: 0.28, fontSize: 10, color: C.textMuted, fontFace: "Calibri" });
    s.addText(m.val,   { x: 7.38, y: ry, w: 2.2, h: 0.28, fontSize: 10, bold: true, color: C.textPrimary, fontFace: "Calibri" });
  });

  // AI Leverage callout (dark bg, left: large value, right: formula text)
  const aiY = panelY + panelH + 0.14;
  const aiH = 0.88;
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.32, y: aiY, w: 9.36, h: aiH,
    fill: { color: C.primary }, line: { color: C.primary },
  });
  s.addText(DATA.aiLeverageCalc.value, {
    x: 0.4, y: aiY + 0.04, w: 1.6, h: aiH - 0.08,
    fontSize: 36, bold: true, color: C.gold, fontFace: "Calibri", align: "center", valign: "middle",
  });
  s.addText("AI Leverage Proxy", {
    x: 0.4, y: aiY + 0.04, w: 1.6, h: 0.28,
    fontSize: 9, color: C.gold, fontFace: "Calibri", align: "center",
  });
  s.addText(DATA.aiLeverageCalc.formula, {
    x: 2.1, y: aiY + 0.06, w: 7.4, h: 0.28,
    fontSize: 9.5, color: C.lavender, fontFace: "Calibri",
  });
  s.addText(DATA.aiLeverageCalc.calc, {
    x: 2.1, y: aiY + 0.32, w: 7.4, h: 0.24,
    fontSize: 9.5, color: C.lavender, fontFace: "Calibri",
  });
  s.addText(DATA.aiLeverageCalc.note, {
    x: 2.1, y: aiY + 0.56, w: 7.4, h: 0.24,
    fontSize: 9, color: "8B7FB0", fontFace: "Calibri",
  });

  footer(s);
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — What We Shipped — E3 Highlights
// 4 panels 2×2, colored headers, bullet lists
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  sectionTitle(s, `What We Shipped — E3 Highlights`);

  const bw = 4.6, bh = 2.08, bx0 = 0.32, by0 = 0.82, bgap = 0.08;
  DATA.shippedPanels.forEach((p, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const cx = bx0 + col * (bw + bgap), cy = by0 + row * (bh + bgap);

    // Card
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: bw, h: bh,
      fill: { color: C.white }, line: { color: "E2E8F0", width: 0.5 },
      shadow: { type: "outer", color: "000000", blur: 4, offset: 1, angle: 135, opacity: 0.07 },
    });
    // Colored header strip
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: bw, h: 0.38,
      fill: { color: p.color }, line: { color: p.color },
    });
    s.addText(`${p.category}:  ${p.title}`, {
      x: cx + 0.12, y: cy + 0.02, w: bw - 0.2, h: 0.34,
      fontSize: 11, bold: true, color: C.white, fontFace: "Calibri", valign: "middle",
    });
    // Separator line below header
    s.addShape(pres.shapes.LINE, {
      x: cx + 0.12, y: cy + 0.4, w: bw - 0.24, h: 0,
      line: { color: "E2E8F0", width: 0.5 },
    });
    // Bullet points
    p.bullets.forEach((b, bi) => {
      const by = cy + 0.46 + bi * 0.31;
      // bullet dot
      s.addShape(pres.shapes.OVAL, {
        x: cx + 0.14, y: by + 0.08, w: 0.1, h: 0.1,
        fill: { color: p.color }, line: { color: p.color },
      });
      s.addText(b, {
        x: cx + 0.3, y: by, w: bw - 0.44, h: 0.28,
        fontSize: 9.5, color: C.textPrimary, fontFace: "Calibri", valign: "middle",
      });
    });
  });

  footer(s, `${DATA.product} · Sprint ${DATA.sprint} Review · ${DATA.closeDate} · CONFIDENTIAL`);
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — Story Table
// Columns: Story | Title / Deliverable | PR(s) | +Lines | Duration
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  sectionTitle(s, `Story Table — E3 (${DATA.storyTable.length} stories, 17 PRs, sorted by merge order)`);

  const colW = [1.0, 4.5, 0.78, 0.88, 0.88];
  const cols = ["Story", "Title / Deliverable", "PR(s)", "+Lines", "Duration"];
  const x0 = 0.28, y0 = 0.82, rowH = 0.258;

  // Header
  s.addShape(pres.shapes.RECTANGLE, { x: x0, y: y0, w: 9.44, h: rowH, fill: { color: C.primary }, line: { color: C.primary } });
  let cx = x0;
  cols.forEach((c, i) => {
    s.addText(c, { x: cx + 0.04, y: y0 + 0.04, w: colW[i] - 0.04, h: rowH - 0.06, fontSize: 9.5, bold: true, color: C.white, fontFace: "Calibri", valign: "middle" });
    cx += colW[i];
  });

  // Story rows
  DATA.storyTable.forEach((st, idx) => {
    const ry = y0 + rowH + idx * rowH;
    const bg = idx % 2 === 0 ? C.white : C.rowAlt;
    s.addShape(pres.shapes.RECTANGLE, { x: x0, y: ry, w: 9.44, h: rowH, fill: { color: bg }, line: { color: "E2E8F0", width: 0.3 } });
    const row = [st.id, st.title, st.prs, st.lines, st.dur];
    cx = x0;
    row.forEach((cell, ci) => {
      s.addText(cell, {
        x: cx + 0.04, y: ry + 0.03, w: colW[ci] - 0.06, h: rowH - 0.06,
        fontSize: ci === 0 ? 8.5 : 9, bold: ci === 0,
        color: ci === 0 ? C.purple : (ci === 3 ? C.teal : C.textPrimary),
        fontFace: (ci === 2) ? "Consolas" : "Calibri", valign: "middle",
      });
      cx += colW[ci];
    });
  });

  // Totals row
  const totY = y0 + rowH + DATA.storyTable.length * rowH;
  s.addShape(pres.shapes.RECTANGLE, { x: x0, y: totY, w: 9.44, h: rowH, fill: { color: "EEF2FF" }, line: { color: "E2E8F0", width: 0.3 } });
  s.addText("TOTALS", { x: x0 + 0.04, y: totY + 0.03, w: 1.0, h: rowH - 0.06, fontSize: 9, bold: true, color: C.primary, fontFace: "Calibri", valign: "middle" });
  s.addText(DATA.storyTableTotals, { x: x0 + 1.06, y: totY + 0.03, w: 8.3, h: rowH - 0.06, fontSize: 9, color: C.textMuted, italic: true, fontFace: "Calibri", valign: "middle" });

  footer(s, `${DATA.product} · Sprint ${DATA.sprint} Review · ${DATA.closeDate} · CONFIDENTIAL`);
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — Story Cadence — 5-Day Delivery
// 5 vertical day cards side by side
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  sectionTitle(s, "Story Cadence — 5-Day Delivery");

  const cw = 1.82, ch = 3.98, cy = 0.82, x0 = 0.32, gap = 0.06;
  const countColors = [C.primary, C.primary, C.gold, C.gold, C.teal];

  DATA.cadence.forEach((d, i) => {
    const cx = x0 + i * (cw + gap);

    // Card
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cw, h: ch,
      fill: { color: C.white }, line: { color: "E2E8F0", width: 0.5 },
      shadow: { type: "outer", color: "000000", blur: 4, offset: 1, angle: 135, opacity: 0.07 },
    });
    // top accent
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cw, h: 0.06,
      fill: { color: C.primary }, line: { color: C.primary },
    });
    // Day number bold
    s.addText(`Day ${d.day}`, {
      x: cx + 0.08, y: cy + 0.1, w: cw - 0.16, h: 0.34,
      fontSize: 16, bold: true, color: C.textPrimary, fontFace: "Calibri", align: "center",
    });
    // Date
    s.addText(d.date, {
      x: cx + 0.08, y: cy + 0.44, w: cw - 0.16, h: 0.24,
      fontSize: 10, color: C.textMuted, fontFace: "Calibri", align: "center",
    });
    // Story count badge
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cx + 0.3, y: cy + 0.7, w: cw - 0.6, h: 0.3,
      fill: { color: countColors[i] }, line: { color: countColors[i] }, rectRadius: 0.04,
    });
    s.addText(`${d.count} ${d.count === 1 ? "story" : "stories"}`, {
      x: cx + 0.3, y: cy + 0.7, w: cw - 0.6, h: 0.3,
      fontSize: 10, bold: true, color: C.white, fontFace: "Calibri", align: "center", valign: "middle",
    });
    // Story list
    d.stories.forEach((st, si) => {
      s.addText(`• ${st}`, {
        x: cx + 0.08, y: cy + 1.06 + si * 0.28, w: cw - 0.14, h: 0.26,
        fontSize: 8, color: C.textMuted, fontFace: "Calibri",
      });
    });
    // Separator line before bottom stats
    s.addShape(pres.shapes.LINE, {
      x: cx + 0.08, y: cy + ch - 0.66, w: cw - 0.16, h: 0,
      line: { color: "E2E8F0", width: 0.5 },
    });
    // Hours (teal)
    s.addText(d.hours, {
      x: cx + 0.08, y: cy + ch - 0.62, w: cw - 0.16, h: 0.24,
      fontSize: 9, bold: true, color: C.teal, fontFace: "Calibri", align: "center",
    });
    // PR refs
    s.addText(d.prs, {
      x: cx + 0.06, y: cy + ch - 0.38, w: cw - 0.1, h: 0.32,
      fontSize: 7.5, color: C.textMuted, fontFace: "Calibri", align: "center",
    });
  });

  // Footer summary bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.88, w: 10, h: 0.28,
    fill: { color: C.primary }, line: { color: C.primary },
  });
  s.addText(DATA.cadenceFooter, {
    x: 0.2, y: 4.88, w: 9.6, h: 0.28,
    fontSize: 9.5, color: C.white, align: "center", fontFace: "Calibri", valign: "middle",
  });

  footer(s, `${DATA.product} · Sprint ${DATA.sprint} Review · ${DATA.closeDate} · CONFIDENTIAL`);
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — Quality & Testing
// 4 KPI cards (2×2) + support PRs table + postmortem callout
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  sectionTitle(s, "Quality & Testing");

  const qColors = [C.teal, C.teal, C.primary, C.primary];
  const cw = 1.56, ch = 1.42, x0 = 0.32, y0 = 0.82, gap = 0.08;
  DATA.qualityKpis.forEach((k, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const cx = x0 + col * (cw + gap), cy = y0 + row * (ch + gap);
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cw, h: ch,
      fill: { color: C.white }, line: { color: "E2E8F0", width: 0.5 },
      shadow: { type: "outer", color: "000000", blur: 3, offset: 1, angle: 135, opacity: 0.07 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cw, h: 0.06,
      fill: { color: qColors[i] }, line: { color: qColors[i] },
    });
    s.addText(k.v, {
      x: cx + 0.06, y: cy + 0.08, w: cw - 0.12, h: 0.72,
      fontSize: i < 2 ? 24 : 36, bold: true, color: qColors[i],
      fontFace: "Calibri", align: "center", valign: "middle",
    });
    s.addText(k.l, {
      x: cx + 0.06, y: cy + 0.82, w: cw - 0.12, h: 0.28,
      fontSize: 9.5, bold: true, color: C.textPrimary, fontFace: "Calibri", align: "center",
    });
    s.addText(k.sub, {
      x: cx + 0.04, y: cy + 1.1, w: cw - 0.08, h: 0.26,
      fontSize: 8.5, color: C.textMuted, fontFace: "Calibri", align: "center",
    });
  });

  // Postmortem callout box (below quality KPIs)
  const pmY = y0 + 2 * (ch + gap) + 0.08;
  s.addShape(pres.shapes.RECTANGLE, {
    x: x0, y: pmY, w: 3.28, h: 0.88,
    fill: { color: C.goldBg }, line: { color: C.gold, width: 0.8 },
  });
  s.addText(`⚠ ${DATA.postmortem.title}`, {
    x: x0 + 0.1, y: pmY + 0.04, w: 3.08, h: 0.26,
    fontSize: 9, bold: true, color: "78350F", fontFace: "Calibri",
  });
  s.addText(DATA.postmortem.body, {
    x: x0 + 0.1, y: pmY + 0.3, w: 3.08, h: 0.54,
    fontSize: 8.5, color: "78350F", fontFace: "Calibri",
  });

  // Support PRs table (right side)
  const spX = 3.8, spY = y0;
  s.addText("Support PRs (not in story totals)", {
    x: spX, y: spY, w: 5.88, h: 0.26,
    fontSize: 10, bold: true, color: C.textPrimary, fontFace: "Calibri",
  });
  // Header bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: spX, y: spY + 0.28, w: 5.88, h: 0.0, fill: { color: C.primary }, line: { color: C.primary },
  });
  DATA.supportPRs.forEach((pr, i) => {
    const ry = spY + 0.3 + i * 0.56;
    const bg = i % 2 === 0 ? C.white : C.rowAlt;
    s.addShape(pres.shapes.RECTANGLE, {
      x: spX, y: ry, w: 5.88, h: 0.52, fill: { color: bg }, line: { color: "E2E8F0", width: 0.3 },
    });
    // PR number badge
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: spX + 0.08, y: ry + 0.1, w: 0.56, h: 0.28,
      fill: { color: pr.color }, line: { color: pr.color }, rectRadius: 0.04,
    });
    s.addText(pr.num, {
      x: spX + 0.08, y: ry + 0.1, w: 0.56, h: 0.28,
      fontSize: 9, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Calibri",
    });
    // Type badge
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: spX + 0.72, y: ry + 0.1, w: 0.72, h: 0.28,
      fill: { color: C.white }, line: { color: pr.color, width: 0.8 }, rectRadius: 0.04,
    });
    s.addText(pr.type, {
      x: spX + 0.72, y: ry + 0.1, w: 0.72, h: 0.28,
      fontSize: 8.5, color: pr.color, align: "center", valign: "middle", fontFace: "Calibri",
    });
    // Description
    s.addText(pr.desc, {
      x: spX + 1.52, y: ry + 0.1, w: 4.3, h: 0.3,
      fontSize: 9.5, color: C.textPrimary, fontFace: "Calibri", valign: "middle",
    });
  });

  footer(s, `${DATA.product} · Sprint ${DATA.sprint} Review · ${DATA.closeDate} · CONFIDENTIAL`);
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 8 — Architecture Conventions Locked in E3
// 6 numbered convention cards, 3×2 grid
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  sectionTitle(s, "Architecture Conventions Locked in E3");

  const cols = 3, cw = 2.95, ch = 1.72, gap = 0.1, x0 = 0.35, y0 = 0.82;
  DATA.conventions.forEach((c, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const cx = x0 + col * (cw + gap), cy = y0 + row * (ch + gap);

    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cw, h: ch,
      fill: { color: C.white }, line: { color: "E2E8F0", width: 0.5 },
      shadow: { type: "outer", color: "000000", blur: 4, offset: 1, angle: 135, opacity: 0.07 },
    });
    // Colored top accent
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cw, h: 0.06,
      fill: { color: c.color }, line: { color: c.color },
    });
    // Number circle
    s.addShape(pres.shapes.OVAL, {
      x: cx + 0.12, y: cy + 0.12, w: 0.4, h: 0.4,
      fill: { color: c.color }, line: { color: c.color },
    });
    s.addText(String(c.num), {
      x: cx + 0.12, y: cy + 0.12, w: 0.4, h: 0.4,
      fontSize: 12, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Calibri",
    });
    // Title
    s.addText(c.title, {
      x: cx + 0.6, y: cy + 0.12, w: cw - 0.72, h: 0.4,
      fontSize: 10.5, bold: true, color: c.color, fontFace: "Calibri", valign: "middle",
    });
    // Separator
    s.addShape(pres.shapes.LINE, {
      x: cx + 0.12, y: cy + 0.56, w: cw - 0.24, h: 0,
      line: { color: "E2E8F0", width: 0.5 },
    });
    // Body text
    s.addText(c.body, {
      x: cx + 0.12, y: cy + 0.62, w: cw - 0.24, h: ch - 0.7,
      fontSize: 9.5, color: C.textMuted, fontFace: "Calibri", valign: "top",
    });
  });

  footer(s, `${DATA.product} · Sprint ${DATA.sprint} Review · ${DATA.closeDate} · CONFIDENTIAL`);
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 9 — Handoff — Sprint 3a → Sprint 3b
// Left: carry-over cards with status badges. Right: next sprint story list
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  sectionTitle(s, `Handoff — Sprint ${DATA.sprint} → Sprint 3b (E24: External Integration)`);

  // Left panel label
  s.addText("Carry-overs to Sprint 3b", {
    x: 0.32, y: 0.82, w: 4.4, h: 0.28,
    fontSize: 11, bold: true, color: C.gold, fontFace: "Calibri",
  });

  // Carry-over cards
  DATA.carryOvers.forEach((co, i) => {
    const ry = 1.14 + i * 0.82;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.32, y: ry, w: 4.4, h: 0.74,
      fill: { color: C.goldBg }, line: { color: C.gold, width: 0.7 },
    });
    s.addText(co.title, {
      x: 0.44, y: ry + 0.06, w: 2.4, h: 0.26,
      fontSize: 10.5, bold: true, color: C.textPrimary, fontFace: "Calibri",
    });
    // Status badge
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 2.9, y: ry + 0.06, w: 1.68, h: 0.24,
      fill: { color: co.badgeColor }, line: { color: co.badgeColor }, rectRadius: 0.04,
    });
    s.addText(co.badge, {
      x: 2.9, y: ry + 0.06, w: 1.68, h: 0.24,
      fontSize: 8.5, bold: true, color: C.white, align: "center", valign: "middle", fontFace: "Calibri",
    });
    s.addText(co.detail, {
      x: 0.44, y: ry + 0.36, w: 4.1, h: 0.3,
      fontSize: 9, color: C.textMuted, fontFace: "Calibri",
    });
  });

  // Right panel label
  s.addText("Sprint 3b — E24: External Integration", {
    x: 5.08, y: 0.82, w: 4.6, h: 0.28,
    fontSize: 11, bold: true, color: C.teal, fontFace: "Calibri",
  });

  // Next sprint story list
  DATA.nextSprintStories.forEach((st, i) => {
    const ry = 1.14 + i * 0.5;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.08, y: ry, w: 4.6, h: 0.42,
      fill: { color: C.teal }, line: { color: C.teal },
    });
    s.addText(st, {
      x: 5.18, y: ry, w: 4.4, h: 0.42,
      fontSize: 10.5, bold: true, color: C.white, fontFace: "Calibri", valign: "middle",
    });
  });

  // Handoff doc reference
  s.addText(`Full handoff document: ${DATA.handoffDocPath}`, {
    x: 0.32, y: 4.9, w: 9.36, h: 0.24,
    fontSize: 9, color: C.textMuted, italic: true, fontFace: "Calibri", align: "center",
  });

  footer(s, `${DATA.product} · Sprint ${DATA.sprint} Review · ${DATA.closeDate} · CONFIDENTIAL`);
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — Sprint 3a — Officially Closed
// 4 large KPIs centered + closing line + next sprint teaser
// ══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.primary };

  s.addText(`Sprint ${DATA.sprint} — Officially Closed`, {
    x: 0, y: 0.6, w: 10, h: 0.7,
    fontSize: 32, bold: true, color: C.white, fontFace: "Calibri", align: "center",
  });

  // 4 large KPI values horizontal
  const cw = 2.28, cy = 1.5, x0 = 0.32, gap = 0.1;
  DATA.closingKpis.forEach((k, i) => {
    const cx = x0 + i * (cw + gap);
    s.addText(k.v, {
      x: cx, y: cy, w: cw, h: 0.9,
      fontSize: 42, bold: true, color: C.white, fontFace: "Calibri", align: "center",
    });
    s.addText(k.l, {
      x: cx, y: cy + 0.88, w: cw, h: 0.3,
      fontSize: 12, color: C.lavender, fontFace: "Calibri", align: "center",
    });
  });

  // Closing line
  s.addText(DATA.closingLine, {
    x: 0.5, y: 2.7, w: 9, h: 0.34,
    fontSize: 11, color: C.gold, fontFace: "Calibri", align: "center",
  });

  // Next sprint section
  s.addText(DATA.nextTeaser, {
    x: 0.5, y: 3.3, w: 9, h: 0.4,
    fontSize: 16, bold: true, color: C.white, fontFace: "Calibri", align: "center",
  });
  s.addText(DATA.nextDetail, {
    x: 0.5, y: 3.72, w: 9, h: 0.3,
    fontSize: 12, color: C.lavender, fontFace: "Calibri", align: "center",
  });

  footer(s, `${DATA.product} · Sprint ${DATA.sprint} Review · ${DATA.closeDate} · CONFIDENTIAL`);
}

// ─── Write ────────────────────────────────────────────────────────────────────
const safeName = `${DATA.product}_Sprint${DATA.sprint}_Review`.replace(/[^A-Za-z0-9_-]+/g, "_");
const outPath = `${safeName}.pptx`;
pres.writeFile({ fileName: outPath })
  .then(() => console.log(`✅  Written: ${outPath}`))
  .catch(e => { console.error("ERROR:", e); process.exit(1); });
