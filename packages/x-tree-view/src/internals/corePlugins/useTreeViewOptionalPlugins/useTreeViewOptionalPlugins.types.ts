import { TreeViewPlugin, TreeViewAnyPluginSignature, TreeViewPluginSignature } from '../../models';

interface UseTreeViewOptionalPluginsInstance {
  getAvailablePlugins: () => Set<TreeViewPlugin<TreeViewAnyPluginSignature>>;
}

export type UseTreeViewOptionalPluginsSignature = TreeViewPluginSignature<{
  instance: UseTreeViewOptionalPluginsInstance;
}>;
