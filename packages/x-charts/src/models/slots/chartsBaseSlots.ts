import * as React from 'react';
import { ChartBaseButtonProps, ChartBaseIconButtonProps } from './chartsBaseSlotProps';
import { ChartBaseButtonPropsOverrides, ChartBaseIconButtonPropsOverrides } from './propOverrides';

export interface ChartsBaseSlotProps {
  baseButton: ChartBaseButtonProps & ChartBaseButtonPropsOverrides;
  baseIconButton: ChartBaseIconButtonProps & ChartBaseIconButtonPropsOverrides;
}

export type ChartsBaseSlots = {
  [key in keyof ChartsBaseSlotProps]: React.ComponentType<ChartsBaseSlotProps[key]>;
};
