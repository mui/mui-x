export { TreeViewProvider, useTreeViewContext } from './TreeViewProvider';

export { RichTreeViewItems } from './components/RichTreeViewItems';
export type {
  RichTreeViewItemsSlots,
  RichTreeViewItemsSlotProps,
} from './components/RichTreeViewItems';

export { useTreeViewRootProps } from './hooks/useTreeViewRootProps';
export { useTreeViewStore } from './hooks/useTreeViewStore';
export type { UseTreeViewStoreParameters } from './hooks/useTreeViewStore';

export type { TreeViewItemMeta, TreeViewItemPlugin } from './models';

// Plugins
export { expansionSelectors } from './plugins/expansion';
export { selectionSelectors } from './plugins/selection';
export { buildSiblingIndexes, itemsSelectors, TREE_VIEW_ROOT_PARENT_ID } from './plugins/items';
export { labelSelectors } from './plugins/labelEditing';
export type { DataSource } from './plugins/lazyLoading';
export { lazyLoadingSelectors } from './plugins/lazyLoading';

export { isTargetInDescendants } from './utils/tree';

export type {
  TreeViewClasses,
  TreeViewSlots,
  TreeViewSlotProps,
} from './TreeViewProvider/TreeViewStyleContext';

export { MinimalTreeViewStore } from './MinimalTreeViewStore';
export type { TreeViewParametersToStateMapper } from './MinimalTreeViewStore';

export {
  ExtendableRichTreeViewStore,
  TREE_VIEW_LAZY_LOADED_ITEMS_INITIAL_STATE,
} from './RichTreeViewStore';
export type {
  RichTreeViewState,
  RichTreeViewStoreParameters,
  RichTreeViewPublicAPI,
} from './RichTreeViewStore';

export { TreeViewItemDepthContext } from './TreeViewItemDepthContext';
