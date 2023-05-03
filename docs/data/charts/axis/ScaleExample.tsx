import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function ScaleExample() {
  return (
    <LineChart
      xAxis={[
        {
          id: 'x',
          data: [1, 10, 30, 50, 70, 90, 100],
        },
      ]}
      yAxis={[
        {
          id: 'linearAxis',
          scaleType: 'linear',
          max: 110,
        },
        {
          id: 'logAxis',
          scaleType: 'log',
          max: 110,
        },
      ]}
      series={[
        {
          id: 'linear',
          yAxisKey: 'linearAxis',
          data: [1, 10, 30, 50, 70, 90, 100],
        },
        {
          id: 'log',
          yAxisKey: 'logAxis',
          data: [1, 10, 30, 50, 70, 90, 100],
        },
      ]}
      leftAxis="linearAxis"
      rightAxis="logAxis"
      width={600}
      height={500}
    />
  );
}
