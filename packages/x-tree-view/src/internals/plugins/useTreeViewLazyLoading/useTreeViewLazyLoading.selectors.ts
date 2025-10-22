import { createSelector } from '@mui/x-internals/store';
import { TreeViewItemId } from '../../../models';
import { TREE_VIEW_ROOT_PARENT_ID } from '../useTreeViewItems';
import { RichTreeViewState } from '../../RichTreeViewStore';
import { TREE_VIEW_LAZY_LOADED_ITEMS_INITIAL_STATE } from '../../RichTreeViewStore/RichTreeViewStore.utils';

export const lazyLoadingSelectors = {
  /**
   * Gets the data source used to lazy load items.
   */
  isInitialState: createSelector(
    (state: RichTreeViewState<any, any>) =>
      state.lazyLoadedItems === TREE_VIEW_LAZY_LOADED_ITEMS_INITIAL_STATE,
  ),
  /**
   * Checks whether an item is loading.
   */
  isItemLoading: createSelector(
    (state: RichTreeViewState<any, any>, itemId: TreeViewItemId | null) =>
      state.lazyLoadedItems?.loading[itemId ?? TREE_VIEW_ROOT_PARENT_ID] ?? false,
  ),
  /**
   * Checks whether an item has errors.
   */
  itemHasError: createSelector(
    (state: RichTreeViewState<any, any>, itemId: TreeViewItemId | null) =>
      !!state.lazyLoadedItems?.errors[itemId ?? TREE_VIEW_ROOT_PARENT_ID],
  ),
  /**
   * Get an item error.
   */
  itemError: createSelector(
    (state: RichTreeViewState<any, any>, itemId: TreeViewItemId | null) =>
      state.lazyLoadedItems?.errors[itemId ?? TREE_VIEW_ROOT_PARENT_ID],
  ),
};
