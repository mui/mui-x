import * as React from 'react';
import { TreeViewPlugin } from '../../models';
import {
  UseTreeViewItemsSignature,
  UseTreeViewItemsDefaultizedParameters,
  TreeViewNodeMap,
  TreeViewItemIdAndChildren,
  UseTreeViewItemsState,
  TreeViewItemMap,
} from './useTreeViewItems.types';
import { publishTreeViewEvent } from '../../utils/publishTreeViewEvent';
import { TreeViewBaseItem } from '../../../models';

const updateItemsState = ({
  items,
  isItemDisabled,
  getItemLabel,
  getItemId,
}: Pick<
  UseTreeViewItemsDefaultizedParameters<TreeViewBaseItem>,
  'items' | 'isItemDisabled' | 'getItemLabel' | 'getItemId'
>): UseTreeViewItemsState<any>['items'] => {
  const nodeMap: TreeViewNodeMap = {};
  const itemMap: TreeViewItemMap<any> = {};

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

    if (nodeMap[id] != null) {
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

    nodeMap[id] = {
      id,
      label,
      index,
      parentId,
      idAttribute: undefined,
      expandable: !!item.children?.length,
      disabled: isItemDisabled ? isItemDisabled(item) : false,
    };

    itemMap[id] = item;

    return {
      id,
      children: item.children?.map((child, childIndex) => processItem(child, childIndex, id)),
    };
  };

  const nodeTree = items.map((item, itemIndex) => processItem(item, itemIndex, null));

  return {
    nodeMap,
    nodeTree,
    itemMap,
  };
};

export const useTreeViewItems: TreeViewPlugin<UseTreeViewItemsSignature> = ({
  instance,
  params,
  state,
  setState,
}) => {
  const getNode = React.useCallback(
    (itemId: string) => state.items.nodeMap[itemId],
    [state.items.nodeMap],
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

      let node = instance.getNode(itemId);

      // This can be called before the item has been added to the item map.
      if (!node) {
        return false;
      }

      if (node.disabled) {
        return true;
      }

      while (node.parentId != null) {
        node = instance.getNode(node.parentId);
        if (node.disabled) {
          return true;
        }
      }

      return false;
    },
    [instance],
  );

  const getChildrenIds = React.useCallback(
    (itemId: string | null) =>
      Object.values(state.items.nodeMap)
        .filter((item) => item.parentId === itemId)
        .sort((a, b) => a.index - b.index)
        .map((child) => child.id),
    [state.items.nodeMap],
  );

  const getNavigableChildrenIds = (itemId: string | null) => {
    let childrenIds = instance.getChildrenIds(itemId);

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

      Object.values(prevState.items.nodeMap).forEach((item) => {
        if (!newState.nodeMap[item.id]) {
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
      const item = state.items.nodeMap[id];
      return {
        label: item.label!,
        itemId: item.id,
        id: item.idAttribute,
        children: children?.map(getPropsFromItemId),
      };
    };

    return state.items.nodeTree.map(getPropsFromItemId);
  };

  return {
    publicAPI: {
      getItem,
    },
    instance: {
      getNode,
      getItem,
      getItemsToRender,
      getChildrenIds,
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
