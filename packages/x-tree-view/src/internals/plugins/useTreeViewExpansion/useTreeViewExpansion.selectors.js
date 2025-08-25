"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorItemExpansionTrigger = exports.selectorIsItemExpandable = exports.selectorIsItemExpanded = exports.selectorExpandedItemsMap = exports.selectorExpandedItems = void 0;
var selectors_1 = require("../../utils/selectors");
var useTreeViewItems_selectors_1 = require("../useTreeViewItems/useTreeViewItems.selectors");
var selectorExpansion = function (state) {
    return state.expansion;
};
/**
 * Get the expanded items.
 * @param {TreeViewState<[UseTreeViewExpansionSignature]>} state The state of the tree view.
 * @returns {TreeViewItemId[]} The expanded items.
 */
exports.selectorExpandedItems = (0, selectors_1.createSelector)([selectorExpansion], function (expansionState) { return expansionState.expandedItems; });
/**
 * Get the expanded items as a Map.
 * @param {TreeViewState<[UseTreeViewExpansionSignature]>} state The state of the tree view.
 * @returns {TreeViewExpansionValue} The expanded items as a Map.
 */
exports.selectorExpandedItemsMap = (0, selectors_1.createSelector)([exports.selectorExpandedItems], function (expandedItems) {
    var expandedItemsMap = new Map();
    expandedItems.forEach(function (id) {
        expandedItemsMap.set(id, true);
    });
    return expandedItemsMap;
});
/**
 * Check if an item is expanded.
 * @param {TreeViewState<[UseTreeViewExpansionSignature]>} state The state of the tree view.
 * @returns {boolean} `true` if the item is expanded, `false` otherwise.
 */
exports.selectorIsItemExpanded = (0, selectors_1.createSelector)([exports.selectorExpandedItemsMap, function (_, itemId) { return itemId; }], function (expandedItemsMap, itemId) { return expandedItemsMap.has(itemId); });
/**
 * Check if an item is expandable.
 * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
 * @returns {boolean} `true` if the item is expandable, `false` otherwise.
 */
exports.selectorIsItemExpandable = (0, selectors_1.createSelector)([useTreeViewItems_selectors_1.selectorItemMeta], function (itemMeta) { var _a; return (_a = itemMeta === null || itemMeta === void 0 ? void 0 : itemMeta.expandable) !== null && _a !== void 0 ? _a : false; });
/**
 * Get the slot that triggers the item's expansion when clicked.
 * @param {TreeViewState<[UseTreeViewExpansionSignature]>} state The state of the tree view.
 * @returns {'content' | 'iconContainer'} The slot that triggers the item's expansion when clicked. Is `null` if the item is not expandable.
 */
exports.selectorItemExpansionTrigger = (0, selectors_1.createSelector)([selectorExpansion], function (expansionState) { return expansionState.expansionTrigger; });
