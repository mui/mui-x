import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Chance } from 'chance';
import { ScatterChartPremium } from '@mui/x-charts-premium/ScatterChartPremium';
import {
  useStore,
  selectorChartSeriesStatus,
  type UseChartSeriesSignature,
} from '@mui/x-charts/internals';

const CLUSTER_SIZE = 33_334;
const POINT_COUNT = CLUSTER_SIZE * 3;

// We use a regular `ArrayBuffer` rather than `SharedArrayBuffer`. Chrome's
// BroadcastChannel silently drops messages containing SAB-backed views even
// when `crossOriginIsolated` is true — likely a security restriction
// independent from the COOP/COEP gate. Columnar `Float64Array`s still win
// big over arrays of `{x, y, id}` objects: structured-clone reduces to a
// memcpy of three 800 KB buffers instead of cloning 100k JS objects.
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
    // Box–Muller for a roughly gaussian cloud.
    const u1 = rng.floating({ min: 1e-9, max: 1 });
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
  // One SharedArrayBuffer per cluster (8 bytes per Float64). Allocating a
  // fresh buffer set per series keeps each cluster mutable independently if
  // we want to tweak it later, and keeps the per-buffer transfer overhead
  // low.
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
const xAxis = [{ min: 0, max: 100, label: 'x', zoom: true }];
const yAxis = [{ min: 0, max: 100, label: 'y', width: 50, zoom: true }];

// Eagerly instantiate the Web Worker once per page. The worker's
// `setupChartsAsyncWorker()` opens a BroadcastChannel listener, which the
// chart auto-discovers on its first defaultize. We instantiate inside a
// component-scoped effect (instead of at module load) so Next.js' bundler
// reliably picks up the worker chunk, mirroring the data-grid excel-export
// demo. The `window` flag dedupes across HMR / Strict-Mode double-mount.
const WORKER_FLAG = '__muiXChartsScatterAsyncProcessingWorker';
function useChartsAsyncWorker() {
  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if ((window as any)[WORKER_FLAG]) {
      return;
    }
    (window as any)[WORKER_FLAG] = new Worker(
      new URL('./chartsWorker.ts', import.meta.url),
    );
  }, []);
}

function StatusObserver({
  onStatus,
}: {
  onStatus: (status: 'idle' | 'pending' | 'success' | 'error') => void;
}) {
  const store = useStore<[UseChartSeriesSignature]>();
  const status = store.use(selectorChartSeriesStatus);
  React.useEffect(() => {
    onStatus(status);
  }, [status, onStatus]);
  const colorMap: Record<string, 'default' | 'warning' | 'success' | 'error'> = {
    idle: 'default',
    pending: 'warning',
    success: 'success',
    error: 'error',
  };
  return (
    <Chip
      label={`series.status: ${status}`}
      color={colorMap[status]}
      size="small"
      sx={{ fontFamily: 'monospace' }}
    />
  );
}

export default function ScatterAsyncProcessing() {
  useChartsAsyncWorker();
  const [variant, setVariant] = React.useState(0);
  const [log, setLog] = React.useState<string[]>([]);
  const series = seriesVariants[variant];

  const appendLog = React.useCallback((status: string) => {
    const ms = String(Date.now() % 1000).padStart(3, '0');
    const timestamp = `${new Date().toLocaleTimeString('en-US', { hour12: false })}.${ms}`;
    setLog((prev) => [...prev.slice(-19), `${timestamp}  ${status}`]);
  }, []);

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
        <Button variant="text" size="small" onClick={() => setLog([])}>
          Clear log
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
        >
          <foreignObject x={8} y={8} width={260} height={32}>
            <StatusObserver onStatus={appendLog} />
          </foreignObject>
        </ScatterChartPremium>
      </Box>
      <Paper variant="outlined" sx={{ p: 1.5 }}>
        <Typography variant="caption" color="text.secondary">
          status transitions (newest at bottom)
        </Typography>
        <Box
          component="pre"
          sx={{
            m: 0,
            mt: 1,
            fontFamily: 'monospace',
            fontSize: 12,
            lineHeight: 1.4,
          }}
        >
          {log.length === 0
            ? '(no transitions yet — click "Reshuffle")'
            : log.join('\n')}
        </Box>
      </Paper>
    </Stack>
  );
}
