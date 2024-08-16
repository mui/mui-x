import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { EventHandlers } from '@mui/utils';
import ownerDocument from '@mui/utils/ownerDocument';
import { TreeViewPlugin, TreeViewPluginOptions } from '../../models';
import { UseTreeViewFocusSignature } from './useTreeViewFocus.types';
import { useInstanceEventHandler } from '../../hooks/useInstanceEventHandler';
import { getActiveElement } from '../../utils/utils';
import { getFirstNavigableItem } from '../../utils/tree';
import { MuiCancellableEvent } from '../../models/MuiCancellableEvent';
import { convertSelectedItemsToArray } from '../useTreeViewSelection/useTreeViewSelection.utils';

const useDefaultFocusableItemId = ({
  instance,
  models,
  state,
  setState,
}: Pick<
  TreeViewPluginOptions<UseTreeViewFocusSignature>,
  'instance' | 'models' | 'state' | 'setState'
>) => {
  let defaultFocusableItemId = convertSelectedItemsToArray(models.selectedItems.value).find(
    (itemId) => {
      if (!instance.isItemNavigable(itemId)) {
        return false;
      }

      const itemMeta = instance.getItemMeta(itemId);
      return itemMeta && (itemMeta.parentId == null || instance.isItemExpanded(itemMeta.parentId));
    },
  );

  if (defaultFocusableItemId == null) {
    defaultFocusableItemId = getFirstNavigableItem(instance);
  }

  if (defaultFocusableItemId !== state.defaultFocusableItemId) {
    setState((prevState) => ({ ...prevState, defaultFocusableItemId }));
  }
};

export const useTreeViewFocus: TreeViewPlugin<UseTreeViewFocusSignature> = ({
  instance,
  params,
  state,
  setState,
  models,
  rootRef,
}) => {
  useDefaultFocusableItemId({ instance, models, setState, state });

  const setFocusedItemId = useEventCallback((itemId: React.SetStateAction<string | null>) => {
    const cleanItemId = typeof itemId === 'function' ? itemId(state.focusedItemId) : itemId;
    if (state.focusedItemId !== cleanItemId) {
      setState((prevState) => ({ ...prevState, focusedItemId: cleanItemId }));
    }
  });

  const isTreeViewFocused = React.useCallback(
    () =>
      !!rootRef.current &&
      rootRef.current.contains(getActiveElement(ownerDocument(rootRef.current))),
    [rootRef],
  );

  const isItemFocused = React.useCallback(
    (itemId: string) => state.focusedItemId === itemId && isTreeViewFocused(),
    [state.focusedItemId, isTreeViewFocused],
  );

  const isItemVisible = (itemId: string) => {
    const itemMeta = instance.getItemMeta(itemId);
    return itemMeta && (itemMeta.parentId == null || instance.isItemExpanded(itemMeta.parentId));
  };

  const innerFocusItem = (event: React.SyntheticEvent | null, itemId: string) => {
    const itemElement = instance.getItemDOMElement(itemId);
    if (itemElement) {
      itemElement.focus();
    }

    setFocusedItemId(itemId);

    if (params.onItemFocus) {
      params.onItemFocus(event, itemId);
    }
  };

  const focusItem = useEventCallback((event: React.SyntheticEvent, itemId: string) => {
    // If we receive an itemId, and it is visible, the focus will be set to it
    if (isItemVisible(itemId)) {
      innerFocusItem(event, itemId);
    }
  });

  const removeFocusedItem = useEventCallback(() => {
    if (state.focusedItemId == null) {
      return;
    }

    const itemMeta = instance.getItemMeta(state.focusedItemId);
    if (itemMeta) {
      const itemElement = document.getElementById(
        instance.getTreeItemIdAttribute(state.focusedItemId, itemMeta.idAttribute),
      );

      if (itemElement) {
        itemElement.blur();
      }
    }

    setFocusedItemId(null);
  });

  const canItemBeTabbed = (itemId: string) => itemId === state.defaultFocusableItemId;

  useInstanceEventHandler(instance, 'removeItem', ({ id }) => {
    if (state.focusedItemId === id && state.defaultFocusableItemId != null) {
      innerFocusItem(null, state.defaultFocusableItemId);
    }
  });

  const createRootHandleFocus =
    (otherHandlers: EventHandlers) =>
    (event: React.FocusEvent<HTMLUListElement> & MuiCancellableEvent) => {
      otherHandlers.onFocus?.(event);
      if (event.defaultMuiPrevented) {
        return;
      }

      // if the event bubbled (which is React specific) we don't want to steal focus
      if (event.target === event.currentTarget && state.defaultFocusableItemId != null) {
        innerFocusItem(event, state.defaultFocusableItemId);
      }
    };

  return {
    getRootProps: (otherHandlers) => ({
      onFocus: createRootHandleFocus(otherHandlers),
    }),
    publicAPI: {
      focusItem,
    },
    instance: {
      isItemFocused,
      canItemBeTabbed,
      focusItem,
      removeFocusedItem,
    },
  };
};

useTreeViewFocus.getInitialState = () => ({ focusedItemId: null, defaultFocusableItemId: null });

useTreeViewFocus.params = {
  onItemFocus: true,
};
