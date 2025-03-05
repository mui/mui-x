import * as React from 'react';
import { DefaultizedProps } from '@mui/x-internals/types';
import { TreeViewPluginSignature } from '../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import { TreeViewItemId } from '../../../models';
import { UseTreeViewLabelSignature } from '../useTreeViewLabel';

export interface UseTreeViewExpansionPublicAPI {
  /**
   * Change the expansion status of a given item.
   * @param {object} parameters The parameters of the method.
   * @param {string} parameters.itemId The id of the item to expand of collapse.
   * @param {React.SyntheticEvent} parameters.event The DOM event that triggered the change.
   * @param {boolean} parameters.shouldBeExpanded If `true` the item will be expanded. If `false` the item will be collapsed. If not defined, the item's expansion status will be the toggled.
   */
  setItemExpansion: (parameters: {
    itemId: string;
    event?: React.SyntheticEvent;
    shouldBeExpanded?: boolean;
  }) => void;
}

export interface UseTreeViewExpansionInstance extends UseTreeViewExpansionPublicAPI {
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
   * Callback fired when Tree Items are expanded/collapsed.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change. Can be null when the change is caused by the `publicAPI.setItemExpansion()` method.
   * @param {array} itemIds The ids of the expanded items.
   */
  onExpandedItemsChange?: (event: React.SyntheticEvent | null, itemIds: string[]) => void;
  /**
   * Callback fired when a Tree Item is expanded or collapsed.
   * @param {React.SyntheticEvent | null} event The DOM event that triggered the change. Can be null when the change is caused by the `publicAPI.setItemExpansion()` method.
   * @param {array} itemId The itemId of the modified item.
   * @param {array} isExpanded `true` if the item has just been expanded, `false` if it has just been collapsed.
   */
  onItemExpansionToggle?: (
    event: React.SyntheticEvent | null,
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

export interface UseTreeViewExpansionState {
  expansion: {
    expandedItemsMap: Map<string, true>;
    expansionTrigger: 'content' | 'iconContainer';
  };
}

interface UseTreeViewExpansionEventLookup {
  beforeItemToggleExpansion: {
    params: {
      isExpansionPrevented: boolean;
      event: React.SyntheticEvent | null;
      itemId: TreeViewItemId;
    };
  };
}

export type UseTreeViewExpansionSignature = TreeViewPluginSignature<{
  params: UseTreeViewExpansionParameters;
  defaultizedParams: UseTreeViewExpansionDefaultizedParameters;
  instance: UseTreeViewExpansionInstance;
  publicAPI: UseTreeViewExpansionPublicAPI;
  modelNames: 'expandedItems';
  state: UseTreeViewExpansionState;
  dependencies: [UseTreeViewItemsSignature];
  optionalDependencies: [UseTreeViewLabelSignature];
  events: UseTreeViewExpansionEventLookup;
}>;
