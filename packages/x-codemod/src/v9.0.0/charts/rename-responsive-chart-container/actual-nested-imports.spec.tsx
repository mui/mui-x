/* eslint-disable no-restricted-imports */
import * as React from 'react';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { ResponsiveChartContainerPro } from '@mui/x-charts-pro/ResponsiveChartContainerPro';
import { BarPlot } from '@mui/x-charts-pro';

<div>
  <ResponsiveChartContainer series={[]}>
    <BarPlot />
  </ResponsiveChartContainer>
  <ResponsiveChartContainerPro series={[]}>
    <BarPlot />
  </ResponsiveChartContainerPro>
</div>;
