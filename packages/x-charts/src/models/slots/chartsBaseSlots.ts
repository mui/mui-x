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
  /**
   * The component used for buttons.
   * @default Button
   */
  baseButton: React.ComponentType<ChartBaseButtonProps & BaseButtonPropsOverrides>;
  /**
   * The component used for icon buttons.
   * @default IconButton
   */
  baseIconButton: React.ComponentType<ChartBaseIconButtonProps & BaseIconButtonPropsOverrides>;
  /**
   * Note: MUI's `ToggleButton` has an incompatible `href` prop, so it must be cast:
   * `ToggleButton as unknown as React.ComponentType<ChartBaseToggleButtonProps & BaseToggleButtonPropsOverrides>`.
   */
  baseToggleButton: React.ComponentType<
    ChartBaseToggleButtonProps & BaseToggleButtonPropsOverrides
  >;
  /**
   * The component used for toggle button groups.
   * @default ToggleButtonGroup
   */
  baseToggleButtonGroup: React.ComponentType<
    ChartBaseToggleButtonGroupProps & BaseToggleButtonGroupPropsOverrides
  >;
}
