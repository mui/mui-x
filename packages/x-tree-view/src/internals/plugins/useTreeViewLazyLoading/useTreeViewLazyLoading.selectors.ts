import { TreeViewState } from '../../models';
import { createSelector } from '../../utils/selectors';
import { UseTreeViewLazyLoadingSignature } from './useTreeViewLazyLoading.types';

export const selectorDataSourceState = (state: TreeViewState<[UseTreeViewLazyLoadingSignature]>) =>
  state.dataSource;

/**
 * Get the loading state for a tree item.
 * @param {TreeViewState<[UseTreeViewLazyLoadingSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to get the loading state of.
 * @returns {boolean} The loading state for the Tree Item.
 */
export const selectorIsItemLoading = createSelector(
  [selectorDataSourceState, (_, itemId: string) => itemId],
  (dataSourceState, itemId) => dataSourceState.loading[itemId] || false,
);

/**
 * Get the error for a tree item.
 * @param {TreeViewState<[UseTreeViewLazyLoadingSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to get the error for.
 * @returns {boolean} The error for the Tree Item.
 */
export const selectorGetTreeItemError = createSelector(
  [selectorDataSourceState, (_, itemId: string) => itemId],
  (dataSourceState, itemId) => dataSourceState.errors[itemId] || null,
);
