import {
  TreeViewInstance,
  UseTreeViewItemsSignature,
  UseTreeViewItemsState,
  buildSiblingIndexes,
  TREE_VIEW_ROOT_PARENT_ID,
} from '@mui/x-tree-view/internals';
import { TreeViewItemId, TreeViewItemsReorderingAction } from '@mui/x-tree-view/models';
import {
  TreeViewItemItemReorderingValidActions,
  TreeViewItemReorderPosition,
} from './useTreeViewItemsReordering.types';

/**
 * Checks if the item with the id itemIdB is an ancestor of the item with the id itemIdA.
 */
export const isAncestor = (
  instance: TreeViewInstance<[UseTreeViewItemsSignature]>,
  itemIdA: string,
  itemIdB: string,
): boolean => {
  const itemMetaA = instance.getItemMeta(itemIdA);
  if (itemMetaA.parentId === itemIdB) {
    return true;
  }

  if (itemMetaA.parentId == null) {
    return false;
  }

  return isAncestor(instance, itemMetaA.parentId, itemIdB);
};

/**
 * Transforms a CSS string `itemChildrenIndentation` into a number representing the indentation in number.
 * @param {string | null} itemChildrenIndentation The indentation as passed to the `itemChildrenIndentation` prop.
 * @param {HTMLElement} contentElement The DOM element to which the indentation will be applied.
 */
const parseItemChildrenIndentation = (
  itemChildrenIndentation: string | number,
  contentElement: HTMLElement,
) => {
  if (typeof itemChildrenIndentation === 'number') {
    return itemChildrenIndentation;
  }

  const pixelExec = /^(\d.+)(px)$/.exec(itemChildrenIndentation);
  if (pixelExec) {
    return parseFloat(pixelExec[1]);
  }

  // If the format is neither `px` nor a number, we need to measure the indentation using an actual DOM element.
  const tempElement = document.createElement('div');
  tempElement.style.width = itemChildrenIndentation;
  tempElement.style.position = 'absolute';
  contentElement.appendChild(tempElement);
  const value = tempElement.offsetWidth;
  contentElement.removeChild(tempElement);

  return value;
};

interface GetNewPositionParams {
  itemChildrenIndentation: string | number;
  validActions: TreeViewItemItemReorderingValidActions;
  targetHeight: number;
  targetDepth: number;
  cursorY: number;
  cursorX: number;
  contentElement: HTMLDivElement;
}

export const chooseActionToApply = ({
  itemChildrenIndentation,
  validActions,
  targetHeight,
  targetDepth,
  cursorX,
  cursorY,
  contentElement,
}: GetNewPositionParams) => {
  let action: TreeViewItemsReorderingAction | null;

  const itemChildrenIndentationPx = parseItemChildrenIndentation(
    itemChildrenIndentation,
    contentElement,
  );
  // If we can move the item to the parent of the target, then we allocate the left offset to this action
  // Support moving to other ancestors
  if (validActions['move-to-parent'] && cursorX < itemChildrenIndentationPx * targetDepth) {
    action = 'move-to-parent';
  }

  // If we can move the item inside the target, then we have the following split:
  // - the upper quarter of the target moves it above
  // - the lower quarter of the target moves it below
  // - the inner half makes it a child
  else if (validActions['make-child']) {
    if (validActions['reorder-above'] && cursorY < (1 / 4) * targetHeight) {
      action = 'reorder-above';
    } else if (validActions['reorder-below'] && cursorY > (3 / 4) * targetHeight) {
      action = 'reorder-below';
    } else {
      action = 'make-child';
    }
  }
  // If we can't move the item inside the target, then we have the following split:
  // - the upper half of the target moves it above
  // - the lower half of the target moves it below
  else {
    // eslint-disable-next-line no-lonely-if
    if (validActions['reorder-above'] && cursorY < (1 / 2) * targetHeight) {
      action = 'reorder-above';
    } else if (validActions['reorder-below'] && cursorY >= (1 / 2) * targetHeight) {
      action = 'reorder-below';
    } else {
      action = null;
    }
  }

  return action;
};

