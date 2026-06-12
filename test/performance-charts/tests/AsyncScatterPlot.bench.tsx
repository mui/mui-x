import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { AsyncScatterPlot } from '@mui/x-charts/AsyncScatterPlot';

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

const objectDatasets = new Map<number, ReturnType<typeof generateObjects>>();
for (const n of SIZES) {
  objectDatasets.set(n, generateObjects(n));
}

function AsyncRig({ n }: { n: number }) {
  const data = React.useMemo(() => generateFlat(n), [n]);
  const [done, setDone] = React.useState(false);
  return (
    <React.Fragment>
      <AsyncScatterPlot
        data={data}
        width={WIDTH}
        height={HEIGHT}
        markerSize={2}
        onLoadEnd={() => setDone(true)}
      />
      {done && (
        <span
          elementtiming="async-done"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            opacity: 0.01,
            pointerEvents: 'none',
            fontSize: 1,
          }}
        >
          {'\xA0'}
        </span>
      )}
    </React.Fragment>
  );
}

for (const n of SIZES) {
  benchmark(
    `AsyncScatterPlot ${n.toLocaleString()} pts — async (lib export)`,
    () => <AsyncRig n={n} />,
    async ({ waitForElementTiming }) => {
      await waitForElementTiming('async-done', 60_000);
    },
    { warmupRuns: 1, runs: 3 },
  );

  const syncData = objectDatasets.get(n)!;
  const syncOpts = n >= 1_000_000 ? { warmupRuns: 1, runs: 3 } : undefined;
  benchmark(
    `AsyncScatterPlot ${n.toLocaleString()} pts — sync ScatterChart`,
    () => (
      <ScatterChart series={[{ data: syncData, markerSize: 2 }]} width={WIDTH} height={HEIGHT} />
    ),
    syncOpts,
  );
}
