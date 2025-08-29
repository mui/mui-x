import { createSelector, createSelectorMemoized } from '@base-ui-components/utils/store';
import { TreeViewItemId } from '../../../models';
import { TreeViewState } from '../../models';
import { itemsSelectors } from '../useTreeViewItems/useTreeViewItems.selectors';
import { UseTreeViewSelectionSignature } from './useTreeViewSelection.types';

const selectedItemsSelector = createSelectorMemoized(
  (state: TreeViewState<[UseTreeViewSelectionSignature]>) => state.selection.selectedItems,
  (selectedItemsRaw) => {
    if (Array.isArray(selectedItemsRaw)) {
      return selectedItemsRaw;
    }

    if (selectedItemsRaw != null) {
      return [selectedItemsRaw];
    }

    return [];
  },
);

const selectedItemsMapSelector = createSelectorMemoized(selectedItemsSelector, (selectedItems) => {
  const selectedItemsMap = new Map<TreeViewItemId, true>();
  selectedItems.forEach((id) => {
    selectedItemsMap.set(id, true);
  });
  return selectedItemsMap;
});

export const selectionSelectors = {
  /**
   * Get the selected items as provided to the component.
   * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
   * @returns {TreeViewSelectionValue<boolean>} The selected items.
   */
  selectedItemsRaw: createSelector(
    (state: TreeViewState<[UseTreeViewSelectionSignature]>) => state.selection.selectedItems,
  ),
  /**
   * Get the selected items as an array.
   * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
   * @returns {TreeViewItemId[]} The selected items as an array.
   */
  selectedItems: selectedItemsSelector,
  /**
   * Get the selected items as a map.
   * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
   * @returns {Map<TreeViewItemId, true>} The selected items as a Map.
   */
  selectedItemsMap: selectedItemsMapSelector,
  /**
   * Check if selection is enabled.
   * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
   * @returns {boolean} Whether selection is enabled.
   */
  enabled: createSelector(
    (state: TreeViewState<[UseTreeViewSelectionSignature]>) => state.selection.isEnabled,
  ),
  /**
   * Check if multi selection is enabled.
   * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
   * @returns {boolean} Whether multi selection is enabled.
   */
  isMultiSelectEnabled: createSelector(
    (state: TreeViewState<[UseTreeViewSelectionSignature]>) => state.selection.isMultiSelectEnabled,
  ),
  /**
   * Check if checkbox selection is enabled.
   * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
   * @returns {boolean} Whether checkbox selection is enabled.
   */
  isCheckboxSelectionEnabled: createSelector(
    (state: TreeViewState<[UseTreeViewSelectionSignature]>) =>
      state.selection.isCheckboxSelectionEnabled,
  ),
  /**
   * Get the selection propagation rules.
   * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
   * @returns {TreeViewSelectionPropagation} The selection propagation rules.
   */
  propagationRules: createSelector(
    (state: TreeViewState<[UseTreeViewSelectionSignature]>) => state.selection.selectionPropagation,
  ),
  /**
   * Check if an item is selected.
   * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
   * @returns {boolean} Whether the item is selected.
   */
  isItemSelected: createSelector(
    selectedItemsMapSelector,
    (selectedItemsMap, itemId: TreeViewItemId) => selectedItemsMap.has(itemId),
  ),
  /**
   * Check if an item can be selected (if selection is enabled and if the item is not disabled).
   * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
   * @param {string} itemId The id of the item to check.
   * @returns {boolean} Whether the item can be selected.
   */
  canItemBeSelected: createSelector(
    itemsSelectors.isItemDisabled,
    (state: TreeViewState<[UseTreeViewSelectionSignature]>) => state.selection.isEnabled,
    (isItemDisabled, isSelectionEnabled, _itemId: TreeViewItemId) =>
      isSelectionEnabled && !isItemDisabled,
  ),
};
