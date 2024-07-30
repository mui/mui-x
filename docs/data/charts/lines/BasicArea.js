import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { dataset } from './basicDataset';

export default function BasicArea() {
  return (
    <LineChart
      dataset={dataset}
      xAxis={[{ dataKey: 'x' }]}
      series={[
        {
          dataKey: 'y',
          area: true,
        },
      ]}
      width={500}
      height={300}
    />
  );
}
