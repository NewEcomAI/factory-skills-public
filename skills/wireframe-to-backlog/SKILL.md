---
name: wireframe-to-backlog
description: "Use when converting wireframes, mockups, or a prototype into a development backlog with epics, stories, hour estimates, and sprint assignments, applying a 4x factor to infrastructure stories."
---

# wireframe-to-backlog

**Version:** 1.0  
**Specimen:** a real SaaS delivery (anonymized) — 146 stories, 30 epics  
**Source:** anonymized SaaS wireframes (multiple HTML + Figma exports)  
**Category:** 5 — Project bootstrap (new project only)  
**Output:** Draft development backlog .xlsx ready for client review and negotiation

---

## What this skill does and doesn't do

**Does:** Reads wireframes → produces a structured backlog draft with epics,
stories, complexity estimates, sprint assignments, and dependencies. Gets you
to a 70% draft in one session instead of 3+ hours manually.

**Doesn't:** Make prioritization decisions, define the Phase 1/Phase 2 line,
or replace the client conversation. The output is a structured draft to
negotiate from, not a final contract.

**The human conversation that must happen after:**

- Which epics are Phase 1 MVP vs Phase 2?
- What is the sprint capacity (hours/sprint)?
- Which stories have client-side dependencies?
- What is the tech stack and does it affect complexity?
- Infrastructure correction factor applied (4× for auth/billing/payments/webhooks)?

---

## Inputs required

```
wireframe_files:    string[]   # HTML files — all versions if multiple
product_name:       string     # e.g. "<your product>"
client_name:        string     # e.g. "<client name>"
tech_stack:         string     # e.g. "Next.js 15, Firebase, TypeScript strict, Tailwind"
sprint_capacity_h:  number     # hours per sprint, e.g. 50
sprints_planned:    number     # number of planned sprints, e.g. 6
target_phases:      string     # e.g. "Phase 1: MVP (Sprint 1-4), Phase 2: V1.5+V2 (Sprint 5-6+)"
languages:          string[]   # e.g. ["FR", "EN"] — affects i18n story count
```

---

## Config-optional inputs

This skill can read `project.config.json` and `stack.config.json` (produced by
the Setup Wizard) for product identity and the tech stack. Those files are
optional.

- **If the config files are present:** use them for the product name, client
  name, and tech stack. Behaviour is unchanged.
- **If they are absent (marketplace / cold install):** do not assume any pilot
  defaults. Before producing the backlog, ask the user for:
  - product name
  - tech stack
  - which infrastructure areas apply (authentication, payments, billing,
    webhooks) — these are the stories that get the 4× correction factor

Never crash and never assume the pilot's values.

---

## Pass 1 — Screen inventory (do this first, before writing any stories)

Read every wireframe file. For each distinct screen, modal, panel, state,
and user flow, produce a flat inventory:

```
Screen inventory:
  [S01] Dashboard / Overview
    - KPI cards (CA brut, CA net, occupancy, ADR)
    - Property filter dropdown
    - Period selector
    - Revenue trend chart
    - Agency score grid
    - Latest bookings table
    - "Enter booking" CTA

  [S02] Calendar — Gantt view
    - Multi-villa Gantt grid
    - Villa filter
    - Month navigation
    - Status legend bar (confirmed / pending / cancelled / blocked)
    - OTA sync status bar
    - Booking popup (click on date)
    - Right sidebar (booking detail)

  [M01] Create reservation modal
    - Client combobox + inline new-client form
    - Check-in / check-out date pickers
    - Villa selector
    - Rate calculation
    - Notes field

  [etc.]
```

Count: total screens + modals. This number predicts backlog size.
Rule of thumb: 1 major screen = 1–3 stories. 1 complex modal = 1–2 stories.

---

## Pass 2 — Epic grouping

Group the screen inventory into epics. Each epic is a coherent functional
area that can be delivered as a unit. Use this standard epic structure as a
reference template:

**Standard epic categories for SaaS property/rental management:**

| Category | Example epics |
|---|---|
| Foundation | E0: Project Setup, E1: Authentication |
| Core entity management | E2: Villa Management, E3: Calendar & Reservations |
| Financial | E4: Interventions, E5: Invoicing |
| Intelligence / reporting | E7: Dashboard KPIs, E8: Monthly Reports |
| CRM | E6: Client Management |
| Integrations | E12: OTA Integration, E24: Channel Manager API |
| Notifications | E11: Notifications |
| Onboarding / quality | E14: Onboarding, E15: Quality Assurance |
| Commercial / billing | E13: SaaS Billing |
| Admin | E21: Admin Dashboard |

