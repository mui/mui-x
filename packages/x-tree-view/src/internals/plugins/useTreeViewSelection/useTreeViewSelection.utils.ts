import { TreeViewItemId } from '../../../models';

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
  const lookup: { [itemId: string]: boolean } = {};
  array.forEach((itemId) => {
    lookup[itemId] = true;
  });
  return lookup;
};

export const getSelectedItemsMap = (selectedItems: string | string[] | null) => {
  const selectedItemsMap = new Map<TreeViewItemId, true>();
  convertSelectedItemsToArray(selectedItems).forEach((id) => {
    selectedItemsMap.set(id, true);
  });
  return selectedItemsMap;
};
