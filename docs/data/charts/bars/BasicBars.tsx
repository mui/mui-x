import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

export default function BasicBars() {
  return (
    <BarChartPro
      xAxis={[
        { scaleType: 'band', data: ['group A', 'group B', 'group C'], zoom: true },
      ]}
      series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
      width={500}
      height={300}
    />
  );
}
