// @ts-nocheck
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarPlot, BarChart } from '@mui/x-charts/BarChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';

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
  <ChartsXAxis
    labelStyle={{
      fontSize: 18
    }}
    tickStyle={{
      fontSize: 20
    }} />
  <ChartsXAxis
    labelStyle={{
      fontWeight: 'bold',
      fontSize: 18
    }}
    tickStyle={{
      fontWeight: 'bold',
      fontSize: 20
    }} />
  <ChartsXAxis
    labelStyle={{
      fontWeight: 'bold',
      fontSize: 10
    }}
    tickStyle={{
      fontWeight: 'bold',
      fontSize: 12
    }} />
  <BarChart
    slotProps={{
      legend: {
        direction: "horizontal"
      }
    }} />
  <BarChart
    slotProps={{
      legend: {
        position: { vertical: 'top', horizontal: 'middle' },
        direction: "vertical"
      }
    }} />
  <BarChart
    slotProps={{
      legend: {
        direction: 'wrong'
      }
    }} />
</div>;
