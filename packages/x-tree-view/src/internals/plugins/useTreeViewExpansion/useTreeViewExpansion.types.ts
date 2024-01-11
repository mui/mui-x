import * as React from 'react';
import { DefaultizedProps, TreeViewPluginSignature } from '../../models';
import { UseTreeViewNodesSignature } from '../useTreeViewNodes';

export interface UseTreeViewExpansionInstance {
  isNodeExpanded: (nodeId: string) => boolean;
  isNodeExpandable: (nodeId: string) => boolean;
  toggleNodeExpansion: (event: React.SyntheticEvent, value: string) => void;
  expandAllSiblings: (event: React.KeyboardEvent<HTMLUListElement>, nodeId: string) => void;
}

export interface UseTreeViewExpansionParameters {
  /**
   * Expanded node ids.
   * Used when the item's expansion is controlled.
   */
  expandedNodes?: string[];
  /**
   * Expanded node ids.
   * Used when the item's expansion is not controlled.
   * @default []
   */
  defaultExpandedNodes?: string[];
  /**
   * Callback fired when tree items are expanded/collapsed.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {array} nodeIds The ids of the expanded nodes.
   */
  onExpandedNodesChange?: (event: React.SyntheticEvent, nodeIds: string[]) => void;
  /**
   * Callback fired when a tree item is expanded or collapsed.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {array} nodeId The nodeId of the modified node.
   * @param {array} isExpanded `true` if the node has just been expanded, `false` if it has just been collapsed.
   */
  onNodeExpansionToggle?: (
    event: React.SyntheticEvent,
    nodeId: string,
    isExpanded: boolean,
  ) => void;
}

export type UseTreeViewExpansionDefaultizedParameters = DefaultizedProps<
  UseTreeViewExpansionParameters,
  'defaultExpandedNodes'
>;

export type UseTreeViewExpansionSignature = TreeViewPluginSignature<
  UseTreeViewExpansionParameters,
  UseTreeViewExpansionDefaultizedParameters,
  UseTreeViewExpansionInstance,
  {},
  {},
  'expandedNodes',
  [UseTreeViewNodesSignature]
>;
