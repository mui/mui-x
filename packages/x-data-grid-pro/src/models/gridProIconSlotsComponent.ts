import type * as React from 'react';
import type { BaseSlots } from '@mui/x-data-grid/internals';

type IconProps = BaseSlots.IconProps;

export interface GridProIconSlotsComponent {
  /**
   * Icon displayed in column menu for left pinning
   * @default GridPushPinLeftIcon
   * @deprecated Use `columnMenuPinIcon` instead. The pin icon now toggles based on the current pin state.
   */
  columnMenuPinLeftIcon?: React.JSXElementConstructor<IconProps>;
  /**
   * Icon displayed in column menu for right pinning
   * @default GridPushPinRightIcon
   * @deprecated Use `columnMenuPinIcon` instead. The pin icon now toggles based on the current pin state.
   */
  columnMenuPinRightIcon?: React.JSXElementConstructor<IconProps>;
  /**
   * Icon displayed in column menu for pinning/unpinning columns.
   * Toggles based on pin state: unpinned -> pin left, pin left -> pin right, pin right -> unpinned.
   * @default GridPushPinLeftIcon (when unpinned or pin left), GridPushPinRightIcon (when pin right)
   */
  columnMenuPinIcon: React.JSXElementConstructor<IconProps>;
}
