import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

// Deterministic dataset large enough that a percentage span would be unintuitive.
const POINTS = 200;
const data = Array.from({ length: POINTS }, (_, index) => {
  const hash = Math.sin(index * 12.9898) * 43758.5453;
  return Math.round(50 + (hash - Math.floor(hash)) * 100);
});
const categories = data.map((_, index) => String(index));

export default function ZoomSpanItems() {
  return (
    <BarChartPro
      height={300}
      // Zoom window is bounded by item count, not a percentage: between 10 and 40 bars,
      // independent of the dataset size.
      xAxis={[{ data: categories, zoom: { minSpanItems: 10, maxSpanItems: 40 } }]}
      series={[{ data, label: 'Value' }]}
    />
  );
}
