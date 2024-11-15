import * as React from 'react';
import Typography from '@mui/material/Typography';
import { TreeViewPlugin } from '../../models';
import {
  UseTreeViewItemsSignature,
  UseTreeViewItemsDefaultizedParameters,
  UseTreeViewItemsState,
  AddItemsParams,
} from './useTreeViewItems.types';
import { publishTreeViewEvent } from '../../utils/publishTreeViewEvent';
import { TreeViewBaseItem, TreeViewItemId } from '../../../models';
import { buildSiblingIndexes, TREE_VIEW_ROOT_PARENT_ID } from './useTreeViewItems.utils';
import { TreeViewItemDepthContext } from '../../TreeViewItemDepthContext';
import { generateTreeItemIdAttribute } from '../../corePlugins/useTreeViewId/useTreeViewId.utils';

interface UpdateNodesStateParameters
  extends Pick<
    UseTreeViewItemsDefaultizedParameters<TreeViewBaseItem>,
    'items' | 'isItemDisabled' | 'getItemLabel' | 'getItemId'
  > {
  // not sure where to put these
  initialDepth?: number;
  initialParentId?: string | null;
  getChildrenCount?: (item: TreeViewBaseItem) => number;
}

type State = UseTreeViewItemsState<any>['items'];

const checkId = (id: string | null, item: TreeViewBaseItem, itemMetaMap: State['itemMetaMap']) => {
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

  if (itemMetaMap[id] != null) {
    throw new Error(
      [
        'MUI X: The Tree View component requires all items to have a unique `id` property.',
        'Alternatively, you can use the `getItemId` prop to specify a custom id for each item.',
        `Two items were provided with the same id in the \`items\` prop: "${id}"`,
      ].join('\n'),
    );
  }
};

const updateItemsState = ({
  items,
  isItemDisabled,
  getItemLabel,
  getItemId,
  initialDepth = 0,
  initialParentId = null,
  getChildrenCount,
}: UpdateNodesStateParameters): Omit<State, 'loading'> => {
  const itemMetaMap: State['itemMetaMap'] = {};
  const itemMap: State['itemMap'] = {};
  const itemOrderedChildrenIds: State['itemOrderedChildrenIds'] = {
    [TREE_VIEW_ROOT_PARENT_ID]: [],
  };

  const processItem = (item: TreeViewBaseItem, depth: number, parentId: string | null) => {
    const id: string = getItemId ? getItemId(item) : (item as any).id;
    checkId(id, item, itemMetaMap);
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

    const isItemExpandable = getChildrenCount ? getChildrenCount(item) > 0 : false;

    itemMetaMap[id] = {
      id,
      label,
      parentId,
      idAttribute: undefined,
      expandable: !!item.children?.length || isItemExpandable,
      disabled: isItemDisabled ? isItemDisabled(item) : false,
      depth,
    };

    itemMap[id] = item;
    const parentIdWithDefault = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    if (!itemOrderedChildrenIds[parentIdWithDefault]) {
      itemOrderedChildrenIds[parentIdWithDefault] = [];
    }
    itemOrderedChildrenIds[parentIdWithDefault].push(id);

    item.children?.forEach((child) => processItem(child, depth + 1, id));
  };

  items?.forEach((item) => processItem(item, initialDepth, initialParentId));

  const itemChildrenIndexes: State['itemChildrenIndexes'] = {};
  Object.keys(itemOrderedChildrenIds).forEach((parentId) => {
    itemChildrenIndexes[parentId] = buildSiblingIndexes(itemOrderedChildrenIds[parentId]);
  });

  return {
    itemMetaMap,
    itemMap,
    itemOrderedChildrenIds,
    itemChildrenIndexes,
  };
};

