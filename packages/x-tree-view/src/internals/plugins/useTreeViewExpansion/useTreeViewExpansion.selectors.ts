import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { TreeViewItemId } from '../../../models';
import { TreeViewState } from '../../models';
import { itemsSelectors } from '../useTreeViewItems/useTreeViewItems.selectors';
import { UseTreeViewExpansionSignature } from './useTreeViewExpansion.types';

const expandedItemMapSelector = createSelectorMemoized(
  (state: TreeViewState<[UseTreeViewExpansionSignature]>) => state.expansion.expandedItems,
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
  expandedItemsRaw: createSelector(
    (state: TreeViewState<[UseTreeViewExpansionSignature]>) => state.expansion.expandedItems,
  ),
  /**
   * Get the expanded items as a Map.
   * @param {TreeViewState<[UseTreeViewExpansionSignature]>} state The state of the tree view.
   * @returns {TreeViewExpansionValue} The expanded items as a Map.
   */
  expandedItemsMap: expandedItemMapSelector,
  /**
   * Gets the slot that triggers the item's expansion when clicked.
   */
  triggerSlot: createSelector(
    (state: TreeViewState<[UseTreeViewExpansionSignature]>) => state.expansion.expansionTrigger,
  ),
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
