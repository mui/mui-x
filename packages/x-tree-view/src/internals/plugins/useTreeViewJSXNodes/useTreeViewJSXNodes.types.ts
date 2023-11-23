import { TreeViewNode, TreeViewPluginSignature } from '../../models';
import { UseTreeViewNodesSignature } from '../useTreeViewNodes';
import { UseTreeViewKeyboardNavigationSignature } from '../useTreeViewKeyboardNavigation';

export interface UseTreeViewNodesInstance {
  insertJSXNode: (node: TreeViewNode) => void;
  removeJSXNode: (nodeId: string) => void;
  mapFirstCharFromJSX: (nodeId: string, firstChar: string) => () => void;
}

export interface UseTreeViewNodesParameters {}

export interface UseTreeViewNodesDefaultizedParameters {}

export type UseTreeViewJSXNodesSignature = TreeViewPluginSignature<
  UseTreeViewNodesParameters,
  UseTreeViewNodesDefaultizedParameters,
  UseTreeViewNodesInstance,
  {},
  {},
  never,
  [UseTreeViewNodesSignature, UseTreeViewKeyboardNavigationSignature]
>;
