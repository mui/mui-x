"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveItemInTree = exports.chooseActionToApply = exports.isAncestor = void 0;
var internals_1 = require("@mui/x-tree-view/internals");
/**
 * Checks if the item with the id itemIdB is an ancestor of the item with the id itemIdA.
 */
var isAncestor = function (store, itemIdA, itemIdB) {
    var itemMetaA = (0, internals_1.selectorItemMeta)(store.value, itemIdA);
    if (itemMetaA.parentId === itemIdB) {
        return true;
    }
    if (itemMetaA.parentId == null) {
        return false;
    }
    return (0, exports.isAncestor)(store, itemMetaA.parentId, itemIdB);
};
exports.isAncestor = isAncestor;
/**
 * Transforms a CSS string `itemChildrenIndentation` into a number representing the indentation in number.
 * @param {string | null} itemChildrenIndentation The indentation as passed to the `itemChildrenIndentation` prop.
 * @param {HTMLElement} contentElement The DOM element to which the indentation will be applied.
 */
var parseItemChildrenIndentation = function (itemChildrenIndentation, contentElement) {
    if (typeof itemChildrenIndentation === 'number') {
        return itemChildrenIndentation;
    }
    var pixelExec = /^(\d.+)(px)$/.exec(itemChildrenIndentation);
    if (pixelExec) {
        return parseFloat(pixelExec[1]);
    }
    // If the format is neither `px` nor a number, we need to measure the indentation using an actual DOM element.
    var tempElement = document.createElement('div');
    tempElement.style.width = itemChildrenIndentation;
    tempElement.style.position = 'absolute';
    contentElement.appendChild(tempElement);
    var value = tempElement.offsetWidth;
    contentElement.removeChild(tempElement);
    return value;
};
var chooseActionToApply = function (_a) {
    var itemChildrenIndentation = _a.itemChildrenIndentation, validActions = _a.validActions, targetHeight = _a.targetHeight, targetDepth = _a.targetDepth, cursorX = _a.cursorX, cursorY = _a.cursorY, contentElement = _a.contentElement;
    var action;
    var itemChildrenIndentationPx = parseItemChildrenIndentation(itemChildrenIndentation, contentElement);
    // If we can move the item to the parent of the target, then we allocate the left offset to this action
    // Support moving to other ancestors
    if (validActions['move-to-parent'] && cursorX < itemChildrenIndentationPx * targetDepth) {
        action = 'move-to-parent';
    }
    // If we can move the item inside the target, then we have the following split:
    // - the upper quarter of the target moves it above
    // - the lower quarter of the target moves it below
    // - the inner half makes it a child
    else if (validActions['make-child']) {
        if (validActions['reorder-above'] && cursorY < (1 / 4) * targetHeight) {
            action = 'reorder-above';
        }
        else if (validActions['reorder-below'] && cursorY > (3 / 4) * targetHeight) {
            action = 'reorder-below';
        }
        else {
            action = 'make-child';
        }
    }
    // If we can't move the item inside the target, then we have the following split:
    // - the upper half of the target moves it above
    // - the lower half of the target moves it below
    else {
        // eslint-disable-next-line no-lonely-if
        if (validActions['reorder-above'] && cursorY < (1 / 2) * targetHeight) {
            action = 'reorder-above';
        }
        else if (validActions['reorder-below'] && cursorY >= (1 / 2) * targetHeight) {
            action = 'reorder-below';
        }
        else {
            action = null;
        }
    }
    return action;
};
exports.chooseActionToApply = chooseActionToApply;
var moveItemInTree = function (_a) {
    var _b, _c, _d, _e, _f;
    var itemToMoveId = _a.itemToMoveId, oldPosition = _a.oldPosition, newPosition = _a.newPosition, prevState = _a.prevState;
    var itemToMoveMeta = prevState.itemMetaLookup[itemToMoveId];
    var oldParentId = (_b = oldPosition.parentId) !== null && _b !== void 0 ? _b : internals_1.TREE_VIEW_ROOT_PARENT_ID;
    var newParentId = (_c = newPosition.parentId) !== null && _c !== void 0 ? _c : internals_1.TREE_VIEW_ROOT_PARENT_ID;
    // 1. Update the `itemOrderedChildrenIds`.
    var itemOrderedChildrenIds = __assign({}, prevState.itemOrderedChildrenIdsLookup);
    if (oldParentId === newParentId) {
        var updatedChildren = __spreadArray([], itemOrderedChildrenIds[oldParentId], true);
        updatedChildren.splice(oldPosition.index, 1);
        updatedChildren.splice(newPosition.index, 0, itemToMoveId);
        itemOrderedChildrenIds[(_d = itemToMoveMeta.parentId) !== null && _d !== void 0 ? _d : internals_1.TREE_VIEW_ROOT_PARENT_ID] = updatedChildren;
    }
    else {
        var updatedOldParentChildren = __spreadArray([], itemOrderedChildrenIds[oldParentId], true);
        updatedOldParentChildren.splice(oldPosition.index, 1);
        itemOrderedChildrenIds[oldParentId] = updatedOldParentChildren;
        var updatedNewParentChildren = __spreadArray([], ((_e = itemOrderedChildrenIds[newParentId]) !== null && _e !== void 0 ? _e : []), true);
        updatedNewParentChildren.splice(newPosition.index, 0, itemToMoveId);
        itemOrderedChildrenIds[newParentId] = updatedNewParentChildren;
    }
    // 2. Update the `itemChildrenIndexes`
    var itemChildrenIndexes = __assign({}, prevState.itemChildrenIndexesLookup);
    itemChildrenIndexes[oldParentId] = (0, internals_1.buildSiblingIndexes)(itemOrderedChildrenIds[oldParentId]);
    if (newParentId !== oldParentId) {
        itemChildrenIndexes[newParentId] = (0, internals_1.buildSiblingIndexes)(itemOrderedChildrenIds[newParentId]);
    }
    // 3. Update the `itemMetaLookup`
    var itemMetaLookup = __assign({}, prevState.itemMetaLookup);
    // 3.1 Update the `expandable` property of the old and the new parent
    function updateExpandable(itemId) {
        var isExpandable = itemOrderedChildrenIds[itemId].length > 0;
        if (itemMetaLookup[itemId].expandable !== isExpandable) {
            itemMetaLookup[itemId] = __assign(__assign({}, itemMetaLookup[itemId]), { expandable: isExpandable });
        }
    }
    if (oldParentId !== internals_1.TREE_VIEW_ROOT_PARENT_ID && oldParentId !== newParentId) {
        updateExpandable(oldParentId);
    }
    if (newParentId !== internals_1.TREE_VIEW_ROOT_PARENT_ID && newParentId !== oldParentId) {
        updateExpandable(newParentId);
    }
    // 3.2 Update the `parentId` and `depth` properties of the item to move
    // The depth is always defined because drag&drop is only usable with Rich Tree View components.
    var itemToMoveDepth = newPosition.parentId == null ? 0 : itemMetaLookup[newParentId].depth + 1;
    itemMetaLookup[itemToMoveId] = __assign(__assign({}, itemToMoveMeta), { parentId: newPosition.parentId, depth: itemToMoveDepth });
    // 3.3 Update the depth of all the children of the item to move
    var updateItemDepth = function (itemId, depth) {
        var _a;
        itemMetaLookup[itemId] = __assign(__assign({}, itemMetaLookup[itemId]), { depth: depth });
        (_a = itemOrderedChildrenIds[itemId]) === null || _a === void 0 ? void 0 : _a.forEach(function (childId) { return updateItemDepth(childId, depth + 1); });
    };
    (_f = itemOrderedChildrenIds[itemToMoveId]) === null || _f === void 0 ? void 0 : _f.forEach(function (childId) {
        return updateItemDepth(childId, itemToMoveDepth + 1);
    });
    return __assign(__assign({}, prevState), { itemOrderedChildrenIdsLookup: itemOrderedChildrenIds, itemChildrenIndexesLookup: itemChildrenIndexes, itemMetaLookup: itemMetaLookup });
};
exports.moveItemInTree = moveItemInTree;
