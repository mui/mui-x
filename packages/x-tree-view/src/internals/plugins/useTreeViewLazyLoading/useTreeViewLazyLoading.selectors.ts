import { TreeViewAnyPluginSignature, TreeViewState } from '../../models';
import {
  createSelector,
  TreeViewRootSelector,
  TreeViewRootSelectorForOptionalPlugin,
} from '../../utils/selectors';
import { UseTreeViewLazyLoadingSignature } from './useTreeViewLazyLoading.types';

export type Temp<TSignature extends TreeViewAnyPluginSignature> = <
  TSignatures extends [],
  TOptionalSignatures extends [TSignature],
>(
  state: TreeViewState<TSignatures, TOptionalSignatures>,
) => TSignature['state'][keyof TSignature['state']];

const selectorLazyLoading: TreeViewRootSelector<UseTreeViewLazyLoadingSignature> = (state) =>
  state.lazyLoading;

const selectorLazyLoadingOptional: TreeViewRootSelectorForOptionalPlugin<
  UseTreeViewLazyLoadingSignature
> = (state) => state.lazyLoading;

export const selectorDataSourceState = createSelector(
  [selectorLazyLoading],
  (lazyLoading) => lazyLoading.dataSource,
);

/**
 * Check if lazy loading is enabled.
 * @param {TreeViewState<[UseTreeViewLazyLoadingSignature]>} state The state of the tree view.
 * @returns {boolean} True if lazy loading is enabled, false if it isn't.
 */
export const selectorIsLazyLoadingEnabled = createSelector(
  [selectorLazyLoadingOptional],
  (lazyLoading) => !!lazyLoading?.enabled,
);

/**
 * Get the loading state for a tree item.
 * @param {TreeViewState<[UseTreeViewLazyLoadingSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to get the loading state of.
 * @returns {boolean} The loading state for the Tree Item.
 */
export const selectorIsItemLoading = createSelector(
  [selectorDataSourceState, (_, itemId: string) => itemId],
  (dataSourceState, itemId) => dataSourceState.loading[itemId] || false,
);

/**
 * Get the error for a tree item.
 * @param {TreeViewState<[UseTreeViewLazyLoadingSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to get the error for.
 * @returns {boolean} The error for the Tree Item.
 */
export const selectorGetTreeItemError = createSelector(
  [selectorDataSourceState, (_, itemId: string) => itemId],
  (dataSourceState, itemId) => dataSourceState.errors[itemId] || null,
);
