import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function GradientBar() {
  return (
    <BarChart
      sx={{
        '--my-custom-gradient': 'url(#Gradient)',
      }}
      series={[
        {
          label: 'series A',
          data: [50],
        },
        {
          label: 'series B',
          data: [100],
          color: 'var(--my-custom-gradient, #123456)',
        },
      ]}
      width={400}
      height={200}
    >
      <linearGradient id="Gradient" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#123456" />
        <stop offset="1" stopColor="#81b2e4" />
      </linearGradient>
    </BarChart>
  );
}
