import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const settings = {
  height: 200,
  hideLegend: true,
};

export default function BarGradientUserSpace() {
  return (
    <BarChart
      {...settings}
      series={[
        {
          label: 'series A',
          data: [50],
          color: 'url(#gradient)',
        },
        {
          label: 'series B',
          data: [100],
          color: 'url(#gradient)',
        },
      ]}
    >
      <linearGradient
        id="gradient"
        x1="0%"
        y1="100%"
        x2="0%"
        y2="0%"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="red" />
        <stop offset="1" stopColor="green" />
      </linearGradient>
    </BarChart>
  );
}
