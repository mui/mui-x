# Per-prompt × per-scheme report

Each cell is the count of arms that passed this exact (prompt, scheme) pair out of arms that ran it. Total possible per cell = up to 6 arms.

This view exposes _which test cases_ benefit from which tool naming. Cells with `0/N` show universal failures (e.g. SKILL.md authoring issue). Cells where one scheme wins by a clear margin reveal naming-sensitive prompts.

| Prompt id          | Category          | baseline |
| ------------------ | ----------------- | -------- |
| `feat-pivot-1`     | pivot-builder     | 6/6      |
| `feat-pivot-2`     | pivot-builder     | 6/6      |
| `feat-pivot-3`     | pivot-builder     | 6/6      |
| `feat-pivot-4`     | pivot-builder     | 6/6      |
| `feat-pivot-5`     | pivot-builder     | 6/6      |
| `skill-pivot-1`    | pivot-builder     | 6/6      |
| `skill-pivot-2`    | pivot-builder     | 6/6      |
| `skill-pivot-3`    | pivot-builder     | 6/6      |
| `skill-pivot-4`    | pivot-builder     | 6/6      |
| `skill-pivot-5`    | pivot-builder     | 6/6      |
| `skill-pivot-6`    | pivot-builder     | 6/6      |
| `feat-chart-1`     | chart-suggest     | 6/6      |
| `feat-chart-2`     | chart-suggest     | 5/6      |
| `feat-chart-3`     | chart-suggest     | 6/6      |
| `feat-chart-4`     | chart-suggest     | 6/6      |
| `feat-chart-8`     | chart-suggest     | 5/6      |
| `skill-chart-1`    | chart-suggest     | 6/6      |
| `skill-chart-2`    | chart-suggest     | 6/6      |
| `skill-chart-3`    | chart-suggest     | 6/6      |
| `skill-chart-4`    | chart-suggest     | 5/6      |
| `skill-chart-5`    | chart-suggest     | 6/6      |
| `skill-outlier-1`  | outlier-hunt      | 6/6      |
| `skill-outlier-2`  | outlier-hunt      | 6/6      |
| `skill-outlier-3`  | outlier-hunt      | 6/6      |
| `skill-outlier-4`  | outlier-hunt      | 5/6      |
| `skill-outlier-5`  | outlier-hunt      | 6/6      |
| `skill-whatif-1`   | what-if-ghost     | 6/6      |
| `skill-whatif-2`   | what-if-ghost     | 5/6      |
| `skill-whatif-3`   | what-if-ghost     | 6/6      |
| `skill-whatif-4`   | what-if-ghost     | 6/6      |
| `skill-pin-1`      | investigation-log | 1/6      |
| `skill-pin-2`      | investigation-log | 1/6      |
| `skill-pin-3`      | investigation-log | 4/6      |
| `skill-pin-4`      | investigation-log | 2/6      |
| `skill-story-1`    | data-story        | 4/6      |
| `skill-story-2`    | data-story        | 5/6      |
| `skill-story-3`    | data-story        | 6/6      |
| `skill-surprise-1` | surprise-me       | 4/6      |
| `skill-surprise-2` | surprise-me       | 4/6      |
| `skill-surprise-3` | surprise-me       | 3/6      |
| `feat-pdf-1`       | pdf-report        | 1/6      |
| `feat-pdf-10`      | pdf-report        | 3/6      |
| `feat-pdf-11`      | pdf-report        | 6/6      |
| `feat-pdf-2`       | pdf-report        | 4/6      |
| `feat-pdf-3`       | pdf-report        | 4/6      |
| `feat-pdf-4`       | pdf-report        | 4/6      |
| `feat-pdf-5`       | pdf-report        | 2/6      |
| `feat-pdf-6`       | pdf-report        | 4/6      |
| `feat-pdf-7`       | pdf-report        | 4/6      |
| `feat-pdf-8`       | pdf-report        | 3/6      |
| `feat-pdf-9`       | pdf-report        | 3/6      |
| `reg-pdf-1`        | pdf-report        | 4/6      |
| `reg-pdf-2`        | pdf-report        | 6/6      |
| `reg-pdf-3`        | pdf-report        | 4/6      |
| `reg-pdf-4`        | pdf-report        | 6/6      |
| `feat-formula-1`   | formula           | 6/6      |
| `feat-formula-2`   | formula           | 6/6      |
| `feat-formula-3`   | formula           | 6/6      |
| `feat-formula-4`   | formula           | 6/6      |
| `feat-formula-5`   | formula           | 6/6      |
| `feat-formula-6`   | formula           | 6/6      |
| `feat-formula-7`   | formula           | 6/6      |
| `reg-formula-1`    | formula           | 6/6      |
| `reg-formula-2`    | formula           | 6/6      |
| `reg-formula-3`    | formula           | 6/6      |
| `reg-formula-4`    | formula           | 6/6      |
| `reg-filter-1`     | filter            | 6/6      |
| `reg-filter-2`     | filter            | 6/6      |
| `reg-filter-3`     | filter            | 6/6      |
| `reg-sort-1`       | sort              | 6/6      |
| `reg-sort-2`       | sort              | 6/6      |
| `feat-group-1`     | group-agg         | 6/6      |
| `feat-group-10`    | group-agg         | 6/6      |
| `feat-group-11`    | group-agg         | 6/6      |
| `feat-group-12`    | group-agg         | 6/6      |
| `feat-group-2`     | group-agg         | 6/6      |
| `feat-group-3`     | group-agg         | 6/6      |
| `feat-group-4`     | group-agg         | 6/6      |
| `feat-group-5`     | group-agg         | 4/6      |
| `feat-group-6`     | group-agg         | 3/6      |
| `feat-group-7`     | group-agg         | 5/6      |
| `feat-group-8`     | group-agg         | 6/6      |
| `feat-group-9`     | group-agg         | 6/6      |
| `reg-group-1`      | group-agg         | 6/6      |
| `reg-group-2`      | group-agg         | 5/6      |
| `reg-group-3`      | group-agg         | 5/6      |
| `feat-chart-5`     | chart             | 5/6      |
| `feat-chart-6`     | chart             | 6/6      |
| `feat-chart-7`     | chart             | 5/6      |
| `reg-chart-1`      | chart             | 6/6      |
| `reg-chart-2`      | chart             | 5/6      |
| `feat-pivot-6`     | pivot             | 5/6      |
| `feat-pivot-7`     | pivot             | 6/6      |
| `reg-pivot-1`      | pivot             | 6/6      |
| `reg-pivot-2`      | pivot             | 6/6      |

