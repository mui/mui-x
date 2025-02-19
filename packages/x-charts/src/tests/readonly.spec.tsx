import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { PieChart } from '@mui/x-charts/PieChart';

const settings = {
  height: 200,
  series: [{ data: [60, -15, 66, 68, 87, 82, 83, 85, 92, 75, 76, 50, 91] }],
  xAxis: [{ position: 'top' }],
  yAxis: [{ data: [1, 2, 3] }],
  margin: { top: 10, bottom: 20 },
} as const;

const scatterSettings = {
  ...settings,
  series: [
    {
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
      ],
    },
  ],
} as const;

const pieSettings = {
  ...settings,
  series: [
    {
      data: [{ value: 10 }, { value: 20 }, { value: 30 }],
    },
  ],
} as const;

export const Component = () => {
  return (
    <React.Fragment>
      <BarChart {...settings} />
      <LineChart {...settings} />
      <ScatterChart {...scatterSettings} />
      <PieChart {...pieSettings} />
    </React.Fragment>
  );
};
