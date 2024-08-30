import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { dataset } from './GDPperCapita';

export default function StackedAreas() {
  return (
    <LineChart
      dataset={dataset}
      xAxis={[
        {
          id: 'Years',
          dataKey: 'date',
          scaleType: 'time',
          valueFormatter: (date) => date.getFullYear().toString(),
        },
      ]}
      series={[
        {
          id: 'France',
          label: 'French GDP per capita',
          dataKey: 'fr',
          stack: 'total',
          area: true,
          showMark: false,
        },
        {
          id: 'Germany',
          label: 'German GDP per capita',
          dataKey: 'dl',
          stack: 'total',
          area: true,
          showMark: false,
        },
        {
          id: 'United Kingdom',
          label: 'UK GDP per capita',
          dataKey: 'gb',
          stack: 'total',
          area: true,
          showMark: false,
        },
      ]}
      width={600}
      height={400}
      margin={{ left: 70 }}
    />
  );
}
