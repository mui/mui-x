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
import {
  selectorItemMeta,
  selectorItemOrderedChildrenIds,
  selectorItemModel,
  selectorItemDepth,
} from './useTreeViewItems.selectors';
import { selectorTreeViewId } from '../../corePlugins/useTreeViewId/useTreeViewId.selectors';
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
    (itemId: string) => selectorItemModel(store.value, itemId),
    [store],
  );
  const getParentId = React.useCallback(
    (itemId: string) => {
      const itemMeta = selectorItemMeta(store.value, itemId);
      return itemMeta?.parentId || null;
    },
    [store],
  );

  const setIsItemDisabled = useEventCallback(
    ({ itemId, shouldBeDisabled }: { itemId: string; shouldBeDisabled?: boolean }) => {
      store.update((prevState) => {
        if (!prevState.items.itemMetaLookup[itemId]) {
          return prevState;
        }

        const itemMetaLookup = { ...prevState.items.itemMetaLookup };
        itemMetaLookup[itemId] = {
          ...itemMetaLookup[itemId],
          disabled: shouldBeDisabled ?? !itemMetaLookup[itemId].disabled,
        };
        return {
          ...prevState,
          items: {
            ...prevState.items,
            itemMetaLookup,
          },
        };
      });
    },
  );

  const getItemTree = React.useCallback(() => {
    const getItemFromItemId = (itemId: TreeViewItemId): TreeViewBaseItem => {
      const item = selectorItemModel(store.value, itemId);
      const newChildren = selectorItemOrderedChildrenIds(store.value, itemId);
      if (newChildren.length > 0) {
        item.children = newChildren.map(getItemFromItemId);
      } else {
        delete item.children;
      }

      return item;
    };

    return selectorItemOrderedChildrenIds(store.value, null).map(getItemFromItemId);
  }, [store]);

  const getItemOrderedChildrenIds = React.useCallback(
    (itemId: string | null) => selectorItemOrderedChildrenIds(store.value, itemId),
    [store],
  );

  const getItemDOMElement = (itemId: string) => {
    const itemMeta = selectorItemMeta(store.value, itemId);
    if (itemMeta == null) {
      return null;
    }

    const idAttribute = generateTreeItemIdAttribute({
      treeId: selectorTreeViewId(store.value),
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
    const parentDepth = parentId == null ? -1 : selectorItemDepth(store.value, parentId);

    const { metaLookup, modelLookup, orderedChildrenIds, childrenIndexes } = buildItemsLookups({
      config: itemsConfig,
      items,
      parentId,
      depth: parentDepth + 1,
      isItemExpandable: getChildrenCount ? (item) => getChildrenCount(item) > 0 : () => false,
    });

    const parentIdWithDefault = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    store.update((prevState) => {
      const lookups = {
        itemModelLookup: { ...prevState.items.itemModelLookup, ...modelLookup },
        itemMetaLookup: { ...prevState.items.itemMetaLookup, ...metaLookup },
        itemOrderedChildrenIdsLookup: {
          ...prevState.items.itemOrderedChildrenIdsLookup,
          [parentIdWithDefault]: orderedChildrenIds,
        },
        itemChildrenIndexesLookup: {
          ...prevState.items.itemChildrenIndexesLookup,
          [parentIdWithDefault]: childrenIndexes,
        },
      };
      Object.values(prevState.items.itemMetaLookup).forEach((item) => {
        if (!lookups.itemMetaLookup[item.id]) {
          publishTreeViewEvent(instance, 'removeItem', { id: item.id });
        }
      });
      return { ...prevState, items: { ...prevState.items, ...lookups } };
    });
  };

  const removeChildren = useEventCallback((parentId: string | null) => {
    store.update((prevState) => {
      const newMetaMap = Object.keys(prevState.items.itemMetaLookup).reduce((acc, key) => {
        const item = prevState.items.itemMetaLookup[key];
        if (item.parentId === parentId) {
          publishTreeViewEvent(instance, 'removeItem', { id: item.id });
          return acc;
        }
        return { ...acc, [item.id]: item };
      }, {});

      const newItemOrderedChildrenIdsLookup = prevState.items.itemOrderedChildrenIdsLookup;
      const newItemChildrenIndexesLookup = prevState.items.itemChildrenIndexesLookup;
      const cleanId = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
      delete newItemChildrenIndexesLookup[cleanId];
      delete newItemOrderedChildrenIdsLookup[cleanId];

      return {
        ...prevState,
        items: {
          ...prevState.items,
          itemMetaLookup: newMetaMap,
          itemOrderedChildrenIdsLookup: newItemOrderedChildrenIdsLookup,
          itemChildrenIndexesLookup: newItemChildrenIndexesLookup,
        },
      };
    });
  });

  React.useEffect(() => {
    if (instance.areItemUpdatesPrevented()) {
      return;
    }
    store.update((prevState) => {
      const newState = buildItemsState({
        disabledItemsFocusable: params.disabledItemsFocusable,
        items: params.items,
        config: itemsConfig,
      });

      Object.values(prevState.items.itemMetaLookup).forEach((item) => {
        if (!newState.itemMetaLookup[item.id]) {
          publishTreeViewEvent(instance, 'removeItem', { id: item.id });
        }
      });

      return { ...prevState, items: { ...prevState.items, ...newState } };
    });
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
    <TreeViewItemDepthContext.Provider value={selectorItemDepth}>
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
