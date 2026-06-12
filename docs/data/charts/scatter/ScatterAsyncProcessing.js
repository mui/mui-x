import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Chance } from 'chance';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { useStore, selectorChartSeriesStatus } from '@mui/x-charts/internals';

const CLUSTER_SIZE = 33_334;
const POINT_COUNT = CLUSTER_SIZE * 3;

function buildCluster(rng, centerX, centerY, spread, count) {
  const data = new Array(count);
  for (let i = 0; i < count; i += 1) {
    // Box–Muller for a roughly gaussian cloud.
    const u1 = rng.floating({ min: 1e-9, max: 1 });
    const u2 = rng.floating({ min: 0, max: 1 });
    const r = Math.sqrt(-2 * Math.log(u1));
    const theta = 2 * Math.PI * u2;
    data[i] = {
      id: i,
      x: centerX + r * Math.cos(theta) * spread,
      y: centerY + r * Math.sin(theta) * spread,
    };
  }
  return data;
}

function buildSeries(seed) {
  // Three clusters whose centers shift each time `seed` changes — produces a
  // clearly different shape on every reshuffle. Seeded RNG keeps demos
  // deterministic across reloads.
  const rng = new Chance(seed);
  return [
    {
      id: 'cluster-a',
      label: 'Cluster A',
      markerSize: 1,
      data: buildCluster(rng, 20 + seed * 5, 30 + seed * 3, 4, CLUSTER_SIZE),
    },
    {
      id: 'cluster-b',
      label: 'Cluster B',
      markerSize: 1,
      data: buildCluster(rng, 60 - seed * 4, 70 - seed * 2, 5, CLUSTER_SIZE),
    },
    {
      id: 'cluster-c',
      label: 'Cluster C',
      markerSize: 1,
      data: buildCluster(rng, 40 + seed * 2, 20 + seed * 4, 6, CLUSTER_SIZE),
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
const xAxis = [{ min: 0, max: 100, label: 'x' }];
const yAxis = [{ min: 0, max: 100, label: 'y', width: 50 }];

function StatusObserver({ onStatus }) {
  const store = useStore();
  const status = store.use(selectorChartSeriesStatus);
  React.useEffect(() => {
    onStatus(status);
  }, [status, onStatus]);
  const colorMap = {
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
  const [variant, setVariant] = React.useState(0);
  const [log, setLog] = React.useState([]);
  const series = seriesVariants[variant];

  const appendLog = React.useCallback((status) => {
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
        <ScatterChart
          series={series}
          xAxis={xAxis}
          yAxis={yAxis}
          renderer="svg-batch"
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
        </ScatterChart>
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
