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
        },
      }}
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
      margin={{ left: 60, top: 10, right: 20 }}
      width={600}
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
