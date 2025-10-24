import { TreeItemWrapper, TreeViewItemPlugin } from '../models';
import { MinimalTreeViewStore } from './MinimalTreeViewStore';

/**
 * Manages the registration and application of plugins for the Tree Item.
 * This will be replaced with a proper implementation in the future.
 */
export class TreeViewItemPluginManager<Store extends MinimalTreeViewStore<any, any, any, any>> {
  private store: Store;

  private itemPlugins: TreeViewItemPlugin[] = [];

  private itemWrappers: TreeItemWrapper<Store>[] = [];

  constructor(store: Store) {
    this.store = store;
  }

  public register = (plugin: TreeViewItemPlugin, wrapItem: TreeItemWrapper<Store>) => {
    this.itemPlugins.push(plugin);
    this.itemWrappers.push(wrapItem);
  };

  public listPlugins = () => this.itemPlugins;

  public listWrappers = () => this.itemWrappers;
}
