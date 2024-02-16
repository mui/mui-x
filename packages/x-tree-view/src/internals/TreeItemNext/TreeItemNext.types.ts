import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import { UseTreeItemParameters, UseTreeItemStatus } from '../useTreeItem';
import { TreeItemClasses } from '../../TreeItem';
import { TreeItemIconSlotProps, TreeItemIconSlots } from '../TreeItemIcon';

export interface TreeItemNextSlots extends TreeItemIconSlots {
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
  groupTransition?: React.ElementType;
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
}

export interface TreeItemNextSlotProps extends TreeItemIconSlotProps {
  root?: SlotComponentProps<'li', {}, {}>;
  content?: SlotComponentProps<'div', {}, {}>;
  groupTransition?: SlotComponentProps<'div', {}, {}>;
  iconContainer?: SlotComponentProps<'div', {}, {}>;
  label?: SlotComponentProps<'div', {}, {}>;
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

export interface TreeItemNextOwnerState
  extends Omit<TreeItemNextProps, 'disabled'>,
    UseTreeItemStatus {}
