import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { useTheme } from '@mui/system';
import { rainbowSurgePalette } from '@mui/x-charts/colorPalettes';

const dollarFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  compactDisplay: 'short',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function WaterfallChart() {
  const theme = useTheme();
  const palette = rainbowSurgePalette(theme.palette.mode);
  const blue = palette[0];
  const red = palette[2];
  const green = palette[4];

  return (
    <BarChartPro
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
      yAxis={[
        {
          width: 72,
          valueFormatter: (value) => dollarFormatter.format(value),
        },
      ]}
      series={[
        {
          type: 'rangeBar',
          data: [
            { start: 0, end: 500_000 },
            { start: 500_000, end: 650_000 },
            { start: 650_000, end: 730_000 },
            { start: 730_000, end: 530_000 },
            { start: 530_000, end: 455_000 },
            { start: 455_000, end: 335_000 },
            { start: 335_000, end: 280_000 },
            { start: 0, end: 280_000 },
          ],
          valueFormatter: (value) =>
            value === null ? null : dollarFormatter.format(value.end - value.start),
          colorGetter: (data) => {
            const value = data?.value;

            if (value == null || value.start === 0) {
              return blue;
            }

            return value.end - value.start >= 0 ? green : red;
          },
        },
      ]}
      height={300}
    />
  );
}
