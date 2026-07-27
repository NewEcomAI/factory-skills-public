---
name: change-request-impact
description: "Use when a scope change arrives mid-project and you need to classify it, size it, run an absorbability test, and produce both an internal record and a client-facing change-request email."
---

# change-request-impact

**Version:** 1.0  
**Specimen:** a real change-request process (anonymized)  
**Retroactive specimens:** E17 Dynamic Pricing (post-contract, unlogged), E22 Landing Page (post-contract, unlogged)  
**Response window:** user-defined via `response_sla_days` (set to your standard response window)  
**Frequency:** As needed — every scope change that meets the formal CR threshold.

---

## Purpose

Produce the **Change Request Impact Assessment** to deliver within your
agreed response window (`response_sla_days`) of receiving a client
scope request. Keeps velocity data clean by tagging hours correctly as
original-scope or CR-scope. Feeds Phase 2 planning accurately.

**Principle:** The CR process is a transparency tool, not a
gate. It is intentionally lightweight — email, a defined response window, written
approval. Its purpose is to keep velocity data clean and the Phase 2 estimate
accurate, not to prevent the product from evolving.

---

## When a formal CR is required

A formal CR is required when a modification:

- **(a)** adds new stories not in the approved backlog
- **(b)** increases a story's complexity by more than one size category (e.g. S→L or M→XL)
- **(c)** introduces a new epic

Minor changes — UI refinements, wording, configuration decisions — are absorbed
within sprint hours. No CR needed.

**The test:** if you would add a row to the backlog or change a story's size by
more than one step, it needs a CR.

**Known gap from a real delivery:** E17 Dynamic Pricing and E22 Landing Page were both
added post-contract (v7 backlog) without formal CRs. Both are new epics — they
should have triggered CRs immediately. This corrupts the Phase 2 estimate
by mixing original-scope velocity with CR-scope velocity. This skill exists
partly to prevent that from happening again.

---

## Inputs required

```
cr_description:       string   # plain-language description from client email
received_date:        string   # YYYY-MM-DD — starts the response-window (SLA) clock
response_sla_days:    number   # your standard response window, in business days (e.g. 3)
project_name:         string   # e.g. "<your product> / <white-label brand>"
client_name:          string   # e.g. "<client name>"
sender_name:          string   # name that signs the client email — prompt if not configured

# Current sprint state (from handoff or backlog)
current_sprint:       string   # e.g. "Sprint 3B"
sprint_capacity_h:    number   # hours remaining in current sprint
sprint_hours_used:    number   # hours already consumed

# Backlog context (from v7 backlog)
phase1_remaining_h:   number   # hours remaining in Phase 1 scope
current_backlog_stories: number  # total stories in approved backlog

# The proposed change (derive from CR description)
change_type:          'new_epic' | 'new_stories' | 'complexity_increase' | 'minor'
affected_epics:       string[]  # existing epics affected
proposed_stories:     Story[]   # { id, title, complexity: S|M|L|XL, hours: number }
```

**Cold-install note:** This skill ships with no bundled process config. If
`response_sla_days` and `sender_name` are not supplied, ask the user for both
before generating the client-facing email — never assume a response window or
invent a signature.

---

## Output format

Two deliverables produced together:

1. **Internal assessment** (for internal records + backlog update)
2. **Client-facing email response** (plain language, professional tone)

---

### Deliverable 1 — Internal impact assessment

