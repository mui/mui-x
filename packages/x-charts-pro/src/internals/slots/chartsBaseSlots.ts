import { type ChartsBaseSlots } from '@mui/x-charts/models';
import type * as React from 'react';
import {
  type ChartBaseDividerProps,
  type ChartBaseMenuItemProps,
  type ChartBaseMenuListProps,
  type ChartBasePopperProps,
  type ChartBaseTooltipProps,
} from './chartBaseSlotProps';
import {
  type BaseDividerPropsOverrides,
  type BaseMenuItemPropsOverrides,
  type BaseMenuListPropsOverrides,
  type BasePopperPropsOverrides,
  type BaseTooltipPropsOverrides,
} from '../../models/chartsSlotsComponentsPropsPro';

export interface ChartsBaseSlotsPro extends ChartsBaseSlots {
  baseDivider: React.ComponentType<ChartBaseDividerProps & BaseDividerPropsOverrides>;
  baseMenuItem: React.ComponentType<ChartBaseMenuItemProps & BaseMenuItemPropsOverrides>;
  baseMenuList: React.ComponentType<ChartBaseMenuListProps & BaseMenuListPropsOverrides>;
  basePopper: React.ComponentType<ChartBasePopperProps & BasePopperPropsOverrides>;
  baseTooltip: React.ComponentType<ChartBaseTooltipProps & BaseTooltipPropsOverrides>;
}
