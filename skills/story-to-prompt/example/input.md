# Example input — story-to-prompt

Backlog row (fictional demo — Acme Tasks):

| Story ID | Title | Epic | Size | Priority | Sprint | Depends on |
|---|---|---|---|---|---|---|
| E2-01 | Kanban board with drag-and-drop | E2: Task Board | L (8h) | P1 | 2 | E0, E1-01 |

Target platform: gemini-cli

Stack (cold-install answers, no config file present):

- Framework: Next.js 15 (App Router), TypeScript strict
- Data layer: PostgreSQL via Prisma
- Test runner: Vitest + Playwright

Critical invariants supplied by the user:

- Board column order is persisted per user and must survive reload
- A card move is a single atomic write (position + column in one transaction)
