"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRowsToDeselect = exports.findRowsToSelect = exports.checkboxPropsSelector = exports.ROW_SELECTION_PROPAGATION_DEFAULT = void 0;
exports.isMultipleRowSelectionEnabled = isMultipleRowSelectionEnabled;
var signature_1 = require("../../../constants/signature");
var gridRowsUtils_1 = require("../rows/gridRowsUtils");
var gridFilterSelector_1 = require("../filter/gridFilterSelector");
var gridSortingSelector_1 = require("../sorting/gridSortingSelector");
var gridRowSelectionSelector_1 = require("./gridRowSelectionSelector");
var gridRowsSelector_1 = require("../rows/gridRowsSelector");
var createSelector_1 = require("../../../utils/createSelector");
exports.ROW_SELECTION_PROPAGATION_DEFAULT = {
    parents: true,
    descendants: true,
};
function getGridRowGroupSelectableDescendants(apiRef, groupId) {
    var _a;
    var rowTree = (0, gridRowsSelector_1.gridRowTreeSelector)(apiRef);
    var sortedRowIds = (0, gridSortingSelector_1.gridSortedRowIdsSelector)(apiRef);
    var filteredRowsLookup = (0, gridFilterSelector_1.gridFilteredRowsLookupSelector)(apiRef);
    var groupNode = rowTree[groupId];
    if (!groupNode || groupNode.type !== 'group') {
        return [];
    }
    var descendants = [];
    var startIndex = sortedRowIds.findIndex(function (id) { return id === groupId; }) + 1;
    for (var index = startIndex; index < sortedRowIds.length && ((_a = rowTree[sortedRowIds[index]]) === null || _a === void 0 ? void 0 : _a.depth) > groupNode.depth; index += 1) {
        var id = sortedRowIds[index];
        if (filteredRowsLookup[id] !== false && apiRef.current.isRowSelectable(id)) {
            descendants.push(id);
        }
    }
    return descendants;
}
exports.checkboxPropsSelector = (0, createSelector_1.createSelector)(gridRowsSelector_1.gridRowTreeSelector, gridFilterSelector_1.gridFilteredRowsLookupSelector, gridRowSelectionSelector_1.gridRowSelectionManagerSelector, function (rowTree, filteredRowsLookup, rowSelectionManager, _a) {
    var groupId = _a.groupId, autoSelectParents = _a.autoSelectParents;
    var groupNode = rowTree[groupId];
    if (!groupNode || groupNode.type !== 'group' || rowSelectionManager.has(groupId)) {
        return {
            isIndeterminate: false,
            isChecked: rowSelectionManager.has(groupId),
        };
    }
    var hasSelectedDescendant = false;
    var hasUnSelectedDescendant = false;
    var traverseDescendants = function (itemToTraverseId) {
        if (filteredRowsLookup[itemToTraverseId] === false ||
            // Perf: Skip checking the rest of the descendants if we already
            // know that there is a selected and an unselected descendant
            (hasSelectedDescendant && hasUnSelectedDescendant)) {
            return;
        }
        var node = rowTree[itemToTraverseId];
        if ((node === null || node === void 0 ? void 0 : node.type) === 'group') {
            node.children.forEach(traverseDescendants);
        }
        if (rowSelectionManager.has(itemToTraverseId)) {
            hasSelectedDescendant = true;
        }
        else {
            hasUnSelectedDescendant = true;
        }
    };
    traverseDescendants(groupId);
    return {
        isIndeterminate: hasSelectedDescendant && hasUnSelectedDescendant,
        isChecked: autoSelectParents ? hasSelectedDescendant && !hasUnSelectedDescendant : false,
    };
});
function isMultipleRowSelectionEnabled(props) {
    if (props.signature === signature_1.GridSignature.DataGrid) {
        // DataGrid Community has multiple row selection enabled only if checkbox selection is enabled.
        return props.checkboxSelection && props.disableMultipleRowSelection !== true;
    }
    return !props.disableMultipleRowSelection;
}
var getRowNodeParents = function (tree, id) {
    var parents = [];
    var parent = id;
    while (parent != null && parent !== gridRowsUtils_1.GRID_ROOT_GROUP_ID) {
        var node = tree[parent];
        if (!node) {
            return parents;
        }
        parents.push(parent);
        parent = node.parent;
    }
    return parents;
};
var getFilteredRowNodeSiblings = function (tree, filteredRows, id) {
    var node = tree[id];
    if (!node) {
        return [];
    }
    var parent = node.parent;
    if (parent == null) {
        return [];
    }
    var parentNode = tree[parent];
    return parentNode.children.filter(function (childId) { return childId !== id && filteredRows[childId] !== false; });
};
var findRowsToSelect = function (apiRef, tree, selectedRow, autoSelectDescendants, autoSelectParents, addRow, rowSelectionManager) {
    if (rowSelectionManager === void 0) { rowSelectionManager = (0, gridRowSelectionSelector_1.gridRowSelectionManagerSelector)(apiRef); }
    var filteredRows = (0, gridFilterSelector_1.gridFilteredRowsLookupSelector)(apiRef);
    var selectedDescendants = new Set([]);
    if ((!autoSelectDescendants && !autoSelectParents) || filteredRows[selectedRow] === false) {
        return;
    }
    if (autoSelectDescendants) {
        var rowNode = tree[selectedRow];
        if ((rowNode === null || rowNode === void 0 ? void 0 : rowNode.type) === 'group') {
            var descendants = getGridRowGroupSelectableDescendants(apiRef, selectedRow);
            descendants.forEach(function (rowId) {
                addRow(rowId);
                selectedDescendants.add(rowId);
            });
        }
    }
    if (autoSelectParents) {
        var checkAllDescendantsSelected_1 = function (rowId) {
            if (!rowSelectionManager.has(rowId) && !selectedDescendants.has(rowId)) {
                return false;
            }
            var node = tree[rowId];
            if (!node) {
                return false;
            }
            if (node.type !== 'group') {
                return true;
            }
            return node.children.every(checkAllDescendantsSelected_1);
        };
        var traverseParents_1 = function (rowId) {
            var siblings = getFilteredRowNodeSiblings(tree, filteredRows, rowId);
            if (siblings.length === 0 || siblings.every(checkAllDescendantsSelected_1)) {
                var rowNode_1 = tree[rowId];
                var parent_1 = rowNode_1 === null || rowNode_1 === void 0 ? void 0 : rowNode_1.parent;
                if (parent_1 != null &&
                    parent_1 !== gridRowsUtils_1.GRID_ROOT_GROUP_ID &&
                    apiRef.current.isRowSelectable(parent_1)) {
                    addRow(parent_1);
                    selectedDescendants.add(parent_1);
                    traverseParents_1(parent_1);
                }
            }
        };
        // For root level rows, we don't need to traverse parents
        var rowNode = tree[selectedRow];
        if (!rowNode || rowNode.parent === gridRowsUtils_1.GRID_ROOT_GROUP_ID) {
            return;
        }
        traverseParents_1(selectedRow);
    }
};
exports.findRowsToSelect = findRowsToSelect;
var findRowsToDeselect = function (apiRef, tree, deselectedRow, autoSelectDescendants, autoSelectParents, removeRow) {
    var rowSelectionManager = (0, gridRowSelectionSelector_1.gridRowSelectionManagerSelector)(apiRef);
    if (!autoSelectParents && !autoSelectDescendants) {
        return;
    }
    if (autoSelectParents) {
        var allParents = getRowNodeParents(tree, deselectedRow);
        allParents.forEach(function (parent) {
            var isSelected = rowSelectionManager.has(parent);
            if (isSelected) {
                removeRow(parent);
            }
        });
    }
    if (autoSelectDescendants) {
        var rowNode = tree[deselectedRow];
        if ((rowNode === null || rowNode === void 0 ? void 0 : rowNode.type) === 'group') {
            var descendants = getGridRowGroupSelectableDescendants(apiRef, deselectedRow);
            descendants.forEach(function (descendant) {
                removeRow(descendant);
            });
        }
    }
};
exports.findRowsToDeselect = findRowsToDeselect;
