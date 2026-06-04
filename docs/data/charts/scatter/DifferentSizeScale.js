import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

const values = [1, 2, 5, 9, 10, 12, 15, 29, 50, 60, 90, 100];

const series = ['sqrt', 'linear', 'log'].map((interpolator) => ({
  data: values.map((v, i) => ({ x: i + 1, y: interpolator, sizeValue: v })),
  sizeAxisId: interpolator,
}));

export default function DifferentSizeScale() {
  return (
    <ScatterChart
      height={300}
      grid={{ horizontal: true, vertical: true }}
      series={series}
      yAxis={[{ scaleType: 'point', data: ['sqrt', 'linear', 'log'] }]}
      zAxis={[
        {
          id: 'sqrt',
          sizeMap: { type: 'continuous', min: 5, max: 90, size: [3, 20] },
        },
        {
          id: 'linear',
          sizeMap: {
            type: 'continuous',
            min: 5,
            max: 90,
            size: [3, 20],
            interpolator: 'linear',
          },
        },
        {
          id: 'log',
          sizeMap: {
            type: 'continuous',
            min: 5,
            max: 90,
            size: [3, 20],
            interpolator: 'log',
          },
        },
      ]}
    />
  );
}
