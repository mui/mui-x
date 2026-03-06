# Benchmark Tool

Automated performance benchmarks for MUI X components. Benchmarks run in a real browser (Chromium via Playwright) using React's built-in Profiler to capture render timings.

## How it works

Each benchmark file (`.bench.tsx`) mounts a React component multiple times, collects render durations via `React.Profiler`, and reports aggregated statistics.

## Running locally

```bash
# From the repo root
pnpm -F ./test/benchmark-tool benchmark
```

Results are written to `test/benchmark-tool/benchmarks/results.json`.

## CI pipeline

Three GitHub Actions workflows handle benchmarks:

| Workflow | Trigger | What it does |
|---|---|---|
| `benchmark-pr.yml` | PR opened/updated | Runs benchmarks, uploads artifact |
| `benchmark-baseline.yml` | Push to `master` | Runs benchmarks, stores results on the `test-results` branch |
| `benchmark-comparison.yml` | After `benchmark-pr` succeeds | Compares PR results against the `master` baseline, posts a comment on the PR |

A benchmark regression beyond the configured threshold (currently 8%) fails the comparison workflow.

## Adding a new benchmark

Create a file in `tests/` with the `.bench.tsx` extension:

```tsx
import * as React from 'react';
import { MyComponent } from '@mui/x-package/MyComponent';
import { benchmark } from '../utils/benchmark';

const data = [/* test data */];

benchmark('my component - description', <MyComponent data={data} />);
```

That's it — the file is automatically picked up by Vitest.

### `benchmark()` API

```ts
benchmark(name, element, interaction?, options?)
```

| Parameter | Type | Description |
|---|---|---|
| `name` | `string` | Identifier shown in reports and PR comments |
| `element` | `ReactElement` | The component tree to mount each iteration |
| `interaction` | `() => Promise<void> \| void` | Optional function that runs after mount (simulate user actions) |
| `options.runs` | `number` | Measured iterations (default: **20**) |
| `options.warmupRuns` | `number` | Discarded warmup iterations (default: **10**) |
| `options.afterEach` | `() => Promise<void> \| void` | Cleanup after each iteration |

### With an interaction

If you need to measure more than just the initial render, pass an interaction function. For example, simulating a zoom gesture:

```tsx
benchmark(
  'chart zoom',
  <ChartPro zoom data={data} />,
  async () => {
    const svg = document.querySelector('svg');
    svg?.dispatchEvent(new WheelEvent('wheel', { deltaY: -500, bubbles: true }));
    await new Promise((resolve) => requestAnimationFrame(resolve));
  },
);
```
