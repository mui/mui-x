import { TreeViewItemMeta, DefaultizedProps, TreeViewPluginSignature } from '../../models';
import { TreeViewItemId } from '../../../models';

interface TreeViewItemProps {
  label: string;
  itemId: string;
  id: string | undefined;
  children?: TreeViewItemProps[];
}

export interface UseTreeViewItemsPublicAPI<R extends {}> {
  /**
   * Get the item with the given id.
   * @param {string} itemId The id of the item to return.
   * @returns {R} The item with the given id.
   */
  getItem: (itemId: string) => R;
}

export interface UseTreeViewItemsInstance<R extends {}> extends UseTreeViewItemsPublicAPI<R> {
  getItemMeta: (itemId: string) => TreeViewItemMeta;
  getItemsToRender: () => TreeViewItemProps[];
  getItemOrderedChildrenIds: (parentId: string | null) => string[];
  getNavigableChildrenIds: (itemId: string | null) => string[];
  isItemDisabled: (itemId: string | null) => itemId is string;
  getItemIndex: (itemId: string) => number;
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

export interface UseTreeViewItemsParameters<R extends {}> {
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
}

export type UseTreeViewItemsDefaultizedParameters<R extends {}> = DefaultizedProps<
  UseTreeViewItemsParameters<R>,
  'disabledItemsFocusable'
>;

interface UseTreeViewItemsEventLookup {
  removeItem: {
    params: { id: string };
  };
}

export interface TreeViewItemIdAndChildren {
  id: TreeViewItemId;
  children?: TreeViewItemIdAndChildren[];
}

export interface UseTreeViewItemsState<R extends {}> {
  items: {
    itemTree: TreeViewItemIdAndChildren[];
    itemMetaMap: TreeViewItemMetaMap;
    itemMap: TreeViewItemMap<R>;
    itemOrderedChildrenIds: { [parentItemId: string]: string[] };
    itemChildrenIndexes: { [parentItemId: string]: { [itemId: string]: number } };
  };
}

interface UseTreeViewItemsContextValue
  extends Pick<UseTreeViewItemsDefaultizedParameters<any>, 'disabledItemsFocusable'> {}

export type UseTreeViewItemsSignature = TreeViewPluginSignature<{
  params: UseTreeViewItemsParameters<any>;
  defaultizedParams: UseTreeViewItemsDefaultizedParameters<any>;
  instance: UseTreeViewItemsInstance<any>;
  publicAPI: UseTreeViewItemsPublicAPI<any>;
  events: UseTreeViewItemsEventLookup;
  state: UseTreeViewItemsState<any>;
  contextValue: UseTreeViewItemsContextValue;
}>;

export type TreeViewItemMetaMap = { [itemId: string]: TreeViewItemMeta };

export type TreeViewItemMap<R extends {}> = { [itemId: string]: R };
