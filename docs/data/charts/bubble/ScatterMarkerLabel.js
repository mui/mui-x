import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

const data = [
  { x: 1, y: 2, label: 'A' },
  { x: 2.4, y: 1.5, label: 'B' },
  { x: 3.1, y: 3.4, label: 'C' },
  { x: 1.8, y: 4.2, label: 'D' },
  { x: 4.5, y: 2.8, label: 'E' },
  { x: 3.7, y: 1.2, label: 'F' },
];

export default function ScatterMarkerLabel() {
  return (
    <ScatterChart
      height={300}
      grid={{ horizontal: true, vertical: true }}
      series={[{ data, markerSize: 12, markerLabel: 'label' }]}
    />
  );
}
