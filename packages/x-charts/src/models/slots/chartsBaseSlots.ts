import type * as React from 'react';
import type {
  ChartBaseButtonProps,
  ChartBaseIconButtonProps,
  ChartBaseToggleButtonProps,
  ChartBaseToggleButtonGroupProps,
} from './chartsBaseSlotProps';
import type {
  BaseButtonPropsOverrides,
  BaseIconButtonPropsOverrides,
  BaseToggleButtonPropsOverrides,
  BaseToggleButtonGroupPropsOverrides,
} from '../chartsSlotsComponentsProps';

export interface ChartsBaseSlots {
  baseButton: React.ComponentType<ChartBaseButtonProps & BaseButtonPropsOverrides>;
  baseIconButton: React.ComponentType<ChartBaseIconButtonProps & BaseIconButtonPropsOverrides>;
  /**
   * Note: MUI's `ToggleButton` has an incompatible `href` prop, so it must be cast:
   * `ToggleButton as unknown as React.ComponentType<ChartBaseToggleButtonProps & BaseToggleButtonPropsOverrides>`.
   */
  baseToggleButton: React.ComponentType<
    ChartBaseToggleButtonProps & BaseToggleButtonPropsOverrides
  >;
  baseToggleButtonGroup: React.ComponentType<
    ChartBaseToggleButtonGroupProps & BaseToggleButtonGroupPropsOverrides
  >;
}
