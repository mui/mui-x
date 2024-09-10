import { createSelector, TreeViewState } from '@mui/x-tree-view/internals';
import {
  UseTreeViewItemsReorderingSignature,
  UseTreeViewItemsReorderingState,
} from './useTreeViewItemsReordering.types';

export const selectorItemsReordering = createSelector<
  [UseTreeViewItemsReorderingSignature],
  UseTreeViewItemsReorderingState['itemsReordering']
>((state) => state.itemsReordering);

export const selectorItemsReorderingForDraggedItem = (
  state: TreeViewState<[UseTreeViewItemsReorderingSignature]>,
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

  return {
    newPosition: itemsReordering.newPosition,
    action: itemsReordering.action,
  };
};

export const selectorItemsReorderingIsValidTarget = (
  state: TreeViewState<[UseTreeViewItemsReorderingSignature]>,
  itemId: string,
) => {
  const itemsReordering = selectorItemsReordering(state);
  return itemsReordering && itemsReordering.draggedItemId !== itemId;
};
