import { TreeViewNode, TreeViewPluginSignature } from '../../models';
import { UseTreeViewNodesSignature } from '../useTreeViewNodes';
import { UseTreeViewKeyboardNavigationSignature } from '../useTreeViewKeyboardNavigation';

export interface UseTreeViewNodesInstance {
  insertJSXNode: (node: TreeViewNode) => void;
  removeJSXNode: (itemId: string) => void;
  mapFirstCharFromJSX: (itemId: string, firstChar: string) => () => void;
}

export interface UseTreeViewNodesParameters {}

export interface UseTreeViewNodesDefaultizedParameters {}

export type UseTreeViewJSXNodesSignature = TreeViewPluginSignature<{
  params: UseTreeViewNodesParameters;
  defaultizedParams: UseTreeViewNodesDefaultizedParameters;
  instance: UseTreeViewNodesInstance;
  dependantPlugins: [UseTreeViewNodesSignature, UseTreeViewKeyboardNavigationSignature];
}>;
