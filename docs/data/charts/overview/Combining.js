import * as React from 'react';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';

import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';

const series = [
  {
    type: 'bar',
    stack: '',
    yAxisKey: 'eco',
    data: [2, 5, 3, 4, 1],
  },
  {
    type: 'bar',
    stack: '',
    yAxisKey: 'eco',
    data: [5, 6, 2, 8, 9],
  },
  {
    type: 'line',
    yAxisKey: 'pib',
    color: 'red',
    data: [1000, 1500, 3000, 5000, 10000],
  },
];

export default function Combining() {
  return (
    <ChartContainer
      series={series}
      width={500}
      height={400}
      xAxis={[
        {
          id: 'years',
          data: [2010, 2011, 2012, 2013, 2014],
          scaleType: 'band',
          valueFormatter: (value) => value.toString(),
        },
      ]}
      yAxis={[
        {
          id: 'eco',
          scaleType: 'linear',
        },
        {
          id: 'pib',
          scaleType: 'log',
        },
      ]}
    >
      <BarPlot />
      <LinePlot />
      <ChartsXAxis label="Years" position="bottom" axisId="years" />
      <ChartsYAxis label="Results" position="left" axisId="eco" />
      <ChartsYAxis label="PIB" position="right" axisId="pib" />
    </ChartContainer>
  );
}
