"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorIsAnyItemBeingEdited = exports.selectorIsItemBeingEdited = exports.selectorIsItemEditable = void 0;
var selectors_1 = require("../../utils/selectors");
var useTreeViewItems_selectors_1 = require("../useTreeViewItems/useTreeViewItems.selectors");
var selectorTreeViewLabelState = function (state) {
    return state.label;
};
/**
 * Check if an item is editable.
 * @param {TreeViewState<[UseTreeViewItemsSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to check.
 * @returns {boolean} `true` if the item is editable, `false` otherwise.
 */
exports.selectorIsItemEditable = (0, selectors_1.createSelector)([selectorTreeViewLabelState, function (state, itemId) { return (0, useTreeViewItems_selectors_1.selectorItemModel)(state, itemId); }], function (labelState, itemModel) {
    if (!itemModel || !labelState) {
        return false;
    }
    if (typeof labelState.isItemEditable === 'boolean') {
        return labelState.isItemEditable;
    }
    return labelState.isItemEditable(itemModel);
});
/**
 * Check if the given item is being edited.
 * @param {TreeViewState<[UseTreeViewLabelSignature]>} state The state of the tree view.
 * @param {TreeViewItemId} itemId The id of the item to check.
 * @returns {boolean} `true` if the item is being edited, `false` otherwise.
 */
exports.selectorIsItemBeingEdited = (0, selectors_1.createSelector)([selectorTreeViewLabelState, function (_, itemId) { return itemId; }], function (labelState, itemId) { return (itemId ? (labelState === null || labelState === void 0 ? void 0 : labelState.editedItemId) === itemId : false); });
/**
 * Check if an item is being edited.
 * @param {TreeViewState<[UseTreeViewLabelSignature]>} state The state of the tree view.
 * @returns {boolean} `true` if an item is being edited, `false` otherwise.
 */
exports.selectorIsAnyItemBeingEdited = (0, selectors_1.createSelector)(selectorTreeViewLabelState, function (labelState) { return !!(labelState === null || labelState === void 0 ? void 0 : labelState.editedItemId); });
