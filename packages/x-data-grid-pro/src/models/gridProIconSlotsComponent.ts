import * as React from 'react';
import { BaseSlots } from '@mui/x-data-grid/internals';

type IconProps = BaseSlots.IconProps;

export interface GridProIconSlotsComponent {
  /**
   * Icon displayed in column menu for left pinning
   * @default GridPushPinLeftIcon
   */
  columnMenuPinLeftIcon: React.JSXElementConstructor<IconProps>;
  /**
   * Icon displayed in column menu for right pinning
   * @default GridPushPinRightIcon
   */
  columnMenuPinRightIcon: React.JSXElementConstructor<IconProps>;
}
