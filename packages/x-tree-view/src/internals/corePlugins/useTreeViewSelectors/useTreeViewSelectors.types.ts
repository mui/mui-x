import { TreeViewPluginSignature } from '../../models';
import { Store } from '../../utils/Store';

export interface UseTreeViewSelectorsInstance {
  selectorsStore: Store<any, any>;
  getCache: () => any;
}

export type UseTreeViewSelectorsSignature = TreeViewPluginSignature<{
  instance: UseTreeViewSelectorsInstance;
}>;
