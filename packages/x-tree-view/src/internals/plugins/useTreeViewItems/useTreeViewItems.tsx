'use client';
import * as React from 'react';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewItemsSignature } from './useTreeViewItems.types';
import { TreeViewBaseItem, TreeViewItemId } from '../../../models';
import { BuildItemsLookupConfig, buildItemsState } from './useTreeViewItems.utils';
import { TreeViewItemDepthContext } from '../../TreeViewItemDepthContext';
import { itemsSelectors } from './useTreeViewItems.selectors';

export const useTreeViewItems: TreeViewPlugin<UseTreeViewItemsSignature> = ({
  instance,
  params,
  store,
}) => {
  const itemsConfig: BuildItemsLookupConfig = React.useMemo(
    () => ({
      isItemDisabled: params.isItemDisabled,
      getItemLabel: params.getItemLabel,
      getItemChildren: params.getItemChildren,
      getItemId: params.getItemId,
    }),
    [params.isItemDisabled, params.getItemLabel, params.getItemChildren, params.getItemId],
  );

  const getItem = React.useCallback(
    (itemId: string) => itemsSelectors.itemModel(store.state, itemId),
    [store],
  );
  const getParentId = React.useCallback(
    (itemId: string) => {
      const itemMeta = itemsSelectors.itemMeta(store.state, itemId);
      return itemMeta?.parentId || null;
    },
    [store],
  );

  const setIsItemDisabled = useEventCallback(
    ({ itemId, shouldBeDisabled }: { itemId: string; shouldBeDisabled?: boolean }) => {
      if (!store.state.items.itemMetaLookup[itemId]) {
        return;
      }

      const itemMetaLookup = { ...store.state.items.itemMetaLookup };
      itemMetaLookup[itemId] = {
        ...itemMetaLookup[itemId],
        disabled: shouldBeDisabled ?? !itemMetaLookup[itemId].disabled,
      };

      store.set('items', { ...store.state.items, itemMetaLookup });
    },
  );

  const getItemTree = React.useCallback(() => {
    const getItemFromItemId = (itemId: TreeViewItemId): TreeViewBaseItem => {
      const item = itemsSelectors.itemModel(store.state, itemId);
      const itemToMutate = { ...item };
      const newChildren = itemsSelectors.itemOrderedChildrenIds(store.state, itemId);
      if (newChildren.length > 0) {
        itemToMutate.children = newChildren.map(getItemFromItemId);
      } else {
        delete itemToMutate.children;
      }

      return itemToMutate;
    };

    return itemsSelectors.itemOrderedChildrenIds(store.state, null).map(getItemFromItemId);
  }, [store]);

  const getItemOrderedChildrenIds = React.useCallback(
    (itemId: string | null) => itemsSelectors.itemOrderedChildrenIds(store.state, itemId),
    [store],
  );

  const areItemUpdatesPreventedRef = React.useRef(false);
  const preventItemUpdates = React.useCallback(() => {
    areItemUpdatesPreventedRef.current = true;
  }, []);

  const areItemUpdatesPrevented = React.useCallback(() => areItemUpdatesPreventedRef.current, []);

  React.useEffect(() => {
    if (instance.areItemUpdatesPrevented()) {
      return;
    }

    const newState = buildItemsState({
      disabledItemsFocusable: params.disabledItemsFocusable,
      items: params.items,
      config: itemsConfig,
    });

    store.set('items', { ...store.state.items, ...newState });
  }, [instance, store, params.items, params.disabledItemsFocusable, itemsConfig]);

  return {
    getRootProps: () => ({
      style: {
        '--TreeView-itemChildrenIndentation':
          typeof params.itemChildrenIndentation === 'number'
            ? `${params.itemChildrenIndentation}px`
            : params.itemChildrenIndentation,
      } as React.CSSProperties,
    }),
    publicAPI: {
      getItem,
      getItemDOMElement,
      getItemTree,
      getItemOrderedChildrenIds,
      setIsItemDisabled,
      getParentId,
    },
    instance: {
      preventItemUpdates,
      areItemUpdatesPrevented,
    },
  };
};

useTreeViewItems.getInitialState = (params) => ({
  items: buildItemsState({
    items: params.items,
    disabledItemsFocusable: params.disabledItemsFocusable,
    config: {
      isItemDisabled: params.isItemDisabled,
      getItemId: params.getItemId,
      getItemLabel: params.getItemLabel,
      getItemChildren: params.getItemChildren,
    },
  }),
});

useTreeViewItems.applyDefaultValuesToParams = ({ params }) => ({
  ...params,
  disabledItemsFocusable: params.disabledItemsFocusable ?? false,
  itemChildrenIndentation: params.itemChildrenIndentation ?? '12px',
});

useTreeViewItems.wrapRoot = ({ children }) => {
  return (
    <TreeViewItemDepthContext.Provider value={itemsSelectors.itemDepth}>
      {children}
    </TreeViewItemDepthContext.Provider>
  );
};

useTreeViewItems.params = {
  disabledItemsFocusable: true,
  items: true,
  isItemDisabled: true,
  getItemLabel: true,
  getItemChildren: true,
  getItemId: true,
  onItemClick: true,
  itemChildrenIndentation: true,
};
