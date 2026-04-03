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

export default function ChartsToolbarRangeButtons() {
  return (
    <LineChartPro
      xAxis={[{ scaleType: 'time', data: dates, zoom: true }]}
      series={[{ data: values, showMark: false, label: 'Value' }]}
      height={300}
      showToolbar
      slotProps={{
        toolbar: {
          rangeButtons: [
            { label: '1M', value: { unit: 'month' } },
            { label: '3M', value: { unit: 'month', step: 3 } },
            { label: '6M', value: { unit: 'month', step: 6 } },
            { label: '1Y', value: { unit: 'year' } },
            { label: 'All', value: null },
          ],
        },
      }}
    />
  );
}
