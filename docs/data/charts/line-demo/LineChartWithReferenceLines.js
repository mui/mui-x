import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function LineChartWithReferenceLines() {
  return (
    <ChartContainer
      width={500}
      height={300}
      series={[
        { data: pData, label: 'pv', type: 'line' },
        { data: uData, label: 'uv', type: 'line' },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
    >
      <LinePlot />
      <MarkPlot />
      <ChartsReferenceLine
        x="Page C"
        label="Max PV PAGE"
        lineStyle={{ stroke: 'red' }}
      />
      <ChartsReferenceLine y={9800} label="Max" lineStyle={{ stroke: 'red' }} />
      <ChartsXAxis />
      <ChartsYAxis />
    </ChartContainer>
  );
}
