import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function BasicBarRange() {
  return (
    <BarChart
      xAxis={[
        {
          data: [
            'Revenue',
            'Product\nSales',
            'Services\nRevenue',
            'Cost of\nGoods Sold',
            'Marketing\nExpenses',
            'Operating\nExpenses',
            'Tax',
            'Net Profit',
          ],
        },
      ]}
      series={[
        {
          type: 'barRange',
          data: [
            { start: 0, end: 500_000 },
            null,
            null,
            null,
            null,
            null,
            null,
            { start: 0, end: 280_000 },
          ],
          valueFormatter: (value) =>
            value === null ? null : `$${(value.end - value.start).toLocaleString()}`,
        },
        {
          type: 'barRange',
          data: [
            null,
            { start: 500_000, end: 650_000 },
            { start: 650_000, end: 730_000 },
            null,
            null,
            null,
            null,
            null,
          ],
          color: 'green',
          valueFormatter: (value) =>
            value === null ? null : `$${(value.end - value.start).toLocaleString()}`,
        },
        {
          type: 'barRange',
          data: [
            null,
            null,
            null,
            { start: 730_000, end: 530_000 },
            { start: 530_000, end: 455_000 },
            { start: 455_000, end: 335_000 },
            { start: 335_000, end: 280_000 },
            null,
          ],
          color: 'red',
          valueFormatter: (value) =>
            value === null ? null : `$${(value.end - value.start).toLocaleString()}`,
        },
      ]}
      height={300}
    />
  );
}
