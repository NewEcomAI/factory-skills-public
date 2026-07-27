# sprint-review

Compile your sprint metrics into a polished 10-slide client sprint-review deck.

## Install

```text
/plugin marketplace add NewEcomAI/factory-skills-public
/plugin install factory@factory-skills
```

## What you get

- A bundled generator (`generators/sprint_review_gen.js`) that renders a 10-slide PPTX
- A documented manual `DATA{}` path — populate it by hand, no external service required
- A fixed slide structure: cover, KPIs, metrics, shipped, story table, cadence, quality, conventions, handoff, closing

## Output

A `.pptx` sprint-review deck. Run `npm i pptxgenjs`, then `node generators/sprint_review_gen.js`.

## License

MIT — covered by the root [LICENSE](../../LICENSE).

---

Want this calibrated to live data? Connect Factory MCP -> factory.newecom.ai
