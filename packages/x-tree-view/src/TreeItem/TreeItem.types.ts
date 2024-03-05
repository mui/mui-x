import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SlotComponentProps } from '@mui/base/utils';
import { TransitionProps } from '@mui/material/transitions';
import { SxProps } from '@mui/system';
import { TreeItemContentProps } from './TreeItemContent';
import { TreeItemClasses } from './treeItemClasses';
import { TreeViewItemId } from '../models';
import { SlotComponentPropsFromProps } from '../internals/models';

export interface TreeItemSlots {
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
  /**
   * The component that animates to appearance / disappearance of the item's children.
   * @default TreeItem2Group
   */
  groupTransition?: React.ElementType;
}

export interface TreeItemSlotProps {
  collapseIcon?: SlotComponentProps<'svg', {}, {}>;
  expandIcon?: SlotComponentProps<'svg', {}, {}>;
  endIcon?: SlotComponentProps<'svg', {}, {}>;
  icon?: SlotComponentProps<'svg', {}, {}>;
  groupTransition?: SlotComponentPropsFromProps<TransitionProps, {}, {}>;
}

export interface TreeItemProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<TreeItemClasses>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: TreeItemSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: TreeItemSlotProps;
  /**
   * The component used for the content node.
   * @default TreeItemContent
   */
  ContentComponent?: React.JSXElementConstructor<TreeItemContentProps>;
  /**
   * Props applied to ContentComponent.
   */
  ContentProps?: React.HTMLAttributes<HTMLElement>;
  /**
   * If `true`, the node is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * This prop isn't supported.
   * Use the `onNodeFocus` callback on the tree if you need to monitor a node's focus.
   */
  onFocus?: null;
  /**
   * The tree node label.
   */
  label?: React.ReactNode;
  /**
   * The id of the node.
   */
  nodeId: TreeViewItemId;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}

export interface TreeItemOwnerState extends TreeItemProps {
  expanded: boolean;
  focused: boolean;
  selected: boolean;
  disabled: boolean;
}
