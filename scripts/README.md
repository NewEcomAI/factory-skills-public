# factory-skills validation scripts

Drop-in for the `factory-skills` plugin repo. Zero runtime dependencies (Node ≥ 18).

| Command | What it does |
|---|---|
| `npm run validate:frontmatter` | Each `skills/<name>/SKILL.md` has valid YAML frontmatter: `name` (lowercase-hyphen, == dir) + `description` (1–500 chars). |
| `npm run validate:plugin` | `.claude-plugin/plugin.json` has the required fields and lists exactly the five skill directories, each of which exists. |
| `npm run qa` | Full release gate: frontmatter · five-skill set · IP-boundary (no A–F multiplier / live-calibration / Phase-2 leakage) · structure (SKILL.md + README.md + non-empty example/) · README upgrade footer · root MIT LICENSE · cold-install note · optional markdownlint. |

`qa.mjs` exits non-zero on any failure and prints each one. `markdownlint` auto-skips when
`markdownlint-cli2` isn't installed, so QA stays green offline; install it (`npm i -D markdownlint-cli2`)
to enable that check in CI.

Wire `npm run qa` into CI (GitHub Actions) so no PR merges with a failing gate.
