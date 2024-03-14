import { TreeViewItem, TreeViewPluginSignature } from '../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import { UseTreeViewKeyboardNavigationSignature } from '../useTreeViewKeyboardNavigation';

export interface UseTreeViewItemsInstance {
  insertJSXNode: (node: TreeViewItem) => void;
  removeJSXNode: (nodeId: string) => void;
  mapFirstCharFromJSX: (nodeId: string, firstChar: string) => () => void;
}

export interface UseTreeViewItemsParameters {}

export interface UseTreeViewItemsDefaultizedParameters {}

export type UseTreeViewJSXNodesSignature = TreeViewPluginSignature<{
  params: UseTreeViewItemsParameters;
  defaultizedParams: UseTreeViewItemsDefaultizedParameters;
  instance: UseTreeViewItemsInstance;
  dependantPlugins: [UseTreeViewItemsSignature, UseTreeViewKeyboardNavigationSignature];
}>;
