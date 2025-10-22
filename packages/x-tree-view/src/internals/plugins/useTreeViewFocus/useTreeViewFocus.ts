import * as React from 'react';
import { EventHandlers } from '@mui/utils/types';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewFocusSignature } from './useTreeViewFocus.types';
import { TreeViewCancellableEvent } from '../../../models';
import { focusSelectors } from './useTreeViewFocus.selectors';

export const useTreeViewFocus: TreeViewPlugin<UseTreeViewFocusSignature> = ({ store }) => {
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
    instance: {},
  };
};

useTreeViewFocus.params = {
  onItemFocus: true,
};
