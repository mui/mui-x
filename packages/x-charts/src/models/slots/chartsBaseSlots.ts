import * as React from 'react';
import { ChartBaseButtonProps, ChartBaseIconButtonProps } from './chartsBaseSlotProps';

export interface ChartsBaseSlots {
  baseButton: React.ComponentType<ChartBaseButtonProps & ChartBaseButtonPropsOverrides>;
  baseIconButton: React.ComponentType<ChartBaseIconButtonProps & ChartBaseIconButtonPropsOverrides>;
}

// Overrides for module augmentation
export interface ChartBaseButtonPropsOverrides {}
export interface ChartBaseIconButtonPropsOverrides {}
