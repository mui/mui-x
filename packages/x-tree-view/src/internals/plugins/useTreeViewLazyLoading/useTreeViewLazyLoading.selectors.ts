import { createSelector } from '@base-ui-components/utils/store';
import { TreeViewItemId } from '../../../models';
import { UseTreeViewLazyLoadingSignature } from './useTreeViewLazyLoading.types';
import { TreeViewState } from '../../models';

const selectorLazyLoadingOptional = createSelector(
  (state: TreeViewState<[], [UseTreeViewLazyLoadingSignature]>) => state.lazyLoading,
);

export const selectorDataSourceState = createSelector(
  selectorLazyLoadingOptional,
  (lazyLoading) => lazyLoading?.dataSource,
);

/**
 * Check if lazy loading is enabled.
 * @param {TreeViewState<[UseTreeViewLazyLoadingSignature]>} state The state of the tree view.
 * @returns {boolean} True if lazy loading is enabled, false if it isn't.
 */
export const selectorIsLazyLoadingEnabled = createSelector(
  selectorLazyLoadingOptional,
  (lazyLoading) => !!lazyLoading?.enabled,
);

/**
 * Get the loading state for a tree item.
 * @param {TreeViewState<[UseTreeViewLazyLoadingSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to get the loading state of.
 * @returns {boolean} The loading state for the Tree Item.
 */
export const selectorIsItemLoading = createSelector(
  selectorDataSourceState,
  (dataSourceState, itemId: TreeViewItemId) => dataSourceState?.loading[itemId] || false,
);

/**
 * Get the error for a tree item.
 * @param {TreeViewState<[UseTreeViewLazyLoadingSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to get the error for.
 * @returns {boolean} The error for the Tree Item.
 */
export const selectorGetTreeItemError = createSelector(
  selectorDataSourceState,
  (dataSourceState, itemId: TreeViewItemId) => dataSourceState?.errors[itemId] || null,
);
