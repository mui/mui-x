import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

const data = [
  { x: 1, y: 2, sizeValue: 2, label: 'A' },
  { x: 2.4, y: 1.5, sizeValue: 8, label: 'B' },
  { x: 3.1, y: 3.4, sizeValue: 14, label: 'C' },
  { x: 1.8, y: 4.2, sizeValue: 5, label: 'D' },
  { x: 4.5, y: 2.8, sizeValue: 20, label: 'E' },
  { x: 3.7, y: 1.2, sizeValue: 11, label: 'F' },
  { x: 2.1, y: 3.9, sizeValue: 17, label: 'G' },
  { x: 4.9, y: 4.6, sizeValue: 3, label: 'H' },
  { x: 3.3, y: 2.2, sizeValue: 25, label: 'I' },
];

export default function ScatterMarkerLabelFunction() {
  return (
    <ScatterChart
      height={300}
      grid={{ horizontal: true, vertical: true }}
      series={[
        {
          data,
          sizeAxisId: 'size',
          markerLabel: ({ value }, { marker }) =>
            marker.size >= 12 ? value.label : null,
        },
      ]}
      zAxis={[
        {
          id: 'size',
          sizeMap: { type: 'continuous', min: 0, max: 25, size: [3, 24] },
        },
      ]}
    />
  );
}
