import { createSelector } from '@mui/x-internals/store';
import { TreeViewItemId } from '../../../models';
import { UseTreeViewLazyLoadingSignature } from './useTreeViewLazyLoading.types';
import { TreeViewState } from '../../models';

export const lazyLoadingSelectors = {
  /**
   * Gets the data source used to lazy load items.
   */
  dataSource: createSelector(
    (state: TreeViewState<[], [UseTreeViewLazyLoadingSignature]>) => state.lazyLoading?.dataSource,
  ),
  /**
   * Checks whether an item is loading.
   */
  isItemLoading: createSelector(
    (state: TreeViewState<[], [UseTreeViewLazyLoadingSignature]>, itemId: TreeViewItemId) =>
      state.lazyLoading?.dataSource.loading[itemId] ?? false,
  ),
  /**
   * Checks whether an item has errors.
   */
  itemHasError: createSelector(
    (state: TreeViewState<[], [UseTreeViewLazyLoadingSignature]>, itemId: TreeViewItemId) =>
      !!state.lazyLoading?.dataSource.errors[itemId],
  ),
};
