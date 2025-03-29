import { UseTreeViewFocusSignature } from './useTreeViewFocus.types';
import { createSelector, TreeViewRootSelector } from '../../utils/selectors';
import { selectorSelectionModelArray } from '../useTreeViewSelection/useTreeViewSelection.selectors';
import {
  selectorDisabledItemFocusable,
  selectorItemMetaLookup,
  selectorItemOrderedChildrenIds,
} from '../useTreeViewItems/useTreeViewItems.selectors';
import { isItemDisabled } from '../useTreeViewItems/useTreeViewItems.utils';
import { selectorExpandedItemsMap } from '../useTreeViewExpansion/useTreeViewExpansion.selectors';

const selectorTreeViewFocusState: TreeViewRootSelector<UseTreeViewFocusSignature> = (state) =>
  state.focus;

/**
 * Get the item that should be sequentially focusable (usually with the Tab key).
 * At any point in time, there is a single item that can be sequentially focused in the Tree View.
 * This item is the first selected item (that is both visible and navigable), if any, or the first navigable item if no item is selected.
 * @param {TreeViewState<[UseTreeViewFocusSignature]>} state The state of the tree view.
 * @returns {TreeViewItemId | null} The id of the item that should be sequentially focusable.
 */
export const selectorDefaultFocusableItemId = createSelector(
  [
    selectorSelectionModelArray,
    selectorExpandedItemsMap,
    selectorItemMetaLookup,
    selectorDisabledItemFocusable,
    (state) => selectorItemOrderedChildrenIds(state, null),
  ],
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

/**
 * Check if an item is the default focusable item.
 * @param {TreeViewState<[UseTreeViewFocusSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to check.
 * @returns {boolean} `true` if the item is the default focusable item, `false` otherwise.
 */
export const selectorIsItemTheDefaultFocusableItem = createSelector(
  [selectorDefaultFocusableItemId, (_, itemId: string) => itemId],
  (defaultFocusableItemId, itemId) => defaultFocusableItemId === itemId,
);

/**
 * Get the id of the item that is currently focused.
 * @param {TreeViewState<[UseTreeViewFocusSignature]>} state The state of the tree view.
 * @returns {TreeViewItemId | null} The id of the item that is currently focused.
 */
export const selectorFocusedItemId = createSelector(
  selectorTreeViewFocusState,
  (focus) => focus.focusedItemId,
);

/**
 * Check if an item is focused.
 * @param {TreeViewState<[UseTreeViewFocusSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to check.
 * @returns {boolean} `true` if the item is focused, `false` otherwise.
 */
export const selectorIsItemFocused = createSelector(
  [selectorFocusedItemId, (_, itemId: string) => itemId],
  (focusedItemId, itemId) => focusedItemId === itemId,
);
