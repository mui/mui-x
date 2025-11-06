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
exports.GRID_SINGLE_SELECT_COL_DEF = void 0;
var gridStringColDef_1 = require("./gridStringColDef");
var GridEditSingleSelectCell_1 = require("../components/cell/GridEditSingleSelectCell");
var gridSingleSelectOperators_1 = require("./gridSingleSelectOperators");
var filterPanelUtils_1 = require("../components/panel/filterPanel/filterPanelUtils");
var utils_1 = require("../utils/utils");
var gridPropsSelectors_1 = require("../hooks/core/gridPropsSelectors");
var isArrayOfObjects = function (options) {
    return typeof options[0] === 'object';
};
var defaultGetOptionValue = function (value) {
    return (0, utils_1.isObject)(value) ? value.value : value;
};
var defaultGetOptionLabel = function (value) {
    return (0, utils_1.isObject)(value) ? value.label : String(value);
};
exports.GRID_SINGLE_SELECT_COL_DEF = __assign(__assign({}, gridStringColDef_1.GRID_STRING_COL_DEF), { type: 'singleSelect', getOptionLabel: defaultGetOptionLabel, getOptionValue: defaultGetOptionValue, valueFormatter: function (value, row, colDef, apiRef) {
        var rowId = (0, gridPropsSelectors_1.gridRowIdSelector)(apiRef, row);
        if (!(0, filterPanelUtils_1.isSingleSelectColDef)(colDef)) {
            return '';
        }
        var valueOptions = (0, filterPanelUtils_1.getValueOptions)(colDef, { id: rowId, row: row });
        if (value == null) {
            return '';
        }
        if (!valueOptions) {
            return value;
        }
        if (!isArrayOfObjects(valueOptions)) {
            return colDef.getOptionLabel(value);
        }
        var valueOption = valueOptions.find(function (option) { return colDef.getOptionValue(option) === value; });
        return valueOption ? colDef.getOptionLabel(valueOption) : '';
    }, renderEditCell: GridEditSingleSelectCell_1.renderEditSingleSelectCell, filterOperators: (0, gridSingleSelectOperators_1.getGridSingleSelectOperators)(), 
    // @ts-ignore
    pastedValueParser: function (value, row, column) {
        var colDef = column;
        var valueOptions = (0, filterPanelUtils_1.getValueOptions)(colDef) || [];
        var getOptionValue = colDef.getOptionValue;
        var valueOption = valueOptions.find(function (option) {
            if (getOptionValue(option) === value) {
                return true;
            }
            return false;
        });
        if (valueOption) {
            return value;
        }
        // do not paste the value if it is not in the valueOptions
        return undefined;
    } });
