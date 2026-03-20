import type * as React from 'react';
import type { BaseSlots } from '@mui/x-data-grid/internals';

type IconProps = BaseSlots.IconProps;

export interface GridProIconSlotsComponent {
  /**
   * Icon displayed in column menu for left pinning
   * @default GridPushPinLeftIcon
   * @deprecated Use `columnMenuPinIcon` instead.
   * If provided, this icon is used for the "Pin left" action. Otherwise, `columnMenuPinIcon` is used.
   */
  columnMenuPinLeftIcon?: React.JSXElementConstructor<IconProps>;
  /**
   * Icon displayed in column menu for right pinning
   * @default GridPushPinRightIcon
   * @deprecated Use `columnMenuPinIcon` instead.
   * If provided, this icon is used for the "Pin right" action. Otherwise, `columnMenuPinIcon` is used.
   */
  columnMenuPinRightIcon?: React.JSXElementConstructor<IconProps>;
  /**
   * Icon displayed in column menu for pinning/unpinning columns.
   *
   * The menu is state-dependent:
   * - If a column is unpinned, it shows "Pin left" and "Pin right".
   * - If a column is pinned, it shows "Unpin" and the opposite-side pin action.
   *
   * This icon is used for the pin actions unless `columnMenuPinLeftIcon` /
   * `columnMenuPinRightIcon` are provided, in which case they take precedence.
   */
  columnMenuPinIcon: React.JSXElementConstructor<IconProps>;
}
