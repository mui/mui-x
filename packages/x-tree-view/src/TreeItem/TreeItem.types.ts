import * as React from 'react';
import { Theme } from '@mui/material/styles';
import { SlotComponentProps } from '@mui/utils';
import { TransitionProps } from '@mui/material/transitions';
import { SxProps } from '@mui/system';
import { TreeItemContentProps } from './TreeItemContent';
import { TreeItemClasses } from './treeItemClasses';
import { TreeViewItemId } from '../models';
import { SlotComponentPropsFromProps } from '../internals/models';
import { MuiCancellableEventHandler } from '../internals/models/MuiCancellableEvent';
import { UseTreeViewIconsSignature } from '../internals/plugins/useTreeViewIcons';
import { UseTreeViewSelectionSignature } from '../internals/plugins/useTreeViewSelection';
import { UseTreeViewItemsSignature } from '../internals/plugins/useTreeViewItems';
import { UseTreeViewFocusSignature } from '../internals/plugins/useTreeViewFocus';
import { UseTreeViewExpansionSignature } from '../internals/plugins/useTreeViewExpansion';
import { UseTreeViewKeyboardNavigationSignature } from '../internals/plugins/useTreeViewKeyboardNavigation';

export interface TreeItemSlots {
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
  /**
   * The component that animates the appearance / disappearance of the item's children.
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
   * The component used to render the content of the item.
   * @default TreeItemContent
   */
  ContentComponent?: React.JSXElementConstructor<TreeItemContentProps>;
  /**
   * Props applied to ContentComponent.
   */
  ContentProps?: React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> };
  /**
   * If `true`, the item is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * This prop isn't supported.
   * Use the `onItemFocus` callback on the tree if you need to monitor a item's focus.
   */
  onFocus?: null;
  /**
   * The tree item label.
   */
  label?: React.ReactNode;
  /**
   * The id of the item.
   */
  itemId: TreeViewItemId;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
  /**
   * Callback fired when a key of the keyboard is pressed on the item.
   */
  onKeyDown?: MuiCancellableEventHandler<React.KeyboardEvent<HTMLLIElement>>;
}

export interface TreeItemOwnerState extends TreeItemProps {
  expanded: boolean;
  focused: boolean;
  selected: boolean;
  disabled: boolean;
  indentationAtItemLevel: boolean;
}

/**
 * Plugins that need to be present in the Tree View in order for `TreeItem` to work correctly.
 */
export type TreeItemMinimalPlugins = readonly [
  UseTreeViewIconsSignature,
  UseTreeViewSelectionSignature,
  UseTreeViewItemsSignature,
  UseTreeViewFocusSignature,
  UseTreeViewExpansionSignature,
  UseTreeViewKeyboardNavigationSignature,
];

/**
 * Plugins that `TreeItem` can use if they are present, but are not required.
 */
export type TreeItemOptionalPlugins = readonly [];
