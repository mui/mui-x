import * as React from 'react';
import { useTheme } from '@mui/system';
import { rainbowSurgePalette } from '@mui/x-charts/colorPalettes';
import { BarChartPremium } from '@mui/x-charts-premium/BarChartPremium';

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
    <BarChartPremium
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
          valueFormatter: (value: number) => dollarFormatter.format(value),
        },
      ]}
      series={[
        {
          type: 'rangeBar',
          data: [
            [0, 500_000],
            [500_000, 650_000],
            [650_000, 730_000],
            [730_000, 530_000],
            [530_000, 455_000],
            [455_000, 335_000],
            [335_000, 280_000],
            [0, 280_000],
          ],
          valueFormatter: (value) =>
            value === null ? null : dollarFormatter.format(value[1] - value[0]),
          colorGetter: (data) => {
            const value = data?.value;

            if (value == null || value[0] === 0) {
              return blue;
            }

            return value[1] - value[0] >= 0 ? green : red;
          },
        },
      ]}
      height={300}
    />
  );
}
