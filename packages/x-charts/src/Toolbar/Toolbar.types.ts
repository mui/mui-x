import type * as React from 'react';
import type { WithDataAttributes } from '@mui/x-internals/types';

export interface ChartsToolbarProps {}

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
  toolbar?: WithDataAttributes<Partial<ChartsToolbarProps>>;
}
