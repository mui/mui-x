'use client';
import * as React from 'react';
import {
  selectionSelectors,
  lazyLoadingSelectors,
  TreeViewPlugin,
  useInstanceEventHandler,
  UseTreeViewLazyLoadingSignature,
} from '@mui/x-tree-view/internals';

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
};

useTreeViewLazyLoading.params = {
  dataSource: true,
  dataSourceCache: true,
};
