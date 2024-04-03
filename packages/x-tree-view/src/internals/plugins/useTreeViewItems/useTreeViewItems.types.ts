import { TreeViewNode, DefaultizedProps, TreeViewPluginSignature } from '../../models';
import { TreeViewItemId } from '../../../models';

interface TreeViewItemProps {
  label: string;
  itemId: string;
  id: string | undefined;
  children?: TreeViewItemProps[];
}

export interface UseTreeViewItemsInstance<R extends {}> {
  getNode: (itemId: string) => TreeViewNode;
  getItem: (itemId: string) => R;
  getItemsToRender: () => TreeViewItemProps[];
  getChildrenIds: (itemId: string | null) => string[];
  getNavigableChildrenIds: (itemId: string | null) => string[];
  isItemDisabled: (itemId: string | null) => itemId is string;
  /**
   * Freeze any future update to the state based on the `items` prop.
   * This is useful when `useTreeViewJSXNodes` is used to avoid having conflicting sources of truth.
   */
  preventItemUpdates: () => void;
  /**
   * Check if the updates to the state based on the `items` prop are prevented.
   * This is useful when `useTreeViewJSXNodes` is used to avoid having conflicting sources of truth.
   * @returns {boolean} `true` if the updates to the state based on the `items` prop are prevented.
   */
  areItemUpdatesPrevented: () => boolean;
}

export interface UseTreeViewItemsPublicAPI<R extends {}>
  extends Pick<UseTreeViewItemsInstance<R>, 'getItem'> {}

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
    nodeTree: TreeViewItemIdAndChildren[];
    nodeMap: TreeViewNodeMap;
    itemMap: TreeViewItemMap<R>;
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

export type TreeViewNodeMap = { [itemId: string]: TreeViewNode };

export type TreeViewItemMap<R extends {}> = { [itemId: string]: R };
