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
  /**
   * Note: MUI's `ToggleButton` has an incompatible `href` prop, so it must be cast:
   * `ToggleButton as unknown as React.ComponentType<ChartBaseToggleButtonProps>`.
   */
  baseToggleButton: React.ComponentType<ChartBaseToggleButtonProps>;
  baseToggleButtonGroup: React.ComponentType<ChartBaseToggleButtonGroupProps>;
}
