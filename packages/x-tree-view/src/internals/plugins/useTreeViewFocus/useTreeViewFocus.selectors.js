"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorIsItemFocused = exports.selectorFocusedItemId = exports.selectorIsItemTheDefaultFocusableItem = exports.selectorDefaultFocusableItemId = void 0;
var selectors_1 = require("../../utils/selectors");
var useTreeViewSelection_selectors_1 = require("../useTreeViewSelection/useTreeViewSelection.selectors");
var useTreeViewItems_selectors_1 = require("../useTreeViewItems/useTreeViewItems.selectors");
var useTreeViewItems_utils_1 = require("../useTreeViewItems/useTreeViewItems.utils");
var useTreeViewExpansion_selectors_1 = require("../useTreeViewExpansion/useTreeViewExpansion.selectors");
var selectorTreeViewFocusState = function (state) {
    return state.focus;
};
/**
 * Get the item that should be sequentially focusable (usually with the Tab key).
 * At any point in time, there is a single item that can be sequentially focused in the Tree View.
 * This item is the first selected item (that is both visible and navigable), if any, or the first navigable item if no item is selected.
 * @param {TreeViewState<[UseTreeViewFocusSignature]>} state The state of the tree view.
 * @returns {TreeViewItemId | null} The id of the item that should be sequentially focusable.
 */
exports.selectorDefaultFocusableItemId = (0, selectors_1.createSelector)([
    useTreeViewSelection_selectors_1.selectorSelectionModelArray,
    useTreeViewExpansion_selectors_1.selectorExpandedItemsMap,
    useTreeViewItems_selectors_1.selectorItemMetaLookup,
    useTreeViewItems_selectors_1.selectorDisabledItemFocusable,
    function (state) { return (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(state, null); },
], function (selectedItems, expandedItemsMap, itemMetaLookup, disabledItemsFocusable, orderedRootItemIds) {
    var firstSelectedItem = selectedItems.find(function (itemId) {
        if (!disabledItemsFocusable && (0, useTreeViewItems_utils_1.isItemDisabled)(itemMetaLookup, itemId)) {
            return false;
        }
        var itemMeta = itemMetaLookup[itemId];
        return itemMeta && (itemMeta.parentId == null || expandedItemsMap.has(itemMeta.parentId));
    });
    if (firstSelectedItem != null) {
        return firstSelectedItem;
    }
    var firstNavigableItem = orderedRootItemIds.find(function (itemId) { return disabledItemsFocusable || !(0, useTreeViewItems_utils_1.isItemDisabled)(itemMetaLookup, itemId); });
    if (firstNavigableItem != null) {
        return firstNavigableItem;
    }
    return null;
});
/**
 * Check if an item is the default focusable item.
 * @param {TreeViewState<[UseTreeViewFocusSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to check.
 * @returns {boolean} `true` if the item is the default focusable item, `false` otherwise.
 */
exports.selectorIsItemTheDefaultFocusableItem = (0, selectors_1.createSelector)([exports.selectorDefaultFocusableItemId, function (_, itemId) { return itemId; }], function (defaultFocusableItemId, itemId) { return defaultFocusableItemId === itemId; });
/**
 * Get the id of the item that is currently focused.
 * @param {TreeViewState<[UseTreeViewFocusSignature]>} state The state of the tree view.
 * @returns {TreeViewItemId | null} The id of the item that is currently focused.
 */
exports.selectorFocusedItemId = (0, selectors_1.createSelector)(selectorTreeViewFocusState, function (focus) { return focus.focusedItemId; });
/**
 * Check if an item is focused.
 * @param {TreeViewState<[UseTreeViewFocusSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to check.
 * @returns {boolean} `true` if the item is focused, `false` otherwise.
 */
exports.selectorIsItemFocused = (0, selectors_1.createSelector)([exports.selectorFocusedItemId, function (_, itemId) { return itemId; }], function (focusedItemId, itemId) { return focusedItemId === itemId; });
