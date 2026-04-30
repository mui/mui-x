import * as React from 'react';
import { Unstable_RadialLineChart as RadialLineChart } from '@mui/x-charts-premium/RadialLineChart';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export default function BasicRadialLineChart() {
  return (
    <RadialLineChart
      height={400}
      series={[
        {
          data: [3, 5, 7, 9, 12, 15, 18, 16, 13, 9, 6, 4],
          label: 'Temperature',
          curve: 'natural',
          showMark: true,
        },
      ]}
      rotationAxis={[{ scaleType: 'point', data: months }]}
      grid={{ rotation: true, radius: true }}
    />
  );
}
