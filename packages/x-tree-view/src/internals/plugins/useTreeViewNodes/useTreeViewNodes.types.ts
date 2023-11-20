import { TreeViewNode, DefaultizedProps, TreeViewPluginSignature } from '../../models';
import { TreeViewItem } from '../../../models';

export interface UseTreeViewNodesInstance {
  getNode: (nodeId: string) => TreeViewNode;
  insertNode: (node: TreeViewNode) => void;
  removeNode: (nodeId: string) => void;
  getChildrenIds: (nodeId: string | null) => string[];
  getNavigableChildrenIds: (nodeId: string | null) => string[];
  isNodeDisabled: (nodeId: string | null) => nodeId is string;
}

export interface UseTreeViewNodesParameters {
  /**
   * If `true`, will allow focus on disabled items.
   * @default false
   */
  disabledItemsFocusable?: boolean;
  items: readonly TreeViewItem[];
}

export type UseTreeViewNodesDefaultizedParameters = DefaultizedProps<
  UseTreeViewNodesParameters,
  'disabledItemsFocusable'
>;

interface UseTreeViewNodesEventLookup {
  removeNode: {
    params: { id: string };
  };
}

export type UseTreeViewNodesSignature = TreeViewPluginSignature<
  UseTreeViewNodesParameters,
  UseTreeViewNodesDefaultizedParameters,
  UseTreeViewNodesInstance,
  UseTreeViewNodesEventLookup,
  {},
  never,
  []
>;
