import * as React from 'react';
import {
  TreeViewPlugin,
  selectorItemIndex,
  selectorItemMeta,
  selectorItemOrderedChildrenIds,
} from '@mui/x-tree-view/internals';
import { warnOnce } from '@mui/x-internals/warning';
import { TreeViewItemsReorderingAction } from '@mui/x-tree-view/models';
import {
  TreeViewItemItemReorderingValidActions,
  TreeViewItemReorderPosition,
  UseTreeViewItemsReorderingInstance,
  UseTreeViewItemsReorderingSignature,
} from './useTreeViewItemsReordering.types';
import {
  chooseActionToApply,
  isAncestor,
  moveItemInTree,
} from './useTreeViewItemsReordering.utils';
import { useTreeViewItemsReorderingItemPlugin } from './useTreeViewItemsReordering.itemPlugin';
import { selectorItemsReordering } from './useTreeViewItemsReordering.selectors';

export const useTreeViewItemsReordering: TreeViewPlugin<UseTreeViewItemsReorderingSignature> = ({
  params,
  store,
}) => {
  const canItemBeDragged = React.useCallback(
    (itemId: string) => {
      if (!params.itemsReordering) {
        return false;
      }

      const isItemReorderable = params.isItemReorderable;
      if (isItemReorderable) {
        return isItemReorderable(itemId);
      }

      return true;
    },
    [params.itemsReordering, params.isItemReorderable],
  );

  const getDroppingTargetValidActions = React.useCallback(
    (itemId: string) => {
      const itemsReordering = selectorItemsReordering(store.value);
      if (!itemsReordering) {
        throw new Error('There is no ongoing reordering.');
      }

      if (itemId === itemsReordering.draggedItemId) {
        return {};
      }

      const canMoveItemToNewPosition = params.canMoveItemToNewPosition;
      const targetItemMeta = selectorItemMeta(store.value, itemId)!;
      const targetItemIndex = selectorItemIndex(store.value, targetItemMeta.id);
      const draggedItemMeta = selectorItemMeta(store.value, itemsReordering.draggedItemId)!;
      const draggedItemIndex = selectorItemIndex(store.value, draggedItemMeta.id);

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
            itemId: itemsReordering.draggedItemId,
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
            targetItemMeta.parentId === draggedItemMeta.parentId &&
            targetItemIndex > draggedItemIndex
              ? targetItemIndex - 1
              : targetItemIndex,
        },
        'reorder-below': targetItemMeta.expandable
          ? null
          : {
              parentId: targetItemMeta.parentId,
              index:
                targetItemMeta.parentId === draggedItemMeta.parentId &&
                targetItemIndex > draggedItemIndex
                  ? targetItemIndex
                  : targetItemIndex + 1,
            },
        'move-to-parent':
          targetItemMeta.parentId == null
            ? null
            : {
                parentId: targetItemMeta.parentId,
                index: selectorItemOrderedChildrenIds(store.value, targetItemMeta.parentId).length,
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
    },
    [store, params.canMoveItemToNewPosition],
  );

  const startDraggingItem = React.useCallback(
    (itemId: string) => {
      store.update((prevState) => ({
        ...prevState,
        itemsReordering: {
          targetItemId: itemId,
          draggedItemId: itemId,
          action: null,
          newPosition: null,
        },
      }));
    },
    [store],
  );

  const stopDraggingItem = React.useCallback(
    (itemId: string) => {
      const itemsReordering = selectorItemsReordering(store.value);
      if (itemsReordering == null || itemsReordering.draggedItemId !== itemId) {
        return;
      }

      if (
        itemsReordering.draggedItemId === itemsReordering.targetItemId ||
        itemsReordering.action == null ||
        itemsReordering.newPosition == null
      ) {
        store.update((prevState) => ({ ...prevState, itemsReordering: null }));
        return;
      }

      const draggedItemMeta = selectorItemMeta(store.value, itemsReordering.draggedItemId)!;

      const oldPosition: TreeViewItemReorderPosition = {
        parentId: draggedItemMeta.parentId,
        index: selectorItemIndex(store.value, draggedItemMeta.id),
      };

      const newPosition = itemsReordering.newPosition;

      store.update((prevState) => ({
        ...prevState,
        itemsReordering: null,
        items: moveItemInTree({
          itemToMoveId: itemId,
          newPosition,
          oldPosition,
          prevState: prevState.items,
        }),
      }));

      const onItemPositionChange = params.onItemPositionChange;
      onItemPositionChange?.({
        itemId,
        newPosition,
        oldPosition,
      });
    },
    [store, params.onItemPositionChange],
  );

  const setDragTargetItem = React.useCallback<
    UseTreeViewItemsReorderingInstance['setDragTargetItem']
  >(
    ({ itemId, validActions, targetHeight, cursorY, cursorX, contentElement }) => {
      store.update((prevState) => {
        const prevSubState = prevState.itemsReordering;
        if (prevSubState == null || isAncestor(store, itemId, prevSubState.draggedItemId)) {
          return prevState;
        }
        const action = chooseActionToApply({
          itemChildrenIndentation: params.itemChildrenIndentation,
          validActions,
          targetHeight,
          targetDepth: prevState.items.itemMetaLookup[itemId].depth!,
          cursorY,
          cursorX,
          contentElement,
        });

        const newPosition = action == null ? null : validActions[action]!;

        if (
          prevSubState.targetItemId === itemId &&
          prevSubState.action === action &&
          prevSubState.newPosition?.parentId === newPosition?.parentId &&
          prevSubState.newPosition?.index === newPosition?.index
        ) {
          return prevState;
        }

        return {
          ...prevState,
          itemsReordering: {
            ...prevSubState,
            targetItemId: itemId,
            newPosition,
            action,
          },
        };
      });
    },
    [store, params.itemChildrenIndentation],
  );

  const pluginContextValue = React.useMemo(
    () => ({
      itemsReordering: {
        enabled: params.itemsReordering,
        isItemReorderable: params.isItemReorderable,
      },
    }),
    [params.itemsReordering, params.isItemReorderable],
  );

  return {
    instance: {
      canItemBeDragged,
      getDroppingTargetValidActions,
      startDraggingItem,
      stopDraggingItem,
      setDragTargetItem,
    },
    contextValue: pluginContextValue,
  };
};

useTreeViewItemsReordering.itemPlugin = useTreeViewItemsReorderingItemPlugin;

useTreeViewItemsReordering.getDefaultizedParams = ({ params, experimentalFeatures }) => {
  const canUseFeature = experimentalFeatures?.itemsReordering;

  if (process.env.NODE_ENV !== 'production') {
    if (params.itemsReordering && !canUseFeature) {
      warnOnce([
        'MUI X: The items reordering feature requires the `itemsReordering` experimental feature to be enabled.',
        'You can do it by passing `experimentalFeatures={{ itemsReordering: true }}` to the `<RichTreeViewPro />`component.',
        'Check the documentation for more details: https://mui.com/x/react-tree-view/rich-tree-view/items/',
      ]);
    }
  }

  return {
    ...params,
    itemsReordering: canUseFeature ? (params.itemsReordering ?? false) : false,
  };
};

useTreeViewItemsReordering.getInitialState = () => ({ itemsReordering: null });

useTreeViewItemsReordering.params = {
  itemsReordering: true,
  isItemReorderable: true,
  canMoveItemToNewPosition: true,
  onItemPositionChange: true,
};
