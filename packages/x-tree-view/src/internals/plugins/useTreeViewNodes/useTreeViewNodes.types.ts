import { TreeViewNode, DefaultizedProps, TreeViewPluginSignature } from '../../models';

export interface UseTreeViewNodesInstance {
  getNode: (nodeId: string) => TreeViewNode;
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
  isItemDisabled?: (item: R) => boolean;
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

interface UseTreeViewNodesState {
  nodeMap: TreeViewNodeMap;
}

export type UseTreeViewNodesSignature = TreeViewPluginSignature<
  UseTreeViewNodesParameters<any>,
  UseTreeViewNodesDefaultizedParameters<any>,
  UseTreeViewNodesInstance,
  UseTreeViewNodesEventLookup,
  UseTreeViewNodesState,
  never,
  []
>;

export type TreeViewNodeMap = { [nodeId: string]: TreeViewNode };
