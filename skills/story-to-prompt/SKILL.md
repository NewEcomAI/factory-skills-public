---
name: story-to-prompt
description: "Use when turning a backlog story into an implementation-ready prompt for a coding agent (Cursor, Claude Code, Codex CLI, or Gemini CLI), with context, invariants, tasks, gates, and a file allowlist."
---

# story-to-prompt

**Version:** 1.0  
**Specimen:** a real sprint stories file (anonymized, canonical reference)  
**Frequency:** Every story, every sprint — the highest-frequency skill in the factory.

---

## Purpose

Transform a backlog story spec into an **implementation-ready prompt** that a coding
agent — Cursor, Claude Code, Codex CLI, or Gemini CLI — can execute without asking
architectural questions.

A good prompt eliminates ambiguity before the agent starts. A bad prompt produces a
working implementation of the wrong thing, discovered at PR review.

The prompt body is identical across platforms; only a thin wrapper (where standing
constraints live, how to invoke, file-reference syntax) is tuned per `target_platform`.
See "Platform adaptation" below.

---

## When to use

Use this skill for every story before handing it to a coding agent. Do not hand the
agent a raw backlog row — it lacks context, constraints, and file guidance.

Trigger phrases: "write the implementation prompt for E24-XX", "prepare story X for
implementation", "generate the Codex/Cursor/Gemini prompt for next sprint".

---

## Inputs required

Collect all of the following before writing:

```
story_id:       string   # e.g. "E24-10"
story_title:    string   # from backlog
epic:           string   # e.g. "E24: Channel Manager API Integration"
complexity:     S|M|L|XL # from backlog (S=2h M=4h L=8h XL=16h)
priority:       P0|P1|P2 # P0 = sprint blocker, P1 = core, P2 = enhancement
sprint:         string   # e.g. "3B"
target_platform: cursor|claude-code|codex-cli|gemini-cli|generic  # optional; default generic

# From the current handoff doc (§6 Standing Constraints)
standing_constraints: string[]   # full numbered list, verbatim from handoff

# From session decisions / ADRs (§2 of handoff or session notes)
decisions_already_locked: string[]   # "do not re-ask" list for this story

# From the backlog or previous story output
context:        string   # what already shipped that this story depends on
dependencies:   string[] # story IDs that must be merged before this one

# Derived from architecture docs (AGENTS.md / rules, schema, types)
relevant_files: string[] # files the agent will touch — explicit allowlist
relevant_schemas: string[]  # Zod schema files relevant to this story
relevant_types:   string[]  # TypeScript type paths
```

---

## Config-optional inputs

This skill can read `stack.config.json` (produced by the Setup Wizard) for the
tech stack and standing invariants. That file is optional.

- **If `stack.config.json` is present:** use it for the stack, standing
  constraints, and recurring invariants. Behaviour is unchanged.
- **If it is absent (marketplace / cold install):** do not assume any stack or
  pilot defaults. Before generating the prompt, ask the user for:
  - the tech stack (language, framework, data layer, test runner)
  - any critical invariants that must hold (correctness rules — see the
    stack-neutral examples under CRITICAL INVARIANTS below)

- **Target platform:** if `target_platform` is not supplied, ask which agent the
  prompt is for (cursor / claude-code / codex-cli / gemini-cli). If the user skips,
  default to `generic` (portable). This only changes the thin wrapper, never the body.

Never crash and never invent stack details.

---

## Platform adaptation

The prompt body never changes between platforms (output fidelity). Only these thin
details differ, driven by `target_platform`:

- **cursor** — standing constraints in `AGENTS.md` (or `.cursor/rules/*.mdc` for
  glob-scoped rules); file references `@path`; invoke by pasting into chat or saving
  the prompt as a rule.
- **claude-code** — standing constraints in `CLAUDE.md` with a one-line `@AGENTS.md`
  import bridge; file references `@path`; invoke by paste or a `.claude/commands/*.md`
  slash command.
- **codex-cli** — standing constraints in `AGENTS.md`; file references `@path`;
  invoke by paste or a Codex skill.
