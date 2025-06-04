import * as React from 'react';
import {
  ChartBaseButtonProps,
  ChartBaseDividerProps,
  ChartBaseIconButtonProps,
} from './chartsBaseSlotProps';

export interface ChartsBaseSlots {
  baseButton: React.ComponentType<ChartBaseButtonProps>;
  baseIconButton: React.ComponentType<ChartBaseIconButtonProps>;
  baseDivider: React.ComponentType<ChartBaseDividerProps>;
}
