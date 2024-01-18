import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SlotComponentProps } from '@mui/base/utils';
import { TransitionProps } from '@mui/material/transitions';
import { SxProps } from '@mui/system';
import { TreeItemContentProps } from './TreeItemContent';
import { TreeItemClasses } from './treeItemClasses';
import { TreeViewItemId } from '../models';

export interface TreeItemSlots {
  /**
   * The icon used to collapse the node.
   */
  collapseIcon?: React.ElementType;
  /**
   * The icon used to expand the node.
   */
  expandIcon?: React.ElementType;
}

export interface TreeItemSlotProps {
  collapseIcon?: SlotComponentProps<'svg', {}, {}>;
  expandIcon?: SlotComponentProps<'svg', {}, {}>;
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
   * The icon displayed next to an end node.
   */
  endIcon?: React.ReactNode;
  /**
   * The icon to display next to the tree node's label.
   */
  icon?: React.ReactNode;
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
   * The component used for the transition.
   * [Follow this guide](/material-ui/transitions/#transitioncomponent-prop) to learn more about the requirements for this component.
   * @default Collapse
   */
  TransitionComponent?: React.JSXElementConstructor<TransitionProps>;
  /**
   * Props applied to the transition element.
   * By default, the element is based on this [`Transition`](http://reactcommunity.org/react-transition-group/transition/) component.
   */
  TransitionProps?: TransitionProps;
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
