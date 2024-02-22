import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { EventHandlers } from '@mui/base/utils';
import ownerDocument from '@mui/utils/ownerDocument';
import { TreeViewPlugin } from '../../models';
import { populateInstance, populatePublicAPI } from '../../useTreeView/useTreeView.utils';
import { UseTreeViewFocusSignature } from './useTreeViewFocus.types';
import { useInstanceEventHandler } from '../../hooks/useInstanceEventHandler';

export const useTreeViewFocus: TreeViewPlugin<UseTreeViewFocusSignature> = ({
  instance,
  publicAPI,
  params,
  state,
  setState,
  models,
  rootRef,
}) => {
  const focusedNodeId = state.focusedNodeId;
  const setFocusedNodeId = useEventCallback((nodeId: React.SetStateAction<string | null>) => {
    const cleanNodeId = typeof nodeId === 'function' ? nodeId(focusedNodeId) : nodeId;
    if (focusedNodeId !== cleanNodeId) {
      setState((prevState) => ({ ...prevState, focusedNodeId: cleanNodeId }));
    }
  });

  const isTreeFocused = React.useCallback(
    () => rootRef.current === document.activeElement,
    [rootRef],
  );

  const isNodeFocused = React.useCallback(
    (nodeId: string) => focusedNodeId === nodeId && isTreeFocused(),
    [focusedNodeId, isTreeFocused],
  );

  const isNodeVisible = (nodeId: string) => {
    const node = instance.getNode(nodeId);
    return node && (node.parentId == null || instance.isNodeExpanded(node.parentId));
  };

  const focusNode = useEventCallback((event: React.SyntheticEvent, nodeId: string | null) => {
    let nodeToFocusId: string | null | undefined;

    // if we receive a nodeId, and it is visible, the focus will be set to it
    if (nodeId && isNodeVisible(nodeId)) {
      nodeToFocusId = nodeId;
    } else if (!nodeId) {
      // if we don't receive a nodeId, we will try to find the first focusable node
      if (Array.isArray(models.selectedNodes.value)) {
        nodeToFocusId = models.selectedNodes.value.find(isNodeVisible);
      } else if (models.selectedNodes.value != null && isNodeVisible(models.selectedNodes.value)) {
        nodeToFocusId = models.selectedNodes.value;
      }

      if (nodeToFocusId == null) {
        nodeToFocusId = instance.getNavigableChildrenIds(null)[0];
      }
    }

    // if we have a focusable node, we set the focus to it
    // if nodeToFocusId is undefined, nothing happens
    if (nodeToFocusId) {
      if (!isTreeFocused()) {
        instance.focusRoot();
      }
      setFocusedNodeId(nodeToFocusId);
      if (params.onNodeFocus) {
        params.onNodeFocus(event, nodeToFocusId);
      }
    }
  });

  const focusRoot = useEventCallback(() => {
    rootRef.current?.focus({ preventScroll: true });
  });

  populateInstance<UseTreeViewFocusSignature>(instance, {
    isNodeFocused,
    focusNode,
    focusRoot,
  });

  populatePublicAPI<UseTreeViewFocusSignature>(publicAPI, {
    focusNode,
  });

  useInstanceEventHandler(instance, 'removeNode', ({ id }) => {
    setFocusedNodeId((oldFocusedNodeId) => {
      if (
        oldFocusedNodeId === id &&
        rootRef.current === ownerDocument(rootRef.current).activeElement
      ) {
        return instance.getChildrenIds(null)[0];
      }
      return oldFocusedNodeId;
    });
  });

  const createHandleFocus =
    (otherHandlers: EventHandlers) => (event: React.FocusEvent<HTMLUListElement>) => {
      otherHandlers.onFocus?.(event);
      // if the event bubbled (which is React specific) we don't want to steal focus
      if (event.target === event.currentTarget) {
        instance.focusNode(event, null);
      }
    };

  const createHandleBlur =
    (otherHandlers: EventHandlers) => (event: React.FocusEvent<HTMLUListElement>) => {
      otherHandlers.onBlur?.(event);
      setFocusedNodeId(null);
    };

  const focusedNode = instance.getNode(focusedNodeId!);
  const activeDescendant = focusedNode
    ? instance.getTreeItemId(focusedNode.id, focusedNode.idAttribute)
    : null;

  return {
    getRootProps: (otherHandlers) => ({
      onFocus: createHandleFocus(otherHandlers),
      onBlur: createHandleBlur(otherHandlers),
      'aria-activedescendant': activeDescendant ?? undefined,
    }),
  };
};

useTreeViewFocus.getInitialState = () => ({ focusedNodeId: null });

useTreeViewFocus.params = {
  onNodeFocus: true,
};
