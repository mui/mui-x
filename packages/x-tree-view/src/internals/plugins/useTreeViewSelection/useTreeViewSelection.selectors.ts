import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
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
   * Gets the selected items as provided to the component.
   */
  selectedItemsRaw: createSelector(
    (state: TreeViewState<[UseTreeViewSelectionSignature]>) => state.selection.selectedItems,
  ),
  /**
   * Gets the selected items as an array.
   */
  selectedItems: selectedItemsSelector,
  /**
   * Gets the selected items as a Map.
   */
  selectedItemsMap: selectedItemsMapSelector,
  /**
   * Checks whether selection is enabled.
   */
  enabled: createSelector(
    (state: TreeViewState<[UseTreeViewSelectionSignature]>) => state.selection.isEnabled,
  ),
  /**
   * Checks whether multi selection is enabled.
   */
  isMultiSelectEnabled: createSelector(
    (state: TreeViewState<[UseTreeViewSelectionSignature]>) => state.selection.isMultiSelectEnabled,
  ),
  /**
   * Checks whether checkbox selection is enabled.
   */
  isCheckboxSelectionEnabled: createSelector(
    (state: TreeViewState<[UseTreeViewSelectionSignature]>) =>
      state.selection.isCheckboxSelectionEnabled,
  ),
  /**
   * Gets the selection propagation rules.
   */
  propagationRules: createSelector(
    (state: TreeViewState<[UseTreeViewSelectionSignature]>) => state.selection.selectionPropagation,
  ),
  /**
   * Checks whether an item is selected.
   */
  isItemSelected: createSelector(
    selectedItemsMapSelector,
    (selectedItemsMap, itemId: TreeViewItemId) => selectedItemsMap.has(itemId),
  ),
  /**
   * Checks whether an item can be selected (if selection is enabled and if the item is not disabled).
   */
  canItemBeSelected: createSelector(
    itemsSelectors.isItemDisabled,
    (state: TreeViewState<[UseTreeViewSelectionSignature]>) => state.selection.isEnabled,
    (isItemDisabled, isSelectionEnabled, _itemId: TreeViewItemId) =>
      isSelectionEnabled && !isItemDisabled,
  ),
};
