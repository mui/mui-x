import { createSelector, createSelectorMemoized } from '@base-ui-components/utils/store';
import { TreeViewItemId } from '../../../models';
import { TreeViewState } from '../../models';
import { itemsSelectors } from '../useTreeViewItems/useTreeViewItems.selectors';
import { UseTreeViewExpansionSignature } from './useTreeViewExpansion.types';

const expandedItemMapSelector = createSelectorMemoized(
  (state: TreeViewState<[UseTreeViewExpansionSignature]>) => {
    const expandedItemsMap = new Map<TreeViewItemId, true>();
    state.expansion.expandedItems.forEach((id) => {
      expandedItemsMap.set(id, true);
    });

    return expandedItemsMap;
  },
);

export const expansionSelectors = {
  /**
   * Get the expanded items as provided to the component.
   * @param {TreeViewState<[UseTreeViewExpansionSignature]>} state The state of the tree view.
   * @returns {TreeViewItemId[]} The expanded items.
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
   * Get the slot that triggers the item's expansion when clicked.
   * @param {TreeViewState<[UseTreeViewExpansionSignature]>} state The state of the tree view.
   * @returns {'content' | 'iconContainer'} The slot that triggers the item's expansion when clicked. Is `null` if the item is not expandable.
   */
  expansionTrigger: createSelector(
    (state: TreeViewState<[UseTreeViewExpansionSignature]>) => state.expansion.expansionTrigger,
  ),
  /**
   * Check if an item is expanded.
   * @param {TreeViewState<[UseTreeViewExpansionSignature]>} state The state of the tree view.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} Whether item is expanded.
   */
  isItemExpanded: createSelector(
    expandedItemMapSelector,
    (expandedItemsMap, itemId: TreeViewItemId) => expandedItemsMap.has(itemId),
  ),
  /**
   * Check if an item is expandable.
   * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
   * @returns {boolean} Whether the item is expandable.
   */
  isItemExpandable: createSelector(
    itemsSelectors.itemMeta,
    (itemMeta, _itemId: TreeViewItemId) => itemMeta?.expandable ?? false,
  ),
};
