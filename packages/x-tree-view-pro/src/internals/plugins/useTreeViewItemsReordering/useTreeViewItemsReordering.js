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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTreeViewItemsReordering = void 0;
var React = require("react");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var internals_1 = require("@mui/x-tree-view/internals");
var useTreeViewItemsReordering_utils_1 = require("./useTreeViewItemsReordering.utils");
var useTreeViewItemsReordering_itemPlugin_1 = require("./useTreeViewItemsReordering.itemPlugin");
var useTreeViewItemsReordering_selectors_1 = require("./useTreeViewItemsReordering.selectors");
var useTreeViewItemsReordering = function (_a) {
    var params = _a.params, store = _a.store;
    var canItemBeDragged = React.useCallback(function (itemId) {
        if (!params.itemsReordering) {
            return false;
        }
        var isItemReorderable = params.isItemReorderable;
        if (isItemReorderable) {
            return isItemReorderable(itemId);
        }
        return true;
    }, [params.itemsReordering, params.isItemReorderable]);
    var getDroppingTargetValidActions = React.useCallback(function (itemId) {
        var currentReorder = (0, useTreeViewItemsReordering_selectors_1.selectorCurrentItemReordering)(store.value);
        if (!currentReorder) {
            throw new Error('There is no ongoing reordering.');
        }
        if (itemId === currentReorder.draggedItemId) {
            return {};
        }
        var canMoveItemToNewPosition = params.canMoveItemToNewPosition;
        var targetItemMeta = (0, internals_1.selectorItemMeta)(store.value, itemId);
        var targetItemIndex = (0, internals_1.selectorItemIndex)(store.value, targetItemMeta.id);
        var draggedItemMeta = (0, internals_1.selectorItemMeta)(store.value, currentReorder.draggedItemId);
        var draggedItemIndex = (0, internals_1.selectorItemIndex)(store.value, draggedItemMeta.id);
        var isTargetLastSibling = targetItemIndex ===
            (0, internals_1.selectorItemOrderedChildrenIds)(store.value, targetItemMeta.parentId).length - 1;
        var oldPosition = {
            parentId: draggedItemMeta.parentId,
            index: draggedItemIndex,
        };
        var checkIfPositionIsValid = function (positionAfterAction) {
            var isValid;
            // If the new position is equal to the old one, we don't want to show any dropping UI.
            if (positionAfterAction.parentId === oldPosition.parentId &&
                positionAfterAction.index === oldPosition.index) {
                isValid = false;
            }
            else if (canMoveItemToNewPosition) {
                isValid = canMoveItemToNewPosition({
                    itemId: currentReorder.draggedItemId,
                    oldPosition: oldPosition,
                    newPosition: positionAfterAction,
                });
            }
            else {
                isValid = true;
            }
            return isValid;
        };
        var positionsAfterAction = {
            'make-child': { parentId: targetItemMeta.id, index: 0 },
            'reorder-above': {
                parentId: targetItemMeta.parentId,
                index: targetItemMeta.parentId === draggedItemMeta.parentId &&
                    targetItemIndex > draggedItemIndex
                    ? targetItemIndex - 1
                    : targetItemIndex,
            },
            'reorder-below': !targetItemMeta.expandable || isTargetLastSibling
                ? {
                    parentId: targetItemMeta.parentId,
                    index: targetItemMeta.parentId === draggedItemMeta.parentId &&
                        targetItemIndex > draggedItemIndex
                        ? targetItemIndex
                        : targetItemIndex + 1,
                }
                : null,
            'move-to-parent': targetItemMeta.parentId == null
                ? null
                : {
                    parentId: targetItemMeta.parentId,
                    index: (0, internals_1.selectorItemOrderedChildrenIds)(store.value, targetItemMeta.parentId).length,
                },
        };
        var validActions = {};
        Object.keys(positionsAfterAction).forEach(function (action) {
            var positionAfterAction = positionsAfterAction[action];
            if (positionAfterAction != null && checkIfPositionIsValid(positionAfterAction)) {
                validActions[action] = positionAfterAction;
            }
        });
        return validActions;
    }, [store, params.canMoveItemToNewPosition]);
    var startDraggingItem = React.useCallback(function (itemId) {
        store.update(function (prevState) {
            var isItemBeingEditing = (0, internals_1.selectorIsItemBeingEdited)(prevState, itemId);
            if (isItemBeingEditing) {
                return prevState;
            }
            return __assign(__assign({}, prevState), { itemsReordering: __assign(__assign({}, prevState.itemsReordering), { currentReorder: {
                        targetItemId: itemId,
                        draggedItemId: itemId,
                        action: null,
                        newPosition: null,
                    } }) });
        });
    }, [store]);
    var cancelDraggingItem = React.useCallback(function () {
        var currentReorder = (0, useTreeViewItemsReordering_selectors_1.selectorCurrentItemReordering)(store.value);
        if (currentReorder == null) {
            return;
        }
        store.update(function (prevState) { return (__assign(__assign({}, prevState), { itemsReordering: __assign(__assign({}, prevState.itemsReordering), { currentReorder: null }) })); });
    }, [store]);
    var completeDraggingItem = React.useCallback(function (itemId) {
        var currentReorder = (0, useTreeViewItemsReordering_selectors_1.selectorCurrentItemReordering)(store.value);
        if (currentReorder == null || currentReorder.draggedItemId !== itemId) {
            return;
        }
        if (currentReorder.draggedItemId === currentReorder.targetItemId ||
            currentReorder.action == null ||
            currentReorder.newPosition == null) {
            store.update(function (prevState) { return (__assign(__assign({}, prevState), { itemsReordering: __assign(__assign({}, prevState.itemsReordering), { currentReorder: null }) })); });
            return;
        }
        var draggedItemMeta = (0, internals_1.selectorItemMeta)(store.value, currentReorder.draggedItemId);
        var oldPosition = {
            parentId: draggedItemMeta.parentId,
            index: (0, internals_1.selectorItemIndex)(store.value, draggedItemMeta.id),
        };
        var newPosition = currentReorder.newPosition;
        store.update(function (prevState) { return (__assign(__assign({}, prevState), { itemsReordering: __assign(__assign({}, prevState.itemsReordering), { currentReorder: null }), items: (0, useTreeViewItemsReordering_utils_1.moveItemInTree)({
                itemToMoveId: itemId,
                newPosition: newPosition,
                oldPosition: oldPosition,
                prevState: prevState.items,
            }) })); });
        var onItemPositionChange = params.onItemPositionChange;
        onItemPositionChange === null || onItemPositionChange === void 0 ? void 0 : onItemPositionChange({
            itemId: itemId,
            newPosition: newPosition,
            oldPosition: oldPosition,
        });
    }, [store, params.onItemPositionChange]);
    var setDragTargetItem = React.useCallback(function (_a) {
        var itemId = _a.itemId, validActions = _a.validActions, targetHeight = _a.targetHeight, cursorY = _a.cursorY, cursorX = _a.cursorX, contentElement = _a.contentElement;
        store.update(function (prevState) {
            var _a, _b;
            var prevItemReorder = prevState.itemsReordering.currentReorder;
            if (prevItemReorder == null || (0, useTreeViewItemsReordering_utils_1.isAncestor)(store, itemId, prevItemReorder.draggedItemId)) {
                return prevState;
            }
            var action = (0, useTreeViewItemsReordering_utils_1.chooseActionToApply)({
                itemChildrenIndentation: params.itemChildrenIndentation,
                validActions: validActions,
                targetHeight: targetHeight,
                targetDepth: prevState.items.itemMetaLookup[itemId].depth,
                cursorY: cursorY,
                cursorX: cursorX,
                contentElement: contentElement,
            });
            var newPosition = action == null ? null : validActions[action];
            if (prevItemReorder.targetItemId === itemId &&
                prevItemReorder.action === action &&
                ((_a = prevItemReorder.newPosition) === null || _a === void 0 ? void 0 : _a.parentId) === (newPosition === null || newPosition === void 0 ? void 0 : newPosition.parentId) &&
                ((_b = prevItemReorder.newPosition) === null || _b === void 0 ? void 0 : _b.index) === (newPosition === null || newPosition === void 0 ? void 0 : newPosition.index)) {
                return prevState;
            }
            return __assign(__assign({}, prevState), { itemsReordering: __assign(__assign({}, prevState.itemsReordering), { currentReorder: __assign(__assign({}, prevItemReorder), { targetItemId: itemId, newPosition: newPosition, action: action }) }) });
        });
    }, [store, params.itemChildrenIndentation]);
    (0, useEnhancedEffect_1.default)(function () {
        store.update(function (prevState) {
            var _a;
            return (__assign(__assign({}, prevState), { itemsReordering: __assign(__assign({}, prevState.itemsReordering), { isItemReorderable: params.itemsReordering
                        ? ((_a = params.isItemReorderable) !== null && _a !== void 0 ? _a : (function () { return true; }))
                        : function () { return false; } }) }));
        });
    }, [store, params.itemsReordering, params.isItemReorderable]);
    return {
        instance: {
            canItemBeDragged: canItemBeDragged,
            getDroppingTargetValidActions: getDroppingTargetValidActions,
            startDraggingItem: startDraggingItem,
            cancelDraggingItem: cancelDraggingItem,
            completeDraggingItem: completeDraggingItem,
            setDragTargetItem: setDragTargetItem,
        },
    };
};
exports.useTreeViewItemsReordering = useTreeViewItemsReordering;
exports.useTreeViewItemsReordering.itemPlugin = useTreeViewItemsReordering_itemPlugin_1.useTreeViewItemsReorderingItemPlugin;
exports.useTreeViewItemsReordering.applyDefaultValuesToParams = function (_a) {
    var _b;
    var params = _a.params;
    return (__assign(__assign({}, params), { itemsReordering: (_b = params.itemsReordering) !== null && _b !== void 0 ? _b : false }));
};
exports.useTreeViewItemsReordering.getInitialState = function (params) {
    var _a;
    return ({
        itemsReordering: {
            currentReorder: null,
            isItemReorderable: params.itemsReordering
                ? ((_a = params.isItemReorderable) !== null && _a !== void 0 ? _a : (function () { return true; }))
                : function () { return false; },
        },
    });
};
exports.useTreeViewItemsReordering.params = {
    itemsReordering: true,
    isItemReorderable: true,
    canMoveItemToNewPosition: true,
    onItemPositionChange: true,
};
