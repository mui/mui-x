# Skills benchmark — methodology

## Production parity rule

**The harness inherits production defaults.** When you don't pass a flag, the harness asks `startStream` for its default, so production is the single source of truth. Specifically:

| Setting                          | Source of truth                                      | Harness flag to override                      |
| -------------------------------- | ---------------------------------------------------- | --------------------------------------------- |
| `maxSteps` (streamText stopWhen) | `startStream` default (currently 5)                  | `--max-steps=N`                               |
| Tool naming scheme               | canonical names                                      | `--tool-scheme=<name>`                        |
| Prompt variant                   | `buildSystemPromptV5` (prod default)                 | `--variants=v2,v5` (no override = V5 only)    |
| Enabled plugins                  | benchmark passes ALL 11 in `DEFAULT_COPILOT_PLUGINS` | n/a (intentional: maximum-coverage benchmark) |

A "production-parity" run is the one with **no overrides on the experiment flags**:

```bash
npx tsx scripts/test-copilot-quality.ts \
  --variants=v5 \
  --source=managed,research \
  '--only=anthropic/claude-haiku-4-5,…' \
  --new-prompts-only \
  --concurrency=20
```

If a number drops or rises in that run, it's the number production sees. Any other run (e.g. `--tool-scheme=verbose --max-steps=10`) is an **experiment**, not a baseline.

---

## Goal

Measure how the V5 Copilot system prompt (skill-loaded) performs across:

1. **Different LLMs** — does V5 lift small/cheap models, or only big ones?
2. **Different tool-naming schemes** — does renaming `setGridState` / `runCommands` / `queryGridData` change pass rates?

The previous V2-vs-V5 sweep proved V5 wins on new-skill prompts. This run extends it along the tool-naming axis on V5 only.

## What we ran

- **Variant**: V5 only (`buildSystemPromptV5`, now the production default in `apps/mui-backend/src/copilot/prompts.ts`).
- **Arms (6)**: `anthropic/claude-haiku-4-5`, `google/gemini-3.1-flash-lite-preview`, `qwen/qwen3.5-flash-02-23`, `qwen/qwen3.6-flash`, `~moonshotai/kimi-latest` (research), `z-ai/glm-5.1`.
- **Prompts (50)**: the new test cases added for the skill benchmark — 30 exercise the 7 new instruction-only skills, 20 cover regression baseline (filter, sort, group/agg, chart, pivot, pdf-report, formula). Ids prefixed `skill-*` and `reg-*`. Filtered via `--new-prompts-only` (added to the harness for this run).
- **Tool-naming schemes (7)**: each renames the 3 core tools + 2 client-handler skill tools.

| Scheme     | setGridState            | runCommands              | queryGridData      | composePdfReport        | answerWithFormula   |
| ---------- | ----------------------- | ------------------------ | ------------------ | ----------------------- | ------------------- |
| baseline   | setGridState            | runCommands              | queryGridData      | composePdfReport        | answerWithFormula   |
| verbs      | applyGridPatches        | executeGridCommands      | requestGridData    | composeReport           | evaluateFormula     |
| short      | patch                   | command                  | query              | report                  | formula             |
| verbose    | mutateGridConfiguration | triggerImperativeActions | inspectGridDataset | generatePrintableReport | computeScalarAnswer |
| nouns      | gridStateUpdate         | gridCommandBatch         | gridDataQuery      | pdfReportRequest        | formulaAnswer       |
| domain     | configureGrid           | invokeCommands           | fetchGridSlice     | buildPdf                | solveFormula        |
| imperative | updateGrid              | runOps                   | fetchData          | makePdf                 | answer              |

- **Total calls**: 6 arms × 50 prompts × 7 schemes × 1 variant = **2100 calls**.

## How the harness works

Source: `apps/mui-backend/scripts/test-copilot-quality.ts` (in `mui-private/brussels`).

For each (scheme, arm, prompt):

1. Build the V5 system prompt with `buildSystemPromptV5(gridContext, undefined, DEFAULT_COPILOT_PLUGINS)`.
2. String-replace canonical tool names with scheme-specific names in the prompt body (`applySchemeToPrompt`).
3. Pass `toolRenameMap: scheme.rename` to `startStream` → `buildCopilotTools` renames the registered tool keys.
4. Stream the response; capture `patches`, `commands`, `assistantText`, plus the full `toolNames[]` list.
5. `extractToolCallOutput` reverse-maps renamed tool calls back to canonical so test expectations stay scheme-agnostic.
6. `classifyRun` checks `requiredPatchPaths`, `requiredCommandTypes`, `requiredToolNames`, `requiredToolCallCounts`, `requireTextContains`, and the existing structural validations.

A call **passes** iff `classifyRun` returns zero failures.

## Pass criterion per prompt category

| Category                                               | Pass criterion                                              |
| ------------------------------------------------------ | ----------------------------------------------------------- |
| pivot-builder                                          | `/pivot` patch present                                      |
| chart-suggest                                          | `/charts/<id>` patch present                                |
| outlier-hunt                                           | `/sort` patch + `selection.selectVisibleTop` command        |
| what-if-ghost                                          | 2× `answerWithFormula` calls in the same turn               |
| investigation-log                                      | `queryGridData` called (relaxed — was multi-turn dependent) |
| data-story                                             | `queryGridData` called                                      |
| surprise-me                                            | 2× `queryGridData` calls                                    |
| pdf-report (regression)                                | `queryGridData` + `composePdfReport` both called            |
| formula (regression)                                   | `answerWithFormula` called                                  |
| filter / sort / group-agg / chart / pivot (regression) | matching patch path                                         |

Hallucinated column references (e.g. `__row_group_by_columns_group__`) are an additional automatic fail mode regardless of category.

## How to reproduce

```bash
cd apps/mui-backend
nohup npx tsx scripts/test-copilot-quality.ts \
  --variants=v5 \
  --source=managed,research \
  '--only=anthropic/claude-haiku-4-5,google/gemini-3.1-flash-lite-preview,qwen/qwen3.5-flash-02-23,qwen/qwen3.6-flash,~moonshotai/kimi-latest,z-ai/glm-5.1' \
  --tool-scheme=baseline,verbs,short,verbose,nouns,domain,imperative \
  --new-prompts-only \
  > /tmp/tool-scheme-multi.log 2>&1 &
disown
```

Then regenerate the per-arm / per-scheme / per-category / failure-mode reports:

```bash
python3 .context/benchskills/parser.py /tmp/tool-scheme-multi.log
```

(The parser writes `01-summary.md` through `05-failure-modes.md`.)

## Known limitations

- `investigation-log` measures only "did the model start an investigation" (one-turn `queryGridData` call), not whether a finding text was actually written. The real skill is multi-turn; the harness stops after step 1 via `stopWhen: stepCountIs(1)`.
- `outlier-hunt` cannot truly detect outliers (no raw row access on backend); we measure whether the model emits the sort + top-N substitute the SKILL.md prescribes.
- All 6 arms are small-to-mid models. Frontier models (Sonnet, GPT-5, Gemini Pro) not tested in this run.
- Per-call latency varies 3-5× across arms (Haiku \~2s, Kimi-thinking \~10s); the report does not currently normalize for that.
