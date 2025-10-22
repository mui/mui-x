import {
  ExtandableRichTreeViewStore,
  TREE_VIEW_LAZY_LOADED_ITEMS_INITIAL_STATE,
  TreeViewParametersToStateMapper,
} from '@mui/x-tree-view/internals';
import { TreeViewValidItem } from '@mui/x-tree-view/models';
import { RichTreeViewProParameters, RichTreeViewProState } from './RichTreeViewProStore.types';
import { TreeViewLazyLoadingManager } from './TreeViewLazyLoadingManager';

const deriveStateFromParameters = (_parameters: RichTreeViewProParameters<any, any>) => ({
  lazyLoadedItems: TREE_VIEW_LAZY_LOADED_ITEMS_INITIAL_STATE,
});

const mapper: TreeViewParametersToStateMapper<
  any,
  any,
  RichTreeViewProState<any, any>,
  RichTreeViewProParameters<any, any>
> = {
  getInitialState: (schedulerInitialState, parameters) => ({
    ...ExtandableRichTreeViewStore.rawMapper.getInitialState(schedulerInitialState, parameters),
    ...deriveStateFromParameters(parameters),
  }),
  updateStateFromParameters: (newSharedState, parameters, updateModel) => {
    const newState: Partial<RichTreeViewProState<any, any>> = {
      ...ExtandableRichTreeViewStore.rawMapper.updateStateFromParameters(
        newSharedState,
        parameters,
        updateModel,
      ),
      ...deriveStateFromParameters(parameters),
    };

    return newState;
  },
};

export class RichTreeViewProStore<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> extends ExtandableRichTreeViewStore<
  R,
  Multiple,
  RichTreeViewProState<R, Multiple>,
  RichTreeViewProParameters<R, Multiple>
> {
  private lazyLoadingManager = new TreeViewLazyLoadingManager(this);

  public constructor(parameters: RichTreeViewProParameters<R, Multiple>, isRtl: boolean) {
    super(parameters, 'RichTreeView', isRtl, mapper);
  }

  /**
   * Method used for fetching multiple items concurrently.
   * Only relevant for lazy-loaded tree views.
   *
   * @param {TreeViewItemId[]} parentIds The ids of the items to fetch the children of.
   * @returns {Promise<void>} The promise resolved when the items are fetched.
   */
  protected fetchItems = this.lazyLoadingManager.fetchItems;

  /**
   * Method used for fetching an item's children.
   * Only relevant for lazy-loaded tree views.
   *
   * @param {object} parameters The parameters of the method.
   * @param {TreeViewItemId} parameters.itemId The The id of the item to fetch the children of.
   * @param {boolean} [parameters.forceRefresh] Whether to force a refresh of the children when the cache already contains some data.
   * @returns {Promise<void>} The promise resolved when the items are fetched.
   */
  protected fetchItemChildren = this.lazyLoadingManager.fetchItemChildren;

  /**
   * Method used for updating an item's children.
   * Only relevant for lazy-loaded tree views.
   *
   * @param {TreeViewItemId} itemId The The id of the item to update the children of.
   * @returns {Promise<void>} The promise resolved when the items are fetched.
   */
  protected updateItemChildren = this.lazyLoadingManager.updateItemChildren;
}
