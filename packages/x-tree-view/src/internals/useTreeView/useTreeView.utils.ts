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
