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

const highlightScope = { highlight: 'item', fade: 'global' };

export default function BasicRadialBarChart() {
  return (
    <RadialBarChart
      height={400}
      series={[
        {
          data: [3, 5, 7, null, 12, 15, 18, 16, 13, 9, 6, 4],
          label: 'Temperature',
          highlightScope,
        },
        {
          data: [12, 15, 18, 16, 13, null, 6, 4, 3, 5, 7, 9],
          label: 'Temperature',
          stack: 'a',
          highlightScope,
        },
        {
          data: [7, 9, 12, 15, 18, 16, 13, null, 6, 4, 3, 5],
          label: 'Temperature',
          stack: 'a',
          highlightScope,
        },
      ]}
      rotationAxis={[{ scaleType: 'band', data: months }]}
      radiusAxis={[{ scaleType: 'linear', minRadius: 20 }]}
      grid={{ rotation: true, radius: true }}
    />
  );
}
