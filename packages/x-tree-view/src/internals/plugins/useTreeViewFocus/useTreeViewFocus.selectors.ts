import { createSelector, createSelectorMemoized } from '@base-ui-components/utils/store';
import { UseTreeViewFocusSignature } from './useTreeViewFocus.types';
import { selectionSelectors } from '../useTreeViewSelection/useTreeViewSelection.selectors';
import { itemsSelectors } from '../useTreeViewItems/useTreeViewItems.selectors';
import { isItemDisabled } from '../useTreeViewItems/useTreeViewItems.utils';
import { expansionSelectors } from '../useTreeViewExpansion/useTreeViewExpansion.selectors';
import { TreeViewState } from '../../models';
import { TreeViewItemId } from '../../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';

const defaultFocusableItemIdSelector = createSelectorMemoized(
  selectionSelectors.selectedItems,
  expansionSelectors.expandedItemsMap,
  itemsSelectors.itemMetaLookup,
  itemsSelectors.disabledItemFocusable,
  (state: TreeViewState<[UseTreeViewItemsSignature]>) =>
    itemsSelectors.itemOrderedChildrenIds(state, null),
  (selectedItems, expandedItemsMap, itemMetaLookup, disabledItemsFocusable, orderedRootItemIds) => {
    const firstSelectedItem = selectedItems.find((itemId) => {
      if (!disabledItemsFocusable && isItemDisabled(itemMetaLookup, itemId)) {
        return false;
      }

      const itemMeta = itemMetaLookup[itemId];
      return itemMeta && (itemMeta.parentId == null || expandedItemsMap.has(itemMeta.parentId));
    });

    if (firstSelectedItem != null) {
      return firstSelectedItem;
    }

    const firstNavigableItem = orderedRootItemIds.find(
      (itemId) => disabledItemsFocusable || !isItemDisabled(itemMetaLookup, itemId),
    );

    if (firstNavigableItem != null) {
      return firstNavigableItem;
    }

    return null;
  },
);

export const focusSelectors = {
  /**
   * Get the item that should be sequentially focusable (usually with the Tab key).
   * At any point in time, there is a single item that can be sequentially focused in the Tree View.
   * This item is the first selected item (that is both visible and navigable), if any, or the first navigable item if no item is selected.
   * @param {TreeViewState<[UseTreeViewFocusSignature]>} state The state of the tree view.
   * @returns {TreeViewItemId | null} The id of the item that should be sequentially focusable.
   */
  defaultFocusableItemId: defaultFocusableItemIdSelector,
  /**
   * Check if an item is the default focusable item.
   * @param {TreeViewState<[UseTreeViewFocusSignature]>} state The state of the tree view.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} Whether the item is the default focusable item.
   */
  isItemTheDefaultFocusableItem: createSelector(
    defaultFocusableItemIdSelector,
    (defaultFocusableItemId, itemId) => defaultFocusableItemId === itemId,
  ),
  /**
   * Get the id of the item that is currently focused.
   * @param {TreeViewState<[UseTreeViewFocusSignature]>} state The state of the tree view.
   * @returns {TreeViewItemId | null} The id of the item that is currently focused.
   */
  focusedItemId: createSelector(
    (state: TreeViewState<[UseTreeViewFocusSignature]>) => state.focus.focusedItemId,
  ),
  /**
   * Check if an item is focused.
   * @param {TreeViewState<[UseTreeViewFocusSignature]>} state The state of the tree view.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} Whether the item is focused.
   */
  isItemFocused: createSelector(
    (state: TreeViewState<[UseTreeViewFocusSignature]>, itemId: TreeViewItemId) =>
      state.focus.focusedItemId === itemId,
  ),
};
