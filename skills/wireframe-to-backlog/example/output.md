# Acme Tasks Development Backlog — Draft v1

2026-07-17 · 18 stories · 6 epics · 4 sprints planned

## Sprint Plan

| Sprint | Epics | Stories | Hours |
|---|---|---|---|
| Sprint 1 | E0 + E1 | 5 | ~48h |
| Sprint 2 | E2 + E3 | 6 | ~32h |
| Sprint 3 | E4 | 4 | ~24h |
| Sprint 4 | E5 | 3 | ~50h |

[PHASE 1 CLOSES → Phase 2 planning begins]

## Epic Summary

| Epic | Scope | Stories | Hours | Sprint | Phase |
|---|---|---|---|---|---|
| E0: Project Setup | CI/CD, schema, error monitoring | 2 | 20h | 1 | 1 |
| E1: Authentication | Email + Google SSO + 2FA | 3 | 28h | 1 | 1 |
| E2: Task Board | Kanban board + drag-and-drop | 3 | 18h | 2 | 1 |
| E3: Task Detail | Detail modal + comments | 3 | 14h | 2 | 1 |
| E4: Team & Roles | Invites, roles, permissions | 4 | 24h | 3 | 1 |
| E5: Billing | Stripe subscriptions + invoices | 3 | 50h | 4 | 1 |

## Full Story List (excerpt)

### E1: Authentication

| Story | Title | Size | Hours | AC | Depends on |
|---|---|---|---|---|---|
| E1-01 | Email + password sign-in | M | 4h | User signs in and lands on dashboard | E0 |
| E1-02 | Google SSO | L | 8h → 4× | OAuth round-trip, account link | E1-01 |
| E1-03 | TOTP 2FA | L | 8h → 4× | Enroll + verify at login | E1-01 |

### E5: Billing

| Story | Title | Size | Hours | AC | Depends on |
|---|---|---|---|---|---|
| E5-01 | Stripe subscription checkout | L | 8h → 4× (32h) | Plan selected, checkout completes, webhook activates plan | E0 |

Note: infrastructure stories (SSO, 2FA, Stripe billing) carry the 4× correction factor.
E5 Billing is sized at 50h, not the naive ~13h, reflecting webhook + subscription-state work.

## Discovery gaps

### Always-required stories not in wireframe

- [ ] E0-01: CI/CD pipeline (GitHub Actions)
- [ ] E0-02: Error monitoring (Sentry)
- [ ] E1-04: Role-based access control

### Wireframe screens with no story

- [S02] Activity feed — no story assigned (review with client — intentional or oversight?)
