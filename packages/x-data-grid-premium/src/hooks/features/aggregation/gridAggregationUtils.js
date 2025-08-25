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
exports.defaultGetAggregationPosition = exports.getAggregationFunctionLabel = exports.areAggregationRulesEqual = exports.addFooterRows = exports.getAggregationRules = exports.mergeStateWithAggregationModel = exports.getAvailableAggregationFunctions = exports.canColumnHaveAggregationFunction = exports.getAggregationFooterRowIdFromGroupId = exports.GRID_AGGREGATION_ROOT_FOOTER_ROW_ID = void 0;
var capitalize_1 = require("@mui/utils/capitalize");
var internals_1 = require("@mui/x-data-grid/internals");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_2 = require("@mui/x-data-grid-pro/internals");
var isDeepEqual_1 = require("@mui/x-internals/isDeepEqual");
exports.GRID_AGGREGATION_ROOT_FOOTER_ROW_ID = 'auto-generated-group-footer-root';
var getAggregationFooterRowIdFromGroupId = function (groupId) {
    if (groupId == null) {
        return exports.GRID_AGGREGATION_ROOT_FOOTER_ROW_ID;
    }
    return "auto-generated-group-footer-".concat(groupId);
};
exports.getAggregationFooterRowIdFromGroupId = getAggregationFooterRowIdFromGroupId;
var isClientSideAggregateFunction = function (aggregationFunction) {
    return !!aggregationFunction && 'apply' in aggregationFunction;
};
var canColumnHaveAggregationFunction = function (_a) {
    var colDef = _a.colDef, aggregationFunctionName = _a.aggregationFunctionName, aggregationFunction = _a.aggregationFunction, isDataSource = _a.isDataSource;
    if (!colDef) {
        return false;
    }
    if (!isClientSideAggregateFunction(aggregationFunction) && !isDataSource) {
        return false;
    }
    if (colDef.availableAggregationFunctions != null) {
        return colDef.availableAggregationFunctions.includes(aggregationFunctionName);
    }
    if (!(aggregationFunction === null || aggregationFunction === void 0 ? void 0 : aggregationFunction.columnTypes)) {
        return true;
    }
    return aggregationFunction.columnTypes.includes(colDef.type);
};
exports.canColumnHaveAggregationFunction = canColumnHaveAggregationFunction;
var getAvailableAggregationFunctions = function (_a) {
    var aggregationFunctions = _a.aggregationFunctions, colDef = _a.colDef, isDataSource = _a.isDataSource;
    return Object.keys(aggregationFunctions).filter(function (aggregationFunctionName) {
        return (0, exports.canColumnHaveAggregationFunction)({
            colDef: colDef,
            aggregationFunctionName: aggregationFunctionName,
            aggregationFunction: aggregationFunctions[aggregationFunctionName],
            isDataSource: isDataSource,
        });
    });
};
exports.getAvailableAggregationFunctions = getAvailableAggregationFunctions;
var mergeStateWithAggregationModel = function (aggregationModel) {
    return function (state) { return (__assign(__assign({}, state), { aggregation: __assign(__assign({}, state.aggregation), { model: aggregationModel }) })); };
};
exports.mergeStateWithAggregationModel = mergeStateWithAggregationModel;
var getAggregationRules = function (columnsLookup, aggregationModel, aggregationFunctions, isDataSource) {
    var aggregationRules = {};
    // eslint-disable-next-line guard-for-in
    for (var field in aggregationModel) {
        var columnItem = aggregationModel[field];
        if (columnsLookup[field] &&
            (0, exports.canColumnHaveAggregationFunction)({
                colDef: columnsLookup[field],
                aggregationFunctionName: columnItem,
                aggregationFunction: aggregationFunctions[columnItem],
                isDataSource: isDataSource,
            })) {
            aggregationRules[field] = {
                aggregationFunctionName: columnItem,
                aggregationFunction: aggregationFunctions[columnItem],
            };
        }
    }
    return aggregationRules;
};
exports.getAggregationRules = getAggregationRules;
/**
 * Add a footer for each group that has at least one column with an aggregated value.
 */
