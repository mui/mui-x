import {
  useTreeViewId,
  UseTreeViewIdParameters,
  useTreeViewItems,
  UseTreeViewItemsParameters,
  useTreeViewExpansion,
  UseTreeViewExpansionParameters,
  useTreeViewSelection,
  UseTreeViewSelectionParameters,
  useTreeViewFocus,
  UseTreeViewFocusParameters,
  useTreeViewKeyboardNavigation,
  useTreeViewIcons,
  UseTreeViewIconsParameters,
  ConvertPluginsIntoSignatures,
  MergeSignaturesProperty,
} from '@mui/x-tree-view/internals';

export const DEFAULT_TREE_VIEW_PRO_PLUGINS = [
  useTreeViewId,
  useTreeViewItems,
  useTreeViewExpansion,
  useTreeViewSelection,
  useTreeViewFocus,
  useTreeViewKeyboardNavigation,
  useTreeViewIcons,
] as const;

export type DefaultTreeViewProPluginSignatures = ConvertPluginsIntoSignatures<
  typeof DEFAULT_TREE_VIEW_PRO_PLUGINS
>;

export type DefaultTreeViewProPluginSlots = MergeSignaturesProperty<
  DefaultTreeViewProPluginSignatures,
  'slots'
>;

export type DefaultTreeViewProPluginSlotProps = MergeSignaturesProperty<
  DefaultTreeViewProPluginSignatures,
  'slotProps'
>;

// We can't infer this type from the plugin, otherwise we would lose the generics.
export interface DefaultTreeViewProPluginParameters<
  R extends {},
  Multiple extends boolean | undefined,
> extends UseTreeViewIdParameters,
    UseTreeViewItemsParameters<R>,
    UseTreeViewExpansionParameters,
    UseTreeViewFocusParameters,
    UseTreeViewSelectionParameters<Multiple>,
    UseTreeViewIconsParameters {}
