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
  TreeViewItemMeta,
  TreeViewItemPlugin,
  TreeViewUsedStore,
  TreeViewUsedInstance,
  TreeViewUsedParamsWithDefaults,
} from './models';

// Plugins
export { expansionSelectors } from './plugins/useTreeViewExpansion';
export { selectionSelectors } from './plugins/useTreeViewSelection';
export {
  buildSiblingIndexes,
  itemsSelectors,
  TREE_VIEW_ROOT_PARENT_ID,
} from './plugins/useTreeViewItems';
export { labelSelectors } from './plugins/useTreeViewLabel';
export type { DataSource } from './plugins/useTreeViewLazyLoading';
export { lazyLoadingSelectors } from './plugins/useTreeViewLazyLoading';

export { isTargetInDescendants } from './utils/tree';

export type {
  TreeViewClasses,
  TreeViewSlots,
  TreeViewSlotProps,
} from './TreeViewProvider/TreeViewStyleContext';

export type { TreeViewParametersToStateMapper } from './MinimalTreeViewStore';
export {
  ExtendableRichTreeViewStore,
  TREE_VIEW_LAZY_LOADED_ITEMS_INITIAL_STATE,
} from './RichTreeViewStore';
export type {
  RichTreeViewState,
  RichTreeViewParameters,
  RichTreeViewPublicAPI,
} from './RichTreeViewStore';
export { TreeViewItemDepthContext } from './TreeViewItemDepthContext';
