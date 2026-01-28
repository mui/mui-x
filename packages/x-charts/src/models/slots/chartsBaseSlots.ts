import type * as React from 'react';
import { type ChartBaseButtonProps, type ChartBaseIconButtonProps } from './chartsBaseSlotProps';

export interface ChartsBaseSlots {
  baseButton: React.ComponentType<ChartBaseButtonProps>;
  baseIconButton: React.ComponentType<ChartBaseIconButtonProps>;
}
