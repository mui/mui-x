import * as React from 'react';
import { ScatterChartPremium } from '@mui/x-charts-premium/ScatterChartPremium';
import { defineScenario } from '../../utils/scenario';
import { benchWebGLInteraction } from '../utils';

// Big enough to exercise the WebGL renderer's large-dataset path, small enough
// to keep each sample short: without a GPU, as in CI, point processing through
// SwiftShader (software WebGL) dominates it.
const dataLength = 10_000;
const data = Array.from({ length: dataLength }).map((_, i) => ({
  x: i,
  // Ensure the narrow x/y zoom benchmark has a visible point.
  y: i === dataLength / 2 ? 50.025 : 50 + Math.sin(i / 5) * 25 + Math.cos(i / 37) * 10,
}));

const xData = data.map((d) => d.x);

export const scatterChartPremium = defineScenario(
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

export const scatterChartPremiumZoomedIn = defineScenario(
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
