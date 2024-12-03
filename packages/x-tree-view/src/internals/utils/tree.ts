import { TreeViewItemMeta, TreeViewState } from '../models';
import type { UseTreeViewExpansionSignature } from '../plugins/useTreeViewExpansion';
import {
  selectorIsItemExpandable,
  selectorIsItemExpanded,
} from '../plugins/useTreeViewExpansion/useTreeViewExpansion.selectors';
import type { UseTreeViewItemsSignature } from '../plugins/useTreeViewItems';
import {
  selectorCanItemBeFocused,
  selectorIsItemDisabled,
  selectorItemIndex,
  selectorItemMeta,
  selectorItemOrderedChildrenIds,
  selectorItemParentId,
} from '../plugins/useTreeViewItems/useTreeViewItems.selectors';

const getLastNavigableItemInArray = (
  state: TreeViewState<[UseTreeViewItemsSignature]>,
  items: string[],
) => {
  // Equivalent to Array.prototype.findLastIndex
  let itemIndex = items.length - 1;
  while (itemIndex >= 0 && !selectorCanItemBeFocused(state, items[itemIndex])) {
    itemIndex -= 1;
  }

  if (itemIndex === -1) {
    return undefined;
  }

  return items[itemIndex];
};

export const getPreviousNavigableItem = (
  state: TreeViewState<[UseTreeViewItemsSignature, UseTreeViewExpansionSignature]>,
  itemId: string,
): string | null => {
  const itemMeta = selectorItemMeta(state, itemId);
  if (!itemMeta) {
    return null;
  }

  const siblings = selectorItemOrderedChildrenIds(state, itemMeta.parentId);
  const itemIndex = selectorItemIndex(state, itemId);

  // TODO: What should we do if the parent is not navigable?
  if (itemIndex === 0) {
    return itemMeta.parentId;
  }

  // Finds the previous navigable sibling.
  let previousNavigableSiblingIndex = itemIndex - 1;
  while (
    !selectorCanItemBeFocused(state, siblings[previousNavigableSiblingIndex]) &&
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
    return getPreviousNavigableItem(state, itemMeta.parentId);
  }

  // Finds the last navigable ancestor of the previous navigable sibling.
  let currentItemId: string = siblings[previousNavigableSiblingIndex];
  let lastNavigableChild = getLastNavigableItemInArray(
    state,
    selectorItemOrderedChildrenIds(state, currentItemId),
  );
  while (selectorIsItemExpanded(state, currentItemId) && lastNavigableChild != null) {
    currentItemId = lastNavigableChild;
    lastNavigableChild = selectorItemOrderedChildrenIds(state, currentItemId).find((childId) =>
      selectorCanItemBeFocused(state, childId),
    );
  }

  return currentItemId;
};

export const getNextNavigableItem = (
  state: TreeViewState<[UseTreeViewItemsSignature, UseTreeViewExpansionSignature]>,
  itemId: string,
) => {
  // If the item is expanded and has some navigable children, return the first of them.
  if (selectorIsItemExpanded(state, itemId)) {
    const firstNavigableChild = selectorItemOrderedChildrenIds(state, itemId).find((childId) =>
      selectorCanItemBeFocused(state, childId),
    );
    if (firstNavigableChild != null) {
      return firstNavigableChild;
    }
  }

  let itemMeta = selectorItemMeta(state, itemId);
  while (itemMeta != null) {
    // Try to find the first navigable sibling after the current item.
    const siblings = selectorItemOrderedChildrenIds(state, itemMeta.parentId);
    const currentItemIndex = selectorItemIndex(state, itemMeta.id);

    if (currentItemIndex < siblings.length - 1) {
      let nextItemIndex = currentItemIndex + 1;
      while (
        !selectorCanItemBeFocused(state, siblings[nextItemIndex]) &&
        nextItemIndex < siblings.length - 1
      ) {
        nextItemIndex += 1;
      }

      if (selectorCanItemBeFocused(state, siblings[nextItemIndex])) {
        return siblings[nextItemIndex];
      }
    }

    // If the sibling does not exist, go up a level to the parent and try again.
    itemMeta = selectorItemMeta(state, itemMeta.parentId!);
  }

  return null;
};

