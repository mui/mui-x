import { TreeViewNode, DefaultizedProps, TreeViewPluginSignature } from '../../models';
import { UseTreeViewJSXNodesRegistrationSignature } from '../useTreeViewJSXNodesRegistration';

export interface UseTreeViewNodesInstance {
  getNode: (nodeId: string) => TreeViewNode;
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
}

export type UseTreeViewNodesDefaultizedParameters = DefaultizedProps<
  UseTreeViewNodesParameters,
  'disabledItemsFocusable'
>;

export type UseTreeViewNodesSignature = TreeViewPluginSignature<
  UseTreeViewNodesParameters,
  UseTreeViewNodesDefaultizedParameters,
  UseTreeViewNodesInstance,
  {},
  {},
  never,
  [UseTreeViewJSXNodesRegistrationSignature]
>;
