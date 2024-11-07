// @ts-nocheck
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';

// prettier-ignore
<div>
  <PieChart legend={{ hidden: true }} />
  <PieChart legend={{ hidden: true }} slotProps={{ tooltip: { trigger: 'axis' } }} />
  <ResponsiveChartContainer>
    <BarPlot />
  </ResponsiveChartContainer>
</div>;
