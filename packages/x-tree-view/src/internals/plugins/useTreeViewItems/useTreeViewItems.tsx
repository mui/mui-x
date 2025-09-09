'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewItemsSignature, SetItemChildrenParameters } from './useTreeViewItems.types';
import { publishTreeViewEvent } from '../../utils/publishTreeViewEvent';
import { TreeViewBaseItem, TreeViewItemId } from '../../../models';
import {
  BuildItemsLookupConfig,
  buildItemsLookups,
  buildItemsState,
  TREE_VIEW_ROOT_PARENT_ID,
} from './useTreeViewItems.utils';
import { TreeViewItemDepthContext } from '../../TreeViewItemDepthContext';
import { itemsSelectors } from './useTreeViewItems.selectors';
import { idSelectors } from '../../corePlugins/useTreeViewId';
import { generateTreeItemIdAttribute } from '../../corePlugins/useTreeViewId/useTreeViewId.utils';

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

  const getItemDOMElement = (itemId: string) => {
    const itemMeta = itemsSelectors.itemMeta(store.state, itemId);
    if (itemMeta == null) {
      return null;
    }

    const idAttribute = generateTreeItemIdAttribute({
      treeId: idSelectors.treeId(store.state),
      itemId,
      id: itemMeta.idAttribute,
    });
    return document.getElementById(idAttribute);
  };

  const areItemUpdatesPreventedRef = React.useRef(false);
  const preventItemUpdates = React.useCallback(() => {
    areItemUpdatesPreventedRef.current = true;
  }, []);

  const areItemUpdatesPrevented = React.useCallback(() => areItemUpdatesPreventedRef.current, []);

  const setItemChildren = ({
    items,
    parentId,
    getChildrenCount,
  }: SetItemChildrenParameters<TreeViewBaseItem>) => {
    const parentIdWithDefault = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    const parentDepth = parentId == null ? -1 : itemsSelectors.itemDepth(store.state, parentId);

    const { metaLookup, modelLookup, orderedChildrenIds, childrenIndexes } = buildItemsLookups({
      config: itemsConfig,
      items,
      parentId,
      depth: parentDepth + 1,
      isItemExpandable: getChildrenCount ? (item) => getChildrenCount(item) > 0 : () => false,
      otherItemsMetaLookup: itemsSelectors.itemMetaLookup(store.state),
    });

    const lookups = {
      itemModelLookup: { ...store.state.items.itemModelLookup, ...modelLookup },
      itemMetaLookup: { ...store.state.items.itemMetaLookup, ...metaLookup },
      itemOrderedChildrenIdsLookup: {
        ...store.state.items.itemOrderedChildrenIdsLookup,
        [parentIdWithDefault]: orderedChildrenIds,
      },
      itemChildrenIndexesLookup: {
        ...store.state.items.itemChildrenIndexesLookup,
        [parentIdWithDefault]: childrenIndexes,
      },
    };
    Object.values(store.state.items.itemMetaLookup).forEach((item) => {
      if (!lookups.itemMetaLookup[item.id]) {
        publishTreeViewEvent(instance, 'removeItem', { id: item.id });
      }
    });

    store.set('items', { ...store.state.items, ...lookups });
  };

  const removeChildren = useEventCallback((parentId: string | null) => {
    const newMetaMap = Object.keys(store.state.items.itemMetaLookup).reduce((acc, key) => {
      const item = store.state.items.itemMetaLookup[key];
      if (item.parentId === parentId) {
        publishTreeViewEvent(instance, 'removeItem', { id: item.id });
        return acc;
      }
      return { ...acc, [item.id]: item };
    }, {});

    const newItemOrderedChildrenIdsLookup = { ...store.state.items.itemOrderedChildrenIdsLookup };
    const newItemChildrenIndexesLookup = { ...store.state.items.itemChildrenIndexesLookup };
    const cleanId = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    delete newItemChildrenIndexesLookup[cleanId];
    delete newItemOrderedChildrenIdsLookup[cleanId];

    store.set('items', {
      ...store.state.items,
      itemMetaLookup: newMetaMap,
      itemOrderedChildrenIdsLookup: newItemOrderedChildrenIdsLookup,
      itemChildrenIndexesLookup: newItemChildrenIndexesLookup,
    });
  });

  const addExpandableItems = useEventCallback((items: TreeViewItemId[]) => {
    const newItemMetaLookup = { ...store.state.items.itemMetaLookup };
    for (const itemId of items) {
      newItemMetaLookup[itemId] = { ...newItemMetaLookup[itemId], expandable: true };
    }
    store.set('items', {
      ...store.state.items,
      itemMetaLookup: newItemMetaLookup,
    });
  });

  React.useEffect(() => {
    if (instance.areItemUpdatesPrevented()) {
      return;
    }

    const newState = buildItemsState({
      disabledItemsFocusable: params.disabledItemsFocusable,
      items: params.items,
      config: itemsConfig,
    });

    Object.values(store.state.items.itemMetaLookup).forEach((item) => {
      if (!newState.itemMetaLookup[item.id]) {
        publishTreeViewEvent(instance, 'removeItem', { id: item.id });
      }
    });

    store.set('items', { ...store.state.items, ...newState });
  }, [instance, store, params.items, params.disabledItemsFocusable, itemsConfig]);

  // Wrap `props.onItemClick` with `useEventCallback` to prevent unneeded context updates.
  const handleItemClick = useEventCallback((event: React.MouseEvent, itemId: TreeViewItemId) => {
    if (params.onItemClick) {
      params.onItemClick(event, itemId);
    }
  });

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
      getItemDOMElement,
      preventItemUpdates,
      areItemUpdatesPrevented,
      setItemChildren,
      removeChildren,
      addExpandableItems,
      handleItemClick,
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
