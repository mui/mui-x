import * as React from 'react';
import { BarChart, barClasses, barElementClasses } from '@mui/x-charts/BarChart';

const settings = {
  xAxis: [{ data: ['group A', 'group B', 'group C'] }],
  series: [
    { id: 1, data: [4, 3, 5] },
    { id: 2, data: [1, 6, 3] },
    { id: 3, data: [2, 5, 6] },
  ],
  height: 300,
};

export default function BarGradient() {
  return (
    <BarChart
      {...settings}
      sx={{
        [`& .${barClasses.series}[data-series="2"] .${barElementClasses.root}`]: {
          fill: 'url(#gradient)',
        },
      }}
    >
      <defs>
        <linearGradient id="gradient" gradientTransform="rotate(90)">
          <stop offset="5%" stopColor="gold" />
          <stop offset="95%" stopColor="red" />
        </linearGradient>
      </defs>
    </BarChart>
  );
}
