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
    const cleanItemId = typeof itemId === 'function' ? itemId(state.focusedItemId) : itemId;
    if (state.focusedItemId !== cleanItemId) {
      setState((prevState) => ({ ...prevState, focusedItemId: cleanItemId }));
    }
  });

  const isTreeViewFocused = React.useCallback(
    () => !!rootRef.current && rootRef.current === getActiveElement(ownerDocument(rootRef.current)),
    [rootRef],
  );

  const isItemFocused = React.useCallback(
    (itemId: string) => state.focusedItemId === itemId && isTreeViewFocused(),
    [state.focusedItemId, isTreeViewFocused],
  );

  const isItemVisible = (itemId: string) => {
    const item = instance.getNode(itemId);
    return item && (item.parentId == null || instance.isItemExpanded(item.parentId));
  };

  const focusItem = useEventCallback((event: React.SyntheticEvent, itemId: string | null) => {
    // if we receive an itemId, and it is visible, the focus will be set to it
    if (itemId && isItemVisible(itemId)) {
      if (!isTreeViewFocused()) {
        instance.focusRoot();
      }
      setFocusedItemId(itemId);
      if (params.onItemFocus) {
        params.onItemFocus(event, itemId);
      }
    }
  });

  const focusDefaultItem = useEventCallback((event: React.SyntheticEvent) => {
    let itemToFocusId: string | null | undefined;
    if (Array.isArray(models.selectedItems.value)) {
      itemToFocusId = models.selectedItems.value.find(isItemVisible);
    } else if (models.selectedItems.value != null && isItemVisible(models.selectedItems.value)) {
      itemToFocusId = models.selectedItems.value;
    }

    if (itemToFocusId == null) {
      itemToFocusId = instance.getNavigableChildrenIds(null)[0];
    }

    setFocusedItemId(itemToFocusId);
    if (params.onItemFocus) {
      params.onItemFocus(event, itemToFocusId);
    }
  });

  const focusRoot = useEventCallback(() => {
    rootRef.current?.focus({ preventScroll: true });
  });

  populateInstance<UseTreeViewFocusSignature>(instance, {
    isItemFocused,
    focusItem,
    focusRoot,
    focusDefaultItem,
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
        instance.focusDefaultItem(event);
      }
    };

  const createHandleBlur =
    (otherHandlers: EventHandlers) => (event: React.FocusEvent<HTMLUListElement>) => {
      otherHandlers.onBlur?.(event);
      setFocusedItemId(null);
    };

  const focusedItem = instance.getNode(state.focusedItemId!);
  const activeDescendant = focusedItem
    ? instance.getTreeItemId(focusedItem.id, focusedItem.idAttribute)
    : null;

  return {
    getRootProps: (otherHandlers) => ({
      onFocus: createHandleFocus(otherHandlers),
      onBlur: createHandleBlur(otherHandlers),
      'aria-activedescendant': activeDescendant ?? undefined,
    }),
  };
};

useTreeViewFocus.getInitialState = () => ({ focusedItemId: null });

useTreeViewFocus.params = {
  onItemFocus: true,
};
