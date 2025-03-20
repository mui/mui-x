import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import {
  TreeViewPlugin,
  selectorItemIndex,
  selectorItemMeta,
  selectorItemOrderedChildrenIds,
} from '@mui/x-tree-view/internals';
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
import { selectorCurrentItemReordering } from './useTreeViewItemsReordering.selectors';

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
      const currentReorder = selectorCurrentItemReordering(store.value);
      if (!currentReorder) {
        throw new Error('There is no ongoing reordering.');
      }

      if (itemId === currentReorder.draggedItemId) {
        return {};
      }

      const canMoveItemToNewPosition = params.canMoveItemToNewPosition;
      const targetItemMeta = selectorItemMeta(store.value, itemId)!;
      const targetItemIndex = selectorItemIndex(store.value, targetItemMeta.id);
      const draggedItemMeta = selectorItemMeta(store.value, currentReorder.draggedItemId)!;
      const draggedItemIndex = selectorItemIndex(store.value, draggedItemMeta.id);

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
        'reorder-below': targetItemMeta.expandable
          ? null
          : {
              parentId: targetItemMeta.parentId,
              index:
                targetItemMeta.parentId === draggedItemMeta.parentId &&
                targetItemIndex > draggedItemIndex
                  ? targetItemIndex
                  : targetItemIndex + 1,
            },
        'move-to-parent':
          targetItemMeta.parentId == null
            ? null
            : {
                parentId: targetItemMeta.parentId,
                index: selectorItemOrderedChildrenIds(store.value, targetItemMeta.parentId).length,
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
      store.update((prevState) => ({
        ...prevState,
        itemsReordering: {
          ...prevState.itemsReordering,
          currentReorder: {
            targetItemId: itemId,
            draggedItemId: itemId,
            action: null,
            newPosition: null,
          },
        },
      }));
    },
    [store],
  );

  const stopDraggingItem = React.useCallback(
    (itemId: string) => {
      const currentReorder = selectorCurrentItemReordering(store.value);
      if (currentReorder == null || currentReorder.draggedItemId !== itemId) {
        return;
      }

      if (
        currentReorder.draggedItemId === currentReorder.targetItemId ||
        currentReorder.action == null ||
        currentReorder.newPosition == null
      ) {
        store.update((prevState) => ({
          ...prevState,
          itemsReordering: { ...prevState.itemsReordering, currentReorder: null },
        }));
        return;
      }

      const draggedItemMeta = selectorItemMeta(store.value, currentReorder.draggedItemId)!;

      const oldPosition: TreeViewItemReorderPosition = {
        parentId: draggedItemMeta.parentId,
        index: selectorItemIndex(store.value, draggedItemMeta.id),
      };

      const newPosition = currentReorder.newPosition;

      store.update((prevState) => ({
        ...prevState,
        itemsReordering: {
          ...prevState.itemsReordering,
          currentReorder: null,
        },
        items: moveItemInTree({
          itemToMoveId: itemId,
          newPosition,
          oldPosition,
          prevState: prevState.items,
        }),
      }));

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
      store.update((prevState) => {
        const prevItemReorder = prevState.itemsReordering.currentReorder;
        if (prevItemReorder == null || isAncestor(store, itemId, prevItemReorder.draggedItemId)) {
          return prevState;
        }
        const action = chooseActionToApply({
          itemChildrenIndentation: params.itemChildrenIndentation,
          validActions,
          targetHeight,
          targetDepth: prevState.items.itemMetaLookup[itemId].depth!,
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
          return prevState;
        }

        return {
          ...prevState,
          itemsReordering: {
            ...prevState.itemsReordering,
            currentReorder: {
              ...prevItemReorder,
              targetItemId: itemId,
              newPosition,
              action,
            },
          },
        };
      });
    },
    [store, params.itemChildrenIndentation],
  );

  useEnhancedEffect(() => {
    store.update((prevState) => ({
      ...prevState,
      itemsReordering: {
        ...prevState.itemsReordering,
        isItemReorderable: params.itemsReordering
          ? (params.isItemReorderable ?? (() => true))
          : () => false,
      },
    }));
  }, [store, params.itemsReordering, params.isItemReorderable]);

  return {
    instance: {
      canItemBeDragged,
      getDroppingTargetValidActions,
      startDraggingItem,
      stopDraggingItem,
      setDragTargetItem,
    },
  };
};

useTreeViewItemsReordering.itemPlugin = useTreeViewItemsReorderingItemPlugin;

useTreeViewItemsReordering.getDefaultizedParams = ({ params }) => ({
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
