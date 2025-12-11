import { TreeViewItemId, TreeViewItemsReorderingAction } from '@mui/x-tree-view/models';
import { itemsSelectors, labelSelectors } from '@mui/x-tree-view/internals';
import { TreeViewItemItemReorderingValidActions, TreeViewItemReorderPosition } from './types';
import { RichTreeViewProStore } from '../../RichTreeViewProStore/RichTreeViewProStore';
import { itemsReorderingSelectors } from './selectors';
import { chooseActionToApply, isAncestor, moveItemInTree } from './utils';
import { useTreeViewItemsReorderingItemPlugin } from './itemPlugin';

export class TreeViewItemsReorderingPlugin {
  private store: RichTreeViewProStore<any, any>;

  constructor(store: RichTreeViewProStore<any, any>) {
    this.store = store;
    store.itemPluginManager.register(useTreeViewItemsReorderingItemPlugin, null);
  }

  /**
   * Get the valid reordering action if a given item is the target of the ongoing reordering.
   * @param {TreeViewItemId} itemId The id of the item to get the action of.
   * @returns {TreeViewItemItemReorderingValidActions} The valid actions for the item.
   */
  public getDroppingTargetValidActions = (itemId: string) => {
    const currentReorder = itemsReorderingSelectors.currentReorder(this.store.state);
    if (!currentReorder) {
      throw new Error('There is no ongoing reordering.');
    }

    if (itemId === currentReorder.draggedItemId) {
      return {};
    }

    const canMoveItemToNewPosition = this.store.parameters.canMoveItemToNewPosition;
    const targetItemMeta = itemsSelectors.itemMeta(this.store.state, itemId)!;
    const targetItemIndex = itemsSelectors.itemIndex(this.store.state, targetItemMeta.id);
    const draggedItemMeta = itemsSelectors.itemMeta(
      this.store.state,
      currentReorder.draggedItemId,
    )!;
    const draggedItemIndex = itemsSelectors.itemIndex(this.store.state, draggedItemMeta.id);
    const isTargetLastSibling =
      targetItemIndex ===
      itemsSelectors.itemOrderedChildrenIds(this.store.state, targetItemMeta.parentId).length - 1;

    const oldPosition: TreeViewItemReorderPosition = {
      parentId: draggedItemMeta.parentId,
      index: draggedItemIndex,
    };

    const checkIfPositionIsValid = (positionAfterAction: TreeViewItemReorderPosition) => {
      let isValid: boolean;
      // If the new position is equal to the old one, we don't want to show any dropping UI.
      if (
        positionAfterAction.parentId === oldPosition.parentId &&
        positionAfterAction.index === oldPosition.index
      ) {
        isValid = false;
      } else if (canMoveItemToNewPosition) {
        isValid = canMoveItemToNewPosition({
          itemId: currentReorder.draggedItemId,
          oldPosition,
          newPosition: positionAfterAction,
        });
      } else {
        isValid = true;
      }

      return isValid;
    };

    const positionsAfterAction: Record<
      TreeViewItemsReorderingAction,
      TreeViewItemReorderPosition | null
    > = {
      'make-child': { parentId: targetItemMeta.id, index: 0 },
      'reorder-above': {
        parentId: targetItemMeta.parentId,
        index:
          targetItemMeta.parentId === draggedItemMeta.parentId && targetItemIndex > draggedItemIndex
            ? targetItemIndex - 1
            : targetItemIndex,
      },
      'reorder-below':
        !targetItemMeta.expandable || isTargetLastSibling
          ? {
              parentId: targetItemMeta.parentId,
              index:
                targetItemMeta.parentId === draggedItemMeta.parentId &&
                targetItemIndex > draggedItemIndex
                  ? targetItemIndex
                  : targetItemIndex + 1,
            }
          : null,
      'move-to-parent':
        targetItemMeta.parentId == null
          ? null
          : {
              parentId: targetItemMeta.parentId,
              index: itemsSelectors.itemOrderedChildrenIds(
                this.store.state,
                targetItemMeta.parentId,
              ).length,
            },
    };

    const validActions: TreeViewItemItemReorderingValidActions = {};
    Object.keys(positionsAfterAction).forEach((action) => {
      const positionAfterAction = positionsAfterAction[action as TreeViewItemsReorderingAction];
      if (positionAfterAction != null && checkIfPositionIsValid(positionAfterAction)) {
        validActions[action as TreeViewItemsReorderingAction] = positionAfterAction;
      }
    });

    return validActions;
  };

