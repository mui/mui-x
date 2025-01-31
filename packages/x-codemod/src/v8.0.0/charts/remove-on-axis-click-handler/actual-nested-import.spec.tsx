// @ts-nocheck
import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsOnAxisClickHandler } from '@mui/x-charts/ChartsOnAxisClickHandler';
import { BarPlot } from '@mui/x-charts/BarChart';

// prettier-ignore
<ChartContainer>
  {/* ... */}
  <ChartsOnAxisClickHandler onAxisClick={onAxisClick} />
  <BarPlot onItemClick={onItemClick} />
</ChartContainer>
