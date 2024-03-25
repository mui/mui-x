import { TreeViewNode, DefaultizedProps, TreeViewPluginSignature } from '../../models';
import { TreeViewItemId } from '../../../models';

interface TreeViewNodeProps {
  label: string;
  itemId: string;
  id: string | undefined;
  children?: TreeViewNodeProps[];
}

export interface UseTreeViewNodesInstance<R extends {}> {
  getNode: (itemId: string) => TreeViewNode;
  getItem: (itemId: string) => R;
  getNodesToRender: () => TreeViewNodeProps[];
  getChildrenIds: (itemId: string | null) => string[];
  getNavigableChildrenIds: (itemId: string | null) => string[];
  isNodeDisabled: (itemId: string | null) => itemId is string;
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

export interface UseTreeViewNodesPublicAPI<R extends {}>
  extends Pick<UseTreeViewNodesInstance<R>, 'getItem'> {}

export interface UseTreeViewNodesParameters<R extends {}> {
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
   * @default `(item) => item.label`
   */
  getItemLabel?: (item: R) => string;
  /**
   * Used to determine the string label for a given item.
   *
   * @template R
   * @param {R} item The item to check.
   * @returns {string} The id of the item.
   * @default `(item) => item.id`
   */
  getItemId?: (item: R) => TreeViewItemId;
}

export type UseTreeViewNodesDefaultizedParameters<R extends {}> = DefaultizedProps<
  UseTreeViewNodesParameters<R>,
  'disabledItemsFocusable'
>;

interface UseTreeViewNodesEventLookup {
  removeNode: {
    params: { id: string };
  };
}

export interface TreeViewItemIdAndChildren {
  id: TreeViewItemId;
  children?: TreeViewItemIdAndChildren[];
}

export interface UseTreeViewNodesState<R extends {}> {
  nodes: {
    nodeTree: TreeViewItemIdAndChildren[];
    nodeMap: TreeViewNodeMap;
    itemMap: TreeViewItemMap<R>;
  };
}

interface UseTreeViewNodesContextValue
  extends Pick<UseTreeViewNodesDefaultizedParameters<any>, 'disabledItemsFocusable'> {}

export type UseTreeViewNodesSignature = TreeViewPluginSignature<{
  params: UseTreeViewNodesParameters<any>;
  defaultizedParams: UseTreeViewNodesDefaultizedParameters<any>;
  instance: UseTreeViewNodesInstance<any>;
  publicAPI: UseTreeViewNodesPublicAPI<any>;
  events: UseTreeViewNodesEventLookup;
  state: UseTreeViewNodesState<any>;
  contextValue: UseTreeViewNodesContextValue;
}>;

export type TreeViewNodeMap = { [itemId: string]: TreeViewNode };

export type TreeViewItemMap<R extends {}> = { [itemId: string]: R };
