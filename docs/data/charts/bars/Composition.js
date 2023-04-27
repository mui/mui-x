import * as React from 'react';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';

import { XAxis } from '@mui/x-charts/XAxis';
import { YAxis } from '@mui/x-charts/YAxis';
import { Tooltip } from '@mui/x-charts/Tooltip';

const series = [
  {
    type: 'bar',
    id: 'Eco-1',
    stack: '',
    xAxisKey: 'years',
    yAxisKey: 'eco',
    color: 'red',
    data: [2, 5, 3, 4, 1],
  },
  {
    type: 'bar',
    id: 'Eco-2',
    stack: '',
    xAxisKey: 'years',
    yAxisKey: 'eco',
    color: 'blue',
    data: [5, 6, 2, 8, 9],
  },
  {
    type: 'line',
    id: 'pib',
    xAxisKey: 'years',
    yAxisKey: 'pib',
    data: [1000, 1500, 3000, 5000, 10000],
  },
];

export default function Composition() {
  return (
    <ChartContainer
      series={series}
      width={500}
      height={500}
      xAxis={[
        {
          id: 'years',
          data: [2010, 2011, 2012, 2013, 2014],
          scaleName: 'band',
        },
      ]}
      yAxis={[
        {
          id: 'eco',
          scaleName: 'linear',
        },
        {
          id: 'pib',
          scaleName: 'log',
        },
      ]}
    >
      <BarPlot />
      <LinePlot />
      <XAxis label="Years" position="bottom" axisId="years" />
      <YAxis label="Results" position="left" axisId="eco" />
      <YAxis label="PIB" position="right" axisId="pib" />
      <Tooltip />
    </ChartContainer>
  );
}
