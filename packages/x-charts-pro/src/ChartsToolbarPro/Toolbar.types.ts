import type * as React from 'react';
import type { ToolbarPropsOverrides } from '@mui/x-charts/models';
import type { ChartsToolbarProProps } from './ChartsToolbarPro';

export interface ChartsToolbarProSlots {
  /**
   * Custom component for the toolbar.
   * @default ChartsToolbar
   */
  toolbar?: React.ElementType<ChartsToolbarProProps & ToolbarPropsOverrides>;
}
export interface ChartsToolbarProSlotProps {
  /**
   * Props for the toolbar component.
   */
  toolbar?: Partial<ChartsToolbarProProps> & ToolbarPropsOverrides;
}
