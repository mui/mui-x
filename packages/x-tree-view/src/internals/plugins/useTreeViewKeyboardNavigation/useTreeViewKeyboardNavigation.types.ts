import * as React from 'react';
import { TreeViewPluginSignature } from '../../models';
import { UseTreeViewNodesSignature } from '../useTreeViewNodes';
import { UseTreeViewSelectionSignature } from '../useTreeViewSelection';
import { UseTreeViewFocusSignature } from '../useTreeViewFocus';
import { UseTreeViewExpansionSignature } from '../useTreeViewExpansion';
import { MuiCancellableEvent } from '../../models/MuiCancellableEvent';

export interface UseTreeViewKeyboardNavigationInstance {
  updateFirstCharMap: (updater: (map: TreeViewFirstCharMap) => TreeViewFirstCharMap) => void;
  handleItemKeyDown: (
    event: React.KeyboardEvent<HTMLElement> & MuiCancellableEvent,
    itemId: string,
  ) => void;
}

export type UseTreeViewKeyboardNavigationSignature = TreeViewPluginSignature<{
  instance: UseTreeViewKeyboardNavigationInstance;
  dependantPlugins: [
    UseTreeViewNodesSignature,
    UseTreeViewSelectionSignature,
    UseTreeViewFocusSignature,
    UseTreeViewExpansionSignature,
  ];
}>;

export type TreeViewFirstCharMap = { [itemId: string]: string };
