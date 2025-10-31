import { TreeViewItemId, TreeViewValidItem } from '../../models';
import { MinimalTreeViewParameters, MinimalTreeViewState } from '../MinimalTreeViewStore';
import { RichTreeViewLazyLoadedItemsStatus } from '../plugins/lazyLoading';

export interface RichTreeViewState<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> extends MinimalTreeViewState<R, Multiple> {
  /**
   * Determine if a given item can be edited.
   */
  isItemEditable: ((item: any) => boolean) | boolean;
  /**
   * The id of the item currently being edited.
   */
  editedItemId: string | null;
  /**
   * The status of the items loaded using lazy loading.
   * Is null if lazy loading is not enabled.
   */
  lazyLoadedItems: RichTreeViewLazyLoadedItemsStatus | null;
}

export interface RichTreeViewStoreParameters<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> extends MinimalTreeViewParameters<R, Multiple> {
  /**
   * Callback fired when the label of an item changes.
   * @param {TreeViewItemId} itemId The id of the item that was edited.
   * @param {string} newLabel The new label of the items.
   */
  onItemLabelChange?: (itemId: TreeViewItemId, newLabel: string) => void;
  /**
   * Determine if a given item can be edited.
   * @template R
   * @param {R} item The item to check.
   * @returns {boolean} `true` if the item can be edited.
   * @default () => false
   */
  isItemEditable?: boolean | ((item: R) => boolean);
}
