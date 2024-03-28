import { TreeViewItemId } from '../../../models';
import { TreeViewNodeMap, UseTreeViewItemsState } from './useTreeViewItems.types';

export const TREE_VIEW_ROOT_PARENT_ID = '__TREE_VIEW_ROOT_PARENT_ID__';

export const moveItemInTree = <R extends { children?: R[] }>({
  nodeToMoveId,
  prevState,
  newParentId,
  newIndex,
}: {
  nodeToMoveId: TreeViewItemId;
  prevState: UseTreeViewItemsState<R>['items'];
  newParentId: TreeViewItemId | null;
  newIndex: number;
}): UseTreeViewItemsState<R>['items'] => {
  const nodeToMove = prevState.nodeMap[nodeToMoveId];

  // 1. Update the `nodeMap`.
  const nodeMap: TreeViewNodeMap = {};
  /* eslint-disable no-lonely-if */
  Object.keys(prevState.nodeMap).forEach((nodeId) => {
    const node = prevState.nodeMap[nodeId];

    if (node.id === nodeToMoveId) {
      nodeMap[node.id] = { ...node, parentId: newParentId, index: newIndex };
    } else {
      let indexShift = 0;

      if (nodeToMove.parentId === newParentId) {
        // Fix the indexes of the moved node's siblings
        if (node.parentId === nodeToMove.parentId) {
          if (node.index > nodeToMove.index) {
            indexShift -= 1;
          }
          if (node.index > newIndex || (node.index === newIndex && nodeToMove.index > newIndex)) {
            indexShift += 1;
          }
        }
      } else {
        // Fix the indexes of the moved node's new siblings
        if (node.parentId === newParentId && node.index >= newIndex) {
          indexShift = 1;
        }
        // Fix the indexes of the moved node's old siblings
        else if (node.parentId === nodeToMove.parentId && node.index >= nodeToMove.index) {
          indexShift = -1;
        }
      }

      if (indexShift !== 0) {
        nodeMap[node.id] = { ...node, index: node.index + indexShift };
      } else {
        nodeMap[node.id] = node;
      }
    }
  });
  /* eslint-enable no-lonely-if */

  // 2. Update the `nodeTree`.
  const nodeTree = { ...prevState.nodeTree };
  const oldParentKey = nodeToMove.parentId ?? TREE_VIEW_ROOT_PARENT_ID;
  const newParentKey = newParentId ?? TREE_VIEW_ROOT_PARENT_ID;

  if (nodeToMove.parentId === newParentId) {
    const updatedChildren = [...nodeTree[oldParentKey]];
    updatedChildren.splice(nodeToMove.index, 1);
    updatedChildren.splice(newIndex, 0, nodeToMoveId);
    nodeTree[nodeToMove.parentId ?? TREE_VIEW_ROOT_PARENT_ID] = updatedChildren;
  } else {
    nodeTree[oldParentKey] = nodeTree[oldParentKey].filter((nodeId) => nodeId !== nodeToMoveId);
    const updatedNewParentChildren = [...nodeTree[newParentKey]];
    updatedNewParentChildren.splice(newIndex, 0, nodeToMoveId);
    nodeTree[newParentKey] = updatedNewParentChildren;
  }

  return {
    ...prevState,
    nodeTree,
    nodeMap,
  };
};
