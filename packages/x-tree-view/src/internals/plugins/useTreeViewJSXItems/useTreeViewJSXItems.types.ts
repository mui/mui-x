import { TreeViewItemMeta, TreeViewPluginSignature } from '../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import { UseTreeViewKeyboardNavigationSignature } from '../useTreeViewKeyboardNavigation';

export interface UseTreeViewItemsInstance {
  insertJSXItem: (item: TreeViewItemMeta) => void;
  removeJSXItem: (itemId: string) => void;
  mapFirstCharFromJSX: (itemId: string, firstChar: string) => () => void;
}

export interface UseTreeViewJSXItemsParameters {}

export interface UseTreeViewItemsDefaultizedParameters {}

export type UseTreeViewJSXItemsSignature = TreeViewPluginSignature<{
  params: UseTreeViewJSXItemsParameters;
  defaultizedParams: UseTreeViewItemsDefaultizedParameters;
  instance: UseTreeViewItemsInstance;
  dependantPlugins: [UseTreeViewItemsSignature, UseTreeViewKeyboardNavigationSignature];
}>;
