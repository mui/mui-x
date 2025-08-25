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
exports.useGridRowsPreProcessors = void 0;
var strategyProcessing_1 = require("../../core/strategyProcessing");
var gridRowsUtils_1 = require("./gridRowsUtils");
var createFlatRowTree = function (rows) {
    var _a;
    var tree = (_a = {},
        _a[gridRowsUtils_1.GRID_ROOT_GROUP_ID] = __assign(__assign({}, (0, gridRowsUtils_1.buildRootGroup)()), { children: rows }),
        _a);
    for (var i = 0; i < rows.length; i += 1) {
        var rowId = rows[i];
        tree[rowId] = {
            id: rowId,
            depth: 0,
            parent: gridRowsUtils_1.GRID_ROOT_GROUP_ID,
            type: 'leaf',
            groupingKey: null,
        };
    }
    return {
        groupingName: strategyProcessing_1.GRID_DEFAULT_STRATEGY,
        tree: tree,
        treeDepths: { 0: rows.length },
        dataRowIds: rows,
    };
};
var updateFlatRowTree = function (_a) {
    var previousTree = _a.previousTree, actions = _a.actions;
    var tree = __assign({}, previousTree);
    var idsToRemoveFromRootGroup = {};
    for (var i = 0; i < actions.remove.length; i += 1) {
        var idToDelete = actions.remove[i];
        idsToRemoveFromRootGroup[idToDelete] = true;
        delete tree[idToDelete];
    }
    for (var i = 0; i < actions.insert.length; i += 1) {
        var idToInsert = actions.insert[i];
        tree[idToInsert] = {
            id: idToInsert,
            depth: 0,
            parent: gridRowsUtils_1.GRID_ROOT_GROUP_ID,
            type: 'leaf',
            groupingKey: null,
        };
    }
    // TODO rows v6: Support row unpinning
    var rootGroup = tree[gridRowsUtils_1.GRID_ROOT_GROUP_ID];
    var rootGroupChildren = __spreadArray(__spreadArray([], rootGroup.children, true), actions.insert, true);
    if (Object.values(idsToRemoveFromRootGroup).length) {
        rootGroupChildren = rootGroupChildren.filter(function (id) { return !idsToRemoveFromRootGroup[id]; });
    }
    tree[gridRowsUtils_1.GRID_ROOT_GROUP_ID] = __assign(__assign({}, rootGroup), { children: rootGroupChildren });
    return {
        groupingName: strategyProcessing_1.GRID_DEFAULT_STRATEGY,
        tree: tree,
        treeDepths: { 0: rootGroupChildren.length },
        dataRowIds: rootGroupChildren,
    };
};
var flatRowTreeCreationMethod = function (params) {
    if (params.updates.type === 'full') {
        return createFlatRowTree(params.updates.rows);
    }
    return updateFlatRowTree({ previousTree: params.previousTree, actions: params.updates.actions });
};
var useGridRowsPreProcessors = function (apiRef) {
    (0, strategyProcessing_1.useGridRegisterStrategyProcessor)(apiRef, strategyProcessing_1.GRID_DEFAULT_STRATEGY, 'rowTreeCreation', flatRowTreeCreationMethod);
};
exports.useGridRowsPreProcessors = useGridRowsPreProcessors;
