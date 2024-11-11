// @ts-nocheck
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';

// prettier-ignore
<div>
  <PieChart
    slotProps={{
      legend: { hidden: true }
    }} />
  <PieChart
    slotProps={{
      tooltip: { trigger: 'axis' },
      legend: { hidden: true }
    }} />
  <ChartContainer>
    <BarPlot />
  </ChartContainer>
</div>;
