# Per-priority-feature pass rates

_Generated 2026-05-24 16:09 from `v5-prod-parity.log`._

Features map (`scripts/test-copilot-quality.ts` `FEATURE_MAP`):

- **`charts`** ← chart, chart-suggest
- **`pivot`** ← pivot, pivot-builder
- **`group-agg`** ← group-agg
- **`pdf-report`** ← pdf-report
- **`formula`** ← formula, what-if-ghost
- **`insights`** ← outlier-hunt, surprise-me
- **`narrative`** ← data-story, investigation-log
- **`basic`** ← filter, sort

## Single-variant report — V5

| arm                   | charts       | pivot        | group-agg    | pdf-report   | formula      | insights   | narrative  | basic      | model avg |
| --------------------- | ------------ | ------------ | ------------ | ------------ | ------------ | ---------- | ---------- | ---------- | --------- |
| gemini-3.1-flash-lite | 15/15 (100%) | 15/15 (100%) | 14/15 (93%)  | 15/15 (100%) | 15/15 (100%) | 7/8 (88%)  | 3/7 (43%)  | 5/5 (100%) | **94%**   |
| glm-5.1               | 15/15 (100%) | 15/15 (100%) | 12/15 (80%)  | 6/15 (40%)   | 15/15 (100%) | 8/8 (100%) | 4/7 (57%)  | 5/5 (100%) | **84%**   |
| haiku-4-5             | 15/15 (100%) | 15/15 (100%) | 15/15 (100%) | 11/15 (73%)  | 14/15 (93%)  | 8/8 (100%) | 7/7 (100%) | 5/5 (100%) | **95%**   |
| kimi-latest           | 10/15 (67%)  | 15/15 (100%) | 14/15 (93%)  | 4/15 (27%)   | 15/15 (100%) | 4/8 (50%)  | 1/7 (14%)  | 5/5 (100%) | **72%**   |
| qwen3.5-flash-02-23   | 14/15 (93%)  | 14/15 (93%)  | 13/15 (87%)  | 12/15 (80%)  | 15/15 (100%) | 8/8 (100%) | 5/7 (71%)  | 5/5 (100%) | **91%**   |
| qwen3.6-flash         | 15/15 (100%) | 15/15 (100%) | 14/15 (93%)  | 10/15 (67%)  | 15/15 (100%) | 5/8 (62%)  | 3/7 (43%)  | 5/5 (100%) | **86%**   |
| **feature avg**       | **93%**      | **99%**      | **91%**      | **64%**      | **99%**      | **83%**    | **55%**    | **100%**   |           |
