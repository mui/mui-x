import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import { UseTreeItemParameters, UseTreeItemStatus } from '../useTreeItem';
import { TreeItemClasses } from '../../TreeItem';

export interface TreeItemNextSlots {
  /**
   * The component that renders the root.
   * @default TreeItemNextRoot
   */
  root?: React.ElementType;
  /**
   * The component that renders the content of the item.
   * (e.g.: everything related to this item, not to its children).
   * @default TreeItemNextContent
   */
  content?: React.ElementType;
  /**
   * The component that renders the children of the item.
   * @default TreeItemNextGroup
   */
  group?: React.ElementType;
  /**
   * The component that renders the icon
   * @default TreeItemNextIconContainer
   */
  iconContainer?: React.ElementType;
  /**
   * The component that renders the item label
   * @default TreeItemNextLabel
   */
  label?: React.ElementType;
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
  content?: SlotComponentProps<'div', {}, {}>;
  group?: SlotComponentProps<'div', {}, {}>;
  iconContainer?: SlotComponentProps<'div', {}, {}>;
  label?: SlotComponentProps<'div', {}, {}>;
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
