import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { EventHandlers } from '@mui/utils';
import ownerDocument from '@mui/utils/ownerDocument';
import { TreeViewPlugin, TreeViewUsedInstance, TreeViewUsedStore } from '../../models';
import { UseTreeViewFocusSignature } from './useTreeViewFocus.types';
import { useInstanceEventHandler } from '../../hooks/useInstanceEventHandler';
import { getActiveElement } from '../../utils/utils';
import { getFirstNavigableItem } from '../../utils/tree';
import { MuiCancellableEvent } from '../../models/MuiCancellableEvent';
import { convertSelectedItemsToArray } from '../useTreeViewSelection/useTreeViewSelection.utils';
import {
  selectorDefaultFocusableItemId,
  selectorFocusedItemId,
} from './useTreeViewFocus.selectors';

const useDefaultFocusableItemId = (
  instance: TreeViewUsedInstance<UseTreeViewFocusSignature>,
  store: TreeViewUsedStore<UseTreeViewFocusSignature>,
  selectedItems: string | string[] | null,
) => {
  useEnhancedEffect(() => {
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

    store.update((prevState) => {
      if (defaultFocusableItemId === prevState.focus.defaultFocusableItemId) {
        return prevState;
      }

      return {
        ...prevState,
        focus: {
          defaultFocusableItemId,
        },
      };
    });
  }, []);
};

export const useTreeViewFocus: TreeViewPlugin<UseTreeViewFocusSignature> = ({
  instance,
  params,
  store,
  models,
  rootRef,
}) => {
  useDefaultFocusableItemId(instance, store, models.selectedItems.value);

  const setFocusedItemId = useEventCallback((itemId: string | null) => {
    const focusedItemId = selectorFocusedItemId(store);
    if (focusedItemId !== itemId) {
      store.update((prevState) => ({ ...prevState, focusedItemId: itemId }));
    }
  });

  const isTreeViewFocused = React.useCallback(
    () =>
      !!rootRef.current &&
      rootRef.current.contains(getActiveElement(ownerDocument(rootRef.current))),
    [rootRef],
  );

  const isItemFocused = React.useCallback(
    (itemId: string) => {
      const focusedItemId = selectorFocusedItemId(store);
      return focusedItemId === itemId && isTreeViewFocused();
    },
    [store, isTreeViewFocused],
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
    const focusedItemId = selectorFocusedItemId(store);
    if (focusedItemId == null) {
      return;
    }

    const itemMeta = instance.getItemMeta(focusedItemId);
    if (itemMeta) {
      const itemElement = document.getElementById(
        instance.getTreeItemIdAttribute(focusedItemId, itemMeta.idAttribute),
      );

      if (itemElement) {
        itemElement.blur();
      }
    }

    setFocusedItemId(null);
  });

  useInstanceEventHandler(instance, 'removeItem', ({ id }) => {
    const focusedItemId = selectorFocusedItemId(store);
    const defaultFocusableItemId = selectorDefaultFocusableItemId(store);
    if (focusedItemId === id && defaultFocusableItemId != null) {
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
      const defaultFocusableItemId = selectorDefaultFocusableItemId(store);
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

useTreeViewFocus.getInitialState = () => ({
  focus: { focusedItemId: null, defaultFocusableItemId: null },
});

useTreeViewFocus.params = {
  onItemFocus: true,
};
