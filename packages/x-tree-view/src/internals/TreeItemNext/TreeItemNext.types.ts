import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import { UseTreeItemParameters } from '../useTreeItem';
import { UseTreeItemStatus } from '@mui/x-tree-view/internals/useTreeItem/useTreeItem.types';
import { TreeItemClasses } from '@mui/x-tree-view';

export interface TreeItemNextSlots {
  /**
   * Element rendered at the root.
   * @default TreeItemNextRoot
   */
  root?: React.ElementType;
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

export interface TreeItemNextSlotProps {
  root?: SlotComponentProps<'li', {}, {}>;
  collapseIcon?: SlotComponentProps<'svg', {}, {}>;
  expandIcon?: SlotComponentProps<'svg', {}, {}>;
  endIcon?: SlotComponentProps<'svg', {}, {}>;
  icon?: SlotComponentProps<'svg', {}, {}>;
}

export interface TreeItemNextProps extends Omit<UseTreeItemParameters, 'rootRef'> {
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<TreeItemClasses>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: TreeItemNextSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TreeItemNextSlotProps;
}

export interface TreeItemNextOwnerState extends TreeItemNextProps, UseTreeItemStatus {}
