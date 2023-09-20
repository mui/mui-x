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
   * Used when the item's expansion are controlled.
   */
  expanded?: string[];
  /**
   * Expanded node ids.
   * Used when the item's expansion are not controlled.
   * @default []
   */
  defaultExpanded?: string[];
  /**
   * Callback fired when tree items are expanded/collapsed.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {array} nodeIds The ids of the expanded nodes.
   */
  onNodeToggle?: (event: React.SyntheticEvent, nodeIds: string[]) => void;
}

export type UseTreeViewExpansionDefaultizedParameters = DefaultizedProps<
  UseTreeViewExpansionParameters,
  'defaultExpanded'
>;

export type UseTreeViewExpansionSignature = TreeViewPluginSignature<
  UseTreeViewExpansionParameters,
  UseTreeViewExpansionDefaultizedParameters,
  UseTreeViewExpansionInstance,
  {},
  {},
  'expanded',
  [UseTreeViewNodesSignature]
>;
