import { TreeViewInstance } from '../models';
import type { UseTreeViewExpansionSignature } from '../plugins/useTreeViewExpansion';
import type { UseTreeViewItemsSignature } from '../plugins/useTreeViewItems';

const getLastNavigableItemInArray = (
  instance: TreeViewInstance<[UseTreeViewItemsSignature]>,
  items: string[],
) => {
  // Equivalent to Array.prototype.findLastIndex
  let itemIndex = items.length - 1;
  while (itemIndex >= 0 && !instance.isItemNavigable(items[itemIndex])) {
    itemIndex -= 1;
  }

  if (itemIndex === -1) {
    return undefined;
  }

  return items[itemIndex];
};

export const getPreviousNavigableItem = (
  instance: TreeViewInstance<[UseTreeViewItemsSignature, UseTreeViewExpansionSignature]>,
  itemId: string,
) => {
  const itemMeta = instance.getNode(itemId);
  const siblings = instance.getChildrenIds(itemMeta.parentId);
  const itemIndex = siblings.indexOf(itemId);

  // TODO: What should we do if the parent is not navigable?
  if (itemIndex === 0) {
    return itemMeta.parentId;
  }

  let currentItemId: string = siblings[itemIndex - 1];
  let lastNavigableChild = getLastNavigableItemInArray(
    instance,
    instance.getChildrenIds(currentItemId),
  );
  while (instance.isItemExpanded(currentItemId) && lastNavigableChild != null) {
    currentItemId = lastNavigableChild;
    lastNavigableChild = instance.getChildrenIds(currentItemId).find(instance.isItemNavigable);
  }

  return currentItemId;
};

export const getNextNavigableItem = (
  instance: TreeViewInstance<[UseTreeViewExpansionSignature, UseTreeViewItemsSignature]>,
  itemId: string,
) => {
  // If the item is expanded and has some navigable children, return the first of them.
  if (instance.isItemExpanded(itemId)) {
    const firstNavigableChild = instance.getChildrenIds(itemId).find(instance.isItemNavigable);
    if (firstNavigableChild != null) {
      return firstNavigableChild;
    }
  }

  let itemMeta = instance.getNode(itemId);
  while (itemMeta != null) {
    // Try to find the first navigable sibling after the current item.
    const siblings = instance.getChildrenIds(itemMeta.parentId);
    const currentItemIndex = siblings.indexOf(itemMeta.id);

    if (currentItemIndex < siblings.length - 1) {
      let nextItemIndex = currentItemIndex + 1;
      while (
        !instance.isItemNavigable(siblings[nextItemIndex]) &&
        nextItemIndex < siblings.length - 1
      ) {
        nextItemIndex += 1;
      }

      if (instance.isItemNavigable(siblings[nextItemIndex])) {
        return siblings[nextItemIndex];
      }
    }

    // If the sibling does not exist, go up a level to the parent and try again.
    itemMeta = instance.getNode(itemMeta.parentId!);
  }

  return null;
};

export const getLastNavigableItem = (
  instance: TreeViewInstance<[UseTreeViewExpansionSignature, UseTreeViewItemsSignature]>,
) => {
  let itemId: string | null = null;
  while (itemId == null || instance.isItemExpanded(itemId)) {
    const children = instance.getChildrenIds(itemId);
    const lastNavigableChild = getLastNavigableItemInArray(instance, children);

    // The item has no navigable children.
    if (lastNavigableChild == null) {
      return itemId!;
    }

    itemId = lastNavigableChild;
  }

  return itemId!;
};

export const getFirstNavigableItem = (instance: TreeViewInstance<[UseTreeViewItemsSignature]>) =>
  instance.getChildrenIds(null).find(instance.isItemNavigable)!;

/**
 * This is used to determine the start and end of a selection range so
 * we can get the items between the two border items.
 *
 * It finds the items' common ancestor using
 * a naive implementation of a lowest common ancestor algorithm
 * (https://en.wikipedia.org/wiki/Lowest_common_ancestor).
 * Then compares the ancestor's 2 children that are ancestors of itemA and ItemB
 * so we can compare their indexes to work out which item comes first in a depth first search.
 * (https://en.wikipedia.org/wiki/Depth-first_search)
 *
 * Another way to put it is which item is shallower in a trémaux tree
 * https://en.wikipedia.org/wiki/Tr%C3%A9maux_tree
 */
const findOrderInTremauxTree = (
  instance: TreeViewInstance<[UseTreeViewItemsSignature]>,
  nodeAId: string,
  nodeBId: string,
) => {
  if (nodeAId === nodeBId) {
    return [nodeAId, nodeBId];
  }

  const nodeA = instance.getNode(nodeAId);
  const nodeB = instance.getNode(nodeBId);

  if (nodeA.parentId === nodeB.id || nodeB.parentId === nodeA.id) {
    return nodeB.parentId === nodeA.id ? [nodeA.id, nodeB.id] : [nodeB.id, nodeA.id];
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
  const ancestorFamily = instance.getChildrenIds(commonAncestor);

  const aSide = aFamily[aFamily.indexOf(commonAncestor) - 1];
  const bSide = bFamily[bFamily.indexOf(commonAncestor) - 1];

  return ancestorFamily.indexOf(aSide!) < ancestorFamily.indexOf(bSide!)
    ? [nodeAId, nodeBId]
    : [nodeBId, nodeAId];
};

export const getNavigableItemsInRange = (
  instance: TreeViewInstance<[UseTreeViewItemsSignature, UseTreeViewExpansionSignature]>,
  itemAId: string,
  itemBId: string,
) => {
  const [firstItemId, lastItemId] = findOrderInTremauxTree(instance, itemAId, itemBId);
  const items = [firstItemId];

  let currentItemSiblings = instance.getChildrenIds(instance.getNode(firstItemId).parentId);
  let currentItemIndex = currentItemSiblings.indexOf(firstItemId);

  while (currentItemSiblings[currentItemIndex] !== lastItemId) {
    const currentItemId = currentItemSiblings[currentItemIndex];
    // If the item is expanded, get its first children.
    if (instance.isItemExpanded(currentItemId)) {
      currentItemSiblings = instance.getChildrenIds(currentItemId);
      currentItemIndex = 0;
    }
    // If the item is not the last of its siblings, get the next of them
    else if (currentItemIndex < currentItemSiblings.length - 1) {
      currentItemIndex += 1;
    }
    // If the item is the last of its siblings, get the next siblings of its parent
    else {
      const parentId = instance.getNode(currentItemId).parentId!;
      currentItemSiblings = instance.getChildrenIds(instance.getNode(parentId).parentId);
      currentItemIndex = currentItemSiblings.indexOf(parentId) + 1;
    }

    items.push(currentItemId);
  }

  items.push(lastItemId);

  return items.filter(instance.isItemNavigable);
};
