import { TreeViewItemId } from '../../../models';

export interface RichTreeViewLazyLoadedItemsStatus {
  loading: Record<TreeViewItemId, boolean>;
  errors: Record<TreeViewItemId, Error | null>;
}
