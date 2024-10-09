import { TreeViewItemId, TreeViewSelectionPropagation } from '../../../models';
import { TreeViewInstance } from '../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import { UseTreeViewSelectionSignature } from './useTreeViewSelection.types';

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

export const getLookupFromArray = (array: string[]) => {
  const lookup: { [itemId: string]: true } = {};
  array.forEach((itemId) => {
    lookup[itemId] = true;
  });
  return lookup;
};

export const getAddedAndRemovedItems = ({
  instance,
  oldModel,
  newModel,
}: {
  instance: TreeViewInstance<[UseTreeViewSelectionSignature]>;
  oldModel: TreeViewItemId[];
  newModel: TreeViewItemId[];
}) => {
  const newModelLookup = getLookupFromArray(newModel);
  const addedItems = newModel.filter((itemId) => !instance.isItemSelected(itemId));
  const removedItems = oldModel.filter((itemId) => !newModelLookup[itemId]);

  return {
    added: addedItems,
    removed: removedItems,
  };
};

export const propagateSelection = ({
  instance,
  selectionPropagation,
  newModel,
  oldModel,
}: {
  instance: TreeViewInstance<[UseTreeViewItemsSignature, UseTreeViewSelectionSignature]>;
  selectionPropagation: TreeViewSelectionPropagation;
  newModel: TreeViewItemId[];
  oldModel: TreeViewItemId[];
}): string[] => {
  if (!selectionPropagation.descendants && !selectionPropagation.parents) {
    return newModel;
  }

  let shouldRegenerateModel = false;
  const newModelLookup = getLookupFromArray(newModel);

  const changes = getAddedAndRemovedItems({
    instance,
    newModel,
    oldModel,
  });

  changes.added.forEach((addedItemId) => {
    if (selectionPropagation.descendants) {
      const selectDescendants = (itemId: TreeViewItemId) => {
        if (itemId !== addedItemId) {
          shouldRegenerateModel = true;
          newModelLookup[itemId] = true;
        }

        instance.getItemOrderedChildrenIds(itemId).forEach(selectDescendants);
      };

      selectDescendants(addedItemId);
    }

    if (selectionPropagation.parents) {
      const checkAllDescendantsSelected = (itemId: TreeViewItemId): boolean => {
        if (!newModelLookup[itemId]) {
          return false;
        }

        const children = instance.getItemOrderedChildrenIds(itemId);
        return children.every(checkAllDescendantsSelected);
      };

      const selectParents = (itemId: TreeViewItemId) => {
        const parentId = instance.getItemMeta(itemId).parentId;
        if (parentId == null) {
          return;
        }

        const siblings = instance.getItemOrderedChildrenIds(parentId);
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
      let parentId = instance.getItemMeta(removedItemId).parentId;
      while (parentId != null) {
        if (newModelLookup[parentId]) {
          shouldRegenerateModel = true;
          delete newModelLookup[parentId];
        }

        parentId = instance.getItemMeta(parentId).parentId;
      }
    }

    if (selectionPropagation.descendants) {
      const deSelectDescendants = (itemId: TreeViewItemId) => {
        if (itemId !== removedItemId) {
          shouldRegenerateModel = true;
          delete newModelLookup[itemId];
        }

        instance.getItemOrderedChildrenIds(itemId).forEach(deSelectDescendants);
      };

      deSelectDescendants(removedItemId);
    }
  });

  return shouldRegenerateModel ? Object.keys(newModelLookup) : newModel;
};