**Epic naming convention:** `E[NN]: [Functional Area Name]`

For each epic, write:

```
E[NN]: [Name]
  Scope: [one sentence — what this epic delivers]
  Screens: [list screen IDs from Pass 1 that belong here]
  Phase: [1 = MVP / 2 = V1.5 / 3 = V2]
  Depends on: [other epic codes that must complete first]
```

---

## Pass 3 — Story breakdown

For each epic, decompose into stories. Each story = one PR-sized unit of work.

**Story sizing rules (apply these consistently):**

| Size | Hours | What fits |
|---|---|---|
| S | 2h | Single component, read-only display, minor UI tweak |
| M | 4h | New screen with CRUD, service method + test, form with validation |
| L | 8h | Complex multi-state screen, new Firestore collection + service + UI + tests |
| XL | 16h | Epic foundation (domain layer, schema, service scaffold), complex integration |

**Infrastructure correction factor (apply to these categories):**

- Authentication flows: multiply initial estimate × 4
- Payment processing (Stripe, escrow): multiply × 4
- SaaS billing and subscription management: multiply × 4
- Webhook infrastructure (new inbound/outbound systems): multiply × 4
- Background job systems (cron, queues): multiply × 3

This is the SaaS billing lesson from a real delivery: estimated 14h, actual 64h.
Never estimate infrastructure stories at feature-story rates.

**Story ID convention:** `E[NN]-[NN]` (e.g. E3-01, E3-02, ...)

**For each story write:**

```
| Story ID | Title | Size | Hours | AC summary | Depends on |
|---|---|---|---|---|---|
| E3-01 | Multi-villa Gantt calendar grid | L | 8h | Grid renders per-villa rows, status colors, month navigation | E3-foundation |
```

**Story AC summary (one line) must answer:** what does "done" look like for this story?
Not a technical description — a user-visible outcome. "Gantt grid shows all villas
with color-coded reservation bars" not "Gantt component renders from Firestore data."

---

## Pass 4 — Sprint assignment

Assign stories to sprints using these rules:

1. **Foundation first:** E0 (Project Setup) is always Sprint 1, first epic.
   Auth is always Sprint 1, second epic. These cannot move.

2. **Dependency order:** If Epic B depends on Epic A, B cannot start before A
   completes. Build the dependency graph before assigning sprints.

3. **Sprint capacity:** Fill each sprint to `sprint_capacity_h × 0.85` (leave
   15% buffer for carry-overs and unplanned work).

4. **Multi-epic sprints:** When an epic is small (<15h), pair it with the
   adjacent epic in the same sprint. Example: a small OTA-integration epic (7h)
   paired with a Calendar epic (37h) in the same sprint.

5. **Phase gate at Sprint 4:** Phase 1 ends at Sprint 4. Everything from Sprint
   5 onward is Phase 2. The Sprint 4 close triggers Phase 2 planning.

**Sprint plan output format:**

```
Sprint 1: E0 + E1 — Foundation + Auth (~50h)
Sprint 2: E2 — Villa Management (~50h)
Sprint 3: E3 + E12 — Calendar + OTA shell (~50h)
Sprint 4: E4 + E5 + E16 — Interventions + Invoicing + Audit (~50h)
[PHASE 1 CLOSES → Phase 2 planning begins]
Sprint 5: E6 + E7 + E8 + E11 — Client + Dashboard + Reports + Notif (~50h)
Sprint 6: E14 + E15 — Onboarding + Quality (~50h)
```

---

## Pass 5 — Backlog document production

Produce the backlog as a structured document with these columns:

```
Sheet: Development Backlog
Columns:
  A: Epic (e.g. "E3: Calendar & Reservation Foundation")
  B: Story ID (e.g. "E3-01")
  C: Title
  D: Complexity (S/M/L/XL)
  E: Hours (S=2, M=4, L=8, XL=16)
  F: Sprint
  G: AC Summary (one line)
  H: Depends on (Story ID or blank)
  I: Done (blank — filled during delivery)
  J: CR# (blank — filled if story added via Change Request)

Summary sheet:
  Epic | Stories | Hours | Sprint | Phase
  Totals row
  Phase 1 subtotal / Phase 2 subtotal
```

**Note on the "Done" column:** This transforms the backlog from a planning
document into a delivery ledger — the most important structural improvement
from v6 → v7 in a real backlog. Leave it blank at creation. It becomes the Phase 2
planning input.

---

## Output format

Two deliverables:

