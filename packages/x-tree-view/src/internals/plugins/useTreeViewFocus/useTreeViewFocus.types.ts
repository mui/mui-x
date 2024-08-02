import * as React from 'react';
import { TreeViewPluginSignature } from '../../models';
import type { UseTreeViewItemsSignature } from '../useTreeViewItems';
import type { UseTreeViewSelectionSignature } from '../useTreeViewSelection';
import { UseTreeViewExpansionSignature } from '../useTreeViewExpansion';
import { TreeViewItemId } from '../../../models';

export interface UseTreeViewFocusPublicAPI {
  /**
   * Focus the item with the given id.
   *
   * If the item is the child of a collapsed item, then this method will do nothing.
   * Make sure to expand the ancestors of the item before calling this method if needed.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item to focus.
   */
  focusItem: (event: React.SyntheticEvent, itemId: string) => void;
}

export interface UseTreeViewFocusInstance extends UseTreeViewFocusPublicAPI {
  /**
   * Check if an item is the currently focused item.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} `true` if the item is focused, `false` otherwise.
   */
  isItemFocused: (itemId: TreeViewItemId) => boolean;
  /**
   * Check if an item should be sequentially focusable (usually with the Tab key).
   * At any point in time, there is a single item that can be sequentially focused in the Tree View.
   * This item is the first selected item (that is both visible and navigable), if any, or the first navigable item if no item is selected.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} `true` if the item can be sequentially focusable, `false` otherwise.
   */
  canItemBeTabbed: (itemId: TreeViewItemId) => boolean;
  /**
   * Remove the focus from the currently focused item (both from the internal state and the DOM).
   */
  removeFocusedItem: () => void;
}

export interface UseTreeViewFocusParameters {
  /**
   * Callback fired when a given tree item is focused.
   * @param {React.SyntheticEvent | null} event The DOM event that triggered the change. **Warning**: This is a generic event not a focus event.
   * @param {string} itemId The id of the focused item.
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
  dependencies: [
    UseTreeViewItemsSignature,
    UseTreeViewSelectionSignature,
    UseTreeViewExpansionSignature,
  ];
}>;
