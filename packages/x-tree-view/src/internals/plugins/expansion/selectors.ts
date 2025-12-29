import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { TreeViewItemId } from '../../../models';
import { MinimalTreeViewState } from '../../MinimalTreeViewStore';
import { itemsSelectors } from '../items/selectors';
import { TREE_VIEW_ROOT_PARENT_ID } from '../items';

const expandedItemMapSelector = createSelectorMemoized(
  (state: MinimalTreeViewState<any, any>) => state.expandedItems,
  (expandedItems) => {
    const expandedItemsMap = new Map<TreeViewItemId, true>();
    expandedItems.forEach((id) => {
      expandedItemsMap.set(id, true);
    });

    return expandedItemsMap;
  },
);

export const expansionSelectors = {
  /**
   * Gets the expanded items as provided to the component.
   */
  expandedItemsRaw: createSelector((state: MinimalTreeViewState<any, any>) => state.expandedItems),
  /**
   * Gets the expanded items as a Map.
   */
  expandedItemsMap: expandedItemMapSelector,
  /**
   * Gets the items to render as a flat list (the descendants of an expanded item are listed as siblings of the item).
   */
  flatList: createSelectorMemoized(
    itemsSelectors.itemOrderedChildrenIdsLookup,
    expandedItemMapSelector,
    (itemOrderedChildrenIds, expandedItemsMap) => {
      function appendChildren(itemId: TreeViewItemId): TreeViewItemId[] {
        if (!expandedItemsMap.has(itemId)) {
          return [itemId];
        }

        const itemsWithDescendants: TreeViewItemId[] = [itemId];
        const children = itemOrderedChildrenIds[itemId] || [];
        for (const childId of children) {
          itemsWithDescendants.push(...appendChildren(childId));
        }

        return itemsWithDescendants;
      }

      return (itemOrderedChildrenIds[TREE_VIEW_ROOT_PARENT_ID] ?? []).flatMap(appendChildren);
    },
  ),
  /**
   * Gets the slot that triggers the item's expansion when clicked.
   */
  triggerSlot: createSelector((state: MinimalTreeViewState<any, any>) => state.expansionTrigger),
  /**
   * Checks whether an item is expanded.
   */
  isItemExpanded: createSelector(
    expandedItemMapSelector,
    (expandedItemsMap, itemId: TreeViewItemId) => expandedItemsMap.has(itemId),
  ),
  /**
   * Checks whether an item is expandable.
   */
  isItemExpandable: createSelector(
    itemsSelectors.itemMeta,
    (itemMeta, _itemId: TreeViewItemId) => itemMeta?.expandable ?? false,
  ),
};
