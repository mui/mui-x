import { TreeViewNode, TreeViewPluginSignature } from '../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import { TreeViewItemChildrenIndexes } from '../useTreeViewItems/useTreeViewItems.types';
import { UseTreeViewKeyboardNavigationSignature } from '../useTreeViewKeyboardNavigation';

export interface UseTreeViewItemsInstance {
  insertJSXItem: (item: TreeViewNode) => void;
  removeJSXItem: (itemId: string) => void;
  mapFirstCharFromJSX: (itemId: string, firstChar: string) => () => void;
  setJSXItemsChildrenIndexes: (itemId: string | null, indexes: TreeViewItemChildrenIndexes) => void;
  getJSXItemsChildrenIndexes: (itemId: string | null) => TreeViewItemChildrenIndexes;
}

export interface UseTreeViewItemsParameters {}

export interface UseTreeViewItemsDefaultizedParameters {}

export type UseTreeViewJSXItemsSignature = TreeViewPluginSignature<{
  params: UseTreeViewItemsParameters;
  defaultizedParams: UseTreeViewItemsDefaultizedParameters;
  instance: UseTreeViewItemsInstance;
  dependantPlugins: [UseTreeViewItemsSignature, UseTreeViewKeyboardNavigationSignature];
}>;
