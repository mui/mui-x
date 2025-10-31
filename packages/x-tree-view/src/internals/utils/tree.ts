import { MinimalTreeViewState } from '../MinimalTreeViewStore';
import { TreeViewItemMeta } from '../models';
import { expansionSelectors } from '../plugins/expansion/selectors';
import { itemsSelectors } from '../plugins/items/selectors';

const getLastNavigableItemInArray = (state: MinimalTreeViewState<any, any>, items: string[]) => {
  // Equivalent to Array.prototype.findLastIndex
  let itemIndex = items.length - 1;
  while (itemIndex >= 0 && !itemsSelectors.canItemBeFocused(state, items[itemIndex])) {
    itemIndex -= 1;
  }

  if (itemIndex === -1) {
    return undefined;
  }

  return items[itemIndex];
};

export const getPreviousNavigableItem = (
  state: MinimalTreeViewState<any, any>,
  itemId: string,
): string | null => {
  const itemMeta = itemsSelectors.itemMeta(state, itemId);
  if (!itemMeta) {
    return null;
  }

  const siblings = itemsSelectors.itemOrderedChildrenIds(state, itemMeta.parentId);
  const itemIndex = itemsSelectors.itemIndex(state, itemId);

  // TODO: What should we do if the parent is not navigable?
  if (itemIndex === 0) {
    return itemMeta.parentId;
  }

  // Finds the previous navigable sibling.
  let previousNavigableSiblingIndex = itemIndex - 1;
  while (
    !itemsSelectors.canItemBeFocused(state, siblings[previousNavigableSiblingIndex]) &&
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
    itemsSelectors.itemOrderedChildrenIds(state, currentItemId),
  );
  while (expansionSelectors.isItemExpanded(state, currentItemId) && lastNavigableChild != null) {
    currentItemId = lastNavigableChild;
    lastNavigableChild = getLastNavigableItemInArray(
      state,
      itemsSelectors.itemOrderedChildrenIds(state, currentItemId),
    );
  }

  return currentItemId;
};

export const getNextNavigableItem = (state: MinimalTreeViewState<any, any>, itemId: string) => {
  // If the item is expanded and has some navigable children, return the first of them.
  if (expansionSelectors.isItemExpanded(state, itemId)) {
    const firstNavigableChild = itemsSelectors
      .itemOrderedChildrenIds(state, itemId)
      .find((childId) => itemsSelectors.canItemBeFocused(state, childId));
    if (firstNavigableChild != null) {
      return firstNavigableChild;
    }
  }

  let itemMeta = itemsSelectors.itemMeta(state, itemId);
  while (itemMeta != null) {
    // Try to find the first navigable sibling after the current item.
    const siblings = itemsSelectors.itemOrderedChildrenIds(state, itemMeta.parentId);
    const currentItemIndex = itemsSelectors.itemIndex(state, itemMeta.id);

    if (currentItemIndex < siblings.length - 1) {
      let nextItemIndex = currentItemIndex + 1;
      while (
        !itemsSelectors.canItemBeFocused(state, siblings[nextItemIndex]) &&
        nextItemIndex < siblings.length - 1
      ) {
        nextItemIndex += 1;
      }

      if (itemsSelectors.canItemBeFocused(state, siblings[nextItemIndex])) {
        return siblings[nextItemIndex];
      }
    }

    // If the sibling does not exist, go up a level to the parent and try again.
    itemMeta = itemsSelectors.itemMeta(state, itemMeta.parentId!);
  }

  return null;
};

export const getLastNavigableItem = (state: MinimalTreeViewState<any, any>) => {
  let itemId: string | null = null;
  while (itemId == null || expansionSelectors.isItemExpanded(state, itemId)) {
    const children = itemsSelectors.itemOrderedChildrenIds(state, itemId);
    const lastNavigableChild = getLastNavigableItemInArray(state, children);

    // The item has no navigable children.
    if (lastNavigableChild == null) {
      return itemId!;
    }

    itemId = lastNavigableChild;
  }

  return itemId!;
};

export const getFirstNavigableItem = (state: MinimalTreeViewState<any, any>) =>
  itemsSelectors
    .itemOrderedChildrenIds(state, null)
    .find((itemId) => itemsSelectors.canItemBeFocused(state, itemId))!;

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
  state: MinimalTreeViewState<any, any>,
  itemAId: string,
  itemBId: string,
) => {
  if (itemAId === itemBId) {
    return [itemAId, itemBId];
  }

  const itemMetaA = itemsSelectors.itemMeta(state, itemAId);
  const itemMetaB = itemsSelectors.itemMeta(state, itemBId);

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
        aAncestor = itemsSelectors.itemParentId(state, aAncestor!);
      }
    }

    if (continueB && !aAncestorIsCommon) {
      bFamily.push(bAncestor);
      bAncestorIsCommon = aFamily.indexOf(bAncestor) !== -1;
      continueB = bAncestor !== null;
      if (!bAncestorIsCommon && continueB) {
        bAncestor = itemsSelectors.itemParentId(state, bAncestor!);
      }
    }
  }

  const commonAncestor = aAncestorIsCommon ? aAncestor : bAncestor;
  const ancestorFamily = itemsSelectors.itemOrderedChildrenIds(state, commonAncestor);

  const aSide = aFamily[aFamily.indexOf(commonAncestor) - 1];
  const bSide = bFamily[bFamily.indexOf(commonAncestor) - 1];

  return ancestorFamily.indexOf(aSide!) < ancestorFamily.indexOf(bSide!)
    ? [itemAId, itemBId]
    : [itemBId, itemAId];
};

export const getNonDisabledItemsInRange = (
  state: MinimalTreeViewState<any, any>,
  itemAId: string,
  itemBId: string,
) => {
  const getNextItem = (itemId: string) => {
    // If the item is expanded and has some children, return the first of them.
    if (
      expansionSelectors.isItemExpandable(state, itemId) &&
      expansionSelectors.isItemExpanded(state, itemId)
    ) {
      return itemsSelectors.itemOrderedChildrenIds(state, itemId)[0];
    }

    let itemMeta: TreeViewItemMeta | null = itemsSelectors.itemMeta(state, itemId);
    while (itemMeta != null) {
      // Try to find the first navigable sibling after the current item.
      const siblings = itemsSelectors.itemOrderedChildrenIds(state, itemMeta.parentId);
      const currentItemIndex = itemsSelectors.itemIndex(state, itemMeta.id);

      if (currentItemIndex < siblings.length - 1) {
        return siblings[currentItemIndex + 1];
      }

      // If the item is the last of its siblings, go up a level to the parent and try again.
      itemMeta = itemMeta.parentId ? itemsSelectors.itemMeta(state, itemMeta.parentId) : null;
    }

    throw new Error('Invalid range');
  };

  const [first, last] = findOrderInTremauxTree(state, itemAId, itemBId);
  const items = [first];
  let current = first;

  while (current !== last) {
    current = getNextItem(current);
    if (!itemsSelectors.isItemDisabled(state, current)) {
      items.push(current);
    }
  }

  return items;
};

export const getAllNavigableItems = (state: MinimalTreeViewState<any, any>) => {
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