```markdown
# CR-[NNN] — [Short title]

**Received:** [date]  
**SLA deadline:** [received + response_sla_days business days]  
**Status:** Draft → Sent → Approved / Withdrawn  
**Logged by:** [name]

---

## 1. CR classification

| Field | Value |
|---|---|
| Change type | [new_epic / new_stories / complexity_increase] |
| CR threshold trigger | [(a) new stories / (b) complexity jump / (c) new epic] |
| Formal CR required? | Yes |

---

## 2. What the client is asking for

[2–3 sentence plain-language summary of the request]

---

## 3. Proposed scope

| Story ID | Title | Complexity | Hours | Phase |
|---|---|---|---|---|
| [E17-01] | [AI pricing rules engine] | L | 12h | V1.5 |
| [E17-02] | [Dynamic pricing settings UI] | M | 6h | V1.5 |
| **Total** | | | **[N]h** | |

---

## 4. Impact assessment

### Hours

| Category | Hours |
|---|---|
| Net new hours added | [N]h |
| Current Phase 1 remaining capacity | [N]h |
| Current sprint remaining capacity | [N]h |
| **Absorbable in current sprint?** | **Yes / No** |
| **Absorbable in Phase 1?** | **Yes / No** |

### Sprint impact

[One paragraph: which sprint(s) are affected, whether current sprint
can absorb it, whether it pushes other stories out, whether it defers
to Phase 2.]

### Phase 2 estimate impact

[One paragraph: how this CR affects the Phase 2 estimate. If absorbed
into Phase 1, it reduces Phase 2 scope. If deferred to Phase 2, it adds
scope. Note any velocity data contamination risk.]

### Recommendation

**[ABSORB in Sprint N / DEFER to Phase 2 / SPLIT: X stories in Phase 1, Y in Phase 2]**

[2–3 sentence rationale for the recommendation]

---

## 5. Backlog update required

| Action | Details |
|---|---|
| Add to backlog | [story IDs + sizes] |
| Sprint assignment | [Sprint N — absorb / Phase 2 — defer] |
| Complexity change | [if applicable] |
| Backlog version | v[N] → v[N+1] |

**Phase 2 estimate note:** This CR adds [N]h of CR-scope work. In
Phase 2 planning, flag these stories as CR-scope so velocity
baselines reflect original-scope delivery only.

---

## 6. Approval record

| Field | Value |
|---|---|
| Sent to client | [date] |
| Client decision | Approved / Withdrawn / Pending |
| Approval received | [date] |
| Approval method | Email (written approval sufficient) |
| Work start date | [date — no work before written approval] |
```

---

### Deliverable 2 — Client-facing email

```
Subject: CR-[NNN] Impact Assessment — [Short title] | Response due [SLA date]

[Client name],

Thank you for the request regarding [brief description]. Per our engagement
terms, I've assessed the impact below.

──────────────────────────────────────────
CHANGE REQUEST — CR-[NNN]
[Short title]
──────────────────────────────────────────

WHAT YOU ASKED FOR
[2–3 sentences, plain language, no jargon]

SCOPE CLASSIFICATION
This is a formal CR under our agreement because it [adds new stories not
in the approved backlog / introduces a new epic / increases story complexity
by more than one size category].

HOURS ADDED
[N] hours total across [N] stories.

[If absorbable:]
RECOMMENDATION: ABSORB IN SPRINT [N]
These [N] hours fit within Sprint [N]'s remaining capacity ([N]h). I recommend
absorbing this work in Sprint [N] alongside [current sprint focus]. This keeps
the delivery timeline intact and does not affect the Phase 1 retainer.

To confirm: [story titles, 1 line each]

[If deferring:]
RECOMMENDATION: DEFER TO PHASE 2
Sprint [N] has [N]h of remaining capacity, and this work requires [N]h. Adding
it to Sprint [N] would displace [affected stories] — I recommend deferring to
Phase 2, where it will be costed and scheduled based on Phase 1 velocity data.

[If splitting:]
RECOMMENDATION: SPLIT
[X stories] can be absorbed in Sprint [N] ([N]h). [Y stories] require Phase 2
scope ([N]h) due to capacity constraints.

WHAT HAPPENS NEXT
Once you confirm this assessment in writing (a reply to this email is
sufficient), I'll update the backlog and include this work in the sprint plan.
No work begins before your written approval.

Please respond by [SLA date — response_sla_days business days from today].

Best,
{{sender_name}}
```

---

## Classification rules

### Size lookup (for estimating new stories)

| Complexity | Hours | Description |
|---|---|---|
| S | 2h | Single-file change, no new Firestore collections, no new API routes |
| M | 4h | 2–3 files, new service methods, existing patterns |
| L | 8h | New service + schema + UI + tests, follows established patterns |
| XL | 16h | New epic foundation, new Firestore collections, cross-cutting changes |

### Infrastructure correction factor

Infrastructure epics (auth, billing, payments, webhooks) are systematically
underestimated at discovery time. Apply a 4× correction factor when sizing
new epics in these categories. Example: E13 SaaS Billing was initially 14h
(3 × M) — corrected to 64h after analysis.

