import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { EventHandlers } from '@mui/base/utils';
import ownerDocument from '@mui/utils/ownerDocument';
import { TreeViewPlugin, TreeViewUsedInstance } from '../../models';
import { populateInstance, populatePublicAPI } from '../../useTreeView/useTreeView.utils';
import { UseTreeViewFocusSignature } from './useTreeViewFocus.types';
import { useInstanceEventHandler } from '../../hooks/useInstanceEventHandler';
import { getActiveElement } from '../../utils/utils';

const useTabbableItemId = (
  instance: TreeViewUsedInstance<UseTreeViewFocusSignature>,
  selectedItems: string | string[] | null,
) => {
  const isItemVisible = (itemId: string) => {
    const node = instance.getNode(itemId);
    return node && (node.parentId == null || instance.isNodeExpanded(node.parentId));
  };

  let tabbableItemId: string | null | undefined;
  if (Array.isArray(selectedItems)) {
    tabbableItemId = selectedItems.find(isItemVisible);
  } else if (selectedItems != null && isItemVisible(selectedItems)) {
    tabbableItemId = selectedItems;
  }

  if (tabbableItemId == null) {
    tabbableItemId = instance.getNavigableChildrenIds(null)[0];
  }

  return tabbableItemId;
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
  const tabbableItemId = useTabbableItemId(instance, models.selectedItems.value);

  const setFocusedItemId = useEventCallback((itemId: React.SetStateAction<string | null>) => {
    const cleanItemId = typeof itemId === 'function' ? itemId(state.focusedNodeId) : itemId;
    if (state.focusedNodeId !== cleanItemId) {
      setState((prevState) => ({ ...prevState, focusedNodeId: cleanItemId }));
    }
  });

  const isTreeViewFocused = React.useCallback(
    () =>
      !!rootRef.current &&
      rootRef.current.contains(getActiveElement(ownerDocument(rootRef.current))),
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

  const innerFocusItem = (event: React.SyntheticEvent | null, itemId: string) => {
    const node = instance.getNode(itemId);
    const itemElement = document.getElementById(instance.getTreeItemId(itemId, node.idAttribute));
    if (itemElement) {
      itemElement.focus();
    }

    setFocusedItemId(itemId);
    if (params.onItemFocus) {
      params.onItemFocus(event, itemId);
    }
  };

  const focusItem = useEventCallback((event: React.SyntheticEvent, nodeId: string) => {
    // If we receive a nodeId, and it is visible, the focus will be set to it
    if (isNodeVisible(nodeId)) {
      innerFocusItem(event, nodeId);
    }
  });

  const focusDefaultNode = useEventCallback((event: React.SyntheticEvent | null) => {
    let nodeToFocusId: string | null | undefined;
    if (Array.isArray(models.selectedItems.value)) {
      nodeToFocusId = models.selectedItems.value.find(isNodeVisible);
    } else if (models.selectedItems.value != null && isNodeVisible(models.selectedItems.value)) {
      nodeToFocusId = models.selectedItems.value;
    }

    if (nodeToFocusId == null) {
      nodeToFocusId = instance.getNavigableChildrenIds(null)[0];
    }

    innerFocusItem(event, nodeToFocusId);
  });

  const removeFocusedItem = useEventCallback(() => {
    if (state.focusedNodeId == null) {
      return;
    }

    const node = instance.getNode(state.focusedNodeId);
    const itemElement = document.getElementById(
      instance.getTreeItemId(state.focusedNodeId, node.idAttribute),
    );
    if (itemElement) {
      itemElement.blur();
    }

    setFocusedItemId(null);
  });

  const canItemBeTabbed = (itemId: string) => itemId === tabbableItemId;

  populateInstance<UseTreeViewFocusSignature>(instance, {
    isNodeFocused,
    canItemBeTabbed,
    focusItem,
    focusDefaultNode,
    removeFocusedItem,
  });

  populatePublicAPI<UseTreeViewFocusSignature>(publicAPI, {
    focusItem,
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
  onItemFocus: true,
};
