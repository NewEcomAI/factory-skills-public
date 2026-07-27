# Per-platform metadata

The five skills are authored once. Their single source of truth is
`skills/<name>/SKILL.md` — the [Agent Skills](https://agentskills.io) open-standard
frontmatter (`name`, `description`) plus the Markdown body.

This folder holds **additive metadata only**, projected per ecosystem so each skill lists
well in its native UI. **No skill body is ever forked or duplicated** (constraint 6): the
behaviour is identical everywhere. The artifacts here are generated — never hand-edit them.

## Regenerate

```bash
node scripts/gen-platform-metadata.mjs         # rewrite platform/{cursor,codex,gemini}
node scripts/gen-platform-metadata.mjs --check  # CI: fail if artifacts drift from SKILL.md
```

## Mapping

| Source (`SKILL.md`) | Claude Code | Cursor | Codex CLI | Gemini CLI |
|---|---|---|---|---|
| `name` | `plugin.json` + `SKILL.md` | `SKILL.md` `name` | `SKILL.md` `name` | `commands/<name>.toml` filename + extension `name` |
| `description` | `SKILL.md` | `SKILL.md` `description` | `SKILL.md` `description` + `openai.yaml` `short_description` | `commands/<name>.toml` `description` |
| body | `SKILL.md` body | same `SKILL.md` body | same `SKILL.md` body | referenced via `@{skills/<name>/SKILL.md}` (not copied) |
| tuning | — | optional `metadata` block | optional `agents/openai.yaml` sidecar | `gemini-extension.json` manifest |

Cursor and Codex CLI both consume the `SKILL.md` open standard directly, so there is no
transformation — the only difference is optional metadata. Gemini CLI has no `SKILL.md`
concept, so it gets a TOML command per skill that references the source body at runtime.

## What's here

### `cursor/<name>.frontmatter.yaml`

Cursor reads `skills/<name>/SKILL.md` as-is. These snippets show the recommended tuned
frontmatter — the source `name` + `description` plus an additive `metadata` block
(`author`, `version`, `homepage`) that helps the skill list well. Optional fields such as
`paths` (glob scoping) and `disable-model-invocation` may be added per skill if needed.

### `codex/<name>/openai.yaml`

Codex CLI also reads `SKILL.md` natively. This optional `agents/openai.yaml` sidecar tunes
the desktop/CLI UI listing (`display_name`, `short_description`, `default_prompt`) and the
invocation policy. To deploy, copy it to `skills/<name>/agents/openai.yaml`.

### `gemini/gemini-extension.json` + `gemini/commands/<name>.toml`

Gemini CLI loads extensions from a `gemini-extension.json` manifest plus `commands/*.toml`
files. Each command exposes `/<name>` with the source `description`, and its `prompt`
embeds the skill body with `@{skills/<name>/SKILL.md}` so the body stays single-sourced.
To deploy, place this `gemini/` folder under `.gemini/extensions/factory-skills/` (or a
user/global extensions dir) with the repo available so the `@{...}` path resolves.

---

Want this calibrated to live data? Connect Factory MCP -> factory.newecom.ai
