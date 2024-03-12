import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import { UseTreeItem2Parameters, UseTreeItem2Status } from '../useTreeItem2';
import { TreeItemClasses } from '../TreeItem';
import { TreeItem2IconSlotProps, TreeItem2IconSlots } from '../TreeItem2Icon';

export interface TreeItem2Slots extends TreeItem2IconSlots {
  /**
   * The component that renders the root.
   * @default TreeItem2Root
   */
  root?: React.ElementType;
  /**
   * The component that renders the content of the item.
   * (e.g.: everything related to this item, not to its children).
   * @default TreeItem2Content
   */
  content?: React.ElementType;
  /**
   * The component that renders the children of the item.
   * @default TreeItem2GroupTransition
   */
  groupTransition?: React.ElementType;
  /**
   * The component that renders the icon.
   * @default TreeItem2IconContainer
   */
  iconContainer?: React.ElementType;
  /**
   * The component that renders the item label.
   * @default TreeItem2Label
   */
  label?: React.ElementType;
}

export interface TreeItem2SlotProps extends TreeItem2IconSlotProps {
  root?: SlotComponentProps<'li', {}, {}>;
  content?: SlotComponentProps<'div', {}, {}>;
  groupTransition?: SlotComponentProps<'div', {}, {}>;
  iconContainer?: SlotComponentProps<'div', {}, {}>;
  label?: SlotComponentProps<'div', {}, {}>;
}

export interface TreeItem2Props
  extends Omit<UseTreeItem2Parameters, 'rootRef'>,
    Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<TreeItemClasses>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: TreeItem2Slots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TreeItem2SlotProps;
  /**
   * This prop isn't supported.
   * Use the `onItemFocus` callback on the tree if you need to monitor a node's focus.
   */
  onFocus?: null;
}

export interface TreeItem2OwnerState extends Omit<TreeItem2Props, 'disabled'>, UseTreeItem2Status {}
