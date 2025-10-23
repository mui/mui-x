import { TreeViewItemId, TreeViewItemsReorderingAction } from '@mui/x-tree-view/models';
import { itemsSelectors, labelSelectors } from '@mui/x-tree-view/internals';
import {
  TreeViewItemItemReorderingValidActions,
  TreeViewItemReorderPosition,
} from '../plugins/useTreeViewItemsReordering/useTreeViewItemsReordering.types';
import { RichTreeViewProStore } from './RichTreeViewProStore';
import { itemsReorderingSelectors } from '../plugins/useTreeViewItemsReordering';
import {
  chooseActionToApply,
  isAncestor,
  moveItemInTree,
} from '../plugins/useTreeViewItemsReordering/useTreeViewItemsReordering.utils';
import { useTreeViewItemsReorderingItemPlugin } from '../plugins/useTreeViewItemsReordering/useTreeViewItemsReordering.itemPlugin';

export class TreeViewItemsReorderingManager<Store extends RichTreeViewProStore<any, any>> {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
    store.itemPluginManager.register(useTreeViewItemsReorderingItemPlugin);
  }

  public canItemBeDragged = (itemId: string) => {
    if (!this.store.parameters.itemsReordering) {
      return false;
    }

    const isItemReorderable = this.store.parameters.isItemReorderable;
    if (isItemReorderable) {
      return isItemReorderable(itemId);
    }

    return true;
  };

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

  public cancelDraggingItem = () => {
    this.store.set('currentReorder', null);
  };

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
