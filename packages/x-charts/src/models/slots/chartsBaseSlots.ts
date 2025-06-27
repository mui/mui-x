import * as React from 'react';
import type {
  ChartBaseButtonProps,
  ChartBaseDividerProps,
  ChartBaseIconButtonProps,
  ChartBaseMenuItemProps,
  ChartBaseMenuListProps,
  ChartBasePopperProps,
  ChartBaseTooltipProps,
} from './chartsBaseSlotProps';
import type {
  ChartBaseButtonPropsOverrides,
  ChartBaseDividerPropsOverrides,
  ChartBaseIconButtonPropsOverrides,
  ChartBaseMenuItemPropsOverrides,
  ChartBaseMenuListPropsOverrides,
  ChartBasePopperPropsOverrides,
  ChartBaseTooltipPropsOverrides,
} from './propOverrides';

export interface ChartsBaseSlotProps {
  baseButton: ChartBaseButtonProps & ChartBaseButtonPropsOverrides;
  baseDivider: ChartBaseDividerProps & ChartBaseDividerPropsOverrides;
  baseIconButton: ChartBaseIconButtonProps & ChartBaseIconButtonPropsOverrides;
  baseMenuItem: ChartBaseMenuItemProps & ChartBaseMenuItemPropsOverrides;
  baseMenuList: ChartBaseMenuListProps & ChartBaseMenuListPropsOverrides;
  basePopper: ChartBasePopperProps & ChartBasePopperPropsOverrides;
  baseTooltip: ChartBaseTooltipProps & ChartBaseTooltipPropsOverrides;
}

export type ChartsBaseSlots = {
  [key in keyof ChartsBaseSlotProps]: React.ComponentType<ChartsBaseSlotProps[key]>;
};