export const getLastNavigableItem = (
  state: TreeViewState<[UseTreeViewExpansionSignature, UseTreeViewItemsSignature]>,
) => {
  let itemId: string | null = null;
  while (itemId == null || selectorIsItemExpanded(state, itemId)) {
    const children = selectorItemOrderedChildrenIds(state, itemId);
    const lastNavigableChild = getLastNavigableItemInArray(state, children);

    // The item has no navigable children.
    if (lastNavigableChild == null) {
      return itemId!;
    }

    itemId = lastNavigableChild;
  }

  return itemId!;
};

export const getFirstNavigableItem = (
  state: TreeViewState<[UseTreeViewExpansionSignature, UseTreeViewItemsSignature]>,
) =>
  selectorItemOrderedChildrenIds(state, null).find((itemId) =>
    selectorCanItemBeFocused(state, itemId),
  )!;

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
  state: TreeViewState<[UseTreeViewExpansionSignature, UseTreeViewItemsSignature]>,
  itemAId: string,
  itemBId: string,
) => {
  if (itemAId === itemBId) {
    return [itemAId, itemBId];
  }

  const itemMetaA = selectorItemMeta(state, itemAId);
  const itemMetaB = selectorItemMeta(state, itemBId);

  if (!itemMetaA || !itemMetaB) {
    return [itemAId, itemBId];
  }

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
        aAncestor = selectorItemParentId(state, aAncestor!);
      }
    }

    if (continueB && !aAncestorIsCommon) {
      bFamily.push(bAncestor);
      bAncestorIsCommon = aFamily.indexOf(bAncestor) !== -1;
      continueB = bAncestor !== null;
      if (!bAncestorIsCommon && continueB) {
        bAncestor = selectorItemParentId(state, bAncestor!);
      }
    }
  }

  const commonAncestor = aAncestorIsCommon ? aAncestor : bAncestor;
  const ancestorFamily = selectorItemOrderedChildrenIds(state, commonAncestor);

  const aSide = aFamily[aFamily.indexOf(commonAncestor) - 1];
  const bSide = bFamily[bFamily.indexOf(commonAncestor) - 1];

  return ancestorFamily.indexOf(aSide!) < ancestorFamily.indexOf(bSide!)
    ? [itemAId, itemBId]
    : [itemBId, itemAId];
};

export const getNonDisabledItemsInRange = (
  state: TreeViewState<[UseTreeViewItemsSignature, UseTreeViewExpansionSignature]>,
  itemAId: string,
  itemBId: string,
) => {
  const getNextItem = (itemId: string) => {
    // If the item is expanded and has some children, return the first of them.
    if (selectorIsItemExpandable(state, itemId) && selectorIsItemExpanded(state, itemId)) {
      return selectorItemOrderedChildrenIds(state, itemId)[0];
    }

    let itemMeta: TreeViewItemMeta | null = selectorItemMeta(state, itemId);
    while (itemMeta != null) {
      // Try to find the first navigable sibling after the current item.
      const siblings = selectorItemOrderedChildrenIds(state, itemMeta.parentId);
      const currentItemIndex = selectorItemIndex(state, itemMeta.id);

      if (currentItemIndex < siblings.length - 1) {
        return siblings[currentItemIndex + 1];
      }

      // If the item is the last of its siblings, go up a level to the parent and try again.
      itemMeta = itemMeta.parentId ? selectorItemMeta(state, itemMeta.parentId) : null;
    }

    throw new Error('Invalid range');
  };

  const [first, last] = findOrderInTremauxTree(state, itemAId, itemBId);
  const items = [first];
  let current = first;

  while (current !== last) {
    current = getNextItem(current);
    if (!selectorIsItemDisabled(state, current)) {
      items.push(current);
    }
  }

  return items;
};

export const getAllNavigableItems = (
  state: TreeViewState<[UseTreeViewItemsSignature, UseTreeViewExpansionSignature]>,
) => {
  let item: string | null = getFirstNavigableItem(state);
  const navigableItems: string[] = [];
  while (item != null) {
    navigableItems.push(item);
    item = getNextNavigableItem(state, item);
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
