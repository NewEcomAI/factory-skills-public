# Factory Skills — Product Manager's Guide

A practical manual for product managers using the **Factory Skills** bundle: five free,
calibrated AI-assisted delivery skills for Claude Code, Cursor, Codex CLI, and Gemini CLI.

This guide explains what each skill does, when to reach for it, what to feed it, and what
you get back — mapped to the delivery lifecycle you already run.

## Who this is for

Product managers, delivery leads, and founders who scope, estimate, and ship software with
an AI coding agent. No engineering background is required to run the skills; each one prompts
you for anything it needs.

## What you get

Five skills that cover the delivery loop from discovery to review:

| Skill | Use it to… | You end up with |
|---|---|---|
| `wireframe-to-backlog` | Turn a wireframe/prototype into an estimated backlog | Epics → stories → hours → sprint plan |
| `brand-spec-generator` | Turn a brand brief into a design-system spec | Accessible HTML design system + cursor rules |
| `story-to-prompt` | Turn a backlog story into an agent-ready prompt | A copy-paste implementation prompt |
| `change-request-impact` | Assess a mid-project scope change | Internal record + client-facing email |
| `sprint-review` | Compile sprint metrics into a client deck | A 10-slide `.pptx` review |

Everything runs locally against your agent. There is no account or external service required
to use the free tier.

## Before you start

### Install

In any supported agent, install the plugin once:

```text
/plugin marketplace add NewEcomAI/factory-skills-public
/plugin install factory@factory-skills
```

Marketplace listings are rolling out per platform. Until a given store listing is live, you
can point your agent at the repository as a local plugin/skills source.

### How skills activate

Each skill is triggered by natural language — you describe the task and the agent loads the
matching skill. You do not need to memorize commands. Example trigger phrases:

- "Turn this wireframe into a backlog with estimates."
- "Draft a change request for this new scope."
- "Build me a sprint review deck from these metrics."

### Config is optional

Every skill is **cold-install safe**: if your project has no config file, the skill asks you
inline for what it needs (product name, stack, infrastructure areas, response window, sender
name, and so on). You can start with zero setup.

## The PM workflow

A typical project flows through the skills in this order:

1. **Kickoff** — run `brand-spec-generator` to lock visual identity and `wireframe-to-backlog`
   to turn early mockups into an estimated, sprint-planned backlog.
2. **Per story** — run `story-to-prompt` to convert each backlog item into a precise,
   guard-railed prompt before handing it to a coding agent.
3. **Mid-project** — when scope shifts, run `change-request-impact` to size the change and
   generate the client communication.
4. **End of sprint** — run `sprint-review` to produce the client-facing deck.

## Skill reference

### 1. wireframe-to-backlog

**When to use:** you have a wireframe, mockup, or Figma/HTML prototype and need a realistic,
estimated plan.

**What to provide:** the wireframe or prototype (image, HTML, or export). If no project config
exists, the skill prompts for product name, stack, and which infrastructure areas apply.

**What it does:** performs a 5-pass read, produces epics and stories with hour estimates and
sprint assignments, and automatically applies a **4× correction factor** to infrastructure
stories (auth, payments, billing, webhooks) — the work that is routinely under-estimated.

**Output:** a structured backlog (epics → stories → hour estimates → sprint plan) ready to paste
into your tracker.

**PM tip:** review the discovery-gap section — it flags always-required stories (CI/CD, error
monitoring, access control) that rarely appear in a wireframe.

### 2. brand-spec-generator

**When to use:** you need a consistent, accessible visual language before or during build.

**What to provide:** a short brand brief — three personality adjectives, a color direction, and
a "NOT-list" of things to avoid. If none is supplied, the skill prompts for each.

**What it does:** generates a 13-section design system with color tokens and a type scale, each
checked for **WCAG 2.1 AA** contrast, plus a ready-to-paste cursor rules block.

**Output:** a full HTML design-system spec (colors, typography, components, do/don't rules) and
a cursor rules export your engineers can drop into the project.

**PM tip:** the NOT-list is the highest-leverage input — it prevents the generic look most AI
output defaults to.

### 3. story-to-prompt

**When to use:** before handing any backlog story to a coding agent.

**What to provide:** the story (title + intent) and, optionally, the target platform (Cursor,
Claude Code, Codex CLI, or Gemini CLI). The skill prompts for your stack and invariants if no
config is present.

**What it does:** produces a structured prompt with context, locked decisions, critical
invariants, explicit tasks, validation gates, acceptance criteria, and a **mandatory file
allowlist** so the agent only touches what it should. One portable prompt body, with a thin
per-platform wrapper (where standing rules live, how to invoke, reference syntax).

**Output:** a copy-paste implementation prompt ready for your coding agent, adapted to the target platform.

**PM tip:** the file allowlist is what keeps an agent from "helpfully" refactoring unrelated
code — always keep it tight.

### 4. change-request-impact

**When to use:** a scope change arrives mid-project and you need to respond quickly and defensibly.

**What to provide:** the requested change. The skill prompts for your response window and sender
name when no process config is present.

**What it does:** classifies the change, sizes the effort, and runs an **absorbability test**
against your remaining sprint capacity.

**Output:** two artifacts — an internal assessment record, and a client-facing change-request
email stating the impact, the options, and the response window.

**PM tip:** send the client email verbatim or lightly edited; it is written to protect scope
without sounding adversarial.

### 5. sprint-review

**When to use:** at the end of a sprint, to produce a polished client review deck.

**What to provide:** your sprint metrics and handoff notes, mapped into the generator's `DATA{}`
object (the skill documents the exact fields).

**What it does:** renders a fixed 10-slide structure — cover, KPIs, metrics, shipped, story
table, cadence, quality, conventions, handoff, closing.

**Output:** a `.pptx` deck. Generate it with:

```bash
npm i pptxgenjs
node generators/sprint_review_gen.js
```

**PM tip:** in the free tier you fill `DATA{}` by hand. Keep a running metrics note through the
sprint so populating it at the end takes minutes.

## Free tier vs. calibrated (paid)

The free skills ship a fixed calibration: the 4× infrastructure factor and a static estimation
snapshot. That is enough to produce realistic plans and reviews out of the box.

Calibrating estimates to your team's live delivery data — and auto-populating the sprint-review
`DATA{}` from your GitHub / Linear activity — is a Factory MCP feature. See
[factory.newecom.ai](https://factory.newecom.ai). The free tier always works without it.

## Troubleshooting

- **The skill didn't activate.** Be explicit about the task ("turn this into a backlog"), or
  invoke it by name with a slash command in agents that support it.
- **It's asking me questions I expected it to know.** That is the cold-install path — answer
  inline once; supply a project config later to skip the prompts.
- **The sprint-review generator errors on run.** Ensure `npm i pptxgenjs` has been run in the
  repo, and that `DATA{}` is populated. The generator writes `<Product>_Sprint<N>_Review.pptx`
  to the current directory.

## License

MIT — see the root [LICENSE](../LICENSE).

---

Want this calibrated to live data? [Connect Factory MCP → factory.newecom.ai](https://factory.newecom.ai)
