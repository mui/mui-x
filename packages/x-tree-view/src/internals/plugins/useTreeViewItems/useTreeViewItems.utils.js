"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isItemDisabled = exports.buildSiblingIndexes = exports.TREE_VIEW_ROOT_PARENT_ID = void 0;
exports.TREE_VIEW_ROOT_PARENT_ID = '__TREE_VIEW_ROOT_PARENT_ID__';
var buildSiblingIndexes = function (siblings) {
    var siblingsIndexLookup = {};
    siblings.forEach(function (childId, index) {
        siblingsIndexLookup[childId] = index;
    });
    return siblingsIndexLookup;
};
exports.buildSiblingIndexes = buildSiblingIndexes;
/**
 * Check if an item is disabled.
 * This method should only be used in selectors that are checking if several items are disabled.
 * Otherwise, use the `selectorIsItemDisabled` selector.
 * @returns
 */
var isItemDisabled = function (itemMetaLookup, itemId) {
    if (itemId == null) {
        return false;
    }
    var itemMeta = itemMetaLookup[itemId];
    // This can be called before the item has been added to the item map.
    if (!itemMeta) {
        return false;
    }
    if (itemMeta.disabled) {
        return true;
    }
    while (itemMeta.parentId != null) {
        itemMeta = itemMetaLookup[itemMeta.parentId];
        if (!itemMeta) {
            return false;
        }
        if (itemMeta.disabled) {
            return true;
        }
    }
    return false;
};
exports.isItemDisabled = isItemDisabled;
