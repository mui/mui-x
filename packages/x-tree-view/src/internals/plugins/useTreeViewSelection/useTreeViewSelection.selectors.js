"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorSelectionPropagationRules = exports.selectorIsItemSelectionEnabled = exports.selectorIsCheckboxSelectionEnabled = exports.selectorIsSelectionEnabled = exports.selectorIsMultiSelectEnabled = exports.selectorIsItemSelected = exports.selectorSelectionModelArray = exports.selectorSelectionModel = void 0;
var selectors_1 = require("../../utils/selectors");
var useTreeViewItems_selectors_1 = require("../useTreeViewItems/useTreeViewItems.selectors");
var selectorTreeViewSelectionState = function (state) { return state.selection; };
/**
 * Get the selected items.
 * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
 * @returns {TreeViewSelectionValue<boolean>} The selected items.
 */
exports.selectorSelectionModel = (0, selectors_1.createSelector)([selectorTreeViewSelectionState], function (selectionState) { return selectionState.selectedItems; });
/**
 * Get the selected items as an array.
 * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
 * @returns {TreeViewItemId[]} The selected items as an array.
 */
exports.selectorSelectionModelArray = (0, selectors_1.createSelector)([exports.selectorSelectionModel], function (selectedItems) {
    if (Array.isArray(selectedItems)) {
        return selectedItems;
    }
    if (selectedItems != null) {
        return [selectedItems];
    }
    return [];
});
/**
 * Get the selected items as a map.
 * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
 * @returns {Map<TreeViewItemId, true>} The selected items as a Map.
 */
var selectorSelectionModelMap = (0, selectors_1.createSelector)([exports.selectorSelectionModelArray], function (selectedItems) {
    var selectedItemsMap = new Map();
    selectedItems.forEach(function (id) {
        selectedItemsMap.set(id, true);
    });
    return selectedItemsMap;
});
/**
 * Check if an item is selected.
 * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
 * @returns {boolean} `true` if the item is selected, `false` otherwise.
 */
exports.selectorIsItemSelected = (0, selectors_1.createSelector)([selectorSelectionModelMap, function (_, itemId) { return itemId; }], function (selectedItemsMap, itemId) { return selectedItemsMap.has(itemId); });
/**
 * Check if multi selection is enabled.
 * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
 * @returns {boolean} `true` if multi selection is enabled, `false` otherwise.
 */
exports.selectorIsMultiSelectEnabled = (0, selectors_1.createSelector)([selectorTreeViewSelectionState], function (selectionState) { return selectionState.isEnabled && selectionState.isMultiSelectEnabled; });
/**
 * Check if selection is enabled.
 * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
 * @returns {boolean} `true` if selection is enabled, `false` otherwise.
 */
exports.selectorIsSelectionEnabled = (0, selectors_1.createSelector)([selectorTreeViewSelectionState], function (selectionState) { return selectionState.isEnabled; });
/**
 * Check if checkbox selection is enabled.
 * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
 * @returns {boolean} `true` if checkbox selection is enabled, `false` otherwise.
 */
exports.selectorIsCheckboxSelectionEnabled = (0, selectors_1.createSelector)([selectorTreeViewSelectionState], function (selectionState) { return selectionState.isCheckboxSelectionEnabled; });
/**
 * Check if selection is enabled for an item (if selection is enabled and if the item is not disabled).
 * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
 * @param {string} itemId The id of the item to check.
 * @returns {boolean} `true` if selection is enabled for the item, `false` otherwise.
 */
exports.selectorIsItemSelectionEnabled = (0, selectors_1.createSelector)([useTreeViewItems_selectors_1.selectorIsItemDisabled, exports.selectorIsSelectionEnabled], function (isItemDisabled, isSelectionEnabled) { return isSelectionEnabled && !isItemDisabled; });
/**
 * Get the selection propagation rules.
 * @param {TreeViewState<[UseTreeViewSelectionSignature]>} state The state of the tree view.
 * @returns {TreeViewSelectionPropagation} The selection propagation rules.
 */
exports.selectorSelectionPropagationRules = (0, selectors_1.createSelector)([selectorTreeViewSelectionState], function (selectionState) { return selectionState.selectionPropagation; });
