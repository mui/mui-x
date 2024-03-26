import * as React from 'react';
import { DefaultizedProps, TreeViewPluginSignature } from '../../models';
import { UseTreeViewNodesSignature } from '../useTreeViewNodes';

export interface UseTreeViewExpansionInstance {
  isNodeExpanded: (itemId: string) => boolean;
  isNodeExpandable: (itemId: string) => boolean;
  toggleNodeExpansion: (event: React.SyntheticEvent, value: string) => void;
  expandAllSiblings: (event: React.KeyboardEvent, itemId: string) => void;
}

export interface UseTreeViewExpansionParameters {
  /**
   * Expanded item ids.
   * Used when the item's expansion is controlled.
   */
  expandedItems?: string[];
  /**
   * Expanded item ids.
   * Used when the item's expansion is not controlled.
   * @default []
   */
  defaultExpandedItems?: string[];
  /**
   * Callback fired when tree items are expanded/collapsed.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {array} itemIds The ids of the expanded items.
   */
  onExpandedItemsChange?: (event: React.SyntheticEvent, itemIds: string[]) => void;
  /**
   * Callback fired when a tree item is expanded or collapsed.
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {array} itemId The itemId of the modified item.
   * @param {array} isExpanded `true` if the item has just been expanded, `false` if it has just been collapsed.
   */
  onItemExpansionToggle?: (
    event: React.SyntheticEvent,
    itemId: string,
    isExpanded: boolean,
  ) => void;
}

export type UseTreeViewExpansionDefaultizedParameters = DefaultizedProps<
  UseTreeViewExpansionParameters,
  'defaultExpandedItems'
>;

export type UseTreeViewExpansionSignature = TreeViewPluginSignature<{
  params: UseTreeViewExpansionParameters;
  defaultizedParams: UseTreeViewExpansionDefaultizedParameters;
  instance: UseTreeViewExpansionInstance;
  modelNames: 'expandedItems';
  dependantPlugins: [UseTreeViewNodesSignature];
}>;
