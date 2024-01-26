import { useTreeViewInstanceEvents } from './useTreeViewInstanceEvents';
import { ConvertPluginsIntoSignatures, MergePlugins } from '../models';

/**
 * Internal plugins that create the tools used by the other plugins.
 * These plugins are used by the tree view components.
 */
export const TREE_VIEW_CORE_PLUGINS = [useTreeViewInstanceEvents] as const;

export type TreeViewCorePluginsSignature = MergePlugins<
  ConvertPluginsIntoSignatures<typeof TREE_VIEW_CORE_PLUGINS>
>;
