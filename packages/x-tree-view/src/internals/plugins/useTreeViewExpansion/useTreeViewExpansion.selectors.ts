import { TreeViewItemId } from '../../../models';
import { createSelector, TreeViewRootSelector } from '../../utils/selectors';
import { selectorItemMeta } from '../useTreeViewItems/useTreeViewItems.selectors';
import { UseTreeViewExpansionSignature } from './useTreeViewExpansion.types';

const selectorExpansion: TreeViewRootSelector<UseTreeViewExpansionSignature> = (state) =>
  state.expansion;

/**
 * Get the expanded items.
 * @param {TreeViewState<[UseTreeViewExpansionSignature]>} state The state of the tree view.
 * @returns {TreeViewItemId[]} The expanded items.
 */
export const selectorExpandedItems = createSelector(
  [selectorExpansion],
  (expansionState) => expansionState.expandedItems,
);

/**
 * Get the expanded items as a Map.
 * @param {TreeViewState<[UseTreeViewExpansionSignature]>} state The state of the tree view.
 * @returns {TreeViewExpansionValue} The expanded items as a Map.
 */
export const selectorExpandedItemsMap = createSelector([selectorExpandedItems], (expandedItems) => {
  const expandedItemsMap = new Map<TreeViewItemId, true>();
  expandedItems.forEach((id) => {
    expandedItemsMap.set(id, true);
  });

  return expandedItemsMap;
});

/**
 * Check if an item is expanded.
 * @param {TreeViewState<[UseTreeViewExpansionSignature]>} state The state of the tree view.
 * @returns {boolean} `true` if the item is expanded, `false` otherwise.
 */
export const selectorIsItemExpanded = createSelector(
  [selectorExpandedItemsMap, (_, itemId: string) => itemId],
  (expandedItemsMap, itemId) => expandedItemsMap.has(itemId),
);

/**
 * Check if an item is expandable.
 * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
 * @returns {boolean} `true` if the item is expandable, `false` otherwise.
 */
export const selectorIsItemExpandable = createSelector(
  [selectorItemMeta],
  (itemMeta) => itemMeta?.expandable ?? false,
);

/**
 * Get the slot that triggers the item's expansion when clicked.
 * @param {TreeViewState<[UseTreeViewExpansionSignature]>} state The state of the tree view.
 * @returns {'content' | 'iconContainer'} The slot that triggers the item's expansion when clicked. Is `null` if the item is not expandable.
 */
export const selectorItemExpansionTrigger = createSelector(
  [selectorExpansion],
  (expansionState) => expansionState.expansionTrigger,
);
