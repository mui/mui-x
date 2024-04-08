import { TreeViewInstance } from '../models';
import type { UseTreeViewExpansionSignature } from '../plugins/useTreeViewExpansion';
import type { UseTreeViewItemsSignature } from '../plugins/useTreeViewItems';

export const getPreviousItem = (
  instance: TreeViewInstance<[UseTreeViewItemsSignature, UseTreeViewExpansionSignature]>,
  itemId: string,
) => {
  const itemMeta = instance.getItemMeta(itemId);
  const siblings = instance.getNavigableChildrenIds(itemMeta.parentId);
  const itemIndex = siblings.indexOf(itemId);

  if (itemIndex === 0) {
    return itemMeta.parentId;
  }

  let currentItem: string = siblings[itemIndex - 1];
  while (
    instance.isItemExpanded(currentItem) &&
    instance.getNavigableChildrenIds(currentItem).length > 0
  ) {
    currentItem = instance.getNavigableChildrenIds(currentItem).pop()!;
  }

  return currentItem;
};

export const getNextItem = (
  instance: TreeViewInstance<[UseTreeViewExpansionSignature, UseTreeViewItemsSignature]>,
  itemId: string,
) => {
  // If expanded get first child
  if (instance.isItemExpanded(itemId) && instance.getNavigableChildrenIds(itemId).length > 0) {
    return instance.getNavigableChildrenIds(itemId)[0];
  }

  let itemMeta = instance.getItemMeta(itemId);
  while (itemMeta != null) {
    // Try to get next sibling
    const siblings = instance.getNavigableChildrenIds(itemMeta.parentId);
    const nextSibling = siblings[siblings.indexOf(itemMeta.id) + 1];

    if (nextSibling) {
      return nextSibling;
    }

    // If the sibling does not exist, go up a level to the parent and try again.
    itemMeta = instance.getItemMeta(itemMeta.parentId!);
  }

  return null;
};

export const getLastItem = (
  instance: TreeViewInstance<[UseTreeViewExpansionSignature, UseTreeViewItemsSignature]>,
) => {
  let lastItem = instance.getNavigableChildrenIds(null).pop()!;

  while (instance.isItemExpanded(lastItem)) {
    lastItem = instance.getNavigableChildrenIds(lastItem).pop()!;
  }
  return lastItem;
};

export const getFirstItem = (instance: TreeViewInstance<[UseTreeViewItemsSignature]>) =>
  instance.getNavigableChildrenIds(null)[0];
