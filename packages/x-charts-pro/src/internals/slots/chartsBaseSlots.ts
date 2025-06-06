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
  baseDivider: React.ComponentType<ChartBaseDividerProps>;
  baseMenuItem: React.ComponentType<ChartBaseMenuItemProps>;
  baseMenuList: React.ComponentType<ChartBaseMenuListProps>;
  basePopper: React.ComponentType<ChartBasePopperProps>;
  baseTooltip: React.ComponentType<ChartBaseTooltipProps>;
}
