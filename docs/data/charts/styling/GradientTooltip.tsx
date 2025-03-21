import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function GradientTooltip() {
  return (
    <BarChart
      series={[
        {
          label: 'series A',
          data: [50],
          color: 'url(#Pattern)',
        },
        {
          label: 'series B',
          data: [100],
          color: 'url(#Gradient)',
        },
      ]}
      height={200}
    >
      <linearGradient id="Gradient" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0" stopColor="#123456" />
        <stop offset="1" stopColor="#81b2e4" />
      </linearGradient>
      <pattern
        id="Pattern"
        patternUnits="userSpaceOnUse"
        width="20"
        height="40"
        patternTransform="scale(0.5)"
      >
        <rect x="0" y="0" width="100%" height="100%" fill="#123456" />
        <path
          d="M0 30h20L10 50zm-10-20h20L0 30zm20 0h20L20 30zM0-10h20L10 10z"
          strokeWidth="1"
          stroke="#81b2e4"
          fill="none"
        />
      </pattern>
    </BarChart>
  );
}
