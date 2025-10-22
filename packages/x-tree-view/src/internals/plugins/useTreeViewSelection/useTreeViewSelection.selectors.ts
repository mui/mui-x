import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { TreeViewItemId } from '../../../models';
import { TreeViewState } from '../../TreeViewStore';
import { itemsSelectors } from '../useTreeViewItems/useTreeViewItems.selectors';

const selectedItemsSelector = createSelectorMemoized(
  (state: TreeViewState<any, any>) => state.selectedItems,
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
  selectedItemsRaw: createSelector((state: TreeViewState<any, any>) => state.selectedItems),
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
  enabled: createSelector((state: TreeViewState<any, any>) => !state.disableSelection),
  /**
   * Checks whether multi selection is enabled.
   */
  isMultiSelectEnabled: createSelector((state: TreeViewState<any, any>) => state.multiSelect),
  /**
   * Checks whether checkbox selection is enabled.
   */
  isCheckboxSelectionEnabled: createSelector(
    (state: TreeViewState<any, any>) => state.checkboxSelection,
  ),
  /**
   * Gets the selection propagation rules.
   */
  propagationRules: createSelector((state: TreeViewState<any, any>) => state.selectionPropagation),
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
    (state: TreeViewState<any, any>) => !state.disableSelection,
    (isItemDisabled, isSelectionEnabled, _itemId: TreeViewItemId) =>
      isSelectionEnabled && !isItemDisabled,
  ),
};
