"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propagateSelection = exports.getAddedAndRemovedItems = exports.getLookupFromArray = void 0;
var useTreeViewSelection_selectors_1 = require("./useTreeViewSelection.selectors");
var useTreeViewItems_selectors_1 = require("../useTreeViewItems/useTreeViewItems.selectors");
var getLookupFromArray = function (array) {
    var lookup = {};
    array.forEach(function (itemId) {
        lookup[itemId] = true;
    });
    return lookup;
};
exports.getLookupFromArray = getLookupFromArray;
var getAddedAndRemovedItems = function (_a) {
    var store = _a.store, oldModel = _a.oldModel, newModel = _a.newModel;
    var newModelMap = new Map();
    newModel.forEach(function (id) {
        newModelMap.set(id, true);
    });
    return {
        added: newModel.filter(function (itemId) { return !(0, useTreeViewSelection_selectors_1.selectorIsItemSelected)(store.value, itemId); }),
        removed: oldModel.filter(function (itemId) { return !newModelMap.has(itemId); }),
    };
};
exports.getAddedAndRemovedItems = getAddedAndRemovedItems;
var propagateSelection = function (_a) {
    var store = _a.store, selectionPropagation = _a.selectionPropagation, newModel = _a.newModel, oldModel = _a.oldModel, additionalItemsToPropagate = _a.additionalItemsToPropagate;
    if (!selectionPropagation.descendants && !selectionPropagation.parents) {
        return newModel;
    }
    var shouldRegenerateModel = false;
    var newModelLookup = (0, exports.getLookupFromArray)(newModel);
    var changes = (0, exports.getAddedAndRemovedItems)({
        store: store,
        newModel: newModel,
        oldModel: oldModel,
    });
    additionalItemsToPropagate === null || additionalItemsToPropagate === void 0 ? void 0 : additionalItemsToPropagate.forEach(function (itemId) {
        if (newModelLookup[itemId]) {
            if (!changes.added.includes(itemId)) {
                changes.added.push(itemId);
            }
        }
        else if (!changes.removed.includes(itemId)) {
            changes.removed.push(itemId);
        }
    });
    changes.added.forEach(function (addedItemId) {
        if (selectionPropagation.descendants) {
            var selectDescendants_1 = function (itemId) {
                if (itemId !== addedItemId) {
                    shouldRegenerateModel = true;
                    newModelLookup[itemId] = true;
                }
                (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(store.value, itemId).forEach(selectDescendants_1);
            };
            selectDescendants_1(addedItemId);
        }
        if (selectionPropagation.parents) {
            var checkAllDescendantsSelected_1 = function (itemId) {
                if (!newModelLookup[itemId]) {
                    return false;
                }
                var children = (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(store.value, itemId);
                return children.every(checkAllDescendantsSelected_1);
            };
            var selectParents_1 = function (itemId) {
                var parentId = (0, useTreeViewItems_selectors_1.selectorItemParentId)(store.value, itemId);
                if (parentId == null) {
                    return;
                }
                var siblings = (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(store.value, parentId);
                if (siblings.every(checkAllDescendantsSelected_1)) {
                    shouldRegenerateModel = true;
                    newModelLookup[parentId] = true;
                    selectParents_1(parentId);
                }
            };
            selectParents_1(addedItemId);
        }
    });
    changes.removed.forEach(function (removedItemId) {
        if (selectionPropagation.parents) {
            var parentId = (0, useTreeViewItems_selectors_1.selectorItemParentId)(store.value, removedItemId);
            while (parentId != null) {
                if (newModelLookup[parentId]) {
                    shouldRegenerateModel = true;
                    delete newModelLookup[parentId];
                }
                parentId = (0, useTreeViewItems_selectors_1.selectorItemParentId)(store.value, parentId);
            }
        }
        if (selectionPropagation.descendants) {
            var deSelectDescendants_1 = function (itemId) {
                if (itemId !== removedItemId) {
                    shouldRegenerateModel = true;
                    delete newModelLookup[itemId];
                }
                (0, useTreeViewItems_selectors_1.selectorItemOrderedChildrenIds)(store.value, itemId).forEach(deSelectDescendants_1);
            };
            deSelectDescendants_1(removedItemId);
        }
    });
    return shouldRegenerateModel ? Object.keys(newModelLookup) : newModel;
};
exports.propagateSelection = propagateSelection;
