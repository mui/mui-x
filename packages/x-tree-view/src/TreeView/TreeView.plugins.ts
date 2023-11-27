import {
  DEFAULT_TREE_VIEW_PLUGINS,
  DefaultTreeViewPluginParameters,
} from '../internals/plugins/defaultPlugins';
import { useTreeViewJSXNodes } from '../internals/plugins/useTreeViewJSXNodes';
import { ConvertPluginsIntoSignatures } from '../internals/models';

export const TREE_VIEW_PLUGINS = [...DEFAULT_TREE_VIEW_PLUGINS, useTreeViewJSXNodes] as const;

export type TreeViewPlugins = ConvertPluginsIntoSignatures<typeof TREE_VIEW_PLUGINS>;

// We can't infer this type from the plugin, otherwise we would lose the generics.
export interface TreeViewPluginParameters<Multiple extends boolean | undefined>
  extends Omit<DefaultTreeViewPluginParameters<any, Multiple>, 'items' | 'isItemDisabled'> {}
