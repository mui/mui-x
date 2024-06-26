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
import { ConvertPluginsIntoSignatures, MergeSignaturesProperty } from '../internals/models';
import {
  useTreeViewLabel,
  UseTreeViewLabelParameters,
} from '../internals/plugins/useTreeViewLabel';

export const RICH_TREE_VIEW_PLUGINS = [
  useTreeViewItems,
  useTreeViewExpansion,
  useTreeViewSelection,
  useTreeViewFocus,
  useTreeViewKeyboardNavigation,
  useTreeViewIcons,
  useTreeViewLabel,
] as const;

export type RichTreeViewPluginSignatures = ConvertPluginsIntoSignatures<
  typeof RICH_TREE_VIEW_PLUGINS
>;

export type RichTreeViewPluginSlots = MergeSignaturesProperty<
  RichTreeViewPluginSignatures,
  'slots'
>;

export type RichTreeViewPluginSlotProps = MergeSignaturesProperty<
  RichTreeViewPluginSignatures,
  'slotProps'
>;

// We can't infer this type from the plugin, otherwise we would lose the generics.
export interface RichTreeViewPluginParameters<R extends {}, Multiple extends boolean | undefined>
  extends TreeViewCorePluginParameters,
    UseTreeViewItemsParameters<R>,
    UseTreeViewExpansionParameters,
    UseTreeViewFocusParameters,
    UseTreeViewSelectionParameters<Multiple>,
    UseTreeViewIconsParameters,
    UseTreeViewLabelParameters<R> {}
