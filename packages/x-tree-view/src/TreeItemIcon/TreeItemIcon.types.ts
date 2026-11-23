import type * as React from 'react';
import type { SlotComponentProps } from '@mui/utils/types';
import type { UseTreeItemStatus } from '../useTreeItem';

export interface TreeItemIconSlots {
  /**
   * The icon used to collapse the item.
   * @default The `collapseIcon` slot of the Tree View.
   */
  collapseIcon?: React.ElementType | null;
  /**
   * The icon used to expand the item.
   * @default The `expandIcon` slot of the Tree View.
   */
  expandIcon?: React.ElementType | null;
  /**
   * The icon displayed next to an end item.
   * @default The `endIcon` slot of the Tree View.
   */
  endIcon?: React.ElementType | null;
  /**
   * The icon to display next to the Tree Item's label.
   * @default null
   */
  icon?: React.ElementType | null;
}

export interface TreeItemIconSlotProps {
  collapseIcon?: SlotComponentProps<'svg', {}, {}>;
  expandIcon?: SlotComponentProps<'svg', {}, {}>;
  endIcon?: SlotComponentProps<'svg', {}, {}>;
  icon?: SlotComponentProps<'svg', {}, {}>;
}

export interface TreeItemIconProps {
  /**
   * The status of the item, used to pick the icon (for example expanded or collapsed).
   */
  status: UseTreeItemStatus;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: TreeItemIconSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TreeItemIconSlotProps;
}
