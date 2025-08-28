'use client';
import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  TREE_VIEW_ROOT_PARENT_ID,
  TreeViewPlugin,
  useInstanceEventHandler,
  selectorItemMeta,
  selectorIsItemSelected,
  selectorDataSourceState,
  selectorTreeItemError,
  selectorIsItemExpanded,
  selectorItemOrderedChildrenIds,
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

  const nestedDataManager = useLazyRef<NestedDataManager, void>(
    () => new NestedDataManager(instance),
  ).current;

  const cacheRef = useLazyRef<DataSourceCache, void>(() => getCache(params.dataSourceCache));

  const setDataSourceLoading = useEventCallback(
    (itemId: TreeViewItemId | null, isLoading: boolean) => {
      if (!isLazyLoadingEnabled) {
        return;
      }

      const stateId = itemId ?? TREE_VIEW_ROOT_PARENT_ID;
      store.update((prevState) => {
        if (!prevState.lazyLoading.dataSource.loading[stateId] && !isLoading) {
          return prevState;
        }

        const loading = { ...prevState.lazyLoading.dataSource.loading };
        if (isLoading === false) {
          delete loading[stateId];
        } else {
          loading[stateId] = isLoading;
        }

        return {
          ...prevState,
          lazyLoading: {
            ...prevState.lazyLoading,
            dataSource: { ...prevState.lazyLoading.dataSource, loading },
          },
        };
      });
    },
  );

  const setDataSourceError = (itemId: TreeViewItemId | null, error: Error | null) => {
    if (!isLazyLoadingEnabled) {
      return;
    }

    if (selectorTreeItemError(store.value, itemId) === error) {
      return;
    }

    const stateId = itemId ?? TREE_VIEW_ROOT_PARENT_ID;
    store.update((prevState) => {
      const errors = { ...prevState.lazyLoading.dataSource.errors };
      if (error === null && errors[stateId] !== undefined) {
        delete errors[stateId];
      } else {
        errors[stateId] = error;
      }

      return {
        ...prevState,
        lazyLoading: {
          ...prevState.lazyLoading,
          dataSource: { ...prevState.lazyLoading.dataSource, errors },
        },
      };
    });
  };

  const fetchItems = useEventCallback(async (parentIds: TreeViewItemId[]) =>
    nestedDataManager.queue(parentIds),
  );

  const fetchItemChildren = useEventCallback(async (id: TreeViewItemId | null) => {
    if (!isLazyLoadingEnabled) {
      return;
    }
    const getChildrenCount = params.dataSource?.getChildrenCount || (() => 0);

    const getTreeItems = params.dataSource?.getTreeItems;
    if (!getTreeItems) {
      if (id != null) {
        nestedDataManager.clearPendingRequest(id);
      }
      return;
    }

    // clear the request if the item is not in the tree
    if (id != null && !selectorItemMeta(store.value, id)) {
      nestedDataManager.clearPendingRequest(id);
      return;
    }

    // reset the state if we are fetching the root items
    if (id == null && selectorDataSourceState(store.value) !== INITIAL_STATE) {
      store.update((prevState) => ({
        ...prevState,
        lazyLoading: {
          ...prevState.lazyLoading,
          dataSource: INITIAL_STATE,
        },
      }));
    }

    const cacheKey = id ?? TREE_VIEW_ROOT_PARENT_ID;

    // handle caching here
    const cachedData = cacheRef.current.get(cacheKey);
    if (cachedData !== undefined && cachedData !== -1) {
      if (id != null) {
        nestedDataManager.setRequestSettled(id);
      }
      instance.addItems({ items: cachedData, parentId: id, getChildrenCount });
      instance.setDataSourceLoading(id, false);
      return;
    }

    // set the item loading status to true
    instance.setDataSourceLoading(id, true);

    if (cachedData === -1) {
      instance.removeChildren(id);
    }

    // reset existing error if any
    if (selectorTreeItemError(store.value, id)) {
      instance.setDataSourceError(id, null);
    }

    try {
      let response: any[];
      if (id == null) {
        response = await getTreeItems();
      } else {
        response = await getTreeItems(id);
        nestedDataManager.setRequestSettled(id);
      }

      // save the response in the cache
      cacheRef.current.set(cacheKey, response);
      // update the items in the state
      instance.addItems({ items: response, parentId: id, getChildrenCount });
    } catch (error) {
      const childrenFetchError = error as Error;
      // set the item error in the state
      instance.setDataSourceError(id, childrenFetchError);
      instance.removeChildren(id);
    } finally {
      // set the item loading status to false
      instance.setDataSourceLoading(id, false);
      if (id != null) {
        nestedDataManager.setRequestSettled(id);
      }
    }
  });

  useInstanceEventHandler(instance, 'beforeItemToggleExpansion', async (eventParameters) => {
    if (!isLazyLoadingEnabled || !eventParameters.shouldBeExpanded) {
      return;
    }
    // prevent the default expansion behavior

    eventParameters.isExpansionPrevented = true;
    await instance.fetchItems([eventParameters.itemId]);
    const fetchErrors = Boolean(selectorTreeItemError(store.value, eventParameters.itemId));
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

  const firstRenderRef = React.useRef(true);
  React.useEffect(() => {
    if (!isLazyLoadingEnabled || !firstRenderRef.current) {
      return;
    }

    firstRenderRef.current = false;
    store.update((prevState) => ({
      ...prevState,
      lazyLoading: {
        ...prevState.lazyLoading,
        enabled: true,
      },
    }));

    if (params.items.length) {
      const getChildrenCount = params.dataSource?.getChildrenCount || (() => 0);
      instance.addItems({ items: params.items, parentId: null, getChildrenCount });
    } else {
      async function fetchAllExpandedItems() {
        async function fetchChildrenIfExpanded(parentIds: TreeViewItemId[]) {
          const expandedParentIds = parentIds.filter((id) =>
            selectorIsItemExpanded(store.value, id),
          );
          if (expandedParentIds.length > 0) {
            await instance.fetchItems(expandedParentIds);
            const childrenIds = expandedParentIds.flatMap((id) =>
              selectorItemOrderedChildrenIds(store.value, id),
            );
            await fetchChildrenIfExpanded(childrenIds);
          }
        }

        await instance.fetchItemChildren(null);
        await fetchChildrenIfExpanded(selectorItemOrderedChildrenIds(store.value, null));
      }

      fetchAllExpandedItems();
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
