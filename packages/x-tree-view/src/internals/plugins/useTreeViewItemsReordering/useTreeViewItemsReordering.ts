import * as React from 'react';
import { TreeViewPlugin } from '../../models';
import {
  UseTreeViewItemsReorderingHandler,
  UseTreeViewItemsReorderingSignature,
} from './useTreeViewItemsReordering.types';
import { populateInstance } from '../../useTreeView/useTreeView.utils';

export const useTreeViewItemsReordering: TreeViewPlugin<UseTreeViewItemsReorderingSignature> = ({
  params,
  instance,
  state,
  setState,
}) => {
  const isNodeDragTarget = React.useCallback(
    (nodeId: string) => state.itemsReordering?.targetNodeId === nodeId,
    [state.itemsReordering],
  );

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
        if (prevState.itemsReordering == null) {
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
    [setState],
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

  populateInstance<UseTreeViewItemsReorderingSignature>(instance, { isNodeDragTarget });

  const itemsReorderHandler = React.useMemo<UseTreeViewItemsReorderingHandler>(
    () => ({
      enabled: params.itemsReordering ?? false,
      handleDragStart,
      handleDragOver,
      handleDragEnd,
    }),
    [params.itemsReordering, handleDragStart, handleDragOver, handleDragEnd],
  );

  return {
    contextValue: {
      itemsReordering: itemsReorderHandler,
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
