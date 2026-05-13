import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

const months = Array.from({ length: 24 }, (_, i) => new Date(2023, i, 1));
const values = months.map(
  (_, i) => 50 + 30 * Math.sin(i / 3) + 10 * Math.cos(i / 2),
);

export default function ChartsToolbarOrdinalRangeButtons() {
  return (
    <BarChartPro
      xAxis={[
        {
          scaleType: 'band',
          data: months,
          zoom: true,
          valueFormatter: (date: Date) =>
            date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        },
      ]}
      series={[{ data: values, label: 'Value' }]}
      height={300}
      showToolbar
      slotProps={{
        toolbar: {
          rangeButtons: [
            { label: '3M', value: { unit: 'month', step: 3 } },
            { label: '6M', value: { unit: 'month', step: 6 } },
            { label: '1Y', value: { unit: 'year' } },
            { label: '2023', value: [new Date(2023, 0, 1), new Date(2023, 11, 1)] },
            { label: 'All', value: null },
          ],
        },
      }}
    />
  );
}
