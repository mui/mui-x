# Skills benchmark — failure modes

_Generated 2026-05-24 16:09._

## Overall histogram

| Failure mode              | Count |
| ------------------------- | ----- |
| missing-required-tool     | 68    |
| missing-required-paths    | 10    |
| wrong-tool-call-count     | 8     |
| refused-wrongly           | 7     |
| invalid-patch-line        | 6     |
| invalid-command-line      | 3     |
| parse-error               | 2     |
| hallucinated-column       | 1     |
| missing-required-commands | 1     |
| text-instead-of-tools     | 1     |

## Failures by scheme (top 10 modes)

| Scheme   | missing-required-tool | missing-required-paths | wrong-tool-call-count | refused-wrongly | invalid-patch-line | invalid-command-line | parse-error | hallucinated-column | missing-required-commands | text-instead-of-tools |
| -------- | --------------------- | ---------------------- | --------------------- | --------------- | ------------------ | -------------------- | ----------- | ------------------- | ------------------------- | --------------------- |
| baseline | 68                    | 10                     | 8                     | 7               | 6                  | 3                    | 2           | 1                   | 1                         | 1                     |

## Representative samples (first 5 per mode)

### `wrong-tool-call-count` (8 occurrences)

- **haiku-4-5** · scheme `baseline` · `skill-whatif-2`
- **gemini-3.1-flash-lite** · scheme `baseline` · `skill-surprise-3`
- **qwen3.6-flash** · scheme `baseline` · `skill-surprise-1`
- **qwen3.6-flash** · scheme `baseline` · `skill-surprise-2`
- **qwen3.6-flash** · scheme `baseline` · `skill-surprise-3`

### `missing-required-tool` (68 occurrences)

- **haiku-4-5** · scheme `baseline` · `feat-pdf-1`
- **haiku-4-5** · scheme `baseline` · `feat-pdf-5`
- **haiku-4-5** · scheme `baseline` · `feat-pdf-6`
- **haiku-4-5** · scheme `baseline` · `feat-pdf-10`
- **qwen3.5-flash-02-23** · scheme `baseline` · `skill-pin-2`

### `invalid-patch-line` (6 occurrences)

- **qwen3.5-flash-02-23** · scheme `baseline` · `reg-group-3`
- **qwen3.5-flash-02-23** · scheme `baseline` · `reg-group-3`
- **glm-5.1** · scheme `baseline` · `skill-pin-1`
- **glm-5.1** · scheme `baseline` · `feat-group-7`
- **gemini-3.1-flash-lite** · scheme `baseline` · `skill-pin-3`

### `missing-required-paths` (10 occurrences)

- **qwen3.5-flash-02-23** · scheme `baseline` · `reg-group-3`
- **qwen3.5-flash-02-23** · scheme `baseline` · `feat-pivot-6`
- **qwen3.5-flash-02-23** · scheme `baseline` · `feat-group-5`
- **qwen3.5-flash-02-23** · scheme `baseline` · `feat-group-5`
- **glm-5.1** · scheme `baseline` · `feat-group-5`

### `refused-wrongly` (7 occurrences)

- **qwen3.5-flash-02-23** · scheme `baseline` · `feat-chart-8`
- **glm-5.1** · scheme `baseline` · `feat-group-6`
- **glm-5.1** · scheme `baseline` · `feat-group-6`
- **kimi-latest** · scheme `baseline` · `skill-chart-4`
- **kimi-latest** · scheme `baseline` · `reg-chart-2`

### `parse-error` (2 occurrences)

- **qwen3.5-flash-02-23** · scheme `baseline` · `feat-pivot-6`
- **qwen3.5-flash-02-23** · scheme `baseline` · `feat-pivot-6`

### `hallucinated-column` (1 occurrences)

- **qwen3.6-flash** · scheme `baseline` · `feat-group-6`

### `invalid-command-line` (3 occurrences)

- **qwen3.6-flash** · scheme `baseline` · `feat-pdf-3`
- **kimi-latest** · scheme `baseline` · `skill-outlier-4`
- **kimi-latest** · scheme `baseline` · `skill-outlier-4`

### `missing-required-commands` (1 occurrences)

- **kimi-latest** · scheme `baseline` · `skill-outlier-4`

### `text-instead-of-tools` (1 occurrences)

- **kimi-latest** · scheme `baseline` · `feat-chart-7`
