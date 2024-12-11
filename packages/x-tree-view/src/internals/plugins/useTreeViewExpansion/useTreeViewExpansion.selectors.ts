import { createSelector, TreeViewRootSelector } from '../../utils/selectors';
import { selectorItemMeta } from '../useTreeViewItems/useTreeViewItems.selectors';
import { UseTreeViewExpansionSignature } from './useTreeViewExpansion.types';

const selectorExpansion: TreeViewRootSelector<UseTreeViewExpansionSignature> = (state) =>
  state.expansion;

/**
 * Check if an item is expanded.
 * @param {TreeViewState<[UseTreeViewExpansionSignature]>} state The state of the tree view.
 * @returns {boolean} `true` if the item is expanded, `false` otherwise.
 */
export const selectorIsItemExpanded = createSelector(
  [selectorExpansion, (_, itemId: string) => itemId],
  (expansionState, itemId) => expansionState.expandedItemsMap.has(itemId),
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
