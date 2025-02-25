import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { dataset } from './GDPperCapita';

export default function StackedAreas() {
  return (
    <div>
      <LineChart
        dataset={dataset}
        xAxis={[
          {
            id: 'Years',
            dataKey: 'date',
            scaleType: 'time',
            min: new Date(1990, 0, 1),
            max: new Date(2018, 0, 1),
            valueFormatter: (date) => date.getFullYear().toString(),
          },
        ]}
        yAxis={[
          {
            width: 70,
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
        height={400}
      />
    </div>
  );
}
