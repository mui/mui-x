import { TreeViewNode, DefaultizedProps, TreeViewPluginSignature } from '../../models';

export interface UseTreeViewNodesInstance {
  getNode: (nodeId: string) => TreeViewNode;
  updateNode: (node: TreeViewNode) => void;
  removeNode: (nodeId: string) => void;
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

export type UseTreeViewNodesSignature = TreeViewPluginSignature<
  UseTreeViewNodesParameters<any>,
  UseTreeViewNodesDefaultizedParameters<any>,
  UseTreeViewNodesInstance,
  UseTreeViewNodesEventLookup,
  {},
  never,
  []
>;
