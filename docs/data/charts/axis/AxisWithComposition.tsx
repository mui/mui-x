import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ResponsiveChartContainer,
  BarPlot,
  LinePlot,
  ChartsXAxis,
  ChartsYAxis,
  axisClasses,
} from '@mui/x-charts';

export default function AxisWithComposition() {
  return (
    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <ResponsiveChartContainer
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
        height={400}
        margin={{ left: 70, right: 70 }}
        sx={{
          [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'rotate(-90deg) translate(0px, -20px)',
          },
          [`.${axisClasses.right} .${axisClasses.label}`]: {
            transform: 'rotate(90deg) translate(0px, -25px)',
          },
        }}
      >
        <BarPlot />
        <LinePlot />
        <ChartsXAxis axisId="quarters" label="2021 quarters" labelFontSize={18} />
        <ChartsYAxis axisId="quantities" label="# units sold" />
        <ChartsYAxis axisId="money" position="right" label="revenue" />
      </ResponsiveChartContainer>
    </Box>
  );
}
