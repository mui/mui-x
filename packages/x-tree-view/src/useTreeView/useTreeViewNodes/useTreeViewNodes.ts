import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import ownerDocument from '@mui/utils/ownerDocument';
import { TreeViewPlugin } from '../../models';
import { populateInstance } from '../useTreeView.utils';
import { UseTreeViewNodesInstance, UseTreeViewNodesProps } from './useTreeViewNodes.types';
import type { TreeViewNode } from '../../TreeView/TreeView.types';

export const useTreeViewNodes: TreeViewPlugin<UseTreeViewNodesProps> = ({
  instance,
  props,
  rootRef,
}) => {
  const isNodeDisabled = React.useCallback(
    (nodeId: string | null): nodeId is string => {
      if (nodeId == null) {
        return false;
      }

      let node = instance.nodeMap[nodeId];

      // This can be called before the node has been added to the node map.
      if (!node) {
        return false;
      }

      if (node.disabled) {
        return true;
      }

      while (node.parentId != null) {
        node = instance.nodeMap[node.parentId];
        if (node.disabled) {
          return true;
        }
      }

      return false;
    },
    [instance],
  );

  // Using Object.keys -> .map to mimic Object.values we should replace with Object.values() once we stop IE11 support.
  const getChildrenIds = useEventCallback((nodeId: string | null) =>
    Object.keys(instance.nodeMap)
      .map((key) => {
        return instance.nodeMap[key];
      })
      .filter((node) => node.parentId === nodeId)
      .sort((a, b) => a.index - b.index)
      .map((child) => child.id),
  );

  const getNavigableChildrenIds = (nodeId: string | null) => {
    let childrenIds = instance.getChildrenIds(nodeId);

    if (!props.disabledItemsFocusable) {
      childrenIds = childrenIds.filter((node) => !instance.isNodeDisabled(node));
    }
    return childrenIds;
  };

  const registerNode = useEventCallback((node: TreeViewNode) => {
    const { id, index, parentId, expandable, idAttribute, disabled } = node;

    instance.nodeMap[id] = { id, index, parentId, expandable, idAttribute, disabled };
  });

  const unregisterNode = useEventCallback((nodeId: string) => {
    const newMap = { ...instance.nodeMap };
    delete newMap[nodeId];
    instance.nodeMap = newMap;

    instance.setFocusedNodeId((oldFocusedNodeId) => {
      if (
        oldFocusedNodeId === nodeId &&
        rootRef.current === ownerDocument(rootRef.current).activeElement
      ) {
        return instance.getChildrenIds(null)[0];
      }
      return oldFocusedNodeId;
    });
  });

  populateInstance<UseTreeViewNodesInstance>(instance, {
    isNodeDisabled,
    getChildrenIds,
    getNavigableChildrenIds,
    registerNode,
    unregisterNode,
  });
};
