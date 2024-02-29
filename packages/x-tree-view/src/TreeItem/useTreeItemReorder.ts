import * as React from 'react';
import { useTreeViewContext } from '../internals/TreeViewProvider/useTreeViewContext';
import { DefaultTreeViewPlugins } from '../internals';

export const useTreeItemReorder = (nodeId: string) => {
  const { itemsReordering, instance } = useTreeViewContext<DefaultTreeViewPlugins>();

  const rootProps: React.HTMLAttributes<HTMLLIElement> = itemsReordering.enabled
    ? {
        draggable: true,
        onDragStart: () => itemsReordering.handleDragStart(nodeId),
        onDragEnd: () => itemsReordering.handleDragEnd(nodeId),
      }
    : {};

  const contentProps: React.HTMLAttributes<HTMLDivElement> = {
    onDragOver: () => itemsReordering.handleDragOver(nodeId),
  };

  const isDragTarget = itemsReordering.enabled ? instance.isNodeDragTarget(nodeId) : false;

  return {
    rootProps,
    contentProps,
    isDragTarget,
  };
};
