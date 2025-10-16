import * as React from 'react';
import { TreeViewPluginSignature } from '../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import { UseTreeViewSelectionSignature } from '../useTreeViewSelection';
import { UseTreeViewFocusSignature } from '../useTreeViewFocus';
import { UseTreeViewExpansionSignature } from '../useTreeViewExpansion';
import { UseTreeViewLabelSignature } from '../useTreeViewLabel';
import { TreeViewItemId, TreeViewCancellableEvent } from '../../../models';

export interface UseTreeViewKeyboardNavigationInstance {
  /**
   * Updates the `labelMap` to add/remove the first character of some item's labels.
   * This map is used to navigate the tree using type-ahead search.
   * This method is only used by the `useTreeViewJSXItems` plugin, otherwise the updates are handled internally.
   * @param {(map: TreeViewLabelMap) => TreeViewLabelMap} updater The function to update the map.
   */
  updateLabelMap: (updater: (map: TreeViewLabelMap) => TreeViewLabelMap) => void;
  /**
   * Callback fired when a key is pressed on an item.
   * Handles all the keyboard navigation logic.
   * @param {React.KeyboardEvent<HTMLElement> & TreeViewCancellableEvent} event The keyboard event that triggered the callback.
   * @param {TreeViewItemId} itemId The id of the item that the event was triggered on.
   */
  handleItemKeyDown: (
    event: React.KeyboardEvent<HTMLElement> & TreeViewCancellableEvent,
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

export type TreeViewLabelMap = { [itemId: string]: string };
