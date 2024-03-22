import * as React from 'react';
import { TreeViewPluginSignature } from '../../models';
import { UseTreeViewIdSignature } from '../useTreeViewId/useTreeViewId.types';
import type { UseTreeViewNodesSignature } from '../useTreeViewNodes';
import type { UseTreeViewSelectionSignature } from '../useTreeViewSelection';
import { UseTreeViewExpansionSignature } from '../useTreeViewExpansion';

export interface UseTreeViewFocusInstance {
  isNodeFocused: (itemId: string) => boolean;
  canItemBeTabbed: (itemId: string) => boolean;
  focusItem: (event: React.SyntheticEvent, nodeId: string) => void;
  focusDefaultNode: (event: React.SyntheticEvent | null) => void;
  removeFocusedItem: () => void;
}

export interface UseTreeViewFocusPublicAPI extends Pick<UseTreeViewFocusInstance, 'focusItem'> {}

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
  focusedNodeId: string | null;
}

export type UseTreeViewFocusSignature = TreeViewPluginSignature<{
  params: UseTreeViewFocusParameters;
  defaultizedParams: UseTreeViewFocusDefaultizedParameters;
  instance: UseTreeViewFocusInstance;
  publicAPI: UseTreeViewFocusPublicAPI;
  state: UseTreeViewFocusState;
  dependantPlugins: [
    UseTreeViewIdSignature,
    UseTreeViewNodesSignature,
    UseTreeViewSelectionSignature,
    UseTreeViewExpansionSignature,
  ];
}>;
