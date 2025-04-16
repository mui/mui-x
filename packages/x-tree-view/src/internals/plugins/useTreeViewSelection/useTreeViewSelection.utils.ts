import { TreeViewItemId, TreeViewSelectionPropagation } from '../../../models';
import { TreeViewUsedStore } from '../../models';
import { UseTreeViewSelectionSignature } from './useTreeViewSelection.types';
import { selectorIsItemSelected } from './useTreeViewSelection.selectors';
import {
  selectorItemOrderedChildrenIds,
  selectorItemParentId,
} from '../useTreeViewItems/useTreeViewItems.selectors';

export const getLookupFromArray = (array: string[]) => {
  const lookup: { [itemId: string]: true } = {};
  array.forEach((itemId) => {
    lookup[itemId] = true;
  });
  return lookup;
};

export const getAddedAndRemovedItems = ({
  store,
  oldModel,
  newModel,
}: {
  store: TreeViewUsedStore<UseTreeViewSelectionSignature>;
  oldModel: TreeViewItemId[];
  newModel: TreeViewItemId[];
}) => {
  const newModelMap = new Map<TreeViewItemId, true>();
  newModel.forEach((id) => {
    newModelMap.set(id, true);
  });

  return {
    added: newModel.filter((itemId) => !selectorIsItemSelected(store.value, itemId)),
    removed: oldModel.filter((itemId) => !newModelMap.has(itemId)),
  };
};

export const propagateSelection = ({
  store,
  selectionPropagation,
  newModel,
  oldModel,
  additionalItemsToPropagate,
}: {
  store: TreeViewUsedStore<UseTreeViewSelectionSignature>;
  selectionPropagation: TreeViewSelectionPropagation;
  newModel: TreeViewItemId[];
  oldModel: TreeViewItemId[];
  additionalItemsToPropagate?: TreeViewItemId[];
}): string[] => {
  if (!selectionPropagation.descendants && !selectionPropagation.parents) {
    return newModel;
  }

  let shouldRegenerateModel = false;
  const newModelLookup = getLookupFromArray(newModel);

  const changes = getAddedAndRemovedItems({
    store,
    newModel,
    oldModel,
  });

  additionalItemsToPropagate?.forEach((itemId) => {
    if (newModelLookup[itemId]) {
      if (!changes.added.includes(itemId)) {
        changes.added.push(itemId);
      }
    } else if (!changes.removed.includes(itemId)) {
      changes.removed.push(itemId);
    }
  });

  changes.added.forEach((addedItemId) => {
    if (selectionPropagation.descendants) {
      const selectDescendants = (itemId: TreeViewItemId) => {
        if (itemId !== addedItemId) {
          shouldRegenerateModel = true;
          newModelLookup[itemId] = true;
        }

        selectorItemOrderedChildrenIds(store.value, itemId).forEach(selectDescendants);
      };

      selectDescendants(addedItemId);
    }

    if (selectionPropagation.parents) {
      const checkAllDescendantsSelected = (itemId: TreeViewItemId): boolean => {
        if (!newModelLookup[itemId]) {
          return false;
        }

        const children = selectorItemOrderedChildrenIds(store.value, itemId);
        return children.every(checkAllDescendantsSelected);
      };

      const selectParents = (itemId: TreeViewItemId) => {
        const parentId = selectorItemParentId(store.value, itemId);
        if (parentId == null) {
          return;
        }

        const siblings = selectorItemOrderedChildrenIds(store.value, parentId);
        if (siblings.every(checkAllDescendantsSelected)) {
          shouldRegenerateModel = true;
          newModelLookup[parentId] = true;
          selectParents(parentId);
        }
      };
      selectParents(addedItemId);
    }
  });

  changes.removed.forEach((removedItemId) => {
    if (selectionPropagation.parents) {
      let parentId = selectorItemParentId(store.value, removedItemId);
      while (parentId != null) {
        if (newModelLookup[parentId]) {
          shouldRegenerateModel = true;
          delete newModelLookup[parentId];
        }

        parentId = selectorItemParentId(store.value, parentId);
      }
    }

    if (selectionPropagation.descendants) {
      const deSelectDescendants = (itemId: TreeViewItemId) => {
        if (itemId !== removedItemId) {
          shouldRegenerateModel = true;
          delete newModelLookup[itemId];
        }

        selectorItemOrderedChildrenIds(store.value, itemId).forEach(deSelectDescendants);
      };

      deSelectDescendants(removedItemId);
    }
  });

  return shouldRegenerateModel ? Object.keys(newModelLookup) : newModel;
};