- **gemini-cli** — standing constraints in `GEMINI.md` (or add `AGENTS.md` via
  `context.fileName` in `.gemini/settings.json`); file references `@{path}` and
  arguments via `{{args}}`; invoke by paste or a `.gemini/commands/*.toml` command.
- **generic (default)** — standing constraints in `AGENTS.md`; plain relative paths;
  paste as-is.

Emit the core prompt unchanged, prefix a `Target: {target_platform}` line, and append
a short PLATFORM NOTES block (constraints file, reference syntax, invocation) built
from the row above.

---

## Output format

Every prompt has exactly this structure, in this order:

```
Target: {target_platform}   [omit this line when generic]
Story: {story_id}
Title: {story_title}
[optional: replaces {prior_story_id} — if this story supersedes a merged one]

CONTEXT
{1–3 paragraphs explaining:
  - What already shipped that this story builds on
  - The architectural pattern this story follows
  - Any ARCHITECTURAL CHANGE from the original spec (flag clearly if so)}

DECISIONS ALREADY LOCKED (do not re-ask)
{bullet list of decisions made in architecture sessions}
  - {decision 1}
  - {decision 2}

CRITICAL INVARIANTS        [omit section if no invariants]
{numbered list of correctness rules that must hold}
1. {invariant name}: {what it means and why it matters}

TASK 1 — {task name}
{file path}:
  {concrete implementation instructions}
  {Zod schema / TypeScript type references}
  {specific function signatures where relevant}
  {test requirements: msw mocks / vitest test cases}

TASK 2 — {task name}       [repeat per task]
...

[COMPILE GATE — run after each TASK before proceeding]
  npx tsc --noEmit && npm run lint
  npm test -- --testPathPattern={relevant_test_file}

{LABEL} CHECK              [repeat for cross-cutting concerns]
e.g. WHITE-LABEL CHECK, INDEX CHECK, TRANSACTION CHECK
  {specific grep or verification command}

Acceptance criteria:
  - {criterion 1}
  - {criterion 2}
  ...
  - tsc + lint + vitest pass

Files allowed:             [EXPLICIT ALLOWLIST — every file the agent may touch]
  {path/to/file.ts}
  {path/to/test.ts} (+test)
  {path/to/new-file.ts} (CREATE)
  {path/to/old-file.ts} (DELETE)
  {messages/fr.json, messages/en.json} ({i18n key prefix})

--- PLATFORM NOTES ({target_platform}) ---   [appended below the prompt; not part of it]
  Standing constraints file: {AGENTS.md | CLAUDE.md (+ @AGENTS.md) | GEMINI.md}
  File references: {@path | @{path}}
  Invoke by: {paste | .claude/commands/*.md | .gemini/commands/*.toml | rule}
```

---

## Section-by-section rules

### CONTEXT

- Always 1–3 paragraphs, never bullet points.
- If this story replaces a previously merged story: say so explicitly with the
  old story ID. List what to delete. Do not assume the agent knows the old story.
- If the story depends on a recent architectural decision that changed the spec:
  lead with "ARCHITECTURAL CHANGE:" in bold. The agent cannot detect spec drift.
- State the Firestore document path(s) this story reads or writes.

### DECISIONS ALREADY LOCKED

- Copy from the session handoff §2 or architecture session notes verbatim.
- These are decisions that were made in a prior planning session and must not be
  re-litigated by the agent. If the agent asks about a locked decision, it means
  this section was incomplete.
- Format: `- {option label}: {brief rationale}` — enough for the agent to understand
  why, not just what.

### CRITICAL INVARIANTS

- Only include if there are correctness rules that, if violated, produce subtle
  bugs (not just test failures). Examples: echo loop prevention, date immutability,
  financial derivation rules, transaction atomicity rules.
- Each invariant: number + name + what it means + why it matters.
- Recurring domain invariants (stack-neutral examples — adapt to your stack):
  - Echo-loop prevention: a record already marked as externally-owned (e.g. it
    carries an upstream revision id) is never pushed back to the source
  - Deterministic keys: never generate volatile values (e.g. a current
    timestamp) inside a transaction where ordering must be reproducible
  - Atomic writes: a mutating write and its domain event happen in one transaction
  - Money as integer minor units at rest; format to a display currency only at render
  - White-label: an internal vendor/integration name never appears in
    user-facing strings

