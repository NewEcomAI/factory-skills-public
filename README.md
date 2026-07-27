# NewEcom.AI Factory — Launch Skills

<!--
Analytics / UTM scheme for README click-throughs (feeds the S0.3 analytics dashboard):
  base: https://factory.newecom.ai/
  utm_source=github  utm_medium=readme  utm_campaign=phase1-launch
  utm_content identifies the placement (badge_claude | badge_cursor | badge_codex |
  badge_gemini | cta_generator | cta_footer).
UTM query tags only — no third-party scripts, pixels, or trackers (marketplace-policy safe).
Install badges link to the hosted install guide (factory.newecom.ai/guide) until each
marketplace listing is live; swap the badge link targets to the store URLs at that point.
-->

[![Claude Code](https://img.shields.io/badge/Claude%20Code-Install-D97757?logo=anthropic&logoColor=white)](https://factory.newecom.ai/guide?utm_source=github&utm_medium=readme&utm_campaign=phase1-launch&utm_content=badge_claude)
[![Cursor](https://img.shields.io/badge/Cursor-Install-0A0A0A?logo=cursor&logoColor=white)](https://factory.newecom.ai/guide?utm_source=github&utm_medium=readme&utm_campaign=phase1-launch&utm_content=badge_cursor)
[![Codex CLI](https://img.shields.io/badge/Codex%20CLI-Install-412991?logo=openai&logoColor=white)](https://factory.newecom.ai/guide?utm_source=github&utm_medium=readme&utm_campaign=phase1-launch&utm_content=badge_codex)
[![Gemini CLI](https://img.shields.io/badge/Gemini%20CLI-Install-8E75B2?logo=googlegemini&logoColor=white)](https://factory.newecom.ai/guide?utm_source=github&utm_medium=readme&utm_campaign=phase1-launch&utm_content=badge_gemini)

Five free, calibrated AI-assisted delivery skills for Claude Code, Cursor, Codex CLI, and Gemini CLI.
Marketplace listings are rolling out — the badges above link to the [install guide](https://factory.newecom.ai/guide) until each store listing is live.

## Install

The five skills are authored once as `skills/<name>/SKILL.md` (the
[Agent Skills](https://agentskills.io) open standard) and work across four coding agents.
Installation differs per platform.

### Claude Code

Run these inside a Claude Code session (the interactive terminal). Add the marketplace, then
install the plugin:

```text
/plugin marketplace add NewEcomAI/factory-skills-public
/plugin install factory@factory-skills
```

Scope is set with `--scope`: `user` (default — all your projects), `project` (writes
`.claude/settings.json`, commit it to share with your team), or `local` (this repo only,
gitignored). Requires Claude Code 1.0.33+.

### Cursor

Cursor reads `skills/<name>/SKILL.md` directly — no marketplace step. Make the skills
available to Cursor (clone this repo into your workspace, or copy `skills/` into your
project) and they load as Agent Skills. Optional tuned frontmatter is in
`platform/cursor/<name>.frontmatter.yaml`.

### Codex CLI

Codex CLI also reads `SKILL.md` natively — point it at the `skills/` directory. To tune the
CLI listing, copy the sidecar `platform/codex/<name>/openai.yaml` to
`skills/<name>/agents/openai.yaml`.

### Gemini CLI

Gemini CLI has no `SKILL.md` concept; it loads an extension. Place the `platform/gemini/`
folder under `.gemini/extensions/factory-skills/` (with this repo available so the
`@{skills/<name>/SKILL.md}` references resolve). Each skill is then exposed as a `/<name>`
command.

See [platform/README.md](platform/README.md) for the full per-platform mapping.

## Skills

| Skill | What it does |
|---|---|
| [wireframe-to-backlog](skills/wireframe-to-backlog) | Turn a wireframe or prototype into an estimated development backlog (4× infrastructure factor). |
| [change-request-impact](skills/change-request-impact) | Classify, size, and respond to a mid-project scope change. |
| [brand-spec-generator](skills/brand-spec-generator) | Turn a brand brief into a WCAG 2.1 AA design-system spec. |
| [sprint-review](skills/sprint-review) | Compile sprint metrics into a 10-slide sprint-review PPTX. |
| [story-to-prompt](skills/story-to-prompt) | Turn a backlog story into an implementation-ready prompt for Cursor, Claude Code, Codex CLI, or Gemini CLI. |

Each skill has its own README with usage details and an example under `skills/<name>/example/`.

## Sprint-review generator

The sprint-review skill ships a generator. Populate its `DATA{}` object by hand, then:

```bash
npm i pptxgenjs
node generators/sprint_review_gen.js
```

Automatic population of `DATA{}` from GitHub / Linear is available via [Factory MCP](https://factory.newecom.ai/?utm_source=github&utm_medium=readme&utm_campaign=phase1-launch&utm_content=cta_generator).

## Quality gate

```bash
npm run qa
```

Runs the packaging QA: frontmatter, anonymization, IP boundary, examples, footer, cold-install note, and MIT coverage.

## License

MIT — see [LICENSE](LICENSE).

---

Want this calibrated to live data? [Connect Factory MCP → factory.newecom.ai](https://factory.newecom.ai/?utm_source=github&utm_medium=readme&utm_campaign=phase1-launch&utm_content=cta_footer)
