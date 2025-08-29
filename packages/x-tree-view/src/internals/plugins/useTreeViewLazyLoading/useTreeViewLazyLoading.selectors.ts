import { createSelector } from '@base-ui-components/utils/store';
import { TreeViewItemId } from '../../../models';
import { UseTreeViewLazyLoadingSignature } from './useTreeViewLazyLoading.types';
import { TreeViewState } from '../../models';

export const lazyLoadingSelectors = {
  /**
   * Get the data source.
   * @param {TreeViewState<[], [UseTreeViewLazyLoadingSignature]>} state The state of the tree view.
   * @returns {TreeViewDataSource | undefined} The data source.
   */
  dataSource: createSelector(
    (state: TreeViewState<[], [UseTreeViewLazyLoadingSignature]>) => state.lazyLoading?.dataSource,
  ),
  /**
   * Check if an item is loading.
   * @param {TreeViewState<[UseTreeViewLazyLoadingSignature]>} state The state of the tree view.
   * @param {TreeViewItemId} itemId The id of the item to get the loading state of.
   * @returns {boolean} Whether the item is loading.
   */
  isItemLoading: createSelector(
    (state: TreeViewState<[], [UseTreeViewLazyLoadingSignature]>, itemId: TreeViewItemId) =>
      state.lazyLoading?.dataSource.loading[itemId] ?? false,
  ),
  /**
   * Check whether an item has errors.
   * @param {TreeViewState<[UseTreeViewLazyLoadingSignature]>} state The state of the tree view.
   * @param {TreeViewItemId} itemId The id of the item to check for errors.
   * @returns {boolean} Whether the item has errors.
   */
  itemHasError: createSelector(
    (state: TreeViewState<[], [UseTreeViewLazyLoadingSignature]>, itemId: TreeViewItemId) =>
      Boolean(state.lazyLoading?.dataSource.errors[itemId]),
  ),
};
