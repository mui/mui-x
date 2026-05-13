import { RichTreeViewStoreParameters, RichTreeViewState } from '@mui/x-tree-view/internals';
import {
  TreeViewDOMStructure,
  TreeViewItemId,
  TreeViewItemsReorderingAction,
  TreeViewValidItem,
} from '@mui/x-tree-view/models';
import { DataSourceCache } from '@mui/x-tree-view/utils';
import { TreeViewItemReorderPosition } from '../plugins/itemsReordering';
import { DataSource } from '../plugins/lazyLoading';

export interface RichTreeViewProState<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> extends RichTreeViewState<R, Multiple> {
  /**
   * Determine if a given item can be reordered.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} `true` if the item can be reordered.
   */
  isItemReorderable: (itemId: TreeViewItemId) => boolean;
  /**
   * The current ongoing reordering operation.
   */
  currentReorder: {
    draggedItemId: TreeViewItemId;
    targetItemId: TreeViewItemId;
    newPosition: TreeViewItemReorderPosition | null;
    action: TreeViewItemsReorderingAction | null;
  } | null;
  /**
   * * Whether virtualization is enabled.
   */
  virtualization: boolean;
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
  dataSourceCache?: DataSourceCache<R>;
  /**
   * If `true`, the reordering of items is enabled.
   * @default false
   */
  itemsReordering?: boolean;
  /**
   * Determine if a given item can be reordered.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} `true` if the item can be reordered.
   * @default () => true
   */
  isItemReorderable?: (itemId: TreeViewItemId) => boolean;
  /**
   * Used to determine if a given item can move to some new position.
   * @param {object} parameters The params describing the item re-ordering.
   * @param {TreeViewItemId} parameters.itemId The id of the item that is being moved to a new position.
   * @param {TreeViewItemReorderPosition} parameters.oldPosition The old position of the item.
   * @param {TreeViewItemReorderPosition} parameters.newPosition The new position of the item.
   * @returns {boolean} `true` if the item can move to the new position.
   */
  canMoveItemToNewPosition?: (parameters: {
    itemId: TreeViewItemId;
    oldPosition: TreeViewItemReorderPosition;
    newPosition: TreeViewItemReorderPosition;
  }) => boolean;
  /**
   * Callback fired when the children of an item are loaded from the data source.
   * Only relevant for lazy-loaded tree views.
   * @param {object} parameters The parameters of the callback.
   * @param {R[]} parameters.items The items that were loaded.
   * @param {TreeViewItemId | null} parameters.parentId The id of the parent item whose children were loaded. `null` if the root items were loaded.
   * @param {boolean} parameters.isCacheHit `true` if the items were loaded from the cache, `false` if they were fetched from the data source.
   */
  onItemsLazyLoaded?: (parameters: {
    items: R[];
    parentId: TreeViewItemId | null;
    isCacheHit: boolean;
  }) => void;
  /**
   * Callback fired when a Tree Item is moved in the tree.
   * @param {object} parameters The params describing the item re-ordering.
   * @param {TreeViewItemId} parameters.itemId The id of the item moved.
   * @param {TreeViewItemReorderPosition} parameters.oldPosition The old position of the item.
   * @param {TreeViewItemReorderPosition} parameters.newPosition The new position of the item.
   */
  onItemPositionChange?: (parameters: {
    itemId: TreeViewItemId;
    oldPosition: TreeViewItemReorderPosition;
    newPosition: TreeViewItemReorderPosition;
  }) => void;
  /**
   * When equal to 'flat', the tree is rendered as a flat list (children are rendered as siblings of their parents).
   * When equal to 'nested', the tree is rendered with nested children (children are rendered inside the groupTransition slot of their children).
   * Nested DOM structure is not compatible with collapse / expansion animations.
   * @default 'flat'
   */
  domStructure?: TreeViewDOMStructure;
  /**
   * If `true`, virtualization is disabled.
   * @default false
   */
  disableVirtualization?: boolean;
  /**
   * Sets the height in pixel of an item.
   * Set to `null` to explicitly remove any item height restriction when items have different heights (not compatible with virtualization).
   * @default 32
   */
  itemHeight?: number | null;
}
