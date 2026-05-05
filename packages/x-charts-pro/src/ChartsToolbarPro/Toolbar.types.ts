import type * as React from 'react';
import type { WithDataAttributes } from '@mui/x-internals/types';
import { type ChartsToolbarProProps } from './ChartsToolbarPro';

export interface ChartsToolbarProSlots {
  /**
   * Custom component for the toolbar.
   * @default ChartsToolbar
   */
  toolbar?: React.ElementType<ChartsToolbarProProps>;
}
export interface ChartsToolbarProSlotProps {
  /**
   * Props for the toolbar component.
   */
  toolbar?: WithDataAttributes<Partial<ChartsToolbarProProps>>;
}
