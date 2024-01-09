import * as React from 'react';
import { TreeViewPluginSignature } from '../../models';
import { UseTreeViewIdSignature } from '../useTreeViewId/useTreeViewId.types';
import type { UseTreeViewNodesSignature } from '../useTreeViewNodes';
import type { UseTreeViewSelectionSignature } from '../useTreeViewSelection';
import { UseTreeViewExpansionSignature } from '../useTreeViewExpansion';

export interface UseTreeViewFocusInstance {
  isNodeFocused: (nodeId: string) => boolean;
  focusNode: (event: React.SyntheticEvent, nodeId: string | null) => void;
  focusRoot: () => void;
}

export interface UseTreeViewFocusParameters {
  /**
   * Callback fired when tree items are focused.
   * @param {React.SyntheticEvent} event The event source of the callback **Warning**: This is a generic event not a focus event.
   * @param {string} nodeId The id of the node focused.
   * @param {string} value of the focused node.
   */
  onNodeFocus?: (event: React.SyntheticEvent, nodeId: string) => void;
}

export type UseTreeViewFocusDefaultizedParameters = UseTreeViewFocusParameters;

export interface UseTreeViewFocusState {
  focusedNodeId: string | null;
}

export type UseTreeViewFocusSignature = TreeViewPluginSignature<
  UseTreeViewFocusParameters,
  UseTreeViewFocusParameters,
  UseTreeViewFocusInstance,
  {},
  UseTreeViewFocusState,
  {},
  never,
  [
    UseTreeViewIdSignature,
    UseTreeViewNodesSignature,
    UseTreeViewSelectionSignature,
    UseTreeViewExpansionSignature,
  ]
>;
