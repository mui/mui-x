import { TreeViewPluginSignature } from '../../models';
import { Store } from '../../utils/Store';

export interface UseTreeViewSelectorsCache<TState extends {}> {
  /**
   * Reference to the public state
   */
  state: TState;
  /**
   * The pub/sub store containing a reference to the public state.
   * @ignore - do not document.
   */
  store: Store<TState>;
  /**
   * Unique identifier for each component instance in a page.
   */
  instanceId: number;
}

export interface UseTreeViewSelectorsInstance<TState extends {}> {
  selectorsCache: UseTreeViewSelectorsCache<TState>;
}

export type UseTreeViewSelectorsSignature = TreeViewPluginSignature<{
  instance: UseTreeViewSelectorsInstance<any>;
}>;
