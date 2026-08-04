import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import type { TreeViewItemId, TreeViewItemSelectionStatus } from '../../../models';
import type { MinimalTreeViewState } from '../../MinimalTreeViewStore';
import { itemsSelectors } from '../items/selectors';

const selectedItemsSelector = createSelectorMemoized(
  (state: MinimalTreeViewState<any, any>) => state.selectedItems,
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

const isItemSelectableSelector = createSelector(
  (state: MinimalTreeViewState<any, any>, itemId: TreeViewItemId) =>
    state.itemMetaLookup[itemId]?.selectable ?? true,
);

const isItemSelectedSelector = createSelector(
  selectedItemsMapSelector,
  (selectedItemsMap, itemId: TreeViewItemId) => selectedItemsMap.has(itemId),
);

const canItemBeSelectedSelector = createSelector(
  itemsSelectors.isItemDisabled,
  isItemSelectableSelector,
  (state: MinimalTreeViewState<any, any>) => !state.disableSelection,
  (isItemDisabled, isItemSelectable, isSelectionEnabled, _itemId: TreeViewItemId) =>
    isSelectionEnabled && !isItemDisabled && isItemSelectable,
);

const propagationRulesSelector = createSelector(
  (state: MinimalTreeViewState<any, any>) => state.selectionPropagation,
);

const itemSelectionStatusSelector = createSelector(
  (state: MinimalTreeViewState<any, any>, itemId: TreeViewItemId): TreeViewItemSelectionStatus => {
    if (isItemSelectedSelector(state, itemId)) {
      return 'selected';
    }

    // Only the descendants can make an unselected item `indeterminate`, so leaves can be resolved
    // without traversing the tree.
    if (itemsSelectors.itemOrderedChildrenIds(state, itemId).length === 0) {
      return 'unselected';
    }

    let hasSelectedDescendant = false;
    let hasUnSelectedDescendant = false;

    const traverseDescendants = (itemToTraverseId: TreeViewItemId) => {
      if (itemToTraverseId !== itemId) {
        if (canItemBeSelectedSelector(state, itemToTraverseId)) {
          if (isItemSelectedSelector(state, itemToTraverseId)) {
            hasSelectedDescendant = true;
          } else {
            hasUnSelectedDescendant = true;
          }
        }
      }

      itemsSelectors.itemOrderedChildrenIds(state, itemToTraverseId).forEach(traverseDescendants);
    };

    traverseDescendants(itemId);

    const shouldSelectBasedOnDescendants = propagationRulesSelector(state).parents;
    if (shouldSelectBasedOnDescendants) {
      if (hasSelectedDescendant && hasUnSelectedDescendant) {
        return 'indeterminate';
      }
      if (hasSelectedDescendant && !hasUnSelectedDescendant) {
        return 'selected';
      }
      return 'unselected';
    }

    if (hasSelectedDescendant) {
      return 'indeterminate';
    }

    return 'unselected';
  },
);

export const selectionSelectors = {
  /**
   * Gets the selected items as provided to the component.
   */
  selectedItemsRaw: createSelector((state: MinimalTreeViewState<any, any>) => state.selectedItems),
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
  enabled: createSelector((state: MinimalTreeViewState<any, any>) => !state.disableSelection),
  /**
   * Checks whether multi selection is enabled.
   */
  isMultiSelectEnabled: createSelector(
    (state: MinimalTreeViewState<any, any>) => state.multiSelect,
  ),
  /**
   * Checks whether checkbox selection is enabled.
   */
  isCheckboxSelectionEnabled: createSelector(
    (state: MinimalTreeViewState<any, any>) => state.checkboxSelection,
  ),
  /**
   * Gets the selection propagation rules.
   */
  propagationRules: propagationRulesSelector,
  /**
   * Checks whether an item is selected.
   */
  isItemSelected: isItemSelectedSelector,
  /**
   * Gets the selection status of an item.
   * An item that is not selected is `indeterminate` when some of its selectable descendants are selected.
   * When `selectionPropagation.parents` is enabled, an item whose selectable descendants are all selected is `selected`.
   */
  itemSelectionStatus: itemSelectionStatusSelector,
  /**
   * Checks whether an item is indeterminate (it is not selected but some of its selectable descendants are).
   */
  isItemIndeterminate: createSelector(
    itemSelectionStatusSelector,
    (selectionStatus, _itemId: TreeViewItemId) => selectionStatus === 'indeterminate',
  ),
  /**
   * Checks whether the selection feature is enabled for an item.
   * Returns `true` when selection is enabled on the Tree View and the item is selectable (even if the item is disabled).
   */
  isFeatureEnabledForItem: createSelector(
    isItemSelectableSelector,
    (state: MinimalTreeViewState<any, any>) => !state.disableSelection,
    (isItemSelectable, isSelectionEnabled, _itemId: TreeViewItemId) =>
      isSelectionEnabled && isItemSelectable,
  ),
  /**
   * Checks whether an item can be selected (if selection is enabled, if the item is not disabled, and if the item is selectable).
   */
  canItemBeSelected: canItemBeSelectedSelector,
  /**
   * Checks whether an item is selectable based on the `isItemSelectionDisabled` prop.
   */
  isItemSelectable: isItemSelectableSelector,
};
