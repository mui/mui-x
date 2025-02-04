// @ts-nocheck
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarPlot, BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { ChartsOnAxisClickHandler } from '@mui/x-charts/ChartsOnAxisClickHandler';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { LegendPosition } from '@mui/x-charts/ChartsLegend';

// prettier-ignore
<div>
  <PieChart legend={{ hidden: true }} />
  <PieChart legend={{ hidden: true }} slotProps={{ tooltip: { trigger: 'axis' } }} />
  <ResponsiveChartContainer>
    <ChartsOnAxisClickHandler onAxisClick={onAxisClickHandler} />
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
  <LineChart series={[{}]} experimentalMarkRendering />
  <BarChart slotProps={{ legend: { direction: 'row' } }} />
  <BarChart slotProps={{ legend: { direction: 'column', position: { vertical: 'top', horizontal: 'middle' } } }} />
  <BarChart slotProps={{ legend: { direction: 'wrong' } }} />
  <BarChart legend={{  position: { vertical: 'middle', horizontal: 'left' } }} />
  <BarChart slotProps={{ legend: { position: { vertical: 'top', horizontal: 'middle' } } }} />
  <BarChart slotProps={{ legend: { position: { vertical: 'bottom', horizontal: 'right' } } }} />
  <BarChart slotProps={{ legend: { position: { vertical: 'wrong', horizontal: 'wrong' } } }} />
</div>;
