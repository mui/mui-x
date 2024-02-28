import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { EventHandlers } from '@mui/base/utils';
import ownerDocument from '@mui/utils/ownerDocument';
import { TreeViewPlugin, TreeViewUsedInstance } from '../../models';
import { populateInstance, populatePublicAPI } from '../../useTreeView/useTreeView.utils';
import { UseTreeViewFocusSignature } from './useTreeViewFocus.types';
import { useInstanceEventHandler } from '../../hooks/useInstanceEventHandler';
import { getActiveElement } from '../../utils/utils';

const useTabbableNodeId = (
  instance: TreeViewUsedInstance<UseTreeViewFocusSignature>,
  selectedNodes: string | string[] | null,
) => {
  const isNodeVisible = (nodeId: string) => {
    const node = instance.getNode(nodeId);
    return node && (node.parentId == null || instance.isNodeExpanded(node.parentId));
  };

  let tabbableNodeId: string | null | undefined;
  if (Array.isArray(selectedNodes)) {
    tabbableNodeId = selectedNodes.find(isNodeVisible);
  } else if (selectedNodes != null && isNodeVisible(selectedNodes)) {
    tabbableNodeId = selectedNodes;
  }

  if (tabbableNodeId == null) {
    tabbableNodeId = instance.getNavigableChildrenIds(null)[0];
  }

  return tabbableNodeId;
};

export const useTreeViewFocus: TreeViewPlugin<UseTreeViewFocusSignature> = ({
  instance,
  publicAPI,
  params,
  state,
  setState,
  models,
  rootRef,
}) => {
  const tabbableNodeId = useTabbableNodeId(instance, models.selectedNodes.value);

  const setFocusedNodeId = useEventCallback((nodeId: React.SetStateAction<string | null>) => {
    const cleanNodeId = typeof nodeId === 'function' ? nodeId(state.focusedNodeId) : nodeId;
    if (state.focusedNodeId !== cleanNodeId) {
      setState((prevState) => ({ ...prevState, focusedNodeId: cleanNodeId }));
    }
  });

  const isTreeViewFocused = React.useCallback(
    () =>
      !!rootRef.current &&
      rootRef.current.contains(getActiveElement(ownerDocument(rootRef.current))),
    [rootRef],
  );

  const isNodeFocused = React.useCallback(
    (nodeId: string) => state.focusedNodeId === nodeId && isTreeViewFocused(),
    [state.focusedNodeId, isTreeViewFocused],
  );

  const isNodeVisible = (nodeId: string) => {
    const node = instance.getNode(nodeId);
    return node && (node.parentId == null || instance.isNodeExpanded(node.parentId));
  };

  const innerFocusNode = (event: React.SyntheticEvent | null, nodeId: string) => {
    const node = instance.getNode(nodeId);
    const nodeElement = document.getElementById(instance.getTreeItemId(nodeId, node.idAttribute));
    if (nodeElement) {
      nodeElement.focus({ preventScroll: true });
    }

    setFocusedNodeId(nodeId);
    if (params.onNodeFocus) {
      params.onNodeFocus(event, nodeId);
    }
  };

  const focusNode = useEventCallback((event: React.SyntheticEvent, nodeId: string) => {
    // If we receive a nodeId, and it is visible, the focus will be set to it
    if (isNodeVisible(nodeId)) {
      innerFocusNode(event, nodeId);
    }
  });

  const focusDefaultNode = useEventCallback((event: React.SyntheticEvent | null) => {
    let nodeToFocusId: string | null | undefined;
    if (Array.isArray(models.selectedNodes.value)) {
      nodeToFocusId = models.selectedNodes.value.find(isNodeVisible);
    } else if (models.selectedNodes.value != null && isNodeVisible(models.selectedNodes.value)) {
      nodeToFocusId = models.selectedNodes.value;
    }

    if (nodeToFocusId == null) {
      nodeToFocusId = instance.getNavigableChildrenIds(null)[0];
    }

    innerFocusNode(event, nodeToFocusId);
  });

  const removeFocusedNode = useEventCallback(() => {
    if (state.focusedNodeId == null) {
      return;
    }

    const node = instance.getNode(state.focusedNodeId);
    const nodeElement = document.getElementById(
      instance.getTreeItemId(state.focusedNodeId, node.idAttribute),
    );
    if (nodeElement) {
      nodeElement.blur();
    }

    setFocusedNodeId(null);
  });

  const canNodeBeTabbed = (nodeId: string) => nodeId === tabbableNodeId;

  populateInstance<UseTreeViewFocusSignature>(instance, {
    isNodeFocused,
    isTreeViewFocused,
    canNodeBeTabbed,
    focusNode,
    focusDefaultNode,
    removeFocusedNode,
  });

  populatePublicAPI<UseTreeViewFocusSignature>(publicAPI, {
    focusNode,
  });

  useInstanceEventHandler(instance, 'removeNode', ({ id }) => {
    if (state.focusedNodeId === id) {
      instance.focusDefaultNode(null);
    }
  });

  const createHandleFocus =
    (otherHandlers: EventHandlers) => (event: React.FocusEvent<HTMLUListElement>) => {
      otherHandlers.onFocus?.(event);
      // if the event bubbled (which is React specific) we don't want to steal focus
      if (event.target === event.currentTarget) {
        instance.focusDefaultNode(event);
      }
    };

  const focusedNode = instance.getNode(state.focusedNodeId!);
  const activeDescendant = focusedNode
    ? instance.getTreeItemId(focusedNode.id, focusedNode.idAttribute)
    : null;

  return {
    getRootProps: (otherHandlers) => ({
      onFocus: createHandleFocus(otherHandlers),
      'aria-activedescendant': activeDescendant ?? undefined,
    }),
  };
};

useTreeViewFocus.getInitialState = () => ({ focusedNodeId: null });

useTreeViewFocus.params = {
  onNodeFocus: true,
};
