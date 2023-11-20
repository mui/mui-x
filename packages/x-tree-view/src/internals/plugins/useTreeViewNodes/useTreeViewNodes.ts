import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { TreeViewNode, TreeViewPlugin } from '../../models';
import { populateInstance } from '../../useTreeView/useTreeView.utils';
import { UseTreeViewNodesSignature } from './useTreeViewNodes.types';
import { publishTreeViewEvent } from '../../utils/publishTreeViewEvent';
import { TreeViewItem } from '../../../models';

export const useTreeViewNodes: TreeViewPlugin<UseTreeViewNodesSignature> = ({
  instance,
  params,
}) => {
  const nodeMap = React.useRef<{ [nodeId: string]: TreeViewNode }>({});

  const getNode = React.useCallback((nodeId: string) => nodeMap.current[nodeId], []);

  const insertNode = React.useCallback((node: TreeViewNode) => {
    nodeMap.current[node.id] = node;
  }, []);

  const removeNode = React.useCallback(
    (nodeId: string) => {
      const newMap = { ...nodeMap.current };
      delete newMap[nodeId];
      nodeMap.current = newMap;
      publishTreeViewEvent(instance, 'removeNode', { id: nodeId });
    },
    [instance],
  );

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
    Object.values(nodeMap.current)
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
    const newNodeMap: { [nodeId: string]: TreeViewNode } = {};

    const processItem = (item: TreeViewItem, index: number, parentId: string | null) => {
      newNodeMap[item.nodeId] = {
        id: item.nodeId,
        idAttribute: item.id,
        index,
        parentId,
        expandable: !!item.children?.length,
        disabled: item.disabled,
      };

      item.children?.forEach((child, childIndex) => processItem(child, childIndex, item.nodeId));
    };

    params.items.forEach((item, itemIndex) => processItem(item, itemIndex, null));

    Object.values(nodeMap.current).forEach((node) => {
      if (!newNodeMap[node.id]) {
        publishTreeViewEvent(instance, 'removeNode', { id: node.id });
      }
    });

    nodeMap.current = newNodeMap;
  }, [instance, params.items]);

  populateInstance<UseTreeViewNodesSignature>(instance, {
    getNode,
    insertNode,
    removeNode,
    getChildrenIds,
    getNavigableChildrenIds,
    isNodeDisabled,
  });
};
