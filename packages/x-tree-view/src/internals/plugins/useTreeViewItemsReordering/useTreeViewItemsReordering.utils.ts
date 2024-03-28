import { TreeViewInstance, TreeViewNode } from '../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import {
  TreeViewItemReorderPosition,
  TreeViewItemsReorderingAction,
} from './useTreeViewItemsReordering.types';

/**
 * Checks if the item with the id itemIdB is an ancestor of the item with the id itemIdA.
 */
export const isAncestor = (
  instance: TreeViewInstance<[UseTreeViewItemsSignature]>,
  itemIdA: string,
  itemIdB: string,
): boolean => {
  const nodeA = instance.getNode(itemIdA);
  if (nodeA.parentId === itemIdB) {
    return true;
  }

  if (nodeA.parentId == null) {
    return false;
  }

  return isAncestor(instance, nodeA.parentId, itemIdB);
};

export const getNewPositionFromAction = (
  {
    draggedNode,
    targetNode,
    action,
  }: {
    draggedNode: TreeViewNode;
    targetNode: TreeViewNode;
    action: TreeViewItemsReorderingAction;
  },
  // eslint-disable-next-line consistent-return
): TreeViewItemReorderPosition => {
  // eslint-disable-next-line default-case
  switch (action) {
    case 'make-child': {
      return { parentId: targetNode.id, index: 0 };
    }

    case 'reorder-above': {
      return {
        parentId: targetNode.parentId,
        index:
          targetNode.parentId === draggedNode.parentId && targetNode.index > draggedNode.index
            ? targetNode.index - 1
            : targetNode.index,
      };
    }

    case 'reorder-below': {
      return { parentId: targetNode.parentId, index: targetNode.index + 1 };
    }
  }
};
