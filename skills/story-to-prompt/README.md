# story-to-prompt

Turn a backlog story into a precise, implementation-ready prompt for your coding agent.

## Install

```text
/plugin marketplace add NewEcomAI/factory-skills-public
/plugin install factory@factory-skills
```

## What you get

- A structured prompt with context, locked decisions, and critical invariants
- Explicit tasks, validation gates, and acceptance criteria
- A mandatory file allowlist so the agent only touches what it should
- Per-platform tuning via `target_platform` (Cursor, Claude Code, Codex CLI, Gemini CLI) — one portable prompt body plus a thin platform wrapper
- Stack-neutral: prompts for your stack and invariants when no config is present

## Output

A copy-paste implementation prompt ready to hand to your coding agent, adapted to the target platform.

## License

MIT — covered by the root [LICENSE](../../LICENSE).

---

Want this calibrated to live data? Connect Factory MCP -> factory.newecom.ai
