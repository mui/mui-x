"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.CrossParentGroupOperation = exports.CrossParentLeafOperation = exports.SameParentSwapOperation = exports.BaseReorderOperation = void 0;
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var warning_1 = require("@mui/x-internals/warning");
var isDeepEqual_1 = require("@mui/x-internals/isDeepEqual");
var rowGrouping_1 = require("../rowGrouping");
var gridRowGroupingUtils_1 = require("../rowGrouping/gridRowGroupingUtils");
var utils_1 = require("./utils");
/**
 * Base class for all reorder operations.
 * Provides abstract methods for operation detection and execution.
 */
var BaseReorderOperation = /** @class */ (function () {
    function BaseReorderOperation() {
    }
    return BaseReorderOperation;
}());
exports.BaseReorderOperation = BaseReorderOperation;
/**
 * Handles reordering of items within the same parent group.
 */
var SameParentSwapOperation = /** @class */ (function (_super) {
    __extends(SameParentSwapOperation, _super);
    function SameParentSwapOperation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.operationType = 'same-parent-swap';
        return _this;
    }
    SameParentSwapOperation.prototype.detectOperation = function (ctx) {
        var sourceRowId = ctx.sourceRowId, placeholderIndex = ctx.placeholderIndex, sortedFilteredRowIds = ctx.sortedFilteredRowIds, sortedFilteredRowIndexLookup = ctx.sortedFilteredRowIndexLookup, rowTree = ctx.rowTree, apiRef = ctx.apiRef;
        var sourceNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, sourceRowId);
        if (!sourceNode || sourceNode.type === 'footer') {
            return null;
        }
        var targetIndex = placeholderIndex;
        var sourceIndex = sortedFilteredRowIndexLookup[sourceRowId];
        if (targetIndex === sortedFilteredRowIds.length && sortedFilteredRowIds.length > 0) {
            targetIndex -= 1;
        }
        var targetNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, sortedFilteredRowIds[targetIndex]);
        if (placeholderIndex > sourceIndex && sourceNode.parent === targetNode.parent) {
            targetIndex = placeholderIndex - 1;
            targetNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, sortedFilteredRowIds[targetIndex]);
            if (targetNode && targetNode.depth !== sourceNode.depth) {
                while (targetNode.depth > sourceNode.depth && targetIndex >= 0) {
                    targetIndex -= 1;
                    targetNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, sortedFilteredRowIds[targetIndex]);
                }
            }
            if (targetIndex === -1) {
                return null;
            }
        }
        var isLastChild = false;
        if (!targetNode) {
            if (placeholderIndex >= sortedFilteredRowIds.length && sortedFilteredRowIds.length > 0) {
                targetNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, sortedFilteredRowIds[sortedFilteredRowIds.length - 1]);
                isLastChild = true;
            }
            else {
                return null;
            }
        }
        var adjustedTargetNode = targetNode;
        // Case A and B adjustment
        if (targetNode.type === 'group' &&
            sourceNode.parent !== targetNode.parent &&
            sourceNode.depth > targetNode.depth) {
            var i = targetIndex - 1;
            while (i >= 0) {
                var node = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, sortedFilteredRowIds[i]);
                if (node && node.depth < sourceNode.depth) {
                    return null;
                }
                if (node && node.depth === sourceNode.depth) {
                    targetIndex = i;
                    adjustedTargetNode = node;
                    break;
                }
                i -= 1;
            }
        }
        var operationType = (0, utils_1.determineOperationType)(sourceNode, adjustedTargetNode);
        if (operationType !== 'same-parent-swap') {
            return null;
        }
        var actualTargetIndex = (0, utils_1.calculateTargetIndex)(sourceNode, adjustedTargetNode, isLastChild, rowTree);
        targetNode = adjustedTargetNode;
        if (sourceNode.type !== targetNode.type) {
            return null;
        }
        return {
            sourceNode: sourceNode,
            targetNode: targetNode,
            actualTargetIndex: actualTargetIndex,
            isLastChild: isLastChild,
            operationType: operationType,
        };
    };
    SameParentSwapOperation.prototype.executeOperation = function (operation, ctx) {
        var sourceNode = operation.sourceNode, actualTargetIndex = operation.actualTargetIndex;
        var apiRef = ctx.apiRef, sourceRowId = ctx.sourceRowId;
        apiRef.current.setState(function (state) {
            var _a;
            var group = (0, x_data_grid_pro_1.gridRowTreeSelector)(apiRef)[sourceNode.parent];
            var currentChildren = __spreadArray([], group.children, true);
            var oldIndex = currentChildren.findIndex(function (row) { return row === sourceRowId; });
            if (oldIndex === -1 || actualTargetIndex === -1 || oldIndex === actualTargetIndex) {
                return state;
            }
            currentChildren.splice(actualTargetIndex, 0, currentChildren.splice(oldIndex, 1)[0]);
            return __assign(__assign({}, state), { rows: __assign(__assign({}, state.rows), { tree: __assign(__assign({}, state.rows.tree), (_a = {}, _a[sourceNode.parent] = __assign(__assign({}, group), { children: currentChildren }), _a)) }) });
        });
        apiRef.current.publishEvent('rowsSet');
    };
    return SameParentSwapOperation;
}(BaseReorderOperation));
exports.SameParentSwapOperation = SameParentSwapOperation;
/**
 * Handles moving leaf nodes between different parent groups.
 */
