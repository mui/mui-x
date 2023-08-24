import * as React from 'react';
import type { TreeViewItemRange } from '../../TreeView/TreeView.types';

export interface UseTreeViewSelectionInstance {
  isNodeSelected: (nodeId: string) => boolean;
  selectNode: (event: React.SyntheticEvent, nodeId: string, multiple?: boolean) => boolean;
  selectRange: (event: React.SyntheticEvent, nodes: TreeViewItemRange, stacked?: boolean) => void;
  rangeSelectToFirst: (event: React.KeyboardEvent<HTMLUListElement>, nodeId: string) => void;
  rangeSelectToLast: (event: React.KeyboardEvent<HTMLUListElement>, nodeId: string) => void;
}

interface UseTreeViewSelectionBaseProps {
  /**
   * If `true` selection is disabled.
   * @default false
   */
  disableSelection?: boolean;
}

export interface UseTreeViewSingleSelectProps extends UseTreeViewSelectionBaseProps {
  /**
   * Selected node ids. (Uncontrolled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   * @default []
   */
  defaultSelected?: string | null;
  /**
   * Selected node ids. (Controlled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   */
  selected?: string | null;
  /**
   * If true `ctrl` and `shift` will trigger multiselect.
   * @default false
   */
  multiSelect?: false;
  /**
   * Callback fired when tree items are selected/unselected.
   * @param {React.SyntheticEvent} event The event source of the callback
   * @param {string[] | string} nodeIds Ids of the selected nodes. When `multiSelect` is true
   * this is an array of strings; when false (default) a string.
   */
  onNodeSelect?: (event: React.SyntheticEvent, nodeIds: string) => void;
}

export interface UseTreeViewMultiSelectProps extends UseTreeViewSelectionBaseProps {
  /**
   * Selected node ids. (Uncontrolled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   * @default []
   */
  defaultSelected?: string[];
  /**
   * Selected node ids. (Controlled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   */
  selected?: string[];
  /**
   * If true `ctrl` and `shift` will trigger multiselect.
   * @default false
   */
  multiSelect?: true;
  /**
   * Callback fired when tree items are selected/unselected.
   * @param {React.SyntheticEvent} event The event source of the callback
   * @param {string[] | string} nodeIds Ids of the selected nodes. When `multiSelect` is true
   * this is an array of strings; when false (default) a string.
   */
  onNodeSelect?: (event: React.SyntheticEvent, nodeIds: string[]) => void;
}

export type UseTreeViewSelectionProps = UseTreeViewSingleSelectProps | UseTreeViewMultiSelectProps;
