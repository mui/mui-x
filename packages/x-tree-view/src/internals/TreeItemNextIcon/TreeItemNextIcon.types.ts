import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import { UseTreeItemStatus } from '../useTreeItem';

export interface TreeItemNextIconSlots {
  /**
   * The icon used to collapse the node.
   */
  collapseIcon?: React.ElementType;
  /**
   * The icon used to expand the node.
   */
  expandIcon?: React.ElementType;
  /**
   * The icon displayed next to an end node.
   */
  endIcon?: React.ElementType;
  /**
   * The icon to display next to the tree node's label.
   */
  icon?: React.ElementType;
}

export interface TreeItemNextIconSlotProps {
  collapseIcon?: SlotComponentProps<'svg', {}, {}>;
  expandIcon?: SlotComponentProps<'svg', {}, {}>;
  endIcon?: SlotComponentProps<'svg', {}, {}>;
  icon?: SlotComponentProps<'svg', {}, {}>;
}

export interface TreeItemNextIconProps {
  status: UseTreeItemStatus;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: TreeItemNextIconSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TreeItemNextIconSlotProps;
  fallbackIcon?: React.ReactNode;
}
