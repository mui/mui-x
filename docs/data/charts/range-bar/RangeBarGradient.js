import * as React from 'react';
import { barElementClasses } from '@mui/x-charts/BarChart';
import { BarChartPro, rangeBarClasses } from '@mui/x-charts-pro/BarChartPro';

const settings = {
  xAxis: [{ data: ['group A', 'group B', 'group C'] }],
  series: [
    {
      type: 'rangeBar',
      id: '1',
      data: [
        { start: 4, end: 3 },
        { start: 5, end: 8 },
        { start: 2, end: 4 },
      ],
    },
    {
      type: 'rangeBar',
      id: '2',
      data: [
        { start: 1, end: 6 },
        { start: 5, end: 6 },
        { start: 3, end: 9 },
      ],
    },
    {
      type: 'rangeBar',
      id: '3',
      data: [
        { start: 1, end: 5 },
        { start: 2, end: 4 },
        { start: 3, end: 8 },
      ],
    },
  ],
  height: 300,
  margin: { left: 0 },
};

export default function RangeBarGradient() {
  return (
    <BarChartPro
      {...settings}
      sx={{
        [`& .${rangeBarClasses.series}[data-series="2"] .${barElementClasses.root}`]:
          {
            fill: 'url(#bar-gradient)',
          },
      }}
    >
      <defs>
        <Gradient id="bar-gradient" />
      </defs>
    </BarChartPro>
  );
}

function Gradient(props) {
  return (
    <linearGradient gradientTransform="rotate(90)" {...props}>
      <stop offset="5%" stopColor="gold" />
      <stop offset="95%" stopColor="red" />
    </linearGradient>
  );
}
