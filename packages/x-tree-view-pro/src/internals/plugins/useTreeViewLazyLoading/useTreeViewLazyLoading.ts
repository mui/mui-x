'use client';
import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import {
  itemsSelectors,
  expansionSelectors,
  selectionSelectors,
  lazyLoadingSelectors,
  TreeViewPlugin,
  UseTreeViewLazyLoadingInstance,
  useInstanceEventHandler,
  TREE_VIEW_ROOT_PARENT_ID,
} from '@mui/x-tree-view/internals';
import type { UseTreeViewLazyLoadingSignature } from '@mui/x-tree-view/internals';
import { TreeViewItemId } from '@mui/x-tree-view/models';
import { DataSourceCacheDefault } from '@mui/x-tree-view/utils';
import { NestedDataManager } from './utils';

const INITIAL_STATE = {
  loading: {},
  errors: {},
};

export const useTreeViewLazyLoading: TreeViewPlugin<UseTreeViewLazyLoadingSignature> = ({
  instance,
  params,
  store,
}) => {
  const nestedDataManager = useLazyRef(() => new NestedDataManager(instance)).current;
  const cache = useLazyRef(() => params.dataSourceCache ?? new DataSourceCacheDefault({})).current;

  const setDataSourceLoading: UseTreeViewLazyLoadingInstance['setDataSourceLoading'] =
    useEventCallback((itemId, isLoading) => {
      if (!params.dataSource) {
        return;
      }

      const itemIdWithDefault = itemId ?? TREE_VIEW_ROOT_PARENT_ID;
      if (lazyLoadingSelectors.isItemLoading(store.state, itemIdWithDefault) === isLoading) {
        return;
      }

      const loading = { ...store.state.lazyLoading.dataSource.loading };
      if (isLoading === false) {
        delete loading[itemIdWithDefault];
      } else {
        loading[itemIdWithDefault] = isLoading;
      }

      store.set('lazyLoading', {
        ...store.state.lazyLoading,
        dataSource: { ...store.state.lazyLoading.dataSource, loading },
      });
    });

  const setDataSourceError: UseTreeViewLazyLoadingInstance['setDataSourceError'] = useEventCallback(
    (itemId, error) => {
      if (!params.dataSource) {
        return;
      }

      if (lazyLoadingSelectors.itemError(store.state, itemId) === error) {
        return;
      }

      const stateId = itemId ?? TREE_VIEW_ROOT_PARENT_ID;
      const errors = { ...store.state.lazyLoading.dataSource.errors };
      if (error === null && errors[stateId] !== undefined) {
        delete errors[stateId];
      } else {
        errors[stateId] = error;
      }

      store.set('lazyLoading', {
        ...store.state.lazyLoading,
        dataSource: { ...store.state.lazyLoading.dataSource, errors },
      });
    },
  );

  const fetchItems: UseTreeViewLazyLoadingInstance['fetchItems'] = useEventCallback(
    async (parentIds) => nestedDataManager.queue(parentIds),
  );

  const fetchItemChildren: UseTreeViewLazyLoadingInstance['fetchItemChildren'] = useEventCallback(
    async ({ itemId, forceRefresh }) => {
      if (!params.dataSource) {
        return;
      }
      const { getChildrenCount, getTreeItems } = params.dataSource;
      // clear the request if the item is not in the tree
      if (itemId != null && !itemsSelectors.itemMeta(store.state, itemId)) {
        nestedDataManager.clearPendingRequest(itemId);
        return;
      }

      // reset the state if we are fetching the root items
      if (itemId == null && lazyLoadingSelectors.dataSource(store.state) !== INITIAL_STATE) {
        store.set('lazyLoading', {
          ...store.state.lazyLoading,
          dataSource: INITIAL_STATE,
        });
      }

      const cacheKey = itemId ?? TREE_VIEW_ROOT_PARENT_ID;

      if (!forceRefresh) {
        // reads from the value from the cache
        const cachedData = cache.get(cacheKey);
        if (cachedData !== undefined && cachedData !== -1) {
          if (itemId != null) {
            nestedDataManager.setRequestSettled(itemId);
          }
          instance.setItemChildren({ items: cachedData, parentId: itemId, getChildrenCount });
          instance.setDataSourceLoading(itemId, false);
          return;
        }

        // set the item loading status to true
        instance.setDataSourceLoading(itemId, true);

        if (cachedData === -1) {
          instance.removeChildren(itemId);
        }
      }

      // reset existing error if any
      if (lazyLoadingSelectors.itemError(store.state, itemId)) {
        instance.setDataSourceError(itemId, null);
      }

      try {
        let response: any[];
        if (itemId == null) {
          response = await getTreeItems();
        } else {
          response = await getTreeItems(itemId);
          nestedDataManager.setRequestSettled(itemId);
        }
        // save the response in the cache
        cache.set(cacheKey, response);
        // update the items in the state
        instance.setItemChildren({ items: response, parentId: itemId, getChildrenCount });
      } catch (error) {
        const childrenFetchError = error as Error;
        // set the item error in the state
        instance.setDataSourceError(itemId, childrenFetchError);
        if (forceRefresh) {
          instance.removeChildren(itemId);
        }
      } finally {
        // set the item loading status to false
        instance.setDataSourceLoading(itemId, false);
        if (itemId != null) {
          nestedDataManager.setRequestSettled(itemId);
        }
      }
    },
  );

  const updateItemChildren: UseTreeViewLazyLoadingInstance['updateItemChildren'] = useEventCallback(
    (itemId) => {
      return instance.fetchItemChildren({ itemId, forceRefresh: true });
    },
  );

  useInstanceEventHandler(instance, 'beforeItemToggleExpansion', async (eventParameters) => {
    if (!params.dataSource || !eventParameters.shouldBeExpanded) {
      return;
    }

    // prevent the default expansion behavior
    eventParameters.isExpansionPrevented = true;
    await instance.fetchItems([eventParameters.itemId]);
    const hasError = lazyLoadingSelectors.itemHasError(store.state, eventParameters.itemId);
    if (!hasError) {
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

  const firstRenderRef = React.useRef(true);
  useEnhancedEffect(() => {
    if (!params.dataSource || !firstRenderRef.current) {
      return;
    }

    firstRenderRef.current = false;
    store.set('lazyLoading', { ...store.state.lazyLoading, enabled: true });

    async function fetchAllExpandedItems() {
      async function fetchChildrenIfExpanded(parentIds: TreeViewItemId[]) {
        const expandedItems = parentIds.filter((id) =>
          expansionSelectors.isItemExpanded(store.state, id),
        );
        if (expandedItems.length > 0) {
          const itemsToLazyLoad = expandedItems.filter(
            (id) => itemsSelectors.itemOrderedChildrenIds(store.state, id).length === 0,
          );
          if (itemsToLazyLoad.length > 0) {
            await instance.fetchItems(itemsToLazyLoad);
          }
          const childrenIds = expandedItems.flatMap((id) =>
            itemsSelectors.itemOrderedChildrenIds(store.state, id),
          );
          await fetchChildrenIfExpanded(childrenIds);
        }
      }

      if (params.items.length) {
        const newlyExpandableItems = Object.values(store.state.items.itemMetaLookup)
          .filter(
            (itemMeta) =>
              !itemMeta.expandable &&
              params.dataSource.getChildrenCount(store.state.items.itemModelLookup[itemMeta.id]) >
                0,
          )
          .map((item) => item.id);

        if (newlyExpandableItems.length > 0) {
          instance.addExpandableItems(newlyExpandableItems);
        }
      } else {
        await instance.fetchItemChildren({ itemId: null });
      }
      await fetchChildrenIfExpanded(itemsSelectors.itemOrderedChildrenIds(store.state, null));
    }

    fetchAllExpandedItems();
  }, [instance, params.items, params.dataSource, store]);

  if (params.dataSource) {
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
