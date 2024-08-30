import * as React from 'react';
import { TreeViewPluginSignature, MuiCancellableEvent } from '../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import { UseTreeViewSelectionSignature } from '../useTreeViewSelection';
import { UseTreeViewFocusSignature } from '../useTreeViewFocus';
import { UseTreeViewExpansionSignature } from '../useTreeViewExpansion';
import { TreeViewItemId } from '../../../models';
import { UseTreeViewLabelSignature } from '../useTreeViewLabel';

export interface UseTreeViewKeyboardNavigationInstance {
  /**
   * Updates the `firstCharMap` to add/remove the first character of some item's labels.
   * This map is used to navigate the tree using type-ahead search.
   * This method is only used by the `useTreeViewJSXItems` plugin, otherwise the updates are handled internally.
   * @param {(map: TreeViewFirstCharMap) => TreeViewFirstCharMap} updater The function to update the map.
   */
  updateFirstCharMap: (updater: (map: TreeViewFirstCharMap) => TreeViewFirstCharMap) => void;
  /**
   * Callback fired when a key is pressed on an item.
   * Handles all the keyboard navigation logic.
   * @param {React.KeyboardEvent<HTMLElement> & MuiCancellableEvent} event The keyboard event that triggered the callback.
   * @param {TreeViewItemId} itemId The id of the item that the event was triggered on.
   */
  handleItemKeyDown: (
    event: React.KeyboardEvent<HTMLElement> & MuiCancellableEvent,
    itemId: TreeViewItemId,
  ) => void;
}

export type UseTreeViewKeyboardNavigationSignature = TreeViewPluginSignature<{
  instance: UseTreeViewKeyboardNavigationInstance;
  dependencies: [
    UseTreeViewItemsSignature,
    UseTreeViewSelectionSignature,
    UseTreeViewFocusSignature,
    UseTreeViewExpansionSignature,
  ];
  optionalDependencies: [UseTreeViewLabelSignature];
}>;

export type TreeViewFirstCharMap = { [itemId: string]: string };
