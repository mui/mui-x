import * as React from 'react';
import { TreeViewPlugin } from '../../models';
import {
  TreeViewItemReorderPosition,
  TreeViewItemsReorderingAction,
  UseTreeViewItemsReorderingSignature,
} from './useTreeViewItemsReordering.types';
import { getNewPositionFromAction, isAncestor } from './useTreeViewItemsReordering.utils';
import { populateInstance } from '../../useTreeView/useTreeView.utils';

export const useTreeViewItemsReordering: TreeViewPlugin<UseTreeViewItemsReorderingSignature> = ({
  params,
  instance,
  state,
  setState,
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

  const getItemTargetValidActions = React.useCallback(
    (itemId: string): Record<TreeViewItemsReorderingAction, boolean> => {
      if (!state.itemsReordering) {
        throw new Error('There is no ongoing reordering.');
      }

      const canMoveItemToNewPosition = params.canMoveItemToNewPosition;
      const targetNode = instance.getNode(itemId);
      const draggedNode = instance.getNode(state.itemsReordering.draggedItemId);
      const oldPosition: TreeViewItemReorderPosition = {
        parentId: draggedNode.parentId,
        index: draggedNode.index,
      };

      const isNewPositionValid = (action: TreeViewItemsReorderingAction) => {
        const newPosition = getNewPositionFromAction({ instance, draggedNode, targetNode, action });

        // If the new position is equal to the old one, we don't want to show any dropping UI.
        if (
          newPosition.parentId === oldPosition.parentId &&
          newPosition.index === oldPosition.index
        ) {
          return false;
        }

        if (canMoveItemToNewPosition) {
          canMoveItemToNewPosition({
            itemId,
            oldPosition,
            newPosition: getNewPositionFromAction({ instance, draggedNode, targetNode, action }),
          });
        }

        return true;
      };

      return {
        'make-child': isNewPositionValid('make-child'),
        'reorder-above': targetNode.index === 0 && isNewPositionValid('reorder-above'),
        'reorder-below': !targetNode.expandable && isNewPositionValid('reorder-below'),
        'move-to-parent':
          targetNode.parentId != null &&
          targetNode.index === instance.getItemChildren(targetNode.parentId).length - 1 &&
          isNewPositionValid('move-to-parent'),
      };
    },
    [params.canMoveItemToNewPosition, instance, state.itemsReordering],
  );

  const startDraggingItem = React.useCallback(
    (itemId: string) => {
      setState((prevState) => ({
        ...prevState,
        itemsReordering: { targetItemId: itemId, draggedItemId: itemId, action: 'reorder-below' },
      }));
    },
    [setState],
  );

  const stopDraggingItem = React.useCallback(
    (itemId: string) => {
      if (state.itemsReordering == null || state.itemsReordering.draggedItemId !== itemId) {
        return;
      }

      setState((prevState) => ({ ...prevState, itemsReordering: null }));
      if (
        state.itemsReordering.draggedItemId === state.itemsReordering.targetItemId ||
        state.itemsReordering.action == null
      ) {
        return;
      }

      const draggedNode = instance.getNode(state.itemsReordering.draggedItemId);
      const targetNode = instance.getNode(state.itemsReordering.targetItemId);

      const newPosition = getNewPositionFromAction({
        instance,
        draggedNode,
        targetNode,
        action: state.itemsReordering.action,
      });
      instance.moveItem(itemId, newPosition.parentId, newPosition.index);
    },
    [setState, state.itemsReordering, instance],
  );

  const setDragTargetItem = React.useCallback(
    (itemId: string, action: TreeViewItemsReorderingAction | null) => {
      setState((prevState) => {
        if (
          prevState.itemsReordering == null ||
          isAncestor(instance, itemId, prevState.itemsReordering.draggedItemId)
        ) {
          return prevState;
        }

        if (
          prevState.itemsReordering.targetItemId === itemId &&
          prevState.itemsReordering.action === action
        ) {
          return prevState;
        }

        return {
          ...prevState,
          itemsReordering: {
            ...prevState.itemsReordering,
            targetItemId: itemId,
            action,
          },
        };
      });
    },
    [instance, setState],
  );

  populateInstance<UseTreeViewItemsReorderingSignature>(instance, {
    canItemBeDragged,
    getItemTargetValidActions,
    startDraggingItem,
    stopDraggingItem,
    setDragTargetItem,
  });

  return {
    contextValue: {
      itemsReordering: {
        enabled: params.itemsReordering ?? false,
        currentDrag: state.itemsReordering,
      },
    },
  };
};

useTreeViewItemsReordering.getDefaultizedParams = (params) => ({
  ...params,
  itemsReordering: params.itemsReordering ?? false,
});

useTreeViewItemsReordering.getInitialState = () => ({ itemsReordering: null });

useTreeViewItemsReordering.params = {
  itemsReordering: true,
  isItemReorderable: true,
  canMoveItemToNewPosition: true,
};
