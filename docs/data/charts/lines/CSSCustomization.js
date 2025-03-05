import * as React from 'react';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';
import { dataset } from './GDPperCapita';

export default function CSSCustomization() {
  return (
    <LineChart
      dataset={dataset}
      sx={{
        [`& .${lineElementClasses.root}`]: {
          strokeDasharray: '10 5',
          strokeWidth: 4,
        },
        '& .MuiAreaElement-series-Germany': {
          fill: "url('#myGradient')",
          filter: 'none', // Remove the default filtering
        },
      }}
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
          width: 60,
        },
      ]}
      series={[
        {
          id: 'France',
          dataKey: 'fr',
          stack: 'total',
          area: true,
          showMark: false,
        },
        {
          id: 'Germany',
          dataKey: 'dl',
          stack: 'total',
          area: true,
          showMark: false,
        },
        {
          id: 'United Kingdom',
          dataKey: 'gb',
          stack: 'total',
          area: true,
          showMark: false,
        },
      ]}
      height={300}
    >
      <defs>
        <linearGradient id="myGradient" gradientTransform="rotate(90)">
          <stop offset="5%" stopColor="gold" />
          <stop offset="95%" stopColor="red" />
        </linearGradient>
      </defs>
    </LineChart>
  );
}
