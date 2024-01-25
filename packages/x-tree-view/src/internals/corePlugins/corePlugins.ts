import { useTreeViewInstanceEvents } from './useTreeViewInstanceEvents';
import { useTreeViewId, UseTreeViewIdParameters } from './useTreeViewId';
import { useTreeViewNodes, UseTreeViewNodesParameters } from './useTreeViewNodes';
import { ConvertPluginsIntoSignatures, MergePlugins } from '../models';

/**
 * Internal plugins that create the tools used by the other plugins.
 * These plugins are used by the tree view components.
 */
export const TREE_VIEW_CORE_PLUGINS = [
  useTreeViewInstanceEvents,
  useTreeViewId,
  useTreeViewNodes,
] as const;

export type TreeViewCorePluginsSignature = MergePlugins<
  ConvertPluginsIntoSignatures<typeof TREE_VIEW_CORE_PLUGINS>
>;

export interface TreeViewCorePluginsParameters<R extends {}>
  extends UseTreeViewIdParameters,
    UseTreeViewNodesParameters<R> {}
