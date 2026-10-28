# Benchmarks

Render benchmarks, run with the `benchmark` CLI from [`@mui/internal-benchmark`](https://github.com/mui/mui-public/tree/master/packages/benchmark#the-benchmark-cli). It builds and packs the packages for the working tree and for a baseline commit, then samples both in one browser run, alternating in shuffled rounds, and compares them on paired differences.

## Run locally

```bash
pnpm test:benchmark                                    # everything, against the parent commit
pnpm test:benchmark --baseline master                  # against another revision
pnpm test:benchmark charts/LineChart charts/Heatmap    # only files whose path contains one of these
pnpm test:benchmark smoke/                             # the smoke benchmarks
pnpm test:benchmark -t "zoomed in"                     # only benchmarks whose name matches
pnpm test:benchmark --sample-size 10 --timeout 0       # a quick, imprecise run
```

The run builds the packages itself (`pnpm release:build`), writes `.benchmark/results/report.json` and prints a table per benchmark. While it runs, it pins the packed builds in the repository's `pnpm-workspace.yaml` and puts it back at the end, so don't commit or build in the same checkout meanwhile.

`pnpm test:benchmark --profile` also records a performance trace around each sample, saved under `.benchmark/traces/` to open in the DevTools Performance panel.

## Layout

- `src/charts/<Chart>/` holds a chart's benchmarks, named after the folder its source lives in: `scenarios.tsx` defines its cases with `defineScenario()`, which takes `reactBenchmark()`'s arguments, and `<Chart>.bench.tsx` registers them with `registerScenario()`.
- `src/smoke/charts.bench.tsx` registers one case per kind of chart again, sampled 30 rounds and alarming past 10%. A scenario module registers nothing itself, so both files can import it.

## In CI

`test_charts_benchmark` runs when the charts packages, this folder or the CircleCI config change:

- on master, every chart's file (`charts/`);
- on a pull request, the smoke file, plus the files of the charts whose source folder it changes: a change in `packages/x-charts*/src/LineChart/` runs `charts/LineChart`, which includes `LineChartPro`. A change to shared code runs the smoke file only.

The smoke cases keep their names, so on the dashboard they read as the same benchmarks as in their chart's file.

## Add a benchmark

```tsx
// src/charts/BarChart/scenarios.tsx
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { defineScenario } from '../../utils/scenario';

export const barChart = defineScenario('BarChart - 100 bars', () => (
  <BarChart series={[{ data: [/* ... */] }]} width={500} height={300} skipAnimation />
));

// src/charts/BarChart/BarChart.bench.tsx
import { registerScenario } from '../../utils/scenario';
import { barChart } from './scenarios';

registerScenario(barChart);
```

Each `*.bench.tsx` file becomes its own page and imports `@mui/internal-benchmark/page`, never Vitest. `reactBenchmark()` mounts the element, runs the interaction, waits for the paint and unmounts, recording `render`, `render:count` and `bench:paint`. WebGL charts pass `benchWebGLInteraction` from `src/charts/utils`, which also records the paint of the frame that submits the chart's first draw as `bench:paint#webgl`.
