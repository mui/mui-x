import {
  DataSource,
  RichTreeViewStoreParameters,
  RichTreeViewState,
  RichTreeViewPublicAPI,
} from '@mui/x-tree-view/internals';
import { TreeViewItemsReorderingAction, TreeViewValidItem } from '@mui/x-tree-view/models';
import { DataSourceCache } from '@mui/x-tree-view/utils';
import { TreeViewItemReorderPosition } from '../plugins/itemsReordering';
import { TreeViewLazyLoadingPlugin } from '../plugins/lazyLoading/TreeViewLazyLoadingPlugin';

export interface RichTreeViewProState<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> extends RichTreeViewState<R, Multiple> {
  /**
   * Determine if a given item can be reordered.
   * @param {string} itemId The id of the item to check.
   * @returns {boolean} `true` if the item can be reordered.
   */
  isItemReorderable: (itemId: string) => boolean;
  /**
   * The current ongoing reordering operation.
   */
  currentReorder: {
    draggedItemId: string;
    targetItemId: string;
    newPosition: TreeViewItemReorderPosition | null;
    action: TreeViewItemsReorderingAction | null;
  } | null;
}

export interface RichTreeViewProStoreParameters<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> extends RichTreeViewStoreParameters<R, Multiple> {
  /**
   * The data source object.
   */
  dataSource?: DataSource<R>;
  /**
   * The data source cache object.
   */
  dataSourceCache?: DataSourceCache;
  /**
   * If `true`, the reordering of items is enabled.
   * @default false
   */
  itemsReordering?: boolean;
  /**
   * Determine if a given item can be reordered.
   * @param {string} itemId The id of the item to check.
   * @returns {boolean} `true` if the item can be reordered.
   * @default () => true
   */
  isItemReorderable?: (itemId: string) => boolean;
  /**
   * Used to determine if a given item can move to some new position.
   * @param {object} parameters The params describing the item re-ordering.
   * @param {string} parameters.itemId The id of the item that is being moved to a new position.
   * @param {TreeViewItemReorderPosition} parameters.oldPosition The old position of the item.
   * @param {TreeViewItemReorderPosition} parameters.newPosition The new position of the item.
   * @returns {boolean} `true` if the item can move to the new position.
   */
  canMoveItemToNewPosition?: (params: {
    itemId: string;
    oldPosition: TreeViewItemReorderPosition;
    newPosition: TreeViewItemReorderPosition;
  }) => boolean;
  /**
   * Callback fired when a Tree Item is moved in the tree.
   * @param {object} parameters The params describing the item re-ordering.
   * @param {string} parameters.itemId The id of the item moved.
   * @param {TreeViewItemReorderPosition} parameters.oldPosition The old position of the item.
   * @param {TreeViewItemReorderPosition} parameters.newPosition The new position of the item.
   */
  onItemPositionChange?: (params: {
    itemId: string;
    oldPosition: TreeViewItemReorderPosition;
    newPosition: TreeViewItemReorderPosition;
  }) => void;
}

export interface RichTreeViewProPublicAPI<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> extends RichTreeViewPublicAPI<R, Multiple>,
    ReturnType<TreeViewLazyLoadingPlugin['buildPublicAPI']> {}
