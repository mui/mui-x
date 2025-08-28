import {
  createSelector,
  TreeViewRootSelector,
  TreeViewRootSelectorForOptionalPlugin,
} from '../../utils/selectors';
import { UseTreeViewLazyLoadingSignature } from './useTreeViewLazyLoading.types';
import { TREE_VIEW_ROOT_PARENT_ID } from '../useTreeViewItems';
import { TreeViewItemId } from '../../../models';

const selectorLazyLoading: TreeViewRootSelector<UseTreeViewLazyLoadingSignature> = (state) =>
  state.lazyLoading;

const selectorLazyLoadingOptional: TreeViewRootSelectorForOptionalPlugin<
  UseTreeViewLazyLoadingSignature
> = (state) => state.lazyLoading;

export const selectorDataSourceState = createSelector(
  [selectorLazyLoading],
  (lazyLoading) => lazyLoading.dataSource,
);

/**
 * Check if lazy loading is enabled.
 * @param {TreeViewState<[UseTreeViewLazyLoadingSignature]>} state The state of the tree view.
 * @returns {boolean} Whether f lazy loading is enabled, false if it isn't.
 */
export const selectorIsLazyLoadingEnabled = createSelector(
  [selectorLazyLoadingOptional],
  (lazyLoading) => !!lazyLoading?.enabled,
);

/**
 * Get the loading state for a tree item.
 * @param {TreeViewState<[UseTreeViewLazyLoadingSignature]>} state The state of the tree view.
 * @param {TreeViewItemId | null} itemId The id of the item to get the loading state of. If null, will return the loading state of the tree view itself.
 * @returns {boolean} The loading state of the provided item.
 */
export const selectorIsItemLoading = createSelector(
  [selectorDataSourceState, (_, itemId: TreeViewItemId | null) => itemId],
  (dataSourceState, itemId) => dataSourceState.loading[itemId ?? TREE_VIEW_ROOT_PARENT_ID] || false,
);

/**
 * Get the error for a tree item.
 * @param {TreeViewState<[UseTreeViewLazyLoadingSignature]>} state The state of the tree view.
 * @param {TreeViewItemId | null} itemId The id of the item to get the error for. If null, will return the error status of the tree view itself.
 * @returns {boolean} The error of the provided item.
 */
export const selectorTreeItemError = createSelector(
  [selectorDataSourceState, (_, itemId: TreeViewItemId | null) => itemId],
  (dataSourceState, itemId) => dataSourceState.errors[itemId ?? TREE_VIEW_ROOT_PARENT_ID] || null,
);