var addFooterRows = function (_a) {
    var groupingParams = _a.groupingParams, apiRef = _a.apiRef, getAggregationPosition = _a.getAggregationPosition, hasAggregationRule = _a.hasAggregationRule;
    var newGroupingParams = __assign(__assign({}, groupingParams), { tree: __assign({}, groupingParams.tree), treeDepths: __assign({}, groupingParams.treeDepths) });
    var updateChildGroupFooter = function (groupNode) {
        var shouldHaveFooter = hasAggregationRule && getAggregationPosition(groupNode) === 'footer';
        if (shouldHaveFooter) {
            var footerId = (0, exports.getAggregationFooterRowIdFromGroupId)(groupNode.id);
            if (groupNode.footerId !== footerId) {
                if (groupNode.footerId != null) {
                    (0, internals_2.removeNodeFromTree)({
                        node: newGroupingParams.tree[groupNode.footerId],
                        tree: newGroupingParams.tree,
                        treeDepths: newGroupingParams.treeDepths,
                    });
                }
                var footerNode = {
                    id: footerId,
                    parent: groupNode.id,
                    depth: groupNode ? groupNode.depth + 1 : 0,
                    type: 'footer',
                };
                (0, internals_2.insertNodeInTree)(footerNode, newGroupingParams.tree, newGroupingParams.treeDepths, null);
            }
        }
        else if (groupNode.footerId != null) {
            (0, internals_2.removeNodeFromTree)({
                node: newGroupingParams.tree[groupNode.footerId],
                tree: newGroupingParams.tree,
                treeDepths: newGroupingParams.treeDepths,
            });
            newGroupingParams.tree[groupNode.id] = __assign(__assign({}, newGroupingParams.tree[groupNode.id]), { footerId: null });
        }
    };
    var updateRootGroupFooter = function (groupNode) {
        var _a;
        var shouldHaveFooter = hasAggregationRule &&
            getAggregationPosition(groupNode) === 'footer' &&
            groupNode.children.length > 0;
        if (shouldHaveFooter) {
            var rowId = (0, exports.getAggregationFooterRowIdFromGroupId)(null);
            newGroupingParams = (0, internals_2.addPinnedRow)({
                groupingParams: newGroupingParams,
                rowModel: (_a = {}, _a[internals_1.GRID_ID_AUTOGENERATED] = rowId, _a),
                rowId: rowId,
                position: 'bottom',
                apiRef: apiRef,
                isAutoGenerated: true,
            });
        }
    };
    var updateGroupFooter = function (groupNode) {
        if (groupNode.id === x_data_grid_pro_1.GRID_ROOT_GROUP_ID) {
            updateRootGroupFooter(groupNode);
        }
        else {
            updateChildGroupFooter(groupNode);
        }
        groupNode.children.forEach(function (childId) {
            var childNode = newGroupingParams.tree[childId];
            if (childNode.type === 'group') {
                updateGroupFooter(childNode);
            }
        });
    };
    updateGroupFooter(newGroupingParams.tree[x_data_grid_pro_1.GRID_ROOT_GROUP_ID]);
    return newGroupingParams;
};
exports.addFooterRows = addFooterRows;
/**
 * Compares two sets of aggregation rules to determine if they are equal or not.
 */
var areAggregationRulesEqual = function (previousValue, newValue) {
    var previousFields = Object.keys(previousValue !== null && previousValue !== void 0 ? previousValue : {});
    var newFields = Object.keys(newValue);
    if (!(0, isDeepEqual_1.isDeepEqual)(previousFields, newFields)) {
        return false;
    }
    return newFields.every(function (field) {
        var previousRule = previousValue === null || previousValue === void 0 ? void 0 : previousValue[field];
        var newRule = newValue[field];
        if ((previousRule === null || previousRule === void 0 ? void 0 : previousRule.aggregationFunction) !== (newRule === null || newRule === void 0 ? void 0 : newRule.aggregationFunction)) {
            return false;
        }
        if ((previousRule === null || previousRule === void 0 ? void 0 : previousRule.aggregationFunctionName) !== (newRule === null || newRule === void 0 ? void 0 : newRule.aggregationFunctionName)) {
            return false;
        }
        return true;
    });
};
exports.areAggregationRulesEqual = areAggregationRulesEqual;
var getAggregationFunctionLabel = function (_a) {
    var apiRef = _a.apiRef, aggregationRule = _a.aggregationRule;
    if (aggregationRule.aggregationFunction.label != null) {
        return aggregationRule.aggregationFunction.label;
    }
    try {
        return apiRef.current.getLocaleText("aggregationFunctionLabel".concat((0, capitalize_1.default)(aggregationRule.aggregationFunctionName)));
    }
    catch (_b) {
        return aggregationRule.aggregationFunctionName;
    }
};
exports.getAggregationFunctionLabel = getAggregationFunctionLabel;
var defaultGetAggregationPosition = function (groupNode) {
    return groupNode.depth === -1 ? 'footer' : 'inline';
};
exports.defaultGetAggregationPosition = defaultGetAggregationPosition;
