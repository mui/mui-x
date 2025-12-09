import { type ChartsBaseSlots } from '@mui/x-charts/models';
import type * as React from 'react';
import {
  type ChartBaseDividerProps,
  type ChartBaseMenuItemProps,
  type ChartBaseMenuListProps,
  type ChartBasePopperProps,
  type ChartBaseTooltipProps,
} from './chartBaseSlotProps';

export interface ChartsBaseSlotsPro extends ChartsBaseSlots {
  baseDivider: React.ComponentType<ChartBaseDividerProps>;
  baseMenuItem: React.ComponentType<ChartBaseMenuItemProps>;
  baseMenuList: React.ComponentType<ChartBaseMenuListProps>;
  basePopper: React.ComponentType<ChartBasePopperProps>;
  baseTooltip: React.ComponentType<ChartBaseTooltipProps>;
}
