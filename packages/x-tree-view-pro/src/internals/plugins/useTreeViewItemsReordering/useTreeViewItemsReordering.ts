import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { TreeViewPlugin, itemsSelectors, labelSelectors } from '@mui/x-tree-view/internals';
import { TreeViewItemsReorderingAction } from '@mui/x-tree-view/models';
import {
  TreeViewItemItemReorderingValidActions,
  TreeViewItemReorderPosition,
  UseTreeViewItemsReorderingInstance,
  UseTreeViewItemsReorderingSignature,
} from './useTreeViewItemsReordering.types';
import {
  chooseActionToApply,
  isAncestor,
  moveItemInTree,
} from './useTreeViewItemsReordering.utils';
import { useTreeViewItemsReorderingItemPlugin } from './useTreeViewItemsReordering.itemPlugin';
import { itemsReorderingSelectors } from './useTreeViewItemsReordering.selectors';

export const useTreeViewItemsReordering: TreeViewPlugin<UseTreeViewItemsReorderingSignature> = ({
  params,
  store,
}) => {
  const canItemBeDragged = React.useCallback(
    (itemId: string) => {
      if (!params.itemsReordering) {
        return false;
      }

      const isItemReorderable = params.isItemReorderable;
      if (isItemReorderable) {
        return isItemReorderable(itemId);
      }

      return true;
    },
    [params.itemsReordering, params.isItemReorderable],
  );

  const getDroppingTargetValidActions = React.useCallback(
    (itemId: string) => {
      const currentReorder = itemsReorderingSelectors.currentReorder(store.state);
      if (!currentReorder) {
        throw new Error('There is no ongoing reordering.');
      }

      if (itemId === currentReorder.draggedItemId) {
        return {};
      }

      const canMoveItemToNewPosition = params.canMoveItemToNewPosition;
      const targetItemMeta = itemsSelectors.itemMeta(store.state, itemId)!;
      const targetItemIndex = itemsSelectors.itemIndex(store.state, targetItemMeta.id);
      const draggedItemMeta = itemsSelectors.itemMeta(store.state, currentReorder.draggedItemId)!;
      const draggedItemIndex = itemsSelectors.itemIndex(store.state, draggedItemMeta.id);
      const isTargetLastSibling =
        targetItemIndex ===
        itemsSelectors.itemOrderedChildrenIds(store.state, targetItemMeta.parentId).length - 1;

      const oldPosition: TreeViewItemReorderPosition = {
        parentId: draggedItemMeta.parentId,
        index: draggedItemIndex,
      };

      const checkIfPositionIsValid = (positionAfterAction: TreeViewItemReorderPosition) => {
        let isValid: boolean;
        // If the new position is equal to the old one, we don't want to show any dropping UI.
        if (
          positionAfterAction.parentId === oldPosition.parentId &&
          positionAfterAction.index === oldPosition.index
        ) {
          isValid = false;
        } else if (canMoveItemToNewPosition) {
          isValid = canMoveItemToNewPosition({
            itemId: currentReorder.draggedItemId,
            oldPosition,
            newPosition: positionAfterAction,
          });
        } else {
          isValid = true;
        }

        return isValid;
      };

      const positionsAfterAction: Record<
        TreeViewItemsReorderingAction,
        TreeViewItemReorderPosition | null
      > = {
        'make-child': { parentId: targetItemMeta.id, index: 0 },
        'reorder-above': {
          parentId: targetItemMeta.parentId,
          index:
            targetItemMeta.parentId === draggedItemMeta.parentId &&
            targetItemIndex > draggedItemIndex
              ? targetItemIndex - 1
              : targetItemIndex,
        },
        'reorder-below':
          !targetItemMeta.expandable || isTargetLastSibling
            ? {
                parentId: targetItemMeta.parentId,
                index:
                  targetItemMeta.parentId === draggedItemMeta.parentId &&
                  targetItemIndex > draggedItemIndex
                    ? targetItemIndex
                    : targetItemIndex + 1,
              }
            : null,
        'move-to-parent':
          targetItemMeta.parentId == null
            ? null
            : {
                parentId: targetItemMeta.parentId,
                index: itemsSelectors.itemOrderedChildrenIds(store.state, targetItemMeta.parentId)
                  .length,
              },
      };

      const validActions: TreeViewItemItemReorderingValidActions = {};
      Object.keys(positionsAfterAction).forEach((action) => {
        const positionAfterAction = positionsAfterAction[action as TreeViewItemsReorderingAction];
        if (positionAfterAction != null && checkIfPositionIsValid(positionAfterAction)) {
          validActions[action as TreeViewItemsReorderingAction] = positionAfterAction;
        }
      });

      return validActions;
    },
    [store, params.canMoveItemToNewPosition],
  );

  const startDraggingItem = React.useCallback(
    (itemId: string) => {
      const isItemBeingEdited = labelSelectors.isItemBeingEdited(store.state, itemId);
      if (isItemBeingEdited) {
        return;
      }

      store.set('itemsReordering', {
        ...store.state.itemsReordering,
        currentReorder: {
          targetItemId: itemId,
          draggedItemId: itemId,
          action: null,
          newPosition: null,
        },
      });
    },
    [store],
  );

  const cancelDraggingItem = React.useCallback(() => {
    const currentReorder = itemsReorderingSelectors.currentReorder(store.state);
    if (currentReorder == null) {
      return;
    }

    store.set('itemsReordering', { ...store.state.itemsReordering, currentReorder: null });
  }, [store]);

  const completeDraggingItem = React.useCallback(
    (itemId: string) => {
      const currentReorder = itemsReorderingSelectors.currentReorder(store.state);
      if (currentReorder == null || currentReorder.draggedItemId !== itemId) {
        return;
      }

      if (
        currentReorder.draggedItemId === currentReorder.targetItemId ||
        currentReorder.action == null ||
        currentReorder.newPosition == null
      ) {
        store.set('itemsReordering', { ...store.state.itemsReordering, currentReorder: null });
        return;
      }

      const draggedItemMeta = itemsSelectors.itemMeta(store.state, currentReorder.draggedItemId)!;

      const oldPosition: TreeViewItemReorderPosition = {
        parentId: draggedItemMeta.parentId,
        index: itemsSelectors.itemIndex(store.state, draggedItemMeta.id),
      };

      const newPosition = currentReorder.newPosition;

      store.update({
        itemsReordering: {
          ...store.state.itemsReordering,
          currentReorder: null,
        },
        items: moveItemInTree({
          itemToMoveId: itemId,
          newPosition,
          oldPosition,
          prevState: store.state.items,
        }),
      });

      const onItemPositionChange = params.onItemPositionChange;
      onItemPositionChange?.({
        itemId,
        newPosition,
        oldPosition,
      });
    },
    [store, params.onItemPositionChange],
  );

  const setDragTargetItem = React.useCallback<
    UseTreeViewItemsReorderingInstance['setDragTargetItem']
  >(
    ({ itemId, validActions, targetHeight, cursorY, cursorX, contentElement }) => {
      const prevItemReorder = store.state.itemsReordering.currentReorder;
      if (prevItemReorder == null || isAncestor(store, itemId, prevItemReorder.draggedItemId)) {
        return;
      }

      const action = chooseActionToApply({
        itemChildrenIndentation: params.itemChildrenIndentation,
        validActions,
        targetHeight,
        targetDepth: store.state.items.itemMetaLookup[itemId].depth!,
        cursorY,
        cursorX,
        contentElement,
      });

      const newPosition = action == null ? null : validActions[action]!;

      if (
        prevItemReorder.targetItemId === itemId &&
        prevItemReorder.action === action &&
        prevItemReorder.newPosition?.parentId === newPosition?.parentId &&
        prevItemReorder.newPosition?.index === newPosition?.index
      ) {
        return;
      }

      store.set('itemsReordering', {
        ...store.state.itemsReordering,
        currentReorder: {
          ...prevItemReorder,
          targetItemId: itemId,
          newPosition,
          action,
        },
      });
    },
    [store, params.itemChildrenIndentation],
  );

  useEnhancedEffect(() => {
    store.set('itemsReordering', {
      ...store.state.itemsReordering,
      isItemReorderable: params.itemsReordering
        ? (params.isItemReorderable ?? (() => true))
        : () => false,
    });
  }, [store, params.itemsReordering, params.isItemReorderable]);

  return {
    instance: {
      canItemBeDragged,
      getDroppingTargetValidActions,
      startDraggingItem,
      cancelDraggingItem,
      completeDraggingItem,
      setDragTargetItem,
    },
  };
};

useTreeViewItemsReordering.itemPlugin = useTreeViewItemsReorderingItemPlugin;

useTreeViewItemsReordering.applyDefaultValuesToParams = ({ params }) => ({
  ...params,
  itemsReordering: params.itemsReordering ?? false,
});

useTreeViewItemsReordering.getInitialState = (params) => ({
  itemsReordering: {
    currentReorder: null,
    isItemReorderable: params.itemsReordering
      ? (params.isItemReorderable ?? (() => true))
      : () => false,
  },
});

useTreeViewItemsReordering.params = {
  itemsReordering: true,
  isItemReorderable: true,
  canMoveItemToNewPosition: true,
  onItemPositionChange: true,
};
