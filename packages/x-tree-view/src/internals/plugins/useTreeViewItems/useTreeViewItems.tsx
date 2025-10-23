'use client';
import * as React from 'react';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewItemsSignature } from './useTreeViewItems.types';
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
