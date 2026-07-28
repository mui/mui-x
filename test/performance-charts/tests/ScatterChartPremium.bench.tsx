import * as React from 'react';
import { benchmark } from '@mui/internal-benchmark';
import { ScatterChartPremium } from '@mui/x-charts-premium/ScatterChartPremium';
import { benchWebGLInteraction } from '../utils';

// Big enough to exercise the WebGL renderer's large-dataset path, small enough
// to stay clear of the harness's 120s test timeout: point processing through
// SwiftShader (software WebGL) dominates each iteration's wall-clock, and at
// 50k points these two tests took ~113s each on CI.
const dataLength = 10_000;
const data = Array.from({ length: dataLength }).map((_, i) => ({
  x: i,
  y: 50 + Math.sin(i / 5) * 25 + Math.cos(i / 37) * 10,
}));

const xData = data.map((d) => d.x);

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
  benchWebGLInteraction,
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
  benchWebGLInteraction,
);
