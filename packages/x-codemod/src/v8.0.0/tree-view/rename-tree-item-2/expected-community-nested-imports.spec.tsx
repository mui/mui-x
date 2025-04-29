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
} from '@mui/x-tree-view/TreeItem';
import {
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
} from '@mui/x-tree-view/useTreeItem';
import { useTreeItemUtils } from '@mui/x-tree-view/hooks';
import {
  TreeItemProvider,
  TreeItemProviderProps,
  FakeImportToForcePrettierNewLine,
} from '@mui/x-tree-view/TreeItemProvider';
import {
  TreeItemIcon,
  TreeItemIconProps,
  TreeItemIconSlots,
  TreeItemIconSlotProps,
} from '@mui/x-tree-view/TreeItemIcon';
import {
  TreeItemDragAndDropOverlay,
  TreeItemDragAndDropOverlayProps,
} from '@mui/x-tree-view/TreeItemDragAndDropOverlay';
import {
  TreeItemLabelInput,
  TreeItemLabelInputProps,
  FakeImport2ToForcePrettierNewLine,
} from '@mui/x-tree-view/TreeItemLabelInput';

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