**1. Backlog draft document** (produce as structured markdown for review,
convert to .xlsx with the xlsx skill for delivery):

```markdown
# [Product Name] Development Backlog — Draft v1
[Date] · [N] stories · [N] epics · [N] sprints planned

## Sprint Plan

| Sprint | Epics | Stories | Hours |
|---|---|---|---|
| Sprint 1 | E0 + E1 | N | Nh |
...

## Epic Summary

| Epic | Scope | Stories | Hours | Sprint | Phase |
|---|---|---|---|---|---|
...

## Full Story List

### E0: Project Setup
| Story | Title | Size | Hours | AC | Depends on |
|---|---|---|---|---|---|
...
```

**2. Discovery gaps report** — things seen in the wireframes that have no
clear story, or stories implied by the tech stack that the wireframe doesn't
show (but are always needed):

```markdown
## Discovery gaps

### Always-required stories not in wireframe
(These must be added regardless of wireframe coverage)
- [ ] E0-XX: CI/CD pipeline setup (GitHub Actions)
- [ ] E0-XX: Firestore seed data
- [ ] E0-XX: Error monitoring (Sentry)
- [ ] E1-XX: TOTP 2FA (if multi-user SaaS)
- [ ] E1-XX: Role-based access control
- [ ] CHORE: Firestore composite index CI test
- [ ] i18n infrastructure (if multilingual)

### Wireframe screens with no story
(Review with client — intentional or oversight?)
- [S-XX]: [screen description] — no story assigned

### Stories implied but not yet scoped
(Need client decision on inclusion)
- [feature implied by screen X] — [question for client]
```

---

## Reference actuals (estimate sanity-check)

Use these real-delivery actuals to sanity-check estimates:

| Metric | Reference Sprint 3A |
|---|---|
| Stories/sprint | 11–18 (avg ~14) |
| AI leverage | 13–19× (growing sprint over sprint) |
| Median PR duration | 46–62 min |
| Stories/active day | 2–3 |
| Test density | ~100 Vitest defs per story |

If your estimated sprint loads produce <10 stories/sprint, they're
probably oversized. If >20, they're probably undersized.

Free tier uses the static June-2026 calibration snapshot. Live monthly
calibration is available via Factory MCP.

---

## Generation steps

1. **Read all wireframe files** — click through every interactive state
2. **Run Pass 1** — complete screen inventory (30–60 items for a full SaaS)
3. **Run Pass 2** — group into epics (typically 10–25 epics for MVP+V2)
4. **Run Pass 3** — break each epic into stories (~4–8 stories per epic)
5. **Apply infrastructure correction factor** to auth/billing/webhook epics
6. **Run Pass 4** — assign to sprints, check capacity, verify dependency order
7. **Run Pass 5** — produce the backlog document and discovery gaps report
8. **Review session with PM** — adjust priorities, Phase 1/2 line, descope
9. **Convert to .xlsx** using the xlsx skill
10. **Version as v1** — subsequent changes go through the CR process (S7)

---

## QA checklist

- [ ] Every wireframe screen maps to at least one story or "out of scope" note
- [ ] E0 (Project Setup) is Sprint 1 with all required infrastructure stories
- [ ] Auth epic has infrastructure correction factor applied
- [ ] Billing/payments epic (if any) has infrastructure correction factor applied
- [ ] Each sprint is within 85% of capacity (leave buffer)
- [ ] No story in Sprint N depends on a story not merged by Sprint N-1
- [ ] Discovery gaps report produced — "always-required" stories included
- [ ] "Done" column present but blank
- [ ] "CR#" column present but blank
- [ ] Total hours match: sum of story hours = sum of sprint hours

---

## Known failure modes (from real delivery)

**Infrastructure stories massively underestimated.** E13 SaaS Billing: 14h →
64h (4.6×). Auth, payments, and webhooks always take longer than feature work.
Apply the 4× correction factor and warn the client explicitly.

**Wireframe-only backlog misses always-required stories.** Wireframes show
features, not infrastructure. CI/CD, error monitoring, composite indexes, seed
data, i18n infrastructure — none of these appear in wireframes but all are
required. Always add the "always-required" list.

**Single-phase planning.** Trying to fit everything into one phase before
seeing real velocity produces overcommitment. Always structure as Phase 1 (discovery)
→ Phase 2 (fixed price based on actuals). The Phase 1/2 line is the most
important decision in the backlog — make it explicit.

**Scope creep without the CR column.** Starting without a CR# column means
post-contract additions silently corrupt velocity data. Add the column before
the first story is delivered, not after the second sprint.
