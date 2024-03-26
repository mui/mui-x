import * as React from 'react';
import { TreeViewPlugin } from '../../models';
import {
  TreeViewItemsReorderingAction,
  UseTreeViewItemsReorderingSignature,
} from './useTreeViewItemsReordering.types';
import { isAncestor } from './useTreeViewItemsReordering.utils';
import { populateInstance } from '../../useTreeView/useTreeView.utils';

export const useTreeViewItemsReordering: TreeViewPlugin<UseTreeViewItemsReorderingSignature> = ({
  params,
  instance,
  state,
  setState,
}) => {
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
      if (state.itemsReordering.draggedItemId === state.itemsReordering.targetItemId) {
        return;
      }

      const targetNode = instance.getNode(state.itemsReordering.targetItemId);

      // eslint-disable-next-line default-case
      switch (state.itemsReordering.action) {
        case 'make-child': {
          instance.moveItem(itemId, targetNode.id, 0);
          break;
        }

        case 'reorder-above': {
          instance.moveItem(itemId, targetNode.parentId, targetNode.index);
          break;
        }

        case 'reorder-below': {
          instance.moveItem(itemId, targetNode.parentId, targetNode.index + 1);
          break;
        }
      }
    },
    [setState, state.itemsReordering, instance],
  );

  const setDragTargetItem = React.useCallback(
    (itemId: string, action: TreeViewItemsReorderingAction) => {
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

  populateInstance(instance, { startDraggingItem, stopDraggingItem, setDragTargetItem });

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
};
