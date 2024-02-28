import * as React from 'react';
import { useTreeViewContext } from '../internals/TreeViewProvider/useTreeViewContext';
import { DefaultTreeViewPlugins } from '../internals';

export const useTreeItemReorder = (nodeId: string): React.HTMLAttributes<HTMLLIElement> => {
  const { itemsReordering } = useTreeViewContext<DefaultTreeViewPlugins>();

  if (!itemsReordering.enabled) {
    return {};
  }

  return {
    draggable: true,
    onDragStart: () => itemsReordering.handleDragStart(nodeId),
    onDragOver: () => itemsReordering.handleDragOver(nodeId),
    onDragEnd: () => itemsReordering.handleDragEnd(nodeId),
  };
};
