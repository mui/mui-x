import { createSelector } from '@mui/x-internals/store';
import { TreeViewItemId } from '../../../models';
import { TREE_VIEW_ROOT_PARENT_ID } from '../items';
import { RichTreeViewState } from '../../RichTreeViewStore';

export const lazyLoadingSelectors = {
  /**
   * Checks if the lazy loaded state is empty.
   */
  isEmpty: createSelector((state: RichTreeViewState<any, any>) => {
    if (state.lazyLoadedItems == null) {
      return true;
    }

    return (
      Object.keys(state.lazyLoadedItems.loading).length === 0 &&
      Object.keys(state.lazyLoadedItems.errors).length === 0
    );
  }),
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
