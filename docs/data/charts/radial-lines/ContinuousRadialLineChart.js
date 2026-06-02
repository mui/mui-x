import * as React from 'react';
import { Unstable_RadialLineChart as RadialLineChart } from '@mui/x-charts-premium/RadialLineChart';

const SAMPLES = 200;
const angles = Array.from(
  { length: SAMPLES + 1 },
  (_, i) => (i * 2 * Math.PI) / SAMPLES,
);

const cardioid = angles.map((angle) => 100 * (1 + Math.cos(angle * 3)));

export default function ContinuousRadialLineChart() {
  return (
    <RadialLineChart
      height={400}
      series={[
        {
          data: cardioid,
          label: 'Cardioid',
          curve: 'linear',
          valueFormatter: (value) => (value == null ? '' : `${Math.round(value)}`),
        },
      ]}
      rotationAxis={[
        {
          data: angles,
          domainLimit: () => ({ min: 0, max: 2 * Math.PI }),
          tickInterval: [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI],
          valueFormatter: (value) => `${Math.round((value * 180) / Math.PI)}°`,
        },
      ]}
      radiusAxis={[{ position: 'none' }]}
      grid={{ rotation: true, radius: true }}
    />
  );
}
