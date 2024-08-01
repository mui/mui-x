import * as React from 'react';
import { SlotComponentProps } from '@mui/utils';
import { RichTreeViewItemsSlots, RichTreeViewItemsSlotProps } from '@mui/x-tree-view/internals';

export interface TreeViewVirtualScrollerSlots extends RichTreeViewItemsSlots {
  /**
   * Element rendered at the root.
   * @default RichTreeViewProRoot
   */
  root: React.ElementType;
}

export interface TreeViewVirtualScrollerSlotProps extends RichTreeViewItemsSlotProps {
  root?: SlotComponentProps<'ul', {}, TreeViewVirtualScrollerProps>;
}

export interface TreeViewVirtualScrollerProps extends React.HTMLAttributes<HTMLUListElement> {
  slots: TreeViewVirtualScrollerSlots;
  slotProps?: TreeViewVirtualScrollerSlotProps;
}

export type TreeViewVirtualizationScrollPosition = { top: number; left: number };
