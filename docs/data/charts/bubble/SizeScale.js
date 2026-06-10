import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

const data = [
  { x: 1, y: 2, sizeValue: 2 },
  { x: 2.4, y: 1.5, sizeValue: 8 },
  { x: 3.1, y: 3.4, sizeValue: 14 },
  { x: 1.8, y: 4.2, sizeValue: 5 },
  { x: 4.5, y: 2.8, sizeValue: 20 },
  { x: 3.7, y: 1.2, sizeValue: 11 },
  { x: 2.1, y: 3.9, sizeValue: 17 },
  { x: 4.9, y: 4.6, sizeValue: 3 },
  { x: 0.8, y: 1.1, sizeValue: 9 },
  { x: 3.3, y: 2.2, sizeValue: 25 },
  { x: 2.7, y: 4.8, sizeValue: 6 },
  { x: 4.1, y: 3.1, sizeValue: 13 },
];

export default function SizeScale() {
  return (
    <ScatterChart
      height={300}
      grid={{ horizontal: true, vertical: true }}
      series={[{ data, sizeAxisId: 'size' }]}
      zAxis={[
        {
          id: 'size',
          sizeMap: { type: 'continuous', min: 0, max: 25, size: [3, 24] },
        },
      ]}
    />
  );
}
