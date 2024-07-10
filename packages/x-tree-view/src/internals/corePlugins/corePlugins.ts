import { useTreeViewInstanceEvents } from './useTreeViewInstanceEvents';
import { useTreeViewOptionalPlugins } from './useTreeViewOptionalPlugins';
import { useTreeViewId, UseTreeViewIdParameters } from './useTreeViewId';
import { ConvertPluginsIntoSignatures } from '../models';

/**
 * Internal plugins that create the tools used by the other plugins.
 * These plugins are used by the tree view components.
 */
export const TREE_VIEW_CORE_PLUGINS = [
  useTreeViewInstanceEvents,
  useTreeViewOptionalPlugins,
  useTreeViewId,
] as const;

export type TreeViewCorePluginSignatures = ConvertPluginsIntoSignatures<
  typeof TREE_VIEW_CORE_PLUGINS
>;

export interface TreeViewCorePluginParameters extends UseTreeViewIdParameters {}
