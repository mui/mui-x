import { ChartsBaseSlotProps } from '@mui/x-charts/models';
import * as React from 'react';
import {
  ChartBaseDividerProps,
  ChartBaseMenuItemProps,
  ChartBaseMenuListProps,
  ChartBasePopperProps,
  ChartBaseTooltipProps,
} from './chartBaseSlotProps';
import {
  ChartBaseDividerPropsOverrides,
  ChartBaseMenuItemPropsOverrides,
  ChartBaseMenuListPropsOverrides,
  ChartBasePopperPropsOverrides,
  ChartBaseTooltipPropsOverrides,
} from './propOverrides';

export interface ChartsBaseSlotPropsPro extends ChartsBaseSlotProps {
  baseDivider: ChartBaseDividerProps & ChartBaseDividerPropsOverrides;
  baseMenuItem: ChartBaseMenuItemProps & ChartBaseMenuItemPropsOverrides;
  baseMenuList: ChartBaseMenuListProps & ChartBaseMenuListPropsOverrides;
  basePopper: ChartBasePopperProps & ChartBasePopperPropsOverrides;
  baseTooltip: ChartBaseTooltipProps & ChartBaseTooltipPropsOverrides;
}

export type ChartsBaseSlotsPro = {
  [key in keyof ChartsBaseSlotPropsPro]: React.ComponentType<ChartsBaseSlotPropsPro[key]>;
};
