import { TreeViewInstance } from '../models';

export const getPreviousNode = (instance: TreeViewInstance, nodeId: string) => {
  const node = instance.nodeMap[nodeId];
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

export const getNextNode = (instance: TreeViewInstance, nodeId: string) => {
  // If expanded get first child
  if (instance.isNodeExpanded(nodeId) && instance.getNavigableChildrenIds(nodeId).length > 0) {
    return instance.getNavigableChildrenIds(nodeId)[0];
  }

  let node = instance.nodeMap[nodeId];
  while (node != null) {
    // Try to get next sibling
    const siblings = instance.getNavigableChildrenIds(node.parentId);
    const nextSibling = siblings[siblings.indexOf(node.id) + 1];

    if (nextSibling) {
      return nextSibling;
    }

    // If the sibling does not exist, go up a level to the parent and try again.
    node = instance.nodeMap[node.parentId!];
  }

  return null;
};

export const getLastNode = (instance: TreeViewInstance) => {
  let lastNode = instance.getNavigableChildrenIds(null).pop()!;

  while (instance.isNodeExpanded(lastNode)) {
    lastNode = instance.getNavigableChildrenIds(lastNode).pop()!;
  }
  return lastNode;
};

export const getFirstNode = (instance: TreeViewInstance) =>
  instance.getNavigableChildrenIds(null)[0];

export const populateInstance = <M extends Partial<TreeViewInstance>>(
  instance: TreeViewInstance,
  methods: M,
) => {
  Object.assign(instance, methods);
};
