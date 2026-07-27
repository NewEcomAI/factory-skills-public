#!/usr/bin/env node
// Packaging QA — runs every release gate over the five launch skills.
// Covers the packaging constraints: name/desc (frontmatter), IP boundary,
// examples (structure), footer (readme-footer), cold-install note, MIT (license).
// Exits 0 only if all checks pass; non-zero and prints every failure otherwise.
import { execFileSync } from "node:child_process";
import { readdirSync, existsSync, statSync, readFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = join(repoRoot, "skills");
const scriptsDir = join(repoRoot, "scripts");

const EXPECTED_SKILLS = [
  "wireframe-to-backlog", "change-request-impact",
  "brand-spec-generator", "sprint-review", "story-to-prompt",
];
const MOAT = /\bcategory\s+[a-f]\b|six-category|recalibrat|live calibration|phase\s*2\s*calibration/i;
const FOOTER = "Connect Factory MCP";                          // required README footer marker
const COLD = /cold[\s-]?install|config-optional|no config|config[^\n]*\b(?:absent|present|missing)/i;

const results = [];
const record = (name, ok, detail = "") => results.push({ name, ok, detail });

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

// 1. frontmatter (delegate to the dedicated validator)
try {
  execFileSync("node", [join(scriptsDir, "validate-frontmatter.mjs")], { stdio: "pipe" });
  record("frontmatter", true);
} catch (e) {
  record("frontmatter", false, (e.stdout?.toString() || "") + (e.stderr?.toString() || ""));
}

// 2. all five skills present
if (existsSync(skillsDir)) {
  const dirs = readdirSync(skillsDir).filter(d => statSync(join(skillsDir, d)).isDirectory());
  const missing = EXPECTED_SKILLS.filter(s => !dirs.includes(s));
  record("skill-set", missing.length === 0, missing.length ? "missing: " + missing.join(", ") : "");
} else {
  record("skill-set", false, "skills/ not found");
}

const files = existsSync(skillsDir) ? walk(skillsDir) : [];

// 3. IP boundary (paid-moat logic must not leak into free skills)
{
  const bad = files.filter(f => f.endsWith(".md") && MOAT.test(readFileSync(f, "utf8")));
  record("ip-boundary", bad.length === 0, bad.map(f => f.replace(repoRoot + "/", "")).join(", "));
}

// 4. per-skill structure: SKILL.md + README.md + non-empty example/
{
  const problems = [];
  for (const s of EXPECTED_SKILLS) {
    const base = join(skillsDir, s);
    if (!existsSync(join(base, "SKILL.md"))) problems.push(`${s}: no SKILL.md`);
    if (!existsSync(join(base, "README.md"))) problems.push(`${s}: no README.md`);
    const ex = join(base, "example");
    if (!existsSync(ex) || readdirSync(ex).length === 0) problems.push(`${s}: empty/missing example/`);
  }
  record("structure", problems.length === 0, problems.join(" | "));
}

// 5. README upgrade footer consistent + present
{
  const problems = [];
  for (const s of EXPECTED_SKILLS) {
    const rp = join(skillsDir, s, "README.md");
    if (!existsSync(rp)) { problems.push(`${s}: no README`); continue; }
    if (!readFileSync(rp, "utf8").includes(FOOTER)) problems.push(`${s}: README missing "${FOOTER}" footer`);
  }
  record("readme-footer", problems.length === 0, problems.join(" | "));
}

// 6. MIT license present at root
record("license", existsSync(join(repoRoot, "LICENSE")) &&
  /MIT/i.test(readFileSync(join(repoRoot, "LICENSE"), "utf8")), "root LICENSE must exist and be MIT");

// 7. cold-install note — any skill that reads a *.config.json must document the no-config path
{
  const problems = [];
  for (const s of EXPECTED_SKILLS) {
    const sp = join(skillsDir, s, "SKILL.md");
    if (!existsSync(sp)) continue;
    const txt = readFileSync(sp, "utf8");
    if (/\.config\.json/i.test(txt) && !COLD.test(txt))
      problems.push(`${s}: reads *.config.json but has no cold-install / config-optional note`);
  }
  record("cold-install", problems.length === 0, problems.join(" | "));
}

// 8. optional markdownlint if available (never blocks offline)
try {
  execFileSync("npx", ["--no-install", "markdownlint-cli2", "skills/**/*.md"], { cwd: repoRoot, stdio: "pipe" });
  record("markdownlint", true);
} catch (e) {
  const msg = (e.stderr?.toString() || "") + (e.stdout?.toString() || "");
  if (/not found|could not determine|no such|cannot find|canceled due to missing packages|missing packages/i.test(msg) || e.code === "ENOENT")
    record("markdownlint", true, "skipped (markdownlint-cli2 not installed)");
  else record("markdownlint", false, msg.trim().split("\n").slice(0, 8).join("\n"));
}

const pad = Math.max(...results.map(r => r.name.length));
let failed = 0;
for (const r of results) {
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name.padEnd(pad)}  ${r.ok ? "" : r.detail}`);
  if (!r.ok) failed++;
}
console.log("-".repeat(40));
console.log(`${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
