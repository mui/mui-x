import * as React from 'react';
import { TreeViewItemMeta, DefaultizedProps, TreeViewPluginSignature } from '../../models';
import { TreeViewBaseItem, TreeViewItemId } from '../../../models';

interface TreeViewItemProps {
  label: string;
  itemId: string;
  id: string | undefined;
  children?: TreeViewItemProps[];
}

export interface UseTreeViewItemsPublicAPI<R extends {}> {
  /**
   * Get the item with the given id.
   * When used in the `SimpleTreeView`, it returns an object with the `id` and `label` properties.
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
   * @returns {TreeViewItemProps[]} The items in the tree.
   */
  getItemTree: () => TreeViewBaseItem[];
}

export interface UseTreeViewItemsInstance<R extends {}> extends UseTreeViewItemsPublicAPI<R> {
  /**
   * Get the meta-information of an item.
   * Check the `TreeViewItemMeta` type for more information.
   * @param {TreeViewItemId} itemId The id of the item to get the meta-information of.
   * @returns {TreeViewItemMeta} The meta-information of the item.
   */
  getItemMeta: (itemId: TreeViewItemId) => TreeViewItemMeta;
  /**
   * Get the item that should be rendered.
   * This method is only used on Rich Tree View components.
   * Check the `TreeViewItemProps` type for more information.
   * @returns {TreeViewItemProps[]} The items to render.
   */
  getItemsToRender: () => TreeViewItemProps[];
  /**
   * Check if a given item is disabled.
   * An item is disabled if it was marked as disabled or if one of its ancestors is disabled.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} `true` if the item is disabled, `false` otherwise.
   */
  isItemDisabled: (itemId: TreeViewItemId) => boolean;
  /**
   * Check if a given item is navigable (i.e.: if it can be accessed through keyboard navigation).
   * An item is navigable if it is not disabled or if the `disabledItemsFocusable` prop is `true`.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} `true` if the item is navigable, `false` otherwise.
   */
  isItemNavigable: (itemId: TreeViewItemId) => boolean;
  /**
   * Get the index of a given item in its parent's children list.
   * @param {TreeViewItemId} itemId The id of the item to get the index of.
   * @returns {number} The index of the item in its parent's children list.
   */
  getItemIndex: (itemId: TreeViewItemId) => number;
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
   * Callback fired when the `content` slot of a given tree item is clicked.
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
    itemMetaMap: TreeViewItemMetaMap;
    itemMap: TreeViewItemMap<R>;
    itemOrderedChildrenIds: { [parentItemId: string]: string[] };
    itemChildrenIndexes: { [parentItemId: string]: { [itemId: string]: number } };
  };
}

interface UseTreeViewItemsContextValue {
  items: Pick<
    UseTreeViewItemsDefaultizedParameters<any>,
    'disabledItemsFocusable' | 'onItemClick'
  > & {
    indentationAtItemLevel: boolean;
  };
}

export type UseTreeViewItemsSignature = TreeViewPluginSignature<{
  params: UseTreeViewItemsParameters<any>;
  defaultizedParams: UseTreeViewItemsDefaultizedParameters<any>;
  instance: UseTreeViewItemsInstance<any>;
  publicAPI: UseTreeViewItemsPublicAPI<any>;
  events: UseTreeViewItemsEventLookup;
  state: UseTreeViewItemsState<any>;
  contextValue: UseTreeViewItemsContextValue;
  experimentalFeatures: 'indentationAtItemLevel';
}>;

export type TreeViewItemMetaMap = { [itemId: string]: TreeViewItemMeta };

export type TreeViewItemMap<R extends {}> = { [itemId: string]: R };
