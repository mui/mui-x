import {
  DEFAULT_TREE_VIEW_PLUGINS,
  DefaultTreeViewPluginParameters,
  DefaultTreeViewPluginSlotProps,
  DefaultTreeViewPluginSlots,
} from '../internals/plugins/defaultPlugins';
import { useTreeViewJSXNodes } from '../internals/plugins/useTreeViewJSXNodes';
import { ConvertPluginsIntoSignatures } from '../internals/models';

export const SIMPLE_TREE_VIEW_PLUGINS = [
  ...DEFAULT_TREE_VIEW_PLUGINS,
  useTreeViewJSXNodes,
] as const;

export type SimpleTreeViewPlugins = ConvertPluginsIntoSignatures<typeof SIMPLE_TREE_VIEW_PLUGINS>;

export type SimpleTreeViewPluginSlots = DefaultTreeViewPluginSlots;

export type SimpleTreeViewPluginSlotProps = DefaultTreeViewPluginSlotProps;

// We can't infer this type from the plugin, otherwise we would lose the generics.
export interface SimpleTreeViewPluginParameters<Multiple extends boolean | undefined>
  extends Omit<
    DefaultTreeViewPluginParameters<any, Multiple>,
    'items' | 'isItemDisabled' | 'getItemLabel' | 'getItemId'
  > {}
