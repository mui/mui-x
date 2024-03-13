import { TreeViewItem, DefaultizedProps, TreeViewPluginSignature } from '../../models';
import { TreeViewItemId } from '../../../models';

interface TreeViewItemProps {
  label: string;
  nodeId: string;
  id: string | undefined;
  children?: TreeViewItemProps[];
}

export interface UseTreeViewItemsInstance<R extends {}> {
  getNode: (nodeId: string) => TreeViewItem;
  getItem: (nodeId: string) => R;
  getItemsToRender: () => TreeViewItemProps[];
  getChildrenIds: (nodeId: string | null) => string[];
  getNavigableChildrenIds: (nodeId: string | null) => string[];
  isNodeDisabled: (nodeId: string | null) => nodeId is string;
}

export interface UseTreeViewNodesPublicAPI<R extends {}>
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

export type UseTreeViewItemsDefaultizedParameters<R extends {}> = DefaultizedProps<
  UseTreeViewItemsParameters<R>,
  'disabledItemsFocusable'
>;

interface UseTreeViewItemsEventLookup {
  removeNode: {
    params: { id: string };
  };
}

export interface TreeViewItemIdAndChildren {
  id: TreeViewItemId;
  children?: TreeViewItemIdAndChildren[];
}

export interface UseTreeViewItemsState<R extends {}> {
  nodes: {
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
  publicAPI: UseTreeViewNodesPublicAPI<any>;
  events: UseTreeViewItemsEventLookup;
  state: UseTreeViewItemsState<any>;
  contextValue: UseTreeViewItemsContextValue;
}>;

export type TreeViewNodeMap = { [nodeId: string]: TreeViewItem };

export type TreeViewItemMap<R extends {}> = { [nodeId: string]: R };
