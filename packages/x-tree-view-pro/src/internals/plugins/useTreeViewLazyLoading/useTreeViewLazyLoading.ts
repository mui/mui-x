import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { warnOnce } from '@mui/x-internals/warning';
import useEventCallback from '@mui/utils/useEventCallback';
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

  const cacheRef = useLazyRef<DataSourceCache, void>(() => getCache(params.dataSourceCache));

  const setDataSourceLoading = useEventCallback((itemId: TreeViewItemId, isLoading: boolean) => {
    if (!isLazyLoadingEnabled) {
      return;
    }
    store.update((prevState) => {
      if (!prevState.lazyLoading.dataSource.loading[itemId] && !isLoading) {
        return prevState;
      }

      const loading = { ...prevState.lazyLoading.dataSource.loading };
      if (isLoading === false) {
        delete loading[itemId];
      } else {
        loading[itemId] = isLoading;
      }

      return {
        ...prevState,
        lazyLoading: {
          ...prevState.lazyLoading,
          dataSource: { ...prevState.lazyLoading.dataSource, loading },
        },
      };
    });
  });

  const setDataSourceError = (itemId: TreeViewItemId, error: Error | null) => {
    if (!isLazyLoadingEnabled) {
      return;
    }
    store.update((prevState) => {
      const errors = { ...prevState.lazyLoading.dataSource.errors };
      if (error === null && errors[itemId] !== undefined) {
        delete errors[itemId];
      } else {
        errors[itemId] = error;
      }

      errors[itemId] = error;
      return {
        ...prevState,
        lazyLoading: {
          ...prevState.lazyLoading,
          dataSource: { ...prevState.lazyLoading.dataSource, errors },
        },
      };
    });
  };

  const resetDataSourceState = useEventCallback(() => {
    if (!isLazyLoadingEnabled) {
      return;
    }
    store.update((prevState) => ({
      ...prevState,
      lazyLoading: {
        ...prevState.lazyLoading,
        dataSource: INITIAL_STATE,
      },
    }));
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

    // reset the state if we are refetching the first visible items
    if (selectorDataSourceState(store.value) !== INITIAL_STATE) {
      resetDataSourceState();
    }
    // handle caching here
    const cachedData = cacheRef.current.get('root');

    if (cachedData !== undefined) {
      return;
    }

    // handle loading here
    instance.setTreeViewLoading(true);

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

  const fetchItemChildren = useEventCallback(async (id: TreeViewItemId) => {
    if (!isLazyLoadingEnabled) {
      return;
    }
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
    const cachedData = cacheRef.current.get(id);

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
      cacheRef.current.set(id, getTreeItemsResponse);
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
  });

  useInstanceEventHandler(instance, 'beforeItemToggleExpansion', async (eventParameters) => {
    if (!isLazyLoadingEnabled || !eventParameters.shouldBeExpanded) {
      return;
    }

    eventParameters.isExpansionPrevented = true;
    await instance.fetchItems([eventParameters.itemId]);
    const fetchErrors = Boolean(selectorGetTreeItemError(store.value, eventParameters.itemId));
    if (!fetchErrors) {
      instance.applyItemExpansion({
        itemId: eventParameters.itemId,
        shouldBeExpanded: true,
        event: eventParameters.event,
      });
      if (selectorIsItemSelected(store.value, eventParameters.itemId)) {
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
      store.update((prevState) => ({
        ...prevState,
        lazyLoading: {
          ...prevState.lazyLoading,
          enabled: true,
        },
      }));
      if (params.items.length) {
        const getChildrenCount = params.dataSource?.getChildrenCount || (() => 0);
        instance.addItems({ items: params.items, depth: 0, getChildrenCount });
      } else {
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
      setDataSourceLoading,
      setDataSourceError,
    },
    publicAPI: {},
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
  const defaultDataSource = params?.dataSource ?? {
    getChildrenCount: () => 0,
    getTreeItems: () => Promise.resolve([]),
  };

  return {
    ...params,
    dataSource: canUseFeature ? defaultDataSource : {},
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
