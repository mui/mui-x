'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import {
  itemsSelectors,
  expansionSelectors,
  selectionSelectors,
  lazyLoadingSelectors,
  TreeViewPlugin,
  useInstanceEventHandler,
  TreeViewUsedStore,
  TreeViewUsedInstance,
  UseTreeViewLazyLoadingSignature,
  TreeViewUsedParamsWithDefaults,
  DataSource,
} from '@mui/x-tree-view/internals';
import { TreeViewItemId } from '@mui/x-tree-view/models';

export const useTreeViewLazyLoading: TreeViewPlugin<UseTreeViewLazyLoadingSignature> = ({
  instance,
  params,
  store,
}) => {
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

  useLazyLoadOnMount({ instance, params, store });

  if (params.dataSource) {
    instance.preventItemUpdates();
  }

  return {
    instance: {
      fetchItems,
      updateItemChildren,
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

function useLazyLoadOnMount({
  instance,
  params,
  store,
}: {
  instance: TreeViewUsedInstance<UseTreeViewLazyLoadingSignature>;
  params: TreeViewUsedParamsWithDefaults<UseTreeViewLazyLoadingSignature>;
  store: TreeViewUsedStore<UseTreeViewLazyLoadingSignature>;
}) {
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
        const newlyExpandableItems = getExpandableItemsFromDataSource(store, params.dataSource);

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
}

function getExpandableItemsFromDataSource(
  store: TreeViewUsedStore<UseTreeViewLazyLoadingSignature>,
  dataSource: DataSource<any>,
): TreeViewItemId[] {
  return Object.values(store.state.items.itemMetaLookup)
    .filter(
      (itemMeta) =>
        !itemMeta.expandable &&
        dataSource.getChildrenCount(store.state.items.itemModelLookup[itemMeta.id]) > 0,
    )
    .map((item) => item.id);
}
