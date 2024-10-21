import { TreeViewPlugin } from '../../models';
import { UseTreeViewOptionalPluginsSignature } from './useTreeViewOptionalPlugins.types';

export const useTreeViewOptionalPlugins: TreeViewPlugin<UseTreeViewOptionalPluginsSignature> = ({
  plugins,
}) => {
  const pluginSet = new Set(plugins);
  const getAvailablePlugins = () => pluginSet;

  return {
    instance: {
      getAvailablePlugins,
    },
  };
};

useTreeViewOptionalPlugins.params = {};
