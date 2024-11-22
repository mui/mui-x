import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { EventHandlers } from '@mui/utils';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewFocusSignature } from './useTreeViewFocus.types';
import { useInstanceEventHandler } from '../../hooks/useInstanceEventHandler';
import { getFirstNavigableItem } from '../../utils/tree';
import { TreeViewCancellableEvent } from '../../../models';
import { convertSelectedItemsToArray } from '../useTreeViewSelection/useTreeViewSelection.utils';
import {
  selectorDefaultFocusableItemId,
  selectorFocusedItemId,
} from './useTreeViewFocus.selectors';
import { selectorIsItemExpanded } from '../useTreeViewExpansion/useTreeViewExpansion.selectors';
import {
  selectorCanItemBeFocused,
  selectorItemMeta,
} from '../useTreeViewItems/useTreeViewItems.selectors';

export const useTreeViewFocus: TreeViewPlugin<UseTreeViewFocusSignature> = ({
  instance,
  params,
  store,
  models,
}) => {
  React.useEffect(() => {
    let defaultFocusableItemId = convertSelectedItemsToArray(models.selectedItems.value).find(
      (itemId) => {
        if (!selectorCanItemBeFocused(store.value, itemId)) {
          return false;
        }

        const itemMeta = selectorItemMeta(store.value, itemId);
        return (
          itemMeta &&
          (itemMeta.parentId == null || selectorIsItemExpanded(store.value, itemMeta.parentId))
        );
      },
    );

    if (defaultFocusableItemId == null) {
      defaultFocusableItemId = getFirstNavigableItem(store.value) ?? null;
    }

    store.update((prevState) => {
      if (defaultFocusableItemId === prevState.focus.defaultFocusableItemId) {
        return prevState;
      }

      return {
        ...prevState,
        focus: {
          ...prevState.focus,
          defaultFocusableItemId,
        },
      };
    });
  }, [store, models.selectedItems.value]);

  const setFocusedItemId = useEventCallback((itemId: string | null) => {
    store.update((prevState) => {
      const focusedItemId = selectorFocusedItemId(prevState);
      if (focusedItemId === itemId) {
        return prevState;
      }

      return {
        ...prevState,
        focus: { ...prevState.focus, focusedItemId: itemId },
      };
    });
  });

  const isItemVisible = (itemId: string) => {
    const itemMeta = selectorItemMeta(store.value, itemId);
    return (
      itemMeta &&
      (itemMeta.parentId == null || selectorIsItemExpanded(store.value, itemMeta.parentId))
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
    const focusedItemId = selectorFocusedItemId(store.value);
    if (focusedItemId == null) {
      return;
    }

    const itemMeta = selectorItemMeta(store.value, focusedItemId);
    if (itemMeta) {
      const itemElement = instance.getItemDOMElement(focusedItemId);
      if (itemElement) {
        itemElement.blur();
      }
    }

    setFocusedItemId(null);
  });

  useInstanceEventHandler(instance, 'removeItem', ({ id }) => {
    const focusedItemId = selectorFocusedItemId(store.value);
    const defaultFocusableItemId = selectorDefaultFocusableItemId(store.value);
    if (focusedItemId === id && defaultFocusableItemId != null) {
      innerFocusItem(null, defaultFocusableItemId);
    }
  });

  const createRootHandleFocus =
    (otherHandlers: EventHandlers) =>
    (event: React.FocusEvent<HTMLUListElement> & TreeViewCancellableEvent) => {
      otherHandlers.onFocus?.(event);
      if (event.defaultMuiPrevented) {
        return;
      }

      // if the event bubbled (which is React specific) we don't want to steal focus
      const defaultFocusableItemId = selectorDefaultFocusableItemId(store.value);
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
  focus: { focusedItemId: null, defaultFocusableItemId: null },
});

useTreeViewFocus.params = {
  onItemFocus: true,
};
