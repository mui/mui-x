import * as React from 'react';
import { TreeViewPlugin } from '../../models';
import {
  UseTreeViewItemsSignature,
  UseTreeViewItemsDefaultizedParameters,
  TreeViewItemIdAndChildren,
  UseTreeViewItemsState,
} from './useTreeViewItems.types';
import { publishTreeViewEvent } from '../../utils/publishTreeViewEvent';
import { TreeViewBaseItem } from '../../../models';
import { buildSiblingIndexes, TREE_VIEW_ROOT_PARENT_ID } from './useTreeViewItems.utils';

interface UpdateNodesStateParameters
  extends Pick<
    UseTreeViewItemsDefaultizedParameters<TreeViewBaseItem>,
    'items' | 'isItemDisabled' | 'getItemLabel' | 'getItemId'
  > {}

type State = UseTreeViewItemsState<any>['items'];
const updateItemsState = ({
  items,
  isItemDisabled,
  getItemLabel,
  getItemId,
}: UpdateNodesStateParameters): UseTreeViewItemsState<any>['items'] => {
  const itemMetaMap: State['itemMetaMap'] = {};
  const itemMap: State['itemMap'] = {};
  const itemOrderedChildrenIds: State['itemOrderedChildrenIds'] = {
    [TREE_VIEW_ROOT_PARENT_ID]: [],
  };

  const processItem = (
    item: TreeViewBaseItem,
    index: number,
    parentId: string | null,
  ): TreeViewItemIdAndChildren => {
    const id: string = getItemId ? getItemId(item) : (item as any).id;

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

    itemMetaMap[id] = {
      id,
      label,
      parentId,
      idAttribute: undefined,
      expandable: !!item.children?.length,
      disabled: isItemDisabled ? isItemDisabled(item) : false,
    };

    itemMap[id] = item;
    itemOrderedChildrenIds[id] = [];
    const parentIdWithDefault = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    if (!itemOrderedChildrenIds[parentIdWithDefault]) {
      itemOrderedChildrenIds[parentIdWithDefault] = [];
    }
    itemOrderedChildrenIds[parentIdWithDefault].push(id);

    return {
      id,
      children: item.children?.map((child, childIndex) => processItem(child, childIndex, id)),
    };
  };

  const itemTree = items.map((item, itemIndex) => processItem(item, itemIndex, null));

  const itemChildrenIndexes: State['itemChildrenIndexes'] = {};
  Object.keys(itemOrderedChildrenIds).forEach((parentId) => {
    itemChildrenIndexes[parentId] = buildSiblingIndexes(itemOrderedChildrenIds[parentId]);
  });

  return {
    itemMetaMap,
    itemTree,
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

  const getNavigableChildrenIds = (itemId: string | null) => {
    let childrenIds = instance.getItemOrderedChildrenIds(itemId);

    if (!params.disabledItemsFocusable) {
      childrenIds = childrenIds.filter((item) => !instance.isItemDisabled(item));
    }
    return childrenIds;
  };

  const areItemUpdatesPreventedRef = React.useRef(false);
  const preventItemUpdates = React.useCallback(() => {
    areItemUpdatesPreventedRef.current = true;
  }, []);

  const areItemUpdatesPrevented = React.useCallback(() => areItemUpdatesPreventedRef.current, []);

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

      return { ...prevState, items: newState };
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
    const getPropsFromItemId = ({
      id,
      children,
    }: TreeViewItemIdAndChildren): ReturnType<typeof instance.getItemsToRender>[number] => {
      const item = state.items.itemMetaMap[id];
      return {
        label: item.label!,
        itemId: item.id,
        id: item.idAttribute,
        children: children?.map(getPropsFromItemId),
      };
    };

    return state.items.itemTree.map(getPropsFromItemId);
  };

  return {
    publicAPI: {
      getItem,
    },
    instance: {
      getItemMeta,
      getItem,
      getItemsToRender,
      getItemIndex,
      getItemOrderedChildrenIds,
      getNavigableChildrenIds,
      isItemDisabled,
      preventItemUpdates,
      areItemUpdatesPrevented,
    },
    contextValue: { disabledItemsFocusable: params.disabledItemsFocusable },
  };
};

useTreeViewItems.getInitialState = (params) => ({
  items: updateItemsState({
    items: params.items,
    isItemDisabled: params.isItemDisabled,
    getItemId: params.getItemId,
    getItemLabel: params.getItemLabel,
  }),
});

useTreeViewItems.getDefaultizedParams = (params) => ({
  ...params,
  disabledItemsFocusable: params.disabledItemsFocusable ?? false,
});

useTreeViewItems.params = {
  disabledItemsFocusable: true,
  items: true,
  isItemDisabled: true,
  getItemLabel: true,
  getItemId: true,
};
