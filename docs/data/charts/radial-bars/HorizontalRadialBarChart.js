import * as React from 'react';
import { Unstable_RadialBarChart as RadialBarChart } from '@mui/x-charts-premium/RadialBarChart';

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

const highlightScope = { highlight: 'item', fade: 'global' };

export default function HorizontalRadialBarChart() {
  return (
    <RadialBarChart
      height={400}
      series={[
        {
          data: [3, 5, 7, 9],
          label: 'Temperature',
          layout: 'horizontal',
          highlightScope,
        },
        {
          data: [9, 12, 15, 17],
          label: 'Temperature',
          layout: 'horizontal',
          highlightScope,
          stack: 'stack1',
        },
        {
          data: [3, 5, 15, 3],
          label: 'Temperature',
          layout: 'horizontal',
          highlightScope,
          stack: 'stack1',
        },
      ]}
      radiusAxis={[{ scaleType: 'band', data: quarters, minRadius: 50 }]}
      rotationAxis={[{ scaleType: 'linear', endAngle: 270 }]}
      grid={{ rotation: true, radius: true }}
    />
  );
}
