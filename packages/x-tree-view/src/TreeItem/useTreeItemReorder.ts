import * as React from 'react';
import { useTreeViewContext } from '../internals/TreeViewProvider/useTreeViewContext';
import { DefaultTreeViewPlugins } from '../internals';

export const useTreeItemReorder = (nodeId: string, rootRef: React.RefObject<HTMLLIElement>) => {
  const { itemsReordering } = useTreeViewContext<DefaultTreeViewPlugins>();
  if (!itemsReordering) {
    return {
      rootProps: {},
      contentProps: {},
      dragTargetPosition: null,
    };
  }

  const rootProps: React.HTMLAttributes<HTMLLIElement> = itemsReordering.enabled
    ? {
        draggable: true,
        onDragStart: (event) => {
          if (event.target !== rootRef.current) {
            return;
          }

          itemsReordering.handleDragStart(nodeId);
        },
        onDragEnd: () => itemsReordering.handleDragEnd(nodeId),
      }
    : {};

  const contentProps: React.HTMLAttributes<HTMLDivElement> = {
    onDragOver: () => itemsReordering.handleDragOver(nodeId),
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dragTargetPosition = React.useMemo(() => {
    if (
      itemsReordering.currentDrag == null ||
      itemsReordering.currentDrag.targetNodeId !== nodeId ||
      itemsReordering.currentDrag.direction === 0
    ) {
      return null;
    }

    if (itemsReordering.currentDrag.direction === 1) {
      return 'bottom';
    }

    return 'top';
  }, [itemsReordering.currentDrag, nodeId]);

  return {
    rootProps,
    contentProps,
    dragTargetPosition,
  };
};
