"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipFiltering = skipFiltering;
exports.skipSorting = skipSorting;
exports.getParentPath = getParentPath;
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
function skipFiltering(rowTree) {
    var _a;
    var filteredChildrenCountLookup = {};
    var nodes = Object.values(rowTree);
    for (var i = 0; i < nodes.length; i += 1) {
        var node = nodes[i];
        filteredChildrenCountLookup[node.id] = (_a = node.serverChildrenCount) !== null && _a !== void 0 ? _a : 0;
    }
    return {
        filteredRowsLookup: internals_1.defaultGridFilterLookup.filteredRowsLookup,
        filteredChildrenCountLookup: filteredChildrenCountLookup,
        filteredDescendantCountLookup: internals_1.defaultGridFilterLookup.filteredDescendantCountLookup,
    };
}
function skipSorting(rowTree) {
    return (0, internals_1.getTreeNodeDescendants)(rowTree, x_data_grid_1.GRID_ROOT_GROUP_ID, false);
}
/**
 * Retrieves the parent path for a row from the previous tree state.
 * Used during full tree updates to maintain correct hierarchy.
 */
function getParentPath(rowId, treeCreationParams) {
    var _a;
    if (treeCreationParams.updates.type !== 'full' ||
        !((_a = treeCreationParams.previousTree) === null || _a === void 0 ? void 0 : _a[rowId]) ||
        treeCreationParams.previousTree[rowId].depth < 1 ||
        !('path' in treeCreationParams.previousTree[rowId])) {
        return [];
    }
    return treeCreationParams.previousTree[rowId].path || [];
}
