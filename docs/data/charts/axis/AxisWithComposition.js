import * as React from 'react';
import {
  ChartContainer,
  BarPlot,
  LinePlot,
  ChartsXAxis,
  ChartsYAxis,
  axisClasses,
} from '@mui/x-charts';

export default function AxisWithComposition() {
  return (
    <ChartContainer
      xAxis={[
        {
          scaleType: 'band',
          data: ['Q1', 'Q2', 'Q3', 'Q4'],
          id: 'quarters',
          label: 'Quarters',
        },
      ]}
      yAxis={[{ id: 'money' }, { id: 'quantities' }]}
      series={[
        {
          type: 'line',
          id: 'revenue',
          yAxisKey: 'money',
          data: [5645, 7542, 9135, 12221],
        },
        {
          type: 'bar',
          id: 'cookies',
          yAxisKey: 'quantities',
          data: [3205, 2542, 3135, 8374],
        },
        {
          type: 'bar',
          id: 'icecream',
          yAxisKey: 'quantities',
          data: [1645, 5542, 5146, 3735],
        },
      ]}
      width={600}
      height={500}
      margin={{ left: 70, right: 70 }}
      sx={{
        [`.${axisClasses.left} .${axisClasses.label}`]: {
          transform: 'rotate(-90deg) translate(0px, -20px)',
        },
        [`.${axisClasses.right} .${axisClasses.label}`]: {
          transform: 'rotate(90deg) translate(0px, -20px)',
        },
      }}
    >
      <BarPlot />
      <LinePlot />
      <ChartsXAxis axisId="quarters" label="2021 quarters" labelFontSize={18} />
      <ChartsYAxis axisId="quantities" label="# units sold" />
      <ChartsYAxis axisId="money" position="right" label="revenu" />
    </ChartContainer>
  );
}
