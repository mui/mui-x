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
import {
  useTreeViewIcons,
  UseTreeViewIconsParameters,
} from '../internals/plugins/useTreeViewIcons';
import { useTreeViewJSXItems } from '../internals/plugins/useTreeViewJSXItems';
import { ConvertPluginsIntoSignatures, MergeSignaturesProperty } from '../internals/models';

export const SIMPLE_TREE_VIEW_PLUGINS = [
  useTreeViewItems,
  useTreeViewExpansion,
  useTreeViewSelection,
  useTreeViewFocus,
  useTreeViewKeyboardNavigation,
  useTreeViewIcons,
  useTreeViewJSXItems,
] as const;

export type SimpleTreeViewPluginSignatures = ConvertPluginsIntoSignatures<
  typeof SIMPLE_TREE_VIEW_PLUGINS
>;

export type SimpleTreeViewPluginSlots = MergeSignaturesProperty<
  SimpleTreeViewPluginSignatures,
  'slots'
>;

export type SimpleTreeViewPluginSlotProps = MergeSignaturesProperty<
  SimpleTreeViewPluginSignatures,
  'slotProps'
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
    UseTreeViewSelectionParameters<Multiple>,
    UseTreeViewIconsParameters {}
