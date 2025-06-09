import { ChartsBaseSlots } from '@mui/x-charts/models';
import * as React from 'react';
import { ChartBaseTooltipProps } from './chartBaseSlotProps';

export interface ChartsBaseSlotsPro extends ChartsBaseSlots {
  baseTooltip: React.ComponentType<ChartBaseTooltipProps>;
}
