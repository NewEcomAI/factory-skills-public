// Minimal, dependency-free YAML frontmatter reader for SKILL.md files.
// Supports the flat `key: value` and `key: "value"` forms the skills use.
import { readFileSync } from "node:fs";

export function readFrontmatter(path) {
  const text = readFileSync(path, "utf8");
  if (!text.startsWith("---")) return { ok: false, error: "no frontmatter block", data: {} };
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { ok: false, error: "unterminated frontmatter block", data: {} };
  const block = text.slice(3, end).trim();
  const data = {};
  for (const raw of block.split("\n")) {
    const line = raw.replace(/\r$/, "");
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    data[m[1]] = v;
  }
  return { ok: true, data };
}
