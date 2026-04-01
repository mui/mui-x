import type * as React from 'react';
import {
  type ChartBaseButtonProps,
  type ChartBaseIconButtonProps,
  type ChartBaseToggleButtonProps,
  type ChartBaseToggleButtonGroupProps,
} from './chartsBaseSlotProps';

export interface ChartsBaseSlots {
  baseButton: React.ComponentType<ChartBaseButtonProps>;
  baseIconButton: React.ComponentType<ChartBaseIconButtonProps>;
  baseToggleButton: React.ComponentType<ChartBaseToggleButtonProps>;
  baseToggleButtonGroup: React.ComponentType<ChartBaseToggleButtonGroupProps>;
}
