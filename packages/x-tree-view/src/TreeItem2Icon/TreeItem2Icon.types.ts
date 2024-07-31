import * as React from 'react';
import { SlotComponentProps } from '@mui/utils';
import { UseTreeItem2Status } from '../useTreeItem2';

export interface TreeItem2IconSlots {
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
   * The icon to display next to the tree item's label.
   */
  icon?: React.ElementType;
}

export interface TreeItem2IconSlotProps {
  collapseIcon?: SlotComponentProps<'svg', {}, {}>;
  expandIcon?: SlotComponentProps<'svg', {}, {}>;
  endIcon?: SlotComponentProps<'svg', {}, {}>;
  icon?: SlotComponentProps<'svg', {}, {}>;
}

export interface TreeItem2IconProps {
  status: UseTreeItem2Status;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: TreeItem2IconSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TreeItem2IconSlotProps;
}
