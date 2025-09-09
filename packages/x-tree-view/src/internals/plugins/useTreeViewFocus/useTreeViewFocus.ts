import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { EventHandlers } from '@mui/utils/types';
import { useStoreEffect } from '@mui/x-internals/store';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewFocusSignature } from './useTreeViewFocus.types';
import { TreeViewCancellableEvent } from '../../../models';
import { focusSelectors } from './useTreeViewFocus.selectors';
import { expansionSelectors } from '../useTreeViewExpansion/useTreeViewExpansion.selectors';
import { itemsSelectors } from '../useTreeViewItems/useTreeViewItems.selectors';

export const useTreeViewFocus: TreeViewPlugin<UseTreeViewFocusSignature> = ({
  instance,
  params,
  store,
}) => {
  const setFocusedItemId = useEventCallback((itemId: string | null) => {
    const focusedItemId = focusSelectors.focusedItemId(store.state);
    if (focusedItemId === itemId) {
      return;
    }

    store.set('focus', { ...store.state.focus, focusedItemId: itemId });
  });

  const isItemVisible = (itemId: string) => {
    const itemMeta = itemsSelectors.itemMeta(store.state, itemId);
    return (
      itemMeta &&
      (itemMeta.parentId == null ||
        expansionSelectors.isItemExpanded(store.state, itemMeta.parentId))
    );
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
    const focusedItemId = focusSelectors.focusedItemId(store.state);
    if (focusedItemId == null) {
      return;
    }

    const itemMeta = itemsSelectors.itemMeta(store.state, focusedItemId);
    if (itemMeta) {
      const itemElement = instance.getItemDOMElement(focusedItemId);
      if (itemElement) {
        itemElement.blur();
      }
    }

    setFocusedItemId(null);
  });

  // Whenever the items change, we need to ensure the focused item is still present.
  useStoreEffect(store, itemsSelectors.itemMetaLookup, () => {
    const focusedItemId = focusSelectors.focusedItemId(store.state);
    if (focusedItemId == null) {
      return;
    }

    const hasItemBeenRemoved = !itemsSelectors.itemMeta(store.state, focusedItemId);
    if (!hasItemBeenRemoved) {
      return;
    }

    const defaultFocusableItemId = focusSelectors.defaultFocusableItemId(store.state);
    if (defaultFocusableItemId == null) {
      setFocusedItemId(null);
      return;
    }

    innerFocusItem(null, defaultFocusableItemId);
  });

  const createRootHandleFocus =
    (otherHandlers: EventHandlers) =>
    (event: React.FocusEvent<HTMLUListElement> & TreeViewCancellableEvent) => {
      otherHandlers.onFocus?.(event);
      if (event.defaultMuiPrevented) {
        return;
      }

      // if the event bubbled (which is React specific) we don't want to steal focus
      const defaultFocusableItemId = focusSelectors.defaultFocusableItemId(store.state);
      if (event.target === event.currentTarget && defaultFocusableItemId != null) {
        innerFocusItem(event, defaultFocusableItemId);
      }
    };

  const createRootHandleBlur =
    (otherHandlers: EventHandlers) =>
    (event: React.FocusEvent<HTMLUListElement> & TreeViewCancellableEvent) => {
      otherHandlers.onBlur?.(event);
      if (event.defaultMuiPrevented) {
        return;
      }

      setFocusedItemId(null);
    };

  return {
    getRootProps: (otherHandlers) => ({
      onFocus: createRootHandleFocus(otherHandlers),
      onBlur: createRootHandleBlur(otherHandlers),
    }),
    publicAPI: {
      focusItem,
    },
    instance: {
      focusItem,
      removeFocusedItem,
    },
  };
};

useTreeViewFocus.getInitialState = () => ({
  focus: { focusedItemId: null },
});

useTreeViewFocus.params = {
  onItemFocus: true,
};