  /**
   * Start a reordering for the given item.
   * @param {TreeViewItemId} itemId The id of the item to start the reordering for.
   */
  public startDraggingItem = (itemId: string) => {
    const isItemBeingEdited = labelSelectors.isItemBeingEdited(this.store.state, itemId);
    if (isItemBeingEdited) {
      return;
    }

    this.store.set('currentReorder', {
      targetItemId: itemId,
      draggedItemId: itemId,
      action: null,
      newPosition: null,
    });
  };

  /**
   * Cancel the current reordering operation and reset the state.
   */
  public cancelDraggingItem = () => {
    this.store.set('currentReorder', null);
  };

  /**
   * Complete the reordering of a given item.
   * @param {TreeViewItemId} itemId The id of the item to complete the reordering for.
   */
  public completeDraggingItem = (itemId: string) => {
    const currentReorder = itemsReorderingSelectors.currentReorder(this.store.state);
    if (currentReorder == null || currentReorder.draggedItemId !== itemId) {
      return;
    }

    if (
      currentReorder.draggedItemId === currentReorder.targetItemId ||
      currentReorder.action == null ||
      currentReorder.newPosition == null
    ) {
      this.cancelDraggingItem();
      return;
    }

    const draggedItemMeta = itemsSelectors.itemMeta(
      this.store.state,
      currentReorder.draggedItemId,
    )!;

    const oldPosition: TreeViewItemReorderPosition = {
      parentId: draggedItemMeta.parentId,
      index: itemsSelectors.itemIndex(this.store.state, draggedItemMeta.id),
    };

    const newPosition = currentReorder.newPosition;

    this.store.update({
      currentReorder: null,
      ...moveItemInTree({
        itemToMoveId: itemId,
        newPosition,
        oldPosition,
        prevState: this.store.state,
      }),
    });

    const onItemPositionChange = this.store.parameters.onItemPositionChange;
    onItemPositionChange?.({
      itemId,
      newPosition,
      oldPosition,
    });
  };

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
  public setDragTargetItem = ({
    itemId,
    validActions,
    targetHeight,
    cursorY,
    cursorX,
    contentElement,
  }: {
    itemId: TreeViewItemId;
    validActions: TreeViewItemItemReorderingValidActions;
    targetHeight: number;
    cursorY: number;
    cursorX: number;
    contentElement: HTMLDivElement;
  }) => {
    const prevItemReorder = this.store.state.currentReorder;
    if (prevItemReorder == null || isAncestor(this.store, itemId, prevItemReorder.draggedItemId)) {
      return;
    }

    const action = chooseActionToApply({
      itemChildrenIndentation: this.store.state.itemChildrenIndentation,
      validActions,
      targetHeight,
      targetDepth: this.store.state.itemMetaLookup[itemId].depth!,
      cursorY,
      cursorX,
      contentElement,
    });

    const newPosition = action == null ? null : validActions[action]!;

    if (
      prevItemReorder.targetItemId === itemId &&
      prevItemReorder.action === action &&
      prevItemReorder.newPosition?.parentId === newPosition?.parentId &&
      prevItemReorder.newPosition?.index === newPosition?.index
    ) {
      return;
    }

    this.store.set('currentReorder', {
      ...prevItemReorder,
      targetItemId: itemId,
      newPosition,
      action,
    });
  };
}
