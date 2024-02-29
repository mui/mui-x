import {
  TreeViewAnyPluginSignature,
  TreeViewInstance,
  TreeViewUsedInstance,
  TreeViewUsedPublicAPI,
} from '../models';
import type { UseTreeViewExpansionSignature } from '../plugins/useTreeViewExpansion';
import type { UseTreeViewNodesSignature } from '../plugins/useTreeViewNodes';

export const getPreviousNode = (
  instance: TreeViewInstance<[UseTreeViewNodesSignature, UseTreeViewExpansionSignature]>,
  nodeId: string,
) => {
  const node = instance.getNode(nodeId);
  const siblings = instance.getNavigableChildrenIds(node.parentId);
  const nodeIndex = siblings.indexOf(nodeId);

  if (nodeIndex === 0) {
    return node.parentId;
  }

  let currentNode: string = siblings[nodeIndex - 1];
  while (
    instance.isNodeExpanded(currentNode) &&
    instance.getNavigableChildrenIds(currentNode).length > 0
  ) {
    currentNode = instance.getNavigableChildrenIds(currentNode).pop()!;
  }

  return currentNode;
};

export const getNextNode = (
  instance: TreeViewInstance<[UseTreeViewExpansionSignature, UseTreeViewNodesSignature]>,
  nodeId: string,
) => {
  // If expanded get first child
  if (instance.isNodeExpanded(nodeId) && instance.getNavigableChildrenIds(nodeId).length > 0) {
    return instance.getNavigableChildrenIds(nodeId)[0];
  }

  let node = instance.getNode(nodeId);
  while (node != null) {
    // Try to get next sibling
    const siblings = instance.getNavigableChildrenIds(node.parentId);
    const nextSibling = siblings[siblings.indexOf(node.id) + 1];

    if (nextSibling) {
      return nextSibling;
    }

    // If the sibling does not exist, go up a level to the parent and try again.
    node = instance.getNode(node.parentId!);
  }

  return null;
};

export const getLastNode = (
  instance: TreeViewInstance<[UseTreeViewExpansionSignature, UseTreeViewNodesSignature]>,
) => {
  let lastNode = instance.getNavigableChildrenIds(null).pop()!;

  while (instance.isNodeExpanded(lastNode)) {
    lastNode = instance.getNavigableChildrenIds(lastNode).pop()!;
  }
  return lastNode;
};

export const getFirstNode = (instance: TreeViewInstance<[UseTreeViewNodesSignature]>) =>
  instance.getNavigableChildrenIds(null)[0];

export const populateInstance = <T extends TreeViewAnyPluginSignature>(
  instance: TreeViewUsedInstance<T>,
  methods: T['instance'],
) => {
  Object.assign(instance, methods);
};

export const populatePublicAPI = <T extends TreeViewAnyPluginSignature>(
  publicAPI: TreeViewUsedPublicAPI<T>,
  methods: T['publicAPI'],
) => {
  Object.assign(publicAPI, methods);
};
