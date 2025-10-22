import {
  itemsSelectors,
  lazyLoadingSelectors,
  TREE_VIEW_ROOT_PARENT_ID,
  TREE_VIEW_LAZY_LOADED_ITEMS_INITIAL_STATE,
} from '@mui/x-tree-view/internals';
import { TreeViewItemId } from '@mui/x-tree-view/models';
import { DataSourceCache, DataSourceCacheDefault } from '@mui/x-tree-view/utils';
import { RichTreeViewProStore } from './RichTreeViewProStore';
import { NestedDataManager } from '../plugins/useTreeViewLazyLoading/utils';

export class TreeViewLazyLoadingManager<Store extends RichTreeViewProStore<any, any>> {
  private store: Store;

  private nestedDataManager = new NestedDataManager(this);

  private cache: DataSourceCache;

  constructor(store: Store) {
    this.store = store;
    this.cache = store.parameters.dataSourceCache ?? new DataSourceCacheDefault({});
  }

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

  // TODO: Check if this could be private.
  public fetchItems = (parentIds: TreeViewItemId[]) => this.nestedDataManager.queue(parentIds);

  public updateItemChildren = (itemId: TreeViewItemId) =>
    this.fetchItemChildren({ itemId, forceRefresh: true });

  public fetchItemChildren = async ({ itemId, forceRefresh }) => {
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
    if (itemId == null && !lazyLoadingSelectors.isInitialState(this.store.state)) {
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
        this.store.setItemChildren({ items: cachedData, parentId: itemId, getChildrenCount });
        this.setItemLoading(itemId, false);
        return;
      }

      // set the item loading status to true
      this.setItemLoading(itemId, true);

      if (cachedData === -1) {
        this.store.removeChildren(itemId);
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
      this.store.setItemChildren({ items: response, parentId: itemId, getChildrenCount });
    } catch (error) {
      const childrenFetchError = error as Error;
      // set the item error in the state
      this.setItemError(itemId, childrenFetchError);
      if (forceRefresh) {
        this.store.removeChildren(itemId);
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