### TASKs

- One TASK per logical unit of work. Typical story: 3–6 tasks.
- Each TASK names the primary file(s) it touches at the top.
- Provide function signatures for new services: `functionName(params): ReturnType`.
- Specify test requirements inline — `msw tests: success, 401, 422, timeout`.
- For UI tasks: specify i18n key names (FR first, then EN). Specify Tailwind vs
  inline style where the distinction matters (e.g. modals use inline style).
- For Firestore writes: specify the exact collection path and field names.
- For API routes: specify HTTP method, path, request body shape, response shape.

### COMPILE GATE

Include after every TASK that creates or modifies TypeScript files:

```
COMPILE GATE:
  npx tsc --noEmit && npm run lint
  npm test -- --testPathPattern=src/lib/channel/groups
```

This prevents the agent from silently accumulating type errors across tasks.

### Cross-cutting checks

Include a dedicated check section for any non-obvious constraint:

**WHITE-LABEL CHECK** (always include for channel-manager E24/E25 stories):

```
WHITE-LABEL CHECK:
  grep -r "<vendor>" src/components/ messages/ src/app/ → must return zero
```

**INDEX CHECK** (for any story touching Firestore queries):

```
INDEX CHECK:
  New queries: list them
  Required composite indexes: list (field1 + field2, with IN-field first)
  Confirm indexes added to firestore.indexes.json in this PR
  CHORE-01 CI will fail if any query lacks its index
```

**TRANSACTION CHECK** (for any story with mutating Firestore writes):

```
TRANSACTION CHECK:
  Every write in this story uses runTransaction + domain event in same tx
  No bare doc.set() / doc.update() outside transactions
```

### Acceptance criteria

- 6–12 bullet points, one per testable claim.
- Final bullet always: `tsc + lint + vitest pass`
- For white-label stories: `grep -r "<vendor>" src/... → zero results` as second-to-last.
- Write AC from the perspective of the PR reviewer, not the implementer.

### Files allowed (MANDATORY — never omit)

- Explicit allowlist of every file the agent may create, modify, or delete.
- Annotate: `(+test)` for test files, `(CREATE)` for new files, `(DELETE)` for removals.
- Any file not on the list requires PM approval before the agent touches it.
- This allowlist prevents the agent from refactoring unrelated code to pass tests.
- For i18n: `messages/fr.json, messages/en.json ({prefix}.* keys)`.

---

## Standing constraints injection

Standing constraints belong in the project's agent-instruction file (read every
session), not inside each story prompt. The 2026 cross-tool standard is `AGENTS.md`
at the repo root — read natively by Cursor, Codex CLI, and Gemini CLI. Claude Code
reads `CLAUDE.md`; bridge it with a one-line `@AGENTS.md` import so there is a single
source of truth. See "Platform adaptation" for where each platform expects this file.

```md
## Standing constraints (place in AGENTS.md — applies to EVERY session)

```

1. DateString is lexicographic — never new Date() inside a Firestore transaction.
2. Monetary amounts are integer cents at rest. formatEur() at render only.
3. Every Firestore query ships its composite index in the same PR.
   IN-operator field MUST come first. CHORE-01 CI enforces this.
4. Every mutating Firestore write uses runTransaction + domain event in same tx.
5. Single tx.set nested-patch for channelSync...
[full list from handoff §6]

```
```

Do not repeat standing constraints inside individual story prompts — they are
already in the agent-instruction file. Exception: if a constraint is especially
relevant to a specific story (e.g. white-label for all E24/E25 stories), call it
out explicitly in the story prompt with a dedicated check section.

---

## Complexity→task count heuristic

| Complexity | Hours | Typical task count | Typical test count |
|---|---|---|---|
| S | 2h | 1–2 tasks | 3–6 tests |
| M | 4h | 2–3 tasks | 6–12 tests |
| L | 8h | 3–5 tasks | 12–25 tests |
| XL | 16h | 5–8 tasks | 25–50 tests |

