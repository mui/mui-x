import type { TreeViewItemId } from '../../../models';

export interface RichTreeViewLazyLoadedItemsStatus {
  /**
   * For each item currently loading its children, the expected children count.
   * `-1` when the count is unknown.
   */
  loading: Record<TreeViewItemId, number>;
  errors: Record<TreeViewItemId, Error | null>;
}
