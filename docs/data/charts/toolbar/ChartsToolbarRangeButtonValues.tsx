import * as React from 'react';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';

const startDate = new Date(2023, 0, 1);
const dates = Array.from(
  { length: 365 * 2 },
  (_, i) => new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
);
const values = dates.map(
  (_, i) => 100 + 50 * Math.sin(i / 30) + 20 * Math.sin(i / 7) + i * 0.05,
);

export default function ChartsToolbarRangeButtonValues() {
  return (
    <LineChartPro
      xAxis={[{ scaleType: 'time', data: dates, zoom: true }]}
      series={[{ data: values, showMark: false, label: 'Value' }]}
      height={300}
      showToolbar
      slotProps={{
        toolbar: {
          rangeButtons: [
            // Calendar intervals
            { label: '1M', value: { unit: 'month' } },
            { label: '6M', value: { unit: 'month', step: 6 } },
            { label: '1Y', value: { unit: 'year' } },
            // Absolute date range
            { label: '2023', value: [new Date(2023, 0, 1), new Date(2024, 0, 1)] },
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
