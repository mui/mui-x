import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { AsyncScatter } from './asyncPipeline/AsyncScatter';

function generateFlat(n: number) {
  const data = new Float64Array(2 * n);
  let s = 1;
  for (let i = 0; i < 2 * n; i += 1) {
    s = (s * 9301 + 49297) % 233280;
    data[i] = s / 233280;
  }
  return data;
}

function generateObjects(n: number) {
  const data = new Array<{ id: number; x: number; y: number }>(n);
  let s = 1;
  for (let i = 0; i < n; i += 1) {
    s = (s * 9301 + 49297) % 233280;
    const x = s / 233280;
    s = (s * 9301 + 49297) % 233280;
    const y = s / 233280;
    data[i] = { id: i, x, y };
  }
  return data;
}

const SIZES = [100_000, 1_000_000] as const;
const WIDTH = 800;
const HEIGHT = 400;

// Pre-generate object datasets for the sync baseline (kept for the lifetime of the run).
const objectDatasets = new Map<number, ReturnType<typeof generateObjects>>();
for (const n of SIZES) {
  objectDatasets.set(n, generateObjects(n));
}

for (const n of SIZES) {
  // Async path transfers the buffer, so each iteration needs its own copy.
  benchmark(
    `AsyncScatter ${n.toLocaleString()} pts — async (worker)`,
    () => <AsyncScatter data={generateFlat(n)} width={WIDTH} height={HEIGHT} markerSize={2} />,
    async ({ waitForElementTiming }) => {
      await waitForElementTiming('async-done', 60_000);
    },
    { warmupRuns: 1, runs: 3 },
  );

  const syncData = objectDatasets.get(n)!;
  const syncOpts = n >= 1_000_000 ? { warmupRuns: 1, runs: 3 } : undefined;
  benchmark(
    `AsyncScatter ${n.toLocaleString()} pts — sync baseline (ScatterChart)`,
    () => (
      <ScatterChart series={[{ data: syncData, markerSize: 2 }]} width={WIDTH} height={HEIGHT} />
    ),
    syncOpts,
  );
}
