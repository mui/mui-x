import * as React from 'react';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewItemsReorderingSignature } from './useTreeViewItemsReordering.types';
import { isAncestor } from './useTreeViewItemsReordering.utils';
import { compareNodePositionsInTree } from '../../utils/tree';
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
        itemsReordering: { targetItemId: itemId, draggedItemId: itemId },
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
      instance.moveItem(itemId, targetNode.parentId, targetNode.index);
    },
    [setState, state.itemsReordering, instance],
  );

  const setDragTargetItem = React.useCallback(
    (itemId: string) => {
      setState((prevState) => {
        if (
          prevState.itemsReordering == null ||
          prevState.itemsReordering.targetItemId === itemId ||
          isAncestor(instance, itemId, prevState.itemsReordering.draggedItemId)
        ) {
          return prevState;
        }

        return {
          ...prevState,
          itemsReordering: {
            ...prevState.itemsReordering,
            targetItemId: itemId,
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
        currentDrag:
          state.itemsReordering == null
            ? null
            : {
                draggedItemId: state.itemsReordering.draggedItemId,
                targetItemId: state.itemsReordering.targetItemId,
                direction: compareNodePositionsInTree(
                  instance,
                  state.itemsReordering.draggedItemId,
                  state.itemsReordering.targetItemId,
                ),
              },
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
