# Skill design — when to extract, when to leave in base

## Principle

**Skills are intent-triggered. The base prompt is universal.**

A capability belongs as a skill if it's only relevant for **some** user requests. It belongs in `V1_BASE_PROTOCOL_PROMPT` or `V2_PREFIX_SECTIONS` (and inherited by V5) if **every** turn needs it.

This keeps the system prompt lean per request: V5 only splices in the skill fragments whose `pluginId` the frontend opted into via `metadata.copilotPlugins`. Universal rules can't be opted out of; they cost prompt tokens on every call regardless.

## Litmus test

Ask: _"Could a typical filter-and-sort query succeed without this content?"_

- **Yes** → extract as a skill (intent-triggered, optional).
- **No** → keep in V1/V2 base (universal).

Example: PDF-flow guidance is only needed when the user asks for a report — most queries don't. **Skill.** Wire-format rules (JSONL, one op per line) are needed every turn. **Base.**

## What lives where today

### In V1/V2 base (universal — every request)

| Topic                                                                                                                                  | Location                        |
| -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| JSONL wire format, one op per line                                                                                                     | `V1_BASE_PROTOCOL_PROMPT`       |
| Schema discovery — `gridContext.columns`, no hallucinated fields                                                                       | V1 base                         |
| Decision algorithm — "filter → sort → group → aggregate → pivot → chart" sequencing                                                    | `V2_PREFIX_SECTIONS`            |
| Column layout — `/columns/order`, `/columns/visibility`, `/columns/pinned/{left,right}`, the `__row_group_by_columns_group__` pin rule | `V2_PREFIX_SECTIONS`            |
| Refusal posture — when to ask vs proceed                                                                                               | V1 base                         |
| Filter / sort / chart syntax catalogs                                                                                                  | V1 base                         |
| Currency / date / number normalization                                                                                                 | V1 base + `gridContext.catalog` |

These were considered for skill extraction and **declined** — they're universal.

### As skills (intent-triggered — only when relevant)

| Skill               | Trigger                                                           | Mode                                       |
| ------------------- | ----------------------------------------------------------------- | ------------------------------------------ |
| `pdf-report`        | User wants a PDF/report.                                          | client-handler (tool: `composePdfReport`)  |
| `pdf-flow`          | Paired with `pdf-report` — owns the 2-step orchestration.         | instruction-only                           |
| `formula`           | User asks a single-scalar question ("what's the total revenue?"). | client-handler (tool: `answerWithFormula`) |
| `pivot-builder`     | User says "pivot by X" / "cross-tab Y by Z".                      | instruction-only                           |
| `chart-suggest`     | User says "chart this" / "visualize Y".                           | instruction-only                           |
| `outlier-hunt`      | User says "find weird rows" / "any outliers?".                    | instruction-only                           |
| `what-if-ghost`     | User says "what if …".                                            | instruction-only                           |
| `investigation-log` | LLM proactively pins a non-trivial finding.                       | instruction-only                           |
| `data-story`        | User says "walk me through this dataset".                         | instruction-only                           |
| `surprise-me`       | User says "surprise me" / "what's interesting here?".             | instruction-only                           |
| `group-agg`         | User says "group by X and sum/avg/count Y".                       | instruction-only                           |

Every entry has a clear trigger phrase. None apply to a vanilla "show me orders from Italy" filter request.

## Future candidates considered but not yet added

These pass the litmus test but haven't been observed in production traffic enough to justify the prompt-token cost. Defer until real queries miss the current taxonomy.

| Candidate              | Trigger                                                           | Why deferred                                                                           |
| ---------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `time-series-analysis` | "Compare Q1 vs Q2", "year-over-year", "month-over-month"          | Needs prompt corpus to validate; trigger phrases may be ambiguous.                     |
| `csv-excel-export`     | "Export to CSV / Excel"                                           | The `export.csv` / `export.excel` commands already exist; current base coverage is OK. |
| `bulk-cell-edit`       | "Update all NYC entries to New York", "fill blank ratings with 0" | Per-cell `editing.setCellValue` works today; orchestrating many in one turn is niche.  |
| `drill-down`           | "Show details for this row", "expand row groups"                  | Detail-panel + row-group expansion APIs exist; need to confirm consumer demand.        |
| `conditional-format`   | "Highlight rows where X > Y", "color cells red if late"           | Requires grid-side support for runtime style rules.                                    |
| `top-n-by-criteria`    | "Top 10 customers by LTV", "lowest-margin orders"                 | Overlaps `outlier-hunt`; revisit if explicit ranking queries become common.            |
| `row-pinning`          | "Keep these rows at the top while scrolling"                      | Niche; add only if usage data shows demand.                                            |

## Anti-pattern: extracting universals

Resist the temptation to split out "schema-discovery" or "decision-flow" or "column-layout" — these are universal rules. Extracting them as opt-in skills means a frontend that forgets to opt in gets a Copilot that hallucinates columns or fumbles operation order. Universals must always be present.

If a universal rule is too long for the base prompt, the right move is to **trim its wording**, not move it to an opt-in skill.

## When to revisit a skill candidate

- A repeated user query pattern hits a known failure mode that the candidate skill would have addressed.
- The base prompt is approaching its token budget and a section is provably skippable for most requests.
- A new grid capability ships (e.g. conditional formatting) — register a skill for it immediately so models learn the shape.

## Reference

This taxonomy informs `apps/mui-backend/src/copilot/skills/*` and the `DEFAULT_COPILOT_PLUGINS` list in `scripts/test-copilot-quality.ts`. The benchmark harness opts into every registered skill so each one gets coverage on every run.
