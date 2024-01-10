import * as React from 'react';
import type { DefaultizedProps, TreeViewItemRange, TreeViewPluginSignature } from '../../models';
import { UseTreeViewNodesSignature } from '../useTreeViewNodes';
import { UseTreeViewExpansionSignature } from '../useTreeViewExpansion';

export interface UseTreeViewSelectionInstance {
  isNodeSelected: (nodeId: string) => boolean;
  selectNode: (event: React.SyntheticEvent, nodeId: string, multiple?: boolean) => void;
  selectRange: (event: React.SyntheticEvent, nodes: TreeViewItemRange, stacked?: boolean) => void;
  rangeSelectToFirst: (event: React.KeyboardEvent<HTMLUListElement>, nodeId: string) => void;
  rangeSelectToLast: (event: React.KeyboardEvent<HTMLUListElement>, nodeId: string) => void;
}

type TreeViewSelectionValue<Multiple extends boolean | undefined> = Multiple extends true
  ? string[]
  : string | null;

export interface UseTreeViewSelectionParameters<Multiple extends boolean | undefined> {
  /**
   * If `true` selection is disabled.
   * @default false
   */
  disableSelection?: boolean;
  /**
   * Selected node ids. (Uncontrolled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   * @default []
   */
  defaultSelectedNodes?: TreeViewSelectionValue<Multiple>;
  /**
   * Selected node ids. (Controlled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   */
  selectedNodes?: TreeViewSelectionValue<Multiple>;
  /**
   * If true `ctrl` and `shift` will trigger multiselect.
   * @default false
   */
  multiSelect?: Multiple;
  /**
   * Callback fired when tree items are selected/deselected.
   * @param {React.SyntheticEvent} event The event source of the callback
   * @param {string[] | string} nodeIds The ids of the selected nodes.
   * When `multiSelect` is `true`, this is an array of strings; when false (default) a string.
   */
  onSelectedNodesChange?: (
    event: React.SyntheticEvent,
    nodeIds: TreeViewSelectionValue<Multiple>,
  ) => void;
  /**
   * Callback fired when a tree item is selected or deselected.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {array} nodeId The nodeId of the modified node.
   * @param {array} isSelected `true` if the node has just been selected, `false` if it has just been deselected.
   */
  onNodeSelectionToggle?: (
    event: React.SyntheticEvent,
    nodeId: string,
    isSelected: boolean,
  ) => void;
}

export type UseTreeViewSelectionDefaultizedParameters<Multiple extends boolean> = DefaultizedProps<
  UseTreeViewSelectionParameters<Multiple>,
  'disableSelection' | 'defaultSelectedNodes' | 'multiSelect'
>;

export type UseTreeViewSelectionSignature = TreeViewPluginSignature<
  UseTreeViewSelectionParameters<any>,
  UseTreeViewSelectionDefaultizedParameters<any>,
  UseTreeViewSelectionInstance,
  {},
  {},
  'selectedNodes',
  [UseTreeViewNodesSignature, UseTreeViewExpansionSignature, UseTreeViewNodesSignature]
>;
