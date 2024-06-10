import { useTreeViewInstanceEvents } from './useTreeViewInstanceEvents';
import { ConvertPluginsIntoSignatures } from '../models';

/**
 * Internal plugins that create the tools used by the other plugins.
 * These plugins are used by the tree view components.
 */
export const TREE_VIEW_CORE_PLUGINS = [useTreeViewInstanceEvents] as const;

export type TreeViewCorePluginSignatures = ConvertPluginsIntoSignatures<
  typeof TREE_VIEW_CORE_PLUGINS
>;
