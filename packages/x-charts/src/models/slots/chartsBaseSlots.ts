import type * as React from 'react';
import { ChartBaseIconButtonProps, ChartBaseTooltipProps } from './chartsBaseSlotProps';

export interface ChartsBaseSlots {
  baseTooltip: React.ComponentType<ChartBaseTooltipProps>;
  baseIconButton: React.ComponentType<ChartBaseIconButtonProps>;
}
