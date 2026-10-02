import type * as React from 'react';
import type { WithDataAttributes } from '@mui/utils/types';
import type { ToolbarPropsOverrides } from '../models/chartsSlotsComponentsProps';

export interface ChartsToolbarProps {}

export interface ChartsToolbarSlots {
  /**
   * Custom component for the toolbar.
   * @default ChartsToolbar
   */
  toolbar?: React.ElementType<ChartsToolbarProps & ToolbarPropsOverrides>;
}
export interface ChartsToolbarSlotProps {
  /**
   * Props for the toolbar component.
   */
  toolbar?: WithDataAttributes<Partial<ChartsToolbarProps> & ToolbarPropsOverrides>;
}
