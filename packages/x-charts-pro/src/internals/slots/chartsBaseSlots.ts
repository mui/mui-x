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
  baseDivider: React.ComponentType<ChartBaseDividerProps & BaseDividerPropsOverrides>;
  baseMenuItem: React.ComponentType<ChartBaseMenuItemProps & BaseMenuItemPropsOverrides>;
  baseMenuList: React.ComponentType<ChartBaseMenuListProps & BaseMenuListPropsOverrides>;
  basePopper: React.ComponentType<ChartBasePopperProps & BasePopperPropsOverrides>;
  baseTooltip: React.ComponentType<ChartBaseTooltipProps & BaseTooltipPropsOverrides>;
}
