import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

function generateScatter(n: number) {
  const data = new Array<{ id: number; x: number; y: number }>(n);
  let s = 1;
  const rng = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < n; i += 1) {
    data[i] = { id: i, x: rng() * 1000, y: rng() * 1000 };
  }
  return data;
}

// Note: 1,000,000 progressive hangs the bench because each rAF triggers a
// re-render that walks an ever-growing slice; cumulative cost is O(N^2/batchSize).
// Limit the bench to sizes that actually finish.
const SIZES = [50_000, 200_000] as const;
const datasets = new Map<number, ReturnType<typeof generateScatter>>();
for (const n of SIZES) {
  datasets.set(n, generateScatter(n));
}

const WIDTH = 800;
const HEIGHT = 400;

for (const n of SIZES) {
  const data = datasets.get(n)!;
  const baselineOpts = n >= 1_000_000 ? { warmupRuns: 1, runs: 3 } : undefined;
  // Progressive uses rAF; iteration count varies — restrict to a single run
  // so the harness skips the iteration consistency check.
  const progressiveOpts = { warmupRuns: 0, runs: 1 };

  benchmark(
    `ScatterChart ${n.toLocaleString()} pts — baseline (no progressive)`,
    () => <ScatterChart series={[{ data, markerSize: 2 }]} width={WIDTH} height={HEIGHT} />,
    baselineOpts,
  );

  benchmark(
    `ScatterChart ${n.toLocaleString()} pts — progressive (batchSize=5000)`,
    () => (
      <ScatterChart
        series={[{ data, markerSize: 2, progressive: { batchSize: 5_000 } }]}
        width={WIDTH}
        height={HEIGHT}
      />
    ),
    progressiveOpts,
  );
}
