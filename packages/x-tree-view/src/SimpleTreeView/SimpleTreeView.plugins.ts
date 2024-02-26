import {
  DefaultTreeViewPluginSlotProps,
  DefaultTreeViewPluginSlots,
} from '../internals/plugins/defaultPlugins';
import { useTreeViewJSXNodes } from '../internals/plugins/useTreeViewJSXNodes';
import { ConvertPluginsIntoSignatures } from '../internals/models';
import { useTreeViewId, UseTreeViewIdParameters } from '../internals/plugins/useTreeViewId';
import {
  useTreeViewNodes,
  UseTreeViewNodesParameters,
} from '../internals/plugins/useTreeViewNodes';
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
  useTreeViewNodes,
  useTreeViewExpansion,
  useTreeViewSelection,
  useTreeViewFocus,
  useTreeViewKeyboardNavigation,
  useTreeViewIcons,
  useTreeViewJSXNodes,
] as const;

export type SimpleTreeViewPlugins = ConvertPluginsIntoSignatures<typeof SIMPLE_TREE_VIEW_PLUGINS>;

export type SimpleTreeViewPluginSlots = DefaultTreeViewPluginSlots;

export type SimpleTreeViewPluginSlotProps = DefaultTreeViewPluginSlotProps;

// We can't infer this type from the plugin, otherwise we would lose the generics.
export interface SimpleTreeViewPluginParameters<Multiple extends boolean | undefined>
  extends UseTreeViewIdParameters,
    Omit<
      UseTreeViewNodesParameters<any>,
      'items' | 'isItemDisabled' | 'getItemLabel' | 'getItemId'
    >,
    UseTreeViewExpansionParameters,
    UseTreeViewFocusParameters,
    UseTreeViewSelectionParameters<Multiple>,
    UseTreeViewIconsParameters {}
