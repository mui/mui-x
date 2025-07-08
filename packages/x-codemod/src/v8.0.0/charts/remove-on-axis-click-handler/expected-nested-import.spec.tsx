// @ts-nocheck
import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';

// prettier-ignore
<ChartContainer onAxisClick={onAxisClick}>
  {/* ... */}

  <BarPlot onItemClick={onItemClick} />
</ChartContainer>
