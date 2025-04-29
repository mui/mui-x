import { TreeViewItemId } from '../../../models';
import { TreeViewItemMeta } from '../../models';

export const TREE_VIEW_ROOT_PARENT_ID = '__TREE_VIEW_ROOT_PARENT_ID__';

export const buildSiblingIndexes = (siblings: string[]) => {
  const siblingsIndexLookup: { [itemId: string]: number } = {};
  siblings.forEach((childId, index) => {
    siblingsIndexLookup[childId] = index;
  });

  return siblingsIndexLookup;
};

/**
 * Check if an item is disabled.
 * This method should only be used in selectors that are checking if several items are disabled.
 * Otherwise, use the `selectorIsItemDisabled` selector.
 * @returns
 */
export const isItemDisabled = (
  itemMetaLookup: { [itemId: string]: TreeViewItemMeta },
  itemId: TreeViewItemId,
) => {
  if (itemId == null) {
    return false;
  }

  let itemMeta = itemMetaLookup[itemId];

  // This can be called before the item has been added to the item map.
  if (!itemMeta) {
    return false;
  }

  if (itemMeta.disabled) {
    return true;
  }

  while (itemMeta.parentId != null) {
    itemMeta = itemMetaLookup[itemMeta.parentId];
    if (!itemMeta) {
      return false;
    }

    if (itemMeta.disabled) {
      return true;
    }
  }

  return false;
};
