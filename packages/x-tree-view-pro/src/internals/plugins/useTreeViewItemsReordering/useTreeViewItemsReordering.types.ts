import * as React from 'react';
import {
  DefaultizedProps,
  TreeViewPluginSignature,
  UseTreeViewItemsSignature,
} from '@mui/x-tree-view/internals';
import {
  TreeViewItemId,
  TreeViewItemsReorderingAction,
  TreeViewCancellableEventHandler,
} from '@mui/x-tree-view/models';
import { TreeItemDragAndDropOverlayProps } from '@mui/x-tree-view/TreeItemDragAndDropOverlay';

export interface UseTreeViewItemsReorderingInstance {
  /**
   * Check if a given item can be dragged.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} `true` if the item can be dragged, `false` otherwise.
   */
  canItemBeDragged: (itemId: TreeViewItemId) => boolean;
  /**
   * Get the valid reordering action if a given item is the target of the ongoing reordering.
   * @param {TreeViewItemId} itemId The id of the item to get the action of.
   * @returns {TreeViewItemItemReorderingValidActions} The valid actions for the item.
   */
  getDroppingTargetValidActions: (itemId: TreeViewItemId) => TreeViewItemItemReorderingValidActions;
  /**
   * Start a reordering for the given item.
   * @param {TreeViewItemId} itemId The id of the item to start the reordering for.
   */
  startDraggingItem: (itemId: TreeViewItemId) => void;
  /**
   * Stop the reordering of a given item.
   * @param {TreeViewItemId} itemId The id of the item to stop the reordering for.
   */
  stopDraggingItem: (itemId: TreeViewItemId) => void;
  /**
   * Set the new target item for the ongoing reordering.
   * The action will be determined based on the position of the cursor inside the target and the valid actions for this target.
   * @param {object} params The params describing the new target item.
   * @param {TreeViewItemId} params.itemId The id of the new target item.
   * @param {TreeViewItemItemReorderingValidActions} params.validActions The valid actions for the new target item.
   * @param {number} params.targetHeight The height of the target item.
   * @param {number} params.cursorY The Y coordinate of the mouse cursor.
   * @param {number} params.cursorX The X coordinate of the mouse cursor.
   * @param {HTMLDivElement} params.contentElement The DOM element rendered for the content slot.
   */
  setDragTargetItem: (params: {
    itemId: TreeViewItemId;
    validActions: TreeViewItemItemReorderingValidActions;
    targetHeight: number;
    cursorY: number;
    cursorX: number;
    contentElement: HTMLDivElement;
  }) => void;
}

export interface TreeViewItemReorderPosition {
  parentId: string | null;
  index: number;
}

export type TreeViewItemItemReorderingValidActions = {
  [key in TreeViewItemsReorderingAction]?: TreeViewItemReorderPosition;
};

export interface UseTreeViewItemsReorderingParameters {
  /**
   * If `true`, the reordering of items is enabled.
   * Make sure to also enable the `itemsReordering` experimental feature:
   * `<RichTreeViewPro experimentalFeatures={{ itemsReordering: true }} itemsReordering />`.
   * @default false
   */
  itemsReordering?: boolean;
  /**
   * Used to determine if a given item can be reordered.
   * @param {string} itemId The id of the item to check.
   * @returns {boolean} `true` if the item can be reordered.
   * @default () => true
   */
  isItemReorderable?: (itemId: string) => boolean;
  /**
   * Used to determine if a given item can move to some new position.
   * @param {object} params The params describing the item re-ordering.
   * @param {string} params.itemId The id of the item that is being moved to a new position.
   * @param {TreeViewItemReorderPosition} params.oldPosition The old position of the item.
   * @param {TreeViewItemReorderPosition} params.newPosition The new position of the item.
   * @returns {boolean} `true` if the item can move to the new position.
   */
  canMoveItemToNewPosition?: (params: {
    itemId: string;
    oldPosition: TreeViewItemReorderPosition;
    newPosition: TreeViewItemReorderPosition;
  }) => boolean;
  /**
   * Callback fired when a Tree Item is moved in the tree.
   * @param {object} params The params describing the item re-ordering.
   * @param {string} params.itemId The id of the item moved.
   * @param {TreeViewItemReorderPosition} params.oldPosition The old position of the item.
   * @param {TreeViewItemReorderPosition} params.newPosition The new position of the item.
   */
  onItemPositionChange?: (params: {
    itemId: string;
    oldPosition: TreeViewItemReorderPosition;
    newPosition: TreeViewItemReorderPosition;
  }) => void;
}

export type UseTreeViewItemsReorderingDefaultizedParameters = DefaultizedProps<
  UseTreeViewItemsReorderingParameters,
  'itemsReordering'
>;

export interface UseTreeViewItemsReorderingState {
  itemsReordering: {
    draggedItemId: string;
    targetItemId: string;
    newPosition: TreeViewItemReorderPosition | null;
    action: TreeViewItemsReorderingAction | null;
  } | null;
}

interface UseTreeViewItemsReorderingContextValue {
  itemsReordering: {
    enabled: boolean;
    currentDrag: UseTreeViewItemsReorderingState['itemsReordering'];
  };
}

export type UseTreeViewItemsReorderingSignature = TreeViewPluginSignature<{
  params: UseTreeViewItemsReorderingParameters;
  defaultizedParams: UseTreeViewItemsReorderingDefaultizedParameters;
  instance: UseTreeViewItemsReorderingInstance;
  state: UseTreeViewItemsReorderingState;
  contextValue: UseTreeViewItemsReorderingContextValue;
  experimentalFeatures: 'itemsReordering';
  dependencies: [UseTreeViewItemsSignature];
}>;

export interface UseTreeItemRootSlotPropsFromItemsReordering {
  draggable?: true;
  onDragStart?: TreeViewCancellableEventHandler<React.DragEvent>;
  onDragOver?: TreeViewCancellableEventHandler<React.DragEvent>;
  onDragEnd?: TreeViewCancellableEventHandler<React.DragEvent>;
}

export interface UseTreeItemContentSlotPropsFromItemsReordering {
  onDragEnter?: TreeViewCancellableEventHandler<React.DragEvent>;
  onDragOver?: TreeViewCancellableEventHandler<React.DragEvent>;
}

export interface UseTreeItemDragAndDropOverlaySlotPropsFromItemsReordering
  extends TreeItemDragAndDropOverlayProps {}

declare module '@mui/x-tree-view/useTreeItem' {
  interface UseTreeItemRootSlotOwnProps extends UseTreeItemRootSlotPropsFromItemsReordering {}

  interface UseTreeItemContentSlotOwnProps extends UseTreeItemContentSlotPropsFromItemsReordering {}

  interface UseTreeItemDragAndDropOverlaySlotOwnProps
    extends UseTreeItemDragAndDropOverlaySlotPropsFromItemsReordering {}
}
