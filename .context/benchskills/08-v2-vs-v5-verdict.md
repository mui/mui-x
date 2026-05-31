# V2 vs V5 verdict

**Date:** 2026-05-24
**Sample:** 6 arms × 50 prompts × 2 variants (V2, V5) × `verbose` tool-naming scheme = 600 calls. Concurrency=20.
**Raw log:** `.context/benchskills/v2-vs-v5-final.log`

## Top line

**V5 wins on every arm tested.** Average lift **+22pp** (V2 60% → V5 82%).

| Arm                   | V2          | V5              | Δ         |
| --------------------- | ----------- | --------------- | --------- |
| gemini-3.1-flash-lite | 28/50 (56%) | **46/50 (92%)** | **+36pp** |
| glm-5.1               | 29/50 (58%) | **44/50 (88%)** | **+30pp** |
| haiku-4-5             | 31/50 (62%) | **45/50 (90%)** | **+28pp** |
| qwen3.5-flash-02-23   | 33/50 (66%) | **46/50 (92%)** | **+26pp** |
| kimi-latest           | 26/50 (52%) | **32/50 (64%)** | +12pp     |
| qwen3.6-flash         | 33/50 (66%) | **35/50 (70%)** | +4pp      |

Pre-improvements baseline (before pdf-flow split, classifier fix, group-agg skill): V5 averaged \~71%. Post-improvements: **V5 averaged 82%.** The 11pp lift came from:

1. **Classifier whitelist for `__*` internal columns** — caught the false-positive `hallucinated-column(__row_group_by_columns_group__)` failures across all `/grouping` patches.
2. **`group-agg` instruction-only skill** — taught models to pair `/grouping` + `/aggregation` patches in a single `setGridState` call.
3. **`pdf-report` ↔ `pdf-flow` split** — separated tool definition from orchestration recipe. (Note: this had a slight negative effect on PDF pass rates; see "Open issues" below.)

## Decision

✅ **V5 stays as production default** (`prompts.ts` already exports `buildSystemPromptV5` as `buildSystemPrompt`).

The originally-justified promotion (off a 10-prompt smoke) is now confirmed by 600 calls. No reason to revert.

## Per-skill breakdown (V5 only, regenerable from `06-per-prompt.md`)

| Category                 | V2 pass rate | V5 pass rate | Notes                                                                  |
| ------------------------ | ------------ | ------------ | ---------------------------------------------------------------------- |
| filter / sort / formula  | \~100%       | \~100%       | Both unaffected. Regression baseline holds.                            |
| pivot (raw)              | \~95%        | \~98%        | V5 marginally better.                                                  |
| group-agg                | 0-50%        | **\~95%**    | Biggest single-category win. Driven by the new skill + classifier fix. |
| pivot-builder            | \~50%        | **\~92%**    | V2 has no pivot-builder skill; V5 wins clearly.                        |
| chart / chart-suggest    | \~70%        | \~75%        | Modest improvement; both already pass on top arms.                     |
| outlier-hunt             | \~60%        | **\~95%**    | V5 skill teaches the sort+top-N pattern.                               |
| what-if-ghost            | 0%           | **\~88%**    | V2 doesn't know about parallel-formula pattern.                        |
| data-story / surprise-me | \~30%        | **\~85%**    | V5's instruction-only skills enable these new flows.                   |
| investigation-log        | \~10%        | \~70%        | Still multi-turn limited but lifted significantly.                     |
| pdf-report               | \~50%        | \~33%        | **Slight regression** — see open issues.                               |

## Open issues

### PDF regressed slightly after pdf-flow split

After splitting `pdf-report` into a tool-only skill plus a separate `pdf-flow` orchestration skill, PDF pass rates dropped from \~50% to \~33%. The split is architecturally cleaner (mirrors `setGridState` ↔ `group-agg`) but the orchestration coupling weakened.

Hypotheses:

- The two SKILL.md fragments aren't read together by the LLM as cohesively as the combined section was.
- The pdf-flow body needs stronger cross-references to the pdf-report tool description.
- The split fragmented the "Step 1 / Step 2 / SAME TURN" emphasis.

**Mitigation options for follow-up:**

1. Add a one-paragraph cross-link at the top of `pdf-report/SKILL.md` reminding the model to read `pdf-flow`.
2. Merge `pdf-flow` back into `pdf-report` (revert the split).
3. Bump `stopWhen: stepCountIs(2)` for sessions where `pdf-report` is enabled (genuine multi-turn allowed).

### qwen3.6-flash and kimi-latest underperform

V5 lift on qwen3.6 is only +4pp; kimi only +12pp. These are the weakest models in the sample. Recommendation: route them off V5 to V4 / V2 in production, or restrict their use to the strong-arm subset.

### Multi-turn investigation-log

`investigation-log` is fundamentally multi-turn (turn 1: investigate, turn 2: emit `**📌 Finding:**`). Harness uses `stopWhen: stepCountIs(1)`, so we only measure "did the model start investigating". Real-world multi-turn measurement requires harness extension; see methodology notes.

## What to ship next

1. **Pin V5 as production default** — already done in `prompts.ts`. No revert.
2. **Revisit the pdf-flow split** — A/B the combined vs split SKILL.md and pick whichever scores higher on the 4 reg-pdf prompts.
3. **Run V2 vs V5 across the user's 47-model list** — this sweep was 6 arms; the bigger list would tell us if the pattern holds on frontier (Sonnet, GPT-5, Gemini Pro) arms.
4. **Tighten the multi-turn-dependent skills** — investigation-log and (parts of) data-story benefit from stepCountIs(2). Worth a focused experiment.

## How to reproduce

```bash
cd apps/mui-backend
nohup npx tsx scripts/test-copilot-quality.ts \
  --variants=v2,v5 \
  --source=managed,research \
  '--only=anthropic/claude-haiku-4-5,google/gemini-3.1-flash-lite-preview,qwen/qwen3.5-flash-02-23,qwen/qwen3.6-flash,~moonshotai/kimi-latest,z-ai/glm-5.1' \
  --tool-scheme=verbose \
  --new-prompts-only \
  --concurrency=20 \
  > /tmp/v2-vs-v5.log 2>&1 &
disown

# After completion:
python3 .context/benchskills/parser.py /tmp/v2-vs-v5.log
python3 .context/benchskills/per_prompt_report.py /tmp/v2-vs-v5.log
```

Wall-clock with concurrency=20 on these 6 arms: roughly 8-12 minutes (down from \~30 minutes serial). Cost \~$2-5.
