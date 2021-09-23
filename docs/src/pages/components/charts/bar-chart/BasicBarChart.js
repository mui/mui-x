import * as React from 'react';
import BarChart from '@mui/charts/BarChart';
import { useTheme } from '@mui/material/styles';
import Bar from '@mui/charts/Bar';
import XAxis from '@mui/charts/XAxis';
import YAxis from '@mui/charts/YAxis';
import Grid from '@mui/charts/Grid';

const barData = [
  { x: new Date(2015, 0, 1), y: 4 },
  { x: new Date(2016, 0, 1), y: 14 },
  { x: new Date(2017, 0, 1), y: 36 },
  { x: new Date(2018, 0, 1), y: 38 },
  { x: new Date(2019, 0, 1), y: 54 },
  { x: new Date(2020, 0, 1), y: 47 },
  { x: new Date(2021, 0, 1), y: 70 },
];

export default function BasicBarChart() {
  const theme = useTheme();
  return (
    <BarChart data={barData} xScaleType="time">
      <Grid />
      <XAxis />
      <YAxis suffix="kg" />
      <Bar stroke="rgb(235,97,97)" fill={theme.palette.primary.main} />
    </BarChart>
  );
}
