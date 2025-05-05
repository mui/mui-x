import * as React from 'react';
import { ChartBaseIconButtonProps } from './chartsBaseSlotProps';

export interface ChartsBaseSlotsExtension {}
export interface ChartsBaseSlots extends ChartsBaseSlotsExtension {
  baseIconButton: React.ComponentType<ChartBaseIconButtonProps>;
}
