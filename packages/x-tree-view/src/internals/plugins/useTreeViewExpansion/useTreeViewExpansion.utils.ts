import { TreeViewItemId } from '../../../models';

export const createExpandedItemsMap = (expandedItems: string[]) => {
  const expandedItemsMap = new Map<TreeViewItemId, true>();
  expandedItems.forEach((id) => {
    expandedItemsMap.set(id, true);
  });

  return expandedItemsMap;
};
