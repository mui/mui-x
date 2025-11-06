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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrapColumnFromAggregation = exports.wrapColumnWithAggregationValue = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var gridAggregationSelectors_1 = require("./gridAggregationSelectors");
var GridFooterCell_1 = require("../../../components/GridFooterCell");
var GridAggregationHeader_1 = require("../../../components/GridAggregationHeader");
var gridPivotingSelectors_1 = require("../pivoting/gridPivotingSelectors");
var getAggregationValueWrappedRenderCell = function (_a) {
    var renderCell = _a.value, aggregationRule = _a.aggregationRule, getCellAggregationResult = _a.getCellAggregationResult, apiRef = _a.apiRef;
    var pivotActive = (0, gridPivotingSelectors_1.gridPivotActiveSelector)(apiRef);
    var wrappedRenderCell = function (params) {
        var _a;
        var cellAggregationResult = getCellAggregationResult(params.id, params.field);
        if (cellAggregationResult != null) {
            if (!renderCell) {
                if (cellAggregationResult.position === 'footer') {
                    return (0, jsx_runtime_1.jsx)(GridFooterCell_1.GridFooterCell, __assign({}, params));
                }
                if (pivotActive && cellAggregationResult.value === 0) {
                    return null;
                }
                return params.formattedValue;
            }
            if (pivotActive && cellAggregationResult.value === 0) {
                return null;
            }
            var aggregationMeta = {
                hasCellUnit: (_a = aggregationRule.aggregationFunction.hasCellUnit) !== null && _a !== void 0 ? _a : true,
                aggregationFunctionName: aggregationRule.aggregationFunctionName,
            };
            return renderCell(__assign(__assign({}, params), { aggregation: aggregationMeta }));
        }
        if (!renderCell) {
            return params.formattedValue;
        }
        return renderCell(params);
    };
    return wrappedRenderCell;
};
/**
 * Add the aggregation method around the header name
 */
var getWrappedRenderHeader = function (_a) {
    var renderHeader = _a.value, aggregationRule = _a.aggregationRule;
    var wrappedRenderHeader = function (params) {
        // TODO: investigate why colDef is undefined
        if (!params.colDef) {
            return null;
        }
        return ((0, jsx_runtime_1.jsx)(GridAggregationHeader_1.GridAggregationHeader, __assign({}, params, { aggregation: { aggregationRule: aggregationRule }, renderHeader: renderHeader })));
    };
    return wrappedRenderHeader;
};
/**
 * Add a wrapper around each wrappable property of the column to customize the behavior of the aggregation cells.
 */
var wrapColumnWithAggregationValue = function (column, aggregationRule, apiRef) {
    var getCellAggregationResult = function (id, field) {
        var _a, _b, _c;
        var cellAggregationPosition = null;
        var rowNode = (0, x_data_grid_pro_1.gridRowNodeSelector)(apiRef, id);
        if (!rowNode) {
            return null;
        }
        if (rowNode.type === 'group') {
            cellAggregationPosition = 'inline';
        }
        else if (id.toString().startsWith('auto-generated-group-footer-')) {
            cellAggregationPosition = 'footer';
        }
        if (cellAggregationPosition == null) {
            return null;
        }
        // TODO: Add custom root id
        var groupId = cellAggregationPosition === 'inline' ? id : ((_a = rowNode.parent) !== null && _a !== void 0 ? _a : '');
        var aggregationResult = (_c = (_b = (0, gridAggregationSelectors_1.gridAggregationLookupSelector)(apiRef)) === null || _b === void 0 ? void 0 : _b[groupId]) === null || _c === void 0 ? void 0 : _c[field];
        if (!aggregationResult || aggregationResult.position !== cellAggregationPosition) {
            return null;
        }
        return aggregationResult;
    };
    var didWrapSomeProperty = false;
    var wrappedColumn = __assign(__assign({}, column), { aggregationWrappedProperties: [] });
    var wrapColumnProperty = function (property, wrapper) {
        var originalValue = column[property];
        var wrappedProperty = wrapper({
            apiRef: apiRef,
            value: originalValue,
            colDef: column,
            aggregationRule: aggregationRule,
            getCellAggregationResult: getCellAggregationResult,
        });
        if (wrappedProperty !== originalValue) {
            didWrapSomeProperty = true;
            wrappedColumn[property] = wrappedProperty;
            wrappedColumn.aggregationWrappedProperties.push({
                name: property,
                originalValue: originalValue,
                wrappedValue: wrappedProperty,
            });
        }
    };
    wrapColumnProperty('renderCell', getAggregationValueWrappedRenderCell);
    wrapColumnProperty('renderHeader', getWrappedRenderHeader);
    if (!didWrapSomeProperty) {
        return column;
    }
    return wrappedColumn;
};
exports.wrapColumnWithAggregationValue = wrapColumnWithAggregationValue;
var isColumnWrappedWithAggregation = function (column) {
    return (typeof column.aggregationWrappedProperties !==
        'undefined');
};
/**
 * Remove the aggregation wrappers around the wrappable properties of the column.
 */
var unwrapColumnFromAggregation = function (column) {
    if (!isColumnWrappedWithAggregation(column)) {
        return column;
    }
    var _a = column, aggregationWrappedProperties = _a.aggregationWrappedProperties, unwrappedColumn = __rest(_a, ["aggregationWrappedProperties"]);
    aggregationWrappedProperties.forEach(function (_a) {
        var name = _a.name, originalValue = _a.originalValue, wrappedValue = _a.wrappedValue;
        // The value changed since we wrapped it
        if (wrappedValue !== unwrappedColumn[name]) {
            return;
        }
        unwrappedColumn[name] = originalValue;
    });
    return unwrappedColumn;
};
exports.unwrapColumnFromAggregation = unwrapColumnFromAggregation;
