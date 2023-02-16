import * as React from 'react';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot } from '@mui/x-charts/LineChart';
import { Stack } from '@mui/material';
import ChartContainer from '@mui/x-charts/ChartContainer';
import XAxis from '@mui/x-charts/XAxis/XAxis';
import YAxis from '@mui/x-charts/YAxis/YAxis';

export default function TestBars() {
  return (
    <Stack direction="column" spacing={5}>
      <ChartContainer
        xAxis={[
          {
            id: 'barCategories',
            data: [2, 5, 20, 23, 25],
            scale: 'band',
          },
        ]}
        series={[
          {
            type: 'bar',
            id: 's1',
            xAxisKey: 'barCategories',
            data: [2, 5, 3, 4, 1],
          },
          {
            type: 'bar',
            id: 's1',
            xAxisKey: 'barCategories',
            data: [10, 3, 1, 2, 10],
          },
        ]}
        width={600}
        height={500}
      >
        <BarPlot />
        <XAxis label="Bottom X axis" position="bottom" axisId="barCategories" />
        <YAxis label="Left Y axis" position="left" />
        <YAxis label="Right Y axis" position="right" />
      </ChartContainer>

      <ChartContainer
        xAxis={[
          {
            id: 'barCategories',
            data: [2, 5, 20, 23, 25],
          },
        ]}
        series={[
          {
            type: 'line',
            id: 's1',
            xAxisKey: 'barCategories',
            data: [2, 5, 3, 4, 1],
          },
          {
            type: 'line',
            id: 's1',
            xAxisKey: 'barCategories',
            data: [10, 3, 1, 2, 10],
          },
        ]}
        width={600}
        height={500}
      >
        <LinePlot />
        <XAxis label="Bottom X axis" position="bottom" axisId="barCategories" />
        <YAxis label="Left Y axis" position="left" />
        <YAxis label="Right Y axis" position="right" />
      </ChartContainer>
    </Stack>
  );
}
