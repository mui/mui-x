import {
  itemsSelectors,
  lazyLoadingSelectors,
  TREE_VIEW_ROOT_PARENT_ID,
  expansionSelectors,
  selectionSelectors,
  TreeViewEventParameters,
  TreeViewEventEvent,
} from '@mui/x-tree-view/internals';
import { TreeViewItemId } from '@mui/x-tree-view/models';
import { DataSourceCache, DataSourceCacheDefault } from '@mui/x-tree-view/utils';
import { RichTreeViewProStore } from '../../RichTreeViewProStore/RichTreeViewProStore';
import { NestedDataManager } from './utils';
import { DataSource } from './types';

export const TREE_VIEW_LAZY_LOADED_ITEMS_INITIAL_STATE = {
  loading: {},
  errors: {},
};

export class TreeViewLazyLoadingPlugin {
  private store: RichTreeViewProStore<any, any>;

  private nestedDataManager = new NestedDataManager(this);

  private cache: DataSourceCache;

  constructor(store: RichTreeViewProStore<any, any>) {
    this.store = store;
    this.cache = store.parameters.dataSourceCache ?? new DataSourceCacheDefault({});

    if (store.parameters.dataSource != null) {
      this.init();
      store.subscribeEvent('beforeItemToggleExpansion', this.handleBeforeItemToggleExpansion);
    }
  }

  private init = () => {
    const store = this.store;
    // eslint-disable-next-line consistent-this
    const plugin = this;

    const fetchAllExpandedItems = async () => {
      async function fetchChildrenIfExpanded(parentIds: TreeViewItemId[]) {
        const expandedItems = parentIds.filter((id) =>
          expansionSelectors.isItemExpanded(store.state, id),
        );
        if (expandedItems.length > 0) {
          const itemsToLazyLoad = expandedItems.filter(
            (id) => itemsSelectors.itemOrderedChildrenIds(store.state, id).length === 0,
          );
          if (itemsToLazyLoad.length > 0) {
            await plugin.fetchItems(itemsToLazyLoad);
          }
          const childrenIds = expandedItems.flatMap((id) =>
            itemsSelectors.itemOrderedChildrenIds(store.state, id),
          );
          await fetchChildrenIfExpanded(childrenIds);
        }
      }

      if (store.parameters.items.length) {
        const newlyExpandableItems = getExpandableItemsFromDataSource(
          store,
          store.parameters.dataSource!,
        );

        if (newlyExpandableItems.length > 0) {
          store.expansion.addExpandableItems(newlyExpandableItems);
        }
      } else {
        await plugin.fetchItemChildren({ itemId: null });
      }
      await fetchChildrenIfExpanded(itemsSelectors.itemOrderedChildrenIds(store.state, null));
    };

    fetchAllExpandedItems();
  };

  private handleBeforeItemToggleExpansion = async (
    eventParameters: TreeViewEventParameters<'beforeItemToggleExpansion'>,
    event: TreeViewEventEvent<'beforeItemToggleExpansion'>,
  ) => {
    if (!this.store.parameters.dataSource || !eventParameters.shouldBeExpanded) {
      return;
    }

    // prevent the default expansion behavior
    eventParameters.isExpansionPrevented = true;
    await this.fetchItems([eventParameters.itemId]);
    const hasError = lazyLoadingSelectors.itemHasError(this.store.state, eventParameters.itemId);
    if (!hasError) {
      this.store.expansion.applyItemExpansion({
        itemId: eventParameters.itemId,
        shouldBeExpanded: true,
        event,
      });
      if (selectionSelectors.isItemSelected(this.store.state, eventParameters.itemId)) {
        // make sure selection propagation works correctly
        this.store.selection.setItemSelection({
          event,
          itemId: eventParameters.itemId,
          keepExistingSelection: true,
          shouldBeSelected: true,
        });
      }
    }
  };

  private setItemLoading = (itemId: TreeViewItemId | null, isLoading: boolean) => {
    if (!this.store.parameters.dataSource || !this.store.state.lazyLoadedItems) {
      return;
    }

    if (lazyLoadingSelectors.isItemLoading(this.store.state, itemId) === isLoading) {
      return;
    }

    const itemIdWithDefault = itemId ?? TREE_VIEW_ROOT_PARENT_ID;
    const loading = { ...this.store.state.lazyLoadedItems.loading };
    if (isLoading === false) {
      delete loading[itemIdWithDefault];
    } else {
      loading[itemIdWithDefault] = isLoading;
    }

    this.store.set('lazyLoadedItems', { ...this.store.state.lazyLoadedItems, loading });
  };

