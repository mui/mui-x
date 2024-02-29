import { TreeViewInstance } from '../../models';
import { UseTreeViewNodesSignature } from '../useTreeViewNodes';

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
