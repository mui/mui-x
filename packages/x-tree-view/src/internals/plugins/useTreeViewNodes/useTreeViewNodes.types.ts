import { TreeViewNode, DefaultizedProps, TreeViewPluginSignature } from '../../models';
import { TreeViewItemId } from '../../../models';

interface TreeViewNodeProps {
  label: string;
  nodeId: string;
  id: string | undefined;
  children?: TreeViewNodeProps[];
}

export interface UseTreeViewNodesInstance<R extends {}> {
  getNode: (nodeId: string) => TreeViewNode;
  getItem: (nodeId: string) => R;
  getNodesToRender: () => TreeViewNodeProps[];
  getChildrenIds: (nodeId: string | null) => string[];
  getNavigableChildrenIds: (nodeId: string | null) => string[];
  isNodeDisabled: (nodeId: string | null) => nodeId is string;
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

export interface TreeViewNodeIdAndChildren {
  id: TreeViewItemId;
  children?: TreeViewNodeIdAndChildren[];
}

export interface UseTreeViewNodesState<R extends {}> {
  nodes: {
    nodeTree: TreeViewNodeIdAndChildren[];
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

export type TreeViewNodeMap = { [nodeId: string]: TreeViewNode };

export type TreeViewItemMap<R extends {}> = { [nodeId: string]: R };
