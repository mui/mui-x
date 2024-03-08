import { TreeViewNode, TreeViewPluginSignature } from '../../models';
import { UseTreeViewNodesSignature } from '../useTreeViewNodes';
import { UseTreeViewKeyboardNavigationSignature } from '../useTreeViewKeyboardNavigation';
import { TreeViewItemChildrenIndexes } from '../useTreeViewNodes/useTreeViewNodes.types';

export interface UseTreeViewNodesInstance {
  insertJSXNode: (node: TreeViewNode) => void;
  setJSXItemsChildrenIndexes: (itemId: string | null, indexes: TreeViewItemChildrenIndexes) => void;
  getJSXItemsChildrenIndexes: (itemId: string | null) => TreeViewItemChildrenIndexes;
  removeJSXNode: (nodeId: string) => void;
  mapFirstCharFromJSX: (nodeId: string, firstChar: string) => () => void;
}

export interface UseTreeViewNodesParameters {}

export interface UseTreeViewNodesDefaultizedParameters {}

export type UseTreeViewJSXNodesSignature = TreeViewPluginSignature<{
  params: UseTreeViewNodesParameters;
  defaultizedParams: UseTreeViewNodesDefaultizedParameters;
  instance: UseTreeViewNodesInstance;
  dependantPlugins: [UseTreeViewNodesSignature, UseTreeViewKeyboardNavigationSignature];
}>;
