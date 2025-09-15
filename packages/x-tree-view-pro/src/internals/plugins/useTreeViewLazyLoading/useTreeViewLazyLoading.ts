'use client';
import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  itemsSelectors,
  expansionSelectors,
  selectionSelectors,
  lazyLoadingSelectors,
  TreeViewPlugin,
  UseTreeViewLazyLoadingInstance,
  useInstanceEventHandler,
} from '@mui/x-tree-view/internals';
import type { UseTreeViewLazyLoadingSignature } from '@mui/x-tree-view/internals';
import { TreeViewItemId } from '@mui/x-tree-view/models';
import { DataSourceCache, DataSourceCacheDefault } from '@mui/x-tree-view/utils';
import { NestedDataManager } from './utils';

const INITIAL_STATE = {
  loading: {},
  errors: {},
};

const noopCache: DataSourceCache = {
  clear: () => {},
  get: () => undefined,
  set: () => {},
};

function getCache(cacheProp?: DataSourceCache | null) {
  if (cacheProp === null) {
    return noopCache;
  }
  return cacheProp ?? new DataSourceCacheDefault({});
}

export const useTreeViewLazyLoading: TreeViewPlugin<UseTreeViewLazyLoadingSignature> = ({
  instance,
  params,
  store,
}) => {
  const isLazyLoadingEnabled = !!params.dataSource;
  const firstRenderRef = React.useRef(true);

  const nestedDataManager = useLazyRef<NestedDataManager, void>(
    () => new NestedDataManager(instance),
  ).current;

  const cacheRef = useLazyRef<DataSourceCache, void>(() => getCache(params.dataSourceCache));

  const setDataSourceLoading = useEventCallback((itemId: TreeViewItemId, isLoading: boolean) => {
    if (!isLazyLoadingEnabled) {
      return;
    }

    if (lazyLoadingSelectors.isItemLoading(store.state, itemId) === isLoading) {
      return;
    }

    const loadingState = { ...store.state.lazyLoading.dataSource.loading };
    if (isLoading === false) {
      delete loadingState[itemId];
    } else {
      loadingState[itemId] = isLoading;
    }

    store.set('lazyLoading', {
      ...store.state.lazyLoading,
      dataSource: { ...store.state.lazyLoading.dataSource, loading: loadingState },
    });
  });

  const setDataSourceError = (itemId: TreeViewItemId, error: Error | null) => {
    if (!isLazyLoadingEnabled) {
      return;
    }

    const errors = { ...store.state.lazyLoading.dataSource.errors };
    if (error === null && errors[itemId] !== undefined) {
      delete errors[itemId];
    } else {
      errors[itemId] = error;
    }

    errors[itemId] = error;

    store.set('lazyLoading', {
      ...store.state.lazyLoading,
      dataSource: { ...store.state.lazyLoading.dataSource, errors },
    });
  };

  const resetDataSourceState = useEventCallback(() => {
    if (!isLazyLoadingEnabled) {
      return;
    }

    store.set('lazyLoading', { ...store.state.lazyLoading, dataSource: INITIAL_STATE });
  });

  const fetchItems = useEventCallback(async (parentIds?: TreeViewItemId[]) => {
    if (!isLazyLoadingEnabled) {
      return;
    }
    const getChildrenCount = params.dataSource?.getChildrenCount || (() => 0);

    const getTreeItems = params.dataSource?.getTreeItems;
    if (!getTreeItems) {
      return;
    }

    if (parentIds) {
      await nestedDataManager.queue(parentIds);
      return;
    }

    nestedDataManager.clear();
    // handle loading here
    instance.setTreeViewLoading(true);
    // reset the state if we are refetching the first visible items
    if (lazyLoadingSelectors.dataSource(store.state) !== INITIAL_STATE) {
      resetDataSourceState();
    }
    // handle caching here
    const cachedData = cacheRef.current.get('root');

    if (cachedData !== undefined && cachedData !== -1) {
      instance.addItems({ items: cachedData, depth: 0, getChildrenCount });
      instance.setTreeViewLoading(false);

      return;
    }

    try {
      const getTreeItemsResponse = await getTreeItems();

      // set caching
      cacheRef.current.set('root', getTreeItemsResponse);

      // update the items in the state
      instance.addItems({ items: getTreeItemsResponse, depth: 0, getChildrenCount });
    } catch (error) {
      // set the items to empty
      instance.addItems({ items: [], depth: 0, getChildrenCount });
      // set error state
      instance.setTreeViewError(error as Error);
    } finally {
      // set loading state
      instance.setTreeViewLoading(false);
    }
  });

  const fetchItemChildren: UseTreeViewLazyLoadingInstance['fetchItemChildren'] = useEventCallback(
    async ({ itemId, forceRefresh }) => {
      if (!isLazyLoadingEnabled) {
        return;
      }
      const getChildrenCount = params.dataSource?.getChildrenCount || (() => 0);

      const getTreeItems = params.dataSource?.getTreeItems;
      if (!getTreeItems) {
        nestedDataManager.clearPendingRequest(itemId);
        return;
      }

      const parent = itemsSelectors.itemMeta(store.state, itemId);
      if (!parent) {
        nestedDataManager.clearPendingRequest(itemId);
        return;
      }

      const depth = parent.depth ? parent.depth + 1 : 1;

      // handle loading here
      instance.setDataSourceLoading(itemId, true);

      // handle caching here
      if (!forceRefresh) {
        const cachedData = cacheRef.current.get(itemId);

        if (cachedData !== undefined && cachedData !== -1) {
          nestedDataManager.setRequestSettled(itemId);
          instance.addItems({ items: cachedData, depth, parentId: itemId, getChildrenCount });
          instance.setDataSourceLoading(itemId, false);

          return;
        }
        if (cachedData === -1) {
          instance.removeChildren(itemId);
        }
      }

      if (lazyLoadingSelectors.itemHasError(store.state, itemId)) {
        instance.setDataSourceError(itemId, null);
      }

      try {
        const getTreeItemsResponse = await getTreeItems(itemId);
        nestedDataManager.setRequestSettled(itemId);

        // set caching
        cacheRef.current.set(itemId, getTreeItemsResponse);
        // update the items in the state
        if (forceRefresh) {
          instance.removeChildren(itemId);
        }
        instance.addItems({
          items: getTreeItemsResponse,
          depth,
          parentId: itemId,
          getChildrenCount,
        });
      } catch (error) {
        const childrenFetchError = error as Error;
        // handle errors here
        instance.setDataSourceError(itemId, childrenFetchError);
        instance.removeChildren(itemId);
      } finally {
        // unset loading
        instance.setDataSourceLoading(itemId, false);

        nestedDataManager.setRequestSettled(itemId);
      }
    },
  );

  const updateItemChildren: UseTreeViewLazyLoadingInstance['updateItemChildren'] = useEventCallback(
    (itemId) => {
      return instance.fetchItemChildren({ itemId, forceRefresh: true });
    },
  );

  useInstanceEventHandler(instance, 'beforeItemToggleExpansion', async (eventParameters) => {
    if (!isLazyLoadingEnabled || !eventParameters.shouldBeExpanded) {
      return;
    }
    // prevent the default expansion behavior

    eventParameters.isExpansionPrevented = true;
    await instance.fetchItems([eventParameters.itemId]);
    const itemHasError = lazyLoadingSelectors.itemHasError(store.state, eventParameters.itemId);
    if (!itemHasError) {
      instance.applyItemExpansion({
        itemId: eventParameters.itemId,
        shouldBeExpanded: true,
        event: eventParameters.event,
      });
      if (selectionSelectors.isItemSelected(store.state, eventParameters.itemId)) {
        // make sure selection propagation works correctly
        instance.setItemSelection({
          event: eventParameters.event as React.SyntheticEvent,
          itemId: eventParameters.itemId,
          keepExistingSelection: true,
          shouldBeSelected: true,
        });
      }
    }
  });

  React.useEffect(() => {
    if (isLazyLoadingEnabled && firstRenderRef.current) {
      store.set('lazyLoading', { ...store.state.lazyLoading, enabled: true });
      if (params.items.length) {
        const getChildrenCount = params.dataSource?.getChildrenCount || (() => 0);
        instance.addItems({ items: params.items, depth: 0, getChildrenCount });
      } else {
        const expandedItems = expansionSelectors.expandedItemsRaw(store.state);
        if (expandedItems.length > 0) {
          instance.resetItemExpansion();
        }
        instance.fetchItems();
      }
      firstRenderRef.current = false;
    }
  }, [instance, params.items, params.dataSource, isLazyLoadingEnabled, store]);

  if (isLazyLoadingEnabled) {
    instance.preventItemUpdates();
  }

  return {
    instance: {
      fetchItemChildren,
      fetchItems,
      updateItemChildren,
      setDataSourceLoading,
      setDataSourceError,
    },
    publicAPI: {
      updateItemChildren,
    },
  };
};

useTreeViewLazyLoading.getInitialState = () => ({
  lazyLoading: {
    enabled: false,
    dataSource: INITIAL_STATE,
  },
});

useTreeViewLazyLoading.params = {
  dataSource: true,
  dataSourceCache: true,
};
