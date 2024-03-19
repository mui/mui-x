import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { TreeViewPlugin } from '../../models';
import { populateInstance, populatePublicAPI } from '../../useTreeView/useTreeView.utils';
import {
  UseTreeViewNodesSignature,
  UseTreeViewNodesDefaultizedParameters,
  TreeViewNodeMap,
  TreeViewItemIdAndChildren,
  UseTreeViewNodesState,
  TreeViewItemMap,
  TreeViewItemChildrenIndexes,
} from './useTreeViewNodes.types';
import { publishTreeViewEvent } from '../../utils/publishTreeViewEvent';
import { TreeViewBaseItem } from '../../../models';
import { TREE_VIEW_ROOT_PARENT_ID } from './useTreeViewNodes.utils';

interface UpdateNodesStateParameters
  extends Pick<
    UseTreeViewNodesDefaultizedParameters<TreeViewBaseItem>,
    'items' | 'isItemDisabled' | 'getItemLabel' | 'getItemId'
  > {}

const updateNodesState = ({
  items,
  isItemDisabled,
  getItemLabel,
  getItemId,
}: UpdateNodesStateParameters): UseTreeViewNodesState<any>['nodes'] => {
  const nodeMap: TreeViewNodeMap = {};
  const itemMap: TreeViewItemMap<any> = {};
  const itemIndexes: { [parentId: string]: TreeViewItemChildrenIndexes } = {
    [TREE_VIEW_ROOT_PARENT_ID]: {},
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

    if (nodeMap[id] != null) {
      throw new Error(
        [
          'MUI X: The Tree View component requires all items to have a unique `id` property.',
          'Alternatively, you can use the `getItemId` prop to specify a custom id for each item.',
          `Tow items were provided with the same id in the \`items\` prop: "${id}"`,
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
      parentId,
      idAttribute: undefined,
      expandable: !!item.children?.length,
      disabled: isItemDisabled ? isItemDisabled(item) : false,
    };

    itemMap[id] = item;
    itemIndexes[id] = {};
    itemIndexes[parentId ?? TREE_VIEW_ROOT_PARENT_ID][id] = index;

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
    itemIndexes,
  };
};

export const useTreeViewNodes: TreeViewPlugin<UseTreeViewNodesSignature> = ({
  instance,
  publicAPI,
  params,
  state,
  setState,
}) => {
  const getNode = React.useCallback(
    (itemId: string) => state.nodes.nodeMap[itemId],
    [state.nodes.nodeMap],
  );

  const getItem = React.useCallback(
    (itemId: string) => state.nodes.itemMap[itemId],
    [state.nodes.itemMap],
  );

  const isNodeDisabled = React.useCallback(
    (itemId: string | null): itemId is string => {
      if (itemId == null) {
        return false;
      }

      let item = instance.getNode(itemId);

      // This can be called before the item has been added to the node map.
      if (!item) {
        return false;
      }

      if (item.disabled) {
        return true;
      }

      while (item.parentId != null) {
        item = instance.getNode(item.parentId);
        if (item.disabled) {
          return true;
        }
      }

      return false;
    },
    [instance],
  );

  const getChildrenIds = React.useCallback(
    (itemId: string | null) => {
      const childrenIndexes = state.nodes.itemIndexes[itemId ?? TREE_VIEW_ROOT_PARENT_ID];
      if (childrenIndexes == null) {
        return [];
      }

      return Object.entries(childrenIndexes)
        .sort((a, b) => a[1] - b[1])
        .map(([id]) => id);
    },
    [state.nodes.itemIndexes],
  );

  const getNavigableChildrenIds = (itemId: string | null) => {
    let childrenIds = instance.getChildrenIds(itemId);

    if (!params.disabledItemsFocusable) {
      childrenIds = childrenIds.filter((item) => !instance.isNodeDisabled(item));
    }
    return childrenIds;
  };

  const isItemUpdatedPreventedRef = React.useRef(false);
  const preventItemUpdate = useEventCallback(() => {
    isItemUpdatedPreventedRef.current = true;
  });

  React.useEffect(() => {
    if (isItemUpdatedPreventedRef.current) {
      return;
    }

    setState((prevState) => {
      const newState = updateNodesState({
        items: params.items,
        isItemDisabled: params.isItemDisabled,
        getItemId: params.getItemId,
        getItemLabel: params.getItemLabel,
      });

      Object.values(prevState.nodes.nodeMap).forEach((node) => {
        if (!newState.nodeMap[node.id]) {
          publishTreeViewEvent(instance, 'removeNode', { id: node.id });
        }
      });

      return { ...prevState, nodes: newState };
    });
  }, [
    instance,
    setState,
    params.items,
    params.isItemDisabled,
    params.getItemId,
    params.getItemLabel,
  ]);

  const getNodesToRender = () => {
    const getPropsFromItemId = ({
      id,
      children,
    }: TreeViewItemIdAndChildren): ReturnType<typeof instance.getNodesToRender>[number] => {
      const node = state.nodes.nodeMap[id];
      return {
        label: node.label!,
        itemId: node.id,
        id: node.idAttribute,
        children: children?.map(getPropsFromItemId),
      };
    };

    return state.nodes.nodeTree.map(getPropsFromItemId);
  };

  populateInstance<UseTreeViewNodesSignature>(instance, {
    getNode,
    getItem,
    getNodesToRender,
    getChildrenIds,
    getNavigableChildrenIds,
    isNodeDisabled,
    preventItemUpdate,
  });

  populatePublicAPI<UseTreeViewNodesSignature>(publicAPI, {
    getItem,
  });

  return {
    contextValue: { disabledItemsFocusable: params.disabledItemsFocusable },
  };
};

useTreeViewNodes.getInitialState = (params) => ({
  nodes: updateNodesState({
    items: params.items,
    isItemDisabled: params.isItemDisabled,
    getItemId: params.getItemId,
    getItemLabel: params.getItemLabel,
  }),
});

useTreeViewNodes.getDefaultizedParams = (params) => ({
  ...params,
  disabledItemsFocusable: params.disabledItemsFocusable ?? false,
});

useTreeViewNodes.params = {
  disabledItemsFocusable: true,
  items: true,
  isItemDisabled: true,
  getItemLabel: true,
  getItemId: true,
};
