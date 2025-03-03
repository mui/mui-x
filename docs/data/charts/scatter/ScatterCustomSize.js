import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { data } from './randomData';

export default function ScatterCustomSize() {
  return (
    <ScatterChart
      height={300}
      series={[
        {
          label: 'Series A',
          data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
          markerSize: 8,
        },
        {
          label: 'Series B',
          data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
          markerSize: 4,
        },
      ]}
    />
  );
}