var CrossParentLeafOperation = /** @class */ (function (_super) {
    __extends(CrossParentLeafOperation, _super);
    function CrossParentLeafOperation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.operationType = 'cross-parent-leaf';
        return _this;
    }
    CrossParentLeafOperation.prototype.detectOperation = function (ctx) {
        var sourceRowId = ctx.sourceRowId, placeholderIndex = ctx.placeholderIndex, sortedFilteredRowIds = ctx.sortedFilteredRowIds, rowTree = ctx.rowTree, apiRef = ctx.apiRef;
        var sourceNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, sourceRowId);
        if (!sourceNode || sourceNode.type === 'footer') {
            return null;
        }
        var targetNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, sortedFilteredRowIds[placeholderIndex]);
        var isLastChild = false;
        if (!targetNode) {
            if (placeholderIndex >= sortedFilteredRowIds.length && sortedFilteredRowIds.length > 0) {
                targetNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, sortedFilteredRowIds[sortedFilteredRowIds.length - 1]);
                isLastChild = true;
            }
            else {
                return null;
            }
        }
        var adjustedTargetNode = targetNode;
        // Case D adjustment
        if (sourceNode.type === 'leaf' &&
            targetNode.type === 'group' &&
            targetNode.depth < sourceNode.depth) {
            var prevIndex = placeholderIndex - 1;
            if (prevIndex >= 0) {
                var prevRowId = sortedFilteredRowIds[prevIndex];
                var leafTargetNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, prevRowId);
                if (leafTargetNode && leafTargetNode.type === 'leaf') {
                    adjustedTargetNode = leafTargetNode;
                    isLastChild = true;
                }
            }
        }
        var operationType = (0, utils_1.determineOperationType)(sourceNode, adjustedTargetNode);
        if (operationType !== 'cross-parent-leaf') {
            return null;
        }
        var actualTargetIndex = (0, utils_1.calculateTargetIndex)(sourceNode, adjustedTargetNode, isLastChild, rowTree);
        targetNode = adjustedTargetNode;
        // Validate depth constraints
        if (sourceNode.type === 'leaf' && targetNode.type === 'leaf') {
            if (sourceNode.depth !== targetNode.depth) {
                return null;
            }
        }
        else if (sourceNode.type === 'leaf' && targetNode.type === 'group') {
            if (targetNode.depth >= sourceNode.depth) {
                return null;
            }
        }
        return {
            sourceNode: sourceNode,
            targetNode: adjustedTargetNode,
            actualTargetIndex: actualTargetIndex,
            isLastChild: isLastChild,
            operationType: operationType,
        };
    };
    CrossParentLeafOperation.prototype.executeOperation = function (operation, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceNode, targetNode, isLastChild, apiRef, sourceRowId, processRowUpdate, onProcessRowUpdateError, target, prevIndex, prevRowId, prevNode, rowTree, sourceGroup, targetGroup, sourceChildren, targetChildren, sourceIndex, targetIndex, dataRowIdToModelLookup, columnsLookup, sanitizedRowGroupingModel, originalSourceRow, updatedSourceRow, targetRow, groupingRules, _i, groupingRules_1, groupingRule, colDef, targetGroupingValue, commitStateUpdate, params, processedRow, finalRow, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sourceNode = operation.sourceNode, targetNode = operation.targetNode, isLastChild = operation.isLastChild;
                        apiRef = ctx.apiRef, sourceRowId = ctx.sourceRowId, processRowUpdate = ctx.processRowUpdate, onProcessRowUpdateError = ctx.onProcessRowUpdateError;
                        target = targetNode;
                        if (targetNode.type === 'group') {
                            prevIndex = ctx.placeholderIndex - 1;
                            if (prevIndex >= 0) {
                                prevRowId = ctx.sortedFilteredRowIds[prevIndex];
                                prevNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, prevRowId);
                                if (prevNode && prevNode.type === 'leaf') {
                                    target = prevNode;
                                }
                            }
                        }
                        rowTree = (0, x_data_grid_pro_1.gridRowTreeSelector)(apiRef);
                        sourceGroup = rowTree[sourceNode.parent];
                        targetGroup = rowTree[target.parent];
                        sourceChildren = sourceGroup.children;
                        targetChildren = targetGroup.children;
                        sourceIndex = sourceChildren.findIndex(function (row) { return row === sourceRowId; });
                        targetIndex = targetChildren.findIndex(function (row) { return row === target.id; });
                        if (sourceIndex === -1 || targetIndex === -1) {
                            return [2 /*return*/];
                        }
                        dataRowIdToModelLookup = (0, x_data_grid_pro_1.gridRowsLookupSelector)(apiRef);
                        columnsLookup = (0, x_data_grid_pro_1.gridColumnLookupSelector)(apiRef);
                        sanitizedRowGroupingModel = (0, rowGrouping_1.gridRowGroupingSanitizedModelSelector)(apiRef);
                        originalSourceRow = dataRowIdToModelLookup[sourceRowId];
                        updatedSourceRow = __assign({}, originalSourceRow);
                        targetRow = dataRowIdToModelLookup[target.id];
                        groupingRules = (0, gridRowGroupingUtils_1.getGroupingRules)({
                            sanitizedRowGroupingModel: sanitizedRowGroupingModel,
                            columnsLookup: columnsLookup,
                        });
                        for (_i = 0, groupingRules_1 = groupingRules; _i < groupingRules_1.length; _i++) {
                            groupingRule = groupingRules_1[_i];
                            colDef = columnsLookup[groupingRule.field];
                            if (groupingRule.groupingValueSetter && colDef) {
                                targetGroupingValue = (0, gridRowGroupingUtils_1.getCellGroupingCriteria)({
                                    row: targetRow,
                                    colDef: colDef,
                                    groupingRule: groupingRule,
                                    apiRef: apiRef,
                                }).key;
                                updatedSourceRow = groupingRule.groupingValueSetter(targetGroupingValue, updatedSourceRow, colDef, apiRef);
                            }
                            else {
                                updatedSourceRow[groupingRule.field] = targetRow[groupingRule.field];
                            }
                        }
                        commitStateUpdate = function (finalSourceRow) {
                            apiRef.current.setState(function (state) {
                                var updatedSourceChildren = sourceChildren.filter(function (rowId) { return rowId !== sourceRowId; });
                                var updatedTree = __assign({}, state.rows.tree);
                                var removedGroups = new Set();
                                var rootLevelRemovals = 0;
                                if (updatedSourceChildren.length === 0) {
                                    removedGroups.add(sourceGroup.id);
                                    rootLevelRemovals = (0, utils_1.removeEmptyAncestors)(sourceGroup.parent, updatedTree, removedGroups);
                                }
                                removedGroups.forEach(function (groupId) {
                                    var group = updatedTree[groupId];
                                    if (group && group.parent && updatedTree[group.parent]) {
                                        var parent_1 = updatedTree[group.parent];
                                        updatedTree[group.parent] = __assign(__assign({}, parent_1), { children: parent_1.children.filter(function (childId) { return childId !== groupId; }) });
                                    }
                                    delete updatedTree[groupId];
                                });
                                if (!removedGroups.has(sourceGroup.id)) {
                                    updatedTree[sourceNode.parent] = __assign(__assign({}, sourceGroup), { children: updatedSourceChildren });
                                }
                                var updatedTargetChildren = isLastChild
                                    ? __spreadArray(__spreadArray([], targetChildren, true), [sourceRowId], false) : __spreadArray(__spreadArray(__spreadArray([], targetChildren.slice(0, targetIndex), true), [
                                    sourceRowId
                                ], false), targetChildren.slice(targetIndex), true);
                                updatedTree[target.parent] = __assign(__assign({}, targetGroup), { children: updatedTargetChildren });
                                updatedTree[sourceNode.id] = __assign(__assign({}, sourceNode), { parent: target.parent });
                                return __assign(__assign({}, state), { rows: __assign(__assign({}, state.rows), { totalTopLevelRowCount: state.rows.totalTopLevelRowCount - rootLevelRemovals, tree: updatedTree }) });
                            });
                            apiRef.current.updateRows([finalSourceRow]);
                            apiRef.current.publishEvent('rowsSet');
                        };
                        if (!(processRowUpdate && !(0, isDeepEqual_1.isDeepEqual)(originalSourceRow, updatedSourceRow))) return [3 /*break*/, 6];
                        params = {
                            rowId: sourceRowId,
                            previousRow: originalSourceRow,
                            updatedRow: updatedSourceRow,
                        };
                        apiRef.current.setLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, processRowUpdate(updatedSourceRow, originalSourceRow, params)];
                    case 2:
                        processedRow = _a.sent();
                        finalRow = processedRow || updatedSourceRow;
                        commitStateUpdate(finalRow);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        apiRef.current.setLoading(false);
                        if (onProcessRowUpdateError) {
                            onProcessRowUpdateError(error_1);
                        }
                        else if (process.env.NODE_ENV !== 'production') {
                            (0, warning_1.warnOnce)([
                                'MUI X: A call to `processRowUpdate()` threw an error which was not handled because `onProcessRowUpdateError()` is missing.',
                                'To handle the error pass a callback to the `onProcessRowUpdateError()` prop, for example `<DataGrid onProcessRowUpdateError={(error) => ...} />`.',
                                'For more detail, see https://mui.com/x/react-data-grid/editing/persistence/.',
                            ], 'error');
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        apiRef.current.setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        commitStateUpdate(updatedSourceRow);
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return CrossParentLeafOperation;
}(BaseReorderOperation));
exports.CrossParentLeafOperation = CrossParentLeafOperation;
/**
 * Handles moving entire groups between different parents.
 */
