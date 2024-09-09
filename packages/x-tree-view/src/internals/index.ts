export { useTreeView } from './useTreeView';
export { TreeViewProvider, useTreeViewContext } from './TreeViewProvider';

export { RichTreeViewItems } from './components/RichTreeViewItems';
export type {
  RichTreeViewItemsProps,
  RichTreeViewItemsSlots,
  RichTreeViewItemsSlotProps,
} from './components/RichTreeViewItems';

export { unstable_resetCleanupTracking } from './hooks/useInstanceEventHandler';

export type {
  TreeViewPlugin,
  TreeViewPluginSignature,
  ConvertPluginsIntoSignatures,
  MergeSignaturesProperty,
  TreeViewPublicAPI,
  TreeViewExperimentalFeatures,
  TreeViewItemMeta,
  TreeViewInstance,
  DefaultizedProps,
  TreeViewItemPlugin,
  MuiCancellableEvent,
  MuiCancellableEventHandler,
  MakeOptional,
} from './models';

// Core plugins
export type { TreeViewCorePluginParameters } from './corePlugins';

// Plugins
export { useTreeViewExpansion } from './plugins/useTreeViewExpansion';
export type {
  UseTreeViewExpansionSignature,
  UseTreeViewExpansionParameters,
} from './plugins/useTreeViewExpansion';
export { useTreeViewSelection } from './plugins/useTreeViewSelection';
export type {
  UseTreeViewSelectionSignature,
  UseTreeViewSelectionParameters,
} from './plugins/useTreeViewSelection';
export { useTreeViewFocus } from './plugins/useTreeViewFocus';
export type {
  UseTreeViewFocusSignature,
  UseTreeViewFocusParameters,
} from './plugins/useTreeViewFocus';
export { useTreeViewKeyboardNavigation } from './plugins/useTreeViewKeyboardNavigation';
export type { UseTreeViewKeyboardNavigationSignature } from './plugins/useTreeViewKeyboardNavigation';
export { useTreeViewIcons } from './plugins/useTreeViewIcons';
export type {
  UseTreeViewIconsSignature,
  UseTreeViewIconsParameters,
} from './plugins/useTreeViewIcons';
export {
  useTreeViewItems,
  buildSiblingIndexes,
  TREE_VIEW_ROOT_PARENT_ID,
} from './plugins/useTreeViewItems';
export type {
  UseTreeViewItemsSignature,
  UseTreeViewItemsParameters,
  UseTreeViewItemsState,
  TreeViewItemToRenderProps,
  TreeViewItemMetaMap,
} from './plugins/useTreeViewItems';
export { useTreeViewLabel } from './plugins/useTreeViewLabel';
export type {
  UseTreeViewLabelSignature,
  UseTreeViewLabelParameters,
} from './plugins/useTreeViewLabel';
export { useTreeViewJSXItems } from './plugins/useTreeViewJSXItems';
export type {
  UseTreeViewJSXItemsSignature,
  UseTreeViewJSXItemsParameters,
} from './plugins/useTreeViewJSXItems';

export { clamp } from './utils/utils';
export { isTargetInDescendants } from './utils/tree';
