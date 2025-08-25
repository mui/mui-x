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
exports.updateRowTree = void 0;
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var isDeepEqual_1 = require("@mui/x-internals/isDeepEqual");
var insertDataRowInTree_1 = require("./insertDataRowInTree");
var removeDataRowFromTree_1 = require("./removeDataRowFromTree");
var utils_1 = require("./utils");
var updateRowTree = function (params) {
    var tree = __assign({}, params.previousTree);
    var treeDepths = __assign({}, params.previousTreeDepth);
    var updatedGroupsManager = (0, utils_1.createUpdatedGroupsManager)();
    var groupsToFetch = params.previousGroupsToFetch
        ? new Set(__spreadArray([], params.previousGroupsToFetch, true))
        : new Set([]);
    for (var i = 0; i < params.nodes.inserted.length; i += 1) {
        var _a = params.nodes.inserted[i], id = _a.id, path = _a.path, serverChildrenCount = _a.serverChildrenCount;
        (0, insertDataRowInTree_1.insertDataRowInTree)({
            previousTree: params.previousTree,
            tree: tree,
            treeDepths: treeDepths,
            updatedGroupsManager: updatedGroupsManager,
            id: id,
            path: path,
            serverChildrenCount: serverChildrenCount,
            onDuplicatePath: params.onDuplicatePath,
            isGroupExpandedByDefault: params.isGroupExpandedByDefault,
            defaultGroupingExpansionDepth: params.defaultGroupingExpansionDepth,
            groupsToFetch: groupsToFetch,
        });
    }
    for (var i = 0; i < params.nodes.removed.length; i += 1) {
        var nodeId = params.nodes.removed[i];
        (0, removeDataRowFromTree_1.removeDataRowFromTree)({
            tree: tree,
            treeDepths: treeDepths,
            updatedGroupsManager: updatedGroupsManager,
            id: nodeId,
            groupingName: params.groupingName,
        });
    }
    for (var i = 0; i < params.nodes.modified.length; i += 1) {
        var _b = params.nodes.modified[i], id = _b.id, path = _b.path, serverChildrenCount = _b.serverChildrenCount;
        var pathInPreviousTree = (0, utils_1.getNodePathInTree)({ tree: tree, id: id });
        var isInSameGroup = (0, isDeepEqual_1.isDeepEqual)(pathInPreviousTree, path);
        if (!isInSameGroup) {
            (0, removeDataRowFromTree_1.removeDataRowFromTree)({
                tree: tree,
                treeDepths: treeDepths,
                updatedGroupsManager: updatedGroupsManager,
                id: id,
                groupingName: params.groupingName,
            });
            (0, insertDataRowInTree_1.insertDataRowInTree)({
                previousTree: params.previousTree,
                tree: tree,
                treeDepths: treeDepths,
                updatedGroupsManager: updatedGroupsManager,
                id: id,
                path: path,
                serverChildrenCount: serverChildrenCount,
                onDuplicatePath: params.onDuplicatePath,
                isGroupExpandedByDefault: params.isGroupExpandedByDefault,
                defaultGroupingExpansionDepth: params.defaultGroupingExpansionDepth,
                groupsToFetch: groupsToFetch,
            });
        }
        else {
            updatedGroupsManager === null || updatedGroupsManager === void 0 ? void 0 : updatedGroupsManager.addAction(tree[id].parent, 'modifyChildren');
        }
    }
    // TODO rows v6: Avoid walking the whole tree, we should be able to generate the new list only using slices.
    var dataRowIds = (0, internals_1.getTreeNodeDescendants)(tree, x_data_grid_1.GRID_ROOT_GROUP_ID, true);
    return {
        tree: tree,
        treeDepths: treeDepths,
        groupingName: params.groupingName,
        dataRowIds: dataRowIds,
        updatedGroupsManager: updatedGroupsManager,
        groupsToFetch: Array.from(groupsToFetch),
    };
};
exports.updateRowTree = updateRowTree;
