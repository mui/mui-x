import * as React from 'react';
import type { DefaultizedProps, TreeViewItemRange, TreeViewPluginSignature } from '../../models';
import { UseTreeViewNodesSignature } from '../useTreeViewNodes';
import { UseTreeViewExpansionSignature } from '../useTreeViewExpansion';

export interface UseTreeViewSelectionInstance {
  isNodeSelected: (itemId: string) => boolean;
  selectNode: (event: React.SyntheticEvent, itemId: string, multiple?: boolean) => void;
  selectRange: (event: React.SyntheticEvent, nodes: TreeViewItemRange, stacked?: boolean) => void;
  rangeSelectToFirst: (event: React.KeyboardEvent<HTMLUListElement>, itemId: string) => void;
  rangeSelectToLast: (event: React.KeyboardEvent<HTMLUListElement>, itemId: string) => void;
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
   * Selected item ids. (Uncontrolled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   * @default []
   */
  defaultSelectedItems?: TreeViewSelectionValue<Multiple>;
  /**
   * Selected item ids. (Controlled)
   * When `multiSelect` is true this takes an array of strings; when false (default) a string.
   */
  selectedItems?: TreeViewSelectionValue<Multiple>;
  /**
   * If true `ctrl` and `shift` will trigger multiselect.
   * @default false
   */
  multiSelect?: Multiple;
  /**
   * Callback fired when tree items are selected/deselected.
   * @param {React.SyntheticEvent} event The event source of the callback
   * @param {string[] | string} itemIds The ids of the selected items.
   * When `multiSelect` is `true`, this is an array of strings; when false (default) a string.
   */
  onSelectedItemsChange?: (
    event: React.SyntheticEvent,
    itemIds: TreeViewSelectionValue<Multiple>,
  ) => void;
  /**
   * Callback fired when a tree item is selected or deselected.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {array} itemId The itemId of the modified item.
   * @param {array} isSelected `true` if the item has just been selected, `false` if it has just been deselected.
   */
  onItemSelectionToggle?: (
    event: React.SyntheticEvent,
    itemId: string,
    isSelected: boolean,
  ) => void;
}

export type UseTreeViewSelectionDefaultizedParameters<Multiple extends boolean> = DefaultizedProps<
  UseTreeViewSelectionParameters<Multiple>,
  'disableSelection' | 'defaultSelectedItems' | 'multiSelect'
>;

interface UseTreeViewSelectionContextValue {
  selection: Pick<UseTreeViewSelectionDefaultizedParameters<boolean>, 'multiSelect'>;
}

export type UseTreeViewSelectionSignature = TreeViewPluginSignature<{
  params: UseTreeViewSelectionParameters<any>;
  defaultizedParams: UseTreeViewSelectionDefaultizedParameters<any>;
  instance: UseTreeViewSelectionInstance;
  contextValue: UseTreeViewSelectionContextValue;
  modelNames: 'selectedItems';
  dependantPlugins: [
    UseTreeViewNodesSignature,
    UseTreeViewExpansionSignature,
    UseTreeViewNodesSignature,
  ];
}>;
