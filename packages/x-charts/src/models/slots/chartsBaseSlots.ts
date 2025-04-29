import type * as React from 'react';
import { IconButtonProps, TooltipProps } from './chartsBaseSlotProps';

export interface ChartsBaseSlots {
  baseTooltip: React.ComponentType<TooltipProps>;
  baseIconButton: React.ComponentType<IconButtonProps>;
}
