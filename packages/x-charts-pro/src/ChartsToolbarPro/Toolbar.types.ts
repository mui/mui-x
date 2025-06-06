import * as React from 'react';
import { ChartsToolbarProProps } from './ChartsToolbarPro';

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
  toolbar?: Partial<ChartsToolbarProProps>;
}
