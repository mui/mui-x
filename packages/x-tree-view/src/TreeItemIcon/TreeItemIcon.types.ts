import * as React from 'react';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { UseTreeItemStatus } from '../useTreeItem';

export interface TreeItemIconSlots {
  /**
   * The icon used to collapse the item.
   */
  collapseIcon?: React.ElementType | null;
  /**
   * The icon used to expand the item.
   */
  expandIcon?: React.ElementType | null;
  /**
   * The icon displayed next to an end item.
   */
  endIcon?: React.ElementType | null;
  /**
   * The icon to display next to the Tree Item's label.
   */
  icon?: React.ElementType | null;
}

export interface TreeItemIconSlotProps {
  collapseIcon?: SlotComponentPropsFromProps<'svg', {}, {}>;
  expandIcon?: SlotComponentPropsFromProps<'svg', {}, {}>;
  endIcon?: SlotComponentPropsFromProps<'svg', {}, {}>;
  icon?: SlotComponentPropsFromProps<'svg', {}, {}>;
}

export interface TreeItemIconProps {
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
