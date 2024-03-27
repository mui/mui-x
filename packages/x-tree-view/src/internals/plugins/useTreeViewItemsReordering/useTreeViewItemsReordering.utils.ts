import { TreeViewInstance, TreeViewNode } from '../../models';
import { UseTreeViewNodesSignature } from '../useTreeViewNodes';
import {
  TreeViewItemReorderPosition,
  TreeViewItemsReorderingAction,
} from './useTreeViewItemsReordering.types';

/**
 * Checks if the node with the id nodeIdB is an ancestor of the node with the id nodeIdA
 */
export const isAncestor = (
  instance: TreeViewInstance<[UseTreeViewNodesSignature]>,
  nodeIdA: string,
  nodeIdB: string,
): boolean => {
  const nodeA = instance.getNode(nodeIdA);
  if (nodeA.parentId === nodeIdB) {
    return true;
  }

  if (nodeA.parentId == null) {
    return false;
  }

  return isAncestor(instance, nodeA.parentId, nodeIdB);
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
