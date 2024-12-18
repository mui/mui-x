import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { PiecewiseColorLegend } from '@mui/x-charts/ChartsLegend';
import Stack from '@mui/material/Stack';
import { dataset } from './tempAnomaly';

const data = {
  dataset,
  series: [
    {
      label: 'Global temperature anomaly relative to 1961-1990',
      dataKey: 'anomaly',
      showMark: false,
      valueFormatter: (value) => `${value?.toFixed(2)}°`,
    },
  ],
  xAxis: [
    {
      scaleType: 'time',
      dataKey: 'year',
      disableLine: true,
      valueFormatter: (value) => value.getFullYear().toString(),
      colorMap: {
        type: 'piecewise',
        thresholds: [new Date(1961, 0, 1), new Date(1990, 0, 1)],
        colors: ['blue', 'gray', 'red'],
      },
    },
  ],
  yAxis: [
    {
      disableLine: true,
      disableTicks: true,
      valueFormatter: (value) => `${value}°`,
    },
  ],
  grid: { horizontal: true },
  height: 300,
  margin: { top: 20, right: 20 },
};

export default function VeryBasicColorLegend() {
  return (
    <Stack width={'100%'}>
      <LineChart
        {...data}
        xAxis={[
          {
            ...data.xAxis[0],
            colorMap: {
              type: 'piecewise',
              thresholds: [new Date(1961, 0, 1), new Date(1990, 0, 1)],
              colors: ['blue', 'gray', 'red'],
            },
          },
        ]}
        slots={{ legend: PiecewiseColorLegend }}
        slotProps={{ legend: { axisDirection: 'x' } }}
      />
    </Stack>
  );
}
