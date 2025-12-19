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
  ConvertPluginsIntoSignatures,
  TreeViewCorePluginParameters,
  useTreeViewLabel,
  UseTreeViewLabelParameters,
  UseTreeViewLazyLoadingParameters,
} from '@mui/x-tree-view/internals';
import {
  useTreeViewItemsReordering,
  UseTreeViewItemsReorderingParameters,
} from '../internals/plugins/useTreeViewItemsReordering';
import { useTreeViewLazyLoading } from '../internals/plugins/useTreeViewLazyLoading';

export const RICH_TREE_VIEW_PRO_PLUGINS = [
  useTreeViewItems,
  useTreeViewExpansion,
  useTreeViewSelection,
  useTreeViewFocus,
  useTreeViewKeyboardNavigation,
  useTreeViewLabel,
  useTreeViewLazyLoading,
  useTreeViewItemsReordering,
] as const;

export type RichTreeViewProPluginSignatures = ConvertPluginsIntoSignatures<
  typeof RICH_TREE_VIEW_PRO_PLUGINS
>;

// We can't infer this type from the plugin, otherwise we would lose the generics.
export interface RichTreeViewProPluginParameters<R extends {}, Multiple extends boolean | undefined>
  extends TreeViewCorePluginParameters,
    UseTreeViewItemsParameters<R>,
    UseTreeViewExpansionParameters,
    UseTreeViewFocusParameters,
    UseTreeViewSelectionParameters<Multiple>,
    UseTreeViewLabelParameters<R>,
    UseTreeViewLazyLoadingParameters<R>,
    UseTreeViewItemsReorderingParameters {}
