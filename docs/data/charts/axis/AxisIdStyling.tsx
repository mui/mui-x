import * as React from 'react';
import { LineChart, type LineChartProps } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const years = [2010, 2011, 2012, 2013, 2014, 2015];
const revenue = [4000, 3000, 2000, 2780, 1890, 2390];
const profit = [24, 13, 98, 39, 48, 38];

const chartConfig: LineChartProps = {
  xAxis: [{ data: years, scaleType: 'point' }],
  yAxis: [
    { id: 'revenue-axis', label: 'Revenue ($)' },
    { id: 'profit-axis', label: 'Profit (%)', position: 'right' },
  ],
  series: [
    { data: revenue, label: 'Revenue', yAxisId: 'revenue-axis', color: '#02b2af' },
    { data: profit, label: 'Profit', yAxisId: 'profit-axis', color: '#2e96ff' },
  ],
  height: 300,
};

export default function AxisIdStyling() {
  return (
    <LineChart
      sx={{
        // Style the axis with id "revenue-axis"
        [`& .${axisClasses.root}[data-axis-id="revenue-axis"] .${axisClasses.label}`]:
          {
            fill: '#02b2af',
          },
        // Style the axis with id "profit-axis"
        [`& .${axisClasses.root}[data-axis-id="profit-axis"] .${axisClasses.label}`]:
          {
            fill: '#2e96ff',
          },
      }}
      {...chartConfig}
    />
  );
}
