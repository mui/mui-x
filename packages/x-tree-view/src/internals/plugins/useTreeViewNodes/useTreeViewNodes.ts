import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { TreeViewPlugin } from '../../models';
import { populateInstance } from '../../useTreeView/useTreeView.utils';
import { UseTreeViewNodesSignature, TreeViewNodeMap } from './useTreeViewNodes.types';
import { publishTreeViewEvent } from '../../utils/publishTreeViewEvent';
import { TreeViewBaseItem } from '../../../models';

const getNodeMapFromItems = ({
  items,
  isItemDisabled,
}: {
  items: readonly TreeViewBaseItem[];
  isItemDisabled: ((item: TreeViewBaseItem) => boolean) | undefined;
}) => {
  const newNodeMap: TreeViewNodeMap = {};

  const processItem = (item: TreeViewBaseItem, index: number, parentId: string | null) => {
    newNodeMap[item.nodeId] = {
      id: item.nodeId,
      idAttribute: item.id,
      index,
      parentId,
      expandable: !!item.children?.length,
      disabled: isItemDisabled ? isItemDisabled(item) : false,
    };

    item.children?.forEach((child, childIndex) => processItem(child, childIndex, item.nodeId));
  };

  items.forEach((item, itemIndex) => processItem(item, itemIndex, null));

  return newNodeMap;
};

export const useTreeViewNodes: TreeViewPlugin<UseTreeViewNodesSignature> = ({
  instance,
  params,
  state,
  setState,
}) => {
  const getNode = React.useCallback((nodeId: string) => state.nodeMap[nodeId], [state.nodeMap]);

  const isNodeDisabled = React.useCallback(
    (nodeId: string | null): nodeId is string => {
      if (nodeId == null) {
        return false;
      }

      let node = instance.getNode(nodeId);

      // This can be called before the node has been added to the node map.
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

  const getChildrenIds = useEventCallback((nodeId: string | null) =>
    Object.values(state.nodeMap)
      .filter((node) => node.parentId === nodeId)
      .sort((a, b) => a.index - b.index)
      .map((child) => child.id),
  );

  const getNavigableChildrenIds = (nodeId: string | null) => {
    let childrenIds = instance.getChildrenIds(nodeId);

    if (!params.disabledItemsFocusable) {
      childrenIds = childrenIds.filter((node) => !instance.isNodeDisabled(node));
    }
    return childrenIds;
  };

  React.useEffect(() => {
    setState((prevState) => {
      const newNodeMap = getNodeMapFromItems({
        items: params.items,
        isItemDisabled: params.isItemDisabled,
      });

      Object.values(prevState.nodeMap).forEach((node) => {
        if (!newNodeMap[node.id]) {
          publishTreeViewEvent(instance, 'removeNode', { id: node.id });
        }
      });

      return { ...prevState, nodeMap: newNodeMap };
    });
  }, [params.items, params.isItemDisabled, instance, setState]);

  populateInstance<UseTreeViewNodesSignature>(instance, {
    getNode,
    getChildrenIds,
    getNavigableChildrenIds,
    isNodeDisabled,
  });
};

useTreeViewNodes.getInitialState = (params) => ({
  nodeMap: getNodeMapFromItems({ items: params.items, isItemDisabled: params.isItemDisabled }),
});
