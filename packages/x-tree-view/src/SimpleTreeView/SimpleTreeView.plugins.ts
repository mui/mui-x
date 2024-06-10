import {
  DEFAULT_TREE_VIEW_PLUGINS,
  DefaultTreeViewPluginParameters,
  DefaultTreeViewPluginSlotProps,
  DefaultTreeViewPluginSlots,
} from '../internals/plugins/defaultPlugins';
import { useTreeViewJSXItems } from '../internals/plugins/useTreeViewJSXItems';
import { ConvertPluginsIntoSignatures } from '../internals/models';

export const SIMPLE_TREE_VIEW_PLUGINS = [
  ...DEFAULT_TREE_VIEW_PLUGINS,
  useTreeViewJSXItems,
] as const;

export type SimpleTreeViewPluginSignatures = ConvertPluginsIntoSignatures<
  typeof SIMPLE_TREE_VIEW_PLUGINS
>;

export type SimpleTreeViewPluginSlots = DefaultTreeViewPluginSlots;

export type SimpleTreeViewPluginSlotProps = DefaultTreeViewPluginSlotProps;

// We can't infer this type from the plugin, otherwise we would lose the generics.
export interface SimpleTreeViewPluginParameters<Multiple extends boolean | undefined>
  extends Omit<
    DefaultTreeViewPluginParameters<any, Multiple>,
    'items' | 'isItemDisabled' | 'getItemLabel' | 'getItemId'
  > {}
