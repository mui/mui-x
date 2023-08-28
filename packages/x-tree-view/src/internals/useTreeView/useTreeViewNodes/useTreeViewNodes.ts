import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import ownerDocument from '@mui/utils/ownerDocument';
import { TreeViewPlugin } from '../../../models';
import { populateInstance } from '../useTreeView.utils';
import {
  UseTreeViewNodesInstance,
  UseTreeViewNodesDefaultizedParameters,
} from './useTreeViewNodes.types';
import { TreeViewNode } from '../../models';

export const useTreeViewNodes: TreeViewPlugin<UseTreeViewNodesDefaultizedParameters> = ({
  instance,
  props,
  rootRef,
}) => {
  const nodeMap = React.useRef<{ [nodeId: string]: TreeViewNode }>({});

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

    if (!props.disabledItemsFocusable) {
      childrenIds = childrenIds.filter((node) => !instance.isNodeDisabled(node));
    }
    return childrenIds;
  };

  const registerNode = useEventCallback((node: TreeViewNode) => {
    const { id, index, parentId, expandable, idAttribute, disabled } = node;

    nodeMap.current[id] = { id, index, parentId, expandable, idAttribute, disabled };

    return () => {
      const newMap = { ...nodeMap.current };
      delete newMap[id];
      nodeMap.current = newMap;

      instance.setFocusedNodeId((oldFocusedNodeId) => {
        if (
          oldFocusedNodeId === id &&
          rootRef.current === ownerDocument(rootRef.current).activeElement
        ) {
          return instance.getChildrenIds(null)[0];
        }
        return oldFocusedNodeId;
      });
    };
  });

  const getNode = React.useCallback((nodeId: string) => nodeMap.current[nodeId], []);

  populateInstance<UseTreeViewNodesInstance>(instance, {
    getNode,
    getChildrenIds,
    getNavigableChildrenIds,
    isNodeDisabled,
    registerNode,
  });
};