export const moveItemInTree = <R extends { children?: R[] }>({
  itemToMoveId,
  oldPosition,
  newPosition,
  prevState,
}: {
  itemToMoveId: TreeViewItemId;
  oldPosition: TreeViewItemReorderPosition;
  newPosition: TreeViewItemReorderPosition;
  prevState: UseTreeViewItemsState<R>['items'];
}): UseTreeViewItemsState<R>['items'] => {
  const itemToMoveMeta = prevState.itemMetaMap[itemToMoveId];

  const oldParentId = oldPosition.parentId ?? TREE_VIEW_ROOT_PARENT_ID;
  const newParentId = newPosition.parentId ?? TREE_VIEW_ROOT_PARENT_ID;

  // 1. Update the `itemOrderedChildrenIds`.
  const itemOrderedChildrenIds = { ...prevState.itemOrderedChildrenIds };
  if (oldParentId === newParentId) {
    const updatedChildren = [...itemOrderedChildrenIds[oldParentId]];
    updatedChildren.splice(oldPosition.index, 1);
    updatedChildren.splice(newPosition.index, 0, itemToMoveId);
    itemOrderedChildrenIds[itemToMoveMeta.parentId ?? TREE_VIEW_ROOT_PARENT_ID] = updatedChildren;
  } else {
    const updatedOldParentChildren = [...itemOrderedChildrenIds[oldParentId]];
    updatedOldParentChildren.splice(oldPosition.index, 1);
    itemOrderedChildrenIds[oldParentId] = updatedOldParentChildren;

    const updatedNewParentChildren = [...(itemOrderedChildrenIds[newParentId] ?? [])];
    updatedNewParentChildren.splice(newPosition.index, 0, itemToMoveId);
    itemOrderedChildrenIds[newParentId] = updatedNewParentChildren;
  }

  // 2. Update the `itemChildrenIndexes`
  const itemChildrenIndexes = { ...prevState.itemChildrenIndexes };
  itemChildrenIndexes[oldParentId] = buildSiblingIndexes(itemOrderedChildrenIds[oldParentId]);
  if (newParentId !== oldParentId) {
    itemChildrenIndexes[newParentId] = buildSiblingIndexes(itemOrderedChildrenIds[newParentId]);
  }

  // 3. Update the `itemMetaMap`
  const itemMetaMap = { ...prevState.itemMetaMap };

  // 3.1 Update the `expandable` property of the old and the new parent
  if (oldParentId !== TREE_VIEW_ROOT_PARENT_ID && oldParentId !== newParentId) {
    itemMetaMap[oldParentId].expandable = itemOrderedChildrenIds[oldParentId].length > 0;
  }
  if (newParentId !== TREE_VIEW_ROOT_PARENT_ID && newParentId !== oldParentId) {
    itemMetaMap[newParentId].expandable = itemOrderedChildrenIds[newParentId].length > 0;
  }

  // 3.2 Update the `parentId` and `depth` properties of the item to move
  // The depth is always defined because drag&drop is only usable with Rich Tree View components.
  const itemToMoveDepth = newPosition.parentId == null ? 0 : itemMetaMap[newParentId].depth! + 1;
  itemMetaMap[itemToMoveId] = {
    ...itemToMoveMeta,
    parentId: newPosition.parentId,
    depth: itemToMoveDepth,
  };

  // 3.3 Update the depth of all the children of the item to move
  const updateItemDepth = (itemId: string, depth: number) => {
    itemMetaMap[itemId] = { ...itemMetaMap[itemId], depth };
    itemOrderedChildrenIds[itemId]?.forEach((childId) => updateItemDepth(childId, depth + 1));
  };
  itemOrderedChildrenIds[itemToMoveId]?.forEach((childId) =>
    updateItemDepth(childId, itemToMoveDepth + 1),
  );

  return {
    ...prevState,
    itemOrderedChildrenIds,
    itemChildrenIndexes,
    itemMetaMap,
  };
};
