import {
  TreeViewAnyPluginSignature,
  TreeViewInstance,
  TreeViewUsedInstance,
  TreeViewUsedPublicAPI,
} from '../models';
import type { UseTreeViewExpansionSignature } from '../plugins/useTreeViewExpansion';
import type { UseTreeViewItemsSignature } from '../plugins/useTreeViewItems';

export const getPreviousItem = (
  instance: TreeViewInstance<[UseTreeViewItemsSignature, UseTreeViewExpansionSignature]>,
  itemId: string,
) => {
  const item = instance.getItemMeta(itemId);
  const siblings = instance.getNavigableChildrenIds(item.parentId);
  const itemIndex = siblings.indexOf(itemId);

  if (itemIndex === 0) {
    return item.parentId;
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

  let item = instance.getItemMeta(itemId);
  while (item != null) {
    // Try to get next sibling
    const siblings = instance.getNavigableChildrenIds(item.parentId);
    const nextSibling = siblings[siblings.indexOf(item.id) + 1];

    if (nextSibling) {
      return nextSibling;
    }

    // If the sibling does not exist, go up a level to the parent and try again.
    item = instance.getItemMeta(item.parentId!);
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
