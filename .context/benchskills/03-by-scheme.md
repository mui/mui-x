# Skills benchmark — pass rates by tool-naming scheme

_Across all arms and all 50 prompts._

| Scheme   | Calls | Pass | %     | Avg latency | Total cost |
| -------- | ----- | ---- | ----- | ----------- | ---------- |
| baseline | 570   | 495  | 86.8% | 23638ms     | $4.1117    |

## Interpretation

- A scheme that out-performs `baseline` across many arms is a candidate to ship as the new default.
- A scheme that wins on some arms and loses on others suggests model-specific naming preferences.
- Latency differences across schemes are largely incidental — they reflect arm sampling, not the scheme itself.
- Cost is informational; it does not factor into pass/fail.

See `02-by-arm.md` for the per-arm breakdown that shows whether a scheme's win is uniform.
