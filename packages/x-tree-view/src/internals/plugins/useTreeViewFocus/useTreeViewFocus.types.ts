import * as React from 'react';
import { DefaultizedProps, TreeViewPluginSignature } from '../../models';
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
   * Focused node id.
   * Used when the item's focus is controlled.
   */
  focusedNodeId?: string | null;
  /**
   * Focused node id.
   * Used when the item's focus is controlled.
   * @default undefined
   */
  defaultFocusedNodeId?: string | null;
  /**
   * Callback fired when tree items are focused.
   * @param {React.SyntheticEvent} event The event source of the callback **Warning**: This is a generic event not a focus event.
   * @param {string} nodeId The id of the node focused.
   * @param {string} value of the focused node.
   */
  onNodeFocus?: (event: React.SyntheticEvent, nodeId: string) => void;
}

export type UseTreeViewFocusDefaultizedParameters = DefaultizedProps<
  UseTreeViewFocusParameters,
  'defaultFocusedNodeId'
>;

export type UseTreeViewFocusSignature = TreeViewPluginSignature<{
  params: UseTreeViewFocusParameters;
  defaultizedParams: UseTreeViewFocusDefaultizedParameters;
  instance: UseTreeViewFocusInstance;
  modelNames: 'focusedNodeId';
  dependantPlugins: [
    UseTreeViewIdSignature,
    UseTreeViewNodesSignature,
    UseTreeViewSelectionSignature,
    UseTreeViewExpansionSignature,
  ];
}>;
