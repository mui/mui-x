import { TreeViewAnyPluginSignature, TreeViewInstance, TreeViewPlugin } from '../models';

export const hasPlugin = <
  TSignature extends TreeViewAnyPluginSignature,
  TInstance extends TreeViewInstance<[], [TSignature]>,
>(
  instance: TInstance,
  plugin: TreeViewPlugin<TSignature>,
): instance is Omit<TInstance, keyof TSignature['instance']> & TSignature['instance'] => {
  const plugins = instance.getAvailablePlugins();
  return plugins.has(plugin as any);
};
