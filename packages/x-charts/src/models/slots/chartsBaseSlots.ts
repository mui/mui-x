import * as React from 'react';
import { ChartBaseButtonProps, ChartBaseIconButtonProps } from './chartsBaseSlotProps';

export interface ChartsBaseSlots {
  baseButton: React.ComponentType<ChartBaseButtonProps>;
  baseIconButton: React.ComponentType<ChartBaseIconButtonProps>;
}
