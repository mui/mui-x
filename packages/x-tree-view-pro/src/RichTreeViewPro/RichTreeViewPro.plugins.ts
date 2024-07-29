import {
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
  TreeViewCorePluginParameters,
} from '@mui/x-tree-view/internals';

export const RICH_TREE_VIEW_PRO_PLUGINS = [
  useTreeViewItems,
  useTreeViewExpansion,
  useTreeViewSelection,
  useTreeViewFocus,
  useTreeViewKeyboardNavigation,
  useTreeViewIcons,
] as const;

export type RichTreeViewProPluginSignatures = ConvertPluginsIntoSignatures<
  typeof RICH_TREE_VIEW_PRO_PLUGINS
>;

export type RichTreeViewProPluginSlots = MergeSignaturesProperty<
  RichTreeViewProPluginSignatures,
  'slots'
>;

export type RichTreeViewProPluginSlotProps = MergeSignaturesProperty<
  RichTreeViewProPluginSignatures,
  'slotProps'
>;

// We can't infer this type from the plugin, otherwise we would lose the generics.
export interface RichTreeViewProPluginParameters<R extends {}, Multiple extends boolean | undefined>
  extends TreeViewCorePluginParameters,
    UseTreeViewItemsParameters<R>,
    UseTreeViewExpansionParameters,
    UseTreeViewFocusParameters,
    UseTreeViewSelectionParameters<Multiple>,
    UseTreeViewIconsParameters {}
