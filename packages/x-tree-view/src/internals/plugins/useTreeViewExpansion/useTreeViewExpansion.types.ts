import * as React from 'react';
import { DefaultizedProps, TreeViewPluginSignature } from '../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import { TreeViewItemId } from '../../../models';
import { UseTreeViewLabelSignature } from '../useTreeViewLabel';

export interface UseTreeViewExpansionPublicAPI {
  /**
   * Change the expansion status of a given item.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {string} itemId The id of the item to expand of collapse.
   * @param {boolean} isExpanded If `true` the item will be expanded. If `false` the item will be collapsed.
   */
  setItemExpansion: (event: React.SyntheticEvent, itemId: string, isExpanded: boolean) => void;
}

export interface UseTreeViewExpansionInstance extends UseTreeViewExpansionPublicAPI {
  /**
   * Check if an item is expanded.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} `true` if the item is expanded, `false` otherwise.
   */
  isItemExpanded: (itemId: TreeViewItemId) => boolean;
  /**
   * Check if an item is expandable.
   * Currently, an item is expandable if it has children.
   * In the future, the user should be able to flag an item as expandable even if it has no loaded children to support children lazy loading.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} `true` if the item can be expanded, `false` otherwise.
   */
  isItemExpandable: (itemId: TreeViewItemId) => boolean;
  /**
   * Toggle the current expansion of an item.
   * If it is expanded, it will be collapsed, and vice versa.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item to toggle.
   */
  toggleItemExpansion: (event: React.SyntheticEvent, itemId: TreeViewItemId) => void;
  /**
   * Expand all the siblings (i.e.: the items that have the same parent) of a given item.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item whose siblings will be expanded.
   */
  expandAllSiblings: (event: React.KeyboardEvent, itemId: TreeViewItemId) => void;
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
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {array} itemIds The ids of the expanded items.
   */
  onExpandedItemsChange?: (event: React.SyntheticEvent, itemIds: string[]) => void;
  /**
   * Callback fired when a tree item is expanded or collapsed.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {array} itemId The itemId of the modified item.
   * @param {array} isExpanded `true` if the item has just been expanded, `false` if it has just been collapsed.
   */
  onItemExpansionToggle?: (
    event: React.SyntheticEvent,
    itemId: string,
    isExpanded: boolean,
  ) => void;
  /**
   * The slot that triggers the item's expansion when clicked.
   * @default 'content'
   */
  expansionTrigger?: 'content' | 'iconContainer';
}

export type UseTreeViewExpansionDefaultizedParameters = DefaultizedProps<
  UseTreeViewExpansionParameters,
  'defaultExpandedItems'
>;

interface UseTreeViewExpansionContextValue {
  expansion: Pick<UseTreeViewExpansionParameters, 'expansionTrigger'>;
}

export type UseTreeViewExpansionSignature = TreeViewPluginSignature<{
  params: UseTreeViewExpansionParameters;
  defaultizedParams: UseTreeViewExpansionDefaultizedParameters;
  instance: UseTreeViewExpansionInstance;
  publicAPI: UseTreeViewExpansionPublicAPI;
  modelNames: 'expandedItems';
  contextValue: UseTreeViewExpansionContextValue;
  dependencies: [UseTreeViewItemsSignature];
  optionalDependencies: [UseTreeViewLabelSignature];
}>;
