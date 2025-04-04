import { TreeViewCorePluginParameters } from '../internals/corePlugins';
import {
  useTreeViewItems,
  UseTreeViewItemsParameters,
} from '../internals/plugins/useTreeViewItems';
import {
  useTreeViewExpansion,
  UseTreeViewExpansionParameters,
} from '../internals/plugins/useTreeViewExpansion';
import {
  useTreeViewSelection,
  UseTreeViewSelectionParameters,
} from '../internals/plugins/useTreeViewSelection';
import {
  useTreeViewFocus,
  UseTreeViewFocusParameters,
} from '../internals/plugins/useTreeViewFocus';
import { useTreeViewKeyboardNavigation } from '../internals/plugins/useTreeViewKeyboardNavigation';
import { useTreeViewJSXItems } from '../internals/plugins/useTreeViewJSXItems';
import { ConvertPluginsIntoSignatures } from '../internals/models';

export const SIMPLE_TREE_VIEW_PLUGINS = [
  useTreeViewItems,
  useTreeViewExpansion,
  useTreeViewSelection,
  useTreeViewFocus,
  useTreeViewKeyboardNavigation,
  useTreeViewJSXItems,
] as const;

export type SimpleTreeViewPluginSignatures = ConvertPluginsIntoSignatures<
  typeof SIMPLE_TREE_VIEW_PLUGINS
>;

// We can't infer this type from the plugin, otherwise we would lose the generics.
export interface SimpleTreeViewPluginParameters<Multiple extends boolean | undefined>
  extends TreeViewCorePluginParameters,
    Omit<
      UseTreeViewItemsParameters<any>,
      'items' | 'isItemDisabled' | 'getItemLabel' | 'getItemId'
    >,
    UseTreeViewExpansionParameters,
    UseTreeViewFocusParameters,
    UseTreeViewSelectionParameters<Multiple> {}
