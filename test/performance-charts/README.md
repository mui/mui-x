# Performance Charts

Render benchmarks for the charts packages, run with the `benchmark` CLI from [`@mui/internal-benchmark`](https://github.com/mui/mui-public/tree/master/packages/benchmark#the-benchmark-cli). It builds and packs the packages for the working tree and for a baseline commit, then samples both in one browser run, alternating in shuffled rounds, and compares them on paired differences.

## Run locally

```bash
pnpm test:charts-benchmark                                # everything, against the parent commit
pnpm test:charts-benchmark --baseline master              # against another revision
pnpm test:charts-benchmark LineChart ScatterChartPro      # only files whose path contains one of these
pnpm test:charts-benchmark -t "zoomed in"                 # only benchmarks whose name matches
pnpm test:charts-benchmark --sample-size 10 --timeout 0   # a quick, imprecise run
```

The run builds the packages itself (`pnpm release:build`), writes `.benchmark/results/report.json` and prints a table per benchmark. While it runs, it pins the packed builds in the repository's `pnpm-workspace.yaml` and puts it back at the end, so don't commit or build in the same checkout meanwhile.

`pnpm test:charts-benchmark --profile` also records a performance trace around each sample, saved under `.benchmark/traces/` to open in the DevTools Performance panel.

## In CI

The pull request job runs only `src/smoke.bench.tsx`: one benchmark per kind of chart, sampled 30 rounds and alarming past 10%. The other files are for manual runs.

## Add a benchmark

A chart's cases are defined in `src/scenarios/<Chart>.tsx` with `defineScenario()`, which takes `reactBenchmark()`'s arguments, and registered by `src/<Chart>.bench.tsx` with `registerScenario()`. A scenario module registers nothing itself, so `src/smoke.bench.tsx` can register a chart's representative case too.

```tsx
// src/scenarios/BarChart.tsx
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { defineScenario } from '../utils/scenario';

export const barChart = defineScenario('BarChart - 100 bars', () => (
  <BarChart series={[{ data: [/* ... */] }]} width={500} height={300} skipAnimation />
));

// src/BarChart.bench.tsx
import { registerScenario } from './utils/scenario';
import { barChart } from './scenarios/BarChart';

registerScenario(barChart);
```

Each `src/*.bench.tsx` file becomes its own page and imports `@mui/internal-benchmark/page`, never Vitest. `reactBenchmark()` mounts the element, runs the interaction, waits for the paint and unmounts, recording `render`, `render:count` and `bench:paint`.
