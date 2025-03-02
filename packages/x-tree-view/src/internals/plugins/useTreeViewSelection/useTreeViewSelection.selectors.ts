import { TreeViewItemId } from '../../../models';
import { createSelector, TreeViewRootSelector } from '../../utils/selectors';
import { UseTreeViewSelectionSignature } from './useTreeViewSelection.types';

const selectorTreeViewSelectionState: TreeViewRootSelector<UseTreeViewSelectionSignature> = (
  state,
) => state.selection;

/**
 * Get the selected items.
 * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
 * @returns {TreeViewSelectionValue<boolean>} The selected items.
 */
export const selectorSelectionModel = createSelector(
  [selectorTreeViewSelectionState],
  (selectionState) => selectionState.selectedItems,
);

/**
 * Get the selected items as an array.
 * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
 * @returns {TreeViewItemId[]} The selected items as an array.
 */
export const selectorSelectionModelArray = createSelector(
  [selectorSelectionModel],
  (selectedItems) => {
    if (Array.isArray(selectedItems)) {
      return selectedItems;
    }

    if (selectedItems != null) {
      return [selectedItems];
    }

    return [];
  },
);

/**
 * Get the selected items as a map.
 * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
 * @returns {Map<TreeViewItemId, true>} The selected items as a Map.
 */
const selectorSelectionModelMap = createSelector([selectorSelectionModelArray], (selectedItems) => {
  const selectedItemsMap = new Map<TreeViewItemId, true>();
  selectedItems.forEach((id) => {
    selectedItemsMap.set(id, true);
  });
  return selectedItemsMap;
});

/**
 * Check if an item is selected.
 * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
 * @returns {boolean} `true` if the item is selected, `false` otherwise.
 */
export const selectorIsItemSelected = createSelector(
  [selectorSelectionModelMap, (_, itemId: string) => itemId],
  (selectedItemsMap, itemId) => selectedItemsMap.has(itemId),
);
