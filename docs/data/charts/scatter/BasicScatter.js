import * as React from 'react';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';

const data = [
  { x: 4, y: 1 },
  { x: 6, y: 2 },
  { x: 2, y: 8 },
  { x: 2, y: 8 },
  { x: 1.5, y: 1 },
  { x: 4, y: 2 },
];

export default function BasicScatter() {
  return (
    <React.StrictMode>
      <ScatterChartPro
        series={[{ data }]}
        height={300}
        xAxis={[{ zoom: { filterMode: 'discard' } }]}
        yAxis={[{ max: 7 }]}
      />
    </React.StrictMode>
  );
}
