import { useTreeViewId, UseTreeViewIdParameters } from './useTreeViewId';
import { useTreeViewNodes, UseTreeViewNodesParameters } from './useTreeViewNodes';
import { useTreeViewExpansion, UseTreeViewExpansionParameters } from './useTreeViewExpansion';
import { useTreeViewSelection, UseTreeViewSelectionParameters } from './useTreeViewSelection';
import { useTreeViewFocus, UseTreeViewFocusParameters } from './useTreeViewFocus';
import { useTreeViewKeyboardNavigation } from './useTreeViewKeyboardNavigation';
import {
  useTreeViewContextValueBuilder,
  UseTreeViewContextValueBuilderParameters,
} from './useTreeViewContextValueBuilder';
import { ConvertPluginsIntoSignatures } from '../models';

export const DEFAULT_TREE_VIEW_PLUGINS = [
  useTreeViewId,
  useTreeViewNodes,
  useTreeViewExpansion,
  useTreeViewSelection,
  useTreeViewFocus,
  useTreeViewKeyboardNavigation,
  useTreeViewContextValueBuilder,
] as const;

export type DefaultTreeViewPlugins = ConvertPluginsIntoSignatures<typeof DEFAULT_TREE_VIEW_PLUGINS>;

// We can't infer this type from the plugin, otherwise we would lose the generics.
export interface DefaultTreeViewPluginParameters<R extends {}, Multiple extends boolean | undefined>
  extends UseTreeViewIdParameters,
    UseTreeViewNodesParameters<R>,
    UseTreeViewExpansionParameters,
    UseTreeViewFocusParameters,
    UseTreeViewSelectionParameters<Multiple>,
    UseTreeViewContextValueBuilderParameters {}
