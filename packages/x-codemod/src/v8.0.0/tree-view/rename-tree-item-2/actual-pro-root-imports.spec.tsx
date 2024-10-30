/* eslint-disable no-restricted-imports */
// @ts-nocheck
import * as React from 'react';
import {
  TreeItem2,
  TreeItem2Root,
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2GroupTransition,
  TreeItem2Checkbox,
  TreeItem2Label,
  TreeItem2Props,
  TreeItem2Slots,
  TreeItem2SlotProps,
  useTreeItem2,
  unstable_useTreeItem2 as useAliasedTreeItem,
  UseTreeItem2Parameters,
  UseTreeItem2ReturnValue,
  UseTreeItem2Status,
  UseTreeItem2RootSlotOwnProps,
  UseTreeItem2ContentSlotOwnProps,
  UseTreeItem2LabelInputSlotOwnProps,
  UseTreeItem2LabelSlotOwnProps,
  UseTreeItem2CheckboxSlotOwnProps,
  UseTreeItem2IconContainerSlotOwnProps,
  UseTreeItem2GroupTransitionSlotOwnProps,
  UseTreeItem2DragAndDropOverlaySlotOwnProps,
  useTreeItem2Utils,
  TreeItem2Provider,
  TreeItem2ProviderProps,
  TreeItem2Icon,
  TreeItem2IconProps,
  TreeItem2IconSlots,
  TreeItem2IconSlotProps,
  TreeItem2DragAndDropOverlay,
  TreeItem2DragAndDropOverlayProps,
  TreeItem2LabelInput,
  TreeItem2LabelInputProps,
} from '@mui/x-tree-view-pro';

// prettier-ignore
function App() {
  useTreeItem2({});
  useAliasedTreeItem({});
  useTreeItem2Utils();

  const treeItemProps: TreeItem2Props = {};
  const treeItemSlots: TreeItem2Slots = {};
  const treeItemSlotProps: TreeItem2SlotProps = {};

  const params: UseTreeItem2Parameters = {};
  const returnValue: UseTreeItem2ReturnValue = {};
  const status: UseTreeItem2Status = {};
  const root: UseTreeItem2RootSlotOwnProps = {};
  const content: UseTreeItem2ContentSlotOwnProps = {};
  const labelInput: UseTreeItem2LabelInputSlotOwnProps = {};
  const label: UseTreeItem2LabelSlotOwnProps = {};
  const checkbox: UseTreeItem2CheckboxSlotOwnProps = {};
  const iconContainer: UseTreeItem2IconContainerSlotOwnProps = {};
  const groupTransition: UseTreeItem2GroupTransitionSlotOwnProps = {};
  const dragAndDropOverlay: UseTreeItem2DragAndDropOverlaySlotOwnProps = {};

  const treeItemProviderProps: TreeItem2ProviderProps = {};
  const treeItemIconProps: TreeItem2IconProps = {};
  const treeItemDragAndDropOverlayProps: TreeItem2DragAndDropOverlayProps = {};
  const treeItemLabelInputProps: TreeItem2LabelInputProps = {};

  return (
    <React.Fragment>
      <TreeItem2 />
      <TreeItem2Root />
      <TreeItem2Content />
      <TreeItem2IconContainer />
      <TreeItem2GroupTransition />
      <TreeItem2Checkbox />
      <TreeItem2Label />
      <TreeItem2Provider />
      <TreeItem2Icon />
      <TreeItem2DragAndDropOverlay />
      <TreeItem2LabelInput />
    </React.Fragment>
  );
}
