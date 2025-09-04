export { useTreeView } from './useTreeView';
export { TreeViewProvider, useTreeViewContext } from './TreeViewProvider';

export { RichTreeViewItems } from './components/RichTreeViewItems';
export type {
  RichTreeViewItemsSlots,
  RichTreeViewItemsSlotProps,
} from './components/RichTreeViewItems';

export {
  unstable_resetCleanupTracking,
  useInstanceEventHandler,
} from './hooks/useInstanceEventHandler';

export type {
  TreeViewPlugin,
  TreeViewPluginSignature,
  ConvertPluginsIntoSignatures,
  MergeSignaturesProperty,
  TreeViewPublicAPI,
  TreeViewState,
  TreeViewItemMeta,
  TreeViewInstance,
  TreeViewItemPlugin,
  TreeViewUsedStore,
} from './models';

// Core plugins
export type { TreeViewCorePluginParameters } from './corePlugins';

// Plugins
export { useTreeViewExpansion, expansionSelectors } from './plugins/useTreeViewExpansion';
export type {
  UseTreeViewExpansionSignature,
  UseTreeViewExpansionParameters,
} from './plugins/useTreeViewExpansion';
export { useTreeViewSelection, selectionSelectors } from './plugins/useTreeViewSelection';
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
export {
  useTreeViewItems,
  buildSiblingIndexes,
  itemsSelectors,
  TREE_VIEW_ROOT_PARENT_ID,
} from './plugins/useTreeViewItems';
export type {
  UseTreeViewItemsSignature,
  UseTreeViewItemsParameters,
  UseTreeViewItemsState,
} from './plugins/useTreeViewItems';
export { useTreeViewLabel, labelSelectors } from './plugins/useTreeViewLabel';
export type {
  UseTreeViewLabelSignature,
  UseTreeViewLabelParameters,
} from './plugins/useTreeViewLabel';
export type {
  UseTreeViewLazyLoadingSignature,
  UseTreeViewLazyLoadingParameters,
  UseTreeViewLazyLoadingInstance,
} from './plugins/useTreeViewLazyLoading';
export { lazyLoadingSelectors } from './plugins/useTreeViewLazyLoading';
export { useTreeViewJSXItems } from './plugins/useTreeViewJSXItems';
export type {
  UseTreeViewJSXItemsSignature,
  UseTreeViewJSXItemsParameters,
} from './plugins/useTreeViewJSXItems';

export { isTargetInDescendants } from './utils/tree';

export type {
  TreeViewClasses,
  TreeViewSlots,
  TreeViewSlotProps,
} from './TreeViewProvider/TreeViewStyleContext';