Categories requiring the 4× factor:

- Payment processing (Stripe, escrow, refunds)
- Authentication flows (new auth providers, SSO)
- Webhook infrastructure (new inbound/outbound webhook systems)
- SaaS billing and subscription management
- Complex background job systems (cron, queues)

### Absorbability test

A CR is absorbable in the current sprint if:

- `hours_added ≤ sprint_remaining_capacity × 0.8` (leave 20% buffer)
- No blocked stories are displaced (check handoff §11)
- No new architectural decisions are required (would need a session first)

If any condition fails, defer to Phase 2 or a dedicated sprint.

---

## CR log (maintain across all CRs)

Keep a running CR log in the project. Add one row per CR:

```markdown
# CR Log — [Project Name]

| CR# | Date | Title | Type | Hours | Disposition | Approved |
|---|---|---|---|---|---|---|
| CR-001 | 2026-05-XX | E17 Dynamic Pricing | new_epic | 18h | Phase 2 (V1.5) | Retroactive |
| CR-002 | 2026-05-XX | E22 Landing Page | new_epic | 16h | Phase 2 (V2) | Retroactive |
```

**Retroactive CRs:** For scope additions that bypassed the CR process (like
E17 and E22 in a real delivery), log them retroactively with disposition "Retroactive"
and note the backlog version where they appeared. This preserves Phase 2
estimate accuracy.

---

## Phase 2 scope tagging

Every CR-scope story must be tagged in the backlog and in the sprint metrics:

In the backlog: add column `CR#` — e.g. `CR-001` for E17 stories, blank for original scope.

In the sprint metrics summary: add a section:

```
## CR-scope stories this sprint
| Story | CR# | Hours |
|---|---|---|
| E17-01 | CR-001 | 12h |
| E17-02 | CR-001 | 6h |
CR total this sprint: 18h (excluded from original-scope velocity baseline)
```

In Phase 2 planning: velocity baseline uses original-scope hours
only. CR hours are reported separately as scope additions.

Free tier uses the static June-2026 calibration snapshot. Live monthly
calibration is available via Factory MCP.

---

## Generation steps

1. **Read** the CR description from client email
2. **Read** current handoff for sprint capacity (§3 story status + §10 sprint plan)
3. **Read** current backlog for phase remaining capacity
4. **Classify** the CR type and check the threshold triggers
5. **Size** each proposed story using the complexity table + infrastructure factor
6. **Run** the absorbability test
7. **Write** the internal assessment (Deliverable 1)
8. **Write** the client email (Deliverable 2)
9. **Add** a row to the CR log
10. **Update** the backlog with new stories and CR# tag (after client approval)

---

## QA checklist

- [ ] CR number assigned sequentially (CR-001, CR-002, ...)
- [ ] SLA deadline calculated correctly (response_sla_days business days, excluding weekends)
- [ ] Change type correctly classified — verify against the three threshold triggers
- [ ] Hours estimated with infrastructure correction factor if applicable
- [ ] Absorbability test run with 20% buffer applied
- [ ] Recommendation is one of: ABSORB / DEFER / SPLIT — not "it depends"
- [ ] Client email is plain language — no jargon, no technical detail
- [ ] Client email states clearly that no work begins before written approval
- [ ] CR log row added
- [ ] Phase 2 estimate note included in internal assessment
- [ ] If retroactive: "Retroactive" disposition noted with backlog version reference

---

## Known failure modes (from real delivery)

**CR bypassed entirely.** E17 and E22 were added to v7 backlog without CR.
Root cause: no skill, no trigger, no log. Fix: this skill. Prevention: any
new epic or new story group discovered during planning or client conversation
should immediately trigger "run the CR skill before adding to backlog."

**Velocity contamination.** CR-scope stories counted in original-scope
velocity make the Phase 2 estimate unreliable. Fix: retroactive CR log +
Phase 2 scope tagging separates the two datasets.

**SLA missed.** The response window passes without a response. Fix: set a
calendar reminder when the CR email is received. The SLA deadline appears
in both the internal assessment and the client email.

**Work started before approval.** The rule is explicit: no work begins
before written approval. Even if you're confident the client will approve,
do not start. A withdrawn CR after work has begun creates a dispute.
