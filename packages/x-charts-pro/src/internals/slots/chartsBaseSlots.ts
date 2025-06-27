import { ChartsBaseSlots } from '@mui/x-charts/models';
import * as React from 'react';
import {
  ChartBaseDividerProps,
  ChartBaseMenuItemProps,
  ChartBaseMenuListProps,
  ChartBasePopperProps,
  ChartBaseTooltipProps,
} from './chartBaseSlotProps';

export interface ChartsBaseSlotsPro extends ChartsBaseSlots {
  baseDivider: React.ComponentType<ChartBaseDividerProps & ChartBaseDividerPropsOverrides>;
  baseMenuItem: React.ComponentType<ChartBaseMenuItemProps & ChartBaseMenuItemPropsOverrides>;
  baseMenuList: React.ComponentType<ChartBaseMenuListProps & ChartBaseMenuListPropsOverrides>;
  basePopper: React.ComponentType<ChartBasePopperProps & ChartBasePopperPropsOverrides>;
  baseTooltip: React.ComponentType<ChartBaseTooltipProps & ChartBaseTooltipPropsOverrides>;
}

// Overrides for module augmentation
export interface ChartBaseDividerPropsOverrides {}
export interface ChartBaseMenuItemPropsOverrides {}
export interface ChartBaseMenuListPropsOverrides {}
export interface ChartBasePopperPropsOverrides {}
export interface ChartBaseTooltipPropsOverrides {}
