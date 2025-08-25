"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorCanItemBeReordered = exports.selectorIsItemValidReorderingTarget = exports.selectorDraggedItemProperties = exports.selectorCurrentItemReordering = void 0;
var internals_1 = require("@mui/x-tree-view/internals");
/**
 * Get the items reordering state.
 * @param {TreeViewState<[UseTreeViewItemsReorderingSignature]>} state The state of the tree view.
 * @returns {TreeViewItemsReorderingState} The items reordering state.
 */
var selectorItemsReordering = function (state) {
    return state.itemsReordering;
};
/**
 * Get the properties of the current reordering.
 * @param {TreeViewState<[UseTreeViewItemsReorderingSignature]>} state The state of the tree view.
 * @returns {TreeViewItemsReorderingState['currentReorder']} The properties of the current reordering.
 */
exports.selectorCurrentItemReordering = (0, internals_1.createSelector)([selectorItemsReordering], function (itemsReordering) { return itemsReordering.currentReorder; });
/**
 * Get the properties of the dragged item.
 * @param {TreeViewState<[UseTreeViewItemsSignature, UseTreeViewItemsReorderingSignature]>} state The state of the tree view.
 * @param {string} itemId The id of the item.
 * @returns {TreeViewItemDraggedItemProperties | null} The properties of the dragged item if the current item is being dragged, `null` otherwise.
 */
exports.selectorDraggedItemProperties = (0, internals_1.createSelector)([exports.selectorCurrentItemReordering, internals_1.selectorItemMetaLookup, function (_, itemId) { return itemId; }], function (currentReorder, itemMetaLookup, itemId) {
    var _a;
    if (!currentReorder ||
        currentReorder.targetItemId !== itemId ||
        currentReorder.action == null) {
        return null;
    }
    var targetDepth = ((_a = currentReorder.newPosition) === null || _a === void 0 ? void 0 : _a.parentId) == null
        ? 0
        : // The depth is always defined because drag&drop is only usable with Rich Tree View components.
            itemMetaLookup[itemId].depth + 1;
    return {
        newPosition: currentReorder.newPosition,
        action: currentReorder.action,
        targetDepth: targetDepth,
    };
});
/**
 * Check if the current item is a valid target for the dragged item.
 * @param {TreeViewState<[UseTreeViewItemsReorderingSignature]>} state The state of the tree view.
 * @param {string} itemId The id of the item.
 * @returns {boolean} `true` if the current item is a valid target for the dragged item, `false` otherwise.
 */
exports.selectorIsItemValidReorderingTarget = (0, internals_1.createSelector)([exports.selectorCurrentItemReordering, function (_, itemId) { return itemId; }], function (currentReorder, itemId) { return currentReorder && currentReorder.draggedItemId !== itemId; });
/**
 * Check if the items can be reordered.
 * @param {TreeViewState<[UseTreeViewItemsReorderingSignature]>} state The state of the tree view.
 * @param {string} itemId The id of the item.
 * @returns {boolean} `true` if the items can be reordered, `false` otherwise.
 */
exports.selectorCanItemBeReordered = (0, internals_1.createSelector)([selectorItemsReordering, internals_1.selectorIsAnyItemBeingEdited, function (_, itemId) { return itemId; }], function (itemsReordering, isEditing, itemId) { return !isEditing && itemsReordering.isItemReorderable(itemId); });
