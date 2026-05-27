import * as React from 'react';
import { Unstable_RadialLineChart as RadialLineChart } from '@mui/x-charts-premium/RadialLineChart';
import { dataset } from '../dataset/weather';

export default function BasicRadialLineChart() {
  return (
    <RadialLineChart
      height={400}
      dataset={dataset}
      series={[
        {
          dataKey: 'london',
          label: 'London precipitation (mm)',
          curve: 'natural',
          showMark: true,
        },
      ]}
      rotationAxis={[{ scaleType: 'point', dataKey: 'month', disableLine: true }]}
      radiusAxis={[{ disableLine: true }]}
      grid={{ rotation: true, radius: true }}
    />
  );
}
