import * as React from 'react';
import { Unstable_RadialLineChart as RadialLineChart } from '@mui/x-charts-premium/RadialLineChart';

const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function ContinuousRadialLineChart() {
  return (
    <RadialLineChart
      height={400}
      series={[
        {
          data: [3, 5, 7, 9, 12, 15, 18, 16, 13, 9, 6, 4],
          label: 'Temperature',
          curve: 'natural',
        },
      ]}
      rotationAxis={[{ data: hours, domainLimit: 'strict' }]}
      grid={{ rotation: true, radius: true }}
    />
  );
}
