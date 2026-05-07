import { benchmark } from '@mui/internal-benchmark';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

function generateSeries(n: number) {
  const xs = new Array<number>(n);
  const ys = new Array<number>(n);
  let s = 1;
  for (let i = 0; i < n; i += 1) {
    xs[i] = i;
    s = (s * 9301 + 49297) % 233280;
    ys[i] = 50 + Math.sin(i / 5) * 25 + (s / 233280 - 0.5) * 5;
  }
  return { xs, ys };
}

function generateScatter(n: number) {
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

// Sizes calibrated to fit the bench harness 120 s per-test timeout. Bar/scatter sync
// renders are slow per element (one DOM node per bar/marker in the regular renderer),
// so they're capped lower. Line uses the cheap line-only renderer.
const LINE_N = 100_000;
const BAR_N = 30_000;
const SCATTER_N = 50_000;

const lineData = generateSeries(LINE_N);
const barData = generateSeries(BAR_N);
const scatterData = generateScatter(SCATTER_N);

const heavyOpts = { warmupRuns: 1, runs: 3 };

benchmark(`LineChart ${LINE_N.toLocaleString()} pts — sync`, () => (
  <LineChart
    xAxis={[{ data: lineData.xs }]}
    series={[{ data: lineData.ys, showMark: false }]}
    width={800}
    height={400}
  />
));

benchmark(`LineChart ${LINE_N.toLocaleString()} pts — async (worker)`, () => (
  <LineChart
    xAxis={[{ data: lineData.xs }]}
    series={[{ data: lineData.ys, showMark: false }]}
    width={800}
    height={400}
    asyncProcessing
  />
));

benchmark(
  `BarChart ${BAR_N.toLocaleString()} pts — sync`,
  () => (
    <BarChart
      xAxis={[{ data: barData.xs, scaleType: 'band' as const }]}
      series={[{ data: barData.ys }]}
      width={800}
      height={400}
    />
  ),
  heavyOpts,
);

benchmark(
  `BarChart ${BAR_N.toLocaleString()} pts — async (worker)`,
  () => (
    <BarChart
      xAxis={[{ data: barData.xs, scaleType: 'band' as const }]}
      series={[{ data: barData.ys }]}
      width={800}
      height={400}
      asyncProcessing
    />
  ),
  heavyOpts,
);

benchmark(
  `ScatterChart ${SCATTER_N.toLocaleString()} pts — sync`,
  () => <ScatterChart series={[{ data: scatterData, markerSize: 2 }]} width={800} height={400} />,
  heavyOpts,
);

benchmark(
  `ScatterChart ${SCATTER_N.toLocaleString()} pts — async (worker)`,
  () => (
    <ScatterChart
      series={[{ data: scatterData, markerSize: 2 }]}
      width={800}
      height={400}
      asyncProcessing
    />
  ),
  heavyOpts,
);
