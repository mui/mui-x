import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Chance } from 'chance';
import { ScatterChartPremium } from '@mui/x-charts-premium/ScatterChartPremium';

const CLUSTER_SIZE = 333_334;
const POINT_COUNT = CLUSTER_SIZE * 3;

// We use a regular `ArrayBuffer` rather than `SharedArrayBuffer`. Chrome's
// BroadcastChannel silently drops messages containing SAB-backed views even
// when `crossOriginIsolated` is true — likely a security restriction
// independent from the COOP/COEP gate. Columnar `Float64Array`s still win
// big over arrays of `{x, y, id}` objects: structured-clone reduces to a
// memcpy of three 8 MB buffers instead of cloning 1M JS objects.
function allocateBuffer(byteLength: number): ArrayBufferLike {
  return new ArrayBuffer(byteLength);
}

function buildCluster(
  rng: Chance.Chance,
  centerX: number,
  centerY: number,
  spread: number,
  count: number,
  xs: Float64Array,
  ys: Float64Array,
  offset: number,
) {
  for (let i = 0; i < count; i += 1) {
    // Box–Muller for a roughly gaussian cloud. `Math.max` guards against
    // `chance`'s rare boundary draws where `u1 = 0` would yield
    // `log(0) = -Infinity` and produce `±Infinity` point positions.
    const u1 = Math.max(rng.floating({ min: 1e-9, max: 1 }), 1e-12);
    const u2 = rng.floating({ min: 0, max: 1 });
    const r = Math.sqrt(-2 * Math.log(u1));
    const theta = 2 * Math.PI * u2;
    xs[offset + i] = centerX + r * Math.cos(theta) * spread;
    ys[offset + i] = centerY + r * Math.sin(theta) * spread;
  }
}

function buildColumnar(
  seed: number,
  center: { x: number; y: number; spread: number },
) {
  const byteLength = CLUSTER_SIZE * Float64Array.BYTES_PER_ELEMENT;
  const xBuffer = allocateBuffer(byteLength);
  const yBuffer = allocateBuffer(byteLength);
  const xs = new Float64Array(xBuffer);
  const ys = new Float64Array(yBuffer);
  const rng = new Chance(seed);
  buildCluster(rng, center.x, center.y, center.spread, CLUSTER_SIZE, xs, ys, 0);
  return {
    __columnar: true as const,
    x: xs,
    y: ys,
    length: CLUSTER_SIZE,
  };
}

function buildSeries(seed: number) {
  // Three clusters whose centers shift each time `seed` changes — produces a
  // clearly different shape on every reshuffle. Seeded RNG keeps demos
  // deterministic across reloads.
  return [
    {
      id: 'cluster-a',
      label: 'Cluster A',
      markerSize: 1,
      data: buildColumnar(seed * 3, {
        x: 20 + seed * 5,
        y: 30 + seed * 3,
        spread: 4,
      }),
    },
    {
      id: 'cluster-b',
      label: 'Cluster B',
      markerSize: 1,
      data: buildColumnar(seed * 3 + 1, {
        x: 60 - seed * 4,
        y: 70 - seed * 2,
        spread: 5,
      }),
    },
    {
      id: 'cluster-c',
      label: 'Cluster C',
      markerSize: 1,
      data: buildColumnar(seed * 3 + 2, {
        x: 40 + seed * 2,
        y: 20 + seed * 4,
        spread: 6,
      }),
    },
  ];
}

// Pre-build a few datasets at module scope so the references stay stable
// across renders — the async pipeline only fires when the input identity
// actually changes.
const seriesVariants = [
  buildSeries(0),
  buildSeries(1),
  buildSeries(2),
  buildSeries(3),
];
const xAxis = [{ label: 'x', zoom: true }];
const yAxis = [{ label: 'y', width: 50, zoom: true }];

// Instantiate the worker at module-load time (not in a `useEffect`) so the
// worker chunk's network fetch + parse + module eval can overlap with the
// React render that follows. Deferring to an effect made the worker
// available only ~1.3s after the first defaultize, well past the chart's
// 10ms probe window — so every initial defaultize fell back to main thread.
// The `window` flag dedupes across HMR / Strict-Mode double-mount.
const WORKER_FLAG = '__muiXChartsScatterAsyncProcessingWorker';
if (typeof window !== 'undefined' && !(window as any)[WORKER_FLAG]) {
  (window as any)[WORKER_FLAG] = new Worker(
    new URL('./chartsWorker.ts', import.meta.url),
  );
}

export default function ScatterAsyncProcessing() {
  const [variant, setVariant] = React.useState(0);
  const series = seriesVariants[variant];

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={() => setVariant((v) => (v + 1) % seriesVariants.length)}
        >
          Reshuffle ({POINT_COUNT.toLocaleString()} points)
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            // Three rapid swaps — exercises the request-id cancellation in
            // the async pipeline. Only the final success commit should land.
            setVariant((v) => (v + 1) % seriesVariants.length);
            setTimeout(() => setVariant((v) => (v + 1) % seriesVariants.length), 0);
            setTimeout(() => setVariant((v) => (v + 1) % seriesVariants.length), 0);
          }}
        >
          Rapid reshuffle (3×)
        </Button>
      </Stack>
      <Box sx={{ width: '100%', height: 420, position: 'relative' }}>
        <ScatterChartPremium
          series={series}
          xAxis={xAxis}
          yAxis={yAxis}
          renderer="webgl"
          slotProps={{
            legend: {
              position: { vertical: 'bottom' },
              sx: { justifyContent: 'center' },
            },
          }}
        />
      </Box>
    </Stack>
  );
}
