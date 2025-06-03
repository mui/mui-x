import { ChartsBaseSlots } from '@mui/x-charts/models';
import * as React from 'react';
import {
  ChartBaseMenuItemProps,
  ChartBaseMenuListProps,
  ChartBasePopperProps,
  ChartBaseTooltipProps,
} from './chartBaseSlotProps';

export interface ChartsBaseSlotsPro extends ChartsBaseSlots {
  baseTooltip: React.ComponentType<ChartBaseTooltipProps>;
  basePopper: React.ComponentType<ChartBasePopperProps>;
  baseMenuList: React.ComponentType<ChartBaseMenuListProps>;
  baseMenuItem: React.ComponentType<ChartBaseMenuItemProps>;
}
