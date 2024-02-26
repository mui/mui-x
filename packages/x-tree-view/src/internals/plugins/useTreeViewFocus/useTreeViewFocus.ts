import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { EventHandlers } from '@mui/base/utils';
import ownerDocument from '@mui/utils/ownerDocument';
import { TreeViewPlugin, TreeViewUsedInstance } from '../../models';
import { populateInstance } from '../../useTreeView/useTreeView.utils';
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
  params,
  state,
  setState,
  models,
  rootRef,
}) => {
  const tabbableNodeId = useTabbableNodeId(instance, models.selectedNodes.value);

  const setFocusedNodeId = useEventCallback((nodeId: React.SetStateAction<string | null>) => {
    const cleanNodeId = typeof nodeId === 'function' ? nodeId(state.focusedNodeId) : nodeId;
    setState((prevState) => ({ ...prevState, focusedNodeId: cleanNodeId }));
  });

  const isNodeFocused = React.useCallback(
    (nodeId: string) => state.focusedNodeId === nodeId,
    [state.focusedNodeId],
  );

  const focusNode = useEventCallback((event: React.SyntheticEvent, nodeId: string | null) => {
    if (nodeId) {
      setFocusedNodeId(nodeId);

      if (params.onNodeFocus) {
        params.onNodeFocus(event, nodeId);
      }
    }
  });

  const canNodeBeTabbed = (nodeId: string) => nodeId === tabbableNodeId;

  populateInstance<UseTreeViewFocusSignature>(instance, {
    isNodeFocused,
    canNodeBeTabbed,
    focusNode,
  });

  useInstanceEventHandler(instance, 'removeNode', ({ id }) => {
    setFocusedNodeId((oldFocusedNodeId) => {
      if (oldFocusedNodeId === id) {
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
        const isNodeVisible = (nodeId: string) => {
          const node = instance.getNode(nodeId);
          return node && (node.parentId == null || instance.isNodeExpanded(node.parentId));
        };

        let nodeToFocusId: string | null | undefined;
        if (Array.isArray(models.selectedNodes.value)) {
          nodeToFocusId = models.selectedNodes.value.find(isNodeVisible);
        } else if (
          models.selectedNodes.value != null &&
          isNodeVisible(models.selectedNodes.value)
        ) {
          nodeToFocusId = models.selectedNodes.value;
        }

        if (nodeToFocusId == null) {
          nodeToFocusId = instance.getNavigableChildrenIds(null)[0];
        }

        instance.focusNode(event, nodeToFocusId);
      }
    };

  const createHandleBlur =
    (otherHandlers: EventHandlers) => (event: React.FocusEvent<HTMLUListElement>) => {
      window.setTimeout(() => {
        const activeElement = getActiveElement(ownerDocument(rootRef.current));
        if (rootRef.current && !rootRef.current.contains(activeElement)) {
          setFocusedNodeId(null);
        }
      });
      otherHandlers.onBlur?.(event);
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
