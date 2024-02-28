import { TreeViewNode, DefaultizedProps, TreeViewPluginSignature } from '../../models';
import { TreeViewItemId } from '../../../models';

interface TreeViewNodeProps {
  label: string;
  nodeId: string;
  id: string | undefined;
  children?: TreeViewNodeProps[];
}

export interface UseTreeViewNodesInstance {
  getNode: (nodeId: string) => TreeViewNode;
  getNodesToRender: () => TreeViewNodeProps[];
  getChildrenIds: (nodeId: string | null) => string[];
  getNavigableChildrenIds: (nodeId: string | null) => string[];
  isNodeDisabled: (nodeId: string | null) => nodeId is string;
}

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

export interface UseTreeViewNodesState {
  nodeTree: TreeViewNodeIdAndChildren[];
  nodeMap: TreeViewNodeMap;
}

interface UseTreeViewNodesContextValue
  extends Pick<UseTreeViewNodesDefaultizedParameters<any>, 'disabledItemsFocusable'> {}

export type UseTreeViewNodesSignature = TreeViewPluginSignature<{
  params: UseTreeViewNodesParameters<any>;
  defaultizedParams: UseTreeViewNodesDefaultizedParameters<any>;
  instance: UseTreeViewNodesInstance;
  events: UseTreeViewNodesEventLookup;
  state: UseTreeViewNodesState;
  contextValue: UseTreeViewNodesContextValue;
}>;

export type TreeViewNodeMap = { [nodeId: string]: TreeViewNode };
