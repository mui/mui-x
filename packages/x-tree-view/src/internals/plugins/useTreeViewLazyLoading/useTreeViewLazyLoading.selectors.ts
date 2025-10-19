import { createSelector } from '@mui/x-internals/store';
import { TreeViewItemId } from '../../../models';
import { UseTreeViewLazyLoadingSignature } from './useTreeViewLazyLoading.types';
import { TreeViewState } from '../../models';
import { TREE_VIEW_ROOT_PARENT_ID } from '../useTreeViewItems';

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
    (state: TreeViewState<[], [UseTreeViewLazyLoadingSignature]>, itemId: TreeViewItemId | null) =>
      state.lazyLoading?.dataSource.loading[itemId ?? TREE_VIEW_ROOT_PARENT_ID] ?? false,
  ),
  /**
   * Checks whether an item has errors.
   */
  itemHasError: createSelector(
    (state: TreeViewState<[], [UseTreeViewLazyLoadingSignature]>, itemId: TreeViewItemId | null) =>
      !!state.lazyLoading?.dataSource.errors[itemId ?? TREE_VIEW_ROOT_PARENT_ID],
  ),
  /**
   * Get an item error.
   */
  itemError: createSelector(
    (state: TreeViewState<[], [UseTreeViewLazyLoadingSignature]>, itemId: TreeViewItemId | null) =>
      state.lazyLoading?.dataSource.errors[itemId ?? TREE_VIEW_ROOT_PARENT_ID],
  ),
};
