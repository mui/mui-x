import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { ScatterChartPremium } from '@mui/x-charts-premium/ScatterChartPremium';
import { createBenchWebGLInteraction } from '../utils';

const dataLength = 50_000;
const data = Array.from({ length: dataLength }).map((_, i) => ({
  x: i,
  y: 50 + Math.sin(i / 5) * 25 + Math.cos(i / 37) * 10,
}));

const xData = data.map((d) => d.x);

// Rasterizing 50k points through SwiftShader (software WebGL) costs seconds of
// wall-clock per iteration on CI regardless of what the harness measures — at
// the default 10 warmup + 20 measured iterations these tests run ~113s each,
// flaking against the harness's 120s test timeout. Fewer iterations keep the
// pair of tests well clear of it.
const runOptions = { warmupRuns: 3, runs: 10 };

benchmark(
  'ScatterChartPremium with big data amount (webgl renderer)',
  () => (
    <ScatterChartPremium
      xAxis={[
        {
          id: 'x',
          data: xData,
          zoom: { filterMode: 'discard' },
          valueFormatter: (v: number) => v.toLocaleString('en-US'),
        },
      ]}
      initialZoom={[{ axisId: 'x', start: 20, end: 70 }]}
      series={[{ data }]}
      width={500}
      height={300}
      renderer="webgl"
      skipAnimation
    />
  ),
  createBenchWebGLInteraction(),
  runOptions,
);

benchmark(
  'ScatterChartPremium with big data amount and zoomed in (webgl renderer)',
  () => (
    <ScatterChartPremium
      xAxis={[
        {
          id: 'x',
          data: xData,
          valueFormatter: (v: number) => v.toLocaleString('en-US'),
          zoom: { minSpan: 0 },
        },
      ]}
      yAxis={[{ id: 'y', zoom: { minSpan: 0 } }]}
      series={[{ data }]}
      width={500}
      height={300}
      initialZoom={[
        { axisId: 'x', start: 50, end: 50.1 },
        { axisId: 'y', start: 50, end: 50.1 },
      ]}
      renderer="webgl"
      skipAnimation
    />
  ),
  createBenchWebGLInteraction(),
  runOptions,
);
