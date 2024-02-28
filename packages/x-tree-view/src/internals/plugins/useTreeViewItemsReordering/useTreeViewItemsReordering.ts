import * as React from 'react';
import { TreeViewPlugin } from '../../models';
import {
  UseTreeViewItemsReorderingHandler,
  UseTreeViewItemsReorderingSignature,
} from './useTreeViewItemsReordering.types';

export const useTreeViewItemsReordering: TreeViewPlugin<UseTreeViewItemsReorderingSignature> = ({
  params,
  instance,
  setState,
}) => {
  const targetNodeIdRef = React.useRef<string | null>(null);

  const handleDragStart = React.useCallback(
    (nodeId: string) => {
      setState((prevState) => ({ ...prevState, draggedNodeId: nodeId }));
    },
    [setState],
  );

  const handleDragOver = React.useCallback((nodeId: string) => {
    targetNodeIdRef.current = nodeId;
  }, []);

  const handleDragEnd = React.useCallback(
    (nodeId: string) => {
      if (targetNodeIdRef.current == null) {
        return;
      }

      const targetNode = instance.getNode(targetNodeIdRef.current);

      targetNodeIdRef.current = null;
      setState((prevState) => ({ ...prevState, draggedNodeId: null }));

      instance.moveItem(nodeId, targetNode.parentId, targetNode.index);
    },
    [setState, instance],
  );

  const itemsReorderHandler = React.useMemo<UseTreeViewItemsReorderingHandler>(
    () => ({
      enabled: params.itemsReordering ?? false,
      handleDragStart,
      handleDragOver,
      handleDragEnd,
    }),
    [params.itemsReordering, handleDragStart, handleDragEnd],
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

useTreeViewItemsReordering.getInitialState = () => ({ draggedNodeId: null });

useTreeViewItemsReordering.params = {
  itemsReordering: true,
};
