'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { TreeViewPlugin } from '../../models';
import {
  UseTreeViewItemsSignature,
  UseTreeViewItemsParametersWithDefaults,
  UseTreeViewItemsState,
  AddItemsParameters,
} from './useTreeViewItems.types';
import { publishTreeViewEvent } from '../../utils/publishTreeViewEvent';
import { TreeViewBaseItem, TreeViewItemId } from '../../../models';
import { buildSiblingIndexes, TREE_VIEW_ROOT_PARENT_ID } from './useTreeViewItems.utils';
import { TreeViewItemDepthContext } from '../../TreeViewItemDepthContext';
import {
  selectorItemMeta,
  selectorItemOrderedChildrenIds,
  selectorItemModel,
  selectorItemDepth,
} from './useTreeViewItems.selectors';
import { selectorTreeViewId } from '../../corePlugins/useTreeViewId/useTreeViewId.selectors';
import { generateTreeItemIdAttribute } from '../../corePlugins/useTreeViewId/useTreeViewId.utils';

interface ProcessItemsLookupsParameters
  extends Pick<
    UseTreeViewItemsParametersWithDefaults<TreeViewBaseItem>,
    | 'items'
    | 'isItemDisabled'
    | 'getItemLabel'
    | 'getItemChildren'
    | 'getItemId'
    | 'disabledItemsFocusable'
  > {
  initialDepth?: number;
  initialParentId?: string | null;
  getChildrenCount?: (item: TreeViewBaseItem) => number;
  ignoreChildren?: boolean;
}

type State = UseTreeViewItemsState<any>['items'];

const checkId = (
  id: string | null,
  item: TreeViewBaseItem,
  itemMetaLookup: State['itemMetaLookup'],
) => {
  if (id == null) {
    throw new Error(
      [
        'MUI X: The Tree View component requires all items to have a unique `id` property.',
        'Alternatively, you can use the `getItemId` prop to specify a custom id for each item.',
        'An item was provided without id in the `items` prop:',
        JSON.stringify(item),
      ].join('\n'),
    );
  }

  if (itemMetaLookup[id] != null) {
    throw new Error(
      [
        'MUI X: The Tree View component requires all items to have a unique `id` property.',
        'Alternatively, you can use the `getItemId` prop to specify a custom id for each item.',
        `Two items were provided with the same id in the \`items\` prop: "${id}"`,
      ].join('\n'),
    );
  }
};

const processItemsLookups = ({
  disabledItemsFocusable,
  items,
  isItemDisabled,
  getItemLabel,
  getItemChildren,
  getItemId,
  initialDepth = 0,
  initialParentId = null,
  getChildrenCount,
  ignoreChildren = false,
}: ProcessItemsLookupsParameters): Omit<State, 'loading' | 'error'> => {
  const itemMetaLookup: State['itemMetaLookup'] = {};
  const itemModelLookup: State['itemModelLookup'] = {};
  const itemOrderedChildrenIdsLookup: State['itemOrderedChildrenIdsLookup'] = {
    [TREE_VIEW_ROOT_PARENT_ID]: [],
  };

  const processItem = (item: TreeViewBaseItem, depth: number, parentId: string | null) => {
    const id: string = getItemId ? getItemId(item) : (item as any).id;
    checkId(id, item, itemMetaLookup);
    const label = getItemLabel ? getItemLabel(item) : (item as { label: string }).label;
    if (label == null) {
      throw new Error(
        [
          'MUI X: The Tree View component requires all items to have a `label` property.',
          'Alternatively, you can use the `getItemLabel` prop to specify a custom label for each item.',
          'An item was provided without label in the `items` prop:',
          JSON.stringify(item),
        ].join('\n'),
      );
    }
    const children = getItemChildren
      ? getItemChildren(item)
      : (item as { children?: TreeViewBaseItem[] }).children;

    itemMetaLookup[id] = {
      id,
      label,
      parentId,
      idAttribute: undefined,
      expandable: getChildrenCount ? getChildrenCount(item) > 0 : !!children?.length,
      disabled: isItemDisabled ? isItemDisabled(item) : false,
      depth,
    };

    itemModelLookup[id] = item;
    const parentIdWithDefault = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    if (!itemOrderedChildrenIdsLookup[parentIdWithDefault]) {
      itemOrderedChildrenIdsLookup[parentIdWithDefault] = [];
    }
    itemOrderedChildrenIdsLookup[parentIdWithDefault].push(id);

    // if lazy loading is enabled, we don't want to process children passed through the `items` prop
    if (!ignoreChildren) {
      children?.forEach((child) => processItem(child, depth + 1, id));
    }
  };

  items?.forEach((item) => processItem(item, initialDepth, initialParentId));

  const itemChildrenIndexesLookup: State['itemChildrenIndexesLookup'] = {};
  Object.keys(itemOrderedChildrenIdsLookup).forEach((parentId) => {
    itemChildrenIndexesLookup[parentId] = buildSiblingIndexes(
      itemOrderedChildrenIdsLookup[parentId],
    );
  });

  return {
    disabledItemsFocusable,
    itemMetaLookup,
    itemModelLookup,
    itemOrderedChildrenIdsLookup,
    itemChildrenIndexesLookup,
  };
};

