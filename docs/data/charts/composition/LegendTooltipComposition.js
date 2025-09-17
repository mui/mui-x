import * as React from 'react';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import {
  LinePlot,
  MarkPlot,
  lineElementClasses,
  markElementClasses,
} from '@mui/x-charts/LineChart';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';

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

export default function LegendTooltipComposition() {
  return (
    <ChartDataProvider
      width={500}
      height={300}
      series={[{ type: 'line', data: pData, label: 'Sales Data' }]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
      margin={{ top: 40, right: 20, bottom: 20, left: 10 }}
    >
      <ChartsLegend />
      <ChartsTooltip />
      <ChartsSurface
        sx={{
          [`& .${lineElementClasses.root}`]: {
            stroke: '#8884d8',
            strokeWidth: 2,
          },
          [`& .${markElementClasses.root}`]: {
            stroke: '#8884d8',
            r: 4,
            fill: '#fff',
            strokeWidth: 2,
          },
        }}
      >
        <ChartsXAxis />
        <ChartsYAxis />
        <LinePlot />
        <MarkPlot />
        <ChartsAxisHighlight x="line" />
      </ChartsSurface>
    </ChartDataProvider>
  );
}
