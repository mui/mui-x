import * as React from 'react';
import { DefaultizedProps } from '@mui/x-internals/types';
import { TreeViewItemMeta, TreeViewPluginSignature } from '../../models';
import {
  TreeViewBaseItem,
  TreeViewDefaultItemModelProperties,
  TreeViewItemId,
} from '../../../models';

export interface UseTreeViewItemsPublicAPI<R extends {}> {
  /**
   * Get the item with the given id.
   * When used in the Simple Tree View, it returns an object with the `id` and `label` properties.
   * @param {string} itemId The id of the item to retrieve.
   * @returns {R} The item with the given id.
   */
  getItem: (itemId: TreeViewItemId) => R;
  /**
   * Get the DOM element of the item with the given id.
   * @param {TreeViewItemId} itemId The id of the item to get the DOM element of.
   * @returns {HTMLElement | null} The DOM element of the item with the given id.
   */
  getItemDOMElement: (itemId: TreeViewItemId) => HTMLElement | null;
  /**
   * Get the ids of a given item's children.
   * Those ids are returned in the order they should be rendered.
   * To get the root items, pass `null` as the `itemId`.
   * @param {TreeViewItemId | null} itemId The id of the item to get the children of.
   * @returns {TreeViewItemId[]} The ids of the item's children.
   */
  getItemOrderedChildrenIds: (itemId: TreeViewItemId | null) => TreeViewItemId[];
  /**
   * Get all the items in the same format as provided by `props.items`.
   * @returns {TreeViewBaseItem[]} The items in the tree.
   */
  getItemTree: () => TreeViewBaseItem[];
}

export interface UseTreeViewItemsInstance<R extends {}>
  extends Pick<UseTreeViewItemsPublicAPI<R>, 'getItemDOMElement'> {
  /**
   * Freeze any future update to the state based on the `items` prop.
   * This is useful when `useTreeViewJSXItems` is used to avoid having conflicting sources of truth.
   */
  preventItemUpdates: () => void;
  /**
   * Check if the updates to the state based on the `items` prop are prevented.
   * This is useful when `useTreeViewJSXItems` is used to avoid having conflicting sources of truth.
   * @returns {boolean} `true` if the updates to the state based on the `items` prop are prevented.
   */
  areItemUpdatesPrevented: () => boolean;
}

export interface UseTreeViewItemsParameters<R extends { children?: R[] }> {
  /**
   * If `true`, will allow focus on disabled items.
   * @default false
   */
  disabledItemsFocusable?: boolean;
  items: readonly R[];
  /**
   * Used to determine if a given item should be disabled.
   * @template R
   * @param {R} item The item to check.
   * @returns {boolean} `true` if the item should be disabled.
   */
  isItemDisabled?: (item: R) => boolean;
  /**
   * Used to determine the string label for a given item.
   *
   * @template R
   * @param {R} item The item to check.
   * @returns {string} The label of the item.
   * @default (item) => item.label
   */
  getItemLabel?: (item: R) => string;
  /**
   * Used to determine the id of a given item.
   *
   * @template R
   * @param {R} item The item to check.
   * @returns {string} The id of the item.
   * @default (item) => item.id
   */
  getItemId?: (item: R) => TreeViewItemId;
  /**
   * Callback fired when the `content` slot of a given Tree Item is clicked.
   * @param {React.MouseEvent} event The DOM event that triggered the change.
   * @param {string} itemId The id of the focused item.
   */
  onItemClick?: (event: React.MouseEvent, itemId: string) => void;
  /**
   * Horizontal indentation between an item and its children.
   * Examples: 24, "24px", "2rem", "2em".
   * @default 12px
   */
  itemChildrenIndentation?: string | number;
}

export type UseTreeViewItemsDefaultizedParameters<R extends { children?: R[] }> = DefaultizedProps<
  UseTreeViewItemsParameters<R>,
  'disabledItemsFocusable' | 'itemChildrenIndentation'
>;

interface UseTreeViewItemsEventLookup {
  removeItem: {
    params: { id: string };
  };
}

export interface UseTreeViewItemsState<R extends {}> {
  items: {
    /**
     * If `true`, will allow focus on disabled items.
     * Always equal to `props.disabledItemsFocusable` (or `false` if not provided).
     */
    disabledItemsFocusable: boolean;
    /**
     * Model of each item as provided by `props.items` or by imperative items updates.
     * It is not updated when properties derived from the model are updated:
     * - when the label of an item is updated, `itemMetaLookup` is updated, not `itemModelLookup`.
     * - when the children of an item are updated, `itemOrderedChildrenIdsLookup` and `itemChildrenIndexesLookup` are updated, not `itemModelLookup`.
     * This means that the `children`, `label` or `id` properties of an item model should never be used directly, always use the structured sub-states instead.
     */
    itemModelLookup: { [itemId: string]: TreeViewBaseItem<R> };
    /**
     * Meta data of each item.
     */
    itemMetaLookup: { [itemId: string]: TreeViewItemMeta };
    /**
     * Ordered children ids of each item.
     */
    itemOrderedChildrenIdsLookup: { [parentItemId: string]: string[] };
    /**
     * Index of each child in the ordered children ids of its parent.
     */
    itemChildrenIndexesLookup: { [parentItemId: string]: { [itemId: string]: number } };
  };
}

interface UseTreeViewItemsContextValue {
  items: {
    onItemClick: (event: React.MouseEvent, itemId: string) => void;
  };
}

export type UseTreeViewItemsSignature = TreeViewPluginSignature<{
  params: UseTreeViewItemsParameters<any>;
  defaultizedParams: UseTreeViewItemsDefaultizedParameters<any>;
  instance: UseTreeViewItemsInstance<any>;
  publicAPI: UseTreeViewItemsPublicAPI<any>;
  events: UseTreeViewItemsEventLookup;
  state: UseTreeViewItemsState<TreeViewDefaultItemModelProperties>;
  contextValue: UseTreeViewItemsContextValue;
}>;
