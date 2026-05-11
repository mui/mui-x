# Performance Charts

Vitest browser-mode benchmarks (`*.bench.tsx`) measuring React render duration of charts components against large datasets. Powered by [`@mui/internal-benchmark`](https://github.com/mui/mui-public/tree/master/packages/benchmark).

## Run locally

Build the libraries first — benchmarks resolve from `build/`:

```bash
pnpm release:build
```

Then run the benchmarks:

```bash
pnpm test:charts-benchmark
```

Or filter the workspace directly:

```bash
pnpm --filter "@mui-x-internal/performance-charts" test:performance
```

Results are written to `benchmarks/results.json` by default. Override with `BENCHMARK_OUTPUT_PATH=<path>`.

## Compare against a baseline

Run the baseline first into a separate file, then run the head with `BENCHMARK_BASELINE_PATH` pointing at it:

```bash
BENCHMARK_OUTPUT_PATH=/tmp/base.json pnpm test:charts-benchmark
# switch branch / commit, rebuild
BENCHMARK_BASELINE_PATH=/tmp/base.json pnpm test:charts-benchmark
```

## Add a benchmark

Drop a `*.bench.tsx` file in `tests/`:

```tsx
import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { BarChart } from '@mui/x-charts/BarChart';

benchmark('BarChart - 100 bars', () => (
  <BarChart
    series={[
      {
        data: [
          /* ... */
        ],
      },
    ]}
    width={500}
    height={300}
  />
));
```

For interaction benchmarks (re-renders, state changes), see the harness README.
