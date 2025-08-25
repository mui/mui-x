"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRowTree = void 0;
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var insertDataRowInTree_1 = require("./insertDataRowInTree");
/**
 * Transform a list of rows into a tree structure where each row references its parent and children.
 */
var createRowTree = function (params) {
    var _a;
    var dataRowIds = [];
    var tree = (_a = {},
        _a[x_data_grid_1.GRID_ROOT_GROUP_ID] = (0, internals_1.buildRootGroup)(),
        _a);
    var treeDepths = {};
    var groupsToFetch = new Set();
    for (var i = 0; i < params.nodes.length; i += 1) {
        var node = params.nodes[i];
        dataRowIds.push(node.id);
        (0, insertDataRowInTree_1.insertDataRowInTree)({
            tree: tree,
            previousTree: params.previousTree,
            id: node.id,
            path: node.path,
            serverChildrenCount: node.serverChildrenCount,
            onDuplicatePath: params.onDuplicatePath,
            treeDepths: treeDepths,
            isGroupExpandedByDefault: params.isGroupExpandedByDefault,
            defaultGroupingExpansionDepth: params.defaultGroupingExpansionDepth,
            groupsToFetch: groupsToFetch,
        });
    }
    return {
        tree: tree,
        treeDepths: treeDepths,
        groupingName: params.groupingName,
        dataRowIds: dataRowIds,
        groupsToFetch: Array.from(groupsToFetch),
    };
};
exports.createRowTree = createRowTree;
