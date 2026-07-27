Target: gemini-cli
Story: E2-01
Title: Kanban board with drag-and-drop

CONTEXT
Authentication (E1-01) and project setup (E0) are merged. This story adds the first
board view for Acme Tasks: three columns (Todo / Doing / Done) with drag-and-drop
cards backed by PostgreSQL via Prisma. Card position is stored as an integer order
within a column; a move updates both column and position in one transaction.

DECISIONS ALREADY LOCKED (do not re-ask)

- Column set is fixed for v1 (Todo / Doing / Done) — no custom columns yet
- Drag-and-drop library: dnd-kit (already approved for the stack)
- Board column order is persisted per user, not global

CRITICAL INVARIANTS

1. Atomic move: a card move writes column + position in a single Prisma transaction — never two writes.
2. Reload-stable order: per-user column order must survive a page reload (persisted, not client-only state).

TASK 1 — data layer
prisma/schema.prisma + src/server/tasks.ts:
  Add `columnId` and `position` (Int) to the Task model.
  moveTask(taskId, toColumn, toPosition): Promise<Task> — single tx that reorders siblings.
  Vitest: reorder within column, move across columns, concurrent-move guard.

TASK 2 — board UI
src/app/board/page.tsx + src/components/Board.tsx:
  Render 3 columns from server data; dnd-kit drag handlers call moveTask.
  Optimistic update with rollback on error.

COMPILE GATE:
  npx tsc --noEmit && npm run lint
  npm test -- src/server/tasks.test.ts

Acceptance criteria:

- Cards render in the correct column and order on first load
- Dragging a card across columns persists column + position
- Order survives a full page reload
- A move is a single transaction (no intermediate inconsistent state)
- tsc + lint + vitest pass

Files allowed:
  prisma/schema.prisma
  src/server/tasks.ts
  src/server/tasks.test.ts (+test)
  src/app/board/page.tsx
  src/components/Board.tsx (CREATE)

--- PLATFORM NOTES (gemini-cli) ---
  Standing constraints file: GEMINI.md (or add AGENTS.md via context.fileName)
  File references: @{path}
  Invoke by: .gemini/commands/*.toml command (args via {{args}})
