import { TreeViewItemId, TreeViewSelectionPropagation } from '../../../models';
import { TreeViewUsedStore } from '../../models';
import { selectorItemMeta, selectorItemOrderedChildrenIds } from '../useTreeViewItems';
import { UseTreeViewSelectionSignature } from './useTreeViewSelection.types';
import { selectorIsItemSelected } from './useTreeViewSelection.selectors';

/**
 * Transform the `selectedItems` model to be an array if it was a string or null.
 * @param {string[] | string | null} model The raw model.
 * @returns {string[]} The converted model.
 */
export const convertSelectedItemsToArray = (model: string[] | string | null): string[] => {
  if (Array.isArray(model)) {
    return model;
  }

  if (model != null) {
    return [model];
  }

  return [];
};

export const getSelectedItemsMap = (selectedItems: string | string[] | null) => {
  const selectedItemsMap = new Map<TreeViewItemId, true>();
  convertSelectedItemsToArray(selectedItems).forEach((id) => {
    selectedItemsMap.set(id, true);
  });
  return selectedItemsMap;
};

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
  const newModelLookup = getSelectedItemsMap(newModel);

  return {
    added: newModel.filter((itemId) => !selectorIsItemSelected(store.value, itemId)),
    removed: oldModel.filter((itemId) => !newModelLookup.has(itemId)),
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
        const parentId = selectorItemMeta(store.value, itemId).parentId;
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
      let parentId = selectorItemMeta(store.value, removedItemId).parentId;
      while (parentId != null) {
        if (newModelLookup[parentId]) {
          shouldRegenerateModel = true;
          delete newModelLookup[parentId];
        }

        parentId = selectorItemMeta(store.value, parentId).parentId;
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