## Per-prompt summary (overall pass rate across all schemes × arms)

| Prompt id          | Category          | Total pass | Total runs | Pass% |
| ------------------ | ----------------- | ---------- | ---------- | ----- |
| `feat-pivot-1`     | pivot-builder     | 6          | 6          | 100%  |
| `feat-pivot-2`     | pivot-builder     | 6          | 6          | 100%  |
| `feat-pivot-3`     | pivot-builder     | 6          | 6          | 100%  |
| `feat-pivot-4`     | pivot-builder     | 6          | 6          | 100%  |
| `feat-pivot-5`     | pivot-builder     | 6          | 6          | 100%  |
| `skill-pivot-1`    | pivot-builder     | 6          | 6          | 100%  |
| `skill-pivot-2`    | pivot-builder     | 6          | 6          | 100%  |
| `skill-pivot-3`    | pivot-builder     | 6          | 6          | 100%  |
| `skill-pivot-4`    | pivot-builder     | 6          | 6          | 100%  |
| `skill-pivot-5`    | pivot-builder     | 6          | 6          | 100%  |
| `skill-pivot-6`    | pivot-builder     | 6          | 6          | 100%  |
| `feat-chart-1`     | chart-suggest     | 6          | 6          | 100%  |
| `feat-chart-2`     | chart-suggest     | 5          | 6          | 83%   |
| `feat-chart-3`     | chart-suggest     | 6          | 6          | 100%  |
| `feat-chart-4`     | chart-suggest     | 6          | 6          | 100%  |
| `feat-chart-8`     | chart-suggest     | 5          | 6          | 83%   |
| `skill-chart-1`    | chart-suggest     | 6          | 6          | 100%  |
| `skill-chart-2`    | chart-suggest     | 6          | 6          | 100%  |
| `skill-chart-3`    | chart-suggest     | 6          | 6          | 100%  |
| `skill-chart-4`    | chart-suggest     | 5          | 6          | 83%   |
| `skill-chart-5`    | chart-suggest     | 6          | 6          | 100%  |
| `skill-outlier-1`  | outlier-hunt      | 6          | 6          | 100%  |
| `skill-outlier-2`  | outlier-hunt      | 6          | 6          | 100%  |
| `skill-outlier-3`  | outlier-hunt      | 6          | 6          | 100%  |
| `skill-outlier-4`  | outlier-hunt      | 5          | 6          | 83%   |
| `skill-outlier-5`  | outlier-hunt      | 6          | 6          | 100%  |
| `skill-whatif-1`   | what-if-ghost     | 6          | 6          | 100%  |
| `skill-whatif-2`   | what-if-ghost     | 5          | 6          | 83%   |
| `skill-whatif-3`   | what-if-ghost     | 6          | 6          | 100%  |
| `skill-whatif-4`   | what-if-ghost     | 6          | 6          | 100%  |
| `skill-pin-1`      | investigation-log | 1          | 6          | 17%   |
| `skill-pin-2`      | investigation-log | 1          | 6          | 17%   |
| `skill-pin-3`      | investigation-log | 4          | 6          | 67%   |
| `skill-pin-4`      | investigation-log | 2          | 6          | 33%   |
| `skill-story-1`    | data-story        | 4          | 6          | 67%   |
| `skill-story-2`    | data-story        | 5          | 6          | 83%   |
| `skill-story-3`    | data-story        | 6          | 6          | 100%  |
| `skill-surprise-1` | surprise-me       | 4          | 6          | 67%   |
| `skill-surprise-2` | surprise-me       | 4          | 6          | 67%   |
| `skill-surprise-3` | surprise-me       | 3          | 6          | 50%   |
| `feat-pdf-1`       | pdf-report        | 1          | 6          | 17%   |
| `feat-pdf-10`      | pdf-report        | 3          | 6          | 50%   |
| `feat-pdf-11`      | pdf-report        | 6          | 6          | 100%  |
| `feat-pdf-2`       | pdf-report        | 4          | 6          | 67%   |
| `feat-pdf-3`       | pdf-report        | 4          | 6          | 67%   |
| `feat-pdf-4`       | pdf-report        | 4          | 6          | 67%   |
| `feat-pdf-5`       | pdf-report        | 2          | 6          | 33%   |
| `feat-pdf-6`       | pdf-report        | 4          | 6          | 67%   |
| `feat-pdf-7`       | pdf-report        | 4          | 6          | 67%   |
| `feat-pdf-8`       | pdf-report        | 3          | 6          | 50%   |
| `feat-pdf-9`       | pdf-report        | 3          | 6          | 50%   |
| `reg-pdf-1`        | pdf-report        | 4          | 6          | 67%   |
| `reg-pdf-2`        | pdf-report        | 6          | 6          | 100%  |
| `reg-pdf-3`        | pdf-report        | 4          | 6          | 67%   |
| `reg-pdf-4`        | pdf-report        | 6          | 6          | 100%  |
| `feat-formula-1`   | formula           | 6          | 6          | 100%  |
| `feat-formula-2`   | formula           | 6          | 6          | 100%  |
| `feat-formula-3`   | formula           | 6          | 6          | 100%  |
| `feat-formula-4`   | formula           | 6          | 6          | 100%  |
| `feat-formula-5`   | formula           | 6          | 6          | 100%  |
| `feat-formula-6`   | formula           | 6          | 6          | 100%  |
| `feat-formula-7`   | formula           | 6          | 6          | 100%  |
| `reg-formula-1`    | formula           | 6          | 6          | 100%  |
| `reg-formula-2`    | formula           | 6          | 6          | 100%  |
| `reg-formula-3`    | formula           | 6          | 6          | 100%  |
| `reg-formula-4`    | formula           | 6          | 6          | 100%  |
| `reg-filter-1`     | filter            | 6          | 6          | 100%  |
| `reg-filter-2`     | filter            | 6          | 6          | 100%  |
| `reg-filter-3`     | filter            | 6          | 6          | 100%  |
| `reg-sort-1`       | sort              | 6          | 6          | 100%  |
| `reg-sort-2`       | sort              | 6          | 6          | 100%  |
| `feat-group-1`     | group-agg         | 6          | 6          | 100%  |
| `feat-group-10`    | group-agg         | 6          | 6          | 100%  |
| `feat-group-11`    | group-agg         | 6          | 6          | 100%  |
| `feat-group-12`    | group-agg         | 6          | 6          | 100%  |
| `feat-group-2`     | group-agg         | 6          | 6          | 100%  |
| `feat-group-3`     | group-agg         | 6          | 6          | 100%  |
| `feat-group-4`     | group-agg         | 6          | 6          | 100%  |
| `feat-group-5`     | group-agg         | 4          | 6          | 67%   |
| `feat-group-6`     | group-agg         | 3          | 6          | 50%   |
| `feat-group-7`     | group-agg         | 5          | 6          | 83%   |
| `feat-group-8`     | group-agg         | 6          | 6          | 100%  |
| `feat-group-9`     | group-agg         | 6          | 6          | 100%  |
| `reg-group-1`      | group-agg         | 6          | 6          | 100%  |
| `reg-group-2`      | group-agg         | 5          | 6          | 83%   |
| `reg-group-3`      | group-agg         | 5          | 6          | 83%   |
| `feat-chart-5`     | chart             | 5          | 6          | 83%   |
| `feat-chart-6`     | chart             | 6          | 6          | 100%  |
| `feat-chart-7`     | chart             | 5          | 6          | 83%   |
| `reg-chart-1`      | chart             | 6          | 6          | 100%  |
| `reg-chart-2`      | chart             | 5          | 6          | 83%   |
| `feat-pivot-6`     | pivot             | 5          | 6          | 83%   |
| `feat-pivot-7`     | pivot             | 6          | 6          | 100%  |
| `reg-pivot-1`      | pivot             | 6          | 6          | 100%  |
| `reg-pivot-2`      | pivot             | 6          | 6          | 100%  |

## Hard prompts (≤30% overall pass rate)

| Prompt id     | Category          | Pass | Total | Pass% |
| ------------- | ----------------- | ---- | ----- | ----- |
| `skill-pin-2` | investigation-log | 1    | 6     | 17%   |
| `skill-pin-1` | investigation-log | 1    | 6     | 17%   |
| `feat-pdf-1`  | pdf-report        | 1    | 6     | 17%   |
