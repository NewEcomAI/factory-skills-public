#!/usr/bin/env node
// Asserts every skills/<name>/SKILL.md has valid frontmatter:
//   - name present, lowercase-hyphen, and equal to its directory name
//   - description present, 1..500 chars
// Exit 0 if all pass, non-zero (listing every failure) otherwise.
import { readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFrontmatter } from "./lib-frontmatter.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = join(repoRoot, "skills");
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

if (!existsSync(skillsDir)) {
  console.error("FAIL: skills/ directory not found at " + skillsDir);
  process.exit(2);
}

const dirs = readdirSync(skillsDir).filter(d => statSync(join(skillsDir, d)).isDirectory());
const failures = [];
let checked = 0;

for (const dir of dirs) {
  const skillPath = join(skillsDir, dir, "SKILL.md");
  if (!existsSync(skillPath)) { failures.push(`${dir}: missing SKILL.md`); continue; }
  checked++;
  const { ok, error, data } = readFrontmatter(skillPath);
  if (!ok) { failures.push(`${dir}: ${error}`); continue; }
  if (!data.name) failures.push(`${dir}: frontmatter missing 'name'`);
  else {
    if (!NAME_RE.test(data.name)) failures.push(`${dir}: name '${data.name}' is not lowercase-hyphen`);
    if (data.name !== dir) failures.push(`${dir}: name '${data.name}' != directory '${dir}'`);
  }
  if (!data.description) failures.push(`${dir}: frontmatter missing 'description'`);
  else {
    const len = data.description.length;
    if (len < 1 || len > 500) failures.push(`${dir}: description length ${len} outside 1..500`);
  }
}

if (failures.length) {
  console.error(`validate-frontmatter: ${failures.length} failure(s) across ${checked} skill(s):`);
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}
console.log(`validate-frontmatter: OK (${checked} skills)`);