export const useTreeViewItems: TreeViewPlugin<UseTreeViewItemsSignature> = ({
  instance,
  params,
  store,
}) => {
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

  const setTreeViewLoading = useEventCallback((isLoading: boolean) => {
    store.update((prevState) => ({
      ...prevState,
      items: { ...prevState.items, loading: isLoading },
    }));
  });
  const setTreeViewError = useEventCallback((error: Error | null) => {
    store.update((prevState) => ({
      ...prevState,
      items: { ...prevState.items, error },
    }));
  });

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

  const addItems = ({
    items,
    parentId,
    depth,
    getChildrenCount,
  }: AddItemsParameters<TreeViewBaseItem>) => {
    if (items) {
      const newState = processItemsLookups({
        disabledItemsFocusable: params.disabledItemsFocusable,
        items,
        isItemDisabled: params.isItemDisabled,
        getItemId: params.getItemId,
        getItemLabel: params.getItemLabel,
        getItemChildren: params.getItemChildren,
        getChildrenCount,
        initialDepth: depth,
        initialParentId: parentId,
        ignoreChildren: true,
      });

      store.update((prevState) => {
        let newItems;
        if (parentId) {
          newItems = {
            itemModelLookup: { ...prevState.items.itemModelLookup, ...newState.itemModelLookup },
            itemMetaLookup: { ...prevState.items.itemMetaLookup, ...newState.itemMetaLookup },
            itemOrderedChildrenIdsLookup: {
              ...newState.itemOrderedChildrenIdsLookup,
              ...prevState.items.itemOrderedChildrenIdsLookup,
            },
            itemChildrenIndexesLookup: {
              ...newState.itemChildrenIndexesLookup,
              ...prevState.items.itemChildrenIndexesLookup,
            },
          };
        } else {
          newItems = {
            itemModelLookup: newState.itemModelLookup,
            itemMetaLookup: newState.itemMetaLookup,
            itemOrderedChildrenIdsLookup: newState.itemOrderedChildrenIdsLookup,
            itemChildrenIndexesLookup: newState.itemChildrenIndexesLookup,
          };
        }
        Object.values(prevState.items.itemMetaLookup).forEach((item) => {
          if (!newItems.itemMetaLookup[item.id]) {
            publishTreeViewEvent(instance, 'removeItem', { id: item.id });
          }
        });
        return { ...prevState, items: { ...prevState.items, ...newItems } };
      });
    }
  };
  const removeChildren = (parentId: string | undefined) => {
    store.update((prevState) => {
      if (!parentId) {
        return {
          ...prevState,
          items: {
            ...prevState.items,
            itemMetaLookup: {},
            itemOrderedChildrenIdsLookup: {},
            itemChildrenIndexesLookup: {},
          },
        };
      }
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
      delete newItemChildrenIndexesLookup[parentId];
      delete newItemOrderedChildrenIdsLookup[parentId];

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
  };

  React.useEffect(() => {
    if (instance.areItemUpdatesPrevented()) {
      return;
    }
    store.update((prevState) => {
      const newState = processItemsLookups({
        disabledItemsFocusable: params.disabledItemsFocusable,
        items: params.items,
        isItemDisabled: params.isItemDisabled,
        getItemId: params.getItemId,
        getItemLabel: params.getItemLabel,
        getItemChildren: params.getItemChildren,
      });

      Object.values(prevState.items.itemMetaLookup).forEach((item) => {
        if (!newState.itemMetaLookup[item.id]) {
          publishTreeViewEvent(instance, 'removeItem', { id: item.id });
        }
      });

      return { ...prevState, items: { ...prevState.items, ...newState } };
    });
  }, [
    instance,
    store,
    params.items,
    params.disabledItemsFocusable,
    params.isItemDisabled,
    params.getItemId,
    params.getItemLabel,
    params.getItemChildren,
  ]);

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
      addItems,
      setTreeViewLoading,
      setTreeViewError,
      removeChildren,
      handleItemClick,
    },
  };
};

useTreeViewItems.getInitialState = (params) => ({
  items: {
    ...processItemsLookups({
      disabledItemsFocusable: params.disabledItemsFocusable,
      items: params.items,
      isItemDisabled: params.isItemDisabled,
      getItemId: params.getItemId,
      getItemLabel: params.getItemLabel,
      getItemChildren: params.getItemChildren,
    }),
    loading: false,
    error: null,
  },
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
