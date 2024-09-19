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
): string | null => {
  const itemMeta = instance.getItemMeta(itemId);
  const siblings = instance.getItemOrderedChildrenIds(itemMeta.parentId);
  const itemIndex = instance.getItemIndex(itemId);

  // TODO: What should we do if the parent is not navigable?
  if (itemIndex === 0) {
    return itemMeta.parentId;
  }

  // Finds the previous navigable sibling.
  let previousNavigableSiblingIndex = itemIndex - 1;
  while (
    !instance.isItemNavigable(siblings[previousNavigableSiblingIndex]) &&
    previousNavigableSiblingIndex >= 0
  ) {
    previousNavigableSiblingIndex -= 1;
  }

  if (previousNavigableSiblingIndex === -1) {
    // If we are at depth 0, then it means all the items above the current item are not navigable.
    if (itemMeta.parentId == null) {
      return null;
    }

    // Otherwise, we can try to go up a level and find the previous navigable item.
    return getPreviousNavigableItem(instance, itemMeta.parentId);
  }

  // Finds the last navigable ancestor of the previous navigable sibling.
  let currentItemId: string = siblings[previousNavigableSiblingIndex];
  let lastNavigableChild = getLastNavigableItemInArray(
    instance,
    instance.getItemOrderedChildrenIds(currentItemId),
  );
  while (instance.isItemExpanded(currentItemId) && lastNavigableChild != null) {
    currentItemId = lastNavigableChild;
    lastNavigableChild = instance
      .getItemOrderedChildrenIds(currentItemId)
      .find(instance.isItemNavigable);
  }

  return currentItemId;
};

export const getNextNavigableItem = (
  instance: TreeViewInstance<[UseTreeViewExpansionSignature, UseTreeViewItemsSignature]>,
  itemId: string,
) => {
  // If the item is expanded and has some navigable children, return the first of them.
  if (instance.isItemExpanded(itemId)) {
    const firstNavigableChild = instance
      .getItemOrderedChildrenIds(itemId)
      .find(instance.isItemNavigable);
    if (firstNavigableChild != null) {
      return firstNavigableChild;
    }
  }

  let itemMeta = instance.getItemMeta(itemId);
  while (itemMeta != null) {
    // Try to find the first navigable sibling after the current item.
    const siblings = instance.getItemOrderedChildrenIds(itemMeta.parentId);
    const currentItemIndex = instance.getItemIndex(itemMeta.id);

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
    itemMeta = instance.getItemMeta(itemMeta.parentId!);
  }

  return null;
};

export const getLastNavigableItem = (
  instance: TreeViewInstance<[UseTreeViewExpansionSignature, UseTreeViewItemsSignature]>,
) => {
  let itemId: string | null = null;
  while (itemId == null || instance.isItemExpanded(itemId)) {
    const children = instance.getItemOrderedChildrenIds(itemId);
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
  instance.getItemOrderedChildrenIds(null).find(instance.isItemNavigable)!;

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
export const findOrderInTremauxTree = (
  instance: TreeViewInstance<[UseTreeViewItemsSignature]>,
  itemAId: string,
  itemBId: string,
) => {
  if (itemAId === itemBId) {
    return [itemAId, itemBId];
  }

  const itemMetaA = instance.getItemMeta(itemAId);
  const itemMetaB = instance.getItemMeta(itemBId);

  if (itemMetaA.parentId === itemMetaB.id || itemMetaB.parentId === itemMetaA.id) {
    return itemMetaB.parentId === itemMetaA.id
      ? [itemMetaA.id, itemMetaB.id]
      : [itemMetaB.id, itemMetaA.id];
  }

  const aFamily: (string | null)[] = [itemMetaA.id];
  const bFamily: (string | null)[] = [itemMetaB.id];

  let aAncestor = itemMetaA.parentId;
  let bAncestor = itemMetaB.parentId;

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
        aAncestor = instance.getItemMeta(aAncestor!).parentId;
      }
    }

    if (continueB && !aAncestorIsCommon) {
      bFamily.push(bAncestor);
      bAncestorIsCommon = aFamily.indexOf(bAncestor) !== -1;
      continueB = bAncestor !== null;
      if (!bAncestorIsCommon && continueB) {
        bAncestor = instance.getItemMeta(bAncestor!).parentId;
      }
    }
  }

  const commonAncestor = aAncestorIsCommon ? aAncestor : bAncestor;
  const ancestorFamily = instance.getItemOrderedChildrenIds(commonAncestor);

  const aSide = aFamily[aFamily.indexOf(commonAncestor) - 1];
  const bSide = bFamily[bFamily.indexOf(commonAncestor) - 1];

  return ancestorFamily.indexOf(aSide!) < ancestorFamily.indexOf(bSide!)
    ? [itemAId, itemBId]
    : [itemBId, itemAId];
};

export const getNonDisabledItemsInRange = (
  instance: TreeViewInstance<[UseTreeViewItemsSignature, UseTreeViewExpansionSignature]>,
  itemAId: string,
  itemBId: string,
) => {
  const getNextItem = (itemId: string) => {
    // If the item is expanded and has some children, return the first of them.
    if (instance.isItemExpandable(itemId) && instance.isItemExpanded(itemId)) {
      return instance.getItemOrderedChildrenIds(itemId)[0];
    }

    let itemMeta = instance.getItemMeta(itemId);
    while (itemMeta != null) {
      // Try to find the first navigable sibling after the current item.
      const siblings = instance.getItemOrderedChildrenIds(itemMeta.parentId);
      const currentItemIndex = instance.getItemIndex(itemMeta.id);

      if (currentItemIndex < siblings.length - 1) {
        return siblings[currentItemIndex + 1];
      }

      // If the item is the last of its siblings, go up a level to the parent and try again.
      itemMeta = instance.getItemMeta(itemMeta.parentId!);
    }

    throw new Error('Invalid range');
  };

  const [first, last] = findOrderInTremauxTree(instance, itemAId, itemBId);
  const items = [first];
  let current = first;

  while (current !== last) {
    current = getNextItem(current);
    if (!instance.isItemDisabled(current)) {
      items.push(current);
    }
  }

  return items;
};

export const getAllNavigableItems = (
  instance: TreeViewInstance<[UseTreeViewItemsSignature, UseTreeViewExpansionSignature]>,
) => {
  let item: string | null = getFirstNavigableItem(instance);
  const navigableItems: string[] = [];
  while (item != null) {
    navigableItems.push(item);
    item = getNextNavigableItem(instance, item);
  }

  return navigableItems;
};

/**
 * Checks if the target is in a descendant of this item.
 * This can prevent from firing some logic on the ancestors on the interacted item when the event handler is on the root.
 * @param {HTMLElement} target The target to check
 * @param {HTMLElement | null} itemRoot The root of the item to check if the event target is in its descendants
 * @returns {boolean} Whether the target is in a descendant of this item
 */
export const isTargetInDescendants = (target: HTMLElement, itemRoot: HTMLElement | null) => {
  return itemRoot !== target.closest('*[role="treeitem"]');
};
