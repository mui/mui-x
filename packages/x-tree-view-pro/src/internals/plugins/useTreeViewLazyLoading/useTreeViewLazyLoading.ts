import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { warnOnce } from '@mui/x-internals/warning';
import {
  selectorItemMeta,
  TreeViewPlugin,
  selectorIsItemExpanded,
  selectorIsItemSelected,
  useInstanceEventHandler,
  selectorDataSourceState,
  selectorGetTreeItemError,
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
  const isLazyLoadingEnabled = params.dataSource?.getChildrenCount !== undefined;
  const firstRenderRef = React.useRef(true);

  const nestedDataManager = useLazyRef<NestedDataManager, void>(
    () => new NestedDataManager(instance),
  ).current;
  const cache = React.useRef<DataSourceCache>(getCache(params.dataSourceCache)).current;

  const setDataSourceLoading = React.useCallback(
    (itemId: TreeViewItemId, isLoading: boolean) => {
      store.update((prevState) => {
        if (!prevState.dataSource.loading[itemId] && isLoading === false) {
          return prevState;
        }

        const loading = { ...prevState.dataSource.loading };
        if (isLoading === false) {
          delete loading[itemId];
        } else {
          loading[itemId] = isLoading;
        }

        return { ...prevState, dataSource: { ...prevState.dataSource, loading } };
      });
    },
    [store],
  );

  const setDataSourceError = (itemId: TreeViewItemId, error: Error | null) => {
    store.update((prevState) => {
      const errors = { ...prevState.dataSource.errors };
      if (error === null && errors[itemId] !== undefined) {
        delete errors[itemId];
      } else {
        errors[itemId] = error;
      }

      errors[itemId] = error;
      return { ...prevState, dataSource: { ...prevState.dataSource, errors } };
    });
  };

  const resetDataSourceState = React.useCallback(() => {
    store.update((prevState) => {
      return {
        ...prevState,
        dataSource: INITIAL_STATE,
      };
    });
  }, [store]);

  const fetchItems = React.useCallback(
    async (parentIds?: TreeViewItemId[]) => {
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

      // reset the state if we are refetching the first visible items
      if (selectorDataSourceState(store.value) !== INITIAL_STATE) {
        resetDataSourceState();
      }
      // handle caching here
      const cachedData = cache.get('root');

      if (cachedData !== undefined) {
        return;
      }

      // handle loading here
      instance.setTreeViewLoading(true);

      try {
        const getTreeItemsResponse = await getTreeItems();

        // set caching
        cache.set('root', getTreeItemsResponse);

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
    },
    [nestedDataManager, params.dataSource, cache, resetDataSourceState, store, instance],
  );

  const fetchItemChildren = React.useCallback(
    async (id: TreeViewItemId) => {
      const getChildrenCount = params.dataSource?.getChildrenCount || (() => 0);

      const getTreeItems = params.dataSource?.getTreeItems;
      if (!getTreeItems) {
        nestedDataManager.clearPendingRequest(id);
        return;
      }

      const parent = selectorItemMeta(store.value, id);
      if (!parent) {
        nestedDataManager.clearPendingRequest(id);
        return;
      }

      const depth = parent.depth ? parent.depth + 1 : 1;

      // handle loading here
      instance.setDataSourceLoading(id, true);

      // handle caching here
      const cachedData = cache.get(id);

      if (cachedData !== undefined && cachedData !== -1) {
        nestedDataManager.setRequestSettled(id);
        instance.addItems({ items: cachedData, depth, parentId: id, getChildrenCount });
        instance.setDataSourceLoading(id, false);

        return;
      }
      if (cachedData === -1) {
        instance.removeChildren(id);
      }

      const existingError = selectorGetTreeItemError(store.value, id) ?? null;
      if (existingError) {
        instance.setDataSourceError(id, null);
      }

      try {
        const getTreeItemsResponse = await getTreeItems(id);
        nestedDataManager.setRequestSettled(id);

        // set caching
        cache.set(id, getTreeItemsResponse);
        // update the items in the state
        instance.addItems({ items: getTreeItemsResponse, depth, parentId: id, getChildrenCount });
      } catch (error) {
        const childrenFetchError = error as Error;
        // handle errors here
        instance.setDataSourceError(id, childrenFetchError);
        instance.removeChildren(id);
      } finally {
        // unset loading
        instance.setDataSourceLoading(id, false);

        nestedDataManager.setRequestSettled(id);
      }
    },
    [nestedDataManager, params.dataSource, instance, cache, store],
  );

  useInstanceEventHandler(instance, 'beforeItemToggleExpansion', async (eventParameters) => {
    if (!isLazyLoadingEnabled) {
      return;
    }

    if (selectorIsItemExpanded(store.value, eventParameters.itemId)) {
      return;
    }

    eventParameters.isExpansionPrevented = true;
    await instance.fetchItems([eventParameters.itemId]);
    const fetchErrors = Boolean(selectorGetTreeItemError(store.value, eventParameters.itemId));
    if (!fetchErrors) {
      instance.setItemExpansion(eventParameters.event, eventParameters.itemId, true);
      if (selectorIsItemSelected(store.value, eventParameters.itemId)) {
        // make sure selection propagation works correctly
        instance.selectItem({
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
      if (params.items.length) {
        const getChildrenCount = params.dataSource?.getChildrenCount || (() => 0);
        instance.addItems({ items: params.items, depth: 0, getChildrenCount });
      } else {
        instance.fetchItems();
      }
      firstRenderRef.current = false;
    }
  }, [instance, params.items, params.dataSource, isLazyLoadingEnabled]);

  const pluginContextValue = React.useMemo(
    () => ({ lazyLoading: params.dataSource !== undefined }),
    [params.dataSource],
  );

  if (!isLazyLoadingEnabled) {
    return {} as UseTreeViewLazyLoadingSignature;
  }
  instance.preventItemUpdates();

  return {
    instance: {
      fetchItemChildren,
      fetchItems,
      setDataSourceLoading,
      setDataSourceError,
    },
    publicAPI: {},
    contextValue: pluginContextValue,
  };
};

useTreeViewLazyLoading.getDefaultizedParams = ({ params, experimentalFeatures }) => {
  const canUseFeature = experimentalFeatures?.lazyLoading;
  if (process.env.NODE_ENV !== 'production') {
    if (params.dataSource && !canUseFeature) {
      warnOnce([
        'MUI X: The label editing feature requires the `lazyLoading` experimental feature to be enabled.',
        'You can do it by passing `experimentalFeatures={{ lazyLoading: true}}` to the Rich Tree View Pro component.',
        'Check the documentation for more details: https://mui.com/x/react-tree-view/rich-tree-view/lazy-loading/',
      ]);
    }
  }
  const defaultDataSource = params?.dataSource || {
    getChildrenCount: () => 0,
    getTreeItems: () => Promise.resolve([]),
  };

  return {
    ...params,
    dataSource: canUseFeature ? defaultDataSource : {},
  };
};

useTreeViewLazyLoading.getInitialState = () => ({
  dataSource: INITIAL_STATE,
});

useTreeViewLazyLoading.params = {
  dataSource: true,
  dataSourceCache: true,
};