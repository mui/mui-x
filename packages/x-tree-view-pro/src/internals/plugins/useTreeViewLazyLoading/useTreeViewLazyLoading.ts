'use client';
import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
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

  const setDataSourceLoading = useEventCallback(
    (itemId: TreeViewItemId | null, isLoading: boolean) => {
      if (!params.dataSource) {
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
    if (!params.dataSource) {
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
    if (!params.dataSource) {
      return;
    }
    const { getChildrenCount, getTreeItems } = params.dataSource;
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

    // reads from the value from the cache
    const cachedData = cache.get(cacheKey);
    if (cachedData !== undefined && cachedData !== -1) {
      if (id != null) {
        nestedDataManager.setRequestSettled(id);
      }
      instance.setItemChildren({ items: cachedData, parentId: id, getChildrenCount });
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
      cache.set(cacheKey, response);
      // update the items in the state
      instance.setItemChildren({ items: response, parentId: id, getChildrenCount });
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
    if (!params.dataSource || !eventParameters.shouldBeExpanded) {
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
  useEnhancedEffect(() => {
    if (!params.dataSource || !firstRenderRef.current) {
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

    async function fetchAllExpandedItems() {
      async function fetchChildrenIfExpanded(parentIds: TreeViewItemId[]) {
        const expandedItems = parentIds.filter((id) => selectorIsItemExpanded(store.value, id));
        if (expandedItems.length > 0) {
          const itemsToLazyLoad = expandedItems.filter(
            (id) => selectorItemOrderedChildrenIds(store.value, id).length === 0,
          );
          if (itemsToLazyLoad.length > 0) {
            await instance.fetchItems(itemsToLazyLoad);
          }
          const childrenIds = expandedItems.flatMap((id) =>
            selectorItemOrderedChildrenIds(store.value, id),
          );
          await fetchChildrenIfExpanded(childrenIds);
        }
      }

      if (params.items.length) {
        const newlyExpandableItems = Object.values(store.value.items.itemMetaLookup).filter(
          (itemMeta) =>
            !itemMeta.expandable &&
            params.dataSource.getChildrenCount(store.value.items.itemModelLookup[itemMeta.id]) > 0,
        );
        if (newlyExpandableItems.length > 0) {
          store.update((prevState) => {
            const newItemMetaLookup = { ...prevState.items.itemMetaLookup };
            for (const itemMeta of newlyExpandableItems) {
              newItemMetaLookup[itemMeta.id] = {
                ...prevState.items.itemMetaLookup[itemMeta.id],
                expandable: true,
              };
            }

            return {
              ...prevState,
              items: {
                ...prevState.items,
                itemMetaLookup: newItemMetaLookup,
              },
            };
          });
        }
      } else {
        await instance.fetchItemChildren(null);
      }
      await fetchChildrenIfExpanded(selectorItemOrderedChildrenIds(store.value, null));
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
