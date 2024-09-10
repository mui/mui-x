import {
  createSelector,
  TreeViewState,
  selectorItemMeta,
  UseTreeViewItemsSignature,
} from '@mui/x-tree-view/internals';
import {
  UseTreeViewItemsReorderingSignature,
  UseTreeViewItemsReorderingState,
} from './useTreeViewItemsReordering.types';

export const selectorItemsReordering = createSelector<
  [UseTreeViewItemsReorderingSignature],
  UseTreeViewItemsReorderingState['itemsReordering']
>((state) => state.itemsReordering);

export const selectorItemsReorderingForDraggedItem = (
  state: TreeViewState<[UseTreeViewItemsReorderingSignature, UseTreeViewItemsSignature]>,
  itemId: string,
) => {
  const itemsReordering = selectorItemsReordering(state);
  if (
    !itemsReordering ||
    itemsReordering.targetItemId !== itemId ||
    itemsReordering.action == null
  ) {
    return null;
  }

  const targetDepth =
    itemsReordering.newPosition?.parentId == null
      ? 0
      : // The depth is always defined because drag&drop is only usable with Rich Tree View components.
        selectorItemMeta(state, itemId).depth! + 1;

  return {
    newPosition: itemsReordering.newPosition,
    action: itemsReordering.action,
    targetDepth,
  };
};

export const selectorItemsReorderingIsValidTarget = (
  state: TreeViewState<[UseTreeViewItemsReorderingSignature]>,
  itemId: string,
) => {
  const itemsReordering = selectorItemsReordering(state);
  return itemsReordering && itemsReordering.draggedItemId !== itemId;
};
