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

export default function HorizontalRadialBarChart() {
  return (
    <RadialBarChart
      height={400}
      series={[
        {
          data: [3, 5, 7, 9, 12, 15, 17, 16, 13, 9, 6, 4],
          label: 'Temperature',
          layout: 'horizontal',
        },
        {
          data: [9, 12, 15, 17, 16, 13, 9, 6, 4, 3, 5, 7],
          label: 'Temperature',
          layout: 'horizontal',
          stack: 'stack1',
        },
        {
          data: [3, 5, 15, 3, 5, 7, 17, 16, 13, 9, 6, 4, 7, 9, 12],
          label: 'Temperature',
          layout: 'horizontal',
          stack: 'stack1',
        },
      ]}
      radiusAxis={[{ scaleType: 'band', data: months }]}
      rotationAxis={[{ scaleType: 'linear', max: 50 }]}
      grid={{ rotation: true, radius: true }}
    />
  );
}
