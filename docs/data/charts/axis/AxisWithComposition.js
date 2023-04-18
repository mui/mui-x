import * as React from 'react';
import { ChartContainer, BarPlot, LinePlot, XAxis, YAxis } from '@mui/x-charts';

export default function AxisWithComposition() {
  return (
    <ChartContainer
      xAxis={[
        {
          scaleName: 'band',
          data: ['Q1', 'Q2', 'Q3', 'Q4'],
          id: 'quaters',
        },
      ]}
      yAxis={[{ id: 'money' }, { id: 'quantites' }]}
      series={[
        {
          type: 'line',
          id: 'revenue',
          xAxisKey: 'quaters',
          yAxisKey: 'money',
          data: [5645, 7542, 9135, 12221],
        },
        {
          type: 'bar',
          id: 'cookies',
          xAxisKey: 'quaters',
          yAxisKey: 'quantites',
          data: [3205, 2542, 3135, 8374],
        },
        {
          type: 'bar',
          id: 'icecream',
          xAxisKey: 'quaters',
          yAxisKey: 'quantites',
          data: [1645, 5542, 5146, 3735],
        },
      ]}
      width={600}
      height={500}
    >
      <BarPlot />
      <LinePlot />
      <XAxis axisId="quaters" label="2021 quaters" labelFontSize={18} />
      <YAxis axisId="quantites" label="# unit sold" />
      <YAxis axisId="money" position="right" label="revenu" />
    </ChartContainer>
  );
}