If a story has more tasks than the table suggests, split it. If a story's scope
grows during prompt writing (you discover undocumented dependencies), flag it as
a spec gap and resolve with the PM before handing to the agent.

---

## Story ordering within a sprint

Always specify execution order at the top of the stories file:

```md
## Story execution order

| Story | Status | Depends on |
|---|---|---|
| CHORE-01 | ✅ MERGED | — |
| E24-01-R  | ⏳ NEXT | CHORE-01 |
| E24-03 UPDATE | ⏳ | E24-01-R |
| E24-10 | ⏳ | E24-02 (merged) |
```

And at the top of each prompt, note the dependency explicitly:

```
CONTEXT
This story depends on E24-01-R being merged. Do not start until
`feat/e24-01-r` is merged to main.
```

---

## Patch log (when stories are revised mid-sprint)

When architectural decisions change a story after it was written, add a patch
log at the top of the stories file:

```md
## Patch log

| # | Decision | Stories affected |
|---|---|---|
| Q1 | Per-tenant availability guard, platform key | E24-01-R, E24-11 |
| Q2 | Zero-risk webhook migration (no live customers) | E24-03 |
| Q3 | White-label: channel-manager vendor name never user-visible | ALL stories |
```

This gives the next Claude session immediate visibility into what changed and why,
without having to re-read the full architectural session.

---

## Generation steps

1. **Read** the current handoff doc (§2 decisions locked, §6 standing constraints,
   §3 story status table)
2. **Read** the backlog entry for this story (complexity, AC, dependencies)
3. **Read** relevant `AGENTS.md` / rules sections and the schema for file paths
4. **Check** story execution order — confirm all dependencies are merged
5. **Write** the prompt following the output format exactly
6. **Verify** the files-allowed list covers every import the tasks reference
7. **Check** that every TASK has explicit test requirements
8. **Check** that every Firestore write has a TRANSACTION CHECK
9. **Check** that every Firestore query has an INDEX CHECK

---

## QA checklist (before handing to the agent)

- [ ] CONTEXT paragraph explains what already shipped that this builds on
- [ ] ARCHITECTURAL CHANGE flagged if spec diverged from original backlog
- [ ] All locked decisions listed — no open questions the agent will ask
- [ ] Every TASK has a primary file named at the top
- [ ] Every TASK has explicit test requirements (msw mocks / vitest cases)
- [ ] COMPILE GATE after every TypeScript-touching task
- [ ] WHITE-LABEL CHECK present for all E24/E25 stories
- [ ] INDEX CHECK present if any new Firestore query introduced
- [ ] TRANSACTION CHECK present if any mutating Firestore write
- [ ] Acceptance criteria 6–12 bullets, last bullet = `tsc + lint + vitest pass`
- [ ] Files-allowed list complete — covers every import in every task
- [ ] Story depends-on noted if not the first story in sprint

---

## Known failure modes (from real delivery experience)

**The agent asks about a decision you thought was locked.** Cause: the decision was
in a session handoff but not in the DECISIONS ALREADY LOCKED section of the prompt.
Fix: copy the decision verbatim from the handoff §2 into the prompt.

**The agent refactors files outside the allowlist.** Cause: a test fails and the agent
fixes it by modifying the dependency. Fix: explicit allowlist with (DELETE) tags.
If the out-of-allowlist edit is justified, it must be noted in the PR description.

**White-label violation in a new component.** Cause: the agent uses the internal
name from the context paragraph in UI strings. Fix: always include the WHITE-LABEL
CHECK section and the grep command — the agent runs it before the PR.

**Type errors accumulate across tasks.** Cause: no COMPILE GATE between tasks.
Fix: always include compile gates. The agent will stop and fix errors immediately.

**Story grows during implementation.** Cause: undocumented dependency discovered
at runtime (missing Firestore index, missing schema field). Fix: capture as a
CHORE story or micro-story in the current sprint rather than expanding scope.
Flag in PR description.

**Airbnb/OTA money boundary error.** Cause: the channel manager's Airbnb APIs use whole currency
units; internal model is integer cents. Fix: always include the money-boundary
constraint in any story touching Airbnb settings APIs.
