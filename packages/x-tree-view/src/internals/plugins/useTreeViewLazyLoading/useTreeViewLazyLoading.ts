import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { warnOnce } from '@mui/x-internals/warning';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewLazyLoadingSignature } from './useTreeViewLazyLoading.types';
import { NestedDataManager } from './utils';
import { TreeViewItemId } from '../../../models';
import { TreeViewDataSourceCache, TreeViewDataSourceCacheDefault } from '../../../utils';
import {
  selectorGetTreeItemError,
  selectorTreeViewDataSourceState,
} from './useTreeViewLazyLoading.selectors';
import { selectorItemMeta } from '../useTreeViewItems/useTreeViewItems.selectors';

const INITIAL_STATE = {
  loading: {},
  errors: {},
};

const noopCache: TreeViewDataSourceCache = {
  clear: () => {},
  get: () => undefined,
  set: () => {},
};

function getCache(cacheProp?: TreeViewDataSourceCache | null) {
  if (cacheProp === null) {
    return noopCache;
  }
  return cacheProp ?? new TreeViewDataSourceCacheDefault({});
}

export const useTreeViewLazyLoading: TreeViewPlugin<UseTreeViewLazyLoadingSignature> = ({
  instance,
  params,
  store,
}) => {
  const isFirstRender = React.useRef(true);
  instance.preventItemUpdates();

  const isLazyLoadingEnabled = params.treeViewDataSource !== undefined;

  const nestedDataManager = useLazyRef<NestedDataManager, void>(
    () => new NestedDataManager(instance),
  ).current;
  const cache = React.useRef<TreeViewDataSourceCache>(
    getCache(params.treeViewDataSourceCache),
  ).current;

  const setDataSourceLoading = React.useCallback(
    (itemId, isLoading) => {
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

  const setDataSourceError = (itemId, error) => {
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
      const getChildrenCount = params.treeViewDataSource?.getChildrenCount || (() => 0);

      const getTreeItems = params.treeViewDataSource?.getTreeItems;
      if (!getTreeItems) {
        return;
      }

      if (parentIds) {
        await nestedDataManager.queue(parentIds);

        return;
      }

      nestedDataManager.clear();

      // reset the state if we are refetching the first visible items
      if (selectorTreeViewDataSourceState(store.value) !== INITIAL_STATE) {
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

        // update the items in the state -> need to write a method for this in useTreeViewItems
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
    [nestedDataManager, params.treeViewDataSource, cache, resetDataSourceState, store, instance],
  );

  const fetchItemChildren = React.useCallback(
    async (id: TreeViewItemId) => {
      const getChildrenCount = params.treeViewDataSource?.getChildrenCount || (() => 0);

      const getTreeItems = params.treeViewDataSource?.getTreeItems;
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
        // update the items in the state -> need to write a method for this in useTreeViewItems
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
    [nestedDataManager, params.treeViewDataSource, instance, cache, store],
  );

  React.useEffect(() => {
    if (params.items.length && isFirstRender.current) {
      isFirstRender.current = false;

      const getChildrenCount = params.treeViewDataSource?.getChildrenCount || (() => 0);
      instance.addItems({ items: params.items, depth: 0, getChildrenCount });
    } else {
      instance.fetchItems();
    }
  }, [instance, params.items, params.treeViewDataSource]);

  const pluginContextValue = React.useMemo(
    () => ({ lazyLoading: params.treeViewDataSource !== undefined }),
    [params.treeViewDataSource],
  );
  return {
    instance: {
      fetchItemChildren,
      fetchItems,
      isLazyLoadingEnabled,
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
    if (params.treeViewDataSource && !canUseFeature) {
      warnOnce([
        'MUI X: The label editing feature requires the `labelEditing` experimental feature to be enabled.',
        'You can do it by passing `experimentalFeatures={{ labelEditing: true}}` to the Rich Tree View Pro component.',
        'Check the documentation for more details: https://mui.com/x/react-tree-view/rich-tree-view/editing/',
      ]);
    }
  }
  const defaultDataSource = params?.treeViewDataSource || {
    getChildrenCount: () => 0,
    getTreeItems: () => Promise.resolve([]),
  };

  return {
    ...params,
    treeViewDataSource: canUseFeature ? defaultDataSource : {},
  };
};

useTreeViewLazyLoading.getInitialState = () => ({
  dataSource: INITIAL_STATE,
});

useTreeViewLazyLoading.params = {
  treeViewDataSource: true,
  treeViewDataSourceCache: true,
};
