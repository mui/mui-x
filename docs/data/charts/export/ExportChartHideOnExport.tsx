import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

export default function ExportChartHideOnExport() {
  return (
    <BarChartPro
      showToolbar
      height={300}
      series={[
        { label: 'Sales', data: [42, 58, 71, 65, 80] },
        { label: 'Returns', data: [4, 6, 9, 7, 11] },
      ]}
      xAxis={[
        {
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          scaleType: 'band',
          id: 'x-axis',
        },
      ]}
      slotProps={{
        legend: { 'data-hide-on-export': true } as any,
      }}
    />
  );
}
