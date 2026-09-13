#!/usr/bin/env node
// Generates additive per-platform metadata for Cursor, Codex CLI, and Gemini CLI
// from the single source of truth: skills/<name>/SKILL.md frontmatter.
//
// Invariant (constraint 6): skill BODIES are never copied or forked. Only metadata
// (name/description) is projected per platform. Gemini commands reference the source
// SKILL.md body at runtime via @{...} rather than duplicating it.
//
// Usage:
//   node scripts/gen-platform-metadata.mjs          # (re)write platform/ artifacts
//   node scripts/gen-platform-metadata.mjs --check   # verify artifacts match source; exit 1 on drift
//
// Dependency-free (Node >= 18).
import {
  readdirSync, existsSync, statSync, mkdirSync, writeFileSync, readFileSync, rmSync,
} from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFrontmatter } from "./lib-frontmatter.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = join(repoRoot, "skills");
const outRoot = join(repoRoot, "platform");
const GENERATED = ["cursor", "codex", "gemini"]; // hand-written files (README.md) are left untouched
const EXT_NAME = "factory-skills";
const EXT_VERSION = "1.0.0";
const AUTHOR = "newecom.aI";
const HOMEPAGE = "https://factory.newecom.ai";

const check = process.argv.includes("--check");

function titleCase(name) {
  return name.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
function yamlDq(s) {
  return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
}
function tomlDq(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

if (!existsSync(skillsDir)) {
  console.error("FAIL: skills/ directory not found at " + skillsDir);
  process.exit(2);
}

const dirs = readdirSync(skillsDir)
  .filter((d) => statSync(join(skillsDir, d)).isDirectory())
  .sort();

const skills = [];
for (const dir of dirs) {
  const sp = join(skillsDir, dir, "SKILL.md");
  if (!existsSync(sp)) continue;
  const { ok, data, error } = readFrontmatter(sp);
  if (!ok) {
    console.error(`skip ${dir}: ${error}`);
    continue;
  }
  skills.push({
    name: dir,
    description: (data.description || "").trim(),
    version: String(data.version || "1.0"),
  });
}

// Build the full set of artifacts in memory (relative path -> content).
const files = new Map();

// --- Cursor: native SKILL.md open standard. Tuning is additive `metadata`. ---
// Emitted as .yaml (a frontmatter snippet is YAML, not a Markdown document).
for (const s of skills) {
  files.set(join("cursor", `${s.name}.frontmatter.yaml`), [
    `# Cursor reads skills/${s.name}/SKILL.md natively (Agent Skills open standard).`,
    "# Recommended tuned frontmatter — additive `metadata` only, no body change.",
    "# Paste this block (including the --- fences) at the top of the skill's SKILL.md.",
    "---",
    `name: ${s.name}`,
    `description: ${yamlDq(s.description)}`,
    "metadata:",
    `  author: ${AUTHOR}`,
    `  version: ${yamlDq(s.version)}`,
    `  homepage: ${HOMEPAGE}`,
    "---",
    "",
  ].join("\n"));
}

// --- Codex CLI: native SKILL.md + optional agents/openai.yaml UI sidecar. ---
for (const s of skills) {
  files.set(join("codex", s.name, "openai.yaml"), [
    `# Codex CLI UI metadata — deploy to skills/${s.name}/agents/openai.yaml`,
    `# Generated from skills/${s.name}/SKILL.md. Re-run scripts/gen-platform-metadata.mjs; do not hand-edit.`,
    "interface:",
    `  display_name: ${yamlDq(titleCase(s.name))}`,
    `  short_description: ${yamlDq(s.description)}`,
    `  default_prompt: ${yamlDq(`Run the ${s.name} skill on my current context.`)}`,
    "policy:",
    "  allow_implicit_invocation: true",
    "",
  ].join("\n"));
}

// --- Gemini CLI: extension manifest + one TOML command per skill. ---
// The body is referenced via @{...}; it is never copied into the TOML.
files.set(
  join("gemini", "gemini-extension.json"),
  JSON.stringify({ name: EXT_NAME, version: EXT_VERSION }, null, 2) + "\n",
);
for (const s of skills) {
  files.set(join("gemini", "commands", `${s.name}.toml`), [
    `# Gemini CLI custom command — invoked via /${s.name}`,
    `# Generated from skills/${s.name}/SKILL.md. The SKILL.md body is referenced, never copied.`,
    `description = "${tomlDq(s.description)}"`,
    "",
    'prompt = """',
    "Follow the skill instructions below, then apply them to the user request.",
    "",
    `@{skills/${s.name}/SKILL.md}`,
    "",
    "User request:",
    "{{args}}",
    '"""',
    "",
  ].join("\n"));
}

// --- Write or check ---
if (check) {
  const drift = [];
  for (const [rel, content] of files) {
    const abs = join(outRoot, rel);
    if (!existsSync(abs)) {
      drift.push(`missing: platform/${rel.replace(/\\/g, "/")}`);
      continue;
    }
    if (readFileSync(abs, "utf8").replace(/\r\n/g, "\n") !== content.replace(/\r\n/g, "\n")) {
      drift.push(`stale: platform/${rel.replace(/\\/g, "/")}`);
    }
  }
  if (drift.length) {
    console.error(`gen-platform-metadata --check: ${drift.length} drift(s):`);
    for (const d of drift) console.error("  - " + d);
    console.error("Run: node scripts/gen-platform-metadata.mjs");
    process.exit(1);
  }
  console.log(`gen-platform-metadata --check: OK (${skills.length} skills × 3 platforms)`);
  process.exit(0);
}

for (const sub of GENERATED) {
  const dir = join(outRoot, sub);
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
}
for (const [rel, content] of files) {
  const abs = join(outRoot, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content, "utf8");
}
console.log(`gen-platform-metadata: wrote ${files.size} files for ${skills.length} skills (cursor, codex, gemini).`);
