import {
  ExtendableRichTreeViewStore,
  TREE_VIEW_LAZY_LOADED_ITEMS_INITIAL_STATE,
  TreeViewParametersToStateMapper,
} from '@mui/x-tree-view/internals';
import { TreeViewValidItem } from '@mui/x-tree-view/models';
import {
  RichTreeViewProParameters,
  RichTreeViewProPublicAPI,
  RichTreeViewProState,
} from './RichTreeViewProStore.types';
import { TreeViewLazyLoadingManager } from './TreeViewLazyLoadingManager';
import { TreeViewItemsReorderingManager } from './TreeViewItemsReorderingManager';

const DEFAULT_IS_ITEM_REORDERABLE_WHEN_ENABLED = () => true;
const DEFAULT_IS_ITEM_REORDERABLE_WHEN_DISABLED = () => false;

const deriveStateFromParameters = (parameters: RichTreeViewProParameters<any, any>) => ({
  lazyLoadedItems: parameters.dataSource ? TREE_VIEW_LAZY_LOADED_ITEMS_INITIAL_STATE : null,
  currentReorder: null,
  isItemReorderable: parameters.itemsReordering
    ? (parameters.isItemReorderable ?? DEFAULT_IS_ITEM_REORDERABLE_WHEN_ENABLED)
    : DEFAULT_IS_ITEM_REORDERABLE_WHEN_DISABLED,
});

const mapper: TreeViewParametersToStateMapper<
  any,
  any,
  RichTreeViewProState<any, any>,
  RichTreeViewProParameters<any, any>
> = {
  getInitialState: (schedulerInitialState, parameters) => ({
    ...ExtendableRichTreeViewStore.rawMapper.getInitialState(schedulerInitialState, parameters),
    ...deriveStateFromParameters(parameters),
  }),
  updateStateFromParameters: (newSharedState, parameters, updateModel) => {
    const newState: Partial<RichTreeViewProState<any, any>> = {
      ...ExtendableRichTreeViewStore.rawMapper.updateStateFromParameters(
        newSharedState,
        parameters,
        updateModel,
      ),
      ...deriveStateFromParameters(parameters),
    };

    return newState;
  },
  shouldIgnoreItemsStateUpdate: (parameters) => !!parameters.dataSource,
};

export class RichTreeViewProStore<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> extends ExtendableRichTreeViewStore<
  R,
  Multiple,
  RichTreeViewProState<R, Multiple>,
  RichTreeViewProParameters<R, Multiple>
> {
  private lazyLoadingManager = new TreeViewLazyLoadingManager(this);

  private itemsReorderingManager = new TreeViewItemsReorderingManager(this);

  private constructor(parameters: RichTreeViewProParameters<R, Multiple>, isRtl: boolean) {
    super(parameters, 'RichTreeViewPro', isRtl, mapper);
  }

  public buildPublicAPI(): RichTreeViewProPublicAPI<R, Multiple> {
    return {
      ...super.buildPublicAPI(),
      updateItemChildren: this.updateItemChildren,
    };
  }

  /**
   * Method used for fetching multiple items concurrently.
   * Only relevant for lazy-loaded tree views.
   *
   * @param {TreeViewItemId[]} parentIds The ids of the items to fetch the children of.
   * @returns {Promise<void>} The promise resolved when the items are fetched.
   */
  public fetchItems = this.lazyLoadingManager.fetchItems;

  /**
   * Method used for fetching an item's children.
   * Only relevant for lazy-loaded tree views.
   *
   * @param {object} parameters The parameters of the method.
   * @param {TreeViewItemId} parameters.itemId The The id of the item to fetch the children of.
   * @param {boolean} [parameters.forceRefresh] Whether to force a refresh of the children when the cache already contains some data.
   * @returns {Promise<void>} The promise resolved when the items are fetched.
   */
  public fetchItemChildren = this.lazyLoadingManager.fetchItemChildren;

  /**
   * Method used for updating an item's children.
   * Only relevant for lazy-loaded tree views.
   *
   * @param {TreeViewItemId} itemId The The id of the item to update the children of.
   * @returns {Promise<void>} The promise resolved when the items are fetched.
   */
  public updateItemChildren = this.lazyLoadingManager.updateItemChildren;

  /**
   * Check if a given item can be dragged.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} `true` if the item can be dragged, `false` otherwise.
   */
  protected canItemBeDragged = this.itemsReorderingManager.canItemBeDragged;

  /**
   * Get the valid reordering action if a given item is the target of the ongoing reordering.
   * @param {TreeViewItemId} itemId The id of the item to get the action of.
   * @returns {TreeViewItemItemReorderingValidActions} The valid actions for the item.
   */
  protected getDroppingTargetValidActions =
    this.itemsReorderingManager.getDroppingTargetValidActions;

  /**
   * Start a reordering for the given item.
   * @param {TreeViewItemId} itemId The id of the item to start the reordering for.
   */
  protected startDraggingItem = this.itemsReorderingManager.startDraggingItem;

  /**
   * Complete the reordering of a given item.
   * @param {TreeViewItemId} itemId The id of the item to complete the reordering for.
   */
  protected completeDraggingItem = this.itemsReorderingManager.completeDraggingItem;

  /**
   * Cancel the current reordering operation and reset the state.
   */
  protected cancelDraggingItem = this.itemsReorderingManager.cancelDraggingItem;

  /**
   * Set the new target item for the ongoing reordering.
   * The action will be determined based on the position of the cursor inside the target and the valid actions for this target.
   * @param {object} params The params describing the new target item.
   * @param {TreeViewItemId} params.itemId The id of the new target item.
   * @param {TreeViewItemItemReorderingValidActions} params.validActions The valid actions for the new target item.
   * @param {number} params.targetHeight The height of the target item.
   * @param {number} params.cursorY The Y coordinate of the mouse cursor.
   * @param {number} params.cursorX The X coordinate of the mouse cursor.
   * @param {HTMLDivElement} params.contentElement The DOM element rendered for the content slot.
   */
  protected setDragTargetItem = this.itemsReorderingManager.setDragTargetItem;
}
