import * as React from 'react';
import { barElementClasses } from '@mui/x-charts/BarChart';
import {
  BarChartPremium,
  rangeBarClasses,
} from '@mui/x-charts-premium/BarChartPremium';

const settings = {
  xAxis: [{ data: ['group A', 'group B', 'group C'] }],
  series: [
    {
      type: 'rangeBar',
      id: '1',
      data: [
        [4, 3],
        [5, 8],
        [2, 4],
      ],
    },
    {
      type: 'rangeBar',
      id: '2',
      data: [
        [1, 6],
        [5, 6],
        [3, 9],
      ],
    },
    {
      type: 'rangeBar',
      id: '3',
      data: [
        [1, 5],
        [2, 4],
        [3, 8],
      ],
    },
  ],
  height: 300,
  margin: { left: 0 },
};

export default function RangeBarGradient() {
  return (
    <BarChartPremium
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
    </BarChartPremium>
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
