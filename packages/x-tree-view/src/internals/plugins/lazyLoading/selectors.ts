import type { TreeViewItemId } from '../../../models';
import { TREE_VIEW_ROOT_PARENT_ID } from '../items';
import type { RichTreeViewState } from '../../RichTreeViewStore';

export const lazyLoadingSelectors = {
  /**
   * Checks if the lazy loaded state is empty.
   */
  isEmpty: (state: RichTreeViewState<any, any>) => {
    if (state.lazyLoadedItems == null) {
      return true;
    }

    return (
      Object.keys(state.lazyLoadedItems.loading).length === 0 &&
      Object.keys(state.lazyLoadedItems.errors).length === 0
    );
  },
  /**
   * Checks whether an item is loading.
   */
  isItemLoading: (state: RichTreeViewState<any, any>, itemId: TreeViewItemId | null) =>
    state.lazyLoadedItems?.loading[itemId ?? TREE_VIEW_ROOT_PARENT_ID] != null,
  /**
   * Gets the expected children count of an item currently loading its children.
   * Returns `-1` when the count is unknown or the item is not loading.
   */
  itemLoadingChildrenCount: (state: RichTreeViewState<any, any>, itemId: TreeViewItemId | null) =>
    state.lazyLoadedItems?.loading[itemId ?? TREE_VIEW_ROOT_PARENT_ID] ?? -1,
  /**
   * Checks whether an item has errors.
   */
  itemHasError: (state: RichTreeViewState<any, any>, itemId: TreeViewItemId | null) =>
    !!state.lazyLoadedItems?.errors[itemId ?? TREE_VIEW_ROOT_PARENT_ID],
  /**
   * Get an item error.
   */
  itemError: (state: RichTreeViewState<any, any>, itemId: TreeViewItemId | null) =>
    state.lazyLoadedItems?.errors[itemId ?? TREE_VIEW_ROOT_PARENT_ID],
};
