import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { dataset } from '../dataset/gdpPerCapitaEvolution';

export default function ChartsToolbarRangeButtonValues() {
  return (
    <LineChartPro
      dataset={dataset}
      xAxis={[{ scaleType: 'time', dataKey: 'date', zoom: true, tickNumber: 5 }]}
      yAxis={[{ width: 60, valueFormatter: (v: number) => `$${(v / 1000).toFixed(0)}k` }]}
      series={[
        { dataKey: 'fr', label: 'France' },
        { dataKey: 'gb', label: 'UK' },
        { dataKey: 'dl', label: 'Germany' },
      ]}
      height={300}
      showToolbar
      slotProps={{
        toolbar: {
          rangeButtons: [
            // Calendar intervals
            { label: '5Y', value: { unit: 'year', step: 5 } },
            { label: '10Y', value: { unit: 'year', step: 10 } },
            // Absolute date range
            { label: '2000s', value: [new Date(2000, 0, 1), new Date(2010, 0, 1)] },
            // Function
            { label: 'First half', value: () => ({ start: 0, end: 50 }) },
            // Reset
            { label: 'All', value: null },
          ],
        },
      }}
    />
  );
}
