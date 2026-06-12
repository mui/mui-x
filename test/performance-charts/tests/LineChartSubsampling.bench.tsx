import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { LineChart } from '@mui/x-charts/LineChart';

function generateSeries(n: number) {
  const xs = new Array<number>(n);
  const ys = new Array<number>(n);
  for (let i = 0; i < n; i += 1) {
    xs[i] = i;
    ys[i] = 50 + Math.sin(i / 5) * 25 + Math.cos(i / 137) * 10 + (Math.random() - 0.5) * 5;
  }
  return { xs, ys };
}

const SIZES = [10_000, 100_000, 1_000_000] as const;
const datasets = new Map<number, { xs: number[]; ys: number[] }>();
for (const n of SIZES) {
  datasets.set(n, generateSeries(n));
}

const WIDTH = 800;
const HEIGHT = 400;

for (const n of SIZES) {
  const { xs, ys } = datasets.get(n)!;
  const opts = n >= 1_000_000 ? { warmupRuns: 1, runs: 3 } : undefined;

  benchmark(
    `LineChart ${n.toLocaleString()} pts — baseline (no sampling)`,
    () => (
      <LineChart
        xAxis={[{ data: xs }]}
        series={[{ data: ys, showMark: false }]}
        width={WIDTH}
        height={HEIGHT}
      />
    ),
    opts,
  );

  benchmark(
    `LineChart ${n.toLocaleString()} pts — LTTB sampling`,
    () => (
      <LineChart
        xAxis={[{ data: xs }]}
        series={[{ data: ys, showMark: false, sampling: 'lttb' }]}
        width={WIDTH}
        height={HEIGHT}
      />
    ),
    opts,
  );
}
