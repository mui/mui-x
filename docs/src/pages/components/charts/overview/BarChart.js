import * as React from 'react';
import BarChart from '@mui/charts/BarChart';
import Bar from '@mui/charts/Bar';
import XAxis from '@mui/charts/XAxis';
import YAxis from '@mui/charts/YAxis';
import Grid from '@mui/charts/Grid';

const stackData = [
  { month: new Date(2021, 1, 1), apples: 10, bananas: 20, oranges: 15 },
  { month: new Date(2021, 2, 1), apples: 15, bananas: 15, oranges: 15 },
  { month: new Date(2021, 3, 1), apples: 20, bananas: 25, oranges: 15 },
  { month: new Date(2021, 4, 1), apples: 20, bananas: 20, oranges: 15 },
];
export default function StackedAreaChart() {
  return (
    <BarChart
      areaKeys={['apples', 'bananas', 'oranges']}
      data={stackData}
      stacked
      xScaleType="time"
      xKey="month"
      xDomain={[new Date(2021, 1, 1), new Date(2021, 4, 1)]}
      yDomain={[0, 60]}
    >
      <Grid disableX />
      <XAxis />
      <YAxis suffix="cm" disableLine disableTicks />
      <Bar
        series={2}
        fill="rgba(234,95,95,0.5)"
      />
      <Bar
        series={1}
        fill="rgba(150,219,124,0.5)"
      />
      <Bar
        series={0}
        fill="rgba(116,205,240,0.5)"
      />
    </BarChart>
  );
}