  private setItemError = (itemId: TreeViewItemId | null, error: Error | null) => {
    if (!this.store.parameters.dataSource || !this.store.state.lazyLoadedItems) {
      return;
    }

    if (lazyLoadingSelectors.itemError(this.store.state, itemId) === error) {
      return;
    }

    const itemIdWithDefault = itemId ?? TREE_VIEW_ROOT_PARENT_ID;
    const errors = { ...this.store.state.lazyLoadedItems.errors };
    if (error === null && errors[itemIdWithDefault] !== undefined) {
      delete errors[itemIdWithDefault];
    } else {
      errors[itemIdWithDefault] = error;
    }

    this.store.set('lazyLoadedItems', { ...this.store.state.lazyLoadedItems, errors });
  };

  public buildPublicAPI = () => {
    return {
      updateItemChildren: this.updateItemChildren,
    };
  };

  /**
   * Method used for fetching multiple items concurrently.
   * Only relevant for lazy-loaded tree views.
   *
   * @param {TreeViewItemId[]} parentIds The ids of the items to fetch the children of.
   * @returns {Promise<void>} The promise resolved when the items are fetched.
   */
  public fetchItems = (parentIds: TreeViewItemId[]) => this.nestedDataManager.queue(parentIds);

  /**
   * Method used for updating an item's children.
   * Only relevant for lazy-loaded tree views.
   *
   * @param {TreeViewItemId | null} itemId The id of the item to update the children of. If null is passed, it will update the root's children.
   * @returns {Promise<void>} The promise resolved when the items are fetched.
   */
  public updateItemChildren = (itemId: TreeViewItemId | null) =>
    this.fetchItemChildren({ itemId, forceRefresh: true });

  /**
   * Method used for fetching an item's children.
   * Only relevant for lazy-loaded tree views.
   *
   * @param {object} parameters The parameters of the method.
   * @param {TreeViewItemId} parameters.itemId The The id of the item to fetch the children of.
   * @param {boolean} [parameters.forceRefresh] Whether to force a refresh of the children when the cache already contains some data.
   * @returns {Promise<void>} The promise resolved when the items are fetched.
   */
  public fetchItemChildren = async ({
    itemId,
    forceRefresh,
  }: {
    itemId: TreeViewItemId | null;
    forceRefresh?: boolean;
  }) => {
    if (!this.store.parameters.dataSource) {
      return;
    }
    const { getChildrenCount, getTreeItems } = this.store.parameters.dataSource;
    // clear the request if the item is not in the tree
    if (itemId != null && !itemsSelectors.itemMeta(this.store.state, itemId)) {
      this.nestedDataManager.clearPendingRequest(itemId);
      return;
    }

    // reset the state if we are fetching the root items
    if (itemId == null && !lazyLoadingSelectors.isEmpty(this.store.state)) {
      this.store.set('lazyLoadedItems', TREE_VIEW_LAZY_LOADED_ITEMS_INITIAL_STATE);
    }

    const cacheKey = itemId ?? TREE_VIEW_ROOT_PARENT_ID;

    if (!forceRefresh) {
      // reads from the value from the cache
      const cachedData = this.cache.get(cacheKey);
      if (cachedData !== undefined && cachedData !== -1) {
        if (itemId != null) {
          this.nestedDataManager.setRequestSettled(itemId);
        }
        this.store.items.setItemChildren({ items: cachedData, parentId: itemId, getChildrenCount });
        this.setItemLoading(itemId, false);
        return;
      }

      // set the item loading status to true
      this.setItemLoading(itemId, true);

      if (cachedData === -1) {
        this.store.items.removeChildren(itemId);
      }
    }

    // reset existing error if any
    if (lazyLoadingSelectors.itemError(this.store.state, itemId)) {
      this.setItemError(itemId, null);
    }

    try {
      let response: any[];
      if (itemId == null) {
        response = await getTreeItems();
      } else {
        response = await getTreeItems(itemId);
        this.nestedDataManager.setRequestSettled(itemId);
      }
      // save the response in the cache
      this.cache.set(cacheKey, response);
      // update the items in the state
      this.store.items.setItemChildren({ items: response, parentId: itemId, getChildrenCount });
    } catch (error) {
      const childrenFetchError = error as Error;
      // set the item error in the state
      this.setItemError(itemId, childrenFetchError);
      if (forceRefresh) {
        this.store.items.removeChildren(itemId);
      }
    } finally {
      // set the item loading status to false
      this.setItemLoading(itemId, false);
      if (itemId != null) {
        this.nestedDataManager.setRequestSettled(itemId);
      }
    }
  };
}

function getExpandableItemsFromDataSource(
  store: RichTreeViewProStore<any, any>,
  dataSource: DataSource<any>,
): TreeViewItemId[] {
  return Object.values(store.state.itemMetaLookup)
    .filter(
      (itemMeta) =>
        !itemMeta.expandable &&
        dataSource.getChildrenCount(store.state.itemModelLookup[itemMeta.id]) !== 0,
    )
    .map((item) => item.id);
}
