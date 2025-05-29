import * as React from 'react';
import { ChartsToolbarProps } from './internals/ChartsToolbar';

export interface ChartsToolbarSlots {
  /**
   * Custom component for the toolbar.
   * @default ChartsToolbar
   */
  toolbar?: React.ElementType<ChartsToolbarProps>;
}
export interface ChartsToolbarSlotProps {
  /**
   * Props for the toolbar component.
   */
  toolbar?: Partial<ChartsToolbarProps>;
}
