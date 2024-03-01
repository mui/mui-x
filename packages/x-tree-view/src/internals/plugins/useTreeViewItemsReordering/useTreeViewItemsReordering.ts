import * as React from 'react';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewItemsReorderingSignature } from './useTreeViewItemsReordering.types';
import { isAncestor } from './useTreeViewItemsReordering.utils';
import { compareNodePositionsInTree } from '../../utils/tree';

export const useTreeViewItemsReordering: TreeViewPlugin<UseTreeViewItemsReorderingSignature> = ({
  params,
  instance,
  state,
  setState,
}) => {
  const handleDragStart = React.useCallback(
    (nodeId: string) => {
      setState((prevState) => ({
        ...prevState,
        itemsReordering: { targetNodeId: nodeId, draggedNodeId: nodeId },
      }));
    },
    [setState],
  );

  const handleDragOver = React.useCallback(
    (nodeId: string) => {
      setState((prevState) => {
        if (
          prevState.itemsReordering == null ||
          prevState.itemsReordering.targetNodeId === nodeId ||
          isAncestor(instance, nodeId, prevState.itemsReordering.draggedNodeId)
        ) {
          return prevState;
        }

        return {
          ...prevState,
          itemsReordering: {
            ...prevState.itemsReordering,
            targetNodeId: nodeId,
          },
        };
      });
    },
    [instance, setState],
  );

  const handleDragEnd = React.useCallback(
    (nodeId: string) => {
      if (state.itemsReordering == null) {
        return;
      }

      setState((prevState) => ({ ...prevState, itemsReordering: null }));
      if (state.itemsReordering.draggedNodeId === state.itemsReordering.targetNodeId) {
        return;
      }

      const targetNode = instance.getNode(state.itemsReordering.targetNodeId);
      instance.moveItem(nodeId, targetNode.parentId, targetNode.index);
    },
    [setState, state.itemsReordering, instance],
  );

  return {
    contextValue: {
      itemsReordering: {
        enabled: params.itemsReordering ?? false,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        currentDrag:
          state.itemsReordering == null
            ? null
            : {
                targetNodeId: state.itemsReordering.targetNodeId,
                direction: compareNodePositionsInTree(
                  instance,
                  state.itemsReordering.draggedNodeId,
                  state.itemsReordering.targetNodeId,
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
