import {
  DefaultTreeViewPluginSlotProps,
  DefaultTreeViewPluginSlots,
} from '../internals/plugins/defaultPlugins';
import { useTreeViewJSXItems } from '../internals/plugins/useTreeViewJSXItems';
import { ConvertPluginsIntoSignatures } from '../internals/models';
import { useTreeViewId, UseTreeViewIdParameters } from '../internals/plugins/useTreeViewId';
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

export const SIMPLE_TREE_VIEW_PLUGINS = [
  useTreeViewId,
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

export type SimpleTreeViewPluginSlots = DefaultTreeViewPluginSlots;

export type SimpleTreeViewPluginSlotProps = DefaultTreeViewPluginSlotProps;

// We can't infer this type from the plugin, otherwise we would lose the generics.
export interface SimpleTreeViewPluginParameters<Multiple extends boolean | undefined>
  extends UseTreeViewIdParameters,
    Omit<
      UseTreeViewItemsParameters<any>,
      'items' | 'isItemDisabled' | 'getItemLabel' | 'getItemId'
    >,
    UseTreeViewExpansionParameters,
    UseTreeViewFocusParameters,
    UseTreeViewSelectionParameters<Multiple>,
    UseTreeViewIconsParameters {}
