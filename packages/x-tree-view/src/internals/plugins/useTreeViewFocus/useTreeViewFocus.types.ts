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
   * Id of the currently focused node.
   * Used when the item's focus is controlled.
   */
  focusedNode?: string | null;
  /**
   * Id of the currently focused node.
   * Used when the item's focus is not controlled.
   * @default undefined
   */
  defaultFocusedNode?: string | null;
  /**
   * Callback fired when tree items are focused.
   * @param {React.SyntheticEvent} event The event source of the callback **Warning**: This is a generic event not a focus event.
   * @param {string} nodeId The id of the node focused.
   * @param {string} value of the focused node.
   */
  onFocusedNodeChange?: (event: React.SyntheticEvent, nodeId: string) => void;
}

export type UseTreeViewFocusDefaultizedParameters = DefaultizedProps<
  UseTreeViewFocusParameters,
  'defaultFocusedNode'
>;

export type UseTreeViewFocusSignature = TreeViewPluginSignature<{
  params: UseTreeViewFocusParameters;
  defaultizedParams: UseTreeViewFocusDefaultizedParameters;
  instance: UseTreeViewFocusInstance;
  modelNames: 'focusedNode';
  dependantPlugins: [
    UseTreeViewIdSignature,
    UseTreeViewNodesSignature,
    UseTreeViewSelectionSignature,
    UseTreeViewExpansionSignature,
  ];
}>;
