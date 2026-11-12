# Benchmarks

Render benchmarks, run with the `benchmark` CLI from [`@mui/internal-benchmark`](https://github.com/mui/mui-public/tree/master/packages/benchmark#the-benchmark-cli). It builds and packs the packages for the working tree and for a baseline commit, then samples both in one browser run, alternating in shuffled rounds, and compares them on paired differences.

## Run locally

```bash
pnpm test:benchmark                                    # everything, as CI runs it, against the parent commit
pnpm test:benchmark --baseline master                  # against another revision
pnpm test:benchmark -t "LineChart"                     # only benchmarks whose name matches
pnpm test:benchmark --sample-size 10 --timeout 0       # a quick, imprecise run
```

The run builds the packages itself (`pnpm release:build`), writes `.benchmark/results/report.json` and prints a table per benchmark. While it runs, it pins the packed builds in the repository's `pnpm-workspace.yaml` and puts it back at the end, so don't commit or build in the same checkout meanwhile.

`pnpm test:benchmark --profile` also records a performance trace around each sample, saved under `.benchmark/traces/` to open in the DevTools Performance panel.

## Layout

- `src/smoke/x.bench.tsx` holds the benchmarks of all of MUI X, in one page: the runner loads a file's page once per round, so they run warm, and settle in far fewer rounds than in a page each. They are there to catch big regressions: 30 rounds each, alarming past 10%.
- `src/<product>/scenarios.tsx`, and `src/charts/<Chart>/scenarios.tsx` for a chart, named after the folder its source lives in, define the cases with `defineScenario()`, which takes `reactBenchmark()`'s arguments. A scenario module registers nothing itself; the smoke file registers each case with `smokeBenchmark()`.
- `package.json` also lists dependencies no file imports: `@mui/material` and `@emotion/styled` are peer dependencies of the packages, and `@playwright/test` of `@mui/internal-benchmark`.

## In CI

`test_charts_benchmark` runs the smoke file. On master, it runs on every commit and compares it against its parent. On a pull request, it runs only when the charts packages, this folder or the CircleCI config change, and compares against where the branch forked.

## Add a benchmark

```tsx
// src/charts/BarChart/scenarios.tsx
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { defineScenario } from '../../utils/scenario';

export const barChart = defineScenario('BarChart - 100 bars', () => (
  <BarChart series={[{ data: [/* ... */] }]} width={500} height={300} skipAnimation />
));

// src/smoke/x.bench.tsx
import { barChart } from '../charts/BarChart/scenarios';

smokeBenchmark(barChart);
```

Each `*.bench.tsx` file becomes its own page and imports `@mui/internal-benchmark/page`, never Vitest. `reactBenchmark()` mounts the element, runs the interaction, waits for the paint and unmounts, recording `render`, `render:count` and `bench:paint`. WebGL charts pass `benchWebGLInteraction` from `src/charts/utils`, which also records the paint of the frame that submits the chart's first draw as `bench:paint#webgl`.
