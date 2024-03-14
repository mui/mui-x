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
  const setFocusedItemId = useEventCallback((itemId: React.SetStateAction<string | null>) => {
    const cleanItemId = typeof itemId === 'function' ? itemId(state.focusedNodeId) : itemId;
    if (state.focusedNodeId !== cleanItemId) {
      setState((prevState) => ({ ...prevState, focusedNodeId: cleanItemId }));
    }
  });

  const isTreeViewFocused = React.useCallback(
    () => !!rootRef.current && rootRef.current === getActiveElement(ownerDocument(rootRef.current)),
    [rootRef],
  );

  const isNodeFocused = React.useCallback(
    (itemId: string) => state.focusedNodeId === itemId && isTreeViewFocused(),
    [state.focusedNodeId, isTreeViewFocused],
  );

  const isNodeVisible = (itemId: string) => {
    const node = instance.getNode(itemId);
    return node && (node.parentId == null || instance.isNodeExpanded(node.parentId));
  };

  const focusItem = useEventCallback((event: React.SyntheticEvent, itemId: string | null) => {
    // if we receive an itemId, and it is visible, the focus will be set to it
    if (itemId && isNodeVisible(itemId)) {
      if (!isTreeViewFocused()) {
        instance.focusRoot();
      }
      setFocusedItemId(itemId);
      if (params.onItemFocus) {
        params.onItemFocus(event, itemId);
      }
    }
  });

  const focusDefaultNode = useEventCallback((event: React.SyntheticEvent) => {
    let nodeToFocusId: string | null | undefined;
    if (Array.isArray(models.selectedItems.value)) {
      nodeToFocusId = models.selectedItems.value.find(isNodeVisible);
    } else if (models.selectedItems.value != null && isNodeVisible(models.selectedItems.value)) {
      nodeToFocusId = models.selectedItems.value;
    }

    if (nodeToFocusId == null) {
      nodeToFocusId = instance.getNavigableChildrenIds(null)[0];
    }

    setFocusedItemId(nodeToFocusId);
    if (params.onItemFocus) {
      params.onItemFocus(event, nodeToFocusId);
    }
  });

  const focusRoot = useEventCallback(() => {
    rootRef.current?.focus({ preventScroll: true });
  });

  populateInstance<UseTreeViewFocusSignature>(instance, {
    isNodeFocused,
    focusItem,
    focusRoot,
    focusDefaultNode,
  });

  populatePublicAPI<UseTreeViewFocusSignature>(publicAPI, {
    focusItem,
  });

  useInstanceEventHandler(instance, 'removeNode', ({ id }) => {
    setFocusedItemId((oldFocusedItemId) => {
      if (
        oldFocusedItemId === id &&
        rootRef.current === ownerDocument(rootRef.current).activeElement
      ) {
        return instance.getChildrenIds(null)[0];
      }
      return oldFocusedItemId;
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
      setFocusedItemId(null);
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
  onItemFocus: true,
};
