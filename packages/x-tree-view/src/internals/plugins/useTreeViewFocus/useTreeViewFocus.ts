import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { EventHandlers } from '@mui/base/utils';
import ownerDocument from '@mui/utils/ownerDocument';
import { TreeViewPlugin } from '../../models';
import { populateInstance, populatePublicAPI } from '../../useTreeView/useTreeView.utils';
import { UseTreeViewFocusSignature } from './useTreeViewFocus.types';
import { useInstanceEventHandler } from '../../hooks/useInstanceEventHandler';
import { getActiveElement } from '../../utils/utils';

export const useTreeViewFocus: TreeViewPlugin<UseTreeViewFocusSignature> = ({
  instance,
  publicAPI,
  params,
  state,
  setState,
  models,
  rootRef,
}) => {
  const setFocusedNodeId = useEventCallback((nodeId: React.SetStateAction<string | null>) => {
    const cleanNodeId = typeof nodeId === 'function' ? nodeId(state.focusedNodeId) : nodeId;
    if (state.focusedNodeId !== cleanNodeId) {
      setState((prevState) => ({ ...prevState, focusedNodeId: cleanNodeId }));
    }
  });

  const isTreeViewFocused = React.useCallback(
    () => !!rootRef.current && rootRef.current === getActiveElement(ownerDocument(rootRef.current)),
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

  const focusNode = useEventCallback((event: React.SyntheticEvent, nodeId: string | null) => {
    // if we receive a nodeId, and it is visible, the focus will be set to it
    if (nodeId && isNodeVisible(nodeId)) {
      if (!isTreeViewFocused()) {
        instance.focusRoot();
      }
      setFocusedNodeId(nodeId);
      if (params.onNodeFocus) {
        params.onNodeFocus(event, nodeId);
      }
    }
  });

  const focusDefaultNode = useEventCallback((event: React.SyntheticEvent) => {
    let nodeToFocusId: string | null | undefined;
    if (Array.isArray(models.selectedNodes.value)) {
      nodeToFocusId = models.selectedNodes.value.find(isNodeVisible);
    } else if (models.selectedNodes.value != null && isNodeVisible(models.selectedNodes.value)) {
      nodeToFocusId = models.selectedNodes.value;
    }

    if (nodeToFocusId == null) {
      nodeToFocusId = instance.getNavigableChildrenIds(null)[0];
    }

    setFocusedNodeId(nodeToFocusId);
    if (params.onNodeFocus) {
      params.onNodeFocus(event, nodeToFocusId);
    }
  });

  const focusRoot = useEventCallback(() => {
    rootRef.current?.focus({ preventScroll: true });
  });

  populateInstance<UseTreeViewFocusSignature>(instance, {
    isNodeFocused,
    focusNode,
    focusRoot,
    focusDefaultNode,
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
        instance.focusDefaultNode(event);
      }
    };

  const createHandleBlur =
    (otherHandlers: EventHandlers) => (event: React.FocusEvent<HTMLUListElement>) => {
      otherHandlers.onBlur?.(event);
      setFocusedNodeId(null);
    };

  const focusedNode = instance.getNode(state.focusedNodeId!);
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
