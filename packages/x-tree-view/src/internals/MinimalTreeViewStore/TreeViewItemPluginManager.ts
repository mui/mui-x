import { TreeViewItemPlugin } from '../models';
import { TreeViewItemPluginsRunner } from '../TreeViewProvider';
import { MinimalTreeViewStore } from './TreeViewStore';

/**
 * Manages the registration and application of plugins for the Tree Item.
 * This will be replaced with a proper implementation in the future.
 */
export class TreeViewItemPluginManager<Store extends MinimalTreeViewStore<any, any, any, any>> {
  private store: Store;

  private itemPlugins: TreeViewItemPlugin[] = [];

  constructor(store: Store) {
    this.store = store;
  }

  public register = (plugin: TreeViewItemPlugin) => {
    this.itemPlugins.push(plugin);
  };

  public list = () => this.itemPlugins;
}
