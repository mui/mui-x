import { TreeViewNode, DefaultizedProps } from '../../models';

export interface UseTreeViewNodesInstance {
  isNodeDisabled: (nodeId: string | null) => nodeId is string;
  getChildrenIds: (nodeId: string | null) => string[];
  getNavigableChildrenIds: (nodeId: string | null) => string[];
  registerNode: (node: TreeViewNode) => void;
  unregisterNode: (nodeId: string) => void;
}

export interface UseTreeViewNodesProps {
  /**
   * If `true`, will allow focus on disabled items.
   * @default false
   */
  disabledItemsFocusable?: boolean;
}

export type UseTreeViewNodesDefaultizedProps = DefaultizedProps<
  UseTreeViewNodesProps,
  'disabledItemsFocusable'
>;
