import { TreeViewItemId } from '../../../models';
import { TreeViewNode } from '../../models';
import {
  TreeViewNodeIdAndChildren,
  TreeViewNodeMap,
  UseTreeViewNodesState,
} from './useTreeViewNodes.types';

/**
 * Determines the list of ids needed to reach an item in the tree.
 */
const getNodePathInTree = ({ node, nodeMap }: { node: TreeViewNode; nodeMap: TreeViewNodeMap }) => {
  const path: TreeViewItemId[] = [];
  let currentAncestor = node;
  while (currentAncestor.parentId != null) {
    path.unshift(currentAncestor.parentId);
    currentAncestor = nodeMap[currentAncestor.parentId];
  }

  return path;
};

export const moveItemInTree = <R extends { children?: R[] }>({
  nodeToMoveId,
  state,
  newParentId,
  newIndex,
}: {
  nodeToMoveId: TreeViewItemId;
  state: UseTreeViewNodesState<R>;
  newParentId: TreeViewItemId | null;
  newIndex: number;
}): UseTreeViewNodesState<R> => {
  const nodeToMove = state.nodeMap[nodeToMoveId];

  /**
   * 1. Update the `nodeMap`.
   */
  const nodeMap: TreeViewNodeMap = {};
  /* eslint-disable no-lonely-if */
  Object.keys(state.nodeMap).forEach((nodeId) => {
    const node = state.nodeMap[nodeId];

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
          if (node.index > newIndex) {
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

  /**
   * 2. Update the `nodeTree`.
   */
  let nodeTree: TreeViewNodeIdAndChildren[];
  if (nodeToMove.parentId === newParentId) {
    nodeTree = state.nodeTree;
  } else {
    const walkTree = (
      nodeIdAndChildren: TreeViewNodeIdAndChildren[],
      path: string[],
    ): TreeViewNodeIdAndChildren[] => {
      if (path.length === 0) {
        return nodeIdAndChildren.filter((el) => el.id !== nodeToMoveId);
      }

      const [parentId, ...remainingPath] = path;
      return nodeIdAndChildren.map((el) => {
        if (el.id === parentId) {
          return {
            id: el.id,
            children: walkTree(el.children!, remainingPath),
          };
        }

        return el;
      });
    };

    nodeTree = walkTree(
      state.nodeTree,
      getNodePathInTree({ node: nodeToMove, nodeMap: state.nodeMap }),
    );
  }

  return {
    ...state,
    nodeTree,
    nodeMap,
  };
};