export const useTreeViewItems: TreeViewPlugin<UseTreeViewItemsSignature> = ({
  instance,
  params,
  state,
  setState,
}) => {
  const getItemMeta = React.useCallback(
    (itemId: string) => state.items.itemMetaMap[itemId],
    [state.items.itemMetaMap],
  );

  const getItem = React.useCallback(
    (itemId: string) => state.items.itemMap[itemId],
    [state.items.itemMap],
  );

  const isTreeViewLoading = React.useMemo(
    () => state.items.loading || false,
    [state.items.loading],
  );
  const setTreeViewLoading = (isLoading) => {
    setState((prevState) => ({ ...prevState, items: { ...prevState.items, loading: isLoading } }));
  };

  const getItemTree = React.useCallback(() => {
    const getItemFromItemId = (id: TreeViewItemId): TreeViewBaseItem => {
      const { children: oldChildren, ...item } = state.items.itemMap[id];
      const newChildren = state.items.itemOrderedChildrenIds[id];
      if (newChildren) {
        item.children = newChildren.map(getItemFromItemId);
      }

      return item;
    };

    return state.items.itemOrderedChildrenIds[TREE_VIEW_ROOT_PARENT_ID].map(getItemFromItemId);
  }, [state.items.itemMap, state.items.itemOrderedChildrenIds]);

  const isItemDisabled = React.useCallback(
    (itemId: string | null): itemId is string => {
      if (itemId == null) {
        return false;
      }

      let itemMeta = instance.getItemMeta(itemId);

      // This can be called before the item has been added to the item map.
      if (!itemMeta) {
        return false;
      }

      if (itemMeta.disabled) {
        return true;
      }

      while (itemMeta.parentId != null) {
        itemMeta = instance.getItemMeta(itemMeta.parentId);
        if (itemMeta.disabled) {
          return true;
        }
      }

      return false;
    },
    [instance],
  );

  const getItemIndex = React.useCallback(
    (itemId: string) => {
      const parentId = instance.getItemMeta(itemId).parentId ?? TREE_VIEW_ROOT_PARENT_ID;
      return state.items.itemChildrenIndexes[parentId][itemId];
    },
    [instance, state.items.itemChildrenIndexes],
  );

  const getItemOrderedChildrenIds = React.useCallback(
    (itemId: string | null) =>
      state.items.itemOrderedChildrenIds[itemId ?? TREE_VIEW_ROOT_PARENT_ID] ?? [],
    [state.items.itemOrderedChildrenIds],
  );

  const getItemDOMElement = (itemId: string) => {
    const itemMeta = instance.getItemMeta(itemId);
    if (itemMeta == null) {
      return null;
    }

    return document.getElementById(
      generateTreeItemIdAttribute({ treeId: state.id.treeId, itemId, id: itemMeta.idAttribute }),
    );
  };

  const isItemNavigable = (itemId: string) => {
    if (params.disabledItemsFocusable) {
      return true;
    }
    return !instance.isItemDisabled(itemId);
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
  }: AddItemsParams<TreeViewBaseItem>) => {
    if (items) {
      const newState = updateItemsState({
        items,
        isItemDisabled: params.isItemDisabled,
        getItemId: params.getItemId,
        getItemLabel: params.getItemLabel,
        getChildrenCount,
        initialDepth: depth,
        initialParentId: parentId,
      });

      setState((prevState) => {
        let newItems;
        if (parentId) {
          newItems = {
            itemMap: prevState.items.itemMap,
            itemMetaMap: { ...prevState.items.itemMetaMap, ...newState.itemMetaMap },
            itemOrderedChildrenIds: {
              ...newState.itemOrderedChildrenIds,
              ...prevState.items.itemOrderedChildrenIds,
            },
            itemChildrenIndexes: {
              ...newState.itemChildrenIndexes,
              ...prevState.items.itemChildrenIndexes,
            },
          };
        } else {
          newItems = {
            itemMap: items,
            itemMetaMap: newState.itemMetaMap,
            itemOrderedChildrenIds: newState.itemOrderedChildrenIds,
            itemChildrenIndexes: newState.itemChildrenIndexes,
          };
        }
        Object.values(prevState.items.itemMetaMap).forEach((item) => {
          if (!newState.itemMetaMap[item.id]) {
            publishTreeViewEvent(instance, 'removeItem', { id: item.id });
          }
        });

        return { ...prevState, items: { ...newItems, loading: prevState.items.loading } };
      });
    }
  };
  const removeChildren = (parentId) => {
    setState((prevState) => {
      if (!parentId) {
        return {
          ...prevState,
          items: {
            ...prevState.items,
            itemMetaMap: {},
            itemOrderedChildrenIds: {},
            itemChildrenIndexes: {},
          },
        };
      }
      const newMetaMap = Object.keys(prevState.items.itemMetaMap).reduce((acc, key) => {
        const item = prevState.items.itemMetaMap[key];
        if (item.parentId === parentId) {
          publishTreeViewEvent(instance, 'removeItem', { id: item.id });
          return acc;
        }
        return { ...acc, [item.id]: item };
      }, {});

      const newItemOrderedChildrenIds = prevState.items.itemOrderedChildrenIds;
      const newItemChildrenIndexes = prevState.items.itemChildrenIndexes;
      delete newItemChildrenIndexes[parentId];
      delete newItemOrderedChildrenIds[parentId];

      return {
        ...prevState,
        items: {
          ...prevState.items,
          itemMetaMap: newMetaMap,
          itemOrderedChildrenIds: newItemOrderedChildrenIds,
          itemChildrenIndexes: newItemChildrenIndexes,
        },
      };
    });
  };

  React.useEffect(() => {
    if (instance.areItemUpdatesPrevented()) {
      return;
    }

    setState((prevState) => {
      const newState = updateItemsState({
        items: params.items,
        isItemDisabled: params.isItemDisabled,
        getItemId: params.getItemId,
        getItemLabel: params.getItemLabel,
      });

      Object.values(prevState.items.itemMetaMap).forEach((item) => {
        if (!newState.itemMetaMap[item.id]) {
          publishTreeViewEvent(instance, 'removeItem', { id: item.id });
        }
      });

      return { ...prevState, items: { ...newState, loading: false } };
    });
  }, [
    instance,
    setState,
    params.items,
    params.isItemDisabled,
    params.getItemId,
    params.getItemLabel,
  ]);

  const getItemsToRender = () => {
    const getPropsFromItemId = (
      id: TreeViewItemId,
    ): ReturnType<typeof instance.getItemsToRender>[number] => {
      const item = state.items.itemMetaMap[id];
      return {
        label: item.label!,
        itemId: item.id,
        id: item.idAttribute,
        children: state.items.itemOrderedChildrenIds[id]?.map(getPropsFromItemId),
      };
    };

    return state.items.itemOrderedChildrenIds[TREE_VIEW_ROOT_PARENT_ID].map(getPropsFromItemId);
  };

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
    },
    instance: {
      getItemMeta,
      getItem,
      getItemTree,
      getItemsToRender,
      getItemIndex,
      getItemDOMElement,
      getItemOrderedChildrenIds,
      isItemDisabled,
      isItemNavigable,
      preventItemUpdates,
      areItemUpdatesPrevented,
      addItems,
      isTreeViewLoading,
      setTreeViewLoading,
      removeChildren,
    },
    contextValue: {
      items: {
        onItemClick: params.onItemClick,
        disabledItemsFocusable: params.disabledItemsFocusable,
      },
    },
  };
};

useTreeViewItems.getInitialState = (params) => ({
  items: {
    ...updateItemsState({
      items: params.items,
      isItemDisabled: params.isItemDisabled,
      getItemId: params.getItemId,
      getItemLabel: params.getItemLabel,
    }),
    loading: false,
  },
});

useTreeViewItems.getDefaultizedParams = ({ params }) => ({
  ...params,
  disabledItemsFocusable: params.disabledItemsFocusable ?? false,
  itemChildrenIndentation: params.itemChildrenIndentation ?? '12px',
});

useTreeViewItems.wrapRoot = ({ children, instance }) => {
  if (instance.isTreeViewLoading) {
    return <Typography>Loading...</Typography>;
  }
  return (
    <TreeViewItemDepthContext.Provider value={(itemId) => instance.getItemMeta(itemId)?.depth ?? 0}>
      {children}
    </TreeViewItemDepthContext.Provider>
  );
};

useTreeViewItems.params = {
  disabledItemsFocusable: true,
  items: true,
  isItemDisabled: true,
  getItemLabel: true,
  getItemId: true,
  onItemClick: true,
  itemChildrenIndentation: true,
};
