# Skills benchmark — pass rates by prompt category × scheme

_Each cell is the pass rate (%) for that (category, scheme) pair across the 6 arms._

| Category          | baseline | Total      |
| ----------------- | -------- | ---------- |
| chart             | 90.0%    | **90.0%**  |
| chart-suggest     | 95.0%    | **95.0%**  |
| data-story        | 83.3%    | **83.3%**  |
| filter            | 100.0%   | **100.0%** |
| formula           | 100.0%   | **100.0%** |
| group-agg         | 91.1%    | **91.1%**  |
| investigation-log | 33.3%    | **33.3%**  |
| outlier-hunt      | 96.7%    | **96.7%**  |
| pdf-report        | 64.4%    | **64.4%**  |
| pivot             | 95.8%    | **95.8%**  |
| pivot-builder     | 100.0%   | **100.0%** |
| sort              | 100.0%   | **100.0%** |
| surprise-me       | 61.1%    | **61.1%**  |
| what-if-ghost     | 95.8%    | **95.8%**  |

## How to read

- Categories starting with a skill name (e.g. `pivot-builder`) test V5's new skills — these are the cells where V5's lift over V2 lives.
- Categories like `filter`, `sort`, `group-agg`, `pdf-report` are regression baselines — V5 should hold parity with V2.
- A skill whose row is uniformly low across schemes is a SKILL.md authoring problem; revise the SKILL.md body.
- A category that swings widely across schemes is sensitive to tool naming.
