import * as React from 'react';
import { TreeViewPluginSignature } from '../../models';
import { UseTreeViewIdSignature } from '../useTreeViewId/useTreeViewId.types';
import type { UseTreeViewItemsSignature } from '../useTreeViewItems';
import type { UseTreeViewSelectionSignature } from '../useTreeViewSelection';
import { UseTreeViewExpansionSignature } from '../useTreeViewExpansion';

export interface UseTreeViewFocusPublicAPI {
  /**
   * Focuses the item with the given id.
   *
   * If the item is the child of a collapsed item, then this method will do nothing.
   * Make sure to expand the ancestors of the item before calling this method if needed.
   * @param {React.SyntheticEvent} event The event source of the action.
   * @param {string} itemId The id of the item to focus.
   */
  focusItem: (event: React.SyntheticEvent, itemId: string) => void;
}

export interface UseTreeViewFocusInstance extends UseTreeViewFocusPublicAPI {
  isItemFocused: (itemId: string) => boolean;
  canItemBeTabbed: (itemId: string) => boolean;
  focusDefaultItem: (event: React.SyntheticEvent | null) => void;
  removeFocusedItem: () => void;
}

export interface UseTreeViewFocusParameters {
  /**
   * Callback fired when tree items are focused.
   * @param {React.SyntheticEvent} event The event source of the callback **Warning**: This is a generic event not a focus event.
   * @param {string} itemId The id of the focused item.
   * @param {string} value of the focused item.
   */
  onItemFocus?: (event: React.SyntheticEvent | null, itemId: string) => void;
}

export type UseTreeViewFocusDefaultizedParameters = UseTreeViewFocusParameters;

export interface UseTreeViewFocusState {
  focusedItemId: string | null;
}

export type UseTreeViewFocusSignature = TreeViewPluginSignature<{
  params: UseTreeViewFocusParameters;
  defaultizedParams: UseTreeViewFocusDefaultizedParameters;
  instance: UseTreeViewFocusInstance;
  publicAPI: UseTreeViewFocusPublicAPI;
  state: UseTreeViewFocusState;
  dependantPlugins: [
    UseTreeViewIdSignature,
    UseTreeViewItemsSignature,
    UseTreeViewSelectionSignature,
    UseTreeViewExpansionSignature,
  ];
}>;
