import { TreeViewInstance } from '../models';
import { UseTreeViewNodesSignature } from '../plugins/useTreeViewNodes';

/**
 * This is used to determine if a node is before or after another node in the tree.
 *
 * It finds the nodes' common ancestor using
 * a naive implementation of a lowest common ancestor algorithm
 * (https://en.wikipedia.org/wiki/Lowest_common_ancestor).
 * Then compares the ancestor's 2 children that are ancestors of nodeA and NodeB
 * so we can compare their indexes to work out which node comes first in a depth first search.
 * (https://en.wikipedia.org/wiki/Depth-first_search)
 *
 * Another way to put it is which node is shallower in a trémaux tree
 * https://en.wikipedia.org/wiki/Tr%C3%A9maux_tree
 *
 * @returns 0 if both nodes are equal, -1 if nodeA is after nodeB, 1 if nodeB is after nodeA.
 */
export const compareNodePositionsInTree = (
  instance: TreeViewInstance<[UseTreeViewNodesSignature]>,
  nodeAId: string,
  nodeBId: string,
): -1 | 0 | 1 => {
  // By convention when comparing a node with itself, we consider it to be after.
  if (nodeAId === nodeBId) {
    return 0;
  }

  const nodeA = instance.getNode(nodeAId);
  const nodeB = instance.getNode(nodeBId);

  if (nodeA.parentId === nodeB.id || nodeB.parentId === nodeA.id) {
    return nodeB.parentId === nodeA.id ? 1 : -1;
  }

  const aFamily: (string | null)[] = [nodeA.id];
  const bFamily: (string | null)[] = [nodeB.id];

  let aAncestor = nodeA.parentId;
  let bAncestor = nodeB.parentId;

  let aAncestorIsCommon = bFamily.indexOf(aAncestor) !== -1;
  let bAncestorIsCommon = aFamily.indexOf(bAncestor) !== -1;

  let continueA = true;
  let continueB = true;

  while (!bAncestorIsCommon && !aAncestorIsCommon) {
    if (continueA) {
      aFamily.push(aAncestor);
      aAncestorIsCommon = bFamily.indexOf(aAncestor) !== -1;
      continueA = aAncestor !== null;
      if (!aAncestorIsCommon && continueA) {
        aAncestor = instance.getNode(aAncestor!).parentId;
      }
    }

    if (continueB && !aAncestorIsCommon) {
      bFamily.push(bAncestor);
      bAncestorIsCommon = aFamily.indexOf(bAncestor) !== -1;
      continueB = bAncestor !== null;
      if (!bAncestorIsCommon && continueB) {
        bAncestor = instance.getNode(bAncestor!).parentId;
      }
    }
  }

  const commonAncestor = aAncestorIsCommon ? aAncestor : bAncestor;
  const ancestorFamily = instance.getItemChildren(commonAncestor);

  const aSide = aFamily[aFamily.indexOf(commonAncestor) - 1];
  const bSide = bFamily[bFamily.indexOf(commonAncestor) - 1];

  return ancestorFamily.indexOf(aSide!) < ancestorFamily.indexOf(bSide!) ? 1 : -1;
};
