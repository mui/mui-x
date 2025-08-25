"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTreeItemIdAttribute = exports.createTreeViewDefaultId = void 0;
var globalTreeViewDefaultId = 0;
var createTreeViewDefaultId = function () {
    globalTreeViewDefaultId += 1;
    return "mui-tree-view-".concat(globalTreeViewDefaultId);
};
exports.createTreeViewDefaultId = createTreeViewDefaultId;
/**
 * Generate the id attribute (i.e.: the `id` attribute passed to the DOM element) of a Tree Item.
 * If the user explicitly defined an id attribute, it will be returned.
 * Otherwise, the method creates a unique id for the item based on the Tree View id attribute and the item `itemId`
 * @param {object} params The parameters to determine the id attribute of the item.
 * @param {TreeViewItemId} params.itemId The id of the item to get the id attribute of.
 * @param {string | undefined} params.idAttribute The id attribute of the item if explicitly defined by the user.
 * @param {string} params.treeId The id attribute of the Tree View.
 * @returns {string} The id attribute of the item.
 */
var generateTreeItemIdAttribute = function (_a) {
    var id = _a.id, _b = _a.treeId, treeId = _b === void 0 ? '' : _b, itemId = _a.itemId;
    if (id != null) {
        return id;
    }
    return "".concat(treeId, "-").concat(itemId);
};
exports.generateTreeItemIdAttribute = generateTreeItemIdAttribute;
