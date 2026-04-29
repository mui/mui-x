import * as React from 'react';
import { Unstable_RadialBarChart as RadialBarChart } from '@mui/x-charts-premium/RadialBarChart';

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

export default function BasicRadialBarChart() {
  return (
    <RadialBarChart
      height={400}
      series={[
        {
          data: [3, 5, 7, 9, 12, 15, 18, 16, 13, 9, 6, 4],
          label: 'Temperature',
        },
      ]}
      rotationAxis={[{ scaleType: 'band', data: months }]}
      grid={{ rotation: true, radius: true }}
    />
  );
}
