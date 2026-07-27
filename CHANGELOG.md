# Changelog

All notable changes to this project are documented in this file. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-17

Initial launch — the free five-skill bundle for Claude Code, Cursor, Codex CLI, and Gemini CLI.

### Added

- **wireframe-to-backlog** — wireframe or prototype to an estimated development backlog, applying a 4× correction factor to infrastructure stories (auth, payments, billing, webhooks).
- **change-request-impact** — classify, size, and run an absorbability test on a mid-project scope change, producing an internal record and a client-facing email.
- **brand-spec-generator** — turn a short brand brief into a WCAG 2.1 AA HTML design-system spec with color tokens, a type scale, and a cursor rules block.
- **sprint-review** — a bundled generator plus a documented manual `DATA{}` path that renders a 10-slide sprint-review PPTX.
- **story-to-prompt** — turn a backlog story into an implementation-ready prompt for a coding agent (Cursor, Claude Code, Codex CLI, or Gemini CLI) with context, locked decisions, invariants, tasks, gates, and a file allowlist.
- `.claude-plugin/plugin.json` plugin manifest listing the five skills, with a `validate:plugin` check.
- Per-skill README, a fictional example input/output pair, and an MIT LICENSE pointer for every skill.
- Packaging QA (`npm run qa`) covering the seven standing constraints; single root MIT LICENSE.

[1.0.0]: https://github.com/NewEcomAI/factory-skills-public/releases/tag/v1.0.0
