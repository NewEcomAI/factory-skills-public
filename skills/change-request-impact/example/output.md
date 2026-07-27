# CR-001 — Recurring tasks + calendar view

**Received:** 2026-07-15
**SLA deadline:** 2026-07-18 (3 business days)
**Status:** Draft
**Logged by:** Jordan Lee

## 1. CR classification

| Field | Value |
|---|---|
| Change type | new_epic |
| CR threshold trigger | (c) new epic |
| Formal CR required? | Yes |

## 2. What the client is asking for

Add recurring tasks (daily / weekly / monthly repeat) plus a calendar view to see
them. Neither is in the approved backlog.

## 3. Proposed scope

| Story ID | Title | Complexity | Hours | Phase |
|---|---|---|---|---|
| E6-01 | Recurrence rule engine (RFC 5545 subset) | L | 8h | V1.5 |
| E6-02 | Recurring-task settings UI | M | 4h | V1.5 |
| E6-03 | Calendar view | L | 8h | V1.5 |
| **Total** | | | **20h** | |

## 4. Impact assessment

### Hours

| Category | Hours |
|---|---|
| Net new hours added | 20h |
| Current Phase 1 remaining capacity | 34h |
| Current sprint remaining capacity | 12h |
| **Absorbable in current sprint?** | **No** |
| **Absorbable in Phase 1?** | **Yes** |

### Recommendation

**DEFER TO PHASE 2** — 20h will not fit Sprint 3's remaining 12h without displacing
committed stories. It fits Phase 1's 34h remaining, but recurrence is a new epic that
warrants its own design pass. Recommend costing it in Phase 2 against real velocity.

---

## Client-facing email

```text
Subject: CR-001 Impact Assessment — Recurring tasks + calendar view | Response due 2026-07-18

Hi there,

Thank you for the request regarding recurring tasks and a calendar view. Per our
engagement terms, I've assessed the impact below.

CHANGE REQUEST — CR-001: Recurring tasks + calendar view

WHAT YOU ASKED FOR
The ability to repeat a task daily, weekly, or monthly, plus a calendar view to see
scheduled tasks.

SCOPE CLASSIFICATION
This is a formal CR under our agreement because it introduces a new epic.

HOURS ADDED
20 hours total across 3 stories.

RECOMMENDATION: DEFER TO PHASE 2
Sprint 3 has 12h of remaining capacity, and this work requires 20h. Adding it now
would displace committed stories, so I recommend scheduling it in Phase 2, where it
will be costed against Phase 1 velocity data.

WHAT HAPPENS NEXT
Once you confirm in writing (a reply is sufficient), I'll log this and add it to the
Phase 2 plan. No work begins before your written approval.

Please respond by 2026-07-18.

Best,
Jordan Lee
```
