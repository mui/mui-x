// @ts-nocheck
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarPlot, BarChart } from '@mui/x-charts/BarChart';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';

// prettier-ignore
<div>
  <PieChart legend={{ hidden: true }} />
  <PieChart legend={{ hidden: true }} slotProps={{ tooltip: { trigger: 'axis' } }} />
  <ResponsiveChartContainer>
    <BarPlot />
  </ResponsiveChartContainer>
  <ChartsXAxis labelFontSize={18} tickFontSize={20} />
  <ChartsXAxis
    labelFontSize={18}
    tickFontSize={20}
    labelStyle={{ fontWeight: 'bold' }}
    tickStyle={{ fontWeight: 'bold' }}
  />
  <ChartsXAxis
    labelFontSize={18}
    tickFontSize={20}
    labelStyle={{ fontWeight: 'bold', fontSize: 10 }}
    tickStyle={{ fontWeight: 'bold', fontSize: 12 }}
  />
  <BarChart slotProps={{ legend: { direction: 'row' } }} />
  <BarChart slotProps={{ legend: { direction: 'column', position: { vertical: 'top', horizontal: 'middle' } } }} />
  <BarChart slotProps={{ legend: { direction: 'wrong' } }} />
</div>;