var CrossParentGroupOperation = /** @class */ (function (_super) {
    __extends(CrossParentGroupOperation, _super);
    function CrossParentGroupOperation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.operationType = 'cross-parent-group';
        return _this;
    }
    CrossParentGroupOperation.prototype.detectOperation = function (ctx) {
        var sourceRowId = ctx.sourceRowId, placeholderIndex = ctx.placeholderIndex, sortedFilteredRowIds = ctx.sortedFilteredRowIds, rowTree = ctx.rowTree, apiRef = ctx.apiRef;
        var sourceNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, sourceRowId);
        if (!sourceNode || sourceNode.type === 'footer') {
            return null;
        }
        var targetIndex = placeholderIndex;
        var targetNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, sortedFilteredRowIds[placeholderIndex]);
        var isLastChild = false;
        if (!targetNode) {
            if (placeholderIndex >= sortedFilteredRowIds.length && sortedFilteredRowIds.length > 0) {
                targetNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, sortedFilteredRowIds[sortedFilteredRowIds.length - 1]);
                targetIndex = sortedFilteredRowIds.length - 1;
                isLastChild = true;
            }
            else {
                return null;
            }
        }
        var adjustedTargetNode = targetNode;
        // Case G adjustment
        if (sourceNode.type === 'group' &&
            targetNode.type === 'group' &&
            sourceNode.parent !== targetNode.parent &&
            sourceNode.depth > targetNode.depth) {
            var prevIndex = targetIndex - 1;
            if (prevIndex < 0) {
                return null;
            }
            var prevNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, sortedFilteredRowIds[prevIndex]);
            if (prevNode && prevNode.depth !== sourceNode.depth) {
                while (prevNode.depth > sourceNode.depth && prevIndex >= 0) {
                    prevIndex -= 1;
                    prevNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, sortedFilteredRowIds[prevIndex]);
                }
            }
            if (!prevNode || prevNode.type !== 'group' || prevNode.depth !== sourceNode.depth) {
                return null;
            }
            isLastChild = true;
            adjustedTargetNode = prevNode;
        }
        var operationType = (0, utils_1.determineOperationType)(sourceNode, adjustedTargetNode);
        if (operationType !== 'cross-parent-group') {
            return null;
        }
        var actualTargetIndex = (0, utils_1.calculateTargetIndex)(sourceNode, adjustedTargetNode, isLastChild, rowTree);
        var operation = {
            sourceNode: sourceNode,
            targetNode: adjustedTargetNode,
            actualTargetIndex: actualTargetIndex,
            isLastChild: isLastChild,
            operationType: operationType,
        };
        targetNode = adjustedTargetNode;
        if (sourceNode.depth !== targetNode.depth) {
            return null;
        }
        return operation;
    };
    CrossParentGroupOperation.prototype.executeOperation = function (operation, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceNode, targetNode, isLastChild, apiRef, processRowUpdate, onProcessRowUpdateError, tree, dataRowIdToModelLookup, columnsLookup, sanitizedRowGroupingModel, allLeafIds, updater, groupingRules, targetParentPath, _i, allLeafIds_1, leafId, originalRow, updatedRow, _loop_1, depth, _a, successful, failed_1, updates;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sourceNode = operation.sourceNode, targetNode = operation.targetNode, isLastChild = operation.isLastChild;
                        apiRef = ctx.apiRef, processRowUpdate = ctx.processRowUpdate, onProcessRowUpdateError = ctx.onProcessRowUpdateError;
                        tree = (0, x_data_grid_pro_1.gridRowTreeSelector)(apiRef);
                        dataRowIdToModelLookup = (0, x_data_grid_pro_1.gridRowsLookupSelector)(apiRef);
                        columnsLookup = (0, x_data_grid_pro_1.gridColumnLookupSelector)(apiRef);
                        sanitizedRowGroupingModel = (0, rowGrouping_1.gridRowGroupingSanitizedModelSelector)(apiRef);
                        allLeafIds = (0, utils_1.collectAllLeafDescendants)(sourceNode, tree);
                        if (allLeafIds.length === 0) {
                            return [2 /*return*/];
                        }
                        updater = new utils_1.BatchRowUpdater(processRowUpdate, onProcessRowUpdateError);
                        groupingRules = (0, gridRowGroupingUtils_1.getGroupingRules)({
                            sanitizedRowGroupingModel: sanitizedRowGroupingModel,
                            columnsLookup: columnsLookup,
                        });
                        targetParentPath = (0, utils_1.getNodePathInTree)({ id: targetNode.parent, tree: tree });
                        for (_i = 0, allLeafIds_1 = allLeafIds; _i < allLeafIds_1.length; _i++) {
                            leafId = allLeafIds_1[_i];
                            originalRow = dataRowIdToModelLookup[leafId];
                            updatedRow = __assign({}, originalRow);
                            _loop_1 = function (depth) {
                                var pathItem = targetParentPath[depth];
                                if (pathItem.field) {
                                    var groupingRule = groupingRules.find(function (rule) { return rule.field === pathItem.field; });
                                    if (groupingRule) {
                                        var colDef = columnsLookup[groupingRule.field];
                                        if (groupingRule.groupingValueSetter && colDef) {
                                            updatedRow = groupingRule.groupingValueSetter(pathItem.key, updatedRow, colDef, apiRef);
                                        }
                                        else {
                                            updatedRow[groupingRule.field] = pathItem.key;
                                        }
                                    }
                                }
                            };
                            for (depth = 0; depth < targetParentPath.length; depth += 1) {
                                _loop_1(depth);
                            }
                            updater.queueUpdate(leafId, originalRow, updatedRow);
                        }
                        apiRef.current.setLoading(true);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, updater.executeAll()];
                    case 2:
                        _a = _b.sent(), successful = _a.successful, failed_1 = _a.failed, updates = _a.updates;
                        if (successful.length > 0) {
                            apiRef.current.setState(function (state) {
                                var updatedTree = __assign({}, state.rows.tree);
                                var treeDepths = __assign({}, state.rows.treeDepths);
                                var rootLevelRemovals = 0;
                                if (failed_1.length === 0) {
                                    var sourceParentNode = updatedTree[sourceNode.parent];
                                    if (!sourceParentNode) {
                                        var targetParentNode = updatedTree[targetNode.parent];
                                        var targetIndex = targetParentNode.children.indexOf(targetNode.id);
                                        var newTargetChildren = __spreadArray([], targetParentNode.children, true);
                                        if (isLastChild) {
                                            newTargetChildren.push(sourceNode.id);
                                        }
                                        else {
                                            newTargetChildren.splice(targetIndex, 0, sourceNode.id);
                                        }
                                        updatedTree[targetNode.parent] = __assign(__assign({}, targetParentNode), { children: newTargetChildren });
                                        updatedTree[sourceNode.id] = __assign(__assign({}, sourceNode), { parent: targetNode.parent });
                                    }
                                    else {
                                        var updatedSourceParentChildren = sourceParentNode.children.filter(function (id) { return id !== sourceNode.id; });
                                        if (updatedSourceParentChildren.length === 0) {
                                            var removedGroups = new Set();
                                            removedGroups.add(sourceNode.parent);
                                            var parentOfSourceParent = updatedTree[sourceNode.parent]
                                                .parent;
                                            if (parentOfSourceParent) {
                                                rootLevelRemovals = (0, utils_1.removeEmptyAncestors)(parentOfSourceParent, updatedTree, removedGroups);
                                            }
                                            removedGroups.forEach(function (groupId) {
                                                var group = updatedTree[groupId];
                                                if (group && group.parent && updatedTree[group.parent]) {
                                                    var parent_2 = updatedTree[group.parent];
                                                    updatedTree[group.parent] = __assign(__assign({}, parent_2), { children: parent_2.children.filter(function (childId) { return childId !== groupId; }) });
                                                }
                                                delete updatedTree[groupId];
                                            });
                                        }
                                        else {
                                            updatedTree[sourceNode.parent] = __assign(__assign({}, sourceParentNode), { children: updatedSourceParentChildren });
                                        }
                                        var targetParentNode = updatedTree[targetNode.parent];
                                        var sourceGroupNode = sourceNode;
                                        var existingGroup_1 = sourceGroupNode.groupingKey !== null && sourceGroupNode.groupingField !== null
                                            ? (0, utils_1.findExistingGroupWithSameKey)(targetParentNode, sourceGroupNode.groupingKey, sourceGroupNode.groupingField, updatedTree)
                                            : null;
                                        if (existingGroup_1) {
                                            var updatedExistingGroup = __assign(__assign({}, existingGroup_1), { children: __spreadArray(__spreadArray([], existingGroup_1.children, true), sourceGroupNode.children, true) });
                                            updatedTree[existingGroup_1.id] = updatedExistingGroup;
                                            sourceGroupNode.children.forEach(function (childId) {
                                                var childNode = updatedTree[childId];
                                                if (childNode) {
                                                    updatedTree[childId] = __assign(__assign({}, childNode), { parent: existingGroup_1.id });
                                                }
                                            });
                                            delete updatedTree[sourceNode.id];
                                        }
                                        else {
                                            var targetIndex = targetParentNode.children.indexOf(targetNode.id);
                                            var newTargetChildren = __spreadArray([], targetParentNode.children, true);
                                            if (isLastChild) {
                                                newTargetChildren.push(sourceNode.id);
                                            }
                                            else {
                                                newTargetChildren.splice(targetIndex, 0, sourceNode.id);
                                            }
                                            updatedTree[targetNode.parent] = __assign(__assign({}, targetParentNode), { children: newTargetChildren });
                                            updatedTree[sourceNode.id] = __assign(__assign({}, sourceNode), { parent: targetNode.parent });
                                        }
                                    }
                                }
                                return __assign(__assign({}, state), { rows: __assign(__assign({}, state.rows), { totalTopLevelRowCount: state.rows.totalTopLevelRowCount - rootLevelRemovals, tree: updatedTree, treeDepths: treeDepths }) });
                            });
                            apiRef.current.updateRows(updates);
                            apiRef.current.publishEvent('rowsSet');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        apiRef.current.setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return CrossParentGroupOperation;
}(BaseReorderOperation));
exports.CrossParentGroupOperation = CrossParentGroupOperation;
