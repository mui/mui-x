import * as React from 'react';
import LineChart from '@mui/charts/LineChart';
import Line from '@mui/charts/Line';
import XAxis from '@mui/charts/XAxis';
import YAxis from '@mui/charts/YAxis';
import Grid from '@mui/charts/Grid';

export default function StackedAreaChart() {
  return (
    <LineChart
      areaKeys={['open', 'close']}
      data={stackData}
      smoothed
      stacked
      xScaleType="time"
      xKey="date"
      xDomain={[new Date(2020, 1, 1), new Date(2022, 10, 10)]}
      yDomain={[0, 500]}
    >
      <Grid disableX />
      <XAxis />
      <YAxis />
      <Line
        series={1}
        stroke="rgb(150,219,124)"
        fill="rgba(150,219,124,0.5)"
        strokeWidth={2}
      />
      <Line
        series={0}
        stroke="rgb(116,205,240)"
        fill="rgba(116,205,240,0.5)"
        strokeWidth={2}
      />
    </LineChart>
  );
}

const stackData = [{ date: new Date(2020, 1, 1), open: 122, close: 104 },
  { date: new Date(2020, 1, 1), open: 121, close: 70 },
  { date: new Date(2020, 2, 1), open: 101, close: 55 },
  { date: new Date(2020, 3, 1), open: 103, close: 45 },
  { date: new Date(2020, 4, 1), open: 153, close: 85 },
  { date: new Date(2020, 5, 1), open: 150, close: 116 },
  { date: new Date(2020, 6, 1), open: 135, close: 153 },
  { date: new Date(2020, 7, 1), open: 98, close: 152 },
  { date: new Date(2020, 8, 1), open: 101, close: 192 },
  { date: new Date(2020, 9, 1), open: 110, close: 225 },
  { date: new Date(2020, 10, 1), open: 157, close: 233 },
  { date: new Date(2020, 11, 1), open: 128, close: 232 },
  { date: new Date(2020, 12, 1), open: 101, close: 235 },
  { date: new Date(2021, 1, 1), open: 109, close: 200 },
  { date: new Date(2021, 2, 1), open: 142, close: 214 },
  { date: new Date(2021, 3, 1), open: 123, close: 224 },
  { date: new Date(2021, 4, 1), open: 99, close: 176 },
  { date: new Date(2021, 5, 1), open: 100, close: 172 },
  { date: new Date(2021, 6, 1), open: 67, close: 138 },
  { date: new Date(2021, 7, 1), open: 81, close: 127 },
  { date: new Date(2021, 8, 1), open: 39, close: 137 },
  { date: new Date(2021, 9, 1), open: 73, close: 127 },
  { date: new Date(2021, 10, 1), open: 78, close: 154 },
  { date: new Date(2021, 11, 1), open: 116, close: 127 },
  { date: new Date(2021, 12, 1), open: 136, close: 78 },
  { date: new Date(2022, 1, 1), open: 139, close: 61 },
  { date: new Date(2022, 1, 1), open: 162, close: 13 },
  { date: new Date(2022, 2, 1), open: 201, close: 41 },
  { date: new Date(2022, 3, 1), open: 221, close: 72 },
  { date: new Date(2022, 4, 1), open: 257, close: 87 },
  { date: new Date(2022, 5, 1), open: 211, close: 114 },
  { date: new Date(2022, 6, 1), open: 233, close: 138 },
  { date: new Date(2022, 7, 1), open: 261, close: 141 },
  { date: new Date(2022, 8, 1), open: 279, close: 130 }
  ]