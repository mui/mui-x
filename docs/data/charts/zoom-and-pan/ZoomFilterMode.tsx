import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { dataset, valueFormatter } from './letterFrequency';

export default function ZoomFilterMode() {
  return (
    <BarChartPro
      dataset={dataset}
      xAxis={[
        {
          scaleType: 'band',
          dataKey: 'letter',
          zoom: { filterMode: 'discard' },
        },
      ]}
      yAxis={[{ valueFormatter }]}
      series={[{ label: 'Letter Frequency', dataKey: 'frequency', valueFormatter }]}
      {...chartProps}
    />
  );
}

const chartProps = {
  width: 600,
  height: 300,
};
