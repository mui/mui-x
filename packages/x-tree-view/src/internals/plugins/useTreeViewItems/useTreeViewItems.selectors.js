"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorCanItemBeFocused = exports.selectorDisabledItemFocusable = exports.selectorItemDepth = exports.selectorItemParentId = exports.selectorItemIndex = exports.selectorIsItemDisabled = exports.selectorItemMeta = exports.selectorItemModel = exports.selectorItemOrderedChildrenIds = exports.selectorItemMetaLookup = exports.selectorGetTreeViewError = exports.selectorIsTreeViewLoading = void 0;
var selectors_1 = require("../../utils/selectors");
var useTreeViewItems_utils_1 = require("./useTreeViewItems.utils");
var selectorTreeViewItemsState = function (state) {
    return state.items;
};
/**
 * Get the loading state for the Tree View.
 * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
 * @returns {boolean} The loading state for the Tree View.
 */
exports.selectorIsTreeViewLoading = (0, selectors_1.createSelector)(selectorTreeViewItemsState, function (items) { return items.loading; });
/**
 * Get the error state for the Tree View.
 * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
 * @returns {boolean} The error state for the Tree View.
 */
exports.selectorGetTreeViewError = (0, selectors_1.createSelector)(selectorTreeViewItemsState, function (items) { return items.error; });
/**
 * Get the meta-information of all items.
 * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
 * @returns {TreeViewItemMetaLookup} The meta-information of all items.
 */
exports.selectorItemMetaLookup = (0, selectors_1.createSelector)(selectorTreeViewItemsState, function (items) { return items.itemMetaLookup; });
var EMPTY_CHILDREN = [];
/**
 * Get the ordered children ids of a given item.
 * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to get the children of.
 * @returns {TreeViewItemId[]} The ordered children ids of the item.
 */
exports.selectorItemOrderedChildrenIds = (0, selectors_1.createSelector)([selectorTreeViewItemsState, function (_, itemId) { return itemId; }], function (itemsState, itemId) { var _a; return (_a = itemsState.itemOrderedChildrenIdsLookup[itemId !== null && itemId !== void 0 ? itemId : useTreeViewItems_utils_1.TREE_VIEW_ROOT_PARENT_ID]) !== null && _a !== void 0 ? _a : EMPTY_CHILDREN; });
/**
 * Get the model of an item.
 * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to get the model of.
 * @returns {R} The model of the item.
 */
exports.selectorItemModel = (0, selectors_1.createSelector)([selectorTreeViewItemsState, function (_, itemId) { return itemId; }], function (itemsState, itemId) { return itemsState.itemModelLookup[itemId]; });
/**
 * Get the meta-information of an item.
 * Check the `TreeViewItemMeta` type for more information.
 * @param {TreeViewState<[UseTreeViewItemsSignature]>}
 * @param {TreeViewItemId} itemId The id of the item to get the meta-information of.
 * @returns {TreeViewItemMeta | null} The meta-information of the item.
 */
exports.selectorItemMeta = (0, selectors_1.createSelector)([exports.selectorItemMetaLookup, function (_, itemId) { return itemId; }], function (itemMetaLookup, itemId) { var _a; return ((_a = itemMetaLookup[itemId !== null && itemId !== void 0 ? itemId : useTreeViewItems_utils_1.TREE_VIEW_ROOT_PARENT_ID]) !== null && _a !== void 0 ? _a : null); });
/**
 * Check if an item is disabled.
 * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to check.
 * @returns {boolean} `true` if the item is disabled, `false` otherwise.
 */
exports.selectorIsItemDisabled = (0, selectors_1.createSelector)([exports.selectorItemMetaLookup, function (_, itemId) { return itemId; }], useTreeViewItems_utils_1.isItemDisabled);
/**
 * Get the index of an item in its parent's children.
 * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to get the index of.
 * @returns {number} The index of the item in its parent's children.
 */
exports.selectorItemIndex = (0, selectors_1.createSelector)([selectorTreeViewItemsState, exports.selectorItemMeta], function (itemsState, itemMeta) {
    var _a;
    if (itemMeta == null) {
        return -1;
    }
    var parentIndexes = itemsState.itemChildrenIndexesLookup[(_a = itemMeta.parentId) !== null && _a !== void 0 ? _a : useTreeViewItems_utils_1.TREE_VIEW_ROOT_PARENT_ID];
    return parentIndexes[itemMeta.id];
});
/**
 * Get the id of the parent of an item.
 * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to get the parent id of.
 * @returns {TreeViewItemId | null} The id of the parent of the item.
 */
exports.selectorItemParentId = (0, selectors_1.createSelector)([exports.selectorItemMeta], function (itemMeta) { var _a; return (_a = itemMeta === null || itemMeta === void 0 ? void 0 : itemMeta.parentId) !== null && _a !== void 0 ? _a : null; });
/**
 * Get the depth of an item (items at the root level have a depth of 0).
 * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to get the depth of.
 * @returns {number} The depth of the item.
 */
exports.selectorItemDepth = (0, selectors_1.createSelector)([exports.selectorItemMeta], function (itemMeta) { var _a; return (_a = itemMeta === null || itemMeta === void 0 ? void 0 : itemMeta.depth) !== null && _a !== void 0 ? _a : 0; });
/**
 * Check if the disabled items are focusable.
 * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
 * @returns {boolean} Whether the disabled items are focusable.
 */
exports.selectorDisabledItemFocusable = (0, selectors_1.createSelector)([selectorTreeViewItemsState], function (itemsState) { return itemsState.disabledItemsFocusable; });
exports.selectorCanItemBeFocused = (0, selectors_1.createSelector)([exports.selectorDisabledItemFocusable, exports.selectorIsItemDisabled], function (disabledItemsFocusable, isDisabled) {
    if (disabledItemsFocusable) {
        return true;
    }
    return !isDisabled;
});
