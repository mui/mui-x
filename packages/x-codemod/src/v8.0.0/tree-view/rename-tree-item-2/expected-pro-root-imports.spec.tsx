/* eslint-disable no-restricted-imports */
// @ts-nocheck
import * as React from 'react';
import {
  TreeItem,
  TreeItemRoot,
  TreeItemContent,
  TreeItemIconContainer,
  TreeItemGroupTransition,
  TreeItemCheckbox,
  TreeItemLabel,
  TreeItemProps,
  TreeItemSlots,
  TreeItemSlotProps,
  useTreeItem,
  useTreeItem as useAliasedTreeItem,
  UseTreeItemParameters,
  UseTreeItemReturnValue,
  UseTreeItemStatus,
  UseTreeItemRootSlotOwnProps,
  UseTreeItemContentSlotOwnProps,
  UseTreeItemLabelInputSlotOwnProps,
  UseTreeItemLabelSlotOwnProps,
  UseTreeItemCheckboxSlotOwnProps,
  UseTreeItemIconContainerSlotOwnProps,
  UseTreeItemGroupTransitionSlotOwnProps,
  UseTreeItemDragAndDropOverlaySlotOwnProps,
  useTreeItemUtils,
  TreeItemProvider,
  TreeItemProviderProps,
  TreeItemIcon,
  TreeItemIconProps,
  TreeItemIconSlots,
  TreeItemIconSlotProps,
  TreeItemDragAndDropOverlay,
  TreeItemDragAndDropOverlayProps,
  TreeItemLabelInput,
  TreeItemLabelInputProps,
} from '@mui/x-tree-view-pro';

// prettier-ignore
function App() {
  useTreeItem({});
  useAliasedTreeItem({});
  useTreeItemUtils();

  const treeItemProps: TreeItemProps = {};
  const treeItemSlots: TreeItemSlots = {};
  const treeItemSlotProps: TreeItemSlotProps = {};

  const params: UseTreeItemParameters = {};
  const returnValue: UseTreeItemReturnValue = {};
  const status: UseTreeItemStatus = {};
  const root: UseTreeItemRootSlotOwnProps = {};
  const content: UseTreeItemContentSlotOwnProps = {};
  const labelInput: UseTreeItemLabelInputSlotOwnProps = {};
  const label: UseTreeItemLabelSlotOwnProps = {};
  const checkbox: UseTreeItemCheckboxSlotOwnProps = {};
  const iconContainer: UseTreeItemIconContainerSlotOwnProps = {};
  const groupTransition: UseTreeItemGroupTransitionSlotOwnProps = {};
  const dragAndDropOverlay: UseTreeItemDragAndDropOverlaySlotOwnProps = {};

  const treeItemProviderProps: TreeItemProviderProps = {};
  const treeItemIconProps: TreeItemIconProps = {};
  const treeItemDragAndDropOverlayProps: TreeItemDragAndDropOverlayProps = {};
  const treeItemLabelInputProps: TreeItemLabelInputProps = {};

  return (
    (<React.Fragment>
      <TreeItem />
      <TreeItemRoot />
      <TreeItemContent />
      <TreeItemIconContainer />
      <TreeItemGroupTransition />
      <TreeItemCheckbox />
      <TreeItemLabel />
      <TreeItemProvider />
      <TreeItemIcon />
      <TreeItemDragAndDropOverlay />
      <TreeItemLabelInput />
    </React.Fragment>)
  );
}
