import * as React from 'react';
import { SlotComponentProps } from '@mui/utils/types';
import { UseTreeItemStatus } from '../useTreeItem';

export interface TreeItemIconSlots {
  /**
   * The icon used to collapse the item.
   */
  collapseIcon?: React.ElementType;
  /**
   * The icon used to expand the item.
   */
  expandIcon?: React.ElementType;
  /**
   * The icon displayed next to an end item.
   */
  endIcon?: React.ElementType;
  /**
   * The icon to display next to the Tree Item's label.
   */
  icon?: React.ElementType;
}

export interface TreeItemIconSlotProps {
  collapseIcon?: SlotComponentProps<'svg', {}, {}>;
  expandIcon?: SlotComponentProps<'svg', {}, {}>;
  endIcon?: SlotComponentProps<'svg', {}, {}>;
  icon?: SlotComponentProps<'svg', {}, {}>;
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
