import type { ChartsBaseSlots } from '@mui/x-charts/models';
import type * as React from 'react';
import type {
  ChartBaseDividerProps,
  ChartBaseMenuItemProps,
  ChartBaseMenuListProps,
  ChartBasePopperProps,
  ChartBaseTooltipProps,
} from './chartBaseSlotProps';
import type {
  BaseDividerPropsOverrides,
  BaseMenuItemPropsOverrides,
  BaseMenuListPropsOverrides,
  BasePopperPropsOverrides,
  BaseTooltipPropsOverrides,
} from '../../models/chartsSlotsComponentsPropsPro';

export interface ChartsBaseSlotsPro extends ChartsBaseSlots {
  /**
   * The component used for dividers.
   * @default Divider
   */
  baseDivider: React.ComponentType<ChartBaseDividerProps & BaseDividerPropsOverrides>;
  /**
   * The component used for menu items.
   */
  baseMenuItem: React.ComponentType<ChartBaseMenuItemProps & BaseMenuItemPropsOverrides>;
  /**
   * The component used for menu lists.
   * @default MenuList
   */
  baseMenuList: React.ComponentType<ChartBaseMenuListProps & BaseMenuListPropsOverrides>;
  /**
   * The component used for poppers.
   */
  basePopper: React.ComponentType<ChartBasePopperProps & BasePopperPropsOverrides>;
  /**
   * The component used for tooltips.
   * @default Tooltip
   */
  baseTooltip: React.ComponentType<ChartBaseTooltipProps & BaseTooltipPropsOverrides>;
}
