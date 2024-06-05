import { useTreeViewId, UseTreeViewIdParameters } from './useTreeViewId';
import { useTreeViewItems, UseTreeViewItemsParameters } from './useTreeViewItems';
import { useTreeViewExpansion, UseTreeViewExpansionParameters } from './useTreeViewExpansion';
import { useTreeViewSelection, UseTreeViewSelectionParameters } from './useTreeViewSelection';
import { useTreeViewFocus, UseTreeViewFocusParameters } from './useTreeViewFocus';
import { useTreeViewKeyboardNavigation } from './useTreeViewKeyboardNavigation';
import { useTreeViewIcons, UseTreeViewIconsParameters } from './useTreeViewIcons';
import { ConvertPluginsIntoSignatures, MergeSignaturesProperty } from '../models';

export const DEFAULT_TREE_VIEW_PLUGINS = [
  useTreeViewId,
  useTreeViewItems,
  useTreeViewExpansion,
  useTreeViewSelection,
  useTreeViewFocus,
  useTreeViewKeyboardNavigation,
  useTreeViewIcons,
] as const;

export type DefaultTreeViewPluginSignatures = ConvertPluginsIntoSignatures<
  typeof DEFAULT_TREE_VIEW_PLUGINS
>;

export type DefaultTreeViewPluginSlots = MergeSignaturesProperty<
  DefaultTreeViewPluginSignatures,
  'slots'
>;

export type DefaultTreeViewPluginSlotProps = MergeSignaturesProperty<
  DefaultTreeViewPluginSignatures,
  'slotProps'
>;

// We can't infer this type from the plugin, otherwise we would lose the generics.
export interface DefaultTreeViewPluginParameters<R extends {}, Multiple extends boolean | undefined>
  extends UseTreeViewIdParameters,
    UseTreeViewItemsParameters<R>,
    UseTreeViewExpansionParameters,
    UseTreeViewFocusParameters,
    UseTreeViewSelectionParameters<Multiple>,
    UseTreeViewIconsParameters {}
