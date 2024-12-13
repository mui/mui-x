/* eslint-disable no-restricted-imports */
import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartContainerPro } from '@mui/x-charts-pro/ChartContainerPro';
import { BarPlot } from '@mui/x-charts-pro';

<div>
  <ChartContainer series={[]}>
    <BarPlot />
  </ChartContainer>
  <ChartContainerPro series={[]}>
    <BarPlot />
  </ChartContainerPro>
</div>;
