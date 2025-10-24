import { TreeItemWrapper, TreeViewAnyStore, TreeViewItemPlugin } from '../models';

/**
 * Manages the registration and application of plugins for the Tree Item.
 * This will be replaced with a proper implementation in the future.
 */
export class TreeViewItemPluginManager<Store extends TreeViewAnyStore> {
  private itemPlugins: TreeViewItemPlugin[] = [];

  private itemWrappers: TreeItemWrapper<Store>[] = [];

  public register = (plugin: TreeViewItemPlugin, wrapItem: TreeItemWrapper<Store> | null) => {
    this.itemPlugins.push(plugin);
    if (wrapItem) {
      this.itemWrappers.push(wrapItem);
    }
  };

  public listPlugins = () => this.itemPlugins;

  public listWrappers = () => this.itemWrappers;
}
