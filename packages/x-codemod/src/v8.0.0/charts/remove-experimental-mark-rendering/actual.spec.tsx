// @ts-nocheck
import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { LineChart, MarkPlot } from '@mui/x-charts/LineChart';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';

<div>
  <LineChart series={[{}]} experimentalMarkRendering />
  <LineChartPro series={[{}]} experimentalMarkRendering />
  <ChartContainer series={[{}]}>
    <MarkPlot experimentalMarkRendering />
  </ChartContainer>
</div>;
