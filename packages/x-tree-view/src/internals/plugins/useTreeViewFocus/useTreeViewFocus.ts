import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { EventHandlers } from '@mui/utils';
import ownerDocument from '@mui/utils/ownerDocument';
import { TreeViewPlugin, TreeViewUsedInstance } from '../../models';
import { UseTreeViewFocusSignature } from './useTreeViewFocus.types';
import { useInstanceEventHandler } from '../../hooks/useInstanceEventHandler';
import { useUpdateSelectorsCache } from '../../hooks/useUpdateSelectorsCache';
import { getActiveElement } from '../../utils/utils';
import { getFirstNavigableItem } from '../../utils/tree';
import { MuiCancellableEvent } from '../../models/MuiCancellableEvent';
import { convertSelectedItemsToArray } from '../useTreeViewSelection/useTreeViewSelection.utils';
import { treeViewDefaultFocusableItemIdSelector } from './useTreeViewFocus.selectors';
import { Store } from '../../utils/Store';

const useDefaultFocusableItemId = (
  instance: TreeViewUsedInstance<UseTreeViewFocusSignature>,
  store: Store<[UseTreeViewFocusSignature]>,
  selectedItems: string | string[] | null,
) => {
  let defaultFocusableItemId = convertSelectedItemsToArray(selectedItems).find((itemId) => {
    if (!instance.isItemNavigable(itemId)) {
      return false;
    }

    const itemMeta = instance.getItemMeta(itemId);
    return itemMeta && (itemMeta.parentId == null || instance.isItemExpanded(itemMeta.parentId));
  });

  if (defaultFocusableItemId == null) {
    defaultFocusableItemId = getFirstNavigableItem(instance);
  }

  useUpdateSelectorsCache(store, (cache) => {
    if (defaultFocusableItemId !== cache.defaultFocusableItemId) {
      return { ...cache, defaultFocusableItemId };
    }

    return cache;
  });
};

export const useTreeViewFocus: TreeViewPlugin<UseTreeViewFocusSignature> = ({
  instance,
  params,
  store,
  models,
  rootRef,
}) => {
  useDefaultFocusableItemId(instance, store, models.selectedItems.value);

  const setFocusedItemId = useEventCallback((itemId: React.SetStateAction<string | null>) => {
    const cleanItemId =
      typeof itemId === 'function' ? itemId(store.value.state.focusedItemId) : itemId;
    if (store.value.state.focusedItemId !== cleanItemId) {
      store.updateState((prevState) => ({ ...prevState, focusedItemId: cleanItemId }));
    }
  });

  const isTreeViewFocused = React.useCallback(
    () =>
      !!rootRef.current &&
      rootRef.current.contains(getActiveElement(ownerDocument(rootRef.current))),
    [rootRef],
  );

  const isItemFocused = React.useCallback(
    (itemId: string) => store.value.state.focusedItemId === itemId && isTreeViewFocused(),
    [store.value.state.focusedItemId, isTreeViewFocused],
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
    if (store.value.state.focusedItemId == null) {
      return;
    }

    const itemMeta = instance.getItemMeta(store.value.state.focusedItemId);
    if (itemMeta) {
      const itemElement = document.getElementById(
        instance.getTreeItemIdAttribute(store.value.state.focusedItemId, itemMeta.idAttribute),
      );

      if (itemElement) {
        itemElement.blur();
      }
    }

    setFocusedItemId(null);
  });

  useInstanceEventHandler(instance, 'removeItem', ({ id }) => {
    const defaultFocusableItemId = treeViewDefaultFocusableItemIdSelector(store);
    if (store.value.state.focusedItemId === id && defaultFocusableItemId != null) {
      innerFocusItem(null, defaultFocusableItemId);
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
      const defaultFocusableItemId = treeViewDefaultFocusableItemIdSelector(store);
      if (event.target === event.currentTarget && defaultFocusableItemId != null) {
        innerFocusItem(event, defaultFocusableItemId);
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
      focusItem,
      removeFocusedItem,
    },
  };
};

useTreeViewFocus.getInitialState = () => ({ focusedItemId: null });

useTreeViewFocus.getInitialCache = () => ({ defaultFocusableItemId: null });

useTreeViewFocus.params = {
  onItemFocus: true,
};
